# Blueprint v2 — Known Issues from Dogfood Testing

**Date:** 2026-03-31
**Tests run:** 11 (covering 15 commands)
**Bugs fixed during testing:** 3 (author attribution, verify.js, DRY violation)
**Issues fixed post-testing:** 8 (all 10 issues resolved)

## Issue Status

| # | Issue | Severity | Status | Fix |
|---|-------|----------|--------|-----|
| 1 | State Path Ambiguity (.state/ vs config/) | HIGH | **FIXED** | Config Resolution Protocol in router |
| 2 | governance.toml config/docs mismatch | MEDIUM | **FIXED** | Aligned gate phases and documented fields |
| 3 | 0% Fitness Function Coverage | HIGH | **FIXED** | 16 fitness functions in tests/architecture/fitness.sh |
| 4 | relationships.toml only 7/41 nodes | MEDIUM | **FIXED** | Backfilled all 34 v1 ADR nodes |
| 5 | contexts.toml empty | MEDIUM | **FIXED** | 7 bounded contexts with 5 relationships |
| 6 | Agent heuristics assume code-heavy codebases | LOW | **FIXED** | Markdown-aware heuristics in 3 agents |
| 7 | Single-contributor degeneration | LOW | **FIXED** | Graceful degradation in advise, risk, scope |
| 8 | Force interaction formula undefined | LOW | **FIXED** | Numerical adjustments with worked examples |
| 9 | Views auto-tag keywords too narrow | LOW | **FIXED** | Semantic fallback + cross-cutting tag |
| 10 | Export arc42 depends on unrun commands | LOW | **FIXED** | Prerequisite checks + empty-section stubs |

## Additional Fixes (found during issue resolution)

| Fix | Found By |
|-----|----------|
| Federate empty-state handling | Issue resolution — federate had same missing-config problem |

## All Issues Resolved

No known blocking or non-blocking issues remain. Blueprint v2 is ready for release.
