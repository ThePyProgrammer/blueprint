---
name: blueprint:list
description: >
  List all ADRs with status, date, and contextual next-action suggestions. Use when:
  "list adrs", "show decisions", "what adrs do we have", "decision status", "show accepted
  decisions", "any proposed adrs?", "list deferred". Supports filtering by status.
---

# List ADRs

Display all ADRs in a summary table with contextual suggestions for next actions.

## Process

### Step 1: Read ADR State

1. Read `config/state.toml` from the parent `adr/` directory for ADR directory location
2. If no directory cached, detect: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`
3. Glob for all ADR files (`[0-9][0-9][0-9][0-9]-*.md`)
4. For each file, extract: number, title (from heading), status, date proposed, date decided

### Step 2: Apply Filters

If the user specified a filter ("list proposed", "show accepted", "any deferred?"), filter
the results to matching statuses only.

### Step 3: Display Table

```
| #    | Title                                    | Status    | Date       |
|------|------------------------------------------|-----------|------------|
| 0001 | Use ADRs for architectural decisions      | Accepted  | 2026-03-30 |
| 0002 | Use React and FastAPI stack               | Accepted  | 2026-03-30 |
| 0009 | Use Redis for session caching             | Proposed  | 2026-04-02 |
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
