# Changelog

All notable changes to Blueprint are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [2.1.1] — 2026-04-28

### Fixed
- Native Claude Code plugin discovery now exposes `/blueprint:grill-me` by shipping `skills/<command>/SKILL.md` directories
- Legacy flat skill files remain for CLI installer compatibility

### Verified
- Architecture fitness functions pass: 17 passed, 0 failed, 0 warnings
- Fresh native plugin invocation loads `/blueprint:grill-me`

## [2.1.0] — 2026-04-28

### Added
- `/blueprint:grill-me` — interactive ADR grilling sessions with `recall`, `debate`, `scenario`, and `mixed` modes
- Smart ADR selection across status, bounded contexts, relationships, and evidence metadata
- Optional `--report` scorecards under `outputs/grill-me/` with redaction guidance for sensitive content

### Changed
- Release, help, router, install, verify, and documentation metadata now include the grill-me command

### Verified
- Architecture fitness functions pass: 16 passed, 0 failed, 0 warnings

**45 skills | 21 agents | 41 ADRs | grill-me release**

## [2.0.8] — 2026-04-01

### Fixed
- Remove explicit `hooks` field from plugin.json — `hooks/hooks.json` is auto-loaded by convention, explicit reference caused duplicate load error in newer Claude Code versions

**44 skills | 21 agents | 41 ADRs | 1 commit**

## [2.0.7] — 2026-04-01

### Fixed
- Disable all `type: "prompt"` hooks — fundamentally unreliable, LLMs explain reasoning even when told to be silent, producing output that blocks continuation

**44 skills | 21 agents | 41 ADRs | 1 commit**

## [2.0.6] — 2026-03-31

### Fixed
- Strip noisy prompt hooks: Stop, SessionEnd, SubagentStop, Feynman cross-ref, GSD/RAPID phase completion, FileChanged on `.planning/` and `skills/*.md`
- Keep only low-frequency hooks: SessionStart nudge, PostToolUse Skill bug-fix, FileChanged on dependency manifests

**44 skills | 21 agents | 41 ADRs | 1 commit**

## [2.0.5] — 2026-03-31

### Fixed
- Remove Bash PostToolUse hook entirely — even `disabled: true` didn't prevent false positives
- Correct hook stdin field name: `tool_response` not `tool_output` (matching Claude Code hook schema)

**44 skills | 21 agents | 41 ADRs | 2 commits**

## [2.0.4] — 2026-03-31

### Fixed
- Disable retro-suggest Bash hook by default — fires on every Bash command, causes errors when `node` isn't in PATH (common with nvm)

**44 skills | 21 agents | 41 ADRs | 1 commit**

## [2.0.3] — 2026-03-31

### Fixed
- Replace prompt-based retro hook with deterministic Node.js script (`retro-suggest.js`) — prompt hooks produce false positives on every Bash command
- Scope retro-suggest to `git commit` commands only

**44 skills | 21 agents | 41 ADRs | 2 commits**

## [2.0.2] — 2026-03-31 — Developer Experience & Cross-Plugin Hooks

### Added
- `/blueprint:onboard` — 5-minute architecture walkthrough for new team members
- `/blueprint:nudge` — periodic governance health checks with staleness detection
- `/blueprint:quickstart` — bootstrap ADRs from stack templates (Next.js, Django, Go, Rust, Rails)
- Quick-start ADR template sets for 5 common stacks
- `--format` flag on `/blueprint:fitness` for CI integration
- Context-first grouping as default in `/blueprint:list`
- Cross-plugin hooks: GSD/RAPID phase completion → ADR suggestion
- Feynman research → ADR evidence pipeline
- Session-end architectural decision sweep
- `rapid:bug-fix` and `gsd:debug` retro-suggest integration

**44 skills | 21 agents | 41 ADRs | 14 commits**

## [2.0.1] — 2026-03-30 — Plugin Architecture Compliance

### Added
- 3 v2 dashboard views: Contexts, Evidence, Strategic

### Fixed
- Migrate `commands/` → `skills/` per Anthropic plugin spec
- Ship pre-built `hooks/hooks.json` with 4 governance hooks
- Use skills frontmatter for persona preloading
- Update stale v1 counts in ADRs 0002, 0006, 0016
- Extract debt score formula to `taxonomy.toml` — single source of truth

### Audited
- Full compliance audit: 19 COMPLIANT, 5 VIOLATION, 5 PARTIAL
- Plugin architecture audit: 6/7 choices validated, 3 fixes needed

**39 skills | 21 agents | 41 ADRs | 8 commits**

## [2.0.0] — 2026-03-30 — 15 Research-Backed Architecture Paradigms

### Added
- `/blueprint:scope` — DDD bounded context scoping for ADRs
- `/blueprint:challenge` — DCAR structured forces evaluation
- `/blueprint:reflect` — reflexion model architecture conformance
- `/blueprint:evidence` — epistemic status and temporal validity auditing
- `/blueprint:map` — Wardley Map strategic build-vs-buy analysis
- `/blueprint:diagram` — C4 auto-generation from ADR relationship graph
- `/blueprint:trace` — ADR-to-fitness-function traceability matrix
- `/blueprint:advise` — Architecture Advice Process (Harmel-Law)
- `/blueprint:tradeoff` — ATAM quality attribute utility trees
- `/blueprint:risk` — architecture risk heat map (complexity × churn ÷ governance)
- `/blueprint:export` — arc42 12-section documentation export
- `/blueprint:views` — Kruchten 4+1 multi-view ADR tagging
- `/blueprint:federate` — cross-repository ADR aggregation
- `/blueprint:radar` — Technology Radar (Adopt/Trial/Assess/Hold)
- `/blueprint:govern` — configurable governance tiers (lightweight → formal)
- 7 new ADRs (0035–0041) grounding v2 extensions in published research
- 10 new agents: forces-evaluator, reflexion-analyzer, evidence-auditor, context-mapper, strategic-analyzer, diagram-generator, tradeoff-analyzer, risk-mapper, federation-indexer, advice-process
- 6 new config files: `contexts.toml`, `evidence.toml`, `governance.toml`, `radar.toml` + v2 extensions to `state.toml`, `relationships.toml`, `taxonomy.toml`
- Per-project mutable state: state files now live in `{adr_directory}/.state/` instead of global config — multiple projects no longer clobber each other
- Research: 4 parallel briefs on software architecture paradigms, synthesized into final report

### Fixed
- Separate static config (lifecycle, taxonomy) from per-project mutable state (state, relationships, contexts, evidence) in installer
- Update 30+ skill files and 7 agent files from `config/*.toml` → `{adr_directory}/.state/*.toml`

**39 skills | 21 agents | 41 ADRs | 91 commits**

## [1.0.2] — 2026-03-30 — Dogfood & Hardening

### Added
- Architecture fitness functions — Blueprint eats its own dogfood
- Config Resolution Protocol for state path disambiguation

### Fixed
- Backfill v1 ADR nodes in `relationships.toml`
- Populate `contexts.toml` with Blueprint's own bounded contexts
- Add markdown-aware heuristics to agents
- Single-contributor graceful degradation
- Semantic fallback and cross-cutting tag in views
- Empty-state handling in federate, export, and list commands
- Force interaction adjustment formula in DCAR evaluator
- DRY violation: extract `SUB_COMMANDS` constant in installer

### Tested
- Dogfood suite: 14/15 PASS, 1 FAIL (trace — fixed), 3 bugs fixed inline
- Commands tested: scope, challenge, map, reflect, evidence, diagram, tradeoff, risk, advise, export, views, federate, radar, govern

**24 skills | 21 agents | 41 ADRs | 5 commits**

## [1.0.1] — 2026-03-30 — Architecture Dashboard

### Added
- `/blueprint:status` — visual governance dashboard with dark-theme HTML output
- Dashboard written to `docs/adr/web/index.html` with inline CSS from wireframe design tokens
- Wireframe references mandated in status skill

**24 skills | 11 agents | 34 ADRs | 5 commits**

## [1.0.0] — 2026-03-29 — Architecture Decision Records with Teeth

### Added
- Core ADR lifecycle: `/blueprint:new`, `/blueprint:review`, `/blueprint:transition`, `/blueprint:search`, `/blueprint:impact`
- `/blueprint:init` — bootstrap ADRs from existing codebase context
- `/blueprint:audit` — verify codebase follows accepted decisions
- `/blueprint:retro` — post-fix retrospective with root cause classification
- `/blueprint:evaluate` — 5-agent architecture evaluation team (consistency, bugs, maintainability, testing, Conway's Law)
- `/blueprint:rearchitect` — research + supersede existing decisions
- `/blueprint:architect` — generate ARCHITECTURE.md (matklad's philosophy)
- `/blueprint:eli5` — plain English ADR explanations
- `/blueprint:fitness` — CI-runnable architecture fitness functions
- `/blueprint:drift` — gradual architecture erosion detection
- `/blueprint:debt` — deferred decision tracking with trigger conditions
- `/blueprint:guard` — pre-commit ADR invariant checks
- `/blueprint:digest` — non-technical stakeholder summaries
- `/blueprint:timeline` — architecture evolution narrative
- `/blueprint:health` — ADR system self-diagnostic
- `/blueprint:hooks` — configure automatic governance triggers
- Cranky senior engineer persona
- Lifecycle state machine DSL (`lifecycle.toml`)
- Domain taxonomy with root cause categories (`taxonomy.toml`)
- ADR relationship graph (`relationships.toml`)
- Session state persistence (`state.toml`)
- 11 specialized agents: persona, researcher, devil's advocate, impact analyzer, compliance auditor, consistency auditor, bug surface mapper, maintainability assessor, testing strategy evaluator, Conway's Law analyzer, retrospective, architect-cartographer
- 34 Architecture Decision Records
- CLI installer (`npx claude-blueprint install`) with global/project scope

**24 skills | 11 agents | 34 ADRs | 106 commits**

[2.1.1]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.1.1
[2.1.0]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.1.0
[2.0.8]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.8
[2.0.7]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.7
[2.0.6]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.6
[2.0.5]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.5
[2.0.4]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.4
[2.0.3]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.3
[2.0.2]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.2
[2.0.1]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.1
[2.0.0]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v2.0.0
[1.0.2]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v1.0.2
[1.0.1]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v1.0.1
[1.0.0]: https://github.com/ThePyProgrammer/blueprint/releases/tag/v1.0.1
