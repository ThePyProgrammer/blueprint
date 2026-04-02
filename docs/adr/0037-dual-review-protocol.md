# ADR-0037: Dual review protocol: DCAR forces evaluation plus devil's advocate

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0037                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |
| Related     | [ADR-0009](0009-devils-advocate-on-review-not-accept.md), [ADR-0021](0021-hegelian-dialectic-for-review.md) |

## Context

Blueprint v1 reviews ADRs through a single mechanism: devil's advocate challenge (ADR-0009, ADR-0021). The devil's advocate uses Hegelian dialectic: thesis (proposed ADR), antithesis (adversarial challenge), synthesis (revised decision). This is effective at finding blind spots but has a structural limitation: adversarial review answers "what did we miss?" but not "is this well-supported?"

Decision-Centric Architecture Reviews (van Heesch et al., IEEE Software, 2014) provide a complementary evaluation method. DCAR treats decisions as first-class entities (exactly what Blueprint does) and evaluates them by systematically mapping forces for and against, weighting them, and computing a force balance. This is analytical, not adversarial.

The research identified DCAR as "Blueprint's most natural formal method counterpart" because it was designed for exactly the decision-centric workflow Blueprint uses.

## Options Considered

### Option 1: Replace devil's advocate with DCAR forces evaluation

Swap out the adversarial review for structured forces evaluation. One review method, analytically grounded.

- **Pros:** Simpler (one review method). More systematic. Force balance provides quantitative verdict.
- **Cons:** Loses the adversarial "find blind spots" capability. Forces evaluation maps known forces but may not discover unknown ones. Devil's advocate has been effective since v1.

### Option 2: Add DCAR as a separate, complementary command

Keep devil's advocate (`/blueprint:review`) and add DCAR forces evaluation (`/blueprint:challenge`) as a separate command. Both available, used independently or together.

- **Pros:** Best of both methods. Analytical evaluation maps known forces; adversarial review discovers unknown ones. Users choose the depth of review they need. Maximum rigor when both are used together.
- **Cons:** Two review-like commands may confuse users. More process overhead when both are used. Need clear guidance on when to use which.

### Option 3: Merge both into a single enhanced review

Combine forces evaluation and devil's advocate into one `/blueprint:review` command that does both sequentially.

- **Pros:** Single command. Users don't have to choose.
- **Cons:** Always-heavy review may be overkill for simple decisions. Violates single responsibility (ADR-0016). Forces evaluation output format is different from devil's advocate output. Harder to skip one method when not needed.

## Decision

> In the context of strengthening ADR review quality, facing the limitation that adversarial review alone does not provide structured force-balancing, we decided for dual review protocol (Option 2), DCAR forces evaluation as `/blueprint:challenge` complementing devil's advocate as `/blueprint:review`, to achieve both analytical rigor and adversarial stress-testing, accepting the complexity of two review-like commands.

## Rationale

The two methods answer different questions:

| Method | Question | Approach | Output |
|--------|----------|----------|--------|
| `/blueprint:challenge` | "Is this well-supported?" | Analytical: map and weigh forces | Force balance ratio, verdict |
| `/blueprint:review` | "What did we miss?" | Adversarial: find blind spots | Challenge report with verdict |

Using challenge first (structured analysis) then review (stress test) produces maximally robust decisions. But each is valuable independently: simple decisions may only need challenge; high-stakes decisions should get both.

## Consequences

### Positive
- Analytical AND adversarial review available
- DCAR forces template provides structured, repeatable evaluation
- Force balance ratios enable quantitative comparison across ADRs
- Decision relationship views show how ADRs interact (sensitivity/tradeoff points)
- Users choose review depth appropriate to the decision

### Negative
- Two review commands to learn
- Need guidance on when to use which (documented in challenge.md)
- Forces evaluator agent adds to agent count

### Risks
- Users may default to one method and ignore the other
- Force weights are somewhat subjective (Critical/Major/Minor assignments)

## References
- van Heesch, U. et al. "Decision-Centric Architecture Reviews" IEEE Software, 2014
- commands/challenge.md: Skill implementation
- agents/adr-forces-evaluator.md: Agent implementation
- ADR-0009: Devil's advocate on review, not accept
- ADR-0021: Hegelian dialectic for review
