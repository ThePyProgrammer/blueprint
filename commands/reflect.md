---
name: blueprint:reflect
description: >
  Compute a reflexion model comparing intended architecture (from ADRs + ARCHITECTURE.md) against
  actual source code. Reports convergences, divergences, absences, and violations with file:line
  evidence. Use when: "check conformance", "does code match architecture?", "reflexion model",
  "architecture conformance", "formal drift check".
  Examples: "/blueprint:reflect", "/blueprint:reflect --module payments".
---

# Reflexion Model Architecture Conformance

Compute a formal reflexion model (Murphy, Notkin, Sullivan, 1995) comparing the intended
architecture against actual source code structure. This is the rigorous complement to
`/blueprint:drift` — drift detects trajectory over time, reflect detects structural mismatch now.

## Shared Context

Read from parent `adr/` skill directory:
- `{adr_directory}/.state/state.toml` — ADR directory location
- `{adr_directory}/.state/contexts.toml` — bounded context definitions
- `{adr_directory}/.state/relationships.toml` — ADR dependency graph
- `agents/persona.md` — your personality

## Process

1. **Verify prerequisites:**
   - `docs/ARCHITECTURE.md` must exist (run `/blueprint:architect` first if not)
   - At least 1 accepted ADR with architectural constraints
2. **Read `agents/adr-reflexion-analyzer.md`** from parent skill directory
3. **Spawn a `blueprint:adr-reflexion-analyzer` agent** with:
   - Full agent instructions + `agents/persona.md`
   - `docs/ARCHITECTURE.md` content
   - All accepted ADR contents
   - `{adr_directory}/.state/contexts.toml` content
   - Project root path
   - Optional: `--module <name>` to scope to one module/context
4. **Present the reflexion model report** to the user
5. **Based on findings:**
   - **Violations:** Flag as critical — these break explicit rules
   - **Divergences:** Suggest creating ADRs for unspecified dependencies
   - **Absences:** Flag as implementation gaps — architecture specified but not built
6. **Offer to create ADRs** for significant divergences
7. **Update `{adr_directory}/.state/state.toml`** — set `last_reflect` to today

## Relationship to `/blueprint:drift`

| Aspect | `/blueprint:reflect` | `/blueprint:drift` |
|--------|---------------------|-------------------|
| Method | Reflexion model (Murphy et al., 1995) | Git trajectory analysis |
| Question | "Does code match architecture NOW?" | "Is code MOVING toward or away from architecture?" |
| Granularity | File:line evidence | Trend over commits |
| Best for | Point-in-time conformance audit | Detecting gradual erosion |
| When to use | Before releases, after major changes | Regularly, as continuous governance |

Both are valuable. Reflect gives you an X-ray; drift gives you a time-lapse.
