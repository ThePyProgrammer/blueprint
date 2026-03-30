---
name: blueprint:risk
description: >
  Generate architecture risk heat map by analyzing ADR coverage gaps, component complexity,
  git churn, and coupling density. Use when: "risk assessment", "risk heat map", "where are
  the risks?", "risk storming", "which components need ADRs?", "ungoverned code".
  Examples: "/blueprint:risk", "/blueprint:risk --module payments".
---

# Architecture Risk Heat Map

Generate a risk heat map by cross-referencing ADR coverage against component complexity,
churn, and coupling. Identifies architectural blind spots — high complexity with no governance.
Based on Simon Brown's Risk Storming (~2015), adapted for automated analysis.

## Shared Context

Read from parent `adr/` skill directory:
- `config/state.toml` — ADR directory location
- `config/contexts.toml` — bounded context definitions
- `agents/persona.md` — your personality

## Process

1. **Read `agents/adr-risk-mapper.md`** from parent skill directory
2. **Spawn a `blueprint:adr-risk-mapper` agent** with:
   - Full agent instructions + `agents/persona.md`
   - All accepted ADR filenames and titles
   - `docs/ARCHITECTURE.md` content
   - `config/contexts.toml` content
   - Optional: `--module <name>` to scope analysis
   - Project root path
3. **Present risk heat map** to the user
4. **For critical/high risks, offer:**
   - "Create ADR for [ungoverned component]?" → `/blueprint:new`
   - "Run reflexion model on [high-risk module]?" → `/blueprint:reflect`
   - "Generate fitness functions?" → `/blueprint:fitness`
5. **Update `config/state.toml`** — set `last_risk_assessment` to today

## Risk Formula

`Risk = (Complexity × Churn × Coupling) / Governance`

Components with high complexity, high churn, high coupling, AND low governance
are the highest risk. The formula weights the absence of architectural decisions
as the most dangerous factor — because ungoverned complexity is how outages happen.
