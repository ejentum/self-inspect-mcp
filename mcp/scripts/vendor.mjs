// Copies the canonical core (the published heuristic + CSV) into mcp/vendor/ so
// the MCP package is self-contained AND its offline mode runs the exact same
// selector + data as the hosted endpoint. The root repo stays the single source
// of truth; this is a mechanical copy, never a hand-maintained second version.

import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url)); // mcp/scripts
const mcpRoot = join(here, "..");                     // mcp
const repoRoot = join(mcpRoot, "..");                 // self-inspect
const vendor = join(mcpRoot, "vendor");

mkdirSync(vendor, { recursive: true });

const coreFiles = ["src/normalize.js", "src/csv.js", "src/selector.js"];
for (const rel of coreFiles) {
  copyFileSync(join(repoRoot, rel), join(vendor, basename(rel)));
}
copyFileSync(join(repoRoot, "selfinspect.csv"), join(vendor, "selfinspect.csv"));

process.stdout.write("vendored core into " + vendor + "\n");
