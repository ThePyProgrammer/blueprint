# ADR-0004: Encode lifecycle as state machine data, not prose

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0004                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

ADR lifecycle management requires enforcing rules: which state transitions are valid, what prerequisites each transition requires, and what error messages to surface when a transition is invalid. For example, an ADR in "Proposed" status can transition to "Accepted" only after a review has been completed, and cannot transition directly to "Superseded" without first being "Accepted."

In blueprint's original implementation, these rules were embedded as prose instructions in the SKILL.md file. Lines like "Before accepting an ADR, verify that a devil's advocate review has been performed" and "An ADR can only be superseded if it is currently in Accepted status" were scattered through the monolithic skill file.

This approach had two problems. First, multiple agents needed to enforce the same rules — the review skill, the transition skill, the audit skill — which meant duplicating the prose or having agents reference a shared prose section they might misinterpret. Second, prose rules are ambiguous. "Verify that a review has been performed" leaves open what counts as verification, while a data structure can encode the exact check.

## Options Considered

### Option 1: Prose rules in each skill

Keep lifecycle rules as natural language instructions distributed across sub-skills. Each skill contains its own copy of the rules relevant to its operations. Simple, no additional files, but duplicated and ambiguous.

### Option 2: Structured data in lifecycle.toml

Encode the entire lifecycle as a state machine in a TOML configuration file. States are entries. Transitions are edges with explicit `from`, `to`, `requires`, and `error` fields. Agents read the data structure instead of interpreting English prose.

### Option 3: Executable code (JavaScript validator)

Write a lifecycle validator in JavaScript that agents invoke to check transitions. Programmatically correct, but introduces a runtime dependency, requires agents to execute code, and moves the source of truth from readable config to opaque logic.

## Decision

**We encode the ADR lifecycle as a structured state machine in lifecycle.toml**, because agents enforcing lifecycle rules should read data, not interpret prose, and because lifecycle changes should be config changes rather than prompt rewrites.

## Rationale

- Unambiguous enforcement: a transition entry `from = "Proposed", to = "Accepted", requires = ["review"]` leaves no room for interpretation. Either the review exists or it does not. Prose like "verify that a review has been performed" invites varying interpretations across agents.
- Single source of truth: all agents read the same lifecycle.toml. When a lifecycle rule changes, it changes in one place. No risk of updating the transition skill but forgetting to update the audit skill.
- Auditability: the complete lifecycle is visible in one file. A human or agent can inspect all valid transitions, their prerequisites, and their error messages without scanning multiple skill files.
- Separation of concerns: the state machine defines what transitions are valid. The sub-skills define how to execute them. This separation means adding a new lifecycle state (e.g., "Under Review") is a config change, not a prompt rewrite across multiple skills.
- Token efficiency: a structured transition table is more compact than the equivalent prose rules, aligning with ADR-0003's token efficiency rationale.

## Consequences

### Positive

- Lifecycle rule changes are config changes — edit lifecycle.toml, no prompt engineering required.
- All agents enforce identical rules from a shared source of truth.
- The state machine is inspectable, testable, and documentable as a directed graph.
- New lifecycle states and transitions can be added without modifying any sub-skill.

### Negative

- Agents must parse TOML data structures, which is marginally more complex than following prose instructions.
- The lifecycle.toml file is an additional artifact to maintain and keep in sync with sub-skill expectations.
- Highly conditional transitions (e.g., "can be fast-tracked if the change is low-impact") are harder to express in flat data than in prose.

### Risks

- Over-encoding: attempting to express every nuance of lifecycle governance in data structures, leading to a config file that is harder to understand than the prose it replaced. Mitigation: keep the state machine flat and express complex conditions in the sub-skill logic, not the config.
- Schema drift: if the lifecycle.toml schema changes, all agents that read it need to handle the new schema. Mitigation: version the config schema.

## References

- ADR-0003: Use TOML over JSON for config DSL
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0006: Use thin router pattern for command dispatch
