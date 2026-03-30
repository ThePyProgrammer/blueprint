---
name: blueprint:impact
description: >
  Analyze an ADR's impact on other decisions and the codebase. Detects conflicts, dependencies,
  and affected components. Use when: "impact of adr N", "check adr N for conflicts", "does this
  conflict with anything?", "adr impact N".
---

# ADR Impact Analysis

Cross-references a target ADR against all accepted ADRs and the codebase to detect conflicts,
dependencies, and affected areas.

## Shared Context

Read from parent `adr/` directory:
- `{adr_directory}/.state/state.toml` — ADR directory location
- `{adr_directory}/.state/relationships.toml` — existing relationship graph
- `agents/persona.md` — personality
- `agents/adr-impact-analyzer.md` — agent instructions

## Process

1. Read the target ADR (user specifies by number)
2. Read `agents/adr-impact-analyzer.md` and `agents/persona.md`
3. Spawn `general-purpose` agent with:
   - Full text of the target ADR
   - ADR file path and directory path
   - List of all ADR filenames
   - Current relationship graph from `{adr_directory}/.state/relationships.toml`
   - Full agent instructions + persona
4. Present the impact report
5. **Update `{adr_directory}/.state/relationships.toml`** with discovered edges (DEPENDS_ON, CONFLICTS, etc.)
6. If conflicts found, suggest:
   - Resolve conflicts first
   - Revise the target ADR
   - Accept the tension with documentation
   - Run `/blueprint:rearchitect` to supersede a conflicting decision
