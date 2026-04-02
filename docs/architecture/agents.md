---
title: "Agent Architecture"
description: "Blueprint's 21 specialized agents: one persona, orthogonal responsibilities, and why single-purpose agents produce deeper analysis than generalist ones."
---

# Agent Architecture

Blueprint decomposes architectural governance into 21 specialized agents, each with a single analytical focus. This is a deliberate application of the Single Responsibility Principle at the agent level: the researcher doesn't review, the reviewer doesn't audit, the auditor doesn't evaluate.

---

## The Shared Persona

All 21 agents inherit the [cranky senior engineer persona](../philosophy/the-cranky-senior-engineer.md) from `agents/persona.md`. The persona shapes *how* findings are communicated (direct, specific, evidence-backed, zero hedging), not *what* findings are produced. Each agent's structured output format, analysis methodology, and verdict criteria are defined independently.

---

## Agent Catalog

### Core Lifecycle Agents

| Agent | Spawned by | Role |
|-------|-----------|------|
| **adr-researcher** | `/blueprint:new --research` | Evidence-backed option analysis. Evaluates alternatives with data. States which is clearly better, no false balance. |
| **adr-devils-advocate** | `/blueprint:review` | Adversarial challenge across 5 dimensions: assumptions, alternatives, consequences, codebase fit, team capability. |
| **adr-forces-evaluator** | `/blueprint:challenge` | DCAR structured forces evaluation. Analytical, not adversarial. Systematically weighs arguments for and against. |

### Impact & Validation Agents

| Agent | Spawned by | Role |
|-------|-----------|------|
| **adr-impact-analyzer** | `/blueprint:impact` | Cross-ADR conflict, dependency, and duplication detection. Reads every "small change, no side effects" claim with skepticism. |
| **adr-compliance-auditor** | `/blueprint:audit` | Codebase verification against accepted ADRs. Trust nothing. Absence of evidence ≠ evidence of absence. |
| **adr-evidence-auditor** | `/blueprint:evidence` | Epistemic status and temporal validity. Detects stale evidence, unverified AI-generated research, expired assumptions. |

### The Evaluation Team (5 agents)

| Agent | Dimension | What it measures |
|-------|-----------|-----------------|
| **adr-consistency-auditor** | Consistency | Pattern adherence, naming, layering, dependency direction, error handling uniformity |
| **adr-bug-surface-mapper** | Bug Surface | Complexity hotspots, coupling density, missing boundaries, state management, implicit contracts |
| **adr-maintainability-assessor** | Maintainability | Change amplification, cognitive load, dependency health, abstraction quality, debt indicators |
| **adr-testing-strategy-evaluator** | Testing | Pyramid health, anti-pattern tests, risk-aligned coverage, test quality |
| **adr-conways-law-analyzer** | Conway's Law | Ownership alignment, friction points, bottleneck modules, scaling readiness |

### Specialized Analysis Agents

| Agent | Spawned by | Role |
|-------|-----------|------|
| **adr-reflexion-analyzer** | `/blueprint:reflect` | Formal conformance checking via reflexion models (Murphy et al., 1995). Convergences, divergences, absences. |
| **adr-tradeoff-analyzer** | `/blueprint:tradeoff` | ATAM utility trees. Sensitivity points, tradeoff points, risks, non-risks. |
| **adr-risk-mapper** | `/blueprint:risk` | Risk heat maps. Formula: (Complexity x Churn x Coupling) / Governance. |
| **adr-strategic-analyzer** | `/blueprint:map` | Wardley Map evolution stages. Detects build-vs-buy misalignment. |
| **adr-context-mapper** | `/blueprint:scope discover` | DDD bounded context discovery from module structure, git ownership, naming patterns. |
| **adr-diagram-generator** | `/blueprint:diagram` | C4 diagram generation from ADR graph. Mermaid, Structurizr, PlantUML. |
| **adr-retrospective** | `/blueprint:retro` | Root cause classification, pattern verification against external sources, SYSTEMIC/BAND-AID/PARTIAL verdict. |

### Infrastructure Agents

| Agent | Spawned by | Role |
|-------|-----------|------|
| **adr-architect-cartographer** | `/blueprint:architect` | ARCHITECTURE.md generation following matklad's philosophy. Codemap, invariants, layer boundaries. |
| **adr-federation-indexer** | `/blueprint:federate` | Cross-repository ADR aggregation. Conflict and dependency detection across repos. |

---

## Why Single-Purpose Agents?

A generalist agent that "does architecture review" will produce shallow analysis across many dimensions. Five specialist agents, each focused on one dimension, produce deeper analysis per dimension, and they can run in parallel.

The tradeoff is coordination cost. Blueprint manages this through:

1. **Shared persona**: consistent communication style without coordination
2. **Shared config**: `taxonomy.toml` ensures consistent classification
3. **Shared state**: `relationships.toml` gives every agent the same dependency graph
4. **Skill-level synthesis**: the skill (e.g., `/blueprint:evaluate`) coordinates agents and synthesizes their outputs into a unified report

The agents don't need to coordinate with each other. They each do their job, and the skill layer assembles the result.

---

## Agent Capabilities

All agents operate within Claude Code's agent framework:

- **Read access**: All agents can read files in the codebase and config directory
- **Write access**: Only agents that produce artifacts (researcher, cartographer, retrospective) write files
- **Search**: All agents use Grep and Glob for codebase analysis
- **Git**: Agents that need history (drift, Conway's Law) use git log and git blame
- **Web**: Researcher and evidence auditor can search the web for external validation

No agent modifies the codebase. Agents produce *findings*, not *fixes*. The developer decides what to do with the findings.
