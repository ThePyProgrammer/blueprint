---
title: "Documentation"
description: "Commands for architecture documentation: ARCHITECTURE.md generation, C4 diagrams, plain English explanations, stakeholder digests, timelines, exports, and view tagging."
---

# Documentation

These seven commands turn architectural decisions into documentation that different audiences can actually use, from bird's-eye codemaps to non-technical stakeholder summaries.

---

### `/blueprint:architect`: Generate ARCHITECTURE.md

Generate or update `ARCHITECTURE.md` following [matklad's philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html): a bird's-eye codemap that helps newcomers build a mental model of the system. Maps modules, documents invariants from ADRs, identifies layer boundaries and cross-cutting concerns.

**Syntax:** `/blueprint:architect`

**Examples:**

```
/blueprint:architect
# Generate or update ARCHITECTURE.md from current codebase + accepted ADRs
```

!!! tip
    The `architecture-sync` hook automatically suggests updating ARCHITECTURE.md after ADR transitions. Accept the suggestion to keep the codemap in sync with decisions.

---

### `/blueprint:diagram`: C4 Architecture Diagrams

Auto-generate [C4 Model](https://c4model.com/) diagrams (System Context, Container, Component) from accepted ADRs and the relationship graph. Outputs Mermaid, Structurizr DSL, or PlantUML.

**Syntax:** `/blueprint:diagram [--format mermaid|structurizr|plantuml] [--level context|container|component]`

**Examples:**

```
/blueprint:diagram
# Default: Mermaid format, all levels

/blueprint:diagram --format structurizr --level container
# Structurizr DSL, container level only

/blueprint:diagram --format plantuml
# PlantUML output for all levels
```

---

### `/blueprint:eli5`: Plain English Explanation

Explain an ADR or the entire architectural landscape in plain English. No jargon, no unexpanded acronyms, concrete analogies for every technical concept.

**Syntax:** `/blueprint:eli5 [N]`

Without a number, explains the full landscape grouped by theme with a 30-second summary at the end. With a number, explains a single ADR with analogies, expanded acronyms, and "what this means for you" consequences.

**Examples:**

```
/blueprint:eli5
# "Your system is like a restaurant. The kitchen (backend) and dining room (frontend)
#  are separated by a pass-through window (API). Decision 3 says the window only accepts
#  typed order slips (TypeScript interfaces), not shouted requests..."

/blueprint:eli5 7
# Explain ADR-0007 specifically, with analogies and consequences
```

!!! tip
    `eli5` exists because ADRs are written for the people who make decisions, not the people who live with them. Use it for onboarding or for explaining architecture to non-technical stakeholders.

---

### `/blueprint:digest`: Stakeholder Summary

Generate a non-technical stakeholder digest of architectural decisions. For PMs, executives, and non-technical stakeholders who need the what / why / cost / risk without the code.

**Syntax:** `/blueprint:digest`

**Examples:**

```
/blueprint:digest
# One-page summary: decisions made, risks identified, costs estimated,
# timeline implications, in language a PM can take to a planning meeting
```

---

### `/blueprint:timeline`: Architecture Evolution Narrative

Generate a narrative timeline of architectural evolution through ADR history. Shows how decisions built on each other, when things changed, and the arc of the architecture.

**Syntax:** `/blueprint:timeline`

**Examples:**

```
/blueprint:timeline
# "Era 1 (Jan-Mar): Foundation. Chose TypeScript, monorepo, PostgreSQL
#  Era 2 (Mar-May): Scale. Added Redis caching, moved to event-driven
#  Pivot (May): Superseded REST with GraphQL after 3 months of pain
#  Era 3 (May-Jul): Maturity. Formal governance, fitness functions in CI"
```

---

### `/blueprint:export`: Standardized Documentation Export

Export the ADR collection into standardized documentation formats. Currently supports [arc42](https://arc42.org/) (12-section template).

**Syntax:** `/blueprint:export arc42`

**Examples:**

```
/blueprint:export arc42
# Generate arc42-compliant documentation from ADRs + ARCHITECTURE.md
```

---

### `/blueprint:views`: 4+1 View Tagging

Tag ADRs with architectural views based on [Kruchten's 4+1 View Model](https://en.wikipedia.org/wiki/4%2B1_architectural_view_model) (1995) for stakeholder-appropriate filtering.

**Views:** logical, development, process, physical, scenario.

**Syntax:** `/blueprint:views [tag|list|filter] [view]`

**Examples:**

```
/blueprint:views tag 7 logical
# Tag ADR-0007 as relevant to the logical view

/blueprint:views filter development
# Show only ADRs relevant to the development view

/blueprint:views list
# Show all ADRs with their view tags
```
