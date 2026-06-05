// Self-Inspect selector: pure, deterministic, heuristic. No LLM, no embeddings,
// no semantic similarity, no network, no randomness, no clock. Same input always
// yields the same output. This is the whole engine; everything else is plumbing.
//
// Philosophy: Self-Inspect ALWAYS returns a metathought. There is always a
// worthwhile question an agent can ask about its own task and assumptions, so we
// never return null. If the situation routes to a specific lens, we return that
// lens's best question (matched: true). If nothing routes, we return a universal
// self-inspection question about task and assumptions (matched: false). The
// caller always gets something to question itself with.
//
// Data (selfinspect.csv): input_type, operator_rank, runtime_tier, meta_thought.
// ~50 cognitive lenses (input_type), each with ranked reflective questions
// (operator_rank 1..n), tagged strict or booster (runtime_tier). Every column is
// used for routing.
//
// select(situation, rows) -> { id, metathought, input_type, operator_rank, runtime_tier, matched }
//
// Two-level routing:
//   1. Score each lens: 3 * (type-name tokens present) + 1 * (distinct content
//      tokens from that lens's questions present). Evidence aggregates across all
//      of a lens's questions.
//   2. If any lens has signal, pick the highest (ties prefer strict, then
//      lexicographic lens) and, within it, the question with the most local
//      content hits (tiebreak lowest operator_rank). matched: true.
//   3. If no lens has any signal, return a universal default question chosen
//      deterministically from DEFAULT_IDS by a stable hash of the situation, so
//      different inputs get different nudges. matched: false.

import { normalize } from "./normalize.js";

const W_TYPE = 3;
const W_CONTENT = 1;

// Universal self-inspection questions, leaning on task + assumptions, used when a
// situation routes to no specific lens. Every id must exist in the CSV.
const DEFAULT_IDS = [
  "assumption-1", // What is assumed?
  "completeness-1", // What is missing?
  "confidence-4", // What confidence is warranted?
  "inference-3", // What does not follow?
  "boundary-2", // When would this not hold?
  "verification-1", // What is verified?
  "scope-3", // What scope is active?
  "goal-1", // What is the goal?
];

// Pure function words stripped from meta_thoughts so routing keys on content, not
// the question scaffolding ("what is the ...?"). Kept deliberately small and visible.
const STOPWORDS = new Set([
  "what", "is", "the", "a", "an", "this", "that", "of", "to", "be", "being",
  "does", "do", "did", "are", "was", "were", "why", "how", "when", "where",
  "which", "it", "its", "in", "on", "for", "and", "or", "with", "as", "by",
  "has", "have", "had", "would", "should", "could", "will", "despite", "but",
  "from", "into", "too", "soon", "here", "there", "not", "no", "yet", "still",
  "than", "then", "so", "if", "about", "at", "now",
]);

function words(str) {
  return normalize(str).trim().split(" ").filter(Boolean);
}

function typeTokens(inputType) {
  return String(inputType)
    .split(/[_\-\s]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function contentTokens(metaThought) {
  return words(metaThought).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function isStrict(group) {
  return group.length > 0 && group[0].runtime_tier === "strict" ? 1 : 0;
}

// Stable, deterministic, dependency-free string hash (no Math.random, no clock).
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rowToResult(row, matched) {
  const rank = parseInt(row.operator_rank, 10);
  return {
    id: String(row.input_type) + "-" + String(row.operator_rank),
    metathought: row.meta_thought,
    input_type: row.input_type,
    operator_rank: Number.isFinite(rank) ? rank : null,
    runtime_tier: row.runtime_tier,
    matched,
  };
}

function defaultResult(situation, rows) {
  const idx = hashCode(normalize(situation)) % DEFAULT_IDS.length;
  const id = DEFAULT_IDS[idx];
  const row =
    rows.find((r) => String(r.input_type) + "-" + String(r.operator_rank) === id) ||
    rows[0];
  return rowToResult(row, false);
}

export function select(situation, rows) {
  if (!rows || rows.length === 0) return null;
  const hay = new Set(words(situation));

  // Group rows by lens, preserving CSV order for determinism.
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.input_type)) groups.set(row.input_type, []);
    groups.get(row.input_type).push(row);
  }

  // Level 1: score each lens. Keep any lens with positive signal.
  const scored = [];
  for (const [type, group] of groups) {
    const nameHits = typeTokens(type).filter((t) => hay.has(t)).length;
    const content = new Set();
    for (const row of group) {
      for (const t of contentTokens(row.meta_thought)) {
        if (hay.has(t)) content.add(t);
      }
    }
    const score = nameHits * W_TYPE + content.size * W_CONTENT;
    if (score <= 0) continue;
    scored.push({ type, group, score });
  }

  // No signal at all: always return a universal self-inspection question.
  if (scored.length === 0) return defaultResult(situation, rows);

  // Level 2: pick the best lens.
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      isStrict(b.group) - isStrict(a.group) ||
      (a.type < b.type ? -1 : a.type > b.type ? 1 : 0),
  );
  const chosen = scored[0];

  // Within the lens, pick the question with the most local content matches,
  // tiebreak by lowest operator_rank (the canonical question).
  let best = null;
  for (const row of chosen.group) {
    const local = contentTokens(row.meta_thought).filter((t) => hay.has(t)).length;
    const rank = parseInt(row.operator_rank, 10);
    const candidate = { row, local, rank: Number.isFinite(rank) ? rank : 99 };
    if (
      best === null ||
      candidate.local > best.local ||
      (candidate.local === best.local && candidate.rank < best.rank)
    ) {
      best = candidate;
    }
  }

  return rowToResult(best.row, true);
}
