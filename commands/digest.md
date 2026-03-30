---
name: blueprint:digest
description: >
  Generate a non-technical stakeholder digest of architectural decisions. For PMs, executives,
  and non-technical stakeholders who need the what/why/cost/risk without the code. Use when:
  "stakeholder summary", "executive digest", "architecture digest", "non-technical summary",
  "explain decisions to management", "board summary", or before architecture review meetings.
---

# Stakeholder Architecture Digest

One-page summary for people who allocate budget and set priorities. No code, no jargon,
no implementation details. What was decided, why, what it costs, and what risks it carries.

> Different audience than eli5. ELI5 is for developers who need to understand the system.
> Digest is for people who need to understand the *decisions* — and their business implications.

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — ADR directory
- `config/relationships.toml` — decision dependencies
- `config/taxonomy.toml` — severity levels

## Process

### Step 1: Read All Decisions

Read all ADR files. Categorize by:
- Status (Accepted, Proposed, Deferred, Rejected, Deprecated, Superseded)
- Category from taxonomy (Technology, Architecture, Data, Deployment, Security, etc.)
- Severity (High, Medium, Low)
- Date

### Step 2: Generate Digest

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ARCHITECTURE DIGEST — [Project Name]
 Generated: [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Summary

[2-3 sentences: what the system is, how many architectural decisions
have been made, overall health/maturity assessment]

Decisions: [N] accepted | [M] proposed | [K] deferred

## Key Decisions

[Top 5-7 highest-severity accepted decisions. For each:]

### [Decision title — no technical terms]

**What:** [One sentence — what was decided, in business language]
**Why:** [One sentence — what problem this solves or risk it mitigates]
**Trade-off:** [One sentence — what was given up]
**Status:** Accepted [date]

[Group by theme if possible: "Data & Storage", "Security", "Performance"]

## Pending Decisions ([N])

[Proposed ADRs awaiting review — these need attention:]

- **[Title]** — [Why it matters to the business. What's blocked until decided.]

## Deferred Decisions ([N])

[Decisions explicitly postponed — these are conscious risks:]

- **[Title]** — Deferred because [reason]. Trigger: [when to revisit].
  **Risk if ignored:** [business impact of never deciding]

## Risk Register

| Risk | Severity | Source | Mitigation |
|------|----------|--------|------------|
| [business-language risk] | High/Med/Low | ADR-NNNN | [what's being done] |

[Derive from ADR consequences sections — translate technical risks
to business risks: "Data loss" not "Missing ACID guarantees"]

## Decision Timeline

[Chronological narrative — 3-5 sentences:]
"In [month], the team decided to [first major decision]. This was followed
by [second decision] in [month], which [enabled/constrained] [what].
Currently, [N] decisions are pending review."

## What Needs Attention

[Actionable items for stakeholders — at most 3:]
1. [Most urgent — what decision needs to be made and by when]
2. [Second priority]
3. [Upcoming trigger that will require a decision]
```

### Step 3: Tone

- No technical terms. "Database" is ok. "ORM" is not.
- Focus on business impact. "This saves $X/month" not "this reduces query latency"
- Risks in terms stakeholders understand: "data loss", "security breach", "launch delay"
- Short. If it's longer than one printed page, it's too long.
- No code snippets, file paths, or architecture diagrams. This is prose.
