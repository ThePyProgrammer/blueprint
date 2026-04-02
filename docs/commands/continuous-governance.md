---
title: "Continuous Governance"
description: "Commands that make architectural governance continuous: fitness functions, drift detection, decision debt tracking, pre-commit guards, and periodic nudges."
---

# Continuous Governance

Most architecture governance is episodic: someone runs an audit, finds problems, files tickets, and goes back to sleep. These five commands make governance continuous.

---

### `/blueprint:fitness`: CI-Runnable Architecture Tests

Translate ADR invariants into executable tests that run in CI. Every build verifies that the architecture hasn't been violated. This is the difference between "we decided to do X" and "the build fails if we don't do X."

Inspired by [Neal Ford's Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/).

**Syntax:** `/blueprint:fitness [--format shell|github-actions|gitlab-ci|justfile]`

**Examples:**

```
/blueprint:fitness
# Generate shell scripts for each accepted ADR's invariants

/blueprint:fitness --format github-actions
# Output as GitHub Actions workflow

/blueprint:fitness --format gitlab-ci
# Output as GitLab CI pipeline

/blueprint:fitness --format justfile
# Output as justfile recipes
```

!!! tip
    After generating fitness functions, run `/blueprint:trace` to see which ADRs have enforcement and which don't. Governance gaps (accepted decisions with no fitness function) are where violations accumulate silently.

---

### `/blueprint:drift`: Temporal Erosion Detection

Analyze git history *trajectory*: not "is the code correct now?" but "is the code moving toward or away from the architecture over time?" Individual commits may each be fine, but the aggregate direction matters.

**Syntax:** `/blueprint:drift`

**What it detects:**

- Cross-boundary imports increasing over time
- Module sizes growing beyond intended bounds
- Dependency directions reversing
- Naming convention compliance declining
- Test coverage trending downward in critical areas

**Examples:**

```
/blueprint:drift
# "src/payments/ has gained 8 cross-boundary imports in 3 months.
#  Each import was individually reasonable, but the trajectory shows
#  the payments boundary is eroding. ADR-0009 (module isolation)
#  is being violated gradually, not suddenly."
```

!!! tip
    Drift is the slow killer. Individual PRs pass review. But the aggregate trajectory can move the architecture away from its intended state without any single commit being "wrong." Run drift analysis quarterly.

---

### `/blueprint:debt`: Decision Debt Tracker

Track deferred ADRs with the discipline of a lender tracking loans. Each deferred decision has a trigger condition, severity, and dependencies.

**Debt score:** severity x age x dependency count.

**Syntax:** `/blueprint:debt`

**Examples:**

```
/blueprint:debt
# "Decision Debt Report:
#  ADR-0008 (deferred): Choose message queue, CRITICAL
#    Trigger: 'When we need async processing'. TRIGGER MET (3 services now use polling)
#    Severity: High | Age: 127 days | Blocks: ADR-0011, ADR-0014
#    Debt score: 381. Immediate attention required
#
#  ADR-0015 (deferred): Observability strategy, LOW
#    Trigger: 'When we hit 10K RPM'. Not yet met
#    Severity: Low | Age: 34 days | Blocks: none
#    Debt score: 34. Safe to defer"
```

---

### `/blueprint:guard`: Pre-Commit Architecture Guard

Fast, targeted check on just the staged files against accepted ADR invariants. Under 10 seconds. The goal is to make architectural violations as inconvenient as syntax errors.

**Syntax:** `/blueprint:guard`

Typically installed as a hook (`/blueprint:hooks install guard`) rather than run manually.

**Examples:**

```
/blueprint:guard
# Check staged files against ADR invariants
# "BLOCKED: src/auth/handler.ts imports from src/payments/internal.ts
#  Violates ADR-0009 (module isolation). The payments module's internal
#  API is not a public boundary. Use src/payments/api.ts instead."
```

!!! tip
    `guard` is the only hook that *blocks* rather than *suggests*. It's opt-in because blocking is the nuclear option. Install it when your team is ready for the discipline. The payoff is that architectural violations are caught at creation, not at quarterly audits.

---

### `/blueprint:nudge`: Periodic Governance Health

Check 10 governance staleness thresholds and surface overdue actions. Runs automatically via the `periodic-nudge` hook (~every 20 sessions).

**Syntax:** `/blueprint:nudge`

**What it checks:**

- ADRs proposed for >30 days without review
- Accepted ADRs without fitness functions
- Evidence older than 12 months
- Deferred decisions with met trigger conditions
- Modules with no governing ADR
- Last audit more than 60 days ago
- Last evaluation more than 90 days ago
- Contexts with no assigned ADRs
- Supersession chains with missing links
- Technology radar items past their review date

**Examples:**

```
/blueprint:nudge
# "3 actions overdue:
#  1. ADR-0006 proposed 47 days ago. Run /blueprint:review 6
#  2. ADR-0003 evidence expired (benchmark from 2024). Run /blueprint:evidence
#  3. Last audit was 72 days ago. Run /blueprint:audit"
```
