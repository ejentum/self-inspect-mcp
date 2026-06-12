// Cross-language parity: the Python port must return EXACTLY what the JS selector
// returns, for every fixture, every CSV question used as a thought, and a battery
// of edge cases (unicode, emoji/astral, empty, punctuation-only). This is the test
// that makes dist/self_inspect.py the same tool rather than a fork.
//
// Skips (with a visible message) if no Python interpreter is on PATH.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCSV } from "../src/csv.js";
import { select } from "../src/selector.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const pyFile = join(root, "dist", "self_inspect.py");

function findPython() {
  for (const cmd of ["python3", "python", "py"]) {
    const probe = spawnSync(cmd, ["--version"], { encoding: "utf8" });
    if (probe.status === 0) return cmd;
  }
  return null;
}

// One python process for the whole corpus: load the module, read thoughts as JSON
// on stdin, emit select() results as JSON on stdout.
// stdin/stdout go through raw buffers with explicit UTF-8: on Windows, Python
// otherwise decodes pipes with the locale codepage (cp1252) and mangles unicode.
// json.dumps stays ensure_ascii (pure-ASCII out), so stdout is codepage-proof.
const DRIVER = `
import json, sys, importlib.util
spec = importlib.util.spec_from_file_location("self_inspect", sys.argv[1])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
thoughts = json.loads(sys.stdin.buffer.read().decode("utf-8"))
sys.stdout.write(json.dumps([mod.select(t) for t in thoughts]))
`;

const python = findPython();

test("dist/self_inspect.py matches the JS selector on the full corpus", { skip: python ? false : "no python interpreter on PATH" }, () => {
  const rows = parseCSV(readFileSync(join(root, "selfinspect.csv"), "utf8"));
  const fixtures = JSON.parse(readFileSync(join(root, "fixtures", "cases.json"), "utf8"));

  const corpus = [
    ...fixtures.map((f) => f.thought),
    // Every question in the CSV, fed back in as a thought (broad routed coverage).
    ...rows.map((r) => r.meta_thought),
    // Edge cases: default-path hashing, unicode fold, UTF-16 units, emptiness.
    "",
    "   ",
    "order a pizza",
    "zzz qqq xxx",
    "café déjà vu naïve résumé",
    "Ich prüfe gerade meine Annahmen über die Datenbank",
    "我正在检查我的假设",
    "🚀 deploying to production right now 🚀",
    "𝒜 𝒷 𝒸 mathematical script letters",
    "ASSUMPTION!!! ... ;;; ???",
    "12345 67890",
    "a".repeat(2000),
    "I am about to assert the default timeout is 30s from memory",
  ];

  const js = corpus.map((t) => select(t, rows));

  const run = spawnSync(python, ["-c", DRIVER, pyFile], {
    input: JSON.stringify(corpus),
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  assert.equal(run.status, 0, "python driver failed: " + (run.stderr || "").slice(0, 500));
  const py = JSON.parse(run.stdout);

  assert.equal(py.length, js.length, "result count mismatch");
  for (let i = 0; i < js.length; i++) {
    assert.deepEqual(
      py[i],
      js[i],
      `parity break at corpus[${i}]: ${JSON.stringify(corpus[i].slice(0, 80))}\n  js: ${JSON.stringify(js[i])}\n  py: ${JSON.stringify(py[i])}`,
    );
  }
});
