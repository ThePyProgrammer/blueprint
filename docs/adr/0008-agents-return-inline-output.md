# ADR-0008: Agents return inline output, not files

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0008                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's agents produce reports: devil's advocate challenges, compliance audit results, evaluation dimension analyses, retrospective findings. These reports need to flow from the agent back to the orchestrating sub-skill, which formats and presents them to the user.

There are two established patterns for agent output in Claude Code plugin ecosystems. The first is file-based: agents write their output to report files on disk, and downstream consumers read those files. GSD's bug-hunt pipeline uses this pattern because its agents run in sequence, each consuming the previous agent's file output as input. The second is inline: agents return their output directly to the caller, which captures it in the conversation context.

Blueprint's agents are simpler than GSD's pipeline agents. Each blueprint agent produces a one-shot report that is consumed by exactly one orchestrator — the sub-skill that spawned it. There is no sequential pipeline where Agent B needs Agent A's file. The orchestrator spawns agents (sometimes in parallel), collects their output, and presents it.

## Options Considered

### Option 1: Write report files to disk

Each agent writes its report to a file (e.g., `.blueprint/reports/consistency-2026-03-30.md`). The orchestrator reads the file after the agent completes. Provides persistence, allows reports to be re-read later, and follows the established GSD pattern.

### Option 2: Return output inline to orchestrator

Each agent returns its report as text output in the conversation context. The orchestrator captures the output directly — no file I/O. Reports are ephemeral unless the orchestrator explicitly saves them.

### Option 3: Hybrid (files for evaluation team, inline for others)

The five evaluation agents write files (because there are five of them and the orchestrator needs to synthesize), while simpler agents (devil's advocate, compliance audit) return inline. Optimizes each case but creates two patterns that agents and developers must understand.

## Decision

**All blueprint agents return their output inline to the orchestrating sub-skill**, because blueprint's agent topology is one-shot fan-out (orchestrator spawns agents, collects results), not sequential pipeline, and inline output eliminates file management complexity without sacrificing any capability the current architecture needs.

## Rationale

- Simplicity: no file paths to manage, no directories to create, no naming conventions to enforce, no cleanup after runs. The orchestrator spawns an agent, the agent returns text, the orchestrator has the result. Done.
- No stale files: file-based output creates a cleanup problem. Old report files accumulate in the working directory. Users or tools must periodically purge them. Inline output has no persistence by default, so there is nothing to clean up.
- No file I/O errors: file-based output can fail due to permissions, disk space, path conflicts, or concurrent writes. Inline output cannot fail in these ways.
- The topology justifies the choice. GSD uses file-based output because Agent B reads Agent A's file — the file is a communication channel between sequential agents. Blueprint's agents do not communicate with each other. Each agent communicates only with the orchestrator that spawned it. Inline return is the natural pattern for this topology.
- Parallel evaluation works fine with inline output. The orchestrator spawns five evaluation agents, each returns inline, and the orchestrator collects all five results. The conversation context handles the fan-in naturally.

## Consequences

### Positive

- Zero file management overhead — no creation, naming, cleanup, or conflict resolution.
- No stale report files accumulating in the project directory.
- No file I/O failure modes (permissions, disk space, path conflicts).
- Simpler agent prompts — agents just produce output instead of managing file writes.
- The orchestrator has immediate access to results without a file read step.

### Negative

- Reports are ephemeral. Once the conversation context is lost, the report is gone unless the user explicitly saved it. File-based reports persist across sessions by default.
- Very large reports may consume significant conversation context, reducing the budget available for subsequent reasoning by the orchestrator.
- No built-in report history. Users cannot easily compare today's evaluation with last week's without re-running the evaluation.

### Risks

- If blueprint's agent topology evolves to include sequential pipelines (Agent B consuming Agent A's output), inline return may be insufficient. Mitigation: this would be a new architectural decision warranting its own ADR. The current topology is fan-out, and inline serves fan-out well.
- Context window pressure: five evaluation agents each returning substantial inline reports could consume a large fraction of the orchestrator's context. Mitigation: agents are instructed to produce concise, structured output. The cranky senior engineer persona (ADR-0005) naturally produces terse output.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0005: Adopt cranky senior engineer persona across all agents
- ADR-0007: Separate evaluation into five orthogonal dimensions
