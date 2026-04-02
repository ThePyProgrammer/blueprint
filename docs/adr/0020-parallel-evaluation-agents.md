# ADR-0020: Run evaluation team agents in parallel, not sequentially

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0020                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's architecture evaluation command spawns 5 specialized agents, each analyzing a different dimension of the codebase:

1. **Consistency auditor**: pattern adherence, naming conventions, layering discipline
2. **Bug surface mapper**: structural complexity, coupling hotspots, missing boundaries
3. **Maintainability assessor**: dependency health, abstraction quality, technical debt
4. **Testing strategy evaluator**: coverage architecture, test pyramid health, anti-pattern tests
5. **Conway's Law analyzer**: team structure alignment, module ownership, communication overhead

These 5 agents produce independent reports that an orchestrator synthesizes into a unified evaluation. The question is execution order: should they run sequentially (each seeing the output of prior agents) or in parallel (each operating independently)?

## Options Considered

### Option 1: Sequential execution, each agent builds on previous findings

Agent 1 runs first, Agent 2 receives Agent 1's output as additional context, and so on. This allows later agents to reference earlier findings, potentially producing more coherent analysis. But it makes the total execution time the sum of all 5 agent runtimes, and it introduces a dependency chain where one slow or failing agent blocks all subsequent agents.

### Option 2: Fully parallel execution, all 5 spawn simultaneously

All 5 agents launch at the same time, each with the same input (codebase access, ADR corpus, project config). They produce independent reports. An orchestrator agent synthesizes the 5 reports into a unified evaluation after all complete. Total execution time is the maximum of the 5 runtimes, not the sum.

### Option 3: Hybrid, some sequential dependencies

Some agents run in parallel, others sequentially where there are genuine dependencies. For example, the bug surface mapper might benefit from the consistency auditor's findings. This requires mapping the dependency graph between dimensions and complicates the execution model for marginal benefit.

## Decision

**We run all 5 evaluation agents in fully parallel**, because the 5 evaluation dimensions are orthogonal by design: consistency does not depend on bug surface analysis, testing does not depend on maintainability. Parallel execution is faster and prevents confirmation bias between agents.

## Rationale

- The 5 dimensions were chosen specifically because they are independent analytical lenses. Consistency is about pattern adherence. Bug surface is about structural risk. Maintainability is about long-term health. Testing is about verification strategy. Conway's Law is about organizational alignment. None of these requires the output of another to produce its analysis.
- Sequential execution would take 5x as long in the worst case. If each agent takes 30-60 seconds, sequential execution means 2.5-5 minutes of wall time. Parallel execution means 30-60 seconds total. For a command users run regularly, this difference matters.
- Confirmation bias is a real risk in sequential analysis. If Agent 2 sees Agent 1's finding that "the service layer is inconsistent," Agent 2 may anchor on service layer problems rather than independently discovering that the real bug surface is in the data access layer. Independent analysis produces more diverse findings.
- The orchestrator synthesis step is where cross-dimensional insights emerge. The orchestrator can identify correlations ("the consistency auditor found naming drift in the same modules where the bug surface mapper found high complexity") without the individual agents needing to coordinate.
- Claude Code's `Task` tool supports parallel agent spawning natively. The execution model aligns with the platform's capabilities.

## Consequences

### Positive

- Evaluation completes in the time of the slowest agent rather than the sum of all 5, reducing wall-clock time by roughly 4x.
- Each agent produces an unbiased, independent analysis. No anchoring on previous agents' findings.
- A failure in one agent does not block the other 4. The orchestrator can synthesize a partial evaluation from 4 reports if one agent fails.
- The parallel model is simpler to reason about: no dependency graph, no ordering concerns, no intermediate state passing.

### Negative

- Agents cannot reference each other's findings. If the consistency auditor finds something relevant to the bug surface mapper, that connection is only made at the synthesis stage, not during analysis.
- Total token consumption is higher than sequential execution where later agents could skip areas already covered by earlier agents.
- All 5 agents hit the codebase simultaneously, which could cause rate limiting or resource contention in constrained environments.

### Risks

- Synthesis quality: the orchestrator must be good enough to identify cross-dimensional patterns from 5 independent reports. If it misses correlations, the parallel model produces a less coherent evaluation than sequential would have. Mitigation: the orchestrator prompt explicitly instructs cross-referencing between reports.
- Redundant analysis: multiple agents may analyze the same files or patterns independently, producing duplicate findings in the synthesis. Mitigation: the orchestrator de-duplicates findings during synthesis.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0005: Adopt cranky senior engineer persona across all agents
- Agent definitions: `adr-consistency-auditor`, `adr-bug-surface-mapper`, `adr-maintainability-assessor`, `adr-testing-strategy-evaluator`, `adr-conways-law-analyzer`
