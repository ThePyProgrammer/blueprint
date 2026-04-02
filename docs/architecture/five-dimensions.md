---
title: "Five Dimensions of Architectural Health"
description: "The five orthogonal evaluation dimensions: consistency, bug surface, maintainability, testing strategy, and Conway's Law alignment. Each captures a different failure mode."
---

# Five Dimensions of Architectural Health

Blueprint's evaluation team (`/blueprint:evaluate`) assesses architecture across five orthogonal dimensions. Each dimension captures a different failure mode. Each has a dedicated agent. The full evaluation runs all 5 in parallel.

Why five? Because a single "architecture quality" score is meaningless. A codebase can have excellent consistency but terrible testing. It can have great test coverage but Conway's Law misalignment that will make the next reorg catastrophic. You need to know *which dimension* is failing, not just that something is wrong.

---

## The Dimensions

<div class="layer-grid">

<div class="layer-card">
  <span class="layer-card__number">1</span>
  <h4>Structural Consistency</h4>
  <p>Pattern adherence, naming, layering, dependency direction, error handling. A codebase that consistently uses a mediocre pattern is more maintainable than one that mixes three "better" patterns.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">2</span>
  <h4>Bug Surface</h4>
  <p>Complexity hotspots, coupling density, missing boundaries, state management. Not bug <em>hunting</em>, bug <em>cartography</em>. Maps where bugs are structurally likely to emerge.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">3</span>
  <h4>Maintainability</h4>
  <p>Change amplification, cognitive load, dependency health, abstraction quality. The question: will this codebase be pleasant or painful to work in 12 months from now?</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">4</span>
  <h4>Testing Strategy</h4>
  <p>Pyramid health, anti-pattern tests, risk-aligned coverage. 90% coverage of happy paths is worse than 60% covering boundaries, error cases, and anti-patterns.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">5</span>
  <h4>Conway's Law Alignment</h4>
  <p>Ownership alignment, friction points, bottleneck modules. Architecture is ultimately a human problem. Git blame is the data. The org chart is a theory.</p>
</div>

</div>

---

## Why These Five?

These dimensions are not arbitrary. Each addresses a specific, well-documented failure mode in software architecture:

| Dimension | Failure mode | Source |
|-----------|-------------|--------|
| Consistency | "Surprise" bugs from pattern mixing | Code review research (Microsoft) |
| Bug Surface | Complexity concentration | Lehman's Laws of Software Evolution |
| Maintainability | Change amplification cascade | A Philosophy of Software Design (Ousterhout) |
| Testing | False confidence from happy-path coverage | Testing pyramid (Fowler, Cohn) |
| Conway's Law | Org-architecture misalignment | Conway (1967), Team Topologies (Skelton & Pais) |

## The Health Score

The full evaluation produces a health score:

| Score | Meaning |
|-------|---------|
| **STRONG** | All 5 dimensions are healthy. Rare and worth celebrating. |
| **ADEQUATE** | Minor issues in 1-2 dimensions. Normal for active codebases. |
| **CONCERNING** | Significant issues in 2-3 dimensions. Architectural attention needed. |
| **CRITICAL** | Major issues in 3+ dimensions. Structural problems requiring ADRs. |

When the score is CONCERNING or CRITICAL, the evaluation auto-drafts Proposed ADRs for the most critical findings. This closes the loop: evaluation findings become actionable decisions, not just reports.

---

## Anti-Pattern Tests: The Missing Dimension

The testing dimension pays special attention to **anti-pattern tests**: tests that verify the system does NOT do things it shouldn't. These are the most valuable tests in any codebase and they are almost always missing:

| Anti-pattern test | What it verifies |
|-------------------|-----------------|
| Negative authorization | Users *cannot* access resources they shouldn't |
| Input rejection | Invalid inputs are *rejected*, not silently accepted |
| State corruption guards | Concurrent operations *cannot* corrupt shared state |
| Regression guards | Previously fixed bugs *stay* fixed |
| Architecture enforcement | Module boundaries are *not* violated |
| Performance bounds | Response times *do not* exceed thresholds |

The common pattern: teams test that things *work*. They rarely test that things *don't break*. The testing evaluator specifically flags this gap because it's where the most expensive bugs hide.

---

## Running Individual Dimensions

```
/blueprint:evaluate              # All 5 in parallel
/blueprint:evaluate consistency  # Just consistency
/blueprint:evaluate bugs         # Just bug surface
/blueprint:evaluate maintainability  # Just maintainability
/blueprint:evaluate testing      # Just testing strategy
/blueprint:evaluate conways      # Just Conway's Law
```

!!! tip
    Run the full evaluation after major milestones. Run individual dimensions when you have a specific concern, e.g., run `conways` before a team reorg, run `testing` after a major test suite refactor.
