---
title: "Philosophy"
description: "The intellectual foundations of Blueprint. Why architectural decisions are hypotheses, why directness matters, and why decision debt compounds faster than code debt."
---

# Philosophy

!!! quote "Winston Churchill"

    "We shape our buildings; thereafter they shape us."

Blueprint is built on three philosophical claims, each supported by decades of research and centuries of hard-won experience:

1. **Architectural decisions are hypotheses, not declarations.** They should be falsifiable, evidence-based, challengeable, and revisable. This is not a metaphor. It is the epistemological foundation that determines how every command in Blueprint works.

2. **Directness is functional, not aesthetic.** The [cranky senior engineer persona](the-cranky-senior-engineer.md) exists because research shows that hedging feedback is systematically ignored. "Consider using const" produces no action. "This should be const: it's never reassigned" produces change.

3. **Decision debt compounds faster than code debt.** A deferred technology choice becomes a deferred architecture choice becomes a deferred rewrite. Blueprint tracks this explicitly because [Cunningham's original insight](decision-debt.md) was about the gap between what code *does* and what the team now *understands*, not about sloppy code.

---

## The Traditions Blueprint Draws From

Blueprint synthesizes 15 architecture paradigms from 109 sources across 20+ intellectual traditions. This is not eclecticism: each paradigm addresses a specific failure mode that the others miss:

| Tradition | What it contributes | Blueprint command |
|-----------|-------------------|-------------------|
| Architecture Decision Records (Nygard, 2011) | Lightweight decision documentation | `/blueprint:new` |
| Hegelian Dialectic | Thesis → antithesis → synthesis | `/blueprint:review` |
| Domain-Driven Design (Evans, 2003) | Bounded context scoping | `/blueprint:scope` |
| DCAR (van Heesch et al., 2014) | Structured forces evaluation | `/blueprint:challenge` |
| Reflexion Models (Murphy et al., 1995) | Formal conformance checking | `/blueprint:reflect` |
| ATAM (SEI/CMU, 1998) | Quality attribute tradeoff analysis | `/blueprint:tradeoff` |
| Wardley Mapping | Strategic evolution stage analysis | `/blueprint:map` |
| C4 Model (Brown, 2006-2011) | Progressive architecture visualization | `/blueprint:diagram` |
| Evolutionary Architecture (Ford et al., 2017) | Fitness functions as CI tests | `/blueprint:fitness` |
| Architecture Advice Process (Harmel-Law, 2021) | Decentralized consultation | `/blueprint:advise` |
| Risk Storming (Brown, ~2015) | Visual risk identification | `/blueprint:risk` |
| arc42 (Starke & Hruschka, 2005) | Standardized documentation export | `/blueprint:export` |
| 4+1 View Model (Kruchten, 1995) | Multi-stakeholder views | `/blueprint:views` |
| Conway's Law (Conway, 1967) | Org-architecture alignment | `/blueprint:evaluate conways` |
| Epistemic Staleness (Gilda & Gilda, 2026) | Evidence validity tracking | `/blueprint:evidence` |

---

## The Three Pillars

<div class="layer-grid">

<div class="layer-card">
  <span class="layer-card__number">1</span>
  <h4>Decisions as Hypotheses</h4>
  <p>Every architectural decision is a bet. Research it, challenge it, verify it, revisit it when the evidence changes.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">2</span>
  <h4>Directness as Function</h4>
  <p>The cranky senior engineer persona ensures findings produce action, not polite acknowledgment followed by inaction.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">3</span>
  <h4>Governance as Code</h4>
  <p>Domain knowledge encoded as TOML, not English. Lifecycle transitions validated by a state machine, not by convention.</p>
</div>

</div>

---

## Further Reading

- [Decisions as Hypotheses](decisions-as-hypotheses.md): The epistemological claim that shapes everything
- [The Cranky Senior Engineer](the-cranky-senior-engineer.md): Why the persona is functional, not decorative
- [Decision Debt](decision-debt.md): Why deferred decisions are more dangerous than sloppy code
