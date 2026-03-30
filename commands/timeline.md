---
name: blueprint:timeline
description: >
  Generate a narrative timeline of architectural evolution through ADR history. Shows how
  decisions built on each other, when things changed, and the arc of the architecture. Use
  when: "show architecture timeline", "decision history", "how did we get here?", "architecture
  evolution", "timeline of decisions", or for onboarding and strategic planning.
---

# Architecture Evolution Timeline

The story of how the architecture evolved, told through its decisions. Not a git log —
the narrative arc that explains how each decision enabled or constrained the next.

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — ADR directory
- `config/relationships.toml` — supersession chains, dependencies

## Process

### Step 1: Read and Sort

Read all ADR files. Extract:
- ADR number, title, status
- Date proposed and date decided
- Supersedes/superseded-by relationships
- Category from taxonomy

Sort chronologically by date proposed.

### Step 2: Identify Eras

Group decisions into eras — periods where related decisions clustered:

- **Foundation era:** First decisions that established the base (stack, architecture, deployment)
- **Feature eras:** Groups of decisions related to specific capabilities
- **Pivot points:** Superseded decisions that mark a change in direction
- **Current era:** Recent and pending decisions

### Step 3: Build the Narrative

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► ARCHITECTURE TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Era 1: Foundation] — [date range]

[Narrative paragraph: what was decided and why, how decisions
connected to each other]

  [date] ── ADR-0001: [title]                    ✓ Accepted
       └── ADR-0002: [title]                    ✓ Accepted
       └── ADR-0003: [title]                    ✓ Accepted
            └── ADR-0008: [title] (depends on)  ✓ Accepted

[1-2 sentences: what this era established and what it enabled]

## [Era 2: ...] — [date range]

  [date] ── ADR-0009: [title]                    ✓ Accepted
  [date] ── ADR-0010: [title]                    ✗ Rejected
       └── ADR-0011: [title] (replaced 0010)    ✓ Accepted

[Note rejections and supersessions — these are the most interesting
parts of the story. Why did the team change direction?]

## Pivot Points

[Decisions that marked a significant change in direction:]

- **[date]: ADR-NNNN superseded ADR-MMMM** — [why the original decision
  was replaced and what changed in the understanding]

## Current State

Active decisions: [N]
Pending review: [M]
Deferred: [K] (with triggers)
Superseded: [J]

## What's Next

[Based on deferred decisions, pending proposals, and decision debt:]
- [Decision that's coming up]
- [Trigger that's approaching]
```

### Step 4: Visualize Supersession Chains

If any ADRs have been superseded, show the chain:

```
ADR-0003 (original) ──superseded by──→ ADR-0015 ──superseded by──→ ADR-0022 (current)
  "Use Redis"           "Use Memcached"              "Use built-in cache"
```

These chains tell the story of how understanding evolved.

### Step 5: Connect to Relationship Graph

Use `config/relationships.toml` to show dependency clusters — groups of
ADRs that must be considered together. A dependency cluster is a set
of decisions where changing one requires reviewing all the others.

## Tone

This is a story, not a report. It should read like a project retrospective
written by someone who understands why things happened, not just what happened.
The senior engineer persona applies but with a historian's perspective —
connecting cause and effect across time.
