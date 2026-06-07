# Methodology

## Design
A twin comparison on one fixed conversation:

- **Model:** Claude Sonnet 4.6, four independent agents.
- **2 tool agents:** call Self-Inspect once at the start of every turn, with a one-sentence
  statement of what they are about to do, and let the returned metathought inform the turn.
- **2 no-tool agents:** the control.
- **Script:** a fixed 30-turn conversation (`data/conversation/script.md`) in which a product
  manager incrementally grows a usage-billing module. The PM's messages do not react to the
  agent, so the run is deterministic and identical for every agent.

The script deliberately drifts: requirements pile up and a few collide with constraints set 10+
turns earlier (e.g. "store cost as a float" at turn 4 vs "money must be exact" at turn 13;
"stateless pure function" at turn 3 vs "persist credit balances" at turn 18 and "email the bill"
at turn 28). This gives the agent something real to notice or miss.

## Parity (so a difference can only be the tool)
The base prompt is byte-identical across tool and no-tool agents: same role, same task, same
output format, same conversation. There is **no** "be careful" or "watch for edge cases"
coaching in any prompt. The only difference is that tool agents make the Self-Inspect call and
the others do not. This prevents the result from being an artifact of differently-worded prompts.

## What is measured
Per turn, whether the agent's reply **surfaces a decision-fork**: an assumption, precondition,
edge case, or risk it raises rather than silently choosing. The detector is a keyword match over
the reply text (see `tools/analyze.mjs`); read the logs to judge the substance yourself.

## Call verification (the tool actually fired, and the data is real)
Self-Inspect is heuristic, not an LLM: the same input always returns the same metathought. We
confirmed the logged metathoughts were genuine endpoint responses by re-sending the agents'
recorded thoughts and reproducing the exact questions. So the per-turn metathoughts in the logs
are real calls, not fabrications, and anyone can re-verify them against the live endpoint.

## Data
`data/conversation/`:
- `tool_agent_a.jsonl`, `tool_agent_b.jsonl` — with Self-Inspect. Each line:
  `{turn, user, thought, metathought, reply}`.
- `raw_agent_a.jsonl`, `raw_agent_b.jsonl` — no tool. Each line: `{turn, user, thought, reply}`.
- `script.md` — the fixed 30 turns both conditions saw.

## Reproduce
```
node evals/tools/analyze.mjs
```
Prints fork-surfacing counts (tool vs no-tool) and the full per-turn metathought census. To
re-run the conversation from scratch, replay `script.md` turn by turn against any agent, calling
`POST https://api.ejentum.com/self-inspect` (keyless) each turn for the tool condition.

## Scope
This evaluates what the tool changes in an agent's *process* (which forks it surfaces). It does
not claim the tool replaces model competence; it surfaces decisions for review.
