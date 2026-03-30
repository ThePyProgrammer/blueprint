---
name: blueprint:status
description: >
  Architecture governance dashboard with visual knowledge graph. Shows ADR status overview,
  decision debt score, operation history, relationship graph, and governance health metrics
  in an IDE-like interface. Use when: "blueprint status", "architecture dashboard", "show
  governance health", "adr graph", "decision graph", "how are our decisions?", or just
  "status".
---

# Architecture Governance Dashboard

Renders a rich, visual governance dashboard with a knowledge graph of ADR relationships.
Two output modes: terminal (structured text) and browser (interactive HTML).

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — last operation dates, ADR directory
- `config/relationships.toml` — ADR dependency graph
- `config/lifecycle.toml` — status definitions
- `config/taxonomy.toml` — severity levels, categories

## Process

### Step 1: Gather All Metrics

**ADR inventory:**
- Read all ADR files, extract status, date, category, severity
- Count by status: Accepted, Proposed, Rejected, Deferred, Deprecated, Superseded
- Identify the most recent ADR and oldest unreviewed Proposed ADR

**Decision debt:**
- Count Deferred ADRs
- For each, check trigger conditions against codebase (same logic as `/blueprint:debt`)
- Calculate debt score: Σ(severity × age_months × dependency_count)
- Flag any with triggered conditions

**Operations recency:**
- From `config/state.toml`: last audit, evaluation, retro, drift check dates
- Calculate days since each

**Relationship graph:**
- From `config/relationships.toml`: nodes (ADRs) and edges (dependencies, conflicts, supersessions)
- If graph is empty/sparse, suggest running `/blueprint:impact` on key ADRs to populate it

**Fitness function coverage:**
- Glob for `tests/architecture/` or equivalent
- Count how many accepted ADRs have corresponding fitness functions
- Calculate coverage percentage

**Guard status:**
- Check if pre-commit hook is installed (grep settings.json or .git/hooks/)

### Step 2: Render Terminal Dashboard

Always display this first:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Decisions

  Accepted    ██████████████████████████████  28
  Proposed    ██                              2   ← needs review
  Deferred    █                               1   ← 1 trigger met
  Rejected    ░                               0
  Superseded  ░                               0
  Total: 31

## Governance Health

  | Metric              | Value        | Status |
  |---------------------|-------------|--------|
  | Decision debt score | 14          | ⚠      |
  | Last audit          | 12 days ago | ✓      |
  | Last evaluation     | never       | ✗      |
  | Last retro          | 3 days ago  | ✓      |
  | Last drift check    | never       | ✗      |
  | Fitness coverage    | 8/12 (67%)  | ⚠      |
  | Guard hook          | not installed| ✗      |

## Relationship Graph (text)

  ADR-0002 (React+FastAPI) ◄── ADR-0003 (two-stage pipeline)
       │                            │
       └── ADR-0008 (constrain      └── ADR-0005 (persona)
            to ICD-10-AM)

  ADR-0006 (defer auth) ···· DEFERRED [trigger: user count >50]

  Clusters: 3 connected components, 2 isolated ADRs

## Suggested Actions

  1. /blueprint:review 29 — Proposed ADR awaiting review
  2. /blueprint:evaluate — No evaluation on record
  3. /blueprint:debt — 1 deferred trigger appears met
```

### Step 3: Generate Interactive HTML Dashboard

After the terminal display, generate an interactive HTML file with a visual knowledge
graph and offer to open it:

```bash
# Write to a temp file and open
/tmp/blueprint-dashboard-{timestamp}.html
```

**The HTML dashboard includes:**

**Tab 1: Knowledge Graph (main view)**

An interactive graph visualization using inline JavaScript (no external dependencies):
- **Nodes** = ADRs, colored by status:
  - Accepted: blue
  - Proposed: yellow
  - Deferred: orange
  - Rejected: gray
  - Deprecated: faded gray
  - Superseded: gray with strikethrough
- **Node size** = severity (High = large, Medium = medium, Low = small)
- **Edges** = relationships, styled by type:
  - DEPENDS_ON: solid arrow
  - CONFLICTS: red dashed line
  - SUPERSEDES: thick arrow with ×
  - MODIFIES_SCOPE: dotted arrow
  - RELATED: thin gray line
- **Hover** on a node: show ADR title, status, date, category
- **Click** on a node: show full ADR summary in a side panel
- **Clusters** visually grouped by category (Technology, Architecture, etc.)
- **Force-directed layout** using simple physics simulation

Use a self-contained SVG or Canvas renderer — no D3.js or external CDN.
The file must work offline with zero dependencies.

**Tab 2: Decision Timeline**

Horizontal timeline showing ADRs by date:
- Color-coded by status
- Supersession chains shown as connecting arcs
- Hover for details

**Tab 3: Governance Metrics**

The same metrics as the terminal dashboard but with:
- Sparkline-style history (from state.toml evaluation/retro history)
- Color-coded health indicators
- Clickable actions that copy the relevant `/blueprint:` command

**Tab 4: Decision Debt**

Table of deferred decisions with:
- Trigger conditions and their status (met/approaching/not yet)
- Debt score with color coding
- Age in days
- Dependency count

### Step 4: Open Dashboard

```bash
# Write HTML to temp file
# Open in browser (platform-specific)
open /tmp/blueprint-dashboard-{timestamp}.html     # macOS
xdg-open /tmp/blueprint-dashboard-{timestamp}.html # Linux
start /tmp/blueprint-dashboard-{timestamp}.html    # Windows
```

Tell the user: "Dashboard opened in your browser. The terminal summary above is always
available without the browser."

### Step 5: Update State

Set `last_status_check` in `config/state.toml` to today.

## Fallback

If the project has no ADRs yet, show:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No ADRs found. Run /blueprint:init to bootstrap from existing context.
```
