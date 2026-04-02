---
title: "Strategic"
description: "Commands for strategic architecture governance: DDD bounded contexts, technology radar, governance modes, and cross-repository ADR federation."
---

# Strategic

These four commands address governance at the organizational level: domain boundaries, technology adoption lifecycle, governance rigor, and multi-repository coordination.

---

### `/blueprint:scope`: DDD Bounded Context Scoping

Define, discover, and manage bounded contexts for ADR scoping. Based on [Domain-Driven Design](https://www.domainlanguage.com/ddd/) (Evans, 2003). Each bounded context represents an explicit boundary within which a domain model and its ubiquitous language apply.

**Syntax:** `/blueprint:scope [discover|assign|list]`

- `discover`: auto-detect contexts from module structure, package boundaries, naming patterns, and git ownership
- `assign ADR-N context-name`: assign an ADR to a bounded context
- `list`: show all contexts with their governed ADRs

Context relationships (Customer-Supplier, Anti-Corruption Layer, Shared Kernel, etc.) are tracked in `{adr_directory}/.state/contexts.toml`.

**Examples:**

```
/blueprint:scope discover
# Auto-detect bounded contexts from codebase structure

/blueprint:scope assign 7 payments
# Assign ADR-0007 to the payments context

/blueprint:scope list
# Show all contexts with ADRs and relationships

/blueprint:list --context payments
# After scoping: filter ADR list to payments context
```

!!! tip
    Scoping enables per-team views. The payments team sees only their ADRs. The platform team sees the shared kernel. Impact analysis becomes context-aware: a change to the payments context flags dependencies in the orders context.

---

### `/blueprint:radar`: Technology Radar

Maintain an internal [Technology Radar](https://www.thoughtworks.com/radar) tracking technology adoption lifecycle. Links radar entries to ADRs.

**Rings:** Adopt, Trial, Assess, Hold.

**Syntax:** `/blueprint:radar [add|update|list]`

**Examples:**

```
/blueprint:radar add "Bun" --ring Assess --quadrant tools
# Add Bun to the radar in the Assess ring

/blueprint:radar update "Redis" --ring Hold --reason "Valkey migration in progress, ADR-0018"
# Move Redis to Hold with linked ADR

/blueprint:radar list
# Show full radar with ring assignments and linked ADRs
```

---

### `/blueprint:govern`: Governance Mode Configuration

Configure the governance tier for ADR lifecycle management. Four tiers, from minimal friction to formal gates.

**Syntax:** `/blueprint:govern [mode]`

**Modes:**

| Mode | Description |
|------|-------------|
| **lightweight** | Default. No requirements beyond recording the decision. |
| **advised** | Architecture Advice Process required before proposing. |
| **governed** | N approvals required before acceptance. |
| **formal** | Phase-based gates: research → propose → consult → review → accept. |

**Examples:**

```
/blueprint:govern advised
# Require /blueprint:advise before /blueprint:new

/blueprint:govern governed --approvals 2
# Require 2 approvals before acceptance

/blueprint:govern lightweight
# Reset to minimal friction
```

!!! tip
    Start with `lightweight`. Move to `advised` when the team is comfortable with the workflow. Move to `governed` or `formal` only for high-stakes decisions (production databases, security boundaries, external APIs).

---

### `/blueprint:federate`: Cross-Repository ADR Federation

Aggregate ADRs across multiple repositories into a unified index. Detect cross-repo conflicts, duplicates, and dependencies. Addresses the top practitioner criticism of repo-scoped ADRs.

**Syntax:** `/blueprint:federate [add|scan|index]`

**Examples:**

```
/blueprint:federate add ../api-gateway
# Add another repository to the federation

/blueprint:federate scan
# Scan all federated repos for conflicts and dependencies

/blueprint:federate index
# Generate unified ADR index across all federated repos
```

!!! tip
    Federation is essential when architectural decisions span multiple repositories, e.g., a shared API contract, a common authentication strategy, or a platform-wide observability standard. Without federation, the same decision gets made independently in each repo, often inconsistently.
