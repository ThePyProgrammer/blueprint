---
name: blueprint:list
description: >
  List all ADRs with status, date, and contextual next-action suggestions. Use when:
  "list adrs", "show decisions", "what adrs do we have", "decision status", "show accepted
  decisions", "any proposed adrs?", "list deferred". Supports filtering by status, context,
  view, and evidence level.
  Examples: "/blueprint:list", "/blueprint:list --context=payments", "/blueprint:list --view=physical".
---

# List ADRs

Display all ADRs in a summary table with contextual suggestions for next actions.

## Process

### Step 1: Read ADR State

1. Read `state.toml` for ADR directory location
   (auto-detect adr_directory: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`)
2. If no directory cached, detect: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`
3. Glob for all ADR files (`[0-9][0-9][0-9][0-9]-*.md`)
4. For each file, extract: number, title (from heading), status, date proposed, date decided
5. Read `contexts.toml` — extract context assignment per ADR
6. Read `evidence.toml` — extract evidence level per ADR
7. Extract Views metadata if present

### Step 2: Apply Filters

Supports multiple filter types:
- **By status:** "list proposed", "show accepted", "any deferred?"
- **By context:** `--context=payments` — show only ADRs governing the payments bounded context
- **By view:** `--view=physical` — show only ADRs tagged with the physical view (Kruchten 4+1)
- **By evidence level:** `--evidence=L0` — show only ADRs with unverified evidence

### Step 3: Display Table

```
| #    | Title                              | Status   | Context    | Evidence | Date       |
|------|------------------------------------|----------|------------|----------|------------|
| 0001 | Use ADRs for architectural decisions| Accepted | —          | L2       | 2026-03-30 |
| 0002 | Use React and FastAPI stack         | Accepted | frontend   | L1       | 2026-03-30 |
| 0009 | Use Redis for session caching       | Proposed | auth       | L0       | 2026-04-02 |
```

If filtering, show the filter: "Showing [N] [status] ADRs (of [total] total)"

### Step 4: Contextual Suggestions

Append a `▶ Suggested next actions` section using the same rules as `/blueprint:help` Step 3:

1. Proposed ADRs exist → suggest `/blueprint:review N`
2. Conversation has undocumented architectural topic → suggest `/blueprint:new`
3. Application code + no recent audit → suggest `/blueprint:audit`
4. Application code + no recent evaluation → suggest `/blueprint:evaluate`
5. Recent fix committed → suggest `/blueprint:retro`
6. No ADRs → suggest `/blueprint:new`
7. All Accepted, nothing pending → "No pending actions"

This ensures the user always sees what to do next after viewing the list.
