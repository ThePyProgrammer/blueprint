# ADR-0014: Treat anti-pattern tests as first-class evaluation category

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0014                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's testing strategy evaluator assesses the completeness of a project's test suite. Most test evaluation focuses on what is tested: line coverage, branch coverage, function coverage. Equally important is what is tested for NOT happening: unauthorized access that should be denied, invalid input that should be rejected, state corruption that should be prevented, architectural violations that should be caught, performance regressions that should be flagged.

These "anti-pattern tests" encode institutional memory of past failures. A regression test for a specific bug is the team saying "this exact thing went wrong, and we never want it to happen again." An architecture test enforcing layer boundaries is the team saying "we decided on this structure, and we want the build to fail if someone violates it." A negative authorization test is the team saying "this endpoint must never be accessible without authentication."

Standard coverage analysis treats these tests the same as any other test. A project with 90% line coverage but zero negative authorization tests appears healthy by coverage metrics while having a critical blind spot. The absence of anti-pattern tests is a qualitatively different kind of gap than the absence of a unit test for a utility function.

## Options Considered

### Option 1: Subsume under general coverage analysis

- **Pros:** Simpler evaluation model. One metric (coverage) covers everything. No special categories to define or maintain.
- **Cons:** Coverage numbers mask qualitative gaps. A project can have high coverage without any negative tests. The evaluator cannot distinguish between "well-tested" and "tested for the happy path only."

### Option 2: Dedicated anti-pattern test inventory as a first-class category

- **Pros:** Explicit recognition that testing what should NOT happen is as important as testing what should. Six specific subcategories provide actionable guidance. Missing anti-pattern tests are surfaced as a distinct finding rather than hidden in aggregate metrics.
- **Cons:** More complex evaluation. Requires heuristics to identify anti-pattern tests in existing codebases. Six subcategories may not cover all project types.

### Option 3: Mention in passing

- **Pros:** Acknowledges anti-pattern testing without adding evaluation complexity.
- **Cons:** No structured analysis. No actionable findings. Anti-pattern test gaps remain invisible in practice.

## Decision

**In the context of** evaluating testing strategy completeness, **facing** the blind spot where high coverage can mask the absence of negative and defensive tests, **we decided for** treating anti-pattern tests as a first-class evaluation category with six specific subcategories, **to achieve** qualitative test assessment that surfaces the most dangerous testing gaps, **accepting** the complexity of identifying and categorizing anti-pattern tests in existing codebases.

The six subcategories are:

1. **Negative authorization**: tests that verify access is denied when it should be (unauthenticated requests, insufficient permissions, cross-tenant access).
2. **Input rejection**: tests that verify invalid, malformed, or adversarial input is rejected (SQL injection, XSS payloads, boundary values, type coercion attacks).
3. **State corruption guards**: tests that verify invariants are maintained under concurrent or out-of-order operations (double-submit, race conditions, partial failure rollback).
4. **Regression tests**: tests explicitly tied to past bugs, ensuring specific failure modes do not recur (typically identifiable by bug tracker references in test names or comments).
5. **Architecture tests**: tests that enforce structural decisions (layer dependencies, module boundaries, import restrictions, naming conventions).
6. **Performance guards**: tests that verify performance does not degrade below thresholds (response time budgets, memory limits, query count boundaries).

Missing anti-pattern tests in any subcategory are reported as a significant finding with specific recommendations for what to add.

## Rationale

- Anti-pattern tests are the highest-value tests per line of test code. A single negative authorization test prevents an entire class of security vulnerabilities. Coverage metrics cannot express this.
- The six subcategories were chosen because they map to the most common categories of production incidents that "could have been caught by a test." Each subcategory addresses a distinct failure mode.
- Making this a first-class category rather than a footnote forces the evaluator to produce specific findings. "You have no architecture tests" is actionable. "Your coverage is 87%" is not.
- Option 1 was rejected because it hides the most important testing gaps behind aggregate metrics. Option 3 was rejected because a passing mention produces no actionable output.

## Consequences

### Positive

- Testing gaps that coverage metrics miss are explicitly surfaced.
- Teams get specific, categorized guidance on what defensive tests to add.
- The anti-pattern test inventory serves as a checklist for new projects bootstrapping their test suite.
- Regression tests linked to past bugs create a measurable connection between incidents and test improvements.

### Negative

- Identifying anti-pattern tests in existing codebases requires heuristics (test name patterns, assertion types, comment parsing) that may misclassify tests.
- The six subcategories may not cover domain-specific anti-pattern tests (e.g., financial reconciliation guards, medical dosage limits).
- Teams may feel overwhelmed if the evaluator reports gaps in all six subcategories simultaneously.

### Risks

- False positives: tests classified as "missing" that actually exist but were not recognized by the heuristics. Mitigation: the evaluator uses multiple signals (test names containing "deny," "reject," "forbidden," "invalid"; assertion patterns like `expect(...).toThrow()`, `assert_raises`; comments referencing bug trackers) and reports confidence levels.
- Teams treating the six subcategories as exhaustive and ignoring project-specific anti-pattern needs. Mitigation: the evaluator's output includes a prompt to consider domain-specific negative tests.
- Over-indexing on anti-pattern test count rather than quality. Ten shallow negative authorization tests are less valuable than one thorough one. Mitigation: the evaluator assesses specificity and coverage within each subcategory, not just count.

## References

- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- ADR-0016: Single responsibility per agent (testing strategy evaluator as a focused agent)
- OWASP Testing Guide, negative security testing methodology
- ArchUnit, architecture testing framework (example of subcategory 5)
