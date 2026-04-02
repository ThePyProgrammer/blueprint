---
title: "Lifecycle"
description: "Commands for the ADR decision lifecycle: advise, create, list, review, challenge, transition, search, help, and rearchitect."
---

# Lifecycle

These nine commands manage the full lifecycle of an architectural decision, from initial consultation through creation, review, acceptance, and eventual supersession.

---

### `/blueprint:advise`: Architecture Advice Process

Structured consultation before proposing a decision. Implements the [Architecture Advice Process](https://martinfowler.com/articles/scaling-architecture-conversationally.html) (Harmel-Law, ThoughtWorks Radar Trial 2025): record who was consulted, what advice was given, and how it influenced the decision.

**Syntax:** `/blueprint:advise "topic"`

**Examples:**

```
/blueprint:advise "switch from REST to gRPC for internal services"
# Records consultation: who was asked, what they said, how it influenced the proposal

/blueprint:advise "introduce feature flags"
# Structured interview about alternatives, constraints, and stakeholder concerns
```

!!! tip
    Use `advise` before `new` when the decision affects multiple teams or domains. The consultation record becomes part of the ADR context, showing that affected parties were heard.

---

### `/blueprint:new`: Create an ADR

Create a new Architecture Decision Record through a structured interview. Captures context, constraints, alternatives considered, the decision, and consequences.

**Syntax:** `/blueprint:new "topic" [--research]`

The `--research` flag spawns a researcher agent that evaluates alternatives with evidence before generating the ADR. The research brief covers: options analysis, benchmark data, ecosystem maturity, team experience fit, and a recommendation.

**Examples:**

```
/blueprint:new "use PostgreSQL for primary storage"
# Interview-based ADR creation

/blueprint:new --research "use PostgreSQL for primary storage"
# Researcher agent evaluates alternatives first, then creates the ADR

/blueprint:new "monorepo vs polyrepo"
# Capture a structural decision with alternatives analysis
```

!!! tip
    Always use `--research` for decisions with multiple viable alternatives. The researcher agent doesn't just list options. It evaluates them with evidence and states which one is clearly better (if one is).

---

### `/blueprint:list`: Show All ADRs

Display all ADRs with status, date, and contextual next-action suggestions. Groups by bounded context when contexts are defined.

**Syntax:** `/blueprint:list [--status STATUS] [--context CTX] [--flat]`

- `--status Proposed` filters to a specific status
- `--context payments` filters to a bounded context
- `--flat` disables context grouping

**Examples:**

```
/blueprint:list
# Full table grouped by context, with suggested next actions

/blueprint:list --status Proposed
# Show only proposed ADRs (the ones needing review)

/blueprint:list --flat
# Numbered list without context grouping
```

---

### `/blueprint:review`: Devil's Advocate Challenge

Spawn a devil's advocate agent that adversarially challenges a proposed ADR across 5 dimensions before acceptance. This is the *antithesis* in the Hegelian dialectic: thesis (proposed ADR) → antithesis (challenge) → synthesis (stronger decision).

**Syntax:** `/blueprint:review N`

**The five challenge dimensions:**

1. **Hidden assumptions:** what is the proposer taking for granted?
2. **Unconsidered alternatives:** what options weren't evaluated?
3. **Missing consequences:** what downstream effects were overlooked?
4. **Codebase fit:** does this decision align with the existing architecture?
5. **Team capability:** can the team actually execute this decision?

**Examples:**

```
/blueprint:review 4
# Full adversarial challenge of ADR-0004

/blueprint:review 12
# Challenge a decision about to be accepted
```

!!! tip
    Review *every* ADR before accepting. A decision that has never been challenged is a decision that has never been tested. The devil's advocate finds blind spots that the proposer cannot see because they are too close to the decision.

---

### `/blueprint:challenge`: DCAR Forces Evaluation

Structured forces evaluation using the [Decision-Centric Architecture Reviews](https://ieeexplore.ieee.org/document/6449237/) framework (van Heesch et al., 2014). Analytically weighs arguments for and against a decision, generates a force-balance report, and scores as confirmed / needs-re-evaluation / reconsider.

**Syntax:** `/blueprint:challenge N`

The difference from `review`: `review` is *adversarial* (find blind spots), `challenge` is *analytical* (weigh forces systematically).

**Examples:**

```
/blueprint:challenge 7
# Structured forces analysis: for/against/balance/verdict

/blueprint:challenge 3
# Re-evaluate an accepted decision that may need revisiting
```

---

### `/blueprint:transition`: Direct Lifecycle Transitions

Accept, reject, defer, or deprecate an ADR. Transitions are validated against the state machine in `config/lifecycle.toml`.

**Syntax:** `/blueprint:transition <action> N`

Actions: `accept`, `reject`, `defer`, `deprecate`.

**Examples:**

```
/blueprint:transition accept 4
# Accept ADR-0004 (requires prior review)

/blueprint:transition defer 8
# Defer with trigger condition

/blueprint:transition deprecate 2
# Mark as no longer applicable
```

---

### `/blueprint:search`: Find Decisions by Topic

Search ADRs by topic, technology, or keyword. Searches titles, context, decision sections, and the relationship graph.

**Syntax:** `/blueprint:search "term"`

**Examples:**

```
/blueprint:search "database"
# Find all ADRs mentioning databases

/blueprint:search "authentication"
# What did we decide about auth?
```

---

### `/blueprint:help`: Full Command Reference

Show the full command reference with contextual suggestions based on current ADR state and conversation history.

**Syntax:** `/blueprint:help`

---

### `/blueprint:rearchitect`: Supersede a Decision

Revisit and replace an existing architectural decision. Researches the new approach, drafts a superseding ADR, runs impact analysis, and transitions the old ADR(s) to Superseded.

**Syntax:** `/blueprint:rearchitect "topic"`

**Examples:**

```
/blueprint:rearchitect "switch from REST to GraphQL"
# Research → draft → impact check → supersede the REST decision

/blueprint:rearchitect "replace Redis with Valkey"
# Full supersession workflow with impact analysis
```

!!! tip
    `rearchitect` is the heavy-duty replacement workflow. For simple deprecation, use `/blueprint:transition deprecate N`.
