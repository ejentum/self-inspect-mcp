# Self-Inspect — evaluation

Self-Inspect returns one short, abstract question (a "metathought") for whatever an agent is
about to do. This folder is the evidence for what that question actually changes in an agent's
behavior, with the raw data and a script so you can reproduce it yourself.

## Headline result

In a 30-turn software-design conversation, agents that consulted Self-Inspect once per turn
surfaced **~3.5x more decision-forks** — assumptions, edge cases, and preconditions — than the
**identical** agent with no tool.

```
              forks surfaced (of 30 turns)
  with Self-Inspect:   14, 14
  no tool (baseline):   3,  5
                        -> ~3.5x
```

Same model (Claude Sonnet 4.6), same fixed conversation, same prompt. The only difference is the
one metathought per turn. (`node evals/tools/analyze.mjs` reproduces this from the logs here.)

## What that means

The tool's effect is **fork-externalization**: it makes the agent *say out loud* the choices it
would otherwise make silently. Strong models are competent, but they commit to defaults quietly,
the rounding mode, the averaging method, the order of operations, and you never see the fork.
Self-Inspect pulls those forks into the open where a human (or the agent's own later turns) can
catch them.

Concrete forks the tool agents raised that the no-tool baseline left implicit (verbatim from the
logs):

- **Storage averaging bias (turn 9):** *"if fewer snapshots exist than days in the month, the
  average is computed over the snapshots that exist, not padded with zeros"* — a real billing bug.
- **Order of operations (turn 16):** *"should credits offset the bill before or after tax?"*
- **Rate-limit semantics (turn 24):** *"when a minute exceeds 1000 RPM, do we exclude ALL calls
  in that minute, or only the calls above 1000?"*

And the mechanism in one exchange (turn 18): the tool returned `What is assumed?`, and the agent
answered *"I've been assuming persistence lives outside the module"* — surfacing a standing
assumption it had never stated.

## What we measure, and why not "correctness"

The obvious question is whether Self-Inspect makes the final output more *correct*. We looked at
that first, across well-specified coding tasks, and it didn't move the result — and that is the
finding, not a disappointment. When a capable model is handed a fully-specified task, it does not
make the kind of mistake a single question catches; there is nothing there to fix. Correctness
only has room to move where the model is making a fallible judgment call, not where it is already
competent.

So the axis that matters is upstream: not whether the answer changes, but whether the agent's
*process* changes — which assumptions it surfaces, which forks it names, before it commits. That
is what the result above measures, and where the effect is large and consistent. Self-Inspect is
an attention and transparency amplifier, not an answer-corrector, and we evaluate it as one.

## It's real, and it's deterministic

Self-Inspect uses no LLM. The question is selected by a transparent heuristic over an open CSV,
so the same thought always yields the same metathought. We verified the logged calls were
genuine by re-sending the agents' recorded thoughts and getting back the exact same questions:

```
thought logged at turn 13  ->  "What is underspecified?"   (reproduced)
thought logged at turn 18  ->  "What is assumed?"          (reproduced)
thought logged at turn 28  ->  "What is missing?"          (reproduced)
```

## Where it helps

Self-Inspect is an attention-and-transparency tool. Use it when a silent assumption is expensive
and you want the agent to externalize its forks for review: high-stakes, ambiguous, or
long-running work. It surfaces the decisions; you (or the agent's later turns) decide.

## Reproduce it

```
node evals/tools/analyze.mjs
```

Reads the four conversation logs in `data/conversation/` (two with the tool, two without) and
prints the fork-surfacing counts plus the full per-turn metathought census.

See [OBSERVATIONS.md](OBSERVATIONS.md) for the up-close, quoted observations (what the
metathought actually did, in the agent's own words), and [METHODOLOGY.md](METHODOLOGY.md) for
the setup, the parity controls, and the conversation script.
