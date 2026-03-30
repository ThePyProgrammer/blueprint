# ADR-0013: Infer team ownership from git history, not org charts

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0013                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's Conway's Law analyzer examines alignment between system architecture and team structure. To do this, it needs to know who owns which modules. Ownership determines communication overhead, coordination costs, and the likelihood that module boundaries align with team boundaries.

Org charts are the traditional source of ownership information, but they are frequently outdated, stored in HR systems that are not programmatically accessible, and reflect reporting lines rather than actual code responsibility. A developer may report to the Platform team but spend 80% of their commits in the API layer.

Git history is always present in any project that uses version control. `git log` and `git blame` reveal who actually modifies which files and directories, how recently, and how frequently. This is de facto ownership — the people who will need to understand, review, and fix code in each module.

Some projects maintain a CODEOWNERS file that explicitly assigns review responsibility. When present, this represents an intentional ownership decision and should be treated as authoritative. But many projects lack CODEOWNERS, and even when present, it may be incomplete.

## Options Considered

### Option 1: Require CODEOWNERS file

- **Pros:** Explicit, intentional ownership assignments. No inference needed. CODEOWNERS is a well-understood GitHub/GitLab convention.
- **Cons:** Many projects do not have a CODEOWNERS file. Incomplete CODEOWNERS leaves gaps. The analyzer would produce no output for projects without it, limiting usefulness.

### Option 2: Infer from git blame/log

- **Pros:** Works on any git repository with history. Reflects actual behavior rather than stated policy. Automatically adapts as ownership shifts over time.
- **Cons:** Recent contributors may not be true owners (e.g., a refactoring sweep). Contributors who left the team still appear in history. Noisy for directories with many one-off contributors.

### Option 3: Ask the user to specify ownership

- **Pros:** Accurate when provided. No inference errors.
- **Cons:** Requires manual input for every module. Quickly becomes stale. Users may not know the full ownership map for large projects. Defeats the purpose of automated analysis.

## Decision

**In the context of** the Conway's Law analyzer needing module ownership data, **facing** the unreliability of org charts and the absence of CODEOWNERS in many projects, **we decided for** inferring ownership from git history as the primary source with CODEOWNERS as an authoritative override, **to achieve** universal applicability across any git repository, **accepting** the noise inherent in git-history-based inference.

The ownership inference uses a weighted algorithm: recent commits (last 6 months) are weighted higher than older commits. Frequency of commits to a directory determines primary ownership. CODEOWNERS entries, when present, override inferred ownership for the paths they cover. For new projects with minimal git history, the analyzer falls back to directory structure heuristics (top-level directories as module boundaries, author of initial commits as provisional owner).

## Rationale

- Git history is the only ownership signal that is universally available and always up to date. Every git repository has it, and it reflects actual behavior.
- CODEOWNERS as override rather than requirement means the analyzer works everywhere but respects explicit ownership decisions when they exist. This is the principle of graceful degradation.
- Recency weighting addresses the stale-contributor problem. Someone who made 200 commits two years ago but none in the last six months is likely no longer the active owner.
- The directory structure fallback for new projects prevents the analyzer from producing empty output. Even a rough ownership approximation is more useful than no analysis.
- Option 1 was rejected because it would make the Conway's Law analyzer unusable for the majority of projects. Option 3 was rejected because manual specification does not scale and becomes stale.

## Consequences

### Positive

- The Conway's Law analyzer works on any git repository without configuration.
- Ownership data reflects actual behavior rather than organizational aspiration.
- Ownership shifts are detected automatically as commit patterns change.
- CODEOWNERS integration means projects that have invested in explicit ownership get the benefit of that investment.

### Negative

- Noisy inference for modules with many contributors and no clear owner.
- Automated refactoring tools (formatters, codemods) can skew ownership attribution toward whoever ran the tool.
- The algorithm cannot distinguish between "I own this code" and "I fixed a bug in this code once."

### Risks

- Bot accounts and CI commits appearing as module owners. Mitigation: the analyzer filters out known bot patterns (dependabot, renovate, CI service accounts) and allows users to specify exclusions in `.blueprint/config.toml`.
- Privacy concerns if ownership data is surfaced in reports shared outside the team. Mitigation: the analyzer outputs role-based ownership ("Backend team - 3 contributors") rather than individual names by default, with an opt-in flag for individual attribution.
- Monorepo projects where directory boundaries do not correspond to team boundaries. Mitigation: the analyzer supports explicit module-to-team mappings in `.blueprint/config.toml` as optional overrides.

## References

- ADR-0003: Use TOML over JSON for config DSL
- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- Melvin Conway, "How Do Committees Invent?" (1968)
- GitHub CODEOWNERS documentation
