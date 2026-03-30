---
name: blueprint:transition
description: >
  Direct lifecycle transitions for ADRs — accept, reject, defer, or deprecate without spawning
  agents. Use when: "accept adr N", "reject adr N", "defer adr N", "deprecate adr N". For
  review with devil's advocate challenge, use /blueprint:review instead. For superseding, use
  /blueprint:rearchitect instead.
---

# ADR Lifecycle Transitions

Handle simple status transitions inline — no agent spawning. Read the state machine from
`config/lifecycle.toml` to validate transitions and requirements.

## Shared Context

Read from parent `adr/` directory:
- `config/lifecycle.toml` — valid transitions, requirements, error messages
- `{adr_directory}/.state/state.toml` — ADR directory location
  (auto-detect adr_directory: `docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`)
- `{adr_directory}/.state/relationships.toml` — for updating edges on supersession

## Supported Transitions

### Accept (`/blueprint:transition accept N`)

Proposed → Accepted per `lifecycle.toml`.

1. Read the ADR, verify status is Proposed
2. Set status to `Accepted`
3. Set `Date decided` to today
4. Update README.md index
5. Commit: `docs(adr): accept ADR-NNNN <title>`

### Reject (`/blueprint:transition reject N`)

Proposed → Rejected per `lifecycle.toml`.

1. Read the ADR, verify status is Proposed
2. Ask for rejection reason
3. Append reason to Consequences section
4. Set status to `Rejected`
5. Update README.md index
6. Commit: `docs(adr): reject ADR-NNNN <title>`

### Defer (`/blueprint:transition defer N`)

Proposed → Deferred per `lifecycle.toml`.

1. Read the ADR, verify status is Proposed
2. Ask for trigger condition (when to revisit)
3. Add trigger to metadata
4. Set status to `Deferred`
5. Update README.md index
6. Commit: `docs(adr): defer ADR-NNNN <title>`

### Deprecate (`/blueprint:transition deprecate N`)

Accepted → Deprecated per `lifecycle.toml`.

1. Read the ADR, verify status is Accepted
2. Ask for deprecation reason
3. Add deprecation note with date
4. Set status to `Deprecated`
5. Update README.md index
6. Commit: `docs(adr): deprecate ADR-NNNN <title>`

## Invalid Transitions

Read `lifecycle.toml.invalid_transitions` for error messages. Present the message and
suggest the correct action:
- Rejected → Accepted: "Create a new ADR instead"
- Proposed → Superseded: "Accept or reject first, then use /blueprint:rearchitect"
- Proposed → Deprecated: "Use /blueprint:transition reject instead"

## Index Management

Every transition updates the README.md index table. Preserve all other content (lifecycle
diagram, process docs, etc.). Only modify the row for the affected ADR.

## Shorthand Support

Users may say "accept adr 3" without the full `/blueprint:transition accept 3` path. The root
`/blueprint` skill should route these to this sub-skill.
