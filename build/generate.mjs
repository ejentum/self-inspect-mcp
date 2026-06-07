// Generates the self-contained CommonJS backend module from the canonical sources:
//   selfinspect.csv  +  src/normalize.js  +  src/selector.js
//
// The deployed backend MUST be exactly this output (the drift test enforces it).
// Because we read the real src files and inline them (module syntax stripped) plus
// the CSV rows as a JSON literal, the deployed logic IS the published logic,
// mechanically. There is no second copy to drift.

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

// CommonJS build of the engine, for the Ejentum Express backend (which require()s
// rather than imports). Inlines the CSV rows + the literal normalize + selector
// source and exports selfInspect(thought). Drift-tested against the committed
// dist/backend.cjs, so the backend runs the published logic with no hand-maintained
// second copy.
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
    "function selfInspect(thought) {",
    "  const picked = select(thought, ROWS);",
    "  return picked",
    "    ? { label: picked.input_type, metathought: picked.metathought }",
    "    : { label: null, metathought: null };",
    "}",
    "",
    "module.exports = { selfInspect, select, ROWS };",
    "",
  ].join("\n");
}
