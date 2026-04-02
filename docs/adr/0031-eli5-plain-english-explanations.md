# ADR-0031: Provide plain-English eli5 explanations of ADRs and architectural landscape

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0031                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

ADRs are precise technical documents. They use terms like "eventual consistency," "dependency inversion," "bounded context," and "idempotent" because these terms have exact meanings in software architecture. This precision is a feature; it prevents ambiguity among engineers who share the vocabulary. But not every reader of an ADR shares this vocabulary.

Junior developers joining a project may understand the code but not the architectural reasoning behind it. Developers from different domains (a frontend developer reading a backend ADR, a data engineer reading an infrastructure ADR) may be unfamiliar with the specific terminology. Developers returning to a project after months away may need a refresher on what the decisions actually mean in practical terms, stripped of the formal language.

These readers do not need the stakeholder digest (ADR-0027), which translates ADRs into business impact. They need technical understanding expressed in accessible language: "eventual consistency means that when you save something, other parts of the system might not see the change for a few seconds, like posting a photo and your friend not seeing it right away because it hasn't synced to all the servers yet." Analogy-first, jargon-free, with every acronym expanded and every technical term grounded in a concrete example.

Two modes serve this need: single-ADR explanation (explain ADR-0006 in plain English) and full-landscape explanation (explain the entire architecture, grouped by theme, as if briefing someone who has never seen the codebase). The single mode provides depth on one decision. The landscape mode provides breadth across all decisions, organized into digestible groups.

## Options Considered

### Option 1: Assume readers can parse technical ADRs, no simplification

ADRs are written for engineers. Engineers should be able to read them. If a developer does not understand "dependency inversion," they should look it up. This is technically correct but practically unhelpful. It assumes a homogeneous audience with identical vocabulary, which does not exist on any team with more than 3 people. It also ignores that comprehension and parsing are different. A developer may be able to decode an ADR's technical language but miss the practical implications because the formal presentation obscures the intuition.

**Pros:** No additional tooling. ADRs remain the single source of truth. No risk of lossy simplification.

**Cons:** Excludes less experienced developers from architectural understanding. Creates a knowledge barrier that reinforces silos. Developers who do not understand the ADR cannot follow the invariant, leading to violations born of confusion rather than disagreement.

### Option 2: Dedicated eli5 skill with analogy-first explanations, accessible understanding

Provide a dedicated eli5 capability that takes an ADR (or the full ADR corpus) and produces a plain-English explanation. Every acronym is expanded on first use. Every technical term gets a concrete analogy drawn from everyday experience. The explanation focuses on practical consequences: "this decision means that when you write a new API endpoint, you put it in `src/api/routes/` and the business logic goes in `src/services/`. The route file just receives the request and passes it to the service." Two modes: single ADR (deep explanation of one decision) and landscape (thematic grouping of all decisions into a navigable overview).

**Pros:** Makes architectural decisions accessible to all skill levels. Analogies create intuitive understanding that formal definitions do not. Landscape mode provides a gentle onboarding path. Two modes serve different needs without compromise.

**Cons:** Analogies are inherently lossy; they simplify to create understanding, which means some nuance is lost. Maintaining analogy quality requires care. Bad analogies are worse than no analogies.

### Option 3: Add a "plain English" section to each ADR, integrated but cluttered

Add a mandatory "Plain English" section to the ADR template. Every ADR includes its own simplified explanation. This keeps the explanation co-located with the decision, eliminating the need for a separate tool. But it lengthens every ADR, mixes audiences within a single document, and requires ADR authors to write simplified explanations at the time of decision, when they are least likely to see their own jargon as unclear.

**Pros:** Co-located with the decision. No separate tool needed. Always up to date.

**Cons:** Lengthens every ADR. Mixes technical and simplified audiences in one document. ADR authors are the worst judges of what needs simplification; they wrote the jargon because it was natural to them. The plain English section will be the first section skipped by experienced readers and the last section updated when the ADR changes.

## Decision

**We provide plain-English explanations of individual ADRs and the full architectural landscape**, because every acronym should be expanded, every technical term should get a concrete analogy, and understanding should not require a glossary. Two modes (single ADR and full landscape grouped by theme) serve different moments of need with the same analogy-first approach.

## Rationale

- Architectural decisions affect everyone who writes code in the project. If a developer cannot understand an ADR, they cannot follow it. Violations born of confusion are more common than violations born of disagreement. eli5 eliminates confusion as a source of non-compliance.
- Analogies are the fastest path to intuition. "The service layer is like a kitchen. The route (waiter) takes the order and passes it to the service (chef) who does the actual cooking. The waiter never cooks; the chef never talks to customers" conveys layering discipline faster than "controllers delegate business logic to services to maintain separation of concerns."
- The landscape mode addresses a specific onboarding need. A new developer does not need to read 25 individual ADR explanations sequentially. They need a thematic overview: "here is how we handle data, here is how we handle communication, here is how we handle deployment." Grouping decisions by theme creates a navigable map of the architectural landscape.
- Separating eli5 from the ADR document keeps ADRs focused on their primary audience (engineers making and reviewing decisions) while providing an alternative view for a different audience (engineers seeking understanding).
- eli5 and the stakeholder digest (ADR-0027) serve different audiences with different needs. eli5 explains technical concepts to technical people who lack specific vocabulary. The digest translates technical impact into business terms for non-technical people. These are not the same task.

## Consequences

### Positive

- Junior developers can understand architectural decisions without asking senior engineers for translation. This reduces the knowledge bottleneck and accelerates onboarding.
- Cross-domain developers (frontend reading backend ADRs, etc.) can understand decisions outside their specialty.
- The landscape mode provides the gentlest possible onboarding path: "explain the whole architecture to me like I am new here." This is a question every new team member wants to ask but often does not.
- Concrete analogies create shared mental models. When the team says "the waiter/chef pattern," everyone understands the layering discipline, regardless of their familiarity with the formal terminology.

### Negative

- Analogies are lossy by design. Every simplification omits nuance. A developer who only reads the eli5 may miss important subtleties in the full ADR.
- Maintaining analogy quality requires curation. A mediocre analogy ("the message bus is like a thing that sends messages") adds nothing. A misleading analogy ("the database is like a filing cabinet" when the database is a distributed, eventually consistent store) creates false understanding.
- The eli5 output is generated on demand, not stored. Two invocations may produce different analogies for the same concept, which could cause confusion if shared.

### Risks

- Over-reliance on eli5: developers may read only the eli5 and skip the full ADR, missing important constraints and nuances. Mitigation: eli5 output includes a prominent note that it is a simplified explanation and links to the full ADR for authoritative details.
- Analogy drift: as the underlying ADR changes, previously generated eli5 explanations become stale. Mitigation: eli5 is generated on demand from current ADR content, never cached. Each explanation reflects the current state of the ADR.
- Audience confusion with digest: users may not know whether to use eli5 or digest. Mitigation: clear naming and help text. eli5 is for developers who want plain-English technical understanding. Digest is for stakeholders who want business impact. The audiences are different; the tools are different.

## References

- ADR-0027: Stakeholder digest for non-technical audience
- ADR-0005: Adopt cranky senior engineer persona
- ADR-0002: Decompose into focused sub-skills
- ADR-0015: Proactive intervention for undocumented decisions
