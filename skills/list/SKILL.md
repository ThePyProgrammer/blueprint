---
name: blueprint:list
description: >
  List all ADRs with status, date, and contextual next-action suggestions. Use when:
  "list adrs", "show decisions", "what adrs do we have", "decision status", "show accepted
  decisions", "any proposed adrs?", "list deferred". Supports filtering by status, context,
  view, and evidence level. Defaults to context-grouped display when bounded contexts are defined.
  Examples: "/blueprint:list", "/blueprint:list --flat", "/blueprint:list --context=payments", "/blueprint:list --view=physical".
---

# List ADRs

Display all ADRs in a summary table with contextual suggestions for next actions.
Defaults to context-grouped display when bounded contexts are defined; use `--flat` for the traditional flat-numbered table.

## Process

### Step 1: Read ADR State

1. Read `state.toml` for ADR directory location
   (auto-detect adr_directory: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`)
2. If no directory cached, detect: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`
3. Glob for all ADR files (`[0-9][0-9][0-9][0-9]-*.md`)
4. For each file, extract: number, title (from heading), status, date proposed, date decided
5. Read `contexts.toml` — extract context assignment per ADR (Config Resolution Protocol: check `config/` then `{adr_directory}/.state/`)
6. Read `evidence.toml` — extract evidence level per ADR
7. Extract Views metadata if present

### Step 2: Apply Filters

Supports multiple filter types:
- **By status:** "list proposed", "show accepted", "any deferred?"
- **By context:** `--context=payments` — show only ADRs governing the payments bounded context
- **By view:** `--view=physical` — show only ADRs tagged with the physical view (Kruchten 4+1)
- **By evidence level:** `--evidence=L0` — show only ADRs with unverified evidence

### Step 3: Determine Display Mode

Decide between context-grouped and flat display:

1. If `--flat` flag is passed → use **flat display** (Step 4B)
2. If `contexts.toml` exists AND defines at least one `[contexts.*]` section → use **context-grouped display** (Step 4A)
3. Otherwise → use **flat display** (Step 4B)

### Step 4A: Context-Grouped Display (default when contexts exist)

When bounded contexts are defined and `--flat` is not passed, group ADRs by their context assignment.

**Building the groups:**
1. For each `[contexts.*]` section in `contexts.toml`, collect ADRs listed in its `governed_adrs` array
2. Collect ADRs listed in `cross_cutting_adrs` into a "cross-cutting" group
3. Any ADR not appearing in any context's `governed_adrs` or in `cross_cutting_adrs` goes into an "unmapped" group
4. Sort groups: named contexts alphabetically by context key, then "cross-cutting", then "unmapped" (if non-empty)
5. Within each group, sort ADRs by number ascending

**Rendering:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADR LIST — grouped by bounded context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## context-key (N ADRs)
| #    | Title                              | Status   | Evidence |
|------|------------------------------------|----------|----------|
| 0001 | Use ADRs for decisions             | Accepted | L2       |
| 0004 | Lifecycle as state machine         | Accepted | L1       |
...

## another-context (N ADRs)
| #    | Title                              | Status   | Evidence |
|------|------------------------------------|----------|----------|
...

## cross-cutting (N ADRs)
| #    | Title                              | Status   | Evidence |
|------|------------------------------------|----------|----------|
...

## unmapped (N ADRs)
| #    | Title                              | Status   | Evidence |
|------|------------------------------------|----------|----------|
...
```

- Use the context key (e.g., `lifecycle`, `analysis`) as the group heading
- Show ADR count in parentheses after the context key
- Omit the "unmapped" group entirely if there are no unmapped ADRs
- If a filter is active (status, evidence, view), apply it within each group and omit empty groups
- If `--context=X` filter is active, show only that single context group (skip context-grouped layout and show a single table for that context)
- Show total count at the bottom: "Total: N ADRs across M contexts"

### Step 4B: Flat Display (default when no contexts, or `--flat`)

Show the original flat-numbered table sorted by ADR number:

```
| #    | Title                              | Status   | Context    | Evidence | Date       |
|------|------------------------------------|----------|------------|----------|------------|
| 0001 | Use ADRs for architectural decisions| Accepted | —          | L2       | 2026-03-30 |
| 0002 | Use React and FastAPI stack         | Accepted | frontend   | L1       | 2026-03-30 |
| 0009 | Use Redis for session caching       | Proposed | auth       | L0       | 2026-04-02 |
```

If filtering, show the filter: "Showing [N] [status] ADRs (of [total] total)"

### Step 5: Contextual Suggestions

Append a `▶ Suggested next actions` section using the same rules as `/blueprint:help` Step 3:

1. Proposed ADRs exist → suggest `/blueprint:review N`
2. Conversation has undocumented architectural topic → suggest `/blueprint:new`
3. Application code + no recent audit → suggest `/blueprint:audit`
4. Application code + no recent evaluation → suggest `/blueprint:evaluate`
5. Recent fix committed → suggest `/blueprint:retro`
6. No ADRs → suggest `/blueprint:new`
7. All Accepted, nothing pending → "No pending actions"

This ensures the user always sees what to do next after viewing the list.
