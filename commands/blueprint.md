---
name: blueprint
description: >
  ADR system router — detects architectural decision intent and routes to the right sub-skill.
  Triggers proactively when a significant architectural choice is being made without an ADR.
  For specific operations use sub-skills directly: /blueprint:help, /blueprint:list, /blueprint:new, /blueprint:review,
  /blueprint:transition, /blueprint:search, /blueprint:impact, /blueprint:audit, /blueprint:retro, /blueprint:evaluate, /blueprint:rearchitect.
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

All sub-skills share state via `config/` relative to this SKILL.md:
- `config/lifecycle.toml` — State machine DSL
- `config/taxonomy.toml` — Classification system
- `config/state.toml` — Session memory
- `config/relationships.toml` — ADR dependency graph
