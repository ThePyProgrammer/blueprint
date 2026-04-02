# ADR-0039: Track epistemic status and temporal validity of ADR evidence

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0039                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's `/blueprint:new --research` spawns an AI researcher agent that gathers evidence for proposed ADRs. This evidence (benchmarks, adoption statistics, community health metrics, compatibility assessments) forms the basis for architectural decisions. But evidence has a shelf life. A benchmark from 2024 may be irrelevant by 2026. A library recommended for its active community may have been abandoned. A version-specific compatibility claim may not hold after an upgrade.

Gilda & Gilda (2026, arXiv:2601.21116) found that ~23% of architectural decisions had stale evidence within two months, with 86% of staleness discovered reactively during incidents rather than proactively. AI-assisted decision-making amplifies this problem because decisions are made faster than they can be validated. The very speed that makes AI useful also makes evidence decay more dangerous.

The paper proposes three requirements: epistemic layers (L0 unverified, L1 logically consistent, L2 empirically validated), conservative aggregation (decision confidence = min of evidence confidence), and temporal validity tracking (explicit evidence expiry windows).

Blueprint already generates evidence but does not track its quality or freshness. This is the gap between "we researched this" and "the research is still valid."

## Options Considered

### Option 1: Ignore evidence validity: trust the original research

Accept that evidence was valid when gathered and don't track staleness. Users can re-research manually if they suspect evidence has expired.

- **Pros:** Zero overhead. Simple. No new config files. Avoids false alarms from overly aggressive expiry.
- **Cons:** 23% of decisions go stale within 2 months (Gilda & Gilda). Staleness discovered reactively during incidents. AI-generated research creates false confidence. "We researched this" becomes a defense for outdated decisions.

### Option 2: Track evidence quality and expiry with epistemic levels

Add epistemic levels (L0/L1/L2), evidence expiry dates, and conservative aggregation. New `config/evidence.toml` tracks per-ADR evidence status. `/blueprint:evidence` audits quality and freshness. `/blueprint:debt` surfaces expired evidence alongside deferred decisions.

- **Pros:** Addresses a documented, empirically measured gap. Conservative aggregation prevents false confidence (if any evidence is L0, the decision is L0). Expiry dates force periodic re-validation. Integrates with existing debt tracking. Distinguishes AI-generated (L0) from empirically validated (L2) evidence.
- **Cons:** New config file to maintain. Evidence levels are somewhat subjective. Expiry dates require judgment. May generate noise from aggressively expiring stable decisions.

## Decision

> In the context of AI-generated research supporting architectural decisions, facing the empirically measured problem that 23% of decisions go stale within 2 months, we decided for epistemic status tracking with conservative aggregation (Option 2) to achieve evidence-aware decision management, accepting the overhead of evidence classification and expiry tracking.

## Rationale

Blueprint's AI researcher is one of its most powerful features, but power without accountability is dangerous. If Blueprint generates research that becomes the basis for a $500K architectural decision, someone needs to know when that research expires. The epistemic status framework provides exactly that accountability.

Conservative aggregation is the critical design choice: a decision is only as strong as its weakest evidence. If one benchmark is L0 (unverified), the whole decision is L0, because the decision rests on ALL its evidence, and a chain is only as strong as its weakest link.

## Consequences

### Positive
- Evidence quality and freshness tracked per ADR
- AI-generated research explicitly flagged as L0 until validated
- Expired evidence surfaces proactively (not reactively during incidents)
- Conservative aggregation prevents false confidence from mixed-quality evidence
- Integration with `/blueprint:debt`: expired evidence is a form of decision debt

### Negative
- New config file (`config/evidence.toml`) to maintain
- Evidence classification (L0/L1/L2) requires judgment
- May generate re-validation work when evidence expires

### Risks
- Overly aggressive expiry dates create noise
- Teams may game the system (marking everything L2 to avoid re-validation)
- L0 label may discourage use of AI research (the goal is to flag it for promotion, not to discourage it)

## References
- Gilda & Gilda "AI-Assisted Engineering Should Track the Epistemic Status and Temporal Validity of Architectural Decisions" arXiv:2601.21116, 2026
- commands/evidence.md: Skill implementation
- agents/adr-evidence-auditor.md: Agent implementation
- config/evidence.toml: Config file
