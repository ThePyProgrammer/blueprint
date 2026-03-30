# Blueprint v2 Extension Roadmap

*Research-backed extensions identified from comprehensive survey of 20+ architecture paradigms (109 sources). See `papers/software-architecture-paradigms.md` for full research.*

---

## Implementation Status

### Tier 1: Paradigm-Shifting (P0)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 1 | `/blueprint:scope` | Domain-Driven Design | `adr-context-mapper` | **Done** |
| 2 | `/blueprint:challenge` | DCAR (van Heesch et al., 2014) | `adr-forces-evaluator` | **Done** |
| 3 | `/blueprint:reflect` | Reflexion Models (Murphy et al., 1995) | `adr-reflexion-analyzer` | **Done** |
| 4 | `/blueprint:evidence` | Epistemic Staleness (Gilda & Gilda, 2026) | `adr-evidence-auditor` | **Done** |
| 5 | `/blueprint:map` | Wardley Mapping | `adr-strategic-analyzer` | **Done** |

### Tier 2: Major Differentiation (P1)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 6 | `/blueprint:diagram` | C4 Model (Simon Brown) | `adr-diagram-generator` | **Done** |
| 7 | `/blueprint:trace` | Evolutionary Architecture (Ford et al.) | — (enhances existing) | **Done** |
| 8 | `/blueprint:advise` | Architecture Advice Process (Harmel-Law) | — | **Done** |
| 9 | `/blueprint:tradeoff` | ATAM (SEI/CMU, 1998) | `adr-tradeoff-analyzer` | **Done** |
| 10 | `/blueprint:risk` | Risk Storming (Simon Brown) | `adr-risk-mapper` | **Done** |

### Tier 3: Ecosystem Expansion (P2)

| # | Command | Source Paradigm | Agent | Status |
|---|---------|----------------|-------|--------|
| 11 | `/blueprint:export` | arc42 (Starke & Hruschka, 2005) | — | **Done** |
| 12 | `/blueprint:views` | 4+1 View Model (Kruchten, 1995) | — | **Done** |
| 13 | `/blueprint:federate` | Practitioner need (cross-repo ADRs) | `adr-federation-indexer` | **Done** |
| 14 | `/blueprint:radar` | ThoughtWorks Technology Radar | — | **Done** |
| 15 | `/blueprint:govern` | TOGAF + Advice Process | — | **Done** |

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
| 2026-03-30 | `/blueprint:scope` | feat(adr) | Skill + agent + config/contexts.toml |
| 2026-03-30 | `/blueprint:challenge` | feat(adr) | Skill + agent (DCAR forces evaluation) |
| 2026-03-30 | `/blueprint:reflect` | feat(adr) | Skill + agent (reflexion model conformance) |
| 2026-03-30 | `/blueprint:evidence` | feat(adr) | Skill + agent + config/evidence.toml |
| 2026-03-30 | `/blueprint:map` | feat(adr) | Skill + agent (Wardley strategic analysis) |
| 2026-03-30 | `/blueprint:diagram` | feat(adr) | Skill + agent (C4 auto-generation) |
| 2026-03-30 | `/blueprint:trace` | feat(adr) | Skill (fitness traceability matrix) |
| 2026-03-30 | `/blueprint:advise` | feat(adr) | Skill (Architecture Advice Process) |
| 2026-03-30 | `/blueprint:tradeoff` | feat(adr) | Skill + agent (ATAM utility trees) |
| 2026-03-30 | `/blueprint:risk` | feat(adr) | Skill + agent (risk heat map) |
| 2026-03-30 | `/blueprint:export` | feat(adr) | Skill (arc42 12-section export) |
| 2026-03-30 | `/blueprint:views` | feat(adr) | Skill (4+1 view tagging) |
| 2026-03-30 | `/blueprint:federate` | feat(adr) | Skill + agent (cross-repo ADR federation) |
| 2026-03-30 | `/blueprint:radar` | feat(adr) | Skill + config/radar.toml |
| 2026-03-30 | `/blueprint:govern` | feat(adr) | Skill + config/governance.toml |
