// GENERATED FILE - DO NOT EDIT.
// Source of truth: selfinspect.csv + src/normalize.js + src/selector.js
// Regenerate: npm run build   (the drift test asserts this equals the deployed backend module)
"use strict";

const ROWS = [
  {
    "input_type": "abstraction",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is abstracted?"
  },
  {
    "input_type": "abstraction",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What detail is hidden?"
  },
  {
    "input_type": "alignment",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What alignment is active?"
  },
  {
    "input_type": "alignment",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is aligned?"
  },
  {
    "input_type": "alignment",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is misaligned?"
  },
  {
    "input_type": "assumption",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is assumed?"
  },
  {
    "input_type": "assumption",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is taken as given?"
  },
  {
    "input_type": "assumption",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What depends on being true?"
  },
  {
    "input_type": "assumption",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "Which assumption matters most?"
  },
  {
    "input_type": "assumption",
    "operator_rank": "5",
    "runtime_tier": "strict",
    "meta_thought": "What premise is implicit?"
  },
  {
    "input_type": "boundary",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What limits this conclusion?"
  },
  {
    "input_type": "boundary",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "When would this not hold?"
  },
  {
    "input_type": "boundary",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What condition changes this?"
  },
  {
    "input_type": "commitment",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is being committed to?"
  },
  {
    "input_type": "commitment",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is fixed?"
  },
  {
    "input_type": "commitment",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What remains reversible?"
  },
  {
    "input_type": "commitment",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What is premature?"
  },
  {
    "input_type": "completeness",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is missing?"
  },
  {
    "input_type": "completeness",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What has not been considered?"
  },
  {
    "input_type": "completeness",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What remains unresolved?"
  },
  {
    "input_type": "completeness",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What is incomplete?"
  },
  {
    "input_type": "confidence",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What supports confidence?"
  },
  {
    "input_type": "confidence",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "How strong is the support?"
  },
  {
    "input_type": "confidence",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "Why should this be trusted?"
  },
  {
    "input_type": "confidence",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What confidence is warranted?"
  },
  {
    "input_type": "confidence",
    "operator_rank": "5",
    "runtime_tier": "strict",
    "meta_thought": "What limits confidence?"
  },
  {
    "input_type": "consistency",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What conflicts?"
  },
  {
    "input_type": "consistency",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is inconsistent?"
  },
  {
    "input_type": "constraint",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is constrained?"
  },
  {
    "input_type": "constraint",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What must remain true?"
  },
  {
    "input_type": "constraint",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is not allowed?"
  },
  {
    "input_type": "constraint",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What constraint governs this?"
  },
  {
    "input_type": "criterion",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What criterion applies?"
  },
  {
    "input_type": "criterion",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What standard is active?"
  },
  {
    "input_type": "criterion",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is being judged by?"
  },
  {
    "input_type": "criterion",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What determines validity?"
  },
  {
    "input_type": "dependency",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What does this depend on?"
  },
  {
    "input_type": "dependency",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What depends on this?"
  },
  {
    "input_type": "dependency",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What must hold first?"
  },
  {
    "input_type": "distinction",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is being conflated?"
  },
  {
    "input_type": "distinction",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What separation matters?"
  },
  {
    "input_type": "focus",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is in focus?"
  },
  {
    "input_type": "focus",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is out of focus?"
  },
  {
    "input_type": "goal",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is the goal?"
  },
  {
    "input_type": "goal",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What remains the task?"
  },
  {
    "input_type": "granularity",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What granularity is active?"
  },
  {
    "input_type": "granularity",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What level of detail is present?"
  },
  {
    "input_type": "identity",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is this?"
  },
  {
    "input_type": "identity",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is being identified?"
  },
  {
    "input_type": "identity",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is unnamed?"
  },
  {
    "input_type": "identity",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What identity is assumed?"
  },
  {
    "input_type": "inference",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is being inferred?"
  },
  {
    "input_type": "inference",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What follows directly?"
  },
  {
    "input_type": "inference",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What does not follow?"
  },
  {
    "input_type": "inference",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What is being concluded?"
  },
  {
    "input_type": "inference",
    "operator_rank": "5",
    "runtime_tier": "strict",
    "meta_thought": "What is the inference step?"
  },
  {
    "input_type": "precision",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is underspecified?"
  },
  {
    "input_type": "precision",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What needs definition?"
  },
  {
    "input_type": "redundancy",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is redundant?"
  },
  {
    "input_type": "redundancy",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What repeats?"
  },
  {
    "input_type": "reference",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is this referring to?"
  },
  {
    "input_type": "reference",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is undefined?"
  },
  {
    "input_type": "relation",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What relation is assumed?"
  },
  {
    "input_type": "relation",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is explicitly connected?"
  },
  {
    "input_type": "relation",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What connection is implicit?"
  },
  {
    "input_type": "relevance",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is relevant?"
  },
  {
    "input_type": "relevance",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is irrelevant?"
  },
  {
    "input_type": "representation",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is not represented?"
  },
  {
    "input_type": "representation",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is explicit?"
  },
  {
    "input_type": "representation",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is implicit?"
  },
  {
    "input_type": "resolution",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is resolved?"
  },
  {
    "input_type": "salience",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What matters now?"
  },
  {
    "input_type": "salience",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is peripheral?"
  },
  {
    "input_type": "scope",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is in scope?"
  },
  {
    "input_type": "scope",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is outside scope?"
  },
  {
    "input_type": "scope",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What scope is active?"
  },
  {
    "input_type": "sequence",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What step is current?"
  },
  {
    "input_type": "sequence",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What came before this?"
  },
  {
    "input_type": "sequence",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What order is active?"
  },
  {
    "input_type": "stability",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is stable?"
  },
  {
    "input_type": "stability",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What is unstable?"
  },
  {
    "input_type": "state",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is the current state?"
  },
  {
    "input_type": "state",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What remains in state?"
  },
  {
    "input_type": "sufficiency",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is insufficient?"
  },
  {
    "input_type": "sufficiency",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What has enough support?"
  },
  {
    "input_type": "traceability",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "Where did this come from?"
  },
  {
    "input_type": "traceability",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What connects this to the state?"
  },
  {
    "input_type": "transition",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What changed?"
  },
  {
    "input_type": "transition",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What carried forward?"
  },
  {
    "input_type": "transition",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What was dropped?"
  },
  {
    "input_type": "transition",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What follows from the prior state?"
  },
  {
    "input_type": "uncertainty",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What remains uncertain?"
  },
  {
    "input_type": "uncertainty",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "Where is uncertainty concentrated?"
  },
  {
    "input_type": "uncertainty",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What is ambiguous?"
  },
  {
    "input_type": "uncertainty",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What has not been determined?"
  },
  {
    "input_type": "validity",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What validity is claimed?"
  },
  {
    "input_type": "validity",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What makes this valid?"
  },
  {
    "input_type": "verification",
    "operator_rank": "1",
    "runtime_tier": "strict",
    "meta_thought": "What is verified?"
  },
  {
    "input_type": "verification",
    "operator_rank": "2",
    "runtime_tier": "strict",
    "meta_thought": "What has been checked?"
  },
  {
    "input_type": "verification",
    "operator_rank": "3",
    "runtime_tier": "strict",
    "meta_thought": "What supports this?"
  },
  {
    "input_type": "verification",
    "operator_rank": "4",
    "runtime_tier": "strict",
    "meta_thought": "What is directly observed?"
  },
  {
    "input_type": "brittleness",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is brittle?"
  },
  {
    "input_type": "closure",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is closing too soon?"
  },
  {
    "input_type": "closure",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is treated as settled?"
  },
  {
    "input_type": "closure",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What remains open despite closure?"
  },
  {
    "input_type": "drift",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is drifting?"
  },
  {
    "input_type": "drift",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What changed without notice?"
  },
  {
    "input_type": "drift",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What moved from the goal?"
  },
  {
    "input_type": "fit",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What does not fit?"
  },
  {
    "input_type": "fit",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is out of place?"
  },
  {
    "input_type": "friction",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What feels off?"
  },
  {
    "input_type": "friction",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "Where is the friction?"
  },
  {
    "input_type": "friction",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What is not settling?"
  },
  {
    "input_type": "friction",
    "operator_rank": "4",
    "runtime_tier": "booster",
    "meta_thought": "What resists closure?"
  },
  {
    "input_type": "hinge",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What does this turn on?"
  },
  {
    "input_type": "hinge",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is load-bearing?"
  },
  {
    "input_type": "hinge",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What point carries this?"
  },
  {
    "input_type": "noise",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is noise?"
  },
  {
    "input_type": "noise",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What does not affect the state?"
  },
  {
    "input_type": "orientation",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What frame is active?"
  },
  {
    "input_type": "orientation",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is being centered?"
  },
  {
    "input_type": "orientation",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What orientation is assumed?"
  },
  {
    "input_type": "overreach",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What exceeds support?"
  },
  {
    "input_type": "overreach",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What goes beyond the state?"
  },
  {
    "input_type": "pressure",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What pressure is active?"
  },
  {
    "input_type": "pressure",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is pulling the reasoning?"
  },
  {
    "input_type": "pressure",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What is pushing commitment?"
  },
  {
    "input_type": "residue",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What remains after this?"
  },
  {
    "input_type": "silence",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is unsaid?"
  },
  {
    "input_type": "silence",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is absent but relevant?"
  },
  {
    "input_type": "surprise",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is unexpected?"
  },
  {
    "input_type": "surprise",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What violates expectation?"
  },
  {
    "input_type": "surprise",
    "operator_rank": "3",
    "runtime_tier": "booster",
    "meta_thought": "What expectation was active?"
  },
  {
    "input_type": "tension",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is in tension?"
  },
  {
    "input_type": "tension",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What pulls against this?"
  },
  {
    "input_type": "thin_support",
    "operator_rank": "1",
    "runtime_tier": "booster",
    "meta_thought": "What is under-supported?"
  },
  {
    "input_type": "thin_support",
    "operator_rank": "2",
    "runtime_tier": "booster",
    "meta_thought": "What is unsupported but active?"
  }
];

// Self-Inspect text normalization.
//
// THE drift hazard: the local module, the generator, and the deployed n8n code
// node MUST normalize identically, or "published == deployed" silently breaks.
// This file is the single copy. The generator inlines it verbatim; the MCP and
// tests import it. Do not fork this logic anywhere.
//
// Contract: returns a lowercase, NFKC-folded, single-space-tokenized string that
// BOTH starts and ends with a space, so substring matching with space-padded
// keywords gives whole-token boundaries (" foo " matches the word, not "foobar").
function normalize(input) {
  if (input === null || input === undefined) return "  ";
  const folded = String(input).normalize("NFKC").toLowerCase();
  const tokens = folded.replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
  return " " + tokens + " ";
}

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
function select(situation, rows) {
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

function selfInspect(situation) {
  const picked = select(situation, ROWS);
  return picked
    ? { label: picked.input_type, metathought: picked.metathought }
    : { label: null, metathought: null };
}

module.exports = { selfInspect, select, ROWS };
