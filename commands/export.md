---
name: blueprint:export
description: >
  Export Blueprint's ADR collection into standardized documentation formats. Currently supports
  arc42 (12-section template). Use when: "export arc42", "generate documentation", "arc42 format",
  "standardized docs", "documentation export".
  Examples: "/blueprint:export arc42", "/blueprint:export arc42 --output docs/arc42/".
---

# Documentation Export

Export Blueprint's ADR collection, ARCHITECTURE.md, fitness functions, and risk assessments
into standardized architecture documentation formats.

## Shared Context

Read from parent `adr/` skill directory:
- `config/state.toml` — ADR directory location
- `config/contexts.toml` — bounded context definitions
- `config/evidence.toml` — evidence tracking
- `agents/persona.md` — your personality

## Supported Formats

### arc42 (`/blueprint:export arc42`)

Maps Blueprint artifacts into arc42's 12-section structure (Starke & Hruschka, 2005):

| arc42 Section | Blueprint Source |
|---------------|----------------|
| 1. Introduction and Goals | Project README + high-severity ADRs |
| 2. Constraints | ADRs categorized as constraints |
| 3. Context and Scope | ARCHITECTURE.md system boundary + `/blueprint:diagram` L1 |
| 4. Solution Strategy | Core accepted ADRs (high severity) |
| 5. Building Block View | ARCHITECTURE.md codemap + `/blueprint:diagram` L2/L3 |
| 6. Runtime View | ADRs about communication patterns, EDA, CQRS |
| 7. Deployment View | ADRs about deployment, infrastructure |
| 8. Cross-cutting Concepts | ADRs tagged as cross-cutting in contexts.toml |
| 9. Architecture Decisions | All accepted ADRs (native content) |
| 10. Quality Requirements | Fitness functions from `/blueprint:fitness` |
| 11. Risks and Technical Debt | `/blueprint:risk` output + `/blueprint:debt` deferred ADRs |
| 12. Glossary | Ubiquitous language from contexts.toml |

### Process

1. **Read all Blueprint artifacts** — ADRs, ARCHITECTURE.md, config files
2. **Map each ADR** to the appropriate arc42 section(s) by category and content
3. **Generate the 12-section document** as a single markdown file or directory of files
4. **Write to output location** (default: `docs/arc42/`)
5. **Commit:** `docs(adr): export architecture documentation in arc42 format`

### Output Structure (directory mode)

```
docs/arc42/
├── 01-introduction-and-goals.md
├── 02-constraints.md
├── 03-context-and-scope.md
├── 04-solution-strategy.md
├── 05-building-block-view.md
├── 06-runtime-view.md
├── 07-deployment-view.md
├── 08-cross-cutting-concepts.md
├── 09-architecture-decisions.md
├── 10-quality-requirements.md
├── 11-risks-and-technical-debt.md
├── 12-glossary.md
└── index.md
```

## Future Formats

- `iso42010` — ISO/IEC/IEEE 42010:2022 architecture description
- `c4-workspace` — Structurizr workspace export
- `adr-log` — Flat ADR log for external tools (Log4brains, adr-tools)
