# ADR-0040: Connect ADRs to Wardley Map evolution stages for strategic context

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0040                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint evaluates ADR decisions at the technical level: is the decision well-supported? Does the code follow it? Are there tradeoffs? But it lacks strategic context: is this decision appropriate for a component at this stage of evolution?

Simon Wardley's Wardley Mapping framework classifies components along an evolution axis: Genesis (novel, uncertain) → Custom-Built (known concept, unique execution) → Product (multiple vendors, feature competition) → Commodity (utility, standardized). The strategic implication is clear: build custom at Genesis, buy/use commodity at Commodity. Building custom authentication in 2026 is building for a commodity, a strategic waste of engineering effort.

No existing ADR tool connects decisions to strategic positioning. This makes Blueprint useful only to architects and developers. Connecting decisions to evolution stages makes Blueprint useful to CTOs and VPs of Engineering, expanding the audience and the impact.

## Options Considered

### Option 1: No strategic context: focus on technical evaluation only

Keep Blueprint focused on technical architecture. Strategic decisions are out of scope.

- **Pros:** Simpler. Clear scope boundary. Avoids subjectivity of evolution stage classification.
- **Cons:** Misses the most expensive architectural mistakes (building commodity). Limits Blueprint's audience to technical practitioners. Ignores the connection between architecture and business strategy.

### Option 2: Add Wardley Map evolution stage as ADR metadata

Add `Evolution-Stage` metadata to ADRs. Create `/blueprint:map` to generate strategic analysis. Agent classifies components via web research (how many vendors exist? is this a commodity?).

- **Pros:** Catches build-vs-buy misalignment before it becomes expensive. Enriches devil's advocate review with strategic lens. Makes Blueprint relevant to business stakeholders. Integrates with Wardley vocabulary already used by strategy-minded teams.
- **Cons:** Evolution stage classification is inherently subjective. Requires web research to classify (slower). May generate false positives (custom builds with legitimate reasons). Strategic analysis is not Blueprint's core competency.

## Decision

> In the context of adding strategic context to architectural decisions, facing the gap between technical evaluation and business strategy alignment, we decided for Wardley Map evolution stage metadata (Option 2) to achieve strategic build-vs-buy analysis, accepting the subjectivity of evolution classification and the scope expansion beyond pure technical architecture.

## Rationale

The most expensive architectural mistakes are not technical; they are strategic. A perfectly implemented custom auth system is still a waste if Auth0 solves the problem for $0.003/login. Wardley Mapping makes these misalignments visible before they become six-figure mistakes.

The `adr-strategic-analyzer` agent provides objective classification by researching the vendor landscape: if 15 alternatives exist, the component is at Product or Commodity stage regardless of the team's opinion. This grounds strategic analysis in market reality, not just internal assumptions.

## Consequences

### Positive
- Strategic misalignment (build-for-commodity) detected before implementation
- Devil's advocate gains strategic lens: "You're building custom for a commodity. Justify why."
- Evolution stage metadata enriches stakeholder digests
- Blueprint becomes useful to CTOs and VPs of Engineering, not just architects

### Negative
- Scope expansion beyond technical architecture into business strategy
- Evolution stage classification is subjective and may be disputed
- Requires web research (slower than pure codebase analysis)

### Risks
- Teams may resist strategic analysis as "not the architect's job"
- False positives: custom builds with legitimate customization needs flagged as waste
- Evolution stages change over time (today's custom may be tomorrow's commodity)

## References
- Wardley, S. "Wardley Mapping": learnwardleymapping.com
- Kaiser, S. "Architecture for Flow" (2023): integrating Wardley with DDD and Team Topologies
- commands/map.md: Skill implementation
- agents/adr-strategic-analyzer.md: Agent implementation
