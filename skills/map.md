---
name: blueprint:map
description: >
  Generate or update a Wardley Map for strategic architecture analysis. Classifies components
  by evolution stage (Genesis/Custom/Product/Commodity), detects build-vs-buy misalignment, and
  links strategic context to ADRs. Use when: "wardley map", "strategic analysis", "build vs buy",
  "are we building commodity?", "evolution stage", "strategic alignment".
  Examples: "/blueprint:map", "/blueprint:map check ADR-0005".
---

# Wardley Map Strategic Analysis

Classify architecture components by evolution stage and detect strategic misalignment —
building custom for commodity, using commodity for differentiators. Based on Simon Wardley's
Wardley Mapping framework.

## Shared Context

Read from parent `adr/` skill directory:
- `state.toml` — ADR directory location
- `contexts.toml` — bounded context definitions
- `agents/persona.md` — your personality

## Evolution Stages

| Stage | What It Means | Build or Buy? |
|-------|--------------|---------------|
| Genesis | Novel, uncertain, your differentiator | Build — this IS the value |
| Custom-Built | Known concept, unique execution | Build with intent — potential edge |
| Product | Multiple vendors, feature competition | Evaluate vendors — don't build |
| Commodity | Utility, standardized, interchangeable | Use SaaS/utility — building is waste |

## Process

### Generate Map (`/blueprint:map`)

1. Read `agents/adr-strategic-analyzer.md` from parent skill directory
2. Spawn a `blueprint:adr-strategic-analyzer` agent with:
   - Full agent instructions + `agents/persona.md`
   - All accepted ADR contents
   - `docs/ARCHITECTURE.md` content
   - Dependency manifests (package.json, requirements.txt, etc.)
   - `contexts.toml`
   - Project root path
3. Present the strategic analysis to the user
4. Offer to add `Evolution-Stage` metadata to ADRs
5. Update `state.toml` — set `last_strategic_map` to today
6. Commit: `docs(adr): generate Wardley strategic analysis for [N] components`

### Check Single ADR (`/blueprint:map check ADR-NNNN`)

Evaluate one ADR's technology choice against its evolution stage. Faster than full map.

## ADR Metadata

New optional field for ADRs:

```markdown
| Evolution Stage | commodity |
```

Values: `genesis`, `custom`, `product`, `commodity`

## Integration with Other Commands

- `/blueprint:review` — devil's advocate gains strategic lens: "You're building custom for commodity"
- `/blueprint:challenge` — forces evaluator considers evolution stage as a force
- `/blueprint:digest` — stakeholder summary includes Wardley map context
- `/blueprint:debt` — flags ADRs with misaligned evolution stages as strategic debt
