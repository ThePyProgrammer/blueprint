# ADR-0019: Use session state persistence across invocations

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0019                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Each blueprint invocation starts in a fresh context. The agent has no memory of previous invocations unless state is persisted to disk. Without persistence, every invocation must re-discover the ADR directory location, re-scan all ADRs to determine status counts, and has no knowledge of when operations like audits, evaluations, or retrospectives were last performed.

Re-discovery is not free. Finding the ADR directory means scanning for `docs/adr/`, `adr/`, `decisions/`, or other common locations. Scanning all ADRs means reading every file to extract status metadata. These operations are fast on small projects but represent wasted work when the answers have not changed since the last invocation.

More importantly, some information cannot be re-derived from the ADR files alone. When was the last compliance audit run? When was the last architecture evaluation? What operations were performed in the previous session? This temporal information exists only if something records it.

## Options Considered

### Option 1: Stateless — re-detect everything every time

Every invocation starts from scratch. Scan for the ADR directory, read all ADRs, infer what needs to be done from file timestamps and git history. No state file to maintain, no corruption risk, no staleness concerns. But no temporal awareness either — the system cannot know when audits or evaluations were last run, making contextual suggestions (ADR-0018) impossible for time-based actions.

### Option 2: Persistent state.toml tracking directory, timestamps, and history

A `state.toml` file in the blueprint config directory that records: ADR directory location (discovered once, reused thereafter), last operation dates for audits, evaluations, and retrospectives, and a brief operation history. Updated by skill commands after they complete their operations. Read by help and list commands to generate contextual suggestions.

### Option 3: In-memory only — lost on context reset

Store state in the conversation context. Works within a single Claude Code session but lost entirely when the context resets or a new session starts. This is effectively Option 1 across sessions, with some benefits within a single long session. Not a meaningful improvement for the temporal awareness problem.

## Decision

**We persist session state in a state.toml file**, because temporal awareness requires memory, memory requires persistence, and a lightweight TOML file provides persistence without the complexity of a database, enabling contextual suggestions and eliminating redundant re-discovery across invocations.

## Rationale

- The ADR directory location is the most frequently needed piece of information and the most wasteful to re-discover. Recording it once and reusing it across invocations eliminates a scan that runs on every single command.
- Time-based suggestions ("no audit in 30 days — consider running one") require knowing when the last audit ran. This information does not exist in the ADR files. It must be recorded externally.
- TOML is the established config format for blueprint (ADR-0003). Using it for state maintains consistency and avoids introducing a new format.
- The state file is small (under 50 lines typically), human-readable, and easy to manually inspect or edit if something goes wrong. This is important for a tool that manages a developer workflow — opaque binary state files erode trust.
- The write pattern is simple: each command that modifies state appends or updates its section at the end of its execution. There are no concurrent writers (Claude Code runs one skill at a time), so there is no locking concern.

## Consequences

### Positive

- ADR directory discovery runs once per project lifetime instead of once per invocation.
- Contextual suggestions (ADR-0018) can reference temporal data: last audit date, last evaluation date, operation recency.
- Operation history provides a lightweight activity log that helps users understand what has been done recently.
- The state file can be committed to the repository to share state across team members, or gitignored to keep it local.

### Negative

- State can become stale if operations are performed outside blueprint (e.g., manually editing ADR files, running git operations that move the ADR directory).
- The state file is another artifact to manage: it needs to survive version upgrades, handle corruption gracefully, and not break when the schema evolves.
- Introduces a coupling between commands: the help command depends on state written by the audit command. If a command fails to update state, downstream commands may give wrong suggestions.

### Risks

- State corruption: a malformed state.toml could break all commands that read it. Mitigation: all state reads use fallback defaults. If the file is unreadable, blueprint falls back to stateless behavior (Option 1) rather than failing.
- Schema drift: as blueprint evolves, the state file schema will change. Old state files must remain readable. Mitigation: additive-only schema changes — new fields are added, old fields are never removed or renamed.

## References

- ADR-0018: Use contextual suggestions in help and list commands
- ADR-0003: Use TOML over JSON for config DSL
- ADR-0022: Design config layer as a domain-specific language
