// Generates the self-contained deploy artifacts from the canonical sources:
//   selfinspect.csv  +  src/normalize.js  +  src/selector.js
//
// Two outputs, both drift-tested against the committed dist/ copies:
//   - dist/backend.cjs       CommonJS engine for the Express backend (JS inlined verbatim)
//   - dist/self_inspect.py   single-file, zero-dependency Python port (CSV inlined)
//
// The deployed engines MUST be exactly this output. The CSV rows are inlined as a
// JSON literal, so the data can never drift; the Python LOGIC is a faithful port
// that lives only here (single copy) and is held identical to the JS selector by
// test/parity.python.test.mjs (byte-identical results over fixtures + the full CSV
// + edge cases). There is no hand-maintained second copy anywhere.

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

// Single-file, zero-dependency Python port. The CSV rows are inlined as a JSON
// literal (every value is a string, so the JSON is also a valid Python literal).
// The logic is a faithful port of src/normalize.js + src/selector.js; the parity
// test holds it byte-identical to the JS selector. Porting notes that matter:
//   - JS /[^\p{L}\p{N}]+/gu has no stdlib-`re` equivalent; we keep a char iff
//     unicodedata.category(ch) starts with "L" or "N" (same definition).
//   - JS hashCode iterates UTF-16 CODE UNITS (charCodeAt); Python strings are
//     code points, so we encode utf-16-le and walk 2-byte units to match exactly.
//   - parseInt(x, 10) semantics are mimicked with a leading-int regex.
export function generatePython() {
  const rows = parseCSV(readFileSync(join(root, "selfinspect.csv"), "utf8"));
  const rowsJson = JSON.stringify(rows, null, 2);

  const head = [
    '"""Self-Inspect: single-file, zero-dependency Python port. GENERATED - DO NOT EDIT.',
    "",
    "Source of truth: selfinspect.csv + src/normalize.js + src/selector.js",
    "Regenerate: npm run build   (drift + JS<->Python parity tests enforce equivalence)",
    "",
    "Usage:",
    "  from self_inspect import self_inspect, select",
    "  self_inspect('I am about to assert the default timeout is 30s from memory')",
    "  # -> {'label': ..., 'metathought': ...}",
    "",
    "CLI:",
    '  python self_inspect.py "<your thought>"   # prints [{"label", "metathought"}]',
    '"""',
    "",
    "import json",
    "import re",
    "import sys",
    "import unicodedata",
    "",
    "ROWS = " + rowsJson,
    "",
  ].join("\n");

  const body = String.raw`W_TYPE = 3
W_CONTENT = 1

# Universal self-inspection questions (see src/selector.js DEFAULT_IDS).
DEFAULT_IDS = [
    "assumption-1",
    "completeness-1",
    "confidence-4",
    "inference-3",
    "boundary-2",
    "verification-1",
    "scope-3",
    "goal-1",
]

STOPWORDS = {
    "what", "is", "the", "a", "an", "this", "that", "of", "to", "be", "being",
    "does", "do", "did", "are", "was", "were", "why", "how", "when", "where",
    "which", "it", "its", "in", "on", "for", "and", "or", "with", "as", "by",
    "has", "have", "had", "would", "should", "could", "will", "despite", "but",
    "from", "into", "too", "soon", "here", "there", "not", "no", "yet", "still",
    "than", "then", "so", "if", "about", "at", "now",
}

_TYPE_SPLIT = re.compile(r"[_\-\s]+")
_INT_PREFIX = re.compile(r"^[+-]?\d+")


def normalize(value):
    """Port of src/normalize.js: NFKC-fold, lowercase, non-letter/number runs to
    single spaces, collapsed, wrapped in single leading/trailing spaces."""
    if value is None:
        return "  "
    folded = unicodedata.normalize("NFKC", str(value)).lower()
    kept = []
    for ch in folded:
        kept.append(ch if unicodedata.category(ch)[0] in ("L", "N") else " ")
    tokens = " ".join("".join(kept).split())
    return " " + tokens + " "


def _words(value):
    return [w for w in normalize(value).strip().split(" ") if w]


def _type_tokens(input_type):
    return [t.strip().lower() for t in _TYPE_SPLIT.split(str(input_type)) if t.strip()]


def _content_tokens(meta_thought):
    return [w for w in _words(meta_thought) if len(w) > 2 and w not in STOPWORDS]


def _is_strict(group):
    return 1 if group and group[0].get("runtime_tier") == "strict" else 0


def _parse_rank(value):
    m = _INT_PREFIX.match(str(value).strip())
    return int(m.group(0)) if m else None


def _hash_code(value):
    """Port of the JS hashCode: iterates UTF-16 code units, 32-bit unsigned."""
    h = 0
    data = value.encode("utf-16-le")
    for i in range(0, len(data), 2):
        unit = data[i] | (data[i + 1] << 8)
        h = (h * 31 + unit) & 0xFFFFFFFF
    return h


def _row_to_result(row, matched):
    rank = _parse_rank(row.get("operator_rank"))
    return {
        "id": str(row.get("input_type")) + "-" + str(row.get("operator_rank")),
        "metathought": row.get("meta_thought"),
        "input_type": row.get("input_type"),
        "operator_rank": rank,
        "runtime_tier": row.get("runtime_tier"),
        "matched": matched,
    }


def _default_result(thought, rows):
    idx = _hash_code(normalize(thought)) % len(DEFAULT_IDS)
    target = DEFAULT_IDS[idx]
    row = next(
        (r for r in rows
         if str(r.get("input_type")) + "-" + str(r.get("operator_rank")) == target),
        rows[0],
    )
    return _row_to_result(row, False)


def select(thought, rows=None):
    """Port of src/selector.js select(). Same input -> same output as the JS engine."""
    if rows is None:
        rows = ROWS
    if not rows:
        return None
    hay = set(_words(thought))

    groups = {}
    for row in rows:
        groups.setdefault(row.get("input_type"), []).append(row)

    scored = []
    for lens_type, group in groups.items():
        name_hits = sum(1 for t in _type_tokens(lens_type) if t in hay)
        content = set()
        for row in group:
            for t in _content_tokens(row.get("meta_thought")):
                if t in hay:
                    content.add(t)
        score = name_hits * W_TYPE + len(content) * W_CONTENT
        if score <= 0:
            continue
        scored.append({"type": lens_type, "group": group, "score": score})

    if not scored:
        return _default_result(thought, rows)

    scored.sort(key=lambda e: (-e["score"], -_is_strict(e["group"]), e["type"]))
    chosen = scored[0]

    best = None
    for row in chosen["group"]:
        local = sum(1 for t in _content_tokens(row.get("meta_thought")) if t in hay)
        rank = _parse_rank(row.get("operator_rank"))
        candidate = {"row": row, "local": local, "rank": rank if rank is not None else 99}
        if (
            best is None
            or candidate["local"] > best["local"]
            or (candidate["local"] == best["local"] and candidate["rank"] < best["rank"])
        ):
            best = candidate

    return _row_to_result(best["row"], True)


def self_inspect(thought):
    """One thought in, one metathought out (the REST/MCP contract shape)."""
    picked = select(thought)
    if picked is None:
        return {"label": None, "metathought": None}
    return {"label": picked["input_type"], "metathought": picked["metathought"]}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw = " ".join(sys.argv[1:])
    else:
        # Read bytes and decode UTF-8 explicitly: Windows pipes otherwise decode
        # with the locale codepage and mangle non-ASCII thoughts.
        raw = sys.stdin.buffer.read().decode("utf-8")
    result = self_inspect(raw)
    print(json.dumps([result]))
`;

  return head + "\n" + body;
}
