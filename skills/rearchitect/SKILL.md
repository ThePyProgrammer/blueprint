---
name: blueprint:rearchitect
description: >
  Revisit and replace an existing architectural decision. Researches new approach, drafts
  superseding ADR, runs impact analysis, and transitions old ADR(s) to Superseded. Use when:
  "rearchitect X", "rethink our approach to X", "replace decision about X", "supersede the
  auth decision with a new approach".
---

# Rearchitect

Compound workflow for revisiting and replacing an architectural decision. Combines research,
drafting, impact analysis, and lifecycle transitions into a single flow.

## Shared Context

Read from parent `adr/` skill directory:
- `config/lifecycle.toml` — transition rules for superseding
- `relationships.toml` — existing ADR relationships
- `state.toml` — ADR directory
- `agents/persona.md` — personality
- `agents/adr-researcher.md` — for researching the new approach
- `agents/adr-impact-analyzer.md` — for checking cascading effects

## Process

1. **Search existing ADRs** for the topic
2. **Present related ADRs** — ask user to confirm which to supersede
3. **Spawn researcher** — investigate the new approach
   - Read `agents/adr-researcher.md` + `agents/persona.md`
   - Spawn with topic, constraints, existing ADRs
4. **Present research** — conduct interview for the new ADR
5. **Draft the superseding ADR** with cross-references:
   - "Supersedes ADR-NNNN" in metadata
6. **Spawn impact analyzer** on the new draft:
   - Read `agents/adr-impact-analyzer.md` + `agents/persona.md`
   - Check for cascading conflicts with other accepted ADRs
7. **Present impact analysis** to user
8. **If user approves:**
   - Write the new ADR file
   - Transition old ADR(s) to Superseded (per lifecycle.toml)
   - Cross-link: old ADR gets "Superseded by ADR-NNNN"
   - Update README.md index for both
   - Update `relationships.toml` with SUPERSEDES edge
   - Commit: `docs(adr): supersede ADR-NNNN with ADR-MMMM <title>`
