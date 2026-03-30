# Dogfood Test Summary — Blueprint v2

**Date:** 2026-03-31
**Tests run:** 11 (covering all 15 v2 commands)
**Methodology:** Each command's skill file was read, then its process was actually executed against Blueprint's own codebase.

## Results

| # | Command(s) | Verdict | Critical Findings |
|---|-----------|---------|-------------------|
| 01 | `/blueprint:scope` | PASS WITH NOTES | .state/ path mismatch; agent assumes code-heavy codebase |
| 02 | `/blueprint:challenge` | PASS WITH NOTES | Undefined force interaction adjustment formula |
| 03 | `/blueprint:reflect` | PASS WITH NOTES | **verify.js checks 12/38 commands (FIXED)**; ARCHITECTURE.md omissions |
| 04 | `/blueprint:evidence` | PASS WITH NOTES | **Wrong author: "Koenig" → Gilda & Gilda (FIXED)**; 0/7 ADRs at L2 |
| 05 | `/blueprint:map` | PASS WITH NOTES | Web research too rigid for genesis; **DRY in install.js (FIXED)** |
| 06 | `/blueprint:diagram` | PASS WITH NOTES | relationships.toml has only 7/41 nodes; Mermaid C4 support limited |
| 07 | `/blueprint:trace` | **FAIL** | **0% fitness function coverage** — Blueprint has none of its own |
| 08 | `/blueprint:tradeoff` | PASS WITH NOTES | Utility tree format needs importance/difficulty separation |
| 09 | `/blueprint:risk` | PASS WITH NOTES | Bus factor = 1; risk formula needs plugin-codebase calibration |
| 10 | `/blueprint:advise` | PASS WITH NOTES | Degenerates for single-contributor projects |
| 10 | `/blueprint:export` | PASS WITH NOTES | Runtime/Deployment views would be empty |
| 10 | `/blueprint:views` | PASS WITH NOTES | ADR-0005 (persona) defies all 5 views |
| 11 | `/blueprint:federate` | PASS WITH NOTES | No graceful empty-state for missing federation.toml |
| 11 | `/blueprint:radar` | PASS WITH NOTES | Missing ring-change history tracking |
| 11 | `/blueprint:govern` | PASS WITH NOTES | Mode downgrade behavior undefined |

## Bugs Fixed During Testing

| Bug | Found By | Severity | Fix Commit |
|-----|----------|----------|------------|
| Wrong author attribution (Koenig → Gilda & Gilda) | `/blueprint:evidence` | Critical | Fixed in 9 files |
| verify.js only checks 12/38 commands | `/blueprint:reflect` | Critical | Updated to 39 commands, 21 agents |
| DRY violation in install.js | `/blueprint:map` | Medium | Extracted SUB_COMMANDS constant |

## Systemic Issues (Not Yet Fixed)

| Issue | Affected Commands | Priority |
|-------|------------------|----------|
| .state/ vs config/ path ambiguity | All v2 commands | High — needs architectural decision on where state lives |
| 0% fitness function coverage | `/blueprint:trace` | High — Blueprint should eat its own fitness dogfood |
| relationships.toml only 7/41 nodes | `/blueprint:diagram`, `/blueprint:impact` | Medium — v1 ADRs never indexed |
| contexts.toml empty | `/blueprint:scope`, `/blueprint:advise` | Medium — needs scope discover run |
| Agent heuristics assume code-heavy codebases | `/blueprint:scope`, `/blueprint:reflect`, `/blueprint:risk` | Low — markdown plugins are edge case |

## Verdict

**14/15 commands PASS WITH NOTES. 1/15 FAIL (trace — but it correctly reports the gap).**

The v2 commands are well-designed and produce useful output. The major issues are:
1. Blueprint doesn't practice what it preaches (0% fitness functions)
2. The .state/ path refactor introduced a conceptual split that needs resolution
3. AI-generated research had a hallucinated author attribution — caught by the very tool designed to catch it

The system works. It needs polish, not redesign.
