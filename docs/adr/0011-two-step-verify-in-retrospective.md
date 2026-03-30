# ADR-0011: Use two-step verify pattern in retrospective agent

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0011                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's retrospective agent (`/blueprint:retro`) analyzes recent fixes and proposes architectural improvements worth formalizing as ADRs. The agent classifies root causes, identifies patterns, and recommends changes. The problem is that LLMs confidently recommend patterns that do not exist, do not apply to the situation, or are outdated.

A retrospective that recommends adopting the "Repository-Mediator-Saga pattern" sounds authoritative, but if that pattern was invented by the LLM on the spot, the recommendation is worse than useless — it wastes the team's time investigating a phantom. This is a well-known failure mode of LLM-generated technical advice: fluent, structured, wrong.

The retrospective agent's credibility depends on the accuracy of its recommendations. A single hallucinated pattern erodes trust in all subsequent output. The verification burden must not fall entirely on the user, because users trust structured agent output more than they should.

## Options Considered

### Option 1: Trust agent recommendations as-is

- **Pros:** Simplest implementation. Fastest execution. No external dependencies.
- **Cons:** LLM hallucination risk is unmitigated. Confidently wrong recommendations erode trust in the entire retrospective system. Users may adopt non-existent patterns.

### Option 2: Two-step verify — classify root cause, then web-verify proposed patterns

- **Pros:** Root cause classification uses the LLM's genuine strength (pattern matching on code changes). Pattern verification uses external sources where the LLM is weakest (factual accuracy). Unverified recommendations are explicitly flagged.
- **Cons:** Adds latency for web search. External sources may not cover niche or emerging patterns. Two-step flow is more complex to implement.

### Option 3: Require human verification of all recommendations

- **Pros:** Highest accuracy — humans verify everything. No risk of hallucinated patterns reaching acceptance.
- **Cons:** Defeats the purpose of automation. Users will not verify every recommendation, so in practice they either accept all or ignore all. Verification fatigue is worse than no verification.

## Decision

**In the context of** the retrospective agent's pattern recommendations, **facing** the risk of LLM hallucination producing confidently wrong architectural advice, **we decided for** a two-step verify pattern where Step 1 classifies the root cause and Step 2 web-verifies proposed patterns against 3+ external sources, **to achieve** trustworthy recommendations without requiring manual verification of every finding, **accepting** the added latency of external search and the possibility that valid but obscure patterns may fail verification.

Recommendations that pass verification are presented as "verified." Recommendations that fail verification are explicitly flagged as "unverified — could not confirm this pattern exists in external sources" rather than silently omitted.

## Rationale

- Step 1 (root cause classification) plays to the LLM's strength. Analyzing a diff and categorizing why a bug occurred is pattern matching on structured input — exactly what LLMs do well.
- Step 2 (web verification) mitigates the LLM's weakness. Checking whether a recommended pattern exists in authoritative external sources catches hallucinated patterns before they reach the user.
- The 3-source threshold balances thoroughness and availability. A single source could be a blog post that itself contains errors. Three independent sources provide reasonable confidence that the pattern is real and established.
- Flagging unverified recommendations rather than hiding them preserves information. The root cause classification may still be valuable even if the proposed solution cannot be externally confirmed.
- Option 3 was rejected because mandatory human verification creates a bottleneck that users will route around by ignoring all recommendations.

## Consequences

### Positive

- Hallucinated patterns are caught before reaching the user in most cases.
- The "verified" / "unverified" distinction gives users a calibrated confidence signal.
- Root cause classification is preserved even when pattern verification fails.
- Trust in the retrospective agent is maintained over time because users rarely encounter phantom recommendations.

### Negative

- Web search adds 5-15 seconds of latency per recommendation.
- Niche or project-specific patterns may fail verification despite being valid, producing false "unverified" flags.
- External search quality varies. Some queries return irrelevant results that neither confirm nor deny the pattern.

### Risks

- The verification step may create a false sense of security. Finding 3 sources that mention a pattern does not mean the pattern applies to this specific situation. Mitigation: the agent's output includes the sources so users can assess relevance.
- Rate limiting or network issues could prevent web verification. Mitigation: the agent degrades gracefully — all recommendations are marked "unverified (search unavailable)" rather than failing entirely.
- Search results may surface outdated patterns that have fallen out of favor. Mitigation: the agent prefers recent sources (last 3 years) when available.

## References

- ADR-0012: Extensible taxonomy for root cause classification
- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- "On the Dangers of Stochastic Parrots" — Bender et al., on LLM confabulation risks
