---
name: blueprint:onboard
description: >
  Walk a new team member through the project's architecture in 5 minutes. Summarizes
  key decisions, active contexts, governance mode, and what to read first. Use when:
  "onboard me", "I'm new", "explain the architecture", "what should I know?",
  "new developer walkthrough".
---

# Onboard — 5-Minute Architecture Walkthrough

Give a new developer everything they need to understand this project's architecture
in a single, scannable briefing. No digging through files. No asking around. One
command, full picture.

## Step 1: Read Project State

Read from parent `blueprint/` skill directory and project root:

- `state.toml` — ADR directory location, last operations (audit, evaluation dates)
- `relationships.toml` — how many ADRs exist, how connected they are
- `contexts.toml` — bounded contexts and owners
- `evidence.toml` — overall evidence health (L0/L1/L2 counts)
- `governance.toml` — current governance mode
- `docs/ARCHITECTURE.md` (if exists) — extract the codemap summary
- All accepted ADR files — count, titles, categories, severity

If `state.toml` does not exist or the ADR directory is empty (no ADRs found), skip
to the **No ADRs** fallback at the bottom.

## Step 2: Generate the Onboarding Briefing

Produce the briefing in this exact format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► NEW DEVELOPER ONBOARDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome. Here's what you need to know about this project's architecture.

## The Big Picture
[2-3 sentence summary from ARCHITECTURE.md codemap, or from the highest-severity ADRs]

## Key Decisions ([N] total ADRs)
[Top 5 most important ADRs by severity — title + 1-line summary of the decision]

1. ADR-NNNN: [title] — [decision in one sentence]
2. ...

## Domain Structure
[From contexts.toml — list bounded contexts with owners]
- [Context]: [description] (owner: [name], [N] ADRs)

## Governance
Mode: [lightweight/advised/governed/formal]
[1-sentence explanation of what this means for the new developer]

## Health Status
Last audit: [date or NEVER]
Last evaluation: [date or NEVER]
Evidence health: [L2/L1/L0 counts]
Decision debt: [N] deferred decisions

## What to Read First
1. docs/ARCHITECTURE.md — bird's-eye codemap
2. docs/adr/[most important ADR] — the foundational decision
3. docs/adr/[second most important] — the key technology choice

## Quick Commands for New Developers
- /blueprint:eli5 — plain English explanation of all decisions
- /blueprint:eli5 N — explain a specific ADR
- /blueprint:list — see all architectural decisions
- /blueprint:scope list — see which team/context owns what
- /blueprint:diagram — generate architecture diagrams
```

### Field rules

- **The Big Picture**: If `ARCHITECTURE.md` exists, pull the first 2-3 sentences from its
  codemap or overview section. If it does not exist, synthesize from the highest-severity
  accepted ADRs.
- **Key Decisions**: Sort accepted ADRs by severity (critical > high > medium > low). Show
  the top 5. If fewer than 5 exist, show all. Each entry is the ADR number, title, and
  the core decision condensed to one sentence.
- **Domain Structure**: If `contexts.toml` has no entries, show "No bounded contexts defined
  yet. Run `/blueprint:scope discover` to infer them from the codebase."
- **Governance**: Read the mode from `governance.toml`. Explain what it means practically:
  - `lightweight` — "You can propose and accept ADRs without approvals."
  - `advised` — "You must seek advice before proposing ADRs (Advice Process)."
  - `governed` — "ADRs require N approvals before acceptance."
  - `formal` — "ADRs go through phase-based gates with formal review."
  If `governance.toml` does not exist, default to "lightweight".
- **Health Status**: Pull last audit/evaluation dates from `state.toml` operations. Count
  deferred ADRs for decision debt. Pull evidence level counts from `evidence.toml`.
- **What to Read First**: Pick the two most important ADRs (highest severity, or earliest
  foundational decisions if severities are equal). Always list `ARCHITECTURE.md` first if
  it exists; if it does not, note "Not yet generated. Run `/blueprint:architect` to create it."

## Step 3: No ADRs Fallback

If no ADRs exist, show this shorter message instead:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► NEW DEVELOPER ONBOARDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This project hasn't recorded any architectural decisions yet.

That's not necessarily bad — but it means tribal knowledge is the only
documentation of why things are the way they are.

### Get Started
Run `/blueprint:init` to bootstrap the ADR system. It will:
- Scan your codebase for existing architectural patterns
- Infer decisions that have already been made implicitly
- Create the ADR directory structure and initial records

### Why Bother?
- New developers (like you) won't have to ask "why did we do it this way?"
- Decisions won't get relitigated every quarter
- The architecture stays intentional instead of accidental

Run `/blueprint:init` and then `/blueprint:onboard` again for the full briefing.
```
