# ADR-0033: Self-diagnostic health check for ADR system integrity

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0033                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint manages a growing corpus of interconnected ADR files, a configuration file, a relationship graph, an index, and cross-references between decisions. These artifacts are maintained by multiple sub-skills (new, review, transition, rearchitect) and can also be edited manually by developers. Over time, inconsistencies accumulate: an ADR references a superseded decision without acknowledging the supersession, the index lists an ADR that was deleted, a relationship edge points to a non-existent ADR number, the config file references a template that has drifted from the actual template, or a proposed ADR has been sitting unreviewed for months.

These inconsistencies are individually minor but collectively erosive. A broken supersession chain means the lifecycle state machine (ADR-0004) produces incorrect results. An out-of-sync index means the list command shows stale data. A dangling relationship edge means impact analysis (ADR-0010) reports phantom dependencies. A stale proposed ADR accumulates decision debt silently.

Filesystems have fsck. Git has fsck. Databases have consistency checks. Any system that maintains structured data across multiple files needs a way to verify its own integrity. Blueprint currently has no such mechanism. If something breaks, the user discovers it when a downstream command produces confusing output, and the root cause is invisible.

## Options Considered

### Option 1: No self-diagnostic, trust the system

Rely on the correctness of individual sub-skills and the discipline of manual edits to keep the ADR system consistent. When inconsistencies occur, debug them ad hoc by examining individual files. This is the current state: there is no health check, and inconsistencies are discovered incidentally.

**Pros:** No additional tooling to build or maintain. Simpler codebase. If sub-skills are correct, no inconsistencies should arise.

**Cons:** Sub-skills are not always correct; bugs happen. Manual edits are never constrained by the state machine. Inconsistencies are discovered late, at the point of impact rather than the point of introduction. Debugging is painful because the user must reverse-engineer which operation broke consistency and when. The "if sub-skills are correct" assumption is the same assumption that makes every system that skips validation eventually fail.

### Option 2: Eight-check health diagnostic with auto-repair, comprehensive and actionable

Implement a health command that runs 8 specific consistency checks against the ADR system: (1) directory structure validation (expected directories and files exist), (2) index synchronization (index matches actual ADR files on disk), (3) content validity (each ADR has required sections and valid metadata), (4) supersession chain integrity (superseded ADRs point to valid successors, successors acknowledge predecessors), (5) relationship graph consistency (all edges reference existing ADRs, no dangling references), (6) configuration freshness (config values reference valid templates, paths, and settings), (7) cross-reference integrity (references sections cite existing ADRs with correct titles), (8) staleness detection (proposed ADRs older than a threshold, accepted ADRs with no recent activity). For each issue found, the health check reports the problem with a severity (error, warning, info) and, for fixable issues, offers auto-repair (e.g., rebuilding the index from disk, removing dangling edges, updating stale references).

**Pros:** Comprehensive coverage of all known consistency failure modes. Auto-repair reduces the burden of manual fixing for mechanical issues. Severity levels distinguish between critical failures and cosmetic issues. The 8 checks are specific and enumerable; the user knows exactly what is being validated. Acts as a safety net for both sub-skill bugs and manual edits.

**Cons:** Eight checks is a meaningful amount of code to implement and maintain. Auto-repair carries risk; automatically modifying files could introduce new problems if the repair logic has bugs. The check list must be maintained as new features add new consistency requirements.

### Option 3: External linter tool, separate validation pipeline

Build a standalone linter (like markdownlint or eslint) that validates ADR files against a schema. The linter runs as a separate tool, potentially in CI, and reports issues without auto-repair. This separates validation from the blueprint tool itself.

**Pros:** Separation of concerns: validation is independent of the tool that creates ADRs. Can run in CI as a quality gate. Follows established patterns (linting is a well-understood paradigm).

**Cons:** An external linter cannot validate system-level consistency (supersession chains, relationship graph integrity, index sync) because it lacks the domain model. It can only validate individual file structure, which is the least interesting category of inconsistency. Splitting validation into a separate tool fragments the user experience; the user must know to run both blueprint and the linter. The most valuable checks (cross-file consistency) require the full blueprint context that only the health command has.

## Decision

**We run 8 targeted consistency checks against the ADR system itself (directory structure, index sync, content validity, supersession chains, relationship graph, config freshness, cross-references, and staleness) with auto-repair for mechanically fixable issues**, because a governance system that cannot verify its own integrity is a governance system that will silently degrade, and the most valuable consistency checks (cross-file relationships, supersession chains, graph integrity) require the full domain model that only blueprint possesses.

## Rationale

- The 8 checks cover all known categories of ADR system inconsistency. They are derived from actual failure modes encountered during development: broken supersession chains that caused incorrect lifecycle transitions, dangling relationship edges that produced phantom impact analysis results, index drift that caused list to show deleted ADRs, and stale proposed ADRs that accumulated decision debt invisibly.
- Auto-repair is limited to mechanically deterministic fixes. Rebuilding the index from disk files is deterministic; the correct index is defined by the files that exist. Removing a relationship edge to a non-existent ADR is deterministic; the edge is invalid by definition. Auto-repair does not attempt to fix ambiguous issues (e.g., a missing context section could be empty, boilerplate, or require human judgment). The repair boundary is clear: if the correct state can be computed from existing data without human judgment, auto-repair is offered. Otherwise, the issue is reported for manual resolution.
- Severity levels (error, warning, info) prevent alert fatigue. A broken supersession chain is an error; it causes incorrect behavior. A proposed ADR older than 30 days is a warning; it indicates potential neglect but is not a system failure. A config value that uses defaults instead of explicit settings is info; it is worth noting but not actionable.
- An external linter (Option 3) cannot perform the most valuable checks. Supersession chain validation requires understanding the lifecycle state machine. Relationship graph consistency requires loading and traversing the graph. Index sync requires comparing the index data structure against the filesystem. These checks require the blueprint domain model; a generic file linter has no access to it.
- The fsck analogy is precise: fsck does not modify the filesystem unless explicitly told to (fsck -y). The health command follows the same pattern: it reports issues by default and only auto-repairs when the user confirms.

## Consequences

### Positive

- Inconsistencies are detected at the point of diagnosis rather than the point of impact. A broken supersession chain is found by the health check, not by a confused impact analysis result three weeks later.
- Auto-repair eliminates manual drudgery for mechanical fixes. Rebuilding an out-of-sync index by hand requires knowing the index format and scanning every ADR file. The health command does this in seconds.
- The 8 checks serve as a specification of ADR system invariants. They document what "consistent" means for the blueprint system, which is valuable for contributors who need to understand the system's constraints.
- Running health after manual edits to ADR files provides a safety net. Developers can edit ADR files directly (they are just markdown) and then run health to verify they did not break anything.

### Negative

- The 8 checks must be maintained as the system evolves. A new feature that adds a new consistency requirement (e.g., a new metadata field) requires a corresponding health check update. If the check is not updated, the health command provides false confidence.
- Auto-repair, even for deterministic fixes, modifies files. In a version-controlled repository, these modifications create commits that are mechanical rather than meaningful, adding noise to the git history.
- The health check adds a command that users must remember to run. Without integration into the workflow (e.g., running automatically before status or after transitions), users may never run it and inconsistencies will persist undetected.

### Risks

- False positives: a health check that reports issues that are not actually problems trains users to ignore it. Mitigation: each check is tested against known-good and known-bad states. The severity system ensures that only genuine issues are reported at error level.
- Auto-repair bugs: if the repair logic for a check is incorrect, it could introduce new inconsistencies while "fixing" existing ones. Mitigation: auto-repair is limited to mechanically deterministic operations. Each repair is validated by re-running the check after the repair to confirm the issue is resolved.
- Scope creep: the 8 checks could grow unboundedly as new edge cases are discovered. Mitigation: new checks require the same bar as the original 8; they must address a demonstrated failure mode, not a hypothetical one. "This might break" is not sufficient; "this broke and caused incorrect behavior" is.

## References

- ADR-0004: Encode lifecycle as state machine
- ADR-0010: Use relationship graph for impact analysis
- ADR-0003: Use TOML for config DSL
- ADR-0025: Track decision debt with trigger monitoring
- ADR-0018: Contextual suggestions in help and list
