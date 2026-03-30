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

## Wireframe References (MANDATORY)

Before generating the HTML dashboard, you MUST read these wireframe files for the
canonical design system. Do not invent your own styles — extract the exact CSS,
colors, fonts, and component patterns from these files:

1. **`wireframes/architecture_dashboard/code.html`** — Main dashboard layout: sidebar
   navigation, metric cards, mini knowledge graph, decision timeline, suggested actions.
   Dark theme with teal/cyan primary.

2. **`wireframes/adr_knowledge_graph/code.html`** — Knowledge graph view: force-directed
   graph with side panel showing ADR details, relationships, and context.

3. **`wireframes/governance_health/code.html`** — Health view: decision debt table,
   architecture drift chart, fitness function monitor cards, governance event log.

4. **`wireframes/adr_editor_ide/code.html`** — ADR editor view (if applicable).

**Design system (from wireframes):**
- **Theme:** Dark (`class="dark"`)
- **Background:** `#0b0e14` (surface), `#161a21` (surface-container), `#1c2028` (surface-container-high)
- **Primary:** `#8ff5ff` (teal/cyan)
- **Secondary:** `#8dedec`
- **Tertiary/Warning:** `#ffb155` / `#fe9d00`
- **Error:** `#ff716c`
- **Fonts:** Space Grotesk (headlines/labels), Inter (body), JetBrains Mono (code)
- **Border radius:** 0.125rem default, 0.25rem lg, 0.5rem xl, 0.75rem full
- **Text on surface:** `#ecedf6`

**How to use wireframes:**
- Read the wireframe HTML files listed above
- Extract the inline `<style>` blocks and the Tailwind config colors
- Use the exact same component patterns: sidebar, metric cards, tables, graph nodes
- The generated `docs/adr/web/index.html` must look like it belongs in the same application
- Copy CSS verbatim from the wireframes where possible — do not approximate

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

After the terminal display, generate the dashboard by:

1. Read the template from `assets/dashboard.html` in the blueprint plugin directory
   (find it via: the plugin's install location, or `~/pragnition/blueprint/assets/dashboard.html`)
2. Build the `DATA` object from the metrics gathered in Step 1
3. Replace the placeholder `__BLUEPRINT_DATA__` in the template with the JSON data
4. Create `docs/adr/web/` directory if it doesn't exist
5. Write to `docs/adr/web/index.html` in the project root
6. Open in browser

The dashboard lives in the project at `docs/adr/web/index.html` — not a temp file.
This means it persists, can be committed, and can be served as a static site.
Each run of `/blueprint:status` overwrites it with fresh data.

**The DATA object structure:**

```javascript
{
  generated: "2026-03-30",
  health_score: "ADEQUATE",      // STRONG / ADEQUATE / CONCERNING / CRITICAL
  debt_score: 14,
  triggers_met: 1,
  operations: {
    audit: "2026-03-18",         // ISO date or null
    evaluation: null,
    retro: "2026-03-27",
    drift: null,
    status: "2026-03-30"
  },
  adrs: [
    { number: "ADR-0001", title: "Use ADRs...", status: "Accepted",
      category: "Process", date: "2026-03-30", severity: "Medium",
      trigger: null, trigger_met: false, debt_score: 0 },
    // ... one entry per ADR
  ],
  edges: [
    { from: "ADR-0003", to: "ADR-0008", type: "DEPENDS_ON" },
    // ... from relationships.toml
  ]
}
```

**The HTML dashboard includes (4 tabs, matching the wireframe design system):**

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
# Open the dashboard (platform-specific)
open docs/adr/web/index.html     # macOS
xdg-open docs/adr/web/index.html # Linux
start docs/adr/web/index.html    # Windows
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
