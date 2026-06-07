// Writes the generated backend module to dist/backend.cjs. Run via `npm run build`.
// Keep this thin: all logic lives in generate.mjs so the drift test can import
// generateBackendCjs() with no side effects.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateBackendCjs } from "./generate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

const backendCjs = join(dist, "backend.cjs");
writeFileSync(backendCjs, generateBackendCjs());
process.stdout.write("Wrote " + backendCjs + "\n");
