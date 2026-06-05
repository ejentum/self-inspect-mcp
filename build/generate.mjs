// Generates the self-contained n8n Code node body from the canonical sources:
//   selfinspect.csv  +  src/normalize.js  +  src/selector.js
//
// The deployed n8n Code node MUST be exactly this output (the drift test enforces
// it). The code node cannot npm-import, so we inline the literal source of the
// normalize + selector modules (module syntax stripped) plus the CSV rows as a
// JSON literal. Because we read the real src files, the deployed logic is the
// published logic, mechanically. There is no second copy to drift.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCSV } from "../src/csv.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function stripModuleSyntax(src) {
  return src
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n")
    .replace(/^\s*export\s+/gm, "")
    .trim();
}

export function generate() {
  const normalizeSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "normalize.js"), "utf8"),
  );
  const selectorSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "selector.js"), "utf8"),
  );
  const rows = parseCSV(readFileSync(join(root, "selfinspect.csv"), "utf8"));
  const rowsJson = JSON.stringify(rows, null, 2);

  return [
    "// GENERATED FILE - DO NOT EDIT.",
    "// Source of truth: selfinspect.csv + src/normalize.js + src/selector.js",
    "// Regenerate: npm run build   (the drift test asserts this equals the deployed n8n code node)",
    "",
    "const ROWS = " + rowsJson + ";",
    "",
    normalizeSrc,
    "",
    selectorSrc,
    "",
    "// --- n8n Code node entry (mode: Run Once for All Items) ---",
    "const body = ($input.first().json && $input.first().json.body) || {};",
    'const situation = typeof body.situation === "string" ? body.situation : "";',
    "const picked = select(situation, ROWS);",
    "return [",
    "  {",
    "    json: picked",
    "      ? { label: picked.input_type, metathought: picked.metathought }",
    "      : { label: null, metathought: null },",
    "  },",
    "];",
    "",
  ].join("\n");
}

// CommonJS build of the same engine, for hosts that require() rather than import
// (the Ejentum Express backend is CommonJS). Inlines the CSV rows + the literal
// normalize + selector source, exports selfInspect(situation). Drift-tested
// against the committed dist/backend.cjs exactly like the n8n code node, so the
// backend runs the published logic with no hand-maintained second copy.
export function generateBackendCjs() {
  const normalizeSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "normalize.js"), "utf8"),
  );
  const selectorSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "selector.js"), "utf8"),
  );
  const rows = parseCSV(readFileSync(join(root, "selfinspect.csv"), "utf8"));
  const rowsJson = JSON.stringify(rows, null, 2);

  return [
    "// GENERATED FILE - DO NOT EDIT.",
    "// Source of truth: selfinspect.csv + src/normalize.js + src/selector.js",
    "// Regenerate: npm run build   (the drift test asserts this equals the deployed backend module)",
    '"use strict";',
    "",
    "const ROWS = " + rowsJson + ";",
    "",
    normalizeSrc,
    "",
    selectorSrc,
    "",
    "function selfInspect(situation) {",
    "  const picked = select(situation, ROWS);",
    "  return picked",
    "    ? { label: picked.input_type, metathought: picked.metathought }",
    "    : { label: null, metathought: null };",
    "}",
    "",
    "module.exports = { selfInspect, select, ROWS };",
    "",
  ].join("\n");
}
