# self-inspect-mcp

MCP server exposing one tool, `self_inspect`. The agent passes a one or two sentence description of what it is doing; the tool returns a single self-inspection metathought (a concrete self-check) or a no-match note. Keyless and free.

By default it calls the public endpoint `https://api.ejentum.com/self-inspect`. It can also run the exact same published heuristic fully offline.

## Install (stdio)

```sh
npx -y self-inspect-mcp
```

### Claude Desktop / Claude Code / Cursor / Windsurf config

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

No API key. No `env` block required.

## The tool

`self_inspect({ situation: string })` -> one metathought, or a no-match note.

Pass what you are *doing*, not the topic. Good: `"I'm about to assert the default timeout is 30s from memory"`. Returns the matched metathought text to absorb and act on.

## Configuration

| env var | effect |
|---|---|
| `SELF_INSPECT_LOCAL=1` | Run the vendored selector + CSV locally. No network. The selection is identical to the hosted endpoint because the core is copied, unmodified, from the canonical repo (`scripts/vendor.mjs`). |
| `SELF_INSPECT_API_URL` | Override the hosted endpoint URL (self-hosting / testing). |

## Auditability

The selector and the CSV that drive every answer are published in the parent repo and vendored here under `vendor/`. There is no hidden model and no scoring you cannot read. Run `SELF_INSPECT_LOCAL=1` to confirm the offline answer matches what the endpoint returns.

## License

MIT.
