---
name: blueprint:views
description: >
  Tag ADRs with architectural views (logical, development, process, physical, scenario) for
  stakeholder-appropriate filtering. Based on Kruchten's 4+1 View Model (1995). Use when:
  "tag views", "which view?", "filter by view", "stakeholder views", "show physical ADRs",
  "development view decisions".
  Examples: "/blueprint:views tag ADR-0005 physical", "/blueprint:views list --view=logical".
---

# Multi-View ADR Tagging

Tag ADRs with architectural views for stakeholder-appropriate filtering. Based on
Philippe Kruchten's 4+1 View Model (IEEE Software, 1995).

## Views

| View | Concerns | Stakeholders | ADR Examples |
|------|----------|-------------|--------------|
| **Logical** | Domain model, business rules, abstractions | Developers, domain experts | "Use DDD aggregates for orders" |
| **Development** | Code organization, modules, build | Developers, tech leads | "Monorepo with package workspaces" |
| **Process** | Concurrency, communication, async flows | System engineers | "Use event sourcing for audit trail" |
| **Physical** | Deployment, infrastructure, networking | DevOps, SREs | "Deploy on Kubernetes with Helm charts" |
| **Scenario** | Use cases that validate the architecture | All stakeholders | "Checkout flow must complete in <2s" |

## Process

### Tag (`/blueprint:views tag ADR-NNNN <view> [<view2>...]`)

1. Read the target ADR
2. Add or update the `Views` metadata field
3. An ADR can have multiple views (e.g., a database choice affects logical + physical)
4. Commit: `docs(adr): tag ADR-NNNN with [view] view`

### List (`/blueprint:views list --view=<view>`)

1. Read all ADRs, filter by view tag
2. Display table of ADRs for the requested view
3. Show untagged ADRs as "unclassified"

### Auto-Tag (`/blueprint:views auto`)

1. Read all ADRs without view tags
2. Classify each by analyzing the Decision and Context sections:
   **Keyword heuristics (fast, try first):**
   - Database/ORM/data model/domain/entity mentions → logical
   - Build tool/package/module/code organization mentions → development
   - Queue/event/async/concurrency/communication mentions → process
   - Deploy/infra/cloud/container/network mentions → physical
   - Performance/user flow/scenario/SLA mentions → scenario
   **Semantic fallback (when keywords match nothing):**
   - Read the ADR's Decision section and classify by what it *affects*:
     Does it change how the system is *modeled*? → logical
     Does it change how the code is *organized*? → development
     Does it change how components *communicate*? → process
     Does it change where things *run*? → physical
     Does it validate *end-to-end behavior*? → scenario
   - ADRs about meta-concerns (persona, process, tooling) → tag as `development`
   - ADRs that genuinely span all views → tag as `cross-cutting` (allowed as a 6th value)
3. Present proposed tags for user confirmation
4. Apply confirmed tags

## ADR Metadata

New optional field:

```markdown
| Views | logical, physical |
```

## Integration with Other Commands

- `/blueprint:list --view=physical` — show only deployment/infrastructure ADRs
- `/blueprint:digest` — group ADRs by view for stakeholder summaries
- `/blueprint:evaluate` — per-view evaluation reports
- `/blueprint:diagram` — C4 levels map to views (Context=scenario, Container=physical, Component=logical)
