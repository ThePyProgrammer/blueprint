---
title: "Decisions as Hypotheses"
description: "The epistemological foundation of Blueprint. Why architectural decisions should be treated as falsifiable hypotheses, supported by Nygard, Popper, the Hegelian dialectic, and Conway."
---

# Decisions as Hypotheses

!!! quote "Karl Popper, The Logic of Scientific Discovery (1934)"

    "Every genuine test of a theory is an attempt to falsify it, or to refute it."

This is why Blueprint exists.

When you write "use PostgreSQL for primary storage," you are not stating a fact. You are stating a hypothesis. You are betting that PostgreSQL's ACID guarantees, ecosystem maturity, and JSONB flexibility will serve your needs better than the alternatives, given your constraints, for the foreseeable future. Like any hypothesis, it can be wrong. Like any hypothesis, it should be *tested* before it becomes the foundation of a system.

Most ADR implementations miss this. They treat decisions as declarations, statements of intent that, once recorded, are assumed to be correct until someone notices they aren't. The ADR is written, filed, and forgotten. The codebase slowly drifts away from it. Nobody notices because nobody checks.

Blueprint treats decisions the way Popper says we should treat scientific theories: as conjectures to be subjected to the most rigorous criticism we can muster, then provisionally accepted until the evidence changes.

---

## The Four Properties of a Genuine Hypothesis

### 1. Falsifiable

There must be conditions under which the decision would be wrong. "Use PostgreSQL" is falsifiable: if your write throughput exceeds PostgreSQL's single-node limits, or if your query patterns are purely key-value lookups, or if your team has zero relational database experience, the decision is wrong.

A decision that cannot be falsified ("use the best technology for the job") is not a decision. It is a platitude. Blueprint's devil's advocate (`/blueprint:review`) exists specifically to find the falsification conditions that the proposer missed.

### 2. Evidence-Based

The decision should be supported by research, not preference. "I like PostgreSQL" is not evidence. "PostgreSQL handles our projected 10K writes/second based on benchmarks X, Y, Z, our schema fits a relational model, and three team members have production PostgreSQL experience" is evidence.

`/blueprint:new --research` spawns a researcher agent that evaluates alternatives with evidence *before* you propose the decision. `/blueprint:evidence` audits the epistemic status of existing evidence, detecting stale claims, expired benchmarks, and unverified AI-generated research.

### 3. Challengeable

A decision that has never been challenged is a decision that has never been tested. The [Hegelian dialectic](https://en.wikipedia.org/wiki/Dialectic#Hegelian_dialectic) (thesis, antithesis, synthesis) is the mechanism by which decisions become robust:

- **Thesis:** The proposed ADR ("use PostgreSQL")
- **Antithesis:** The devil's advocate challenge ("what about your 50M-row migration? Your team's zero PostgreSQL ops experience?")
- **Synthesis:** The accepted decision, now stronger for having survived scrutiny

`/blueprint:review` spawns a devil's advocate agent that challenges across 5 dimensions: hidden assumptions, unconsidered alternatives, missing consequences, codebase fit, and team capability. `/blueprint:challenge` runs a structured [DCAR forces evaluation](https://ieeexplore.ieee.org/document/6449237/), systematically weighing arguments for and against.

This is not academic decoration. Research on [code review effectiveness](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs/) shows that adversarial review catches problems that collaborative review misses. Blueprint applies the same principle to architectural decisions.

### 4. Revisable

The evidence changes. Requirements change. The team changes. A decision that was correct 18 months ago may be wrong today. Blueprint provides four mechanisms for detecting when this happens:

- **Drift detection** (`/blueprint:drift`): Analyzes git history *trajectory*, not "is the code correct now?" but "is the code moving toward or away from the architecture over time?"
- **Evidence auditing** (`/blueprint:evidence`): Tracks the temporal validity of the research supporting each decision. Benchmarks expire. Libraries evolve. Claims need re-verification.
- **Decision debt** (`/blueprint:debt`): Monitors deferred decisions whose trigger conditions may have been met.
- **Retrospective** (`/blueprint:retro`): After every fix, asks whether the root cause indicates a structural gap, a decision that needs revising, not just code that needs patching.

---

## What Nygard Got Right, and What Was Missing

Michael Nygard's [original ADR proposal](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (2011) was correct about the core insight: architectural decisions deserve the same rigor as code changes. Record the context, the decision, the consequences. Make it lightweight enough to actually use.

What was missing was the *enforcement mechanism*. Nygard gave us the format. Blueprint adds the lifecycle:

```
Proposed → Review → Accepted → Audited → Enforced → Revisited
```

Each transition is validated against a finite state machine (`config/lifecycle.toml`). You cannot accept an ADR that hasn't been reviewed. You cannot supersede an ADR that was never accepted. You cannot deprecate something that was never decided. These rules are enforced by data, not convention.

---

## The Conway Corollary

> "Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure.", Melvin Conway, 1967

Conway's Law is not a suggestion to be followed or a bug to be fixed. It is a law of nature, as inescapable as gravity. Your architecture will mirror your communication structure whether you design for it or not. The question is whether it mirrors the *official* communication structure (the org chart) or the *actual* communication structure (who talks to whom, who reviews whose code, who shares a Slack channel).

Blueprint's Conway's Law analyzer (`/blueprint:evaluate conways`) uses git blame, not the org chart. It asks: do module boundaries align with ownership boundaries? Are there shared modules nobody clearly owns? Does the coupling between modules force communication between people who don't naturally coordinate?

This is the dimension of architectural health that most frameworks completely ignore, and it's often the most consequential. A perfectly designed system that doesn't match how the team works will be slowly reshaped by the team's communication structure until it does. Usually in the worst possible way.

---

## Further Reading

- [The Cranky Senior Engineer](the-cranky-senior-engineer.md): Why the persona makes the message land
- [Decision Debt](decision-debt.md): What happens when hypotheses are deferred instead of tested
- [The Decision Lifecycle](../architecture/decision-lifecycle.md): The state machine that enforces all of this
