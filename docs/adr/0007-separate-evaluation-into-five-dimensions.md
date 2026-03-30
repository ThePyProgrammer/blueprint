# ADR-0007: Separate evaluation into five orthogonal dimensions

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0007                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint includes an architecture evaluation capability — the ability to analyze a codebase and produce assessments of its structural health. The question is how to structure the evaluation: as a single agent that considers everything, or as multiple specialized agents that each focus on a distinct concern.

Architecture quality is not one thing. A codebase can have excellent test coverage but terrible layering discipline. It can have clean dependency graphs but no Conway's Law alignment. It can be internally consistent but riddled with subtle bug-surface patterns. A single evaluator that tries to assess all of these concerns simultaneously will either produce shallow analysis across all dimensions or deep analysis on whichever dimension the LLM fixates on.

The failure modes that matter in real codebases are diverse: inconsistent patterns that confuse contributors, structural hotspots where bugs cluster, abstractions that resist change, testing strategies that miss critical paths, and organizational misalignment that creates friction. Each of these requires different analytical framing.

## Options Considered

### Option 1: Single comprehensive evaluator agent

One agent, one prompt, one pass over the codebase. Produces a unified report covering all quality dimensions. Simple to implement and invoke. But a single agent trying to evaluate consistency, bug surface, maintainability, testing, and organizational alignment in one pass will produce surface-level analysis. The prompt would be enormous, and the agent would have to context-switch between fundamentally different analytical frames.

### Option 2: Five specialized agents (consistency, bugs, maintainability, testing, Conway's Law)

Five agents, each with a single analytical dimension. Each agent has a focused prompt, loads only its own evaluation criteria, and produces a targeted report. Agents can run in parallel for full evaluation or individually for targeted analysis. The orchestrator (evaluate sub-skill) composes the results.

### Option 3: Three broad agents (structure, quality, process)

A middle ground — fewer agents than Option 2, each covering a broader scope. Structure handles consistency and maintainability. Quality handles bugs and testing. Process handles Conway's Law. Reduces agent count but still requires each agent to juggle multiple concerns.

## Decision

**We decompose architecture evaluation into five specialized agents — consistency, bug surface, maintainability, testing strategy, and Conway's Law — each with single responsibility**, because each dimension captures a fundamentally different failure mode that requires its own analytical frame, and because specialized agents produce deeper analysis than generalist ones.

## Rationale

- Each dimension is orthogonal. Consistency analysis asks "are patterns uniform?" Bug surface analysis asks "where are bugs structurally likely?" Maintainability asks "how resistant is this to change?" Testing asks "are the right things tested?" Conway's Law asks "does the architecture match the org?" These are different questions requiring different evidence and different reasoning.
- Specialized agents go deeper. A consistency agent that only evaluates consistency can devote its entire context window and reasoning budget to pattern adherence, layering discipline, naming conventions, and dependency direction. A generalist agent splits that budget five ways.
- Parallel execution: the five agents have no dependencies on each other. They can run simultaneously, producing a full evaluation in the time it takes the slowest agent to complete. A single agent would take 5x as long to cover the same ground (if it could cover it at all).
- Individual invocation: a user who only cares about testing strategy can run just the testing evaluator without paying the token cost of the other four dimensions.
- Each dimension maps to a known class of architectural failure. Consistency failures cause contributor confusion. Bug surface patterns cause reliability issues. Maintainability failures cause velocity decay. Testing gaps cause regression risk. Conway's Law misalignment causes coordination overhead. Five dimensions, five failure classes.

## Consequences

### Positive

- Deeper analysis per dimension than any single-agent approach can achieve.
- Parallel execution for full evaluations, individual execution for targeted ones.
- Each agent's prompt is focused and testable in isolation.
- The five dimensions provide a structured vocabulary for discussing architecture quality.
- Adding a sixth dimension (e.g., security surface) requires only a new agent, not modifying existing ones.

### Negative

- Five agents produce five reports that the orchestrator must synthesize. Cross-cutting findings (e.g., a pattern inconsistency that is also a bug surface) may appear in multiple reports.
- Running all five agents consumes more total tokens than a single agent would, even though the analysis is deeper.
- Users must understand the five dimensions to request targeted evaluations effectively.

### Risks

- Dimension gaps: the five chosen dimensions may not cover all relevant failure modes. Security, performance, and accessibility are not represented. Mitigation: the architecture is extensible — new dimensions can be added as new agents.
- Overlap in findings: consistency issues are often also maintainability issues. Agents may report the same problem from different angles, creating noise. Mitigation: the orchestrator deduplicates cross-cutting findings.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0008: Agents return inline output, not files
- ADR-0005: Adopt cranky senior engineer persona across all agents
