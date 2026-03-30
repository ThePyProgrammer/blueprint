# Blueprint v2 Extension Roadmap

*Research-backed extensions identified from comprehensive survey of 20+ architecture paradigms (109 sources). See `papers/software-architecture-paradigms.md` for full research.*

---

## Implementation Status

### Tier 1: Paradigm-Shifting (P0)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 1 | `/blueprint:scope` | Domain-Driven Design | `adr-context-mapper` | Pending |
| 2 | `/blueprint:challenge` | DCAR (van Heesch et al., 2014) | `adr-forces-evaluator` | Pending |
| 3 | `/blueprint:reflect` | Reflexion Models (Murphy et al., 1995) | `adr-reflexion-analyzer` | Pending |
| 4 | `/blueprint:evidence` | Epistemic Staleness (Koenig et al., 2026) | `adr-evidence-auditor` | Pending |
| 5 | `/blueprint:map` | Wardley Mapping | `adr-strategic-analyzer` | Pending |

### Tier 2: Major Differentiation (P1)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 6 | `/blueprint:diagram` | C4 Model (Simon Brown) | `adr-diagram-generator` | Pending |
| 7 | `/blueprint:trace` | Evolutionary Architecture (Ford et al.) | — (enhances existing) | Pending |
| 8 | `/blueprint:advise` | Architecture Advice Process (Harmel-Law) | — | Pending |
| 9 | `/blueprint:tradeoff` | ATAM (SEI/CMU, 1998) | `adr-tradeoff-analyzer` | Pending |
| 10 | `/blueprint:risk` | Risk Storming (Simon Brown) | `adr-risk-mapper` | Pending |

### Tier 3: Ecosystem Expansion (P2)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 11 | `/blueprint:export` | arc42 (Starke & Hruschka, 2005) | — | Pending |
| 12 | `/blueprint:views` | 4+1 View Model (Kruchten, 1995) | — | Pending |
| 13 | `/blueprint:federate` | Practitioner need (cross-repo ADRs) | `adr-federation-indexer` | Pending |
| 14 | `/blueprint:radar` | ThoughtWorks Technology Radar | — | Pending |
| 15 | `/blueprint:govern` | TOGAF + Advice Process | — | Pending |

---

## New Artifacts Summary

| Artifact Type | Count | Details |
|---------------|-------|---------|
| New commands (skills) | 15 | See table above |
| New agents | 7 | context-mapper, forces-evaluator, reflexion-analyzer, evidence-auditor, strategic-analyzer, diagram-generator, tradeoff-analyzer, risk-mapper, federation-indexer |
| New config files | 2 | `config/contexts.toml`, `config/evidence.toml` |
| New ADR metadata fields | 5 | `Context:`, `Evolution-Stage:`, `Evidence-Level:`, `Evidence-Expires:`, `Views:` |
| Updated config files | 2 | `taxonomy.toml` (new dimensions), `state.toml` (new operation dates) |
| ADR template update | 1 | New optional fields in `docs/adr/template.md` |

---

## Changelog

| Date | Command | Commit | Notes |
|------|---------|--------|-------|
| — | — | — | Implementation begins |
