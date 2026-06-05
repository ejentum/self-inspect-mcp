import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCSV } from "../src/csv.js";
import { select } from "../src/selector.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const rows = parseCSV(readFileSync(join(root, "selfinspect.csv"), "utf8"));
const cases = JSON.parse(
  readFileSync(join(root, "fixtures", "cases.json"), "utf8"),
);

test("CSV parses into rows with the expected columns", () => {
  assert.ok(rows.length >= 1, "expected at least one row");
  for (const r of rows) {
    assert.ok(r.input_type, "row missing input_type");
    assert.ok(r.operator_rank, "row missing operator_rank");
    assert.ok(r.runtime_tier, "row missing runtime_tier");
    assert.ok(typeof r.meta_thought === "string", "row missing meta_thought");
  }
});

test("Self-Inspect ALWAYS returns a non-empty metathought (never null)", () => {
  const inputs = [
    ...cases.map((c) => c.thought),
    "",
    "asdfghjkl qwerty zxcvbnm",
    "x",
    "deploy the service and update the changelog",
  ];
  for (const s of inputs) {
    const res = select(s, rows);
    assert.ok(res, `null returned for: "${s}"`);
    assert.ok(
      typeof res.metathought === "string" && res.metathought.length > 0,
      `empty metathought for: "${s}"`,
    );
  }
});

test("routed fixtures hit their expected lens (matched: true)", () => {
  for (const c of cases) {
    if (!c.expect_id) continue;
    const res = select(c.thought, rows);
    assert.equal(res.id, c.expect_id, `thought: ${c.thought}`);
    assert.equal(res.matched, true, `thought: ${c.thought}`);
  }
});

test("unroutable input falls back to a universal default (matched: false, still a metathought)", () => {
  for (const c of cases) {
    if (c.expect_matched !== false) continue;
    const res = select(c.thought, rows);
    assert.equal(res.matched, false, `thought: ${c.thought}`);
    assert.ok(res.metathought.length > 0);
  }
});

test("routing is deterministic across repeated calls", () => {
  for (const c of cases) {
    assert.deepEqual(select(c.thought, rows), select(c.thought, rows));
  }
});

test("a matched result returns the verbatim meta_thought from its row", () => {
  const res = select("What constraint governs this decision?", rows);
  assert.ok(res && res.matched);
  const row = rows.find((r) => `${r.input_type}-${r.operator_rank}` === res.id);
  assert.ok(row, "result id should map back to a CSV row");
  assert.equal(res.metathought, row.meta_thought);
});
