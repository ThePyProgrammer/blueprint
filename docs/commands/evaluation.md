---
title: "Evaluation Team"
description: "The 5-agent architecture evaluation team: consistency, bug surface, maintainability, testing strategy, and Conway's Law alignment."
---

# Evaluation Team

Blueprint's evaluation team assesses architecture across five orthogonal dimensions. Each dimension captures a different failure mode. Each has a dedicated agent. The full evaluation runs all 5 in parallel.

---

### `/blueprint:evaluate`: Run the Full Team

Spawn all 5 evaluation agents in parallel. Synthesizes an executive summary with a health score (STRONG / ADEQUATE / CONCERNING / CRITICAL) and auto-drafts Proposed ADRs for the most critical findings.

**Syntax:** `/blueprint:evaluate [dimension]`

Without an argument, runs all 5. With a dimension name, runs just one.

**Dimensions:** `consistency`, `bugs`, `maintainability`, `testing`, `conways`

**Examples:**

```
/blueprint:evaluate
# Full 5-agent evaluation, ~2-5 minutes

/blueprint:evaluate consistency
# Just the consistency dimension

/blueprint:evaluate testing
# Just the testing strategy evaluation
```

!!! tip
    Run the full evaluation after major milestones or before architectural reviews. Run individual dimensions when you have a specific concern.

---

### `/blueprint:evaluate consistency`: Structural Consistency

> "A foolish consistency is the hobgoblin of little minds." (Emerson)
>
> A *useful* consistency is the foundation of navigable codebases.

A codebase that consistently uses a mediocre pattern is more maintainable than one that mixes three "better" patterns. Inconsistency is the leading cause of "surprise" bugs: a developer assumes one pattern applies everywhere, but one module silently uses another.

**What it checks:**

- Naming conventions across modules
- Module structure patterns
- Dependency direction (does everything flow the right way?)
- Error handling consistency
- API pattern consistency
- Configuration approach consistency

---

### `/blueprint:evaluate bugs`: Bug Surface Mapping

Not bug *hunting*, but bug *cartography*. Maps the architectural properties that make certain areas structurally bug-prone.

The insight from [Lehman's laws](https://en.wikipedia.org/wiki/Lehman%27s_laws_of_software_evolution) is that complexity grows unless actively fought. The bug surface mapper identifies where complexity has *concentrated* so you can address it architecturally rather than playing whack-a-mole with individual bugs.

**What it checks:**

- Cyclomatic complexity hotspots
- Coupling density (cross-module imports)
- Shared mutable state
- Missing boundary enforcement
- Implicit contracts between modules
- State management patterns

---

### `/blueprint:evaluate maintainability`: Long-Term Maintainability

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." (Martin Fowler)

The key metric is not "how good is this code?" but "will this codebase be pleasant or painful to work in 12 months from now?"

**What it checks:**

- Change amplification (how many files change for a typical feature?)
- Cognitive load (how much context is needed to modify a module?)
- Dependency health (are dependencies maintained? up to date? appropriate?)
- Abstraction quality (do abstractions help or hinder?)
- Documentation accuracy (does the documentation match the code?)
- Technical debt indicators

---

### `/blueprint:evaluate testing`: Testing Strategy

90% code coverage that only tests happy paths is worse than 60% that tests boundaries, error cases, and anti-patterns.

Special attention to **anti-pattern tests**: tests that verify the system does NOT do things it shouldn't. These are the most valuable tests in any codebase and they are almost always missing.

**What it checks:**

- Testing pyramid health (unit vs integration vs e2e ratio)
- Anti-pattern test coverage:
  - Negative authorization tests
  - Input rejection tests
  - State corruption guards
  - Regression guards
  - Architecture enforcement tests
  - Performance bounds
- Test quality (are tests testing behavior or implementation?)
- Risk-aligned coverage (are the riskiest paths tested?)

---

### `/blueprint:evaluate conways`: Conway's Law Alignment

The most subtle and often most consequential dimension. Architecture is ultimately a human problem.

**What it checks:**

- Do module boundaries align with ownership boundaries?
- Are there shared modules nobody clearly owns?
- Does coupling between modules force communication between people who don't naturally coordinate?
- Are there bottleneck modules that every team must modify?
- Does the team structure support the architecture's scaling model?

A perfectly designed system that doesn't match how the team works will be slowly reshaped by the team's communication structure until it does, usually in the worst possible way.

!!! tip
    The Conway's Law analysis uses `git blame`, not the org chart. The org chart is a theory. Git blame is the data.
