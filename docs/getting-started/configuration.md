---
title: "Configuration"
description: "Blueprint's domain-specific language: 8 TOML config files that encode lifecycle rules, taxonomies, state, relationships, governance, and evidence tracking."
---

# Configuration

Blueprint encodes its domain knowledge as structured TOML rather than prose instructions. This is an application of the principle that **data outlives code**: when the lifecycle rules, root cause categories, or evaluation dimensions need to change, you edit a config file, not an agent prompt.

---

## Static Schemas (Ship with Plugin)

These files define the domain model. They live in `config/` relative to the Blueprint plugin directory.

### `lifecycle.toml`: The State Machine

Defines the finite state machine that governs ADR transitions:

```toml
[statuses]
Proposed = { description = "Under consideration" }
Accepted = { description = "Approved and binding" }
Rejected = { description = "Considered and declined" }
Deferred = { description = "Postponed with trigger condition" }
Deprecated = { description = "No longer applicable" }
Superseded = { description = "Replaced by a newer decision" }

[transitions]
accept = { from = "Proposed", to = "Accepted", requires = ["review"] }
reject = { from = "Proposed", to = "Rejected" }
defer = { from = "Proposed", to = "Deferred", requires = ["trigger_condition"] }
deprecate = { from = "Accepted", to = "Deprecated" }
supersede = { from = "Accepted", to = "Superseded", requires = ["successor_adr"] }
```

Every transition is validated against this state machine. You cannot accept an ADR that hasn't been reviewed. You cannot supersede a proposed ADR. These rules are enforced by data, not convention.

### `taxonomy.toml`: Classification System

Defines the vocabulary for classification across agents:

```toml
[root_causes]
missing_validation = "Input accepted without verification"
implicit_contract = "Undocumented assumption between components"
state_management = "Shared mutable state or race condition"
error_swallowing = "Exception caught and silenced"
wrong_abstraction = "Abstraction that hinders rather than helps"
config_drift = "Environment-specific configuration divergence"
dependency_coupling = "Tight coupling to external dependency"
missing_test = "Untested code path"
architectural_gap = "Missing structural boundary or pattern"

[evaluation_dimensions]
consistency = "Pattern adherence, naming, layering, dependency direction"
bugs = "Complexity hotspots, coupling, missing boundaries"
maintainability = "Dependencies, abstractions, change amplification"
testing = "Pyramid health, anti-pattern tests, risk coverage"
conways = "Ownership alignment, friction points, scaling"

[severity]
High = "Requires immediate attention"
Medium = "Should be addressed in current cycle"
Low = "Track for future consideration"
```

Classification is consistent across agents and sessions because it comes from data, not from prompt instructions that might drift.

---

## Mutable State Files (Per-Project)

These files are created and managed per-project, stored in `{adr_directory}/.state/`:

### `state.toml`: Session Memory

```toml
adr_directory = "docs/adr"
project_root = "/home/user/project"
last_audit = "2026-03-15"
last_evaluation = "2026-03-10"
last_retro = "2026-03-18"
```

Enables contextual suggestions without re-scanning every time. "You haven't run an audit in 45 days" comes from this file.

### `relationships.toml`: ADR Dependency Graph

```toml
[[edges]]
from = "ADR-0003"
to = "ADR-0007"
type = "DEPENDS_ON"

[[edges]]
from = "ADR-0012"
to = "ADR-0003"
type = "SUPERSEDES"
```

Incremental impact analysis. When you add ADR-0015, Blueprint checks it against the graph, not by re-reading every ADR file.

### `contexts.toml`: DDD Bounded Contexts

Maps ADRs to domain boundaries for per-team views and context-aware impact analysis.

### `evidence.toml`: Epistemic Status Tracking

Tracks evidence levels (L0: unverified, L1: partially verified, L2: fully verified), expiry dates, and stale claims for every ADR.

### `governance.toml`: Governance Mode

Configures the governance tier: lightweight (default), advised (consultation required), governed (N approvals required), or formal (phase-based gates).

### `radar.toml`: Technology Radar

Tracks technology adoption lifecycle: Adopt, Trial, Assess, or Hold. Created on first use of `/blueprint:radar`.

---

## Config Resolution Protocol

All skills resolve the ADR directory using a standardized protocol:

1. Check (in order): `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`
2. Mutable state files live at: `{adr_directory}/.state/`
3. Static schemas always at: `config/` relative to the Blueprint plugin directory

!!! tip
    You never need to edit config files manually. Every mutable config is managed by Blueprint commands. But because they're TOML, you *can*, and the data is always inspectable, diffable, and version-controlled.
