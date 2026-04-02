# ADR-0025: Track decision debt with severity scoring and trigger monitoring

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0025                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Not every architectural decision is made when it is identified. Teams frequently defer decisions: "we will choose a message broker when we hit 1000 messages/second," "we will revisit the monolith-vs-microservice question when the team grows past 10," "we will formalize the caching strategy after the beta launch." These deferred ADRs represent decision debt: the accumulated cost of architectural questions that have been identified but not yet answered.

Decision debt is analogous to technical debt, but more dangerous. Technical debt is visible in code: you can grep for TODO comments, measure cyclomatic complexity, count lint warnings. Decision debt is invisible. It lives in deferred ADRs that no one re-reads, in Slack threads that scroll off-screen, in meeting notes that are not indexed. The trigger conditions that would activate a deferred decision ("when we hit 1000 msg/s") are never monitored. The decision sits dormant until the consequences of not having made it become painful. By which time, the cost of making it has increased dramatically because the system has evolved around the absence of the decision.

Blueprint's lifecycle state machine (ADR-0004) supports the "Deferred" state, but provides no mechanism for tracking why a decision was deferred, when it should be revisited, or how urgent revisitation has become. Deferred ADRs are structurally indistinguishable from forgotten ADRs.

## Options Considered

### Option 1: Manual tracking of deferred decisions, simple and forgotten

Rely on team discipline to periodically review deferred ADRs and evaluate whether trigger conditions have been met. Add a recurring calendar event: "review deferred ADRs." In practice, this calendar event is cancelled within 2 months. Deferred ADRs accumulate. No one remembers why ADR-0042 was deferred or what would trigger revisitation. The decision debt grows silently.

**Pros:** Zero implementation cost. No tooling required. Works if the team is disciplined.

**Cons:** Depends entirely on human discipline, which is unreliable for low-urgency recurring tasks. No visibility into the accumulation of decision debt. Trigger conditions are not recorded systematically. Teams that need this most (those already deferring many decisions) are least likely to maintain manual tracking.

### Option 2: Automated trigger monitoring with debt scoring, proactive surfacing

Blueprint records trigger conditions when ADRs are deferred (e.g., "revisit when team > 10," "revisit when latency > 200ms," "revisit after Q3 launch"). It computes a decision debt score for each deferred ADR based on severity (how impactful is the decision), age (how long it has been deferred), and dependency count (how many other decisions or components are blocked or affected). Periodically, blueprint evaluates trigger conditions against available signals (team size from git contributors, dates from calendar, metrics from config) and surfaces decisions whose triggers have been met or whose debt score exceeds a threshold.

**Pros:** Proactive surfacing of decisions that are due for revisitation. Quantified severity enables prioritization. Trigger conditions are recorded and monitored, not forgotten. Decision debt becomes visible and measurable.

**Cons:** Requires defining a scoring formula. Some trigger conditions are not mechanically evaluable. Adds complexity to the deferred state in the lifecycle.

### Option 3: Ignore deferred decisions until someone remembers, the default

Do nothing. Deferred ADRs exist in the ADR directory. If someone needs the decision, they will search for it. If no one searches, the decision was not needed. This is the implicit approach of most teams and it works for truly unimportant decisions. But it fails catastrophically for decisions that are important but not urgent, the exact category where deferral is most common.

**Pros:** Zero overhead. No false alarms. No tooling complexity.

**Cons:** Important decisions are forgotten. The cost of eventual decision-making increases with delay. No visibility into accumulated debt. Emergencies caused by un-made decisions are preventable surprises.

## Decision

**We track deferred ADRs as decision debt with quantified severity scoring (severity times age times dependency count) and proactive trigger condition monitoring**, because deferred is not the same as decided. A deferred decision is a ticking clock, and a clock without an alarm is just a decoration.

## Rationale

- Decision debt is real debt. Like financial debt, it accrues interest: the longer a decision is deferred, the more the system evolves around its absence, and the more expensive the eventual decision becomes. Quantifying this with a score makes the interest rate visible.
- Trigger conditions distinguish intentional deferral from avoidance. "Deferred until team > 10" is a plan. "Deferred" with no trigger is procrastination. Recording trigger conditions forces teams to articulate what would make the decision timely.
- The severity x age x dependency count formula is simple enough to be transparent and complex enough to be useful. A high-severity decision deferred for 6 months with 5 dependent components scores much higher than a low-severity decision deferred last week with no dependents. The formula makes priority ordering mechanical.
- Proactive surfacing inverts the responsibility. Instead of the team remembering to check deferred ADRs, blueprint tells the team when a deferred ADR is due. This matches the proactive intervention philosophy established in ADR-0015.
- Decision debt visibility supports technical debt conversations. "We have 7 deferred architectural decisions with a combined debt score of 340" is concrete in a way that "we have some decisions to make" is not.

## Consequences

### Positive

- Deferred decisions become tracked obligations, not forgotten notes. Every deferred ADR has a recorded trigger condition and a computable debt score.
- Teams gain visibility into their decision debt portfolio. Sprint planning can incorporate decision debt alongside technical debt.
- Trigger monitoring catches conditions that humans would miss. If a trigger was "revisit when the module has more than 5 contributors," blueprint can evaluate this from git history without anyone remembering to check.
- The debt score enables prioritization: when time is limited, address the highest-scoring deferred decisions first.

### Negative

- The severity scoring formula is necessarily simplified. Real decision urgency depends on context that a formula cannot fully capture.
- Recording trigger conditions adds friction to the deferral process. Teams must articulate conditions at the time of deferral, when they may not know exactly what would trigger revisitation.
- Some trigger conditions cannot be evaluated mechanically (e.g., "when the regulatory landscape changes"). These require manual assessment.

### Risks

- Score inflation: as deferred ADRs age, their scores increase monotonically, potentially creating alarm fatigue. Mitigation: debt reports distinguish between "trigger met" (requires action) and "score high but trigger unmet" (requires awareness). Age alone does not trigger alerts.
- Gaming: teams might avoid the Deferred state to avoid debt tracking, instead leaving decisions in Proposed indefinitely. Mitigation: blueprint flags Proposed ADRs older than a configurable threshold as potential hidden deferrals.
- Over-engineering the formula: the temptation to add more factors (risk, cost of delay, opportunity cost) can make the score opaque. Mitigation: keep the formula to three factors. If teams need more nuance, they can override scores manually.

## References

- ADR-0004: Encode lifecycle as state machine
- ADR-0015: Proactive intervention for undocumented decisions
- ADR-0019: Session state persistence across invocations
- Philippe Kruchten, "Managing Technical Debt" (2019)
