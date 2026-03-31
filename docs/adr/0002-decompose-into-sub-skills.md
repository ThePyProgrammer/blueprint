# ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0002                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's original implementation was a single monolithic SKILL.md file exceeding 430 lines. This file contained the logic for every command: help, list, new, review, evaluate, retro, audit, search, impact, transition, and rearchitect. Every invocation of any command loaded the entire file into the agent's context window — all 430+ lines of instructions, regardless of which command was being executed.

As capabilities grew, the monolith became progressively more unwieldy. Adding a new command meant inserting logic into an already dense file. Modifying one command risked breaking the prompt engineering for another. The agent had to parse hundreds of lines of irrelevant instructions before reaching the relevant section, wasting tokens and increasing the chance of instruction-following errors.

The token cost was not hypothetical. Claude Code skills are loaded into the context window on every invocation. A 430-line skill consumes tokens whether or not those lines are relevant to the current command.

## Options Considered

### Option 1: Keep monolithic SKILL.md

Simplest to maintain in terms of file count. Everything in one place. But the file was already past the point where a single agent could reliably follow all instructions. Adding evaluation agents (5 specialized dimensions) would have pushed it past 600 lines.

### Option 2: Split into sub-skills with thin router

Decompose the monolith into focused sub-skills, each handling one command. A thin router skill at the root parses user intent and dispatches to the appropriate sub-skill. Each sub-skill loads only its own context. The router loads only routing logic.

### Option 3: External plugin framework

Build a formal plugin system with registration, discovery, and lifecycle hooks. Sub-skills would register themselves with the router at startup. More extensible than Option 2, but adds infrastructure complexity that is not justified by the current scale (12 commands, one project team).

## Decision

**We decompose the monolith into focused sub-skills (38 as of v2.0.0) averaging 41-96 lines each, coordinated by a thin router**, because token efficiency demands that each invocation load only the instructions it needs, and because single-responsibility skills are easier to test, modify, and reason about than a monolithic prompt.

## Rationale

- Token efficiency: a `list` invocation now loads ~50 lines instead of 430+. Over hundreds of invocations per day, the savings compound.
- Single responsibility: each sub-skill does one thing. The `review` skill knows how to orchestrate a devil's advocate review. It does not know how to list ADRs or run evaluations. This makes each skill easier to write, test, and modify.
- Fault isolation: a prompt engineering mistake in the `evaluate` skill cannot break the `new` skill. In the monolith, changes to any section could cause instruction-following regressions in unrelated commands.
- The 48-line router is simple enough to verify by inspection. Its only responsibilities are intent parsing and dispatch. See ADR-0006 for the router pattern decision.
- The 12-skill decomposition maps cleanly to the ADR lifecycle: creation (new), review (review, transition), evaluation (evaluate), maintenance (audit, retro, rearchitect), and discovery (list, search, help, impact).

## Consequences

### Positive

- Each sub-skill fits comfortably in the agent's working memory, improving instruction-following reliability.
- New commands are added by creating a new sub-skill file and adding a route — no changes to existing skills required.
- Sub-skills can be tested and iterated independently.
- The router's small size makes dispatch logic easy to audit and debug.

### Negative

- 13 files (router + 12 sub-skills) instead of 1. More files to navigate, more paths to manage.
- Cross-cutting changes (e.g., updating the ADR template format) may require touching multiple sub-skills.
- The router introduces an indirection layer. Users invoke `/blueprint` and the router dispatches, which adds a step to the execution path.

### Risks

- Sub-skill proliferation: as features grow, the number of sub-skills could become unwieldy. Mitigation: the router's intent parser handles natural language, so users do not need to memorize sub-skill names.
- Inconsistency across sub-skills: without shared structure, sub-skills may drift in style and conventions. Mitigation: ADR-0005 (shared persona) and shared config files provide consistency guardrails.

## References

- ADR-0006: Use thin router pattern for command dispatch
- ADR-0005: Adopt cranky senior engineer persona across all agents
- ADR-0001: Use ADRs to document blueprint's own architectural decisions
