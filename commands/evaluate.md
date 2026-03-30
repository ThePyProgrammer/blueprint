---
name: blueprint:evaluate
description: >
  Run the architecture evaluation team — 5 specialized agents analyzing consistency, bug surface,
  maintainability, testing strategy, and Conway's Law alignment. Use when: "evaluate architecture",
  "arch eval", "architecture review", "system evaluation", "evaluate codebase". Run individual
  dimensions with: "/blueprint:evaluate consistency", "/blueprint:evaluate testing", etc. Produces a
  comprehensive report with proposed ADRs for critical findings.
---

# Architecture Evaluation Team

Spawns a team of 5 specialized agents in parallel to produce a comprehensive architecture
evaluation. Each agent focuses on one dimension. Results are synthesized into a unified
report with proposed ADRs for the most critical findings.

## Shared Context

Read from parent `adr/` skill directory:
- `config/taxonomy.toml` — evaluation dimensions with agent mappings
- `{adr_directory}/.state/state.toml` — last evaluation date, ADR directory
- `agents/persona.md` — shared personality

## Dimensions

Read `config/taxonomy.toml` `evaluation_dimensions` for the canonical list. Currently:

| Dimension | Agent | Aspect Focus |
|-----------|-------|-------------|
| consistency | adr-consistency-auditor | naming, layering, dependency direction, error handling |
| bugs | adr-bug-surface-mapper | complexity, coupling, boundaries, state, implicit contracts |
| maintainability | adr-maintainability-assessor | dependencies, abstractions, change amplification, debt |
| testing | adr-testing-strategy-evaluator | pyramid, risk coverage, anti-pattern tests, quality |
| conways | adr-conways-law-analyzer | ownership, friction points, bottlenecks, scaling |

## Process

### Full Evaluation (`/blueprint:evaluate`)

1. Read all 5 agent files + `agents/persona.md` from parent skill directory
2. Spawn all 5 agents in parallel (single message, 5 Agent tool calls) with:
   - Full agent instructions + persona
   - Project root path, ADR directory path
   - List of existing ADR filenames
3. As agents complete, collect their reports
4. **Synthesize unified report:**
   - Overall health score: STRONG / ADEQUATE / CONCERNING / CRITICAL
   - Top 3 risks across all dimensions
   - Top 3 strengths across all dimensions
5. **Collect proposed ADRs** from all agent reports, deduplicate, prioritize
6. Ask user which to create:
   - "Create all proposed ADRs"
   - "Let me pick" — present list for selection
   - "Report only" — skip ADR creation
7. Draft selected ADRs via the `/blueprint:new` flow
8. Update `{adr_directory}/.state/state.toml` — set `last_evaluation` to today, append to evaluation_history

### Individual Evaluation (`/blueprint:evaluate [dimension]`)

Spawn only the specified dimension's agent. Same process but single agent, no synthesis step.
Valid dimensions: `consistency`, `bugs`, `maintainability`, `testing`, `conways`.
