import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generate, generateBackendCjs } from "../build/generate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

// The load-bearing tests: every committed deploy artifact must be byte-identical
// to what the generator produces from the current sources. If one fails, the
// published CSV/selector and that deployed engine have diverged. Fix by running
// `npm run build`, never by editing dist/ or a deployed copy by hand.
test("committed dist/code-node.js equals the generator output (no drift)", () => {
  const committed = readFileSync(join(dist, "code-node.js"), "utf8");
  assert.equal(
    generate(),
    committed,
    "dist/code-node.js is stale. Run `npm run build` and redeploy the n8n code node.",
  );
});

test("committed dist/backend.cjs equals the generator output (no drift)", () => {
  const committed = readFileSync(join(dist, "backend.cjs"), "utf8");
  assert.equal(
    generateBackendCjs(),
    committed,
    "dist/backend.cjs is stale. Run `npm run build`, copy it to the backend, and redeploy.",
  );
});
