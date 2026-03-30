# ADR-0038: Use reflexion models for formal architecture conformance checking

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0038                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |
| Related     | [ADR-0024](0024-temporal-drift-detection-over-point-audits.md) |

## Context

Blueprint v1 detects architectural drift through git trajectory analysis (ADR-0024) — tracking whether the codebase is moving toward or away from the intended architecture over time. This is valuable for trend detection but has a limitation: it answers "is the code drifting?" but not "does the code match the architecture right now?"

Software reflexion models (Murphy, Notkin, Sullivan, 1995) provide a formal framework for architecture conformance checking. They compare a high-level architecture model against actual source code structure and produce three categories: convergences (code matches intent), divergences (code has dependencies the architecture doesn't specify), and absences (architecture specifies structure the code doesn't have).

Blueprint already has the inputs needed for reflexion models: accepted ADRs define the intended architecture, ARCHITECTURE.md defines the high-level module map, and the codebase provides the actual structure. The missing piece is the formal comparison.

## Options Considered

### Option 1: Enhance drift detection with structural checks

Add file-level dependency analysis to the existing `/blueprint:drift` command. Keep one command that does both trajectory analysis and structural comparison.

- **Pros:** Single command. No new concepts to learn. Incremental enhancement.
- **Cons:** Conflates two different questions (trajectory vs. conformance). Drift detection optimized for trends; conformance checking optimized for snapshots. Different output formats. Violates single responsibility.

### Option 2: Add reflexion model as a separate formal conformance command

Create `/blueprint:reflect` as a separate command for point-in-time architecture conformance. Keep `/blueprint:drift` for trajectory analysis. They complement each other.

- **Pros:** Each command does one thing well. Reflexion model output format (convergences/divergences/absences) is established and well-understood. File:line evidence for every divergence. Clean separation: reflect = X-ray, drift = time-lapse. Academic grounding enables referencing established literature.
- **Cons:** Two drift-related commands may overlap in user perception. Reflexion model requires maintaining source-to-module mapping. More complex than enhanced drift.

## Decision

> In the context of strengthening architecture conformance checking, facing the limitation that trajectory-based drift detection does not provide point-in-time structural comparison, we decided for reflexion model as a separate command (Option 2) to achieve formal convergence/divergence/absence analysis with file:line evidence, accepting the complexity of maintaining a second conformance mechanism alongside drift detection.

## Rationale

Reflect gives you an X-ray; drift gives you a time-lapse. An X-ray tells you exactly what's wrong right now. A time-lapse tells you whether things are getting better or worse. Both are needed for rigorous architecture governance.

The reflexion model output — convergences, divergences, absences, violations — maps cleanly to actionable responses: violations need immediate fixes, divergences may need new ADRs, absences indicate unimplemented decisions. This is more actionable than "the drift trend is negative."

## Consequences

### Positive
- Formal, repeatable conformance checking with established methodology
- Every divergence backed by file:line evidence
- Absences reveal unimplemented architectural decisions
- Conformance score provides a quantitative architecture health metric
- Theoretical foundation from published research (Murphy et al., 1995)

### Negative
- Source-to-module mapping computation is non-trivial
- Two conformance-related commands (/blueprint:reflect and /blueprint:drift) may confuse users
- Reflexion model accuracy depends on ARCHITECTURE.md being up to date

### Risks
- False positives from utility/shared module dependencies
- Incomplete ADR coverage means incomplete high-level model
- ARCHITECTURE.md may be stale, producing misleading reflexion model

## References
- Murphy, G.C., Notkin, D., Sullivan, K. "Software Reflexion Models" ACM SIGSOFT FSE, 1995
- commands/reflect.md — Skill implementation
- agents/adr-reflexion-analyzer.md — Agent implementation
- ADR-0024: Temporal drift detection over point audits
