---
name: blueprint:debt
description: >
  Track decision debt — deferred ADRs with trigger conditions that may have been met.
  Surfaces decisions that are due for revisiting. Use when: "check decision debt",
  "any deferred decisions due?", "decision debt", "what decisions are overdue?",
  "deferred adrs", or periodically to prevent forgotten deferrals.
---

# Decision Debt Tracker

Deferred ADRs are invisible liabilities. Each has a trigger condition — "revisit when X" —
but nobody monitors whether X has happened. This skill does.

> Decision debt compounds faster than technical debt. A deferred technology choice
> becomes a deferred architecture choice becomes a deferred rewrite.

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — ADR directory
- `config/taxonomy.toml` — severity levels

## Process

### Step 1: Find All Deferred Decisions

Read all ADR files. Filter to status `Deferred`. For each, extract:
- The trigger condition (from metadata or Consequences section)
- When it was deferred (date)
- The severity of the decision (from taxonomy)
- What depends on this decision (from relationships.toml)

Also scan for quasi-deferred decisions in Accepted ADRs:
- Consequences that say "revisit when...", "defer until...", "reconsider if..."
- TODO items in the decision or consequences sections
- v2/future references that imply deferred scope

### Step 2: Evaluate Trigger Conditions

For each deferred decision, check if the trigger condition has been met:

**Codebase triggers:**
- "Revisit when we have >N files" → count source files
- "Defer until auth is implemented" → grep for auth code
- "Revisit when we add a second database" → grep for new DB imports
- "Defer until performance matters" → check for performance-related code/config

**Time triggers:**
- "Revisit in 6 months" → compare defer date to today
- "Reconsider at v2" → check version in package.json

**External triggers:**
- "Defer until data is available" → flag as "check manually"
- "Revisit when team grows" → flag as "check manually"

### Step 3: Calculate Decision Debt Score

```
Decision Debt = Σ (severity × age_months × dependency_count)
```

Higher score = more urgent. A high-severity decision deferred 8 months ago with
3 other decisions depending on it is more urgent than a low-severity decision
deferred last week.

### Step 4: Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► DECISION DEBT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total deferred: [N] explicit + [M] implicit
Triggers met: [K] — action needed
Decision debt score: [score]

## Overdue Decisions (triggers met)

| ADR | Decision | Trigger | Deferred | Age |
|-----|----------|---------|----------|-----|
| ... | ... | [trigger — MET] | [date] | [N] months |

## Upcoming Decisions (triggers approaching)

| ADR | Decision | Trigger | Status |
|-----|----------|---------|--------|
| ... | ... | [trigger — approaching] | [evidence] |

## Implicit Deferrals (in accepted ADRs)

| ADR | Deferred Item | Trigger |
|-----|--------------|---------|
| ... | "revisit when..." from consequences | [condition] |

## Recommendations
1. [Most urgent — trigger met, high severity, many dependents]
2. [Next priority]
```

For triggered decisions, suggest `/blueprint:new --research` to make the deferred
decision with fresh evidence.
