import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateBackendCjs, generatePython } from "../build/generate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

// Load-bearing test: the committed deploy artifact must be byte-identical to what
// the generator produces from the current sources. If it fails, the published
// CSV/selector and the deployed engine have diverged. Fix by running `npm run
// build`, never by editing dist/ or a deployed copy by hand.
test("committed dist/backend.cjs equals the generator output (no drift)", () => {
  const committed = readFileSync(join(dist, "backend.cjs"), "utf8");
  assert.equal(
    generateBackendCjs(),
    committed,
    "dist/backend.cjs is stale. Run `npm run build`, copy it to the backend, and redeploy.",
  );
});

test("committed dist/self_inspect.py equals the generator output (no drift)", () => {
  const committed = readFileSync(join(dist, "self_inspect.py"), "utf8");
  assert.equal(
    generatePython(),
    committed,
    "dist/self_inspect.py is stale. Run `npm run build`.",
  );
});
