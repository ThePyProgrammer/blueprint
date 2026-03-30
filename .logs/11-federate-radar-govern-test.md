# Dogfood Test: /blueprint:federate, /blueprint:radar, /blueprint:govern
**Date:** 2026-03-31

## Test 1: /blueprint:federate

### Execution Log

1. **Read `commands/federate.md`** -- Skill definition loads cleanly. Four modes defined: Index, Add Repo, Remove Repo, Check Conflicts.
2. **Read `agents/adr-federation-indexer.md`** -- Agent template loads cleanly. Five-step execution flow: Discovery, Unified Index, Conflict Detection, Dependency Detection, Duplicate Detection. Quality gate checklist present.
3. **Check for `config/federation.toml`** -- File does NOT exist. Only the config directory exists with `governance.toml`, `radar.toml`, `state.toml`, etc.
4. **Tested: Does it handle missing `config/federation.toml`?**
   - The `federate.md` skill says "Read `config/federation.toml` for configured repos" but does NOT specify what to do if the file is absent.
   - The agent template (`adr-federation-indexer.md`) also starts with "Read `config/federation.toml` for configured repositories" with no fallback.
   - **Neither the skill nor the agent provides a graceful empty-state path.** There is no instruction to create the file, show a helpful "no repos configured" message, or guide the user to `/blueprint:federate add`.
5. **Tested: Are instructions for adding repos clear?**
   - The Add Repo mode (`/blueprint:federate add <path-or-url>`) has three steps: add to config, verify ADR directory, run index. This is clear.
   - The example config in the skill definition shows the TOML structure with `[[repositories]]` entries including `name`, `path`, and `adr_directory` fields. This is adequate.
   - **Missing:** No guidance on what `name` to use (is it auto-derived from the path? Must the user specify it?). The `add` subcommand takes `<path-or-url>` but the config also needs a `name` field -- unclear how that gets populated.
6. **Tested: Does the agent template produce useful output?**
   - The `<output_format>` section is well-structured with tables for Unified Index, Cross-Repo Conflicts, Cross-Repo Dependencies, Likely Duplicates, and Missing Cross-References.
   - The quality gate has five verification checks. This is solid.
   - **Good:** The persona section gives the agent strong motivation ("real architecture doesn't stop at repo boundaries").
7. **Tested: What would happen federating Blueprint with another copy of itself?**
   - All 41 ADRs would appear as duplicates (identical titles, identical content).
   - The Duplicate Detection step would flag every single ADR pair as "Same decision recorded independently."
   - The Conflict Detection step would find zero conflicts (identical decisions cannot contradict).
   - The Dependency Detection step would find extensive self-referential dependencies (ADRs cross-reference each other heavily via the relationship graph).
   - **Useful stress test:** This would produce a massive duplicates table that could overwhelm output. The agent has no deduplication threshold or pagination guidance.

### Issues Found

| # | Severity | Issue |
|---|----------|-------|
| 1 | **HIGH** | No graceful handling when `config/federation.toml` does not exist. Agent will fail or produce confusing output on first run. Needs: create file with instructions, or display "No repos configured. Run `/blueprint:federate add <path>` to get started." |
| 2 | **MEDIUM** | The `add` subcommand takes `<path-or-url>` but the TOML config requires a `name` field. No instruction on how `name` is derived or whether the user must provide it separately. |
| 3 | **MEDIUM** | No output throttling for large federation sets. Self-federation test would produce 41x41 duplicate comparisons with no pagination or summary-first approach. |
| 4 | **LOW** | The skill references `config/federation.toml` but the "Shared Context" section at the top says to read from `{adr_directory}/.state/state.toml`. The `config/` directory is at the repo root, NOT inside `{adr_directory}/.state/`. This path inconsistency could confuse the executing agent. |
| 5 | **LOW** | The `Remove Repo` mode says "Re-index remaining repos" but doesn't specify what happens when removing the last repo (back to empty state). |

### Verdict: PASS WITH NOTES
The skill definition is well-structured and the agent template is thorough, but the missing empty-state handling is a real usability gap. First-time users will hit the missing `federation.toml` wall immediately. The `name` derivation ambiguity is a papercut that will cause friction.

---

## Test 2: /blueprint:radar

### Execution Log

1. **Read `commands/radar.md`** -- Skill definition loads cleanly. Four rings (Adopt/Trial/Assess/Hold), four quadrants, three modes (View, Add/Move, Audit).
2. **Read `config/radar.toml`** -- File exists but is EMPTY (comments only, no `[[technologies]]` entries). This is the default template state.
3. **Path discrepancy check:** The `radar.md` skill references `{adr_directory}/.state/radar.toml` but the actual file lives at `config/radar.toml` (repo root). No `.state/` directory exists under `docs/adr/`. This is the same path issue as federate.
4. **Attempted to build radar for Blueprint's own dependencies:**

   | Technology | Ring | Quadrant | Governing ADRs | Notes |
   |-----------|------|----------|----------------|-------|
   | Commander.js | **Adopt** | Languages & Frameworks | ADR-0017 (package-as-plugin) | CLI framework, core dependency in `package.json` |
   | @inquirer/prompts | **Adopt** | Languages & Frameworks | ADR-0017 | Interactive prompts for CLI, `package.json` dependency |
   | Ora | **Adopt** | Tools | ADR-0017 | Spinner/progress for CLI UX, `package.json` dependency |
   | TOML | **Adopt** | Techniques & Patterns | ADR-0003 (use-toml-for-config-dsl), ADR-0022 (config-as-dsl) | Config DSL format, fundamental to the tool |
   | Markdown | **Adopt** | Techniques & Patterns | ADR-0001 (use-adrs), ADR-0030 (architecture-md) | ADR format, output format, documentation |
   | Claude Code Plugin System | **Adopt** | Platforms & Infrastructure | ADR-0017 | Packaging/distribution mechanism |
   | Node.js >= 18 | **Adopt** | Platforms & Infrastructure | ADR-0017 | Runtime, specified in `engines` |
   | Agent-based Architecture | **Adopt** | Techniques & Patterns | ADR-0016 (single-responsibility-per-agent), ADR-0020 (parallel-evaluation) | Core execution model |

5. **Technologies Blueprint should consider putting on Hold:**
   - No obvious "Hold" candidates -- Blueprint has a lean dependency set (only 3 npm packages).
   - Potential **Assess** candidates: If Blueprint ever considers adding a database, ORM, or web framework, those would start in Assess.
   - The lack of Hold entries is actually a positive signal for a tool this focused.

6. **Skill integration check:** The "Integration with Other Commands" section references `/blueprint:map` (Wardley mapping) and `/blueprint:advise` (Advice Process) -- both exist as v2 commands. Good cross-referencing.

### Issues Found

| # | Severity | Issue |
|---|----------|-------|
| 1 | **HIGH** | Path mismatch: skill says `{adr_directory}/.state/radar.toml` but actual file is `config/radar.toml`. The agent following these instructions would look in the wrong location and either fail or create a duplicate file. |
| 2 | **MEDIUM** | The default `config/radar.toml` ships empty (comments only). The View mode (`/blueprint:radar`) has no instruction for what to display when there are zero technologies. Should show "Radar is empty" + suggest `/blueprint:radar add`. |
| 3 | **LOW** | The quadrant "Languages & Frameworks" is used for both language-level choices (TypeScript) AND library-level choices (Commander.js, Inquirer). For a project like Blueprint with only 3 deps, this works, but for larger projects the quadrant would be overloaded. Consider whether libraries belong in "Tools" instead. |
| 4 | **LOW** | The `audit` subcommand says "Scan codebase for technologies in Hold ring" but doesn't specify HOW to detect technology usage (import statements? package.json? config files?). The agent needs more concrete scanning guidance. |

### Verdict: PASS WITH NOTES
The radar concept is solid and the ring/quadrant taxonomy is clear. The ThoughtWorks methodology adapts well to project-level use. However, the path mismatch between the skill definition and the actual config location is a blocking issue -- an agent following the instructions literally would fail. The empty-state handling gap mirrors the same issue in federate.

---

## Test 3: /blueprint:govern

### Execution Log

1. **Read `commands/govern.md`** -- Skill definition loads cleanly. Four governance modes (Lightweight, Advised, Governed, Formal). Three process modes (View, Set, Mode-specific behavior).
2. **Read `config/governance.toml`** -- File exists with real configuration:
   - `mode = "lightweight"` (default, correct)
   - `[advised]` section: `require_advice_before_propose = true`, `minimum_consultations = 2`
   - `[governed]` section: `required_approvals = 2`, `approvers = []` (empty -- correct for lightweight mode)
   - `[formal]` section: `board_members = []`, `gate_phases` defined with 4 phases
3. **Test: Does default "lightweight" mode work correctly?**
   - The `governance.toml` has `mode = "lightweight"` set. This is correct.
   - Lightweight behavior per the skill: `/blueprint:new` creates Proposed ADR immediately, `/blueprint:transition accept` works without review, no approval tracking.
   - This matches Blueprint's actual current behavior -- ADRs 0001-0041 were all created and accepted without approval workflows.
   - **WORKS CORRECTLY** for the default case.
4. **Test: Simulate switching to "advised" mode -- what would change?**
   - Setting `mode = "advised"` would activate: `/blueprint:new` prompting for `/blueprint:advise` first; advice section required in ADR before acceptance; `/blueprint:transition accept` checks for advice documentation.
   - The `[advised]` config already specifies `minimum_consultations = 2`.
   - **Practical impact on Blueprint:** Creating a new ADR-0042 would require running `/blueprint:advise` first, consulting at least 2 parties, and documenting their input before the ADR can be accepted.
   - **Problem:** The skill says advised mode "requires `{adr_directory}/.state/contexts.toml` with owners" -- but `contexts.toml` lives at `config/contexts.toml`, not in a `.state/` directory. Same path bug as the other commands.
   - **Problem:** The `contexts.toml` requirement is mentioned but there is no guidance on what "owners" means in the context of a single-maintainer project like Blueprint. Who are the 2 consultations with?
5. **Test: Does the skill handle missing `governance.toml`?**
   - The View mode says "Read `{adr_directory}/.state/governance.toml`" -- same path mismatch issue.
   - Beyond the path issue, there is NO instruction for what to do if `governance.toml` does not exist. No "create with defaults" step, no "governance not configured" message.
   - Since the file ships with the tool (it exists in `config/`), this is less critical than the federation case -- but for users who delete or corrupt the file, there is no recovery path documented.
6. **Test: Are mode descriptions clear enough for a new user?**
   - The four-row mode table (Lightweight/Advised/Governed/Formal) with Description and "Best For" columns is excellent. Clear, concise, progressive.
   - The "Mode-Specific Behavior" section spells out exactly what changes for each mode in terms of `/blueprint:new` and `/blueprint:transition accept` behavior. This is good.
   - The config file example shows all four mode sections with their fields. Clear.
   - **One gap:** The difference between "Governed" (`auto_request_review = true`) and "Formal" (phase gates) could be clearer. Both require approvals -- the formal mode adds sequential phases, but a new user might not understand why they would choose Governed over Formal.

### Issues Found

| # | Severity | Issue |
|---|----------|-------|
| 1 | **HIGH** | Path mismatch (systematic across v2 commands): skill references `{adr_directory}/.state/governance.toml` and `{adr_directory}/.state/contexts.toml` but actual files are at `config/governance.toml` and `config/contexts.toml`. |
| 2 | **MEDIUM** | No fallback for missing `governance.toml`. If the file is absent, no create-with-defaults or error message is specified. |
| 3 | **MEDIUM** | Advised mode requires `minimum_consultations = 2` but no guidance for single-maintainer or small-team projects where 2 consultations may not be practical. Should suggest that "consultations" can include AI review agents or external stakeholders. |
| 4 | **LOW** | The `[governed]` section ships with `approvers = []` (empty list). If a user switches to governed mode without adding approvers, the behavior is undefined -- does acceptance block forever? Does it fall through? Should validate on mode switch. |
| 5 | **LOW** | The `governance.toml` has `auto_request_challenge = false` in the `[governed]` section, but this field does not appear in the skill definition's example config. Undocumented field. |
| 6 | **LOW** | Formal mode's `gate_phases` in the actual config has 4 phases (`["research", "challenge", "review", "board-review"]`) but the skill definition says 3 (`["research", "review", "board-review"]`). The config added "challenge" -- this delta is undocumented. |

### Verdict: PASS WITH NOTES
The governance tier system is well-designed and the mode descriptions are clear enough for adoption. The lightweight default works correctly against Blueprint's own codebase. The systematic `{adr_directory}/.state/` path mismatch is the most significant issue -- it affects ALL three commands tested and represents a v2-wide bug where the skill definitions reference a directory structure that does not exist.

---

## Cross-Cutting Issue

All three v2 commands share the same path bug: they reference `{adr_directory}/.state/<file>.toml` but the actual config files live at `config/<file>.toml` in the repository root. This is a **systematic issue** that likely affects every v2 command, not just these three. This should be addressed as a single fix across all v2 skill definitions, either by:

1. Moving config files to `{adr_directory}/.state/` to match the docs, OR
2. Updating all skill definitions to reference `config/` to match reality.

Option 2 is recommended since `config/` is already populated and the `{adr_directory}/.state/` directory does not exist.

## Summary

| Command | Verdict | Blocking Issues |
|---------|---------|-----------------|
| `/blueprint:federate` | PASS WITH NOTES | Missing empty-state handling, path mismatch |
| `/blueprint:radar` | PASS WITH NOTES | Path mismatch (blocking for agent execution), empty-state handling |
| `/blueprint:govern` | PASS WITH NOTES | Path mismatch (systematic), undocumented config fields |

**Overall v2 readiness:** The skill definitions are well-structured and the concepts are sound, but the path mismatch is a deployment-blocking bug that would cause agent failures on first execution. Fix the paths, add empty-state handling, and these three commands are production-ready.
