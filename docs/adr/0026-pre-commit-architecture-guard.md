# ADR-0026: Pre-commit architecture guard on staged files only

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0026                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Architectural violations are cheapest to fix at the moment they are introduced. A developer adds a direct database import in a controller file. If caught at commit time, the fix is trivial: move the call to the service layer, which takes 5 minutes. If caught in CI 30 minutes later, the developer has context-switched. If caught in a quarterly architecture review, the violation has been compounded by 3 months of code built on top of it.

Blueprint already provides comprehensive architecture analysis through the audit skill (compliance checking) and the evaluation skill (5-dimensional analysis). Both are thorough but slow; they analyze the entire codebase against all accepted ADRs, which can take significant time depending on project size. Running a full audit on every commit is impractical. Developers will disable hooks that add more than a few seconds to their commit workflow.

The pre-commit moment is unique: we know exactly which files are changing (the git staging area), and we need only to check those files against the ADR invariants that govern them. A controller file being committed needs to be checked against layering ADRs, not against the caching strategy ADR. This scoping makes sub-10-second checks feasible even for projects with many ADRs.

## Options Considered

### Option 1: Full audit on every commit, thorough but unusably slow

Run the complete compliance audit on every `git commit`. Every accepted ADR is checked against the entire codebase. This catches every violation but takes too long for interactive use. Developers will add `--no-verify` to every commit, rendering the guard useless. A tool that is too slow to use is equivalent to a tool that does not exist.

**Pros:** Complete coverage. No violations can slip through. Consistent with the existing audit methodology.

**Cons:** Too slow for pre-commit use. Developers will bypass it. Audits the entire codebase when only a few files changed. Punishes small commits as much as large refactors.

### Option 2: Targeted guard on staged files only, fast and focused

Check only the files in the git staging area against only the ADR invariants that govern those files. If a developer stages `src/controllers/user.js`, the guard checks it against layering ADRs and naming convention ADRs, but not against the database migration strategy ADR. This scoping keeps the check under 10 seconds for typical commits. The guard produces pass/fail output with specific violation details, and does not block commits for warnings, only for clear invariant violations.

**Pros:** Fast enough for interactive use (sub-10 seconds). Checks only what changed against only what applies. Developers keep the hook enabled. Catches violations at the cheapest moment to fix them.

**Cons:** Does not catch systemic violations that emerge from the interaction of multiple files. A change that is compliant in isolation may contribute to drift when combined with other changes. Not comprehensive; some violations are only visible at the codebase level.

### Option 3: No pre-commit checks, rely on CI

Skip pre-commit hooks entirely. Run architecture checks in CI after push. This avoids any impact on developer workflow but delays violation detection by the CI pipeline duration (typically 5-30 minutes). The developer has context-switched by the time the violation is reported. Fix costs are higher, and the feedback loop is slower.

**Pros:** Zero impact on developer workflow. No hook maintenance. CI is already running.

**Cons:** Delayed feedback increases fix costs. Developers lose context between commit and violation report. CI failures for architecture violations compete with test failures for attention.

## Decision

**We provide a fast pre-commit guard that checks only staged files against governing ADR invariants**, because the cheapest time to fix a violation is before the commit. A guard that runs under 10 seconds stays enabled, while a guard that runs for minutes gets bypassed.

## Rationale

- The 10-second budget is not arbitrary. Research on developer tool adoption consistently shows that tools adding more than a few seconds to commit workflows are disabled. The guard must be fast enough that keeping it enabled is the path of least resistance.
- Scoping to staged files is the key to speed. A typical commit touches 1-10 files. Checking 5 files against 3 governing ADRs is orders of magnitude faster than checking 500 files against 20 ADRs.
- The guard is a first line of defense, not the only line. It catches obvious violations at commit time. The full audit catches systemic violations periodically. Together they provide both speed and comprehensiveness at appropriate moments in the development workflow.
- Mapping files to governing ADRs requires understanding the project's module structure and which ADRs apply to which areas. This mapping is derivable from ADR scope declarations and file path patterns defined in the config layer (ADR-0022).
- The guard produces actionable output: file path, violated invariant, governing ADR reference, and a suggested fix. A developer seeing "src/controllers/user.js violates ADR-0006 (thin router pattern): controller contains business logic at line 42" knows exactly what to fix and why.

## Consequences

### Positive

- Architectural violations are caught at the moment of introduction, when context is fresh and fixes are cheap.
- The sub-10-second constraint ensures the guard does not degrade developer experience. Developers keep the hook enabled because it does not slow them down meaningfully.
- Each blocked commit is a teaching moment: the developer learns which ADR governs the file they changed and what invariant they violated.
- The guard reduces the volume of violations that reach CI, freeing CI time for tests and other checks.

### Negative

- The guard cannot catch all violations. Systemic issues that emerge from the interaction of multiple files across multiple commits are invisible to a single-file guard. Teams must not assume that a passing guard means full compliance.
- Mapping files to governing ADRs requires maintenance. As ADRs are added or files are reorganized, the mapping must be updated.
- False positives from imprecise invariant matching will erode developer trust. A guard that blocks valid commits will be disabled.

### Risks

- Scope creep: the temptation to add more checks to the guard will push it past the 10-second budget. Mitigation: hard time limit. If the guard exceeds 10 seconds, it passes with a warning rather than blocking. Speed is a feature, not a compromise.
- Incomplete mapping: if the file-to-ADR mapping is incomplete, the guard will miss violations for unmapped files. Mitigation: the guard logs which files were checked and which were skipped due to no governing ADR, making gaps visible.
- Developer frustration: even a fast guard that blocks commits can frustrate developers if the violations are perceived as pedantic. Mitigation: the guard only blocks for clear invariant violations, not style preferences. Warnings are reported but do not block.

## References

- ADR-0004: Encode lifecycle as state machine
- ADR-0022: Design config layer as a domain-specific language
- ADR-0023: Generate fitness functions from ADRs
- ADR-0016: Single responsibility per agent
