# Architecture Decision Records

This directory contains the ADRs for the blueprint project itself. Blueprint eats its own dogfood — every significant architectural decision made during its development is documented here using the same format and lifecycle that blueprint enforces for other projects.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-adrs-for-own-decisions.md) | Use ADRs to document blueprint's own decisions | Accepted | 2026-03-30 |
| [0002](0002-decompose-into-sub-skills.md) | Decompose into focused sub-skills over monolithic SKILL.md | Accepted | 2026-03-30 |
| [0003](0003-use-toml-for-config-dsl.md) | Use TOML over JSON for config DSL | Accepted | 2026-03-30 |
| [0004](0004-encode-lifecycle-as-state-machine.md) | Encode lifecycle as state machine data, not prose | Accepted | 2026-03-30 |
| [0005](0005-adopt-cranky-senior-engineer-persona.md) | Adopt cranky senior engineer persona across all agents | Accepted | 2026-03-30 |
| [0006](0006-use-thin-router-pattern.md) | Use thin router pattern for command dispatch | Accepted | 2026-03-30 |
| [0007](0007-separate-evaluation-into-five-dimensions.md) | Separate evaluation into five orthogonal dimensions | Accepted | 2026-03-30 |
| [0008](0008-agents-return-inline-output.md) | Agents return inline output, not files | Accepted | 2026-03-30 |
| [0009](0009-devils-advocate-on-review-not-accept.md) | Use devil's advocate as part of review, not automatic on accept | Accepted | 2026-03-30 |
| [0010](0010-use-relationship-graph-for-impact.md) | Use relationship graph for incremental impact analysis | Accepted | 2026-03-30 |
| [0011](0011-two-step-verify-in-retrospective.md) | Use two-step verify pattern in retrospective agent | Accepted | 2026-03-30 |
| [0012](0012-extensible-taxonomy-for-root-causes.md) | Use extensible taxonomy for root cause classification | Accepted | 2026-03-30 |
| [0013](0013-infer-ownership-from-git-history.md) | Infer team ownership from git history, not org charts | Accepted | 2026-03-30 |
| [0014](0014-antipattern-tests-as-first-class.md) | Treat anti-pattern tests as first-class evaluation category | Accepted | 2026-03-30 |
| [0015](0015-proactive-intervention-for-undocumented-decisions.md) | Trigger proactive intervention for undocumented decisions | Accepted | 2026-03-30 |
| [0016](0016-single-responsibility-per-agent.md) | Enforce single responsibility per agent | Accepted | 2026-03-30 |
| [0017](0017-package-as-claude-code-plugin.md) | Package as Claude Code plugin following feynman conventions | Accepted | 2026-03-30 |
| [0018](0018-contextual-suggestions-in-help-and-list.md) | Use contextual suggestions in help and list commands | Accepted | 2026-03-30 |
| [0019](0019-session-state-persistence.md) | Use session state persistence across invocations | Accepted | 2026-03-30 |
| [0020](0020-parallel-evaluation-agents.md) | Run evaluation team agents in parallel, not sequentially | Accepted | 2026-03-30 |
| [0021](0021-hegelian-dialectic-for-review.md) | Use Hegelian dialectic for ADR review process | Accepted | 2026-03-30 |
| [0022](0022-config-as-domain-specific-language.md) | Design config layer as a domain-specific language | Accepted | 2026-03-30 |
