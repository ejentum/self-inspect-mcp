// Writes the generated deploy artifacts to dist/. Run via `npm run build`.
// Keep this thin: all logic lives in generate.mjs so the drift test can import
// the generators with no side effects.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateBackendCjs, generatePython } from "./generate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

const backendCjs = join(dist, "backend.cjs");
writeFileSync(backendCjs, generateBackendCjs());
process.stdout.write("Wrote " + backendCjs + "\n");

const pyFile = join(dist, "self_inspect.py");
writeFileSync(pyFile, generatePython());
process.stdout.write("Wrote " + pyFile + "\n");
