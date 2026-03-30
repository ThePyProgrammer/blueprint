# Architecture

Blueprint is a Claude Code plugin that manages Architecture Decision Records through a
multi-agent system with a domain-specific config layer. It enforces a formal lifecycle
for architectural decisions: research before proposing, adversarial challenge before
accepting, compliance verification after implementing, drift detection over time, and
retrospective analysis after fixing.

Every agent speaks with the voice of a senior engineer who has watched too many
"temporary" decisions become permanent load-bearing walls.

## Overview

The system has four layers, each with a distinct responsibility:

1. **Skills** (`commands/`) — 21 focused SKILL.md files that define what each command does.
   The user invokes these. Each loads only its own context.
2. **Agents** (`agents/`) — 12 agent definitions that do the actual analytical work.
   Skills spawn these via the Agent tool. Each has a single responsibility.
3. **Config DSL** (`config/`) — 4 TOML files encoding domain knowledge as structured data.
   Agents and skills read these instead of hardcoding rules in prose.
4. **CLI** (`bin/`, `src/`) — Node.js installer that deploys the above three layers to
   `~/.claude/commands/blueprint/`.

Data flows downward: skills read config and spawn agents; agents read config and the
codebase; config is the shared source of truth.

## Codemap

### Entry Points

`commands/blueprint.md` — The root router. Parses natural language intent and dispatches
to the appropriate sub-skill. Only unique logic: proactive intervention when architectural
decisions are being made without ADRs (ADR-0015).

`bin/cli.js` — CLI entry point for installation. Commander.js with `install` and `verify`
subcommands. Not used at runtime.

### Skills (commands/)

Each file is a standalone SKILL.md. Deployed as `<name>/SKILL.md` directories by the installer.

**Setup:**
| File | What it orchestrates |
|------|---------------------|
| `init.md` | Scan existing context, infer ADRs, generate ARCHITECTURE.md (ADR-0029) |

**Lifecycle:**
| File | What it orchestrates |
|------|---------------------|
| `new.md` | Interview → [research] → draft → write → index |
| `review.md` | Spawn devil's advocate → present challenges → verdict (ADR-0021) |
| `transition.md` | Validate against lifecycle.toml → update status → commit |
| `list.md` | ADR table + filtered views + contextual suggestions |
| `search.md` | Grep ADR content + query relationship graph |
| `help.md` | Command reference + contextual state analysis |

**Analysis:**
| File | What it orchestrates |
|------|---------------------|
| `impact.md` | Spawn impact analyzer → update relationship graph (ADR-0010) |
| `audit.md` | Spawn compliance auditor → report + remediation |
| `retro.md` | Spawn retrospective → classify → verify → propose ADR (ADR-0011) |
| `rearchitect.md` | Research → draft superseding ADR → impact check → transition |

**Continuous Governance:**
| File | What it orchestrates |
|------|---------------------|
| `fitness.md` | Extract testable invariants → generate executable test files (ADR-0023) |
| `drift.md` | Analyze git trajectory against ADR expectations over time (ADR-0024) |
| `debt.md` | Monitor deferred ADR triggers, calculate debt score (ADR-0025) |
| `guard.md` | Fast pre-commit invariant check on staged files only (ADR-0026) |

**Documentation & Reporting:**
| File | What it orchestrates |
|------|---------------------|
| `architect.md` | Spawn cartographer → write ARCHITECTURE.md (ADR-0030) |
| `eli5.md` | Plain English explanation of single ADR or full landscape (ADR-0031) |
| `digest.md` | Non-technical stakeholder summary with risk register (ADR-0027) |
| `timeline.md` | Narrative evolution story with eras and pivot points (ADR-0028) |

Skills never contain domain logic. They orchestrate: read config, spawn agents, present
output, update state.

### Agents (agents/)

**Shared persona** (`persona.md`) — Cranky senior engineer personality injected into
every agent (ADR-0005).

**Lifecycle agents:**
- `adr-researcher.md` — Web + codebase research for evidence-backed options
- `adr-devils-advocate.md` — Adversarial challenge across 5 dimensions (ADR-0021)
- `adr-impact-analyzer.md` — Cross-ADR conflict and dependency detection (ADR-0010)
- `adr-compliance-auditor.md` — Codebase-vs-decision drift detection
- `adr-retrospective.md` — Post-fix root cause classification + pattern verification (ADR-0011)

**Evaluation agents** (5 orthogonal dimensions, ADR-0007):
- `adr-consistency-auditor.md` — Pattern adherence across 6 dimensions
- `adr-bug-surface-mapper.md` — Structural bug likelihood mapping
- `adr-maintainability-assessor.md` — Long-term codebase health
- `adr-testing-strategy-evaluator.md` — Test strategy + anti-pattern tests (ADR-0014)
- `adr-conways-law-analyzer.md` — Team-architecture alignment (ADR-0013)

**Documentation agent:**
- `adr-architect-cartographer.md` — Generates ARCHITECTURE.md (matklad philosophy)

### Config DSL (config/)

Domain knowledge encoded as structured TOML (ADR-0003, ADR-0004, ADR-0022):

- `lifecycle.toml` — Finite state machine: 6 statuses, 6 valid transitions, 5 invalid
- `taxonomy.toml` — Root cause categories (10), evaluation dimensions (5), decision categories (11), severity levels (3)
- `state.toml` — Session memory: ADR directory, operation timestamps, history (ADR-0019)
- `relationships.toml` — ADR dependency graph: nodes + typed edges (ADR-0010)

### CLI (bin/, src/)

- `src/paths.js` — Resolves global vs project target paths
- `src/install.js` — Copies commands, agents, config to target
- `src/verify.js` — Checks all expected files exist
- `src/claude-md.js` — Manages fenced section in CLAUDE.md

### ADRs (docs/adr/)

31 self-referential ADRs documenting blueprint's own architectural decisions.

## Invariants

1. **Skills never contain domain logic** — they orchestrate agents and read config (ADR-0002)
2. **All lifecycle transitions validate against lifecycle.toml** — the state machine is data (ADR-0004)
3. **Agents return inline output, never write files** — exception: architect-cartographer (ADR-0008)
4. **Every agent includes persona.md** — cranky senior engineer is not optional (ADR-0005)
5. **Evaluation dimensions are orthogonal** — no inter-agent dependencies during evaluation (ADR-0020)
6. **Retrospective recommendations must be externally verified** — two-step pattern (ADR-0011)
7. **Config is TOML, not JSON** — lower token cost (ADR-0003)
8. **The router is thin** — under 50 lines, dispatch only (ADR-0006)
9. **Fitness functions are generated, not manually written** — ADRs are the source of truth (ADR-0023)
10. **Drift detection analyzes trajectory, not snapshots** — git history over time (ADR-0024)

## Cross-Cutting Concerns

**Persona injection.** Every agent reads `agents/persona.md` via a `<persona>` block.
When spawning an agent, always include persona.md content alongside the agent's instructions.

**Config loading.** Skills read config from `config/` relative to the blueprint command
directory. Path resolved via `config/state.toml` with auto-detect fallback.

**ADR directory detection.** Multiple skills detect independently: state.toml cache,
then glob `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`.

**Index management.** Every ADR create/transition updates the README.md index table.

**Commit conventions.** `docs(adr): [action] ADR-NNNN <title>` for ADR operations.
`docs: generate/update ARCHITECTURE.md` for architecture docs.
`test(architecture): generate fitness functions` for fitness functions.

**ARCHITECTURE.md as context.** Seven agents read `docs/ARCHITECTURE.md` as their first
orientation step when it exists — provides module boundaries, invariants, and cross-cutting
concerns before scanning.

## Architecture Decisions

See `docs/adr/` for the full set of 31 ADRs documenting why blueprint is built this way.
ARCHITECTURE.md tells you WHERE things are. ADRs tell you WHY they're that way.

---
*Generated following [matklad's ARCHITECTURE.md philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html).
Revisit a couple of times a year.*
