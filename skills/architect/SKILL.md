---
name: blueprint:architect
description: >
  Generate or update ARCHITECTURE.md — a bird's-eye codemap following matklad's philosophy.
  Maps modules, documents invariants from ADRs, identifies layer boundaries and cross-cutting
  concerns. Use when: "generate architecture doc", "update architecture", "write architecture.md",
  "map the codebase", "where does X live?", or after significant structural changes.
---

# Generate ARCHITECTURE.md

Spawns the architect-cartographer agent to produce a bird's-eye map of the codebase.
Follows [matklad's ARCHITECTURE.md philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html):
brief, high-leverage, country-level abstraction, revised periodically.

ARCHITECTURE.md answers "where is X?" and "what rules must I follow?"
ADRs answer "why is it this way?"
Together they form a two-layer documentation system.

## Shared Context

Read from parent `blueprint/` skill directory:
- `state.toml` — ADR directory location, project root
- `agents/persona.md` — personality
- `agents/adr-architect-cartographer.md` — agent instructions

## Process

1. **Detect project context:**
   - Read `state.toml` for ADR directory
   - Glob for `docs/ARCHITECTURE.md` to check if one already exists
   - If updating: read the existing file so the agent can preserve structure

2. **Spawn architect-cartographer:**
   - Read `agents/adr-architect-cartographer.md` and `agents/persona.md`
   - Spawn `general-purpose` agent with:
     - Project root path
     - ADR directory path and list of all ADR filenames
     - Existing ARCHITECTURE.md content (if updating)
     - Full agent instructions + persona
   - The agent writes `docs/ARCHITECTURE.md` directly

3. **Present summary** to user:
   - Modules mapped, invariants documented, ADRs referenced
   - Ask user to review before committing

4. **Commit** when approved:
   - `docs: generate ARCHITECTURE.md` (new)
   - `docs: update ARCHITECTURE.md` (existing)

## When to Run

- After initial project setup (`/blueprint:new` has created several ADRs)
- After significant structural changes (new modules, refactored boundaries)
- Periodically — matklad recommends revisiting "a couple of times a year"
- When a new contributor joins and needs orientation

## Relationship to Other Skills

- **`/blueprint:evaluate`** assesses architecture quality — ARCHITECTURE.md documents what it is
- **`/blueprint:audit`** checks if ADRs are followed — ARCHITECTURE.md provides the map of what to check
- **`/blueprint:new`** creates decisions — ARCHITECTURE.md references them for the "why"
- **`/blueprint:retro`** proposes structural improvements — those may require updating ARCHITECTURE.md

After running `/blueprint:evaluate`, consider running `/blueprint:architect` to update
the map if the evaluation revealed structural changes.
