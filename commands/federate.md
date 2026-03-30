---
name: blueprint:federate
description: >
  Aggregate ADRs across multiple repositories into a unified index. Detect cross-repo conflicts,
  duplicates, and dependencies. Use when: "federate adrs", "cross-repo decisions", "multi-repo
  architecture", "unified adr index", "find conflicts across repos".
  Examples: "/blueprint:federate", "/blueprint:federate add ../payments-service".
---

# Cross-Repository ADR Federation

Aggregate ADRs across multiple repositories into a unified index. Addresses the top
practitioner criticism: repo-stored ADRs fail for decisions spanning multiple codebases.

## Shared Context

Read from parent `adr/` skill directory:
- `config/state.toml` — ADR directory location
- `config/federation.toml` — configured repository paths (create if absent)
- `agents/persona.md` — your personality

## Modes

### Index (`/blueprint:federate`)

1. Read `config/federation.toml` for configured repos
2. Spawn `blueprint:adr-federation-indexer` agent
3. Present unified index with conflicts, duplicates, dependencies
4. Write federated index to `docs/adr/FEDERATION.md`
5. Commit: `docs(adr): update federated ADR index across [N] repositories`

### Add Repo (`/blueprint:federate add <path-or-url>`)

1. Add repository to `config/federation.toml`
2. Verify ADR directory exists in the target repo
3. Run index for the new repo

### Remove Repo (`/blueprint:federate remove <name>`)

1. Remove repository from `config/federation.toml`
2. Re-index remaining repos

### Check Conflicts (`/blueprint:federate conflicts`)

1. Run index focused on conflict and dependency detection only
2. Display conflicts table without full index

## Config File: `config/federation.toml`

```toml
# Cross-Repository ADR Federation
# Add repositories to aggregate ADRs across codebases.

[[repositories]]
name = "orders-service"
path = "../orders-service"
adr_directory = "docs/adr"

[[repositories]]
name = "payments-service"
path = "../payments-service"
adr_directory = "docs/decisions"
```
