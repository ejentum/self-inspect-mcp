#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { callSelfInspect } from "./client.js";

const FALLBACK =
  "What is assumed?";

const useLocal =
  process.env.SELF_INSPECT_LOCAL === "1" ||
  process.env.SELF_INSPECT_LOCAL === "true";

const DESCRIPTION =
  "Self-Inspect. Express a thought, or describe the task you are working on, and you always get back ONE metathought: a short abstract question that makes you inspect your own task and assumptions before continuing. Use it whenever you want a self-check: after forming a hypothesis, before committing to an answer, when a long chain feels like it has drifted, when you notice you are agreeing to please, or when you are about to assert something from memory. There is no failure case: it always returns a metathought to question yourself with, selected by a transparent heuristic over an open CSV (no LLM). Keyless and free. DO NOT call for factual lookups or as a substitute for doing the task. Absorb the question and act on it; do not echo it verbatim to the user.";

const server = new McpServer({ name: "self-inspect", version: "0.1.0" });

server.tool(
  "self_inspect",
  DESCRIPTION,
  {
    situation: z
      .string()
      .min(1, "situation must be a non-empty string")
      .describe(
        "A free-text thought or a description of the task you are working on. Express what you are doing or thinking; the more concrete, the sharper the returned question. Example: 'I'm about to assert the default timeout is 30s from memory'.",
      ),
  },
  async ({ situation }: { situation: string }) => {
    try {
      const result = useLocal
        ? await (await import("./local.js")).selectLocal(situation)
        : await callSelfInspect(situation);
      // Self-Inspect always returns a metathought; FALLBACK only guards an
      // unexpected empty response (e.g. a network surface returning nothing).
      const text = result.metathought ? result.metathought : FALLBACK;
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [
          { type: "text" as const, text: `Self-Inspect error: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio is the JSON-RPC channel; never write logs to stdout. Diagnostics -> stderr.
}

main().catch((err) => {
  const detail = err instanceof Error ? err.stack || err.message : String(err);
  process.stderr.write(`Fatal error starting self-inspect-mcp: ${detail}\n`);
  process.exit(1);
});
