---
name: blueprint
description: >
  ADR system router — detects architectural decision intent and routes to the right sub-skill.
  Triggers proactively when a significant architectural choice is being made without an ADR.
  For specific operations use sub-skills directly: /blueprint:help, /blueprint:list, /blueprint:new, /blueprint:review,
  /blueprint:challenge, /blueprint:transition, /blueprint:search, /blueprint:scope, /blueprint:impact, /blueprint:audit,
  /blueprint:reflect, /blueprint:evidence, /blueprint:retro, /blueprint:evaluate, /blueprint:tradeoff, /blueprint:risk,
  /blueprint:rearchitect, /blueprint:architect, /blueprint:diagram, /blueprint:eli5, /blueprint:fitness, /blueprint:trace,
  /blueprint:drift, /blueprint:debt, /blueprint:guard, /blueprint:map, /blueprint:advise, /blueprint:digest, /blueprint:timeline,
  /blueprint:export, /blueprint:views, /blueprint:federate, /blueprint:radar, /blueprint:govern, /blueprint:status,
  /blueprint:health, /blueprint:hooks, /blueprint:init.
---

# ADR System Router

Routes ADR intent to the appropriate sub-skill. Also triggers proactively when a significant
architectural choice is being made without documentation.

## Routing Table

| User says | Route to |
|-----------|----------|
| "help", "what commands" | `/blueprint:help` |
| "list", "show decisions", "status" | `/blueprint:list` |
| "new", "create", "document this" | `/blueprint:new` |
| "review N", "challenge N" | `/blueprint:review` |
| "accept N", "reject N", "defer N", "deprecate N" | `/blueprint:transition` |
| "search X", "why did we choose X" | `/blueprint:search` |
| "impact N", "conflicts" | `/blueprint:impact` |
| "audit", "compliance" | `/blueprint:audit` |
| "retro", "band-aid", "review this fix" | `/blueprint:retro` |
| "evaluate", "arch eval" | `/blueprint:evaluate` |
| "rearchitect", "replace decision" | `/blueprint:rearchitect` |
| "init", "bootstrap", "set up blueprint", "onboard" | `/blueprint:init` |
| "eli5", "explain", "summarise", "big picture" | `/blueprint:eli5` |
| "architect", "architecture doc", "map codebase" | `/blueprint:architect` |
| "status", "dashboard", "governance health" | `/blueprint:status` |
| "health", "validate", "check consistency" | `/blueprint:health` |
| "hooks", "configure automation", "install hooks" | `/blueprint:hooks` |
| "fitness", "fitness functions", "architecture tests" | `/blueprint:fitness` |
| "drift", "is architecture eroding?", "trajectory" | `/blueprint:drift` |
| "debt", "decision debt", "deferred decisions due" | `/blueprint:debt` |
| "guard", "pre-commit check", "check before commit" | `/blueprint:guard` |
| "digest", "stakeholder summary", "executive digest" | `/blueprint:digest` |
| "timeline", "decision history", "how did we get here" | `/blueprint:timeline` |
| "scope", "contexts", "bounded context", "domain boundaries" | `/blueprint:scope` |
| "challenge N", "forces", "weigh decision", "dcar" | `/blueprint:challenge` |
| "reflect", "conformance", "reflexion model", "does code match?" | `/blueprint:reflect` |
| "evidence", "epistemic", "stale research", "evidence audit" | `/blueprint:evidence` |
| "map", "wardley", "strategic", "build vs buy", "evolution stage" | `/blueprint:map` |
| "diagram", "c4", "visualize architecture", "generate diagram" | `/blueprint:diagram` |
| "trace", "fitness traceability", "governance coverage" | `/blueprint:trace` |
| "advise", "advice process", "who should I consult?" | `/blueprint:advise` |
| "tradeoff", "utility tree", "sensitivity points", "atam" | `/blueprint:tradeoff` |
| "risk", "risk heat map", "ungoverned code" | `/blueprint:risk` |
| "export", "arc42", "documentation export" | `/blueprint:export` |
| "views", "stakeholder views", "4+1", "filter by view" | `/blueprint:views` |
| "federate", "cross-repo", "multi-repo decisions" | `/blueprint:federate` |
| "radar", "technology radar", "adopt/hold" | `/blueprint:radar` |
| "govern", "governance mode", "approvals required" | `/blueprint:govern` |

When the user invokes `/blueprint` with arguments, parse the intent and invoke the matching
sub-skill via the Skill tool. If ambiguous, invoke `/blueprint:help`.

## Proactive Intervention

If you notice the conversation heading toward a significant architectural choice — and no
ADR exists for it — pause and suggest `/blueprint:new`. Significant means: constrains future work,
hard to reverse, or affects multiple components.

**Trigger on:** database/cache/queue selection, framework choice, API pattern design,
deployment model, auth strategy, data model decisions.

**Don't trigger on:** variable naming, minor library choices, test framework selection.

## Config Layer

### Config Resolution Protocol

All skills use this protocol to find config files. This handles both the plugin's own
repo (config files at `config/`) and consumer projects (config at `{adr_directory}/.state/`).

**Step 1 — Find ADR directory:**
Check (in order): `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/` in the project root.

**Step 2 — Find mutable state files** (state.toml, relationships.toml, contexts.toml, evidence.toml, governance.toml, radar.toml):
Check in order, use the first that exists:
1. `{adr_directory}/.state/<file>.toml` — per-project state (created by `/blueprint:init`)
2. `config/<file>.toml` — plugin's own repo fallback (when running Blueprint on itself)

If neither exists and the file is required, prompt user to run `/blueprint:init`.

**Step 3 — Find static schemas** (lifecycle.toml, taxonomy.toml):
Always at `config/` relative to the blueprint skill directory. These ship with the plugin.

### Static Schemas
- `config/lifecycle.toml` — State machine DSL
- `config/taxonomy.toml` — Classification system

### Mutable State Files
- `state.toml` — Session memory, ADR directory path, operation history
- `relationships.toml` — ADR dependency graph
- `contexts.toml` — DDD bounded context definitions
- `evidence.toml` — Epistemic status tracking
- `governance.toml` — Governance mode configuration
- `radar.toml` — Technology Radar
