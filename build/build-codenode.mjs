// Writes the generated code node to dist/code-node.js. Run via `npm run build`.
// Keep this thin: all logic lives in generate.mjs so the drift test can import
// generate() with no side effects.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generate, generateBackendCjs } from "./generate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

const codeNode = join(dist, "code-node.js");
writeFileSync(codeNode, generate());
process.stdout.write("Wrote " + codeNode + "\n");

const backendCjs = join(dist, "backend.cjs");
writeFileSync(backendCjs, generateBackendCjs());
process.stdout.write("Wrote " + backendCjs + "\n");
