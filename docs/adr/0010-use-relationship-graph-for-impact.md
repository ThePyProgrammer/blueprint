# ADR-0010: Use relationship graph for incremental impact analysis

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0010                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's impact analyzer determines how ADRs relate to each other — conflicts, dependencies, supersession chains, and affected components. When a new ADR is proposed or an existing one transitions, the analyzer must understand the full web of relationships to identify downstream effects.

The naive approach re-reads all ADRs and computes relationships from scratch on every analysis. For a project with N ADRs, this is O(N^2) in the number of comparisons. Early in a project this is negligible, but ADR corpora grow over years, and the cost compounds across sessions since there is no shared state between Claude Code invocations.

An incremental approach maintains a persistent graph of relationships. Each analysis or lifecycle transition updates only the affected edges. Subsequent analyses start from the existing graph rather than rebuilding it. The cost per operation drops to O(K) where K is the number of ADRs related to the one being changed.

The graph must persist across sessions. Claude Code has no long-lived process — every invocation is a fresh context. The graph must live on disk in a format that is human-readable, version-controllable, and parseable without external dependencies.

## Options Considered

### Option 1: Full re-analysis every time

- **Pros:** No persistent state to manage. Always correct — no stale edges. Simple implementation.
- **Cons:** O(N^2) cost grows with the ADR corpus. Wasteful when only one ADR changed. Slow for large projects with 50+ ADRs. Repeated work across sessions since there is no shared memory.

### Option 2: Incremental graph in relationships.toml

- **Pros:** Edges added incrementally by the impact analyzer and lifecycle transitions. Subsequent analyses start from the existing graph. Human-readable and version-controllable. Consistent with blueprint's TOML-first configuration strategy (ADR-0003).
- **Cons:** Graph can become stale if ADRs are edited outside blueprint. Requires merge conflict resolution if multiple branches modify the graph. Adds a new artifact to manage.

### Option 3: In-memory graph rebuilt per session

- **Pros:** No persistent file to manage. Fresh graph every session.
- **Cons:** Still O(N^2) per session, just amortized across operations within a single session. No benefit across sessions, which is the common case for Claude Code usage.

## Decision

**In the context of** cross-ADR impact analysis, **facing** the cost of recomputing relationships from scratch on every invocation, **we decided for** a persistent TOML relationship graph updated incrementally by the impact analyzer and lifecycle transitions, **to achieve** efficient cross-session analysis with human-readable state, **accepting** the risk of stale edges when ADRs are modified outside blueprint.

The graph lives at `.blueprint/relationships.toml` and stores typed edges (conflicts_with, depends_on, supersedes, related_to) between ADR pairs, along with the component overlap that triggered each edge.

## Rationale

- Claude Code sessions are ephemeral. Any work done in-memory is lost when the session ends. Persistent state is the only way to carry forward analysis results.
- TOML is consistent with ADR-0003's decision to use TOML for all blueprint configuration. The relationship graph is parseable with the same tooling as other config files.
- Incremental updates are correct for the common case: one ADR changes, and only its edges need re-evaluation. Full re-analysis can be triggered manually if staleness is suspected.
- The graph is version-controllable. Teams can review relationship changes in PRs alongside the ADRs that triggered them.
- Option 1 was rejected because the per-session cost is unacceptable for mature projects. Option 3 was rejected because it provides no cross-session benefit, which is the primary bottleneck.

## Consequences

### Positive

- Impact analysis scales sublinearly with ADR corpus size for incremental changes.
- Cross-session continuity eliminates redundant analysis of unchanged ADRs.
- The graph provides a queryable map of the decision landscape — useful for `/blueprint:search` and visualization.
- Relationship data is visible in version control, enabling review of how the decision graph evolves.

### Negative

- A new artifact (`.blueprint/relationships.toml`) must be managed, committed, and merged.
- Graph staleness is possible if ADRs are edited with a text editor instead of blueprint commands.
- Merge conflicts in the relationship file are likely when multiple branches modify ADRs concurrently.

### Risks

- Stale edges producing incorrect impact analysis. Mitigation: the impact analyzer validates that referenced ADRs still exist and their content hashes match before trusting cached edges.
- The graph file growing large for projects with hundreds of ADRs. Mitigation: edges are compact (two IDs, a type, and a reason). Even 500 ADRs with dense connectivity would produce a file under 50KB.
- Merge conflicts in `relationships.toml` during branch merges. Mitigation: edges are append-friendly and order-independent, so most conflicts are resolvable with "keep both."

## References

- ADR-0003: Use TOML over JSON for config DSL
- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- Graph persistence patterns in build systems (Bazel action cache, Gradle build cache)
