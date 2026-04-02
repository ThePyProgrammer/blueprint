# ADR-0009: Use devil's advocate as part of review, not automatic on every accept

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0009                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint includes a devil's advocate agent that critically challenges proposed ADRs before acceptance. The design question is when this agent fires: automatically on every acceptance transition, or only when the user explicitly requests a review.

Making it automatic ensures no decision escapes scrutiny. Every `/blueprint:transition accept N` would spawn the challenger, surface blind spots, and require the user to address or dismiss findings before the transition completes. This maximizes rigor but introduces friction on every acceptance, including low-stakes or time-sensitive decisions where the trade-offs are already well understood.

Making it part of an explicit review flow preserves velocity. Users who want the challenge run `/blueprint:review N`. Users who have already done their due diligence run `/blueprint:transition accept N` directly. The risk is that users skip review on decisions that deserved it.

The tension is between thoroughness and autonomy. A tool that forces scrutiny on every decision trains users to rubber-stamp the output. A tool that makes scrutiny opt-in respects the user's judgment about when it adds value.

## Options Considered

### Option 1: Automatic on every accept

- **Pros:** No decision escapes challenge. Consistent rigor across all ADRs. Users cannot accidentally skip review on important decisions.
- **Cons:** Adds latency and friction to every acceptance. Low-stakes decisions (e.g., naming conventions, internal tooling choices) do not benefit from adversarial challenge. Users learn to dismiss findings reflexively, reducing the signal value of the agent.

### Option 2: Part of the review flow only

- **Pros:** Users choose the appropriate level of scrutiny. Fast path exists for well-understood decisions. Devil's advocate findings carry more weight because users opted into receiving them.
- **Cons:** Important decisions may be accepted without challenge if users misjudge the stakes. No guardrail against skipping review.

### Option 3: Configurable per-ADR based on severity

- **Pros:** Automatic challenge for high-severity decisions, optional for low-severity. Balances rigor and velocity.
- **Cons:** Requires a severity classification system. Severity is often unclear at proposal time. Adds configuration complexity and a meta-decision about when challenge is warranted.

## Decision

**In the context of** ADR lifecycle transitions, **facing** the tension between consistent scrutiny and user autonomy, **we decided for** making the devil's advocate part of the explicit review flow only, **to achieve** velocity on well-understood decisions and meaningful challenge on complex ones, **accepting** that some decisions may be accepted without adversarial review.

`/blueprint:review N` spawns the devil's advocate agent. `/blueprint:transition accept N` is a direct state transition with no agent involvement. Users choose the path that matches their confidence level.

## Rationale

- Forced scrutiny creates compliance fatigue. When every acceptance triggers a challenge, users stop reading the findings. Making review opt-in means the user is primed to engage with the output.
- The two-command pattern (`review` vs `transition accept`) makes the choice explicit and visible. There is no hidden behavior; the user knows exactly what each command does.
- Low-stakes decisions vastly outnumber high-stakes ones in most projects. Optimizing for the common case (quick acceptance) while providing a thorough path for the uncommon case (contested decisions) matches real usage patterns.
- Option 3's severity-based approach was rejected because severity is subjective and often only clear in retrospect. Adding a severity classifier introduces another AI judgment call that could be wrong.

## Consequences

### Positive

- Fast acceptance path for decisions where the team has high confidence.
- Devil's advocate findings are more impactful because users actively chose to receive them.
- Simpler mental model: `review` = challenge, `accept` = proceed.
- No agent compute cost for straightforward acceptances.

### Negative

- Users may develop a habit of always using `accept` and never using `review`, undermining the value of the devil's advocate agent.
- No safety net for decisions that seem simple but have hidden complexity.

### Risks

- If the team culture defaults to skipping review, the devil's advocate becomes dead code in practice. Mitigation: the `/blueprint:list` output could surface ADRs that were accepted without review as an informational note.
- New team members may not know that `/blueprint:review` exists. Mitigation: `/blueprint:help` prominently features the review workflow.

## References

- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- Joel Spolsky, "The Law of Leaky Abstractions," on tools that force process compliance
