---
name: blueprint:challenge
description: >
  Structured DCAR forces evaluation of an ADR — systematically weighs arguments for and against,
  generates force-balance reports, and scores as confirmed/needs-re-evaluation/reconsider.
  Use when: "challenge adr N", "evaluate forces", "force balance", "weigh this decision",
  "is this decision well-supported?". Different from /blueprint:review (adversarial) — this is
  analytical. Use challenge first, then review.
  Examples: "/blueprint:challenge 5", "/blueprint:challenge ADR-0012".
---

# DCAR Forces Evaluation

Apply the Decision-Centric Architecture Review (van Heesch et al., IEEE Software, 2014) forces
template to systematically evaluate an ADR. This is analytical, not adversarial — it maps
forces for and against, weighs them, and determines whether the balance supports the decision.

## Shared Context

Read from parent `adr/` skill directory:
- `{adr_directory}/.state/relationships.toml` — ADR dependency graph
  (auto-detect adr_directory: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`)
- `{adr_directory}/.state/contexts.toml` — bounded context assignments
- `{adr_directory}/.state/state.toml` — ADR directory location
- `agents/persona.md` — your personality

## Process

1. **Parse ADR number** from user input (accepts `N`, `ADR-N`, `ADR-NNNN`, `NNNN`)
2. **Read the target ADR** from ADR directory
3. **Validate status** — can challenge any status, but most useful for Proposed ADRs
4. **Read `agents/adr-forces-evaluator.md`** from parent skill directory
5. **Spawn a `blueprint:adr-forces-evaluator` agent** with:
   - Full agent instructions + `agents/persona.md`
   - Target ADR content
   - All accepted ADR filenames and their titles
   - `{adr_directory}/.state/relationships.toml` content
   - `{adr_directory}/.state/contexts.toml` content
   - Project root path
6. **Present the forces evaluation** to the user
7. **Based on verdict:**
   - **CONFIRMED:** Suggest accepting (`/blueprint:transition accept N`)
   - **NEEDS-RE-EVALUATION:** Ask user what additional evidence to gather
   - **RECONSIDER:** Suggest revising the ADR or running `/blueprint:rearchitect`
8. **Update `{adr_directory}/.state/state.toml`** — set `last_challenge` to today

## Relationship to `/blueprint:review`

| Aspect | `/blueprint:challenge` | `/blueprint:review` |
|--------|----------------------|---------------------|
| Method | DCAR forces template | Hegelian dialectic |
| Approach | Analytical — map and weigh forces | Adversarial — find blind spots |
| Output | Force balance report with ratio | Challenge report with verdict |
| Best for | "Is this well-supported?" | "What did we miss?" |
| Order | First | Second |

Both can be run independently. For maximum rigor, run challenge first (structured analysis),
then review (adversarial stress test). A decision that passes both is robust.
