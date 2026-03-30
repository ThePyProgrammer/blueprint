---
name: blueprint:scope
description: >
  Define, discover, and manage bounded contexts for ADR scoping. Use when: "scope adrs",
  "add bounded contexts", "which context owns this?", "context map", "domain boundaries".
  Assigns ADRs to DDD bounded contexts, enabling per-domain views and context-aware impact analysis.
  Examples: "/blueprint:scope", "/blueprint:scope discover", "/blueprint:scope assign ADR-0005 payments".
---

# Bounded Context Scoping

Discover or define bounded contexts in the codebase and assign ADRs to the contexts they govern.
Based on Domain-Driven Design (Evans, 2003) — bounded contexts provide the natural scoping
mechanism that flat ADR systems lack.

## Shared Context

Read from parent `adr/` skill directory:
- `config/contexts.toml` — existing context definitions (if any)
- `config/state.toml` — ADR directory location
- `config/relationships.toml` — existing ADR relationships
- `agents/persona.md` — your personality

## Modes

### Discover (`/blueprint:scope` or `/blueprint:scope discover`)

1. Read `agents/adr-context-mapper.md` from parent skill directory
2. Spawn a `blueprint:adr-context-mapper` agent with:
   - Full agent instructions + `agents/persona.md`
   - Project root path, ADR directory path
   - List of existing ADR filenames
   - Existing `config/contexts.toml` if present
3. Present the context map to the user
4. Ask: "Write these contexts to `config/contexts.toml`?"
5. If yes, write the file and update `config/state.toml`
6. Commit: `feat(adr): discover bounded contexts and generate context map`

### Assign (`/blueprint:scope assign ADR-NNNN <context>`)

1. Read `config/contexts.toml` — verify context exists
2. Read the ADR file
3. Add or update the `Context` metadata field in the ADR
4. Update `config/contexts.toml` — add ADR to context's governed list
5. Commit: `docs(adr): assign ADR-NNNN to [context] bounded context`

### List (`/blueprint:scope list`)

1. Read `config/contexts.toml`
2. Display table: context name, root path, governed ADRs, owner
3. Highlight unmapped ADRs

### Add (`/blueprint:scope add <name> --path <path>`)

1. Add a new context definition to `config/contexts.toml`
2. Commit: `feat(adr): add [name] bounded context`

### Remove (`/blueprint:scope remove <name>`)

1. Remove context from `config/contexts.toml`
2. Remove context assignments from governed ADRs
3. Commit: `feat(adr): remove [name] bounded context`

## Config File: `config/contexts.toml`

```toml
# Bounded Context Definitions
# Discovered by adr-context-mapper agent or defined manually.

[contexts.payments]
label = "Payments"
root_path = "src/payments/"
key_models = ["Payment", "Invoice", "Refund"]
ubiquitous_language = ["charge", "settlement", "reconciliation"]
owner = "payments-team"
governed_adrs = ["ADR-0003", "ADR-0007"]

[contexts.orders]
label = "Orders"
root_path = "src/orders/"
key_models = ["Order", "LineItem", "Cart"]
ubiquitous_language = ["checkout", "fulfillment", "backorder"]
owner = "commerce-team"
governed_adrs = ["ADR-0005", "ADR-0012"]

# Cross-cutting ADRs (not scoped to a single context)
cross_cutting_adrs = ["ADR-0001", "ADR-0002"]

# Context relationships
[[relationships]]
upstream = "orders"
downstream = "payments"
pattern = "Customer-Supplier"
evidence = "payments/adapters/order_client.ts imports from orders/api"

[[relationships]]
upstream = "users"
downstream = "payments"
pattern = "Anti-Corruption Layer"
evidence = "payments/acl/user_translator.ts translates user models"
```

## Integration with Other Commands

- `/blueprint:list --context=payments` — show only ADRs governing the payments context
- `/blueprint:impact N` — respect context boundaries; changes in one context don't trigger review of unrelated contexts unless a relationship exists
- `/blueprint:evaluate` — per-context evaluation reports
- `/blueprint:diagram` — context map overlay on C4 diagrams
