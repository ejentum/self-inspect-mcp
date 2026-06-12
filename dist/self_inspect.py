"""Self-Inspect: single-file, zero-dependency Python port. GENERATED - DO NOT EDIT.

Source of truth: selfinspect.csv + src/normalize.js + src/selector.js
Regenerate: npm run build   (drift + JS<->Python parity tests enforce equivalence)

Usage:
  from self_inspect import self_inspect, select
  self_inspect('I am about to assert the default timeout is 30s from memory')
  # -> {'label': ..., 'metathought': ...}

CLI:
  python self_inspect.py "<your thought>"   # prints [{"label", "metathought"}]
"""

import json
import re
import sys
import unicodedata

ROWS = [
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
]

W_TYPE = 3
W_CONTENT = 1

# Universal self-inspection questions (see src/selector.js DEFAULT_IDS).
DEFAULT_IDS = [
    "assumption-1",
    "completeness-1",
    "confidence-4",
    "inference-3",
    "boundary-2",
    "verification-1",
    "scope-3",
    "goal-1",
]

STOPWORDS = {
    "what", "is", "the", "a", "an", "this", "that", "of", "to", "be", "being",
    "does", "do", "did", "are", "was", "were", "why", "how", "when", "where",
    "which", "it", "its", "in", "on", "for", "and", "or", "with", "as", "by",
    "has", "have", "had", "would", "should", "could", "will", "despite", "but",
    "from", "into", "too", "soon", "here", "there", "not", "no", "yet", "still",
    "than", "then", "so", "if", "about", "at", "now",
}

_TYPE_SPLIT = re.compile(r"[_\-\s]+")
_INT_PREFIX = re.compile(r"^[+-]?\d+")


def normalize(value):
    """Port of src/normalize.js: NFKC-fold, lowercase, non-letter/number runs to
    single spaces, collapsed, wrapped in single leading/trailing spaces."""
    if value is None:
        return "  "
    folded = unicodedata.normalize("NFKC", str(value)).lower()
    kept = []
    for ch in folded:
        kept.append(ch if unicodedata.category(ch)[0] in ("L", "N") else " ")
    tokens = " ".join("".join(kept).split())
    return " " + tokens + " "


def _words(value):
    return [w for w in normalize(value).strip().split(" ") if w]


def _type_tokens(input_type):
    return [t.strip().lower() for t in _TYPE_SPLIT.split(str(input_type)) if t.strip()]


def _content_tokens(meta_thought):
    return [w for w in _words(meta_thought) if len(w) > 2 and w not in STOPWORDS]


def _is_strict(group):
    return 1 if group and group[0].get("runtime_tier") == "strict" else 0


def _parse_rank(value):
    m = _INT_PREFIX.match(str(value).strip())
    return int(m.group(0)) if m else None


def _hash_code(value):
    """Port of the JS hashCode: iterates UTF-16 code units, 32-bit unsigned."""
    h = 0
    data = value.encode("utf-16-le")
    for i in range(0, len(data), 2):
        unit = data[i] | (data[i + 1] << 8)
        h = (h * 31 + unit) & 0xFFFFFFFF
    return h


def _row_to_result(row, matched):
    rank = _parse_rank(row.get("operator_rank"))
    return {
        "id": str(row.get("input_type")) + "-" + str(row.get("operator_rank")),
        "metathought": row.get("meta_thought"),
        "input_type": row.get("input_type"),
        "operator_rank": rank,
        "runtime_tier": row.get("runtime_tier"),
        "matched": matched,
    }


def _default_result(thought, rows):
    idx = _hash_code(normalize(thought)) % len(DEFAULT_IDS)
    target = DEFAULT_IDS[idx]
    row = next(
        (r for r in rows
         if str(r.get("input_type")) + "-" + str(r.get("operator_rank")) == target),
        rows[0],
    )
    return _row_to_result(row, False)


def select(thought, rows=None):
    """Port of src/selector.js select(). Same input -> same output as the JS engine."""
    if rows is None:
        rows = ROWS
    if not rows:
        return None
    hay = set(_words(thought))

    groups = {}
    for row in rows:
        groups.setdefault(row.get("input_type"), []).append(row)

    scored = []
    for lens_type, group in groups.items():
        name_hits = sum(1 for t in _type_tokens(lens_type) if t in hay)
        content = set()
        for row in group:
            for t in _content_tokens(row.get("meta_thought")):
                if t in hay:
                    content.add(t)
        score = name_hits * W_TYPE + len(content) * W_CONTENT
        if score <= 0:
            continue
        scored.append({"type": lens_type, "group": group, "score": score})

    if not scored:
        return _default_result(thought, rows)

    scored.sort(key=lambda e: (-e["score"], -_is_strict(e["group"]), e["type"]))
    chosen = scored[0]

    best = None
    for row in chosen["group"]:
        local = sum(1 for t in _content_tokens(row.get("meta_thought")) if t in hay)
        rank = _parse_rank(row.get("operator_rank"))
        candidate = {"row": row, "local": local, "rank": rank if rank is not None else 99}
        if (
            best is None
            or candidate["local"] > best["local"]
            or (candidate["local"] == best["local"] and candidate["rank"] < best["rank"])
        ):
            best = candidate

    return _row_to_result(best["row"], True)


def self_inspect(thought):
    """One thought in, one metathought out (the REST/MCP contract shape)."""
    picked = select(thought)
    if picked is None:
        return {"label": None, "metathought": None}
    return {"label": picked["input_type"], "metathought": picked["metathought"]}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw = " ".join(sys.argv[1:])
    else:
        # Read bytes and decode UTF-8 explicitly: Windows pipes otherwise decode
        # with the locale codepage and mangle non-ASCII thoughts.
        raw = sys.stdin.buffer.read().decode("utf-8")
    result = self_inspect(raw)
    print(json.dumps([result]))
