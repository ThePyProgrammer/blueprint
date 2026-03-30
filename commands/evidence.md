---
name: blueprint:evidence
description: >
  Audit epistemic status and temporal validity of evidence supporting accepted ADRs.
  Detects stale evidence, unverified research, expired assumptions, and dead source URLs.
  Use when: "check evidence", "is our research still valid?", "evidence audit", "stale decisions",
  "evidence health", "are ADRs still accurate?".
  Examples: "/blueprint:evidence", "/blueprint:evidence ADR-0005".
---

# Evidence Audit

Audit the quality and freshness of evidence supporting accepted ADRs. Based on Gilda & Gilda
(2026) — 23% of architectural decisions had stale evidence within two months, with 86%
discovered reactively during incidents.

## Shared Context

Read from parent `adr/` skill directory:
- `{adr_directory}/.state/evidence.toml` — existing evidence classifications
- `{adr_directory}/.state/state.toml` — ADR directory location
- `agents/persona.md` — your personality

## Epistemic Levels

| Level | Label | Meaning |
|-------|-------|---------|
| L0 | Unverified | AI-generated, unsourced, or unconfirmed evidence |
| L1 | Logically Consistent | Sourced and reasoning is sound, but not tested in this project |
| L2 | Empirically Validated | Tested and confirmed in this specific project context |

**Conservative aggregation:** Decision confidence = min(evidence confidence). If ANY supporting
evidence is L0, the whole decision is L0.

## Process

### Full Audit (`/blueprint:evidence`)

1. Read `agents/adr-evidence-auditor.md` from parent skill directory
2. Spawn a `blueprint:adr-evidence-auditor` agent with:
   - Full agent instructions + `agents/persona.md`
   - All accepted ADR contents
   - Current `{adr_directory}/.state/evidence.toml`
   - Current dependency manifests (package.json, requirements.txt, etc.)
   - Project root path
3. Present the evidence audit report
4. Offer to update `{adr_directory}/.state/evidence.toml` with new classifications
5. Update `{adr_directory}/.state/state.toml` — set `last_evidence_audit` to today
6. Commit: `docs(adr): audit evidence validity across [N] accepted ADRs`

### Single ADR (`/blueprint:evidence ADR-NNNN`)

Same process but scoped to one ADR. Useful after researching a specific topic.

### Set Evidence Level (`/blueprint:evidence set ADR-NNNN L2`)

Manually classify evidence level for an ADR (e.g., after running a benchmark).
Updates `{adr_directory}/.state/evidence.toml` and the ADR metadata.

## Config File: `{adr_directory}/.state/evidence.toml`

```toml
# Evidence Quality Tracking
# Auto-updated by /blueprint:evidence, manually set via /blueprint:evidence set

[adrs.ADR-0005]
level = "L1"
last_assessed = "2026-03-30"
expires = "2026-09-30"
stale_claims = []
dead_urls = []
context_changes = []

[adrs.ADR-0012]
level = "L0"
last_assessed = "2026-03-30"
expires = "2026-05-30"
stale_claims = ["benchmark data from 2024"]
dead_urls = ["https://example.com/old-benchmark"]
context_changes = ["dependency upgraded from v2 to v4"]
```

## Integration with Other Commands

- `/blueprint:debt` — surfaces ADRs with expired evidence alongside deferred decisions
- `/blueprint:list` — shows evidence level badge next to each ADR
- `/blueprint:new --research` — new ADRs start at L0 with 60-day default expiry
- `/blueprint:status` — dashboard shows evidence health metrics
