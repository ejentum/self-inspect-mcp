// Reference Express integration for self-hosting Self-Inspect.
//
// This is the exact wrapper that runs the public endpoints at
// api.ejentum.com/self-inspect (REST) and /self-inspect-mcp (MCP-over-HTTP).
// It is keyless and contains no secrets. The engine is the generated
// CommonJS module dist/backend.cjs (regenerate with `npm run build`); copy it
// next to your server or require it from this repo.
//
// Mount it BEFORE any auth/CORS/JSON middleware so it stays keyless and
// isolated. In your server.js, two lines:
//
//     const { mountSelfInspect } = require('./routes/self-inspect');
//     mountSelfInspect(app);   // before app.use(cors()), helmet(), express.json(), etc.
//
// Deps: express, helmet, express-rate-limit, @modelcontextprotocol/sdk, zod.

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');

const { selfInspect } = require('../dist/backend.cjs');

const FALLBACK = 'What is assumed?';

const TOOL_DESCRIPTION =
    'Self-Inspect. Express a thought, or describe the task you are working on, and you always get back ONE metathought: a short abstract question that makes you inspect your own task and assumptions before continuing. There is no failure case: it always returns a metathought, selected by a transparent heuristic over an open CSV (no LLM). Keyless and free. Absorb the question and act on it; do not echo it verbatim to the user.';

const thoughtSchema = {
    thought: z
        .string()
        .min(1, 'thought must be a non-empty string')
        .describe(
            'A free-text thought, or a description of the task you are working on.',
        ),
};

function scopedHelmet() {
    return helmet({
        contentSecurityPolicy: false,
        frameguard: { action: 'deny' },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        noSniff: true,
    });
}

function ipLimiter(max) {
    return rateLimit({
        windowMs: 60 * 1000,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Rate limit exceeded' },
    });
}

// REST: returns [{ label, metathought }]
function restHandler(req, res) {
    const thought =
        req.body && typeof req.body.thought === 'string' ? req.body.thought : '';
    if (!thought) {
        return res.status(400).json({ error: 'Provide a non-empty "thought" string.' });
    }
    res.json([selfInspect(thought)]);
}

// MCP-over-HTTP: tool self_inspect, returns the metathought text only.
function buildSelfInspectServer() {
    const server = new McpServer({ name: 'self-inspect', version: '0.1.0' });
    server.tool('self_inspect', TOOL_DESCRIPTION, thoughtSchema, async ({ thought }) => {
        const result = selfInspect(thought);
        const text = result.metathought ? result.metathought : FALLBACK;
        return { content: [{ type: 'text', text }] };
    });
    return server;
}

async function mcpHandler(req, res) {
    const server = buildSelfInspectServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
        transport.close().catch(() => {});
        server.close().catch(() => {});
    });
    try {
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: { code: -32603, message: 'Internal error' },
                id: req.body && req.body.id !== undefined ? req.body.id : null,
            });
        }
    }
}

// Middleware is bound inline per exact route so the REST limiter does not
// prefix-match the MCP path.
function mountSelfInspect(app) {
    const helmetMw = scopedHelmet();
    const restJson = express.json({ limit: '16kb' });
    const mcpJson = express.json({ limit: '1mb' });

    app.post('/self-inspect', helmetMw, ipLimiter(120), restJson, restHandler);

    app.post('/self-inspect-mcp', helmetMw, ipLimiter(60), mcpJson, mcpHandler);
    app.get('/self-inspect-mcp', helmetMw, ipLimiter(60), mcpHandler);
    app.delete('/self-inspect-mcp', helmetMw, ipLimiter(60), mcpHandler);
}

module.exports = { mountSelfInspect };
