# ADR-0024: Detect architectural drift via temporal trajectory, not point-in-time audits

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0024                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Architecture erodes gradually. No single commit violates a layering rule or introduces a circular dependency. Instead, a hundred small changes — each individually reasonable — shift the system away from its intended architecture. A controller gains a utility function. The utility function gains a database call. Six months later, the controller layer is doing data access, and no one can point to the commit where the violation started.

Blueprint already has a compliance auditor (ADR-0016, the `audit` skill) that checks current code against accepted ADRs. This is a point-in-time snapshot: "right now, are we compliant?" It answers whether the architecture is healthy today, but it cannot answer whether the architecture is getting healthier or sicker over time. A codebase might pass an audit today while trending toward a violation that will manifest next month.

Drift detection is fundamentally a temporal problem. It requires comparing the system's architectural posture at different points in time and identifying trajectories — increasing coupling between modules, growing dependency chains, gradual erosion of layer boundaries. Git history contains this temporal signal: every commit is a timestamped snapshot of the system's structure. Analyzing how architectural metrics change across commits reveals drift that no single snapshot can detect.

## Options Considered

### Option 1: Point-in-time audit only — snapshot without trajectory

Run the compliance auditor periodically (or on-demand) and report current violations. Each run is independent; no historical context is maintained. Simple to implement: check the code now, report what you find. But this misses the critical question of direction. A system with 3 violations that had 10 last month is improving. A system with 0 violations but rapidly increasing coupling metrics is about to fail. Snapshots cannot distinguish these cases.

**Pros:** Simple to implement and understand. No historical data storage required. Clear pass/fail output.

**Cons:** Cannot detect trends or trajectories. Misses gradual erosion until it crosses a violation threshold. No early warning capability. Every audit starts from scratch.

### Option 2: Temporal trajectory analysis via git history — drift as direction

Analyze architectural metrics across git history to detect trajectories. Blueprint samples commits at intervals (weekly, monthly), computes structural metrics (coupling, cohesion, dependency depth, layer violations, import patterns), and compares them over time. Drift is defined as a sustained trend away from ADR-defined invariants — not a single violation, but a direction. The output is a trajectory report: "module coupling between X and Y has increased 40% over 3 months," "controller layer complexity is growing at 2x the rate of service layer," "dependency depth has increased monotonically for 6 months."

**Pros:** Detects erosion before it becomes a violation. Provides directional information (improving vs. degrading). Uses data already available in git history. Enables early intervention.

**Cons:** More computationally expensive than a single audit. Requires defining architectural metrics that map to ADR invariants. Git history analysis can be slow on large repositories. Interpretation requires context.

### Option 3: Continuous monitoring daemon — real-time but heavyweight

Run a background process that monitors file changes in real-time, maintaining a live architectural model that updates on every save. Provides instant feedback when a change introduces drift. Maximally responsive, but requires persistent infrastructure — a running process, a database for the architectural model, and integration with the editor or file system. This is appropriate for dedicated architecture tools (ArchUnit, Sonargraph) but exceeds the scope of a Claude Code skill that should be invocable, not running.

**Pros:** Immediate feedback. No delay between change and detection. Rich interactive experience.

**Cons:** Requires persistent infrastructure. Heavy resource consumption. Inappropriate for a skill-based tool. Complex to install and maintain.

## Decision

**We detect architectural drift by analyzing git history trajectory over time, not just point-in-time compliance audits**, because drift detection compares photographs months apart while audit checks a single snapshot — and architecture erodes gradually, not suddenly, so the tool that catches erosion must think in trajectories, not moments.

## Rationale

- Point-in-time audits answer "are we compliant?" Trajectory analysis answers "are we becoming non-compliant?" The second question is more useful because it enables intervention before violations manifest.
- Git history is a free, already-available temporal data source. Every project has it. No additional infrastructure is required to store historical snapshots — they already exist as commits.
- Drift detection complements, not replaces, the existing audit capability. Audit tells you where you stand. Drift tells you where you are heading. Together they provide both position and velocity.
- Architectural metrics (coupling, cohesion, dependency depth) are computable from code structure. They do not require runtime instrumentation or production monitoring. This keeps drift detection within blueprint's scope as a static analysis tool.
- The trajectory framing naturally produces actionable output: "coupling between module A and module B has increased by N% over the last M months" is more useful than "module A depends on module B" because it implies urgency and direction.

## Consequences

### Positive

- Early warning for architectural erosion. Teams can course-correct before drift becomes violation, which is cheaper than remediation after the fact.
- Historical perspective provides context for current architecture. Understanding how the system arrived at its current state informs decisions about where to take it next.
- Drift reports produce compelling narratives for technical debt conversations. "Coupling has increased monotonically for 6 months" is more persuasive to management than "we have tech debt."
- Temporal analysis naturally surfaces modules that are evolving faster or in different directions than the rest of the system, highlighting areas of concern.

### Negative

- Git history analysis on large repositories can be slow. Sampling strategies (analyzing every Nth commit, or only commits on certain branches) add complexity.
- Defining meaningful architectural metrics that map to ADR invariants requires domain knowledge. Not every ADR invariant translates cleanly to a measurable metric.
- Trajectory reports require interpretation. A team unfamiliar with architectural metrics may not know how to act on "coupling increased 30%."

### Risks

- False alarms: some metric increases are intentional. A module gaining dependencies because it is being actively developed is not drift — it is growth. Mitigation: trajectory reports include change context (which ADRs were active, what features were being built) to help distinguish intentional evolution from unintentional erosion.
- Metric gaming: if drift metrics become targets, developers may optimize for the metric rather than the architecture. Mitigation: metrics are indicators, not scores. Reports frame them as conversation starters, not pass/fail criteria.
- Historical analysis paralysis: teams may spend more time analyzing drift trends than addressing them. Mitigation: drift reports include prioritized recommendations, not just observations. The most impactful drift is highlighted.

## References

- ADR-0004: Encode lifecycle as state machine
- ADR-0007: Separate evaluation into five dimensions
- ADR-0013: Infer ownership from git history
- ADR-0016: Single responsibility per agent
- Michael Feathers, "Working Effectively with Legacy Code" (2004) — dependency analysis
- Neal Ford et al., "Building Evolutionary Architectures" (2017) — fitness functions and architectural governance
