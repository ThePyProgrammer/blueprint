# ADR-0036: Scope ADRs to DDD bounded contexts

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0036                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's ADRs are flat: every decision exists at the same global level. In a system with 50 ADRs across 5 domains, every stakeholder sees every decision regardless of relevance. The payments team sees database decisions for the inventory service. The auth team gets notifications about UI framework choices they have no stake in. This creates noise, reduces engagement, and makes impact analysis imprecise; a change in the orders context triggers review of unrelated ADRs.

Eric Evans' Domain-Driven Design (2003) introduced bounded contexts as explicit boundaries within which a domain model applies. Different contexts may have different models for the same real-world concept ("User" in auth is not "User" in billing). This is the most natural scoping mechanism for architectural decisions, because decisions, like domain models, have scope.

The research survey identified DDD bounded context scoping as the #1 extension opportunity by impact, cited as the most requested capability in ADR tooling across practitioner sources.

## Options Considered

### Option 1: Global ADRs only: flat namespace

Keep ADRs global. All decisions are visible to all stakeholders. Impact analysis considers all ADRs regardless of domain relevance.

- **Pros:** Simple. No configuration needed. Every stakeholder sees the full picture. No risk of siloed decisions.
- **Cons:** Scales poorly. Noisy for large systems. Impact analysis generates false positives across unrelated domains. No per-team views. The #1 requested capability left unaddressed.

### Option 2: Tag-based scoping: freeform labels on ADRs

Add a freeform `Tags` field to ADRs. Stakeholders filter by tag. No formal context definition or relationship tracking.

- **Pros:** Flexible. Quick to implement. No new config files needed.
- **Cons:** No enforcement of consistent tagging. No context relationships (Customer-Supplier, ACL). Tags lack semantic meaning: "payments" tag doesn't carry ownership, model definitions, or ubiquitous language. Doesn't integrate with DDD vocabulary that teams already use.

### Option 3: DDD bounded context scoping: formal context definitions with relationship mapping

Define bounded contexts in `config/contexts.toml` with root paths, key models, ubiquitous language, and owners. Assign ADRs to contexts. Track inter-context relationships using DDD patterns (Customer-Supplier, Anti-Corruption Layer, Shared Kernel, etc.).

- **Pros:** Semantically rich. Integrates with DDD vocabulary teams already use. Context owners enable automatic affected-party identification for the Advice Process. Relationship patterns inform impact analysis: changes in upstream contexts trigger review of downstream ADRs. Context map visualization.
- **Cons:** More complex configuration. Requires context discovery (manual or agent-assisted). Contexts may change as the system evolves. Teams unfamiliar with DDD may find the vocabulary foreign.

## Decision

> In the context of scaling ADR management beyond flat namespaces, facing the challenge of ADR noise and imprecise impact analysis in multi-domain systems, we decided for DDD bounded context scoping (Option 3) to achieve domain-aware ADR management with context-sensitive impact analysis, accepting the configuration overhead of context definitions and the learning curve of DDD vocabulary.

## Rationale

Bounded contexts are the industry-standard mechanism for defining domain boundaries. Teams that practice DDD already think in these terms. Teams that don't practice DDD benefit from the forced clarity of naming their domains, identifying models, and defining ownership. The `adr-context-mapper` agent automates discovery, analyzing directory structure, git ownership, and import patterns to infer contexts, reducing the manual overhead.

The relationship mapping (Customer-Supplier, ACL, etc.) is not academic decoration; it determines how impact analysis propagates. When ADR-0005 in the payments context changes, only ADRs in contexts with a relationship to payments are flagged for review, not the entire ADR collection.

## Consequences

### Positive
- ADRs scoped to domains: each team sees only relevant decisions
- Impact analysis respects context boundaries (fewer false positives)
- Context owners auto-populate affected parties for `/blueprint:advise`
- Context map provides visual architecture overview
- Foundation for per-context evaluation (`/blueprint:evaluate --context=payments`)

### Negative
- New config file (`config/contexts.toml`) to maintain
- Context definitions may drift if not updated when code restructures
- Teams must learn DDD relationship vocabulary (Customer-Supplier, ACL, etc.)

### Risks
- Context boundary identification is "more art than science" (Evans); the agent may infer wrong boundaries
- Over-scoping: ADRs assigned to wrong contexts receive insufficient review
- Under-scoping: Cross-cutting ADRs incorrectly assigned to a single context miss broader impact

## References
- Evans, E. "Domain-Driven Design: Tackling Complexity in the Heart of Software" (2003)
- commands/scope.md: Skill implementation
- agents/adr-context-mapper.md: Agent implementation
- config/contexts.toml: Config file
