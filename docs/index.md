---
title: "Blueprint: Architecture Decision Records with Teeth"
description: "A Claude Code plugin for architectural governance. 42 skills, 21 agents, 15 architecture paradigms. Researched before proposed, challenged before accepted, audited after implemented."
template: home.html
hide:
  - navigation
  - toc
  - path
---

# Blueprint

**Architecture Decision Records with teeth.**

A Claude Code plugin that treats architectural decisions as first-class engineering artifacts: researched before they're proposed, challenged before they're accepted, audited after they're implemented, and revisited when the world changes. Every agent speaks with the voice of a senior engineer who has watched too many "temporary" decisions become permanent load-bearing walls.

---

## Three Commands

That's all you need to start.

```
/blueprint:init                       Bootstrap from your codebase
/blueprint:new "topic"                Record a decision
/blueprint:review N                   Challenge it before accepting
```

Initialize. Decide. Challenge. Accept. Verify. Repeat.

```
/blueprint:new --research "use Redis" Evidence-backed analysis first
/blueprint:transition accept 3        Accept after challenge
/blueprint:audit                      Does the code follow it?
```

Everything else (research, devil's advocacy, compliance auditing, drift detection, fitness functions, risk maps, decision debt tracking) happens through the 39 other commands. You think about *what* to decide. Blueprint handles *how* to govern it.

---

## What is Blueprint?

Blueprint is built around a single claim: **architectural decisions are hypotheses, not declarations**.

When you write "use PostgreSQL for primary storage," you are not stating a fact. You are stating a bet. You are betting that PostgreSQL's properties will serve your needs better than the alternatives, given your constraints, for the foreseeable future. Like any hypothesis, it should be falsifiable, evidence-based, challengeable, and revisable.

Most ADR implementations treat decisions as write-once artifacts. Blueprint treats them as living hypotheses with a formal lifecycle: from Proposed through Review to Accepted, then continuously verified through audits, fitness functions, and drift detection.

!!! info "The Decision Lifecycle"

    You propose a hypothesis. The devil's advocate challenges it across 5 dimensions. If it survives, it's accepted. Then the compliance auditor verifies the code follows it. The drift detector watches for erosion. The debt tracker monitors deferred decisions. The retrospective catches band-aid fixes. Nothing is write-once. Everything is governed.

Read more in [Decisions as Hypotheses](philosophy/decisions-as-hypotheses.md).

---

## At a Glance

| | |
|---|---|
| **42 commands** | Lifecycle management, analysis, evaluation, documentation, continuous governance, strategic planning, and system administration |
| **21 agents** | Researcher, devil's advocate, 5 evaluation dimensions, reflexion analyzer, strategic analyzer, and 12 more, each with a single responsibility |
| **15 paradigms** | DDD, ATAM, Wardley Maps, Reflexion Models, C4, arc42, 4+1 Views, Risk Storming, and more, curated from 109 sources |
| **10 hooks** | Automatic governance triggers across the plugin ecosystem |
| **8 config files** | Domain-specific language in TOML, where data outlives code |

---

## Why "Blueprint"?

The name references the architectural tradition of blueprints: the detailed plans that must exist before construction begins, that are reviewed by multiple stakeholders, that are revised when requirements change, and that serve as the authoritative reference when questions arise during building.

Software architecture deserves the same discipline. Blueprint provides it.

---

## Installation

```bash
# Via pragnition-plugins marketplace (recommended)
/plugin marketplace add pragnition/claude-plugins
/plugin install blueprint@pragnition-plugins

# Via npm
npx claude-blueprint install --global
npx claude-blueprint verify

# Via local path
claude plugin add /path/to/blueprint
```

### Quick Start

```bash
/blueprint:init                   # Scan codebase, infer existing decisions
/blueprint:new "use TypeScript"   # Record a decision
/blueprint:review 1               # Devil's advocate challenge
/blueprint:transition accept 1    # Accept if it survives
```

---

## Learn More

- [Philosophy](philosophy/index.md): Why Blueprint exists and the ideas behind it
- [Decisions as Hypotheses](philosophy/decisions-as-hypotheses.md): The epistemological foundation
- [The Cranky Senior Engineer](philosophy/the-cranky-senior-engineer.md): Why directness matters
- [Decision Debt](philosophy/decision-debt.md): Why deferred decisions compound faster than code debt
