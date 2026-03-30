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
- `{adr_directory}/.state/state.toml` — ADR directory
  (auto-detect adr_directory: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`)
- `config/taxonomy.toml` — severity levels
- `{adr_directory}/.state/evidence.toml` — evidence expiry dates and epistemic levels

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

### Step 5: Evidence Debt (v2)

Also surface **evidence debt** from `{adr_directory}/.state/evidence.toml`:

- **Expired evidence:** Accepted ADRs where `Evidence-Expires` date has passed
- **Unverified evidence:** Accepted ADRs with `Evidence-Level: L0` (AI-generated, never validated)
- **Stale URLs:** ADRs with dead source URLs in References section

Include in report:

```
## Evidence Debt

| ADR | Issue | Evidence Level | Expires | Action |
|-----|-------|---------------|---------|--------|
| 0005 | Evidence expired 2 months ago | L1 | 2026-01-30 | `/blueprint:evidence ADR-0005` |
| 0012 | AI research never validated | L0 | 2026-05-30 | Validate empirically → L2 |
```

Evidence debt is a distinct category because it affects accepted (not deferred) ADRs.
A decision that was well-supported when made but whose evidence has expired is
actively misleading — worse than a decision that was honestly deferred.

Suggest `/blueprint:evidence` for expired evidence and `/blueprint:new --research`
for decisions that need re-investigation.
