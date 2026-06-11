# self-inspect-mcp — LLM install instructions

This file is read by LLM-driven MCP installers (e.g. [Cline](https://github.com/cline/cline)) to configure the self-inspect-mcp server automatically. Follow exactly.

## What this server is

`self-inspect-mcp` exposes one tool, `self_inspect`. The agent passes a one or two sentence description of what it is doing; the tool returns one short, abstract question (a metathought) that makes the agent inspect its own assumptions before continuing. Keyless, free, deterministic, no LLM.

## Prerequisite

None. No API key, no account, no sign-up. Node.js 18+ is needed only for the stdio option.

## Configuration: two transport options

Pick ONE. Stdio is the default for Cline.

### Option A — Stdio (default, recommended for Cline)

```json
{
  "mcpServers": {
    "self-inspect": {
      "command": "npx",
      "args": ["-y", "self-inspect-mcp"]
    }
  }
}
```

Requires Node.js 18+ on the user's machine; the installer spawns the server as a subprocess on demand. To run fully offline against the bundled CSV, add `"env": { "SELF_INSPECT_LOCAL": "1" }`.

### Option B — Hosted HTTPS (no local install)

```json
{
  "mcpServers": {
    "self-inspect": {
      "url": "https://api.ejentum.com/self-inspect-mcp",
      "transport": "streamable-http"
    }
  }
}
```

No npm install, no subprocess, no key. Pick this if the user does not have Node.js.

## Post-install verification

After reloading MCP servers, confirm the `self_inspect` tool registered. Smoke test:

> "Use the `self_inspect` tool with the thought: 'I am about to assert the default timeout is 30s from memory.'"

The model should call `self_inspect` and receive one metathought (a short question) to consider. There is no auth, so there is no auth-error path.

## Routing notes for the calling LLM

Call `self_inspect` at decision points: after forming a hypothesis before acting on it, before committing to a plan or final answer, at each step of a long chain to catch drift, or when the agent notices it is agreeing or feeling certain. Do NOT call for simple lookups, syntax questions, or file reads. It always returns a question; absorb it and continue, do not echo it back to the user.

## Troubleshooting

- **`npx` command not found:** Node.js is not installed. Install Node 18+ from https://nodejs.org, then retry. Or switch to Option B (hosted HTTPS), which has no local-runtime requirement.
- **Server starts but the tool does not appear:** the `mcpServers` block must be at the root of the installer's MCP config file (e.g. `cline_mcp_settings.json`), not nested under another key. Reload after editing.
