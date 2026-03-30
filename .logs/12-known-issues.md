# Blueprint v2 — Known Issues from Dogfood Testing

**Date:** 2026-03-31
**Tests run:** 11 (covering 15 commands)
**Bugs fixed during testing:** 3 (author attribution, verify.js, DRY violation)

## Blocking Issues (Must Fix Before Release)

### 1. State Path Ambiguity — `.state/` vs `config/`
**Severity:** HIGH
**Affected:** All 15 v2 commands + agents
**Problem:** The linter refactored skill files to reference `{adr_directory}/.state/<file>.toml` but the actual config files live at `config/<file>.toml`. The `.state/` directory under `docs/adr/` does not exist. Commands would fail on first execution.
**Root cause:** The refactor assumed consumer projects (where state should be per-project in `.state/`) but was applied to Blueprint's own repo (where config/ IS the source of truth).
**Fix:** For v2.0.0 release, document that skills should read from `config/` when running in the plugin repo, and `{adr_directory}/.state/` when running in a consumer project. The `init` command creates `.state/` by copying templates from `config/state-templates/`.

### 2. governance.toml Config/Docs Mismatch
**Severity:** MEDIUM
**Problem:** `governance.toml` has `gate_phases = ["research", "challenge", "review", "board-review"]` (4 phases) but `govern.md` documents 3 phases. Also `auto_request_challenge = false` in config is undocumented in the skill.
**Fix:** Align config and skill documentation.

## Non-Blocking Issues (Fix Post-Release)

### 3. 0% Fitness Function Coverage
**Severity:** HIGH (reputational)
**Problem:** Blueprint preaches fitness functions but has none of its own. ADR-0023 is unenforced.
**Fix:** Run `/blueprint:fitness` against Blueprint's own ADRs. Create structural fitness tests.

### 4. relationships.toml Only 7/41 Nodes
**Severity:** MEDIUM
**Problem:** Only v2 ADRs (0035-0041) have nodes in the relationship graph. v1 ADRs (0001-0034) were never indexed. `/blueprint:diagram` and `/blueprint:impact` operate on 17% of the graph.
**Fix:** Backfill v1 ADR nodes via `/blueprint:impact` or bulk-index in `/blueprint:health`.

### 5. contexts.toml Empty
**Severity:** MEDIUM
**Problem:** `/blueprint:scope` was never run against Blueprint itself. All context-dependent features (advise, views, diagram overlays) degrade.
**Fix:** Run `/blueprint:scope discover` on Blueprint.

### 6. Agent Heuristics Assume Code-Heavy Codebases
**Severity:** LOW
**Problem:** context-mapper greps for classes/interfaces/imports; reflect analyzer assumes import-based dependencies; risk mapper measures LOC. Blueprint is markdown + TOML — these heuristics produce thin results.
**Fix:** Add markdown-aware heuristics: cross-file references (Read `agents/persona.md`), config references, ADR cross-references.

### 7. Single-Contributor Degeneration
**Severity:** LOW
**Problem:** `/blueprint:advise` (nobody to consult), `/blueprint:risk` (bus factor always 1), `/blueprint:scope` (one owner for everything). Single-contributor projects are a valid and common use case.
**Fix:** Add graceful single-author modes with helpful messaging.

### 8. Force Interaction Adjustment Formula Undefined
**Severity:** LOW
**Problem:** `/blueprint:challenge` agent says "apply interaction adjustments" but never defines how amplifying/cancelling pairs translate to numerical changes.
**Fix:** Define: amplifying pair adds +1 to the stronger force's direction; cancelling pair removes the weaker force.

### 9. Views Auto-Tag Keyword Heuristics Too Narrow
**Severity:** LOW
**Problem:** 7-8/10 Blueprint ADRs have zero keyword matches for auto-tagging. Heuristics tuned for traditional software, not LLM tooling.
**Fix:** Fall back to LLM semantic classification when keyword grep returns nothing.

### 10. Export arc42 Depends on Unrun Commands
**Severity:** LOW
**Problem:** `/blueprint:export arc42` needs output from `/blueprint:fitness` and `/blueprint:risk` that have never been run. 5/12 sections would be empty.
**Fix:** Check prerequisites and suggest running them first.
