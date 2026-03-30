---
name: blueprint:advise
description: >
  Structured advice-seeking workflow before proposing an ADR. Records who was consulted, what
  advice was given, and how it influenced the decision. Implements the Architecture Advice Process
  (Harmel-Law, ThoughtWorks Radar Trial 2025). Use when: "seek advice", "who should I consult?",
  "advice process", "before proposing", "consult stakeholders".
  Examples: "/blueprint:advise session management", "/blueprint:advise --topic caching strategy".
---

# Architecture Advice Process

Structured consultation workflow before proposing an ADR. Based on Andrew Harmel-Law's
Architecture Advice Process (ThoughtWorks Technology Radar: Trial, April 2025).

> **The Rule:** Anyone can make an architectural decision.
> **The Constraint:** Before deciding, seek advice from (a) those meaningfully affected
> and (b) those with relevant expertise. Advice-seekers are not obliged to agree; they
> must listen and document.

## Shared Context

Read from parent `adr/` skill directory:
- `state.toml` — ADR directory location
- `contexts.toml` — bounded contexts with owners
- `relationships.toml` — existing ADR graph
- `agents/persona.md` — your personality

## Process

1. **Identify the decision topic** from user input
2. **Determine affected parties:**
   - Read `contexts.toml` — which contexts are affected? Who owns them?
   - Read git log — who has contributed to the affected code areas?
   - Read existing ADRs — who authored related decisions?
3. **Present consultation checklist:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADVICE PROCESS: [Topic]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

People to consult before deciding:

 Affected Parties (their work changes):
  □ [Name] — owns [context], [N] commits in affected area
  □ [Name] — authored ADR-NNNN (related decision)

 Subject Matter Experts:
  □ [Name/Role] — expertise in [domain]
  □ [Name/Role] — expertise in [technology]

 Optional:
  □ Architecture Advisory Forum (weekly meeting)
```

4. **Record advice as user provides it:**
   - For each consulted person, record: name, advice given, agreement/disagreement
   - Ask: "How did this advice influence your thinking?"
5. **Generate advice section** for the ADR:

```markdown
## Advice Received

| Consulted | Role | Advice | Influence on Decision |
|-----------|------|--------|----------------------|
| [Name] | [context owner] | [summary of advice] | [how it shaped the decision] |
| [Name] | [SME] | [summary of advice] | [confirmed approach / changed direction] |

**Advice Process completed:** [date]
**Decision-maker:** [name]
```

6. **Proceed to ADR creation:** Offer to run `/blueprint:new` with advice pre-populated
7. **Update `state.toml`** — set `last_advice_process` to today

## Integration with Other Commands

- `/blueprint:new` — when invoked without prior `/blueprint:advise`, prompt:
  "Have you sought advice from affected parties?"
- `/blueprint:list` — show whether each Proposed ADR went through the advice process
- `/blueprint:scope` — context owners from contexts.toml auto-populate affected parties
- `/blueprint:digest` — stakeholder summary notes which decisions used the advice process

## The Advice Process vs. Architecture Review Boards

| Aspect | Advice Process | Architecture Review Board |
|--------|---------------|--------------------------|
| Authority | Advice, not approval | Approval, not advice |
| Who decides | The person seeking advice | The board |
| Speed | Minutes to days | Weeks (meeting cadence) |
| Bottleneck | None — anyone can decide | Board capacity |
| Accountability | Decision-maker owns outcome | Diffused across board |
| Documentation | Advice section in ADR | Meeting minutes |
