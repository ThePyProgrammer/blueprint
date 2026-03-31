---
name: blueprint:diagram
description: >
  Generate C4 Model architecture diagrams from accepted ADRs and the relationship graph.
  Auto-updated diagrams that stay in sync with decisions. Use when: "generate diagram",
  "architecture diagram", "c4 diagram", "visualize architecture", "system context diagram",
  "container diagram". Supports Mermaid, Structurizr DSL, and PlantUML output.
  Examples: "/blueprint:diagram", "/blueprint:diagram --format structurizr", "/blueprint:diagram --level container".
---

# C4 Architecture Diagrams

Generate C4 Model diagrams from accepted ADRs and ARCHITECTURE.md. Diagrams auto-update
when ADRs change — always in sync with decisions. Based on Simon Brown's C4 Model.

## Shared Context

Read from parent `adr/` skill directory:
- `state.toml` — ADR directory location
- `relationships.toml` — ADR dependency graph
- `contexts.toml` — bounded context definitions
- `agents/persona.md` — your personality

## Process

1. **Parse options:**
   - `--format`: `mermaid` (default), `structurizr`, `plantuml`
   - `--level`: `context` (L1), `container` (L2), `component` (L3), `all` (default)
2. **Read `agents/adr-diagram-generator.md`** from parent skill directory
3. **Spawn a `blueprint:adr-diagram-generator` agent** with:
   - Full agent instructions + `agents/persona.md`
   - All accepted ADR contents
   - `docs/ARCHITECTURE.md` content
   - `relationships.toml` and `contexts.toml`
   - Requested format and level
   - Project root path
4. **Present diagrams** to user
5. **Write diagram files** to `docs/diagrams/`:
   - `docs/diagrams/context.mermaid` (or .puml, .dsl)
   - `docs/diagrams/container.mermaid`
   - `docs/diagrams/component-[name].mermaid` (per container)
6. **Commit:** `docs(adr): generate C4 architecture diagrams from [N] ADRs`

## Output Location

```
docs/
├── diagrams/
│   ├── context.mermaid        # Level 1: System Context
│   ├── container.mermaid      # Level 2: Containers
│   └── component-api.mermaid  # Level 3: Components (per container)
```

## Integration with Other Commands

- `/blueprint:scope` — context map overlays on C4 diagrams
- `/blueprint:status` — dashboard embeds diagrams
- `/blueprint:architect` — ARCHITECTURE.md references generated diagrams
- `/blueprint:digest` — stakeholder summary includes system context diagram
