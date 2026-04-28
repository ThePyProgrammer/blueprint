# Architecture

Blueprint is a Claude Code plugin that manages Architecture Decision Records through a
multi-agent system with a domain-specific config layer. It enforces a formal lifecycle
for architectural decisions: research before proposing, adversarial challenge before
accepting, compliance verification after implementing, drift detection over time, and
retrospective analysis after fixing.

v2 extends this with 15 paradigm-backed capabilities: DDD bounded context scoping,
DCAR forces evaluation, reflexion model conformance, epistemic status tracking, Wardley
strategic analysis, C4 diagram generation, ATAM tradeoff analysis, risk heat maps,
Architecture Advice Process, cross-repo federation, and configurable governance tiers.

Every agent speaks with the voice of a senior engineer who has watched too many
"temporary" decisions become permanent load-bearing walls.

## Overview

The system has four layers, each with a distinct responsibility:

1. **Skills** (`skills/`): 42 focused SKILL.md files that define what each command does.
   The user invokes these. Each loads only its own context.
2. **Agents** (`agents/`): 21 agent definitions (20 agents + 1 shared persona) that do the
   actual analytical work. Skills spawn these via the Agent tool. Each has a single responsibility.
3. **Config DSL** (`config/`): 9 TOML files encoding domain knowledge as structured data.
   Agents and skills read these instead of hardcoding rules in prose.
4. **CLI** (`bin/`, `src/`): Node.js installer that deploys the above three layers to
   `~/.claude/commands/blueprint/` (or `~/.claude/skills/blueprint/`).

Data flows downward: skills read config and spawn agents; agents read config and the
codebase; config is the shared source of truth.

## Codemap

### Entry Points

`skills/blueprint.md`: The root router. Parses natural language intent and dispatches
to the appropriate sub-skill. Routes to 38 sub-skills via keyword matching. Only unique
logic: proactive intervention when architectural decisions are being made without ADRs (ADR-0015).

`bin/cli.js`: CLI entry point for installation. Commander.js with `install` and `verify`
subcommands. Deploys all 42 skill files, 21 agent files, 9 config files, and 10 hooks.

### Skills (skills/)

Each file is a standalone SKILL.md. Deployed as `<name>/SKILL.md` directories by the installer.

**Setup & Onboarding:**
| File | What it orchestrates |
|------|---------------------|
| `init.md` | Scan existing context, infer ADRs, generate ARCHITECTURE.md, create config files (ADR-0029) |
| `quickstart.md` | Generate foundational ADRs from pre-built stack templates (5 stacks, 27 stubs) |
| `onboard.md` | 5-minute architecture walkthrough for new developers |
| `nudge.md` | Check 10 governance staleness thresholds, surface overdue actions |

**Domain Scoping:**
| File | What it orchestrates |
|------|---------------------|
| `scope.md` | Discover/assign DDD bounded contexts → context map (ADR-0036) |
| `advise.md` | Architecture Advice Process: structured consultation before proposing |

**Lifecycle:**
| File | What it orchestrates |
|------|---------------------|
| `new.md` | Interview → [research] → draft → write → index |
| `challenge.md` | Spawn forces evaluator → DCAR force balance → verdict (ADR-0037) |
| `review.md` | Spawn devil's advocate → adversarial challenge → verdict (ADR-0021) |
| `transition.md` | Validate against lifecycle.toml → update status → commit |
| `list.md` | ADR table + context/evidence columns + filtered views + suggestions |
| `search.md` | Grep ADR content + query relationship graph |
| `help.md` | Command reference + contextual state analysis |

**Analysis:**
| File | What it orchestrates |
|------|---------------------|
| `impact.md` | Spawn impact analyzer → update relationship graph (ADR-0010) |
| `audit.md` | Spawn compliance auditor → report + remediation |
| `reflect.md` | Spawn reflexion analyzer → convergence/divergence/absence (ADR-0038) |
| `evidence.md` | Spawn evidence auditor → epistemic levels + expiry (ADR-0039) |
| `tradeoff.md` | Spawn tradeoff analyzer → ATAM utility tree + sensitivity/tradeoff points |
| `risk.md` | Spawn risk mapper → heat map (complexity × churn ÷ governance) |
| `trace.md` | ADR-to-fitness-function traceability matrix + coverage gaps |
| `retro.md` | Spawn retrospective → classify → verify → propose ADR (ADR-0011) |
| `rearchitect.md` | Research → draft superseding ADR → impact check → transition |

**Strategic Analysis:**
| File | What it orchestrates |
|------|---------------------|
| `map.md` | Spawn strategic analyzer → Wardley evolution stages (ADR-0040) |
| `radar.md` | Technology Radar: adoption lifecycle (Adopt/Trial/Assess/Hold) |

**Continuous Governance:**
| File | What it orchestrates |
|------|---------------------|
| `fitness.md` | Extract testable invariants → generate executable test files (ADR-0023) |
| `drift.md` | Analyze git trajectory against ADR expectations over time (ADR-0024) |
| `debt.md` | Monitor deferred ADR triggers + evidence expiry, calculate debt score (ADR-0025) |
| `guard.md` | Fast pre-commit invariant check on staged files only (ADR-0026) |
| `govern.md` | Configure governance mode: lightweight/advised/governed/formal (ADR-0041) |

**Architecture Evaluation Team (5 parallel agents, ADR-0007):**
| File | What it orchestrates |
|------|---------------------|
| `evaluate.md` | Spawn 5 evaluation agents → synthesize → propose ADRs |

**Documentation & Reporting:**
| File | What it orchestrates |
|------|---------------------|
| `architect.md` | Spawn cartographer → write ARCHITECTURE.md (ADR-0030) |
| `diagram.md` | Spawn diagram generator → C4 diagrams from ADR graph |
| `eli5.md` | Plain English explanation of single ADR or full landscape (ADR-0031) |
| `digest.md` | Non-technical stakeholder summary with risk register (ADR-0027) |
| `timeline.md` | Narrative evolution story with eras and pivot points (ADR-0028) |
| `export.md` | Export ADR collection into arc42 12-section format |
| `views.md` | Tag ADRs with 4+1 architectural views for stakeholder filtering |

**Cross-Repository:**
| File | What it orchestrates |
|------|---------------------|
| `federate.md` | Spawn federation indexer → unified cross-repo ADR index |

**System:**
| File | What it orchestrates |
|------|---------------------|
| `status.md` | Terminal summary + HTML dashboard with knowledge graph (ADR-0032) |
| `health.md` | Self-diagnostic: 8 checks + auto-repair (ADR-0033) |
| `hooks.md` | Configure automatic triggers: guard, retro, sync, dep-watch (ADR-0034) |

Skills never contain domain logic. They orchestrate: read config, spawn agents, present
output, update state.

### Agents (agents/)

**Shared persona** (`persona.md`): Cranky senior engineer personality injected into
every agent (ADR-0005).

**v1 Lifecycle agents:**
- `adr-researcher.md`: Web + codebase research for evidence-backed options
- `adr-devils-advocate.md`: Adversarial challenge across 5 dimensions (ADR-0021)
- `adr-impact-analyzer.md`: Cross-ADR conflict and dependency detection (ADR-0010)
- `adr-compliance-auditor.md`: Codebase-vs-decision verification
- `adr-retrospective.md`: Post-fix root cause classification + pattern verification (ADR-0011)

**v2 Analysis agents:**
- `adr-forces-evaluator.md`: DCAR structured forces evaluation (ADR-0037)
- `adr-reflexion-analyzer.md`: Reflexion model conformance checking (ADR-0038)
- `adr-evidence-auditor.md`: Epistemic status and temporal validity (ADR-0039)
- `adr-context-mapper.md`: DDD bounded context discovery (ADR-0036)
- `adr-strategic-analyzer.md`: Wardley Map strategic analysis (ADR-0040)
- `adr-diagram-generator.md`: C4 diagram auto-generation
- `adr-tradeoff-analyzer.md`: ATAM utility trees and tradeoff identification
- `adr-risk-mapper.md`: Architecture risk heat map (complexity × churn ÷ governance)
- `adr-federation-indexer.md`: Cross-repository ADR aggregation

**Evaluation agents** (5 orthogonal dimensions, ADR-0007):
- `adr-consistency-auditor.md`: Pattern adherence across 6 dimensions
- `adr-bug-surface-mapper.md`: Structural bug likelihood mapping
- `adr-maintainability-assessor.md`: Long-term codebase health
- `adr-testing-strategy-evaluator.md`: Test strategy + anti-pattern tests (ADR-0014)
- `adr-conways-law-analyzer.md`: Team-architecture alignment (ADR-0013)

**Documentation agent:**
- `adr-architect-cartographer.md`: Generates ARCHITECTURE.md (matklad philosophy)

### Config DSL (config/)

Domain knowledge encoded as structured TOML (ADR-0003, ADR-0004, ADR-0022):

**v1 config:**
- `lifecycle.toml`: Finite state machine: 6 statuses, 6 valid transitions, 5 invalid
- `taxonomy.toml`: Root causes (10), eval dimensions (5+6), decision categories (11), severity (3), governance modes (4), evolution stages (4), epistemic levels (3)
- `state.toml`: Session memory: ADR directory, 14 operation timestamps, history (ADR-0019)
- `relationships.toml`: ADR dependency graph: nodes + typed edges (ADR-0010)

**v2 config:**
- `contexts.toml`: DDD bounded context definitions, ADR assignments, context map relationships (ADR-0036)
- `evidence.toml`: Per-ADR epistemic levels, expiry dates, stale claims, dead URLs (ADR-0039)
- `radar.toml`: Technology adoption lifecycle linked to ADRs (created on first use)
- `governance.toml`: Governance mode configuration (created on first use, ADR-0041)
- `quickstart-templates.toml`: Pre-built ADR stubs for 5 stacks (27 ADR templates)

### Hooks (hooks/)

- `hooks.json`: 10 pre-built governance hooks: guard, retro-suggest, bugfix-retro, feynman-evidence, gsd-rapid-adr, agent-adr, architecture-sync, dependency-watch, planning-watch, periodic-nudge, session-sweep, skill-refresh

### CLI (bin/, src/)

- `src/paths.js`: Resolves global vs project target paths
- `src/install.js`: Copies 40 commands, 21 agents, 8 configs to target
- `src/verify.js`: Checks all expected files exist
- `src/claude-md.js`: Manages fenced section in CLAUDE.md

### ADRs (docs/adr/)

41 self-referential ADRs documenting blueprint's own architectural decisions.
ADRs 0001-0034: v1 design. ADRs 0035-0041: v2 extension decisions.

## Invariants

1. **Skills never contain domain logic**: they orchestrate agents and read config (ADR-0002)
2. **All lifecycle transitions validate against lifecycle.toml**: the state machine is data (ADR-0004)
3. **Agents return inline output, never write files**: exception: architect-cartographer (ADR-0008)
4. **Every agent includes persona.md**: cranky senior engineer is not optional (ADR-0005)
5. **Evaluation dimensions are orthogonal**: no inter-agent dependencies during evaluation (ADR-0020)
6. **Retrospective recommendations must be externally verified**: two-step pattern (ADR-0011)
7. **Config is TOML, not JSON**: lower token cost (ADR-0003)
8. **The router is thin**: dispatch only, no analysis logic (ADR-0006)
9. **Fitness functions are generated, not manually written**: ADRs are the source of truth (ADR-0023)
10. **Drift detection analyzes trajectory, not snapshots**: git history over time (ADR-0024)
11. **ADRs can be scoped to bounded contexts**: context from contexts.toml, not flat namespace (ADR-0036)
12. **Evidence confidence uses conservative aggregation**: decision level = min(evidence levels) (ADR-0039)
13. **Governance mode is enforced on lifecycle transitions**: governed mode blocks acceptance without N approvals (ADR-0041)
14. **Every v2 extension traces to published research**: paradigm-backed design, not ad hoc (ADR-0035)

## Cross-Cutting Concerns

**Persona injection.** Every agent reads `agents/persona.md` via a `<persona>` block.
When spawning an agent, always include persona.md content alongside the agent's instructions.

**Config loading.** Skills read config from `config/` relative to the blueprint command
directory. Path resolved via `{adr_directory}/.state/state.toml` with auto-detect fallback.

**ADR directory detection.** Multiple skills detect independently: state.toml cache,
then glob `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`.

**Index management.** Every ADR create/transition updates the README.md index table.

**Bounded context awareness.** v2 skills that read ADRs also read `{adr_directory}/.state/contexts.toml`
to scope analysis to the relevant context. Impact analysis, evaluation, and drift detection
all respect context boundaries when available.

**Evidence tracking.** v2 skills that generate research (researcher agent, evidence auditor)
update `{adr_directory}/.state/evidence.toml` with epistemic levels. `/blueprint:debt` surfaces expired evidence.

**Commit conventions.** `docs(adr): [action] ADR-NNNN <title>` for ADR operations.
`docs: generate/update ARCHITECTURE.md` for architecture docs.
`test(architecture): generate fitness functions` for fitness functions.

**ARCHITECTURE.md as context.** Multiple agents read `docs/ARCHITECTURE.md` as their first
orientation step when it exists, providing module boundaries, invariants, and cross-cutting
concerns before scanning.

## Architecture Decisions

See `docs/adr/` for the full set of 41 ADRs documenting why blueprint is built this way.
ARCHITECTURE.md tells you WHERE things are. ADRs tell you WHY they're that way.

---
*Generated following [matklad's ARCHITECTURE.md philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html).
Revisit a couple of times a year.*
