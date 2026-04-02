# ADR-0023: Generate executable architecture fitness functions from ADRs

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0023                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

ADRs capture architectural decisions in prose: "we will use layered architecture with no direct database access from controllers," "all inter-service communication goes through the message bus," "no circular dependencies between modules." These invariants are meaningful only if they are enforced. Without enforcement, they erode silently. A developer bypasses the message bus for a "quick fix," a controller acquires a direct database import, and the architecture documented in ADRs diverges from the architecture running in production.

The gap between documented invariants and actual code is invisible until it becomes painful. Point-in-time audits (ADR-0014, the compliance auditor agent) catch violations after the fact, but they run on-demand. What is missing is continuous, automated enforcement: tests that run in CI and fail when an ADR invariant is violated, the same way unit tests fail when behavior regresses.

Architecture fitness functions, as described by Neal Ford and the "Building Evolutionary Architectures" literature, are objective, automated measures of how well an architecture meets its intended goals. The concept maps directly to ADR invariants: each accepted ADR that states a constraint ("no X shall Y") defines a testable property that can be expressed as a fitness function.

## Options Considered

### Option 1: Manual test writing, accurate but unsustainable

Developers manually write architecture tests for each ADR invariant. A human reads ADR-0006 ("use thin router pattern"), understands the constraint, and writes a test that scans controller files for business logic. This produces high-quality, precise tests, but it does not scale. Teams with 20+ ADRs will not maintain 20+ hand-written architecture tests. The tests become stale when ADRs are superseded. And the cognitive overhead of translating prose invariants into test code means most teams simply will not do it.

**Pros:** Tests are precise and context-aware. No risk of misinterpreting the invariant. Tests can cover nuanced constraints that are hard to express programmatically.

**Cons:** Does not scale past a handful of ADRs. Tests become stale when ADRs change. Requires developer time that competes with feature work. Most teams will write zero.

### Option 2: Auto-generated tests from ADR invariants, scalable enforcement

Blueprint parses accepted ADRs, identifies invariant statements (dependency constraints, naming conventions, layering rules, import restrictions), and generates executable test files that encode those constraints. The generated tests are runnable via standard test frameworks and designed for CI integration. Blueprint produces the test; the team runs it. When an ADR is superseded, the corresponding fitness function is marked for regeneration.

**Pros:** Scales with the number of ADRs. Tests stay synchronized with decisions. Zero manual effort per invariant. CI integration enforces invariants on every push.

**Cons:** Generated tests may be imprecise for nuanced constraints. Requires a mapping between prose patterns and test patterns. Some invariants are not mechanically testable.

### Option 3: Linter rules only, lightweight but limited

Express architectural constraints as linter rules (ESLint, Pylint, custom linters). Linters catch certain classes of violations (import restrictions, naming conventions) but cannot express higher-level architectural properties (layering discipline, dependency direction, bounded context boundaries). Linter rules are also framework-specific and do not generalize across language ecosystems.

**Pros:** Fast execution. Well-understood tooling. Easy to integrate into existing development workflows.

**Cons:** Cannot express most architectural invariants. Limited to syntactic patterns. No coverage of structural or behavioral constraints. Framework-specific.

## Decision

**We generate executable architecture fitness functions (test files) from accepted ADR invariants**, because ADRs define WHAT the invariants are and fitness functions verify they are not violated in CI, transforming prose constraints into runnable tests that make architectural erosion a build failure, not a slow discovery.

## Rationale

- ADRs without enforcement are aspirational documents. Fitness functions make them contractual. A violated invariant produces a failing test, not a disappointed architect.
- The generation approach bridges the gap between "document the decision" and "enforce the decision" without requiring developers to do translation work. Blueprint already understands ADR structure (it parses and creates them). Extending that understanding to invariant extraction is a natural capability.
- Generated tests are not perfect; some invariants resist mechanical testing. But covering 70% of invariants automatically is better than covering 0% manually, which is the realistic alternative for most teams.
- Fitness functions are standard test files. They run in existing CI pipelines, use existing test frameworks, and produce familiar pass/fail output. No new infrastructure required.
- When an ADR is superseded (ADR-0004, lifecycle state machine), the corresponding fitness function becomes invalid. Blueprint can detect this and flag it for regeneration, keeping tests synchronized with current decisions.

## Consequences

### Positive

- Architectural invariants are enforced continuously in CI, not just audited periodically. Violations are caught at pull request time.
- The fitness function corpus serves as an executable specification of the system's architectural constraints. New team members can read the tests to understand what the architecture enforces, not just what it aspires to.
- Generated tests reduce the manual effort of architecture enforcement to zero for mechanically testable invariants.
- The generation process surfaces ambiguous ADRs: if blueprint cannot extract a testable invariant, the ADR may need to be more specific.

### Negative

- Generated tests may produce false positives for nuanced constraints that the generator misinterprets. Teams must review generated tests and may need to adjust them.
- Not all invariants are mechanically testable. Constraints like "prefer composition over inheritance" or "minimize coupling" are directional, not binary. The generator must be honest about what it cannot test.
- Adding generated test files to the repository increases the maintenance surface. Tests must be regenerated when ADRs change.

### Risks

- Over-trust in generated tests: teams may assume that passing fitness functions mean full architectural compliance. They do not; they cover a subset of invariants. Mitigation: generated test files include a header comment listing which invariants are covered and which are not mechanically testable.
- Test fragility: generated tests that rely on file path conventions or import patterns may break when project structure changes, even if the invariant is still respected. Mitigation: tests use pattern-based matching rather than hardcoded paths.
- Generation quality: if the invariant extraction from ADR prose is unreliable, teams will lose trust in the generated tests. Mitigation: conservative generation. Only produce tests for invariants that map cleanly to testable patterns. Acknowledge untestable invariants explicitly.

## References

- Neal Ford, Rebecca Parsons, Patrick Kua, "Building Evolutionary Architectures" (2017), fitness functions concept
- ADR-0004: Encode lifecycle as state machine
- ADR-0014: Antipattern tests as first-class output
- ADR-0016: Single responsibility per agent
