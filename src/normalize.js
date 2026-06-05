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

export function normalize(input) {
  if (input === null || input === undefined) return "  ";
  const folded = String(input).normalize("NFKC").toLowerCase();
  const tokens = folded.replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
  return " " + tokens + " ";
}
