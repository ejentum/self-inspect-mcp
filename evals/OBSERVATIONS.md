# Observations

The numbers in [README.md](README.md) say agents surfaced ~3.5x more decision-forks with the
tool. This is what that looked like up close, read from the logs in `data/conversation/`. These
are observations, not claims; the verbatim lines are quoted so you can check them yourself.

## 1. The metathought steers the angle of the turn

The question that comes back is abstract, but the agent's reply tracks its lens. It is not
generic "be careful" behavior; the *kind* of question shapes the *kind* of caveat:

- metathought `When would this not hold?` (turn 2) → the agent reasons about a boundary:
  *"0.002 * n in floats will accumulate rounding errors at large call counts."*
- metathought `What must hold first?` (turn 5) → the agent surfaces a precondition:
  *"the free tier is presumably per billing period, not lifetime."*
- metathought `What is assumed?` (turn 18) → the agent names its own standing assumption:
  *"I've been assuming persistence lives outside the module."*

That last one is the mechanism in a single exchange: an abstract question pulled a hidden
assumption into the open that the agent had carried, unstated, for many turns.

## 2. It surfaces forks the no-tool agent left silent

Both conditions produced correct designs. The difference is what they *said out loud*. The
no-tool agent picked defaults quietly; the tool agent stopped and flagged the fork. Examples the
tool surfaced that the identical no-tool baseline did not:

- **Storage averaging bias (turn 9):** *"if fewer snapshots exist than days in the month, the
  average is computed over the snapshots that exist, not padded with zeros"* — a real way to
  mis-bill that nothing in the prompt warned about.
- **Order of operations (turn 16):** *"should credits offset the bill before or after tax?"* — a
  fork that changes the amount owed, raised as a question instead of silently decided.
- **Rate-limit semantics (turn 24):** *"when a minute exceeds 1000 RPM, do we exclude ALL calls
  in that minute, or only the calls above 1000?"*
- **Rounding mode (turn 13):** flagged HALF_UP vs banker's rounding for the "exact money"
  requirement, rather than just picking one.
- **Missing field (turn 20):** *"BillResult doesn't currently record which currency the output
  is in."*

## 3. It connects a turn back to a constraint set much earlier

Across 30 turns of piling-on requirements, the tool agents repeatedly tied a new instruction to
something fixed long before:

- turn 18: *"this is where we hit the stateless boundary we set in turn 3"* — keeps the core
  pure and moves persistence to a caller-owned layer.
- turn 28: *"email is a side effect, so it lives outside the pure compute_bill function."*

The forks surfaced earlier stay in the conversation and are visibly available to the agent's
later turns.

## 4. The pattern held across two independent agents

Two separate runs, same fixed conversation, both surfaced forks on ~14 of 30 turns (vs 3 and 5
for the two no-tool runs). The effect was consistent, not a single lucky transcript.

## How to read the raw logs

Each line of a `*.jsonl` in `data/conversation/` is one turn:
`{turn, user, thought, metathought, reply}` for tool runs (the `metathought` is the question the
endpoint returned that turn), and `{turn, user, thought, reply}` for the no-tool runs. Open them
side by side at the turns above to see the difference in the agent's own words.
