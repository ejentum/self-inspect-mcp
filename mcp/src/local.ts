// Offline mode: run the published heuristic on the user's machine with zero
// network. Imports the vendored core (copied from the canonical repo by
// scripts/vendor.mjs) so it is byte-for-byte the same selector and CSV the hosted
// endpoint runs. Enabled with SELF_INSPECT_LOCAL=1.

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import type { SelfInspectResult } from "./client.js";

let rows: unknown[] | null = null;
let selectFn: ((thought: string, rows: unknown[]) => unknown) | null = null;

async function ensureLoaded(): Promise<void> {
  if (rows && selectFn) return;
  const here = dirname(fileURLToPath(import.meta.url));
  const vendor = join(here, "..", "vendor");
  // Runtime dynamic import of the vendored plain-JS core (untyped on purpose).
  const selectorUrl = pathToFileURL(join(vendor, "selector.js")).href;
  const csvUrl = pathToFileURL(join(vendor, "csv.js")).href;
  const selectorMod: { select: (s: string, r: unknown[]) => unknown } =
    await import(selectorUrl);
  const csvMod: { parseCSV: (t: string) => unknown[] } = await import(csvUrl);
  selectFn = selectorMod.select;
  rows = csvMod.parseCSV(readFileSync(join(vendor, "selfinspect.csv"), "utf8"));
}

export async function selectLocal(
  thought: string,
): Promise<SelfInspectResult> {
  await ensureLoaded();
  const picked = selectFn!(thought, rows!) as {
    id: string;
    metathought: string;
    matched: boolean;
  } | null;
  return picked
    ? { metathought: picked.metathought, matched: picked.matched, id: picked.id }
    : { metathought: null, matched: false };
}
