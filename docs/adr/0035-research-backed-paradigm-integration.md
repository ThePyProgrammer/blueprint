# ADR-0035: Ground v2 extensions in published architecture research

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0035                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint v1 delivered 24 commands and 12 agents covering ADR lifecycle, evaluation, and continuous governance. The question for v2 was: what should Blueprint add next, and on what basis should those decisions be made?

The software architecture field has 30+ years of published research, from ATAM (1998) to epistemic staleness in AI-assisted decisions (2026). Most ADR tools ignore this body of work entirely, treating ADRs as a documentation format rather than as part of a broader architecture governance discipline. The risk of adding features without grounding them in research is building the wrong thing: solving problems that don't exist while missing problems that do.

A comprehensive survey of 20+ architecture paradigms (109 sources across SEI/CMU publications, IEEE papers, ThoughtWorks radar, practitioner blogs, and academic research) identified specific gaps in Blueprint's coverage and specific paradigms that address those gaps. The question was whether to integrate these paradigms formally or cherry-pick features ad hoc.

## Options Considered

### Option 1: Ad hoc feature addition: add what seems useful

Add features based on user requests and intuition. Each feature is designed independently without explicit connection to established paradigms. This is faster and avoids the overhead of research synthesis.

- **Pros:** Faster to implement. No research overhead. Responds to immediate user needs. Avoids over-engineering.
- **Cons:** Risk of building the wrong abstractions. No theoretical foundation for design decisions. Features may overlap or conflict. Hard to explain "why this feature" to potential adopters. Misses insights from 30 years of published research.

### Option 2: Ground every extension in published research: paradigm-backed design

Conduct a comprehensive literature survey, identify the paradigms most relevant to ADR management, and derive specific extensions from each paradigm. Each new command traces to a published source and addresses a documented gap.

- **Pros:** Every feature has a theoretical foundation. Reduces risk of wrong abstractions. Provides defensible rationale for design decisions. Connects Blueprint to established terminology. Creates a body of research that enriches the project's intellectual heritage.
- **Cons:** Slower initial development. Research may not perfectly match implementation needs. Risk of over-academicizing a practitioner tool. Some paradigms may be more useful in theory than in practice.

### Option 3: Adopt one framework: choose TOGAF or Evolutionary Architecture and implement it fully

Pick a single comprehensive framework and implement its complete methodology within Blueprint.

- **Pros:** Deep integration with one paradigm. Consistent conceptual model. Clear positioning in the market.
- **Cons:** Locks Blueprint into one school of thought. TOGAF is too heavyweight; Evolutionary Architecture is too narrow. Misses valuable insights from other paradigms (DDD bounded contexts, DCAR forces evaluation, reflexion models). Most successful architecture tools are eclectic.

## Decision

> In the context of expanding Blueprint's capabilities for v2, facing the challenge of choosing which features to add and how to design them, we decided for research-backed paradigm integration (Option 2) to achieve intellectually grounded design with defensible rationale, accepting the overhead of conducting and maintaining a comprehensive literature survey.

## Rationale

The survey identified 15 specific extensions, each traceable to a published paradigm with documented evidence of value. This is not academic decoration; it is engineering due diligence. The same principle that makes Blueprint require evidence-backed ADRs applies to Blueprint's own design: decisions should be grounded in evidence, not vibes.

The survey itself (papers/software-architecture-paradigms.md) serves as a permanent reference for contributors, explaining not just what each command does but why it exists and what gap it fills.

## Consequences

### Positive
- Every v2 feature has a clear "why" traceable to published research
- Blueprint's intellectual heritage section grows from 10 to 23 citations
- The research report serves as onboarding material for contributors
- Feature prioritization is defensible (P0/P1/P2 tiers based on research impact)

### Negative
- The research step added significant upfront time before implementation
- Some paradigms may prove less useful in practice than the research suggests
- Maintaining the research survey requires periodic updates as the field evolves

### Risks
- Academic paradigms may not translate cleanly to automated tooling
- The breadth of paradigms covered (15 commands from 15 different sources) risks being "a mile wide and an inch deep"

## References
- papers/software-architecture-paradigms.md: Full research report (109 sources)
- papers/software-architecture-paradigms.provenance.md: Research provenance
- ROADMAP.md: Implementation status for all 15 extensions
