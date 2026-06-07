// Reproduces the headline conversation-eval result: with Self-Inspect, agents surface
// markedly more decision-forks (assumptions, edge cases, preconditions) than the identical
// no-tool baseline. Reads the four logged conversations in ../data/conversation/.
//
// Usage:  node evals/tools/analyze.mjs
//
// Each line of a conversation .jsonl is one turn:
//   { turn, user, thought, [metathought], reply }
// Tool runs include `metathought` (the question returned by the live endpoint that turn);
// raw runs omit it (no tool was called).

import fs from "node:fs";

const DATA = new URL("../data/conversation/", import.meta.url);
const FILES = {
  "tool A": "tool_agent_a.jsonl",
  "tool B": "tool_agent_b.jsonl",
  "raw  A": "raw_agent_a.jsonl",
  "raw  B": "raw_agent_b.jsonl",
};

// A turn "surfaces a fork" if the reply raises an assumption / precondition / edge case / risk.
const FORK = /\b(flag|note that|however|caution|risk|careful|recommend|push back|worth (flag|not)|precondition|assum|before (i|we)|edge case|gotcha|footgun|won.t|doesn.t|can.t|breaks|conflict|contradict|overrid|underspecif|missing|i.d (suggest|recommend|push)|one (thing|note|heads)|caveat)\b/i;

const load = (f) => fs.readFileSync(new URL(f, DATA), "utf8").split("\n").filter(Boolean)
  .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

console.log("Fork-surfacing per agent (turns that raise an assumption / edge case / precondition):\n");
const tool = [], raw = [];
for (const [label, file] of Object.entries(FILES)) {
  const rows = load(file);
  const forks = rows.filter((r) => FORK.test(String(r.reply || "")));
  (label.startsWith("tool") ? tool : raw).push(forks.length);
  let strip = "";
  for (let t = 1; t <= 30; t++) { const r = rows.find((x) => x.turn === t); strip += r && FORK.test(String(r.reply || "")) ? "#" : "."; }
  console.log(`  ${label}: ${String(forks.length).padStart(2)}/30   ${strip}`);
}
const avg = (a) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1);
console.log(`\n  tool avg ${avg(tool)}/30   vs   raw avg ${avg(raw)}/30   (~${(avg(tool) / avg(raw)).toFixed(1)}x)`);

console.log("\nTool-run metathought census (turn -> question returned by the live endpoint):");
for (const [label, file] of Object.entries(FILES)) {
  if (!label.startsWith("tool")) continue;
  console.log(`\n  [${label}]`);
  for (const r of load(file)) console.log(`   t${String(r.turn).padStart(2)}: ${r.metathought || "(none)"}`);
}
