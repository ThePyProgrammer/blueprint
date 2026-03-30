---
name: blueprint:help
description: >
  Show the full ADR command reference with contextual suggestions based on current ADR state
  and conversation history. Use when: "adr help", "what adr commands are there?", "what can I
  do with adrs?", "help with adrs".
---

# ADR Help

Display the full command reference with context-aware next-action suggestions.

## Process

### Step 1: Detect Current State

1. Read `config/state.toml` from the parent `adr/` directory for ADR directory location
2. If no directory cached, detect: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`
3. Glob for all ADR files (`[0-9][0-9][0-9][0-9]-*.md`)
4. Extract status from each ADR (count Proposed, Accepted, Rejected, Deferred, Deprecated, Superseded)
5. Read `config/state.toml` for last audit/evaluation/retro dates
6. Scan recent conversation history for architectural topics being discussed
7. Check if application code exists (glob for source files beyond wireframes/docs)

### Step 2: Display Command Reference

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADR ► COMMAND REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Lifecycle

  /blueprint:new "topic"              Create a new ADR from interview
  /blueprint:new --research "topic"   Research options first, then create ADR
  /blueprint:list                     List all ADRs with status + suggestions
  /blueprint:review N                 Challenge + review a Proposed ADR
  /blueprint:transition accept N      Accept an ADR (no challenge)
  /blueprint:transition reject N      Reject a Proposed ADR
  /blueprint:transition defer N       Defer a Proposed ADR
  /blueprint:transition deprecate N   Deprecate an Accepted ADR
  /blueprint:search "term"            Find ADRs about a topic

## Analysis

  /blueprint:impact N                 Check ADR for conflicts with other decisions
  /blueprint:audit                    Verify codebase follows accepted ADRs
  /blueprint:retro                    Post-fix retrospective — band-aid or systemic?
  /blueprint:rearchitect "topic"      Research + replace an existing decision

## Architecture Evaluation Team

  /blueprint:evaluate                 Run all 5 evaluators in parallel
  /blueprint:evaluate consistency     Pattern adherence, naming, layering, deps
  /blueprint:evaluate bugs            Complexity hotspots, coupling, boundaries
  /blueprint:evaluate maintainability Dependency health, abstractions, tech debt
  /blueprint:evaluate testing         Test pyramid, anti-pattern tests, coverage
  /blueprint:evaluate conways         Team-architecture alignment, ownership

## Setup

  /blueprint:init                    Bootstrap blueprint onto existing codebase

## Documentation

  /blueprint:architect                Generate/update ARCHITECTURE.md (matklad style)
  /blueprint:eli5                     Explain an ADR or the whole landscape in plain English
  /blueprint:eli5 N                   Explain a single ADR — no jargon, all analogies

## Continuous Governance

  /blueprint:fitness                   Generate CI-runnable architecture tests from ADRs
  /blueprint:drift                     Detect gradual architecture erosion over time
  /blueprint:debt                      Track deferred decisions and overdue triggers
  /blueprint:guard                     Pre-commit check against ADR invariants

## Reporting

  /blueprint:digest                    Non-technical stakeholder summary (1-page)
  /blueprint:timeline                  Narrative evolution of architectural decisions

## System

  /blueprint:status                    Governance dashboard + knowledge graph (browser)
  /blueprint:health                    Self-diagnostic — check ADR system consistency
  /blueprint:hooks                     Configure automatic blueprint triggers
  /blueprint:hooks install all         Enable all automation hooks

## Meta

  /blueprint:help                     This reference + contextual suggestions
```

### Step 3: Display Contextual Suggestions

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ▶ SUGGESTED NEXT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Apply these rules in order (show up to 3 suggestions):

1. **Proposed ADRs exist:** "You have [N] Proposed ADR(s) awaiting review: [titles]. Run `/blueprint:review [N]` to challenge and decide."
2. **Conversation discussed an architectural topic without an ADR:** "This conversation discussed [topic] — consider `/blueprint:new \"[topic]\"` to document the decision."
3. **Application code exists, no recent audit:** "You have [N] accepted ADRs and application code. Run `/blueprint:audit` to check compliance."
4. **Application code exists, no recent evaluation:** "Run `/blueprint:evaluate` for a full architecture health check."
5. **Recent fix committed:** "Recent changes detected. Run `/blueprint:retro` to check if they warrant an ADR."
6. **No ADRs exist:** "No ADRs found. Run `/blueprint:new \"[topic]\"` to create your first decision record."
7. **All ADRs Accepted, no action needed:** "All [N] ADRs are Accepted. No pending actions."

### Step 4: Show ADR Summary Stats

```
ADRs: [total] total | [N] Accepted | [N] Proposed | [N] other
Last audit: [date or "never"]
Last evaluation: [date or "never"]
Last retro: [date or "never"]
```
