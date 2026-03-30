# ADR-0027: Separate non-technical stakeholder digest distinct from eli5

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0027                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

ADRs are written by engineers for engineers. They use technical vocabulary, reference implementation details, and assume familiarity with the codebase. This is appropriate — ADRs are technical documents that must be precise. But architectural decisions have consequences beyond engineering: they affect budgets, timelines, hiring plans, vendor relationships, and risk exposure. Product managers need to know that choosing a microservices architecture means 6 months longer to market but better scalability. Executives need to know that deferring the database migration decision creates quantifiable risk. Finance needs to know that the cloud-native decision has ongoing cost implications.

Blueprint already plans an eli5 capability (plain-English explanations of ADRs — see ADR-0031). But eli5 targets developers who find ADRs too jargon-heavy. It explains technical concepts with analogies: "a message bus is like a post office." This is wrong for executives. Executives do not need to understand what a message bus is. They need to understand that choosing a message bus over direct API calls costs $X more per month but reduces outage risk by Y%.

These are fundamentally different communication needs. Developers need comprehension: "what does this decision mean technically?" Stakeholders need implications: "what does this decision mean for the business?" Serving both from a single output format forces one audience to wade through irrelevant content.

## Options Considered

### Option 1: Single eli5 for everyone — simple but poorly targeted

Produce one plain-English document that serves both developers and non-technical stakeholders. Keep the language simple enough for executives while including enough technical context for developers. In practice, this produces a document that is too technical for executives (they do not care about the analogy for dependency injection) and too superficial for developers (they already know what dependency injection is — they need the practical consequences).

**Pros:** One output to maintain. No audience segmentation complexity. Simple to implement.

**Cons:** Poorly serves both audiences. Executives skip the technical analogies. Developers skip the business context. Neither audience gets what they actually need.

### Option 2: Separate digest for stakeholders with business-language risk register — targeted communication

Generate a distinct stakeholder digest that translates ADRs into business terms: impact on timeline, budget implications, risk exposure, vendor dependencies, scaling characteristics, and operational cost. The digest includes a risk register (decisions ranked by business risk), a dependency map (which decisions block which business capabilities), and a cost summary (operational cost implications of accepted decisions). Language is business-native: "revenue impact," "time to market," "operational expenditure," not "coupling," "cohesion," "eventual consistency."

**Pros:** Stakeholders receive information in their language. Risk and cost implications are surfaced explicitly. Enables informed business decisions about technical tradeoffs. Separates the two distinct communication needs cleanly.

**Cons:** Requires translating technical concepts into business impact, which is inherently lossy. Business impact estimates may be inaccurate. Adds a second output format to maintain alongside eli5.

### Option 3: No non-technical output — stakeholders read ADRs or ask engineers

Do not produce non-technical output. If stakeholders want to understand architectural decisions, they read the ADRs or ask an engineer. This keeps blueprint focused on its technical audience but creates a communication gap that is typically filled by ad-hoc slide decks, hallway conversations, and misunderstandings.

**Pros:** No additional tooling. Engineers remain the authoritative source. No risk of lossy translation.

**Cons:** Communication gap between technical and business stakeholders persists. Engineers spend time translating decisions for non-technical audiences. Stakeholders make business decisions without understanding architectural constraints.

## Decision

**We generate a separate non-technical stakeholder digest distinct from eli5**, because the digest is for PMs and executives (business impact, risk register, budget implications) while eli5 is for developers (analogies, practical consequences) — and different audiences need different documents, not the same document written at a lower reading level.

## Rationale

- The audience distinction is not about reading level — it is about information need. An executive with a PhD in computer science still needs the stakeholder digest because they are making business decisions, not implementation decisions. A junior developer still needs eli5 because they are making implementation decisions, not business decisions.
- Risk registers are the native format for executive decision-making. Translating ADRs into risk entries (probability, impact, mitigation, owner) makes architectural risk visible in the same format as financial, legal, and operational risk.
- Budget implications of architectural decisions are rarely surfaced until they appear in infrastructure bills. A digest that estimates the cost implications of each decision ("choosing managed Kubernetes over bare EC2 adds approximately $2000/month but reduces ops headcount by 0.5 FTE") enables informed budgeting.
- The digest aggregates across ADRs in a way that individual ADR explanations cannot. A stakeholder does not need to read 25 individual decision explanations — they need a portfolio view: "here are the 5 highest-risk decisions, here is the total estimated operational cost, here are the decisions blocking feature X."
- Keeping the digest separate from eli5 preserves the focus of each. eli5 can use rich technical analogies without worrying about executive attention spans. The digest can focus on business metrics without worrying about technical comprehension.

## Consequences

### Positive

- Stakeholders receive architectural information in business-native language, enabling informed decision-making without requiring engineering translation.
- The risk register makes architectural risk visible alongside other business risks, enabling holistic risk management.
- Engineers spend less time in meetings translating technical decisions for non-technical audiences. The digest does this translation systematically.
- Budget implications are surfaced proactively, reducing surprise infrastructure costs.

### Negative

- Translating technical decisions into business impact is inherently imprecise. Cost estimates and risk assessments are approximations, not calculations.
- Maintaining two distinct non-technical outputs (eli5 and digest) requires clear scope boundaries to avoid overlap and confusion.
- Stakeholders may treat the digest as a commitment rather than an estimate. "The digest said it would cost $2000/month" becomes an expectation.

### Risks

- False precision: presenting rough business impact estimates with specific numbers creates an illusion of accuracy. Mitigation: the digest uses ranges ("$1500-2500/month") and confidence levels ("high confidence," "rough estimate") rather than point values.
- Digest staleness: if the digest is generated once and not updated as ADRs change, stakeholders work from outdated information. Mitigation: the digest includes a generation timestamp and a list of ADRs that have changed since last generation.
- Scope confusion with eli5: users may be unsure when to use digest vs. eli5. Mitigation: clear naming and help text. eli5 explains what decisions mean technically. Digest explains what decisions mean for the business.

## References

- ADR-0031: eli5 plain-English explanations
- ADR-0005: Adopt cranky senior engineer persona
- ADR-0015: Proactive intervention for undocumented decisions
- ADR-0002: Decompose into focused sub-skills
