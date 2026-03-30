# Architecture

Blueprint is a Claude Code plugin that manages Architecture Decision Records through a
multi-agent system with a domain-specific config layer. It enforces a formal lifecycle
for architectural decisions: research before proposing, adversarial challenge before
accepting, compliance verification after implementing, and retrospective analysis after
fixing.

## Overview

The system has four layers, each with a distinct responsibility:

1. **Skills** (`commands/`) — 13 focused SKILL.md files that define what each command does.
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

`commands/blueprint.md` — The root router. 48 lines. Parses natural language intent and
dispatches to the appropriate sub-skill. Only unique logic: proactive intervention when
architectural decisions are being made without ADRs (ADR-0015). This is where a new
user's `/blueprint` invocation lands.

`bin/cli.js` — CLI entry point for installation. Commander.js with `install` and `verify`
subcommands. Not used at runtime — only during setup.

### Skills (commands/)

Each file is a standalone SKILL.md with YAML frontmatter (name, description) and
markdown instructions. They are deployed as `<name>/SKILL.md` directories by the installer.

| File | Lines | What it orchestrates |
|------|-------|---------------------|
| `blueprint.md` | 48 | Router + proactive intervention |
| `help.md` | 90 | Command reference + contextual state analysis |
| `list.md` | 51 | ADR table + filtered views + suggestions |
| `new.md` | 74 | Interview → [research] → draft → write → index |
| `review.md` | 50 | Spawn devil's advocate → present challenges → verdict |
| `transition.md` | 83 | Validate against lifecycle.toml → update status → commit |
| `search.md` | 28 | Grep ADR content + query relationship graph |
| `impact.md` | 38 | Spawn impact analyzer → update relationship graph |
| `audit.md` | 41 | Spawn compliance auditor → report + remediation |
| `retro.md` | 50 | Spawn retrospective → classify → verify → propose ADR |
| `evaluate.md` | 61 | Spawn 5 agents in parallel → synthesize → propose ADRs |
| `rearchitect.md` | 45 | Research → draft superseding ADR → impact check → transition |
| `architect.md` | 50 | Spawn cartographer → write ARCHITECTURE.md |

Skills never contain domain logic. They orchestrate: read config, spawn agents, present
output, update state.

### Agents (agents/)

Each agent is a markdown file with YAML frontmatter (name, description, tools, model,
color) and structured blocks (`<persona>`, `<role>`, `<execution_flow>`, `<output_format>`,
`<quality_gate>`).

**Shared persona** (`persona.md`) — 36 lines defining the cranky senior engineer
personality. Injected into every agent via a `<persona>` block. Shapes tone, not function
(ADR-0005).

**Lifecycle agents** — handle ADR creation and governance:
- `adr-researcher.md` — Web + codebase research for evidence-backed options
- `adr-devils-advocate.md` — Adversarial challenge across 5 dimensions (ADR-0021)
- `adr-impact-analyzer.md` — Cross-ADR conflict and dependency detection (ADR-0010)
- `adr-compliance-auditor.md` — Codebase-vs-decision drift detection
- `adr-retrospective.md` — Post-fix root cause classification + pattern verification (ADR-0011)

**Evaluation agents** — assess architecture health across orthogonal dimensions (ADR-0007):
- `adr-consistency-auditor.md` — Pattern adherence across 6 dimensions
- `adr-bug-surface-mapper.md` — Structural bug likelihood (not bug hunting)
- `adr-maintainability-assessor.md` — Long-term codebase health
- `adr-testing-strategy-evaluator.md` — Test strategy quality + anti-pattern tests (ADR-0014)
- `adr-conways-law-analyzer.md` — Team-architecture alignment (ADR-0013)

**Documentation agent:**
- `adr-architect-cartographer.md` — Generates ARCHITECTURE.md following matklad's philosophy

### Config DSL (config/)

Domain knowledge encoded as structured TOML rather than prose (ADR-0004, ADR-0022):

- `lifecycle.toml` — Finite state machine: 6 statuses, 6 valid transitions with requirements
  and side effects, 5 invalid transitions with error messages. The transition command reads
  this to validate status changes.
- `taxonomy.toml` — Root cause categories (10, extensible), evaluation dimensions (5 with
  agent mappings), decision categories (11), severity levels (3). The retrospective agent
  classifies against this. The evaluation team reads dimension-to-agent mappings from this.
- `state.toml` — Session memory: ADR directory path, last operation timestamps, evaluation
  and retro history. Enables contextual suggestions without re-scanning.
- `relationships.toml` — ADR dependency graph: nodes (ADRs) and typed edges (DEPENDS_ON,
  CONFLICTS, MODIFIES_SCOPE, SUPERSEDES, RELATED). Built incrementally by the impact
  analyzer and lifecycle transitions.

### CLI (bin/, src/)

Node.js ES modules for installation. Not used at runtime.

- `src/paths.js` — Resolves global (`~/.claude/`) vs project (`./.claude/`) target paths
- `src/install.js` — Copies commands as `<name>/SKILL.md` directories, agents, and config
- `src/verify.js` — Checks all 27 expected files exist at the target
- `src/claude-md.js` — Manages a fenced section in CLAUDE.md with command reference

### ADRs (docs/adr/)

22 self-referential ADRs documenting blueprint's own architectural decisions. This is both
the reference implementation and the test suite for the ADR format.

## Invariants

These rules must not be broken. Each references the ADR that established it.

1. **Skills never contain domain logic** — they orchestrate agents and read config.
   Domain knowledge lives in agents (behavioral) and config (structural). (ADR-0002)

2. **All lifecycle transitions validate against lifecycle.toml** — no transition is
   hardcoded in prose. The state machine is data, not English. (ADR-0004)

3. **Agents return inline output, never write files** — the orchestrating skill captures
   and displays output. Exception: the architect-cartographer writes ARCHITECTURE.md
   because that's its entire purpose. (ADR-0008)

4. **Every agent includes persona.md** — the cranky senior engineer persona is not
   optional. It shapes the tone of all output. (ADR-0005)

5. **Evaluation dimensions are orthogonal** — no agent depends on another agent's output
   during evaluation. They run in parallel. (ADR-0020)

6. **Retrospective recommendations must be externally verified** — the two-step pattern
   (classify, then web-verify) is non-negotiable. Unverified patterns are flagged as
   unverified, never presented as established practice. (ADR-0011)

7. **Config is TOML, not JSON** — lower token cost for LLM consumption. (ADR-0003)

8. **The router is thin** — under 50 lines. If routing logic grows, split into a new
   sub-skill, don't fatten the router. (ADR-0006)

## Cross-Cutting Concerns

**Persona injection.** Every agent reads `agents/persona.md` via a `<persona>` block
before its `<role>` block. The persona applies to all output but doesn't override the
agent's functional instructions. When spawning an agent, always include persona.md
content in the prompt alongside the agent's own instructions.

**Config loading.** Skills read config from `config/` relative to the blueprint command
directory. The path is resolved via `config/state.toml` (which caches the ADR directory
location). If state.toml has no cached path, skills auto-detect by checking `docs/adr/`,
`docs/decisions/`, `adr/`, `decisions/` in order.

**ADR directory detection.** Multiple skills need to find the project's ADR directory.
The detection logic is duplicated (each skill checks state.toml, falls back to glob)
rather than centralized. This is intentional — each skill is self-contained and doesn't
depend on another skill having run first.

**Index management.** Every skill that creates or transitions an ADR must update the
README.md index table in the ADR directory. The skill reads README.md, finds the markdown
table, updates the relevant row, and preserves all other content.

**Commit conventions.** All commits from blueprint follow the pattern:
`docs(adr): [action] ADR-NNNN <title>`. Actions: propose, accept, reject, defer,
deprecate, supersede. ARCHITECTURE.md uses `docs: generate/update ARCHITECTURE.md`.

## Architecture Decisions

See `docs/adr/` for the full set of 22 ADRs documenting why blueprint is built this way.
ARCHITECTURE.md tells you WHERE things are. ADRs tell you WHY they're that way.

---
*Generated following [matklad's ARCHITECTURE.md philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html).
Revisit a couple of times a year.*
