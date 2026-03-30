# ADR-0016: Enforce single responsibility per agent

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0016                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint uses multiple AI agents to perform specialized analysis tasks — researching options, challenging decisions, analyzing impact, auditing compliance, evaluating consistency, mapping bug surfaces, assessing maintainability, evaluating testing strategy, analyzing Conway's Law alignment, and running retrospectives. The design question is how to decompose these responsibilities across agents.

The multi-purpose approach combines related functions into fewer agents. A "reviewer" agent handles both devil's advocate challenge and compliance auditing. An "evaluator" agent handles consistency, maintainability, and testing strategy. This reduces the total number of agents (5-6 total), gives each agent more context about related concerns, and reduces orchestration overhead.

The single-responsibility approach assigns one job to each agent. Each agent has a focused prompt, a narrow scope, and orthogonal output. This increases the total number of agents (11 total) but ensures each agent's output is predictable, its prompt is optimized for one task, and it can be developed, tested, and improved independently.

The choice has implications for prompt engineering, output quality, parallelism, and maintainability of the agent system itself.

## Options Considered

### Option 1: Few multi-purpose agents (5-6 total)

- **Pros:** Less orchestration overhead. More context per agent — a combined reviewer can see challenge findings while auditing compliance. Fewer agent definitions to maintain. Lower total token cost per evaluation.
- **Cons:** Prompts become complex as they serve multiple purposes. Output quality degrades when a single prompt tries to optimize for two different tasks. Hard to improve one function without affecting the other. Testing requires exercising all functions in combination.

### Option 2: Many focused agents (11 total)

- **Pros:** Each agent has one job and one prompt optimized for that job. Agents are orthogonal — improving the bug surface mapper cannot break the compliance auditor. Agents can run in parallel when their inputs are independent. Output is predictable and composable. Each agent can be tested in isolation.
- **Cons:** More agent definitions to maintain. Orchestration logic must coordinate 11 agents. Some agents may need context that another agent produced, creating ordering dependencies. Higher total token cost when running all agents.

### Option 3: Dynamic agent composition

- **Pros:** Combine agents at runtime based on the specific request. Maximum flexibility — the system assembles the right team for each task.
- **Cons:** Composition logic is complex and hard to debug. Emergent behavior from arbitrary agent combinations is unpredictable. Testing all possible compositions is combinatorially infeasible.

## Decision

**In the context of** agent architecture design, **facing** the trade-off between fewer complex agents and many focused agents, **we decided for** many focused agents with single responsibility each, **to achieve** predictable output, independent improvability, and parallel execution, **accepting** the overhead of maintaining 11 agent definitions and coordinating their orchestration.

The 11 agents and their single responsibilities:

1. **Researcher** — investigates technology options and trade-offs for proposed decisions.
2. **Devil's advocate** — critically challenges proposed ADRs to find blind spots.
3. **Impact analyzer** — maps relationships and conflicts between ADRs and the codebase.
4. **Compliance auditor** — verifies the codebase follows accepted ADRs.
5. **Consistency auditor** — evaluates structural consistency (patterns, naming, layering, error handling).
6. **Bug surface mapper** — identifies where bugs are structurally likely to emerge.
7. **Maintainability assessor** — evaluates long-term maintainability indicators.
8. **Testing strategy evaluator** — assesses testing completeness including anti-pattern tests (ADR-0014).
9. **Conway's Law analyzer** — examines alignment between architecture and team structure.
10. **Retrospective agent** — analyzes recent fixes for systemic improvements.
11. **Persona** — the shared senior engineer persona is not an agent but a component injected into all agents for consistent voice.

## Rationale

- Single responsibility produces better output quality. An agent prompted solely to "find where bugs are structurally likely to emerge" will produce more thorough, focused findings than an agent prompted to "evaluate consistency, find bug-prone areas, and assess maintainability" in one pass. LLM output quality degrades as prompt complexity increases.
- Independent improvability is critical for a system that will iterate over months. When the bug surface mapper produces poor results, the fix is isolated to one agent prompt and one test suite. With multi-purpose agents, fixing one function risks degrading another.
- Parallel execution is a natural benefit. The consistency auditor, bug surface mapper, maintainability assessor, testing strategy evaluator, and Conway's Law analyzer have no ordering dependencies. They can run simultaneously, reducing wall-clock time for a full evaluation from serial (5x single agent time) to parallel (1x single agent time).
- Option 1 was rejected because prompt complexity degrades output quality and couples unrelated concerns. Option 3 was rejected because dynamic composition introduces unpredictable emergent behavior that is impractical to test.

## Consequences

### Positive

- Each agent's prompt is focused and can be optimized for one task without side effects.
- Agents can be tested in isolation with dedicated test fixtures.
- Five evaluation agents run in parallel, reducing wall-clock time for full architecture evaluation.
- New analysis capabilities can be added as new agents without modifying existing ones (open/closed principle).
- Agent output is composable — the orchestrator merges findings from independent agents into a unified report.

### Negative

- 11 agent definitions to maintain, each with its own prompt, examples, and expected output format.
- Orchestration logic must manage dependencies (e.g., impact analyzer runs before compliance auditor if a new ADR was just accepted).
- Total token consumption is higher than multi-purpose agents because each agent independently reads the codebase context.
- Some cross-cutting insights may be missed because no single agent sees the full picture. The consistency auditor and the bug surface mapper may each find symptoms of the same underlying problem without connecting them.

### Risks

- Agent proliferation — the temptation to add more agents for increasingly narrow responsibilities. Mitigation: each agent must justify its existence as an orthogonal concern. If two agents' outputs consistently overlap, they should be merged.
- Orchestration complexity growing as agent count increases. Mitigation: the orchestrator uses a simple dependency graph (DAG) rather than arbitrary coordination logic. Agents declare their inputs and outputs, and the orchestrator topologically sorts execution.
- Inconsistent output formats across 11 agents making report synthesis difficult. Mitigation: all agents share the persona (component 11) and a common output schema defined in the orchestrator.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0014: Anti-pattern tests as first-class category (testing strategy evaluator scope)
- ADR-0011: Two-step verify in retrospective agent (retrospective agent scope)
- ADR-0013: Infer ownership from git history (Conway's Law analyzer scope)
- Robert C. Martin, "Single Responsibility Principle" — each module should have one reason to change
