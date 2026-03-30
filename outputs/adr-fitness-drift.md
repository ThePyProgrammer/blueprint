# Architecture Decision Records, Fitness Functions, and Architectural Drift

A comprehensive research brief for Blueprint extension planning.

**Date:** 2026-03-30
**Scope:** ADR history and variants, architecture fitness functions, architectural drift and technical debt
**Purpose:** Identify research-backed opportunities to extend Blueprint's capabilities

---

## Part 1: Architecture Decision Records — History and Variants

### 1.1 Michael Nygard's Original ADR Proposal (2011)

Michael Nygard published "Documenting Architecture Decisions" on November 15, 2011, on the Cognitect blog [1]. The post addressed a fundamental problem: new team members encountering past decisions face two poor choices — blindly accept them or blindly reverse them. Neither serves the project.

**Original Format:**

| Section | Purpose |
|---------|---------|
| **Title** | Short noun phrase, e.g., "ADR 1: Deployment on Ruby on Rails 3.0.10" |
| **Status** | Proposed, Accepted, Deprecated, or Superseded |
| **Context** | Forces at play — technological, political, social, and project-local — in neutral language |
| **Decision** | Active-voice statement beginning with "We will..." |
| **Consequences** | All outcomes — positive, negative, and neutral |

**Key Philosophical Principles:**
- Documents should be "one or two pages long" [1]
- Full paragraphs, not bullet points — "bullet points are an excuse for writing sentence fragments" [1]
- Written as "a conversation with a future developer" [1]
- Stored in version control alongside code, using markdown [1]
- ADRs should capture "architecturally significant" decisions: those affecting structure, non-functional characteristics, dependencies, interfaces, or construction techniques [1]

### 1.2 MADR (Markdown Any Decision Records)

MADR evolved from Nygard's template and Zimmermann's Y-Statements [2][3]. Originally "Markdown Architectural Decision Records," it was renamed to "Markdown Any Decision Records" to reflect broader applicability beyond purely architectural decisions [2].

**Key Differences from Nygard's Format:**
- Section-oriented format based on Markdown headings rather than prose paragraphs
- Multiple template variants: full (with explanations), minimal (mandatory sections only), bare (no explanations) [2]
- In MADR 3.0.0, "Positive Consequences" and "Negative Consequences" were merged into a single "Consequences" section [2]
- Explicitly includes "Considered Options" and "Pros and Cons" sections that Nygard's format leaves implicit
- Currently no tooling supporting MADR 3.0.0 [2]

### 1.3 Y-Statements (Olaf Zimmermann)

Originated at SATURN 2012 by Olaf Zimmermann of the University of Applied Sciences Rapperswil (HSR/OST) [4]. Practiced at ABB and taught at HSR/OST since 2013.

**The Y-Statement Template (a single structured sentence):**

> In the context of **[functional requirement or architecture component]**,
> facing **[non-functional requirement / quality concern]**,
> we decided for **[decision outcome]**
> and neglected **[alternatives not chosen]**,
> to achieve **[benefits]**,
> accepting that **[drawbacks and consequences]**.

The six sections form one sentence visualizable as the letter "Y" — pronounced "why," capturing the rationale [4]. Published in IEEE Software/InfoQ as "Making Architectural Knowledge Sustainable" [4].

**Strengths:** Forces completeness — you cannot write a Y-Statement without considering alternatives and trade-offs.
**Weaknesses:** Sentences become very long and difficult to read for inexperienced readers [3], leading MADR to adopt a section-based approach instead.

### 1.4 Lightweight ADRs (ThoughtWorks and Practitioners)

ThoughtWorks placed Lightweight Architecture Decision Records in the **Adopt** ring of their Technology Radar in November 2017 [5], signaling industry-wide acceptance.

**Practitioner Benefits Reported:**
- Improved onboarding for new developers [5]
- Improved agility when handing over project ownership during organizational changes [5]
- Improved alignment across teams regarding best practices [5]

**Martin Fowler's Guidance (martinfowler.com):**
- Use "inverted pyramid" writing structure — critical information first [6]
- File naming: monotonic numbering with descriptive titles, e.g., `0001-HTMX-for-active-web-pages` [6]
- Store in `doc/adr` within source repositories [6]
- Include: confidence level in the decision and triggers for reevaluation [6]
- Once accepted, ADRs should never be reopened — only superseded [6]

**Scaling Architecture Conversationally (Andrew Harmel-Law, martinfowler.com):**
- The **Advice Process**: anyone can make architectural decisions after consulting those affected and subject matter experts [7]
- Four supporting mechanisms: ADRs, Architecture Advisory Forum (weekly), Team-Sourced Principles (S.M.A.R.T.), and Technology Radar [7]
- Danger: "shadow architecture" — architects making behind-the-scenes decisions that undermine distributed ownership [7]

### 1.5 ADR Lifecycle Management

| State | Meaning | Transition Rules |
|-------|---------|-----------------|
| **Proposed** | Under discussion, not yet binding | Can move to Accepted, Rejected, or Deferred |
| **Accepted** | Active and governing work; immutable once accepted | Can only be Superseded or Deprecated |
| **Rejected** | Considered and explicitly declined | Terminal state |
| **Deferred** | Acknowledged but postponed with trigger conditions | Can move to Proposed when triggers fire |
| **Deprecated** | No longer relevant due to changed system context | Terminal state |
| **Superseded** | Replaced by a newer ADR (must link forward to successor) | Terminal state |

**Best Practices:**
- Always annotate both superseded ADR (pointing forward) and new ADR (pointing back) to maintain lineage [8]
- Timestamp every transition for audit trails [8]
- Immutability after acceptance prevents silent changes — forces explicit supersession [6][8]
- Fitness functions make transitions testable: when an ADR is superseded, its fitness functions should be replaced [9]

### 1.6 ADR Tooling Landscape

| Tool | Language | Key Feature |
|------|----------|-------------|
| **adr-tools** | Bash | CLI for creating, linking, and managing ADRs in Markdown [10] |
| **Log4brains** | Node.js | Static site generator for ADRs; browsable knowledge base [11] |
| **pyadr** | Python | ADR lifecycle management including proposal, acceptance, rejection [8] |
| **adr-log** | - | Generates architectural decision logs from MADRs [10] |
| **ADMentor** | - | Sparx Enterprise Architect add-in [10] |
| **dotnet-adr** | .NET | Cross-platform .NET ADR tool [10] |
| **ReflectRally** | Web | Collaborative web-based ADR creation and maintenance [10] |
| **Talo** | CLI | Managing ADRs and RFCs [10] |
| **Structurizr** | Java | Visualize and document software architecture with decision logs [10] |
| **docToolchain** | - | Docs-as-code implementation with ADR support [10] |

**Gap Observation:** No existing tool combines ADR management with fitness function generation, drift detection, or compliance auditing. Blueprint occupies a unique position in this landscape.

### 1.7 Criticism and Limitations of ADRs

| Criticism | Source | Severity |
|-----------|--------|----------|
| **Scope creep** — lacking clear definition of "architectural," teams dump all decisions into ADRs, diluting the signal | InfoQ [12] | High |
| **Storage mismatch** — repo-stored ADRs fail for cross-ecosystem decisions; non-developers find git-stored ADRs inaccessible | Fowler [6] | Medium |
| **Adoption friction** — consistency is the biggest challenge; easy to overlook the process without enforcement | ThoughtWorks [5] | High |
| **Decision boundary ambiguity** — "all architectural decisions are significant but not all significant decisions are architectural" | InfoQ [12] | Medium |
| **Knowledge loss** — most decisions happen verbally in meetings; writing them down is an extra step teams skip | Practitioners [12] | High |
| **No enforcement** — ADRs document intent but provide no mechanism to verify compliance | Multiple | Critical |
| **Stale ADRs** — without lifecycle management, accepted ADRs become outdated as the system evolves | AWS [8] | High |

---

## Part 2: Architecture Fitness Functions

### 2.1 Origin and Core Concept

Introduced in "Building Evolutionary Architectures" by Neal Ford, Rebecca Parsons, and Patrick Kua (O'Reilly, 2017; 2nd edition 2023) [13].

**Definition:** "An objective integrity assessment of some architectural characteristics" — mechanisms that provide guidance for evolutionary architecture by protecting important architectural dimensions [13][14].

**Core Insight:** Architecture evolves whether you want it to or not. Fitness functions shift governance from inspection (manual reviews) to rules (automated checks that run on every build) [9].

### 2.2 Taxonomy of Fitness Functions

| Dimension | Type A | Type B | Description |
|-----------|--------|--------|-------------|
| **Scope** | Atomic | Holistic | Single characteristic vs. combined characteristics (e.g., security + scalability) |
| **Cadence** | Triggered | Continual | Event-driven (on commit, on deploy) vs. constant monitoring (production health) |
| **Result** | Static | Dynamic | Binary pass/fail vs. context-dependent thresholds |
| **Execution** | Automated | Manual | CI pipeline vs. human verification (legal compliance, UX review) |

**Most architectures will have a large number of atomic fitness functions and a few key holistic ones** [13].

Netflix's Chaos Monkey is cited as "an outstanding example of a real-world continual holistic fitness function" [13].

### 2.3 Implementation Patterns

| Tool | Language | What It Tests |
|------|----------|---------------|
| **ArchUnit** | Java | Package dependencies, layering, naming conventions, cyclic dependencies; fluent API for expressing rules as JUnit tests [15] |
| **NetArchTest** | .NET | Class design conventions, naming, dependencies; integrates with any .NET test framework [16] |
| **dependency-cruiser** | JS/TS | Import rules, circular dependencies, orphan detection, layer enforcement [17] |
| **ts-arch** | TypeScript | Architecture rules in TypeScript tests |
| **Pyarchtest** | Python | Python architecture testing |
| Custom CI checks | Any | Bash/Python scripts checking file structure, dependency directions, naming patterns |

**ArchUnit Example Pattern (Layered Architecture):**
```java
layeredArchitecture()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Repository").definedBy("..repository..")
    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
    .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service");
```

### 2.4 Relationship Between ADRs and Fitness Functions

This is the critical bridge concept for Blueprint:

| ADR Decision Type | Fitness Function Translation |
|-------------------|------------------------------|
| "All database access must go through the ORM" | Dependency check: no direct SQL imports outside repository layer |
| "API endpoints must validate input" | Static analysis: every controller method has validation decorators |
| "No circular dependencies between modules" | dependency-cruiser / ArchUnit cycle detection |
| "Services must not depend on UI layer" | Layer architecture test |
| "All public APIs must have OpenAPI docs" | File existence check + completeness scan |

**The key insight:** A decision record documents the decision. A fitness function **assures** the decision [9]. The two are complementary but most teams only do the first.

### 2.5 Practical Challenges with Fitness Functions

| Challenge | Details |
|-----------|---------|
| **Maintenance burden** | Fitness functions must evolve when architectural goals change; out-of-date functions give false confidence [14] |
| **Holistic functions are hard** | Measuring maintainability holistically requires considering change patterns, not just code structure [14] |
| **Over-engineering risk** | Teams should start with 3 functions; mature teams can manage 5-6 [14] |
| **Subjective qualities** | Usability and maintainability lack objective measures; only proxy metrics available [14] |
| **Cost of false positives** | Overly strict functions create friction and get disabled rather than tuned |
| **Missing language support** | ArchUnit is Java-only; equivalent tools in other ecosystems are less mature [15][16] |
| **Stability vs. agility tension** | Goals for flexibility may conflict with goals for architectural stability [14] |

---

## Part 3: Architectural Drift and Technical Debt

### 3.1 Drift vs. Erosion — The Distinction

| Concept | Definition | Severity | Example |
|---------|------------|----------|---------|
| **Architectural Drift** | Introduction of design decisions **not in the original plan** but not necessarily violating it; unplanned additions | Moderate | Adding a caching layer that wasn't in the architecture but doesn't break boundaries |
| **Architectural Erosion** | Introduction of decisions that **directly violate** prescriptive architecture and quality attributes | Severe | Bypassing the service layer to make direct database calls from controllers |

**Key Insight:** Drift is additive (new things appear), erosion is subversive (existing rules get violated). Drift can eventually lead to erosion if unmanaged [18][19].

### 3.2 Detection Methods

| Method | What It Detects | Tools |
|--------|----------------|-------|
| **Static dependency analysis** | Import/dependency violations, circular dependencies | ArchUnit, dependency-cruiser, Sonargraph |
| **Reflexion models** | Divergence between high-level model and source code | Custom tooling based on Murphy/Notkin/Sullivan [20] |
| **Code smell detection** | God classes, long methods, feature envy — indicators of erosion | SonarQube, PMD, ESLint |
| **Architecture conformance DSLs** | Rule violations expressed in domain-specific languages | Sonargraph DSL, jQAssistant (Cypher queries) |
| **Git history trajectory analysis** | File churn patterns, coupling evolution, boundary violations over time | Custom scripts, CodeScene |
| **Reverse engineering + comparison** | Generate class diagrams per release, compare with metrics | ADvISE method [18] |

### 3.3 Architecture Conformance Tools

| Tool | Approach | Strengths | Limitations |
|------|----------|-----------|-------------|
| **Sonargraph** | DSL-based architecture rules, visualization, metrics (LCOM4, cyclic dependency break-up) | Most detailed reporting (from-class, to-class, dependency type, line numbers) [21] | Commercial; Java/.NET focused |
| **Structure101** | Visual architecture definition, dependency analysis, build integration | Comprehensive toolset for exploring and defining architecture [21] | Acquired by SonarSource; UI-heavy |
| **jQAssistant** | Neo4j-based; scans code into graph database, queries with Cypher | Extremely flexible — any structural question expressible as graph query | Steep learning curve; requires Neo4j |
| **Lattix** | DSM (Dependency Structure Matrix) visualization, extensive reporting | Good visualization of architecture [21] | Line number accuracy issues [21] |
| **ArchUnit** | Code-as-test; architecture rules as unit tests | Low barrier to entry; runs in CI [15] | Java ecosystem only |
| **CodeScene** | Behavioral code analysis; hotspot detection from git history | Detects social/organizational patterns | Behavioral, not structural conformance |

### 3.4 Reflexion Models (Murphy, Notkin, Sullivan, 1995)

Published at the Third ACM SIGSOFT Symposium on the Foundations of Software Engineering [20].

**Core Mechanism:**
1. Engineer defines a **high-level model** (box-and-arrow architecture)
2. Engineer specifies a **mapping** from source entities to high-level model elements
3. Tool computes a **reflexion model** showing:
   - **Convergences** — where source matches the model
   - **Divergences** — where source has dependencies the model doesn't specify (drift)
   - **Absences** — where the model specifies dependencies the source doesn't have

**Significance for Blueprint:** This is precisely what Blueprint's drift detection does conceptually — comparing ADR-specified architecture against actual codebase structure. Reflexion models provide a theoretical foundation for making this comparison rigorous.

### 3.5 Managing Technical Debt

**Ward Cunningham's Original Metaphor (1992):** Coined while developing a financial application in Smalltalk; used the financial analogy to justify refactoring to his boss [22]. Two cost components:
- **Principal:** Work required to implement the better solution
- **Interest:** Ongoing overhead caused by the presence of the debt

**Management Framework — CoBeTDM (Cost-Benefit based Technical Debt Management):**
- **Identification:** Cataloging debt items with classification
- **Monitoring:** Tracking debt growth/reduction over time
- **Prioritization:** Measuring business consequences — delivery speed impact, maintenance cost increase, customer satisfaction degradation [22]

**Martin Fowler's Technical Debt Quadrant:**

|  | Reckless | Prudent |
|--|----------|---------|
| **Deliberate** | "We don't have time for design" | "We must ship now and deal with consequences" |
| **Inadvertent** | "What's layering?" | "Now we know how we should have done it" |

### 3.6 Conway's Law and Organizational Drift

**Conway's Law (Melvin Conway, 1967):** "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations" [23].

**How Organizational Structure Causes Architectural Drift:**
- Siloed teams produce loosely connected modules that don't integrate well [23]
- Module interactions become complicated when responsible teams don't collaborate [23]
- Beneficial design alternatives aren't considered because necessary groups aren't communicating [23]
- "The casual conversations that might have prevented architectural drift never happen" [23]

**The Inverse Conway Maneuver:** Deliberately alter team organization to encourage desired software architecture [23]. Commonly used in microservices adoption — building small, long-lived, business-capability-centric teams that contain all skills needed to deliver customer value.

**Implication for Blueprint:** Conway's Law analysis should be a first-class input to drift detection. When team structures change, architectural drift becomes likely in the affected boundaries.

---

## Part 4: Blueprint Extension Opportunities

### What Blueprint Already Has

| Capability | Command | Research Basis |
|------------|---------|----------------|
| ADR creation with structured format | `/blueprint:new` | Nygard's original format [1] |
| Lifecycle management (proposed/accepted/deprecated/superseded) | `/blueprint:transition` | Standard ADR lifecycle [8] |
| Devil's advocate review | `/blueprint:review` | Architectural review practices |
| Fitness function generation from ADRs | `/blueprint:fitness` | Ford/Parsons/Kua [13] |
| Drift detection via git trajectory analysis | `/blueprint:drift` | Architectural drift detection [18] |
| Compliance auditing | `/blueprint:audit` | Architecture conformance checking |
| Decision debt tracking | `/blueprint:debt` | Technical debt management [22] |
| Impact analysis | `/blueprint:impact` | ADR dependency analysis |
| Conway's Law analysis | `/blueprint:evaluate conways` | Conway's Law [23] |
| Architecture cartography | `/blueprint:architect` | matklad's ARCHITECTURE.md philosophy |
| Bug surface mapping | `/blueprint:evaluate bugs` | Architectural risk analysis |
| Stakeholder digest | `/blueprint:digest` | Non-technical communication |
| Pre-commit guard | `/blueprint:guard` | Fitness functions as gates |

### What's Missing — Ranked by Impact

#### Tier 1: High Impact, Research-Backed Gaps

**1. Reflexion Model Integration**
- Blueprint's drift detection uses git history trajectory, but lacks the formal reflexion model comparison (Murphy/Notkin/Sullivan [20])
- **Opportunity:** Generate a high-level model from accepted ADRs + ARCHITECTURE.md, compute mapping to source entities, produce convergence/divergence/absence report
- **Why it matters:** Transforms drift detection from heuristic to systematic

**2. ADR-to-Fitness-Function Traceability Matrix**
- Blueprint generates fitness functions but doesn't maintain a live mapping showing which fitness function enforces which ADR
- **Opportunity:** `/blueprint:trace` — a traceability matrix showing every accepted ADR, its derived fitness functions, their last pass/fail status, and coverage gaps (ADRs with no fitness function)
- **Why it matters:** The ADR-fitness function relationship is the critical bridge identified in all the literature [9][13]

**3. Cross-Repository / Cross-Ecosystem ADR Management**
- Criticism: repo-stored ADRs fail for decisions spanning multiple codebases [6][12]
- **Opportunity:** `/blueprint:federation` — federated ADR index that aggregates decisions across repositories with cross-reference links
- **Why it matters:** Addresses one of the top criticisms of ADRs in practice

**4. Architecture Advisory Forum Support**
- Harmel-Law's "Scaling Architecture Conversationally" [7] identifies the Advice Process + AAF as critical for organizational adoption
- **Opportunity:** `/blueprint:advise` — structured advice-seeking workflow that records who was consulted, what advice was given, and how it influenced the decision (embedded in ADR metadata)
- **Why it matters:** Addresses the "decisions happen verbally and get lost" criticism [12]

#### Tier 2: Medium Impact, Differentiation Opportunities

**5. Y-Statement Generation**
- Auto-generate Y-Statement summaries from existing ADRs for quick decision communication
- Useful for `/blueprint:digest` enhancement — Y-Statements are more digestible than full ADRs

**6. Decision Debt Compound Interest Calculator**
- Blueprint tracks deferred ADRs with trigger conditions but doesn't quantify the cost of deferral
- **Opportunity:** Estimate "interest" accruing on deferred decisions based on codebase changes in the affected area
- **Why it matters:** Makes decision debt visible in business terms (Cunningham's metaphor [22])

**7. Fitness Function Health Dashboard**
- Track fitness function pass/fail rates over time, identify functions that are always green (possibly too lenient) or frequently red (possibly too strict)
- **Opportunity:** `/blueprint:fitness-health` — meta-analysis of fitness function effectiveness

**8. Technology Radar Integration**
- Harmel-Law's model [7] uses a Technology Radar alongside ADRs
- **Opportunity:** `/blueprint:radar` — maintain a technology adoption lifecycle (experiment/adopt/hold/retire) linked to ADRs that mandate or constrain technology choices

#### Tier 3: Nice-to-Have, Future Considerations

**9. Significant Decision Records (SDRs)**
- Fowler/InfoQ distinguish architectural decisions from merely significant ones [6][12]
- **Opportunity:** Support a parallel SDR track for important non-architectural decisions

**10. Organizational Structure Monitoring**
- Conway's Law analyzer currently runs on-demand; could monitor for team restructuring signals
- **Opportunity:** Hook into org chart changes or CODEOWNERS file modifications to trigger drift risk alerts

**11. ADR Quality Scoring**
- Score ADRs on completeness: does it have alternatives considered? Consequences documented? Confidence level? Reevaluation triggers?
- Based on Fowler's recommended elements [6]

**12. Multi-Format Export**
- Generate ADRs in Nygard format, MADR format, or Y-Statement format from the same underlying decision record
- Useful for organizations with format preferences

---

## Sources

[1] Nygard, M. "Documenting Architecture Decisions." Cognitect Blog, November 15, 2011. https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions

[2] "About MADR." MADR Project. https://adr.github.io/madr/

[3] "Markdown Architectural Decision Records: Format and Tool Support." CEUR Workshop Proceedings, Vol. 2072. https://ceur-ws.org/Vol-2072/paper9.pdf

[4] Zimmermann, O. "Y-Statements." Medium/ZIO's Blog. https://medium.com/olzzio/y-statements-10eb07b5a177

[5] "Lightweight Architecture Decision Records." ThoughtWorks Technology Radar. https://www.thoughtworks.com/en-us/radar/techniques/lightweight-architecture-decision-records

[6] Fowler, M. "Architecture Decision Record." martinfowler.com. https://martinfowler.com/bliki/ArchitectureDecisionRecord.html

[7] Harmel-Law, A. "Scaling the Practice of Architecture, Conversationally." martinfowler.com. https://martinfowler.com/articles/scaling-architecture-conversationally.html

[8] "ADR Process." AWS Prescriptive Guidance. https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html

[9] "Fitness Functions: Automating Your Architecture Decisions." Niessen, L. Medium, Feb 2026. https://lukasniessen.medium.com/fitness-functions-automating-your-architecture-decisions-08b2fe4e5f34

[10] "Decision Capturing Tools." ADR GitHub Organization. https://adr.github.io/adr-tooling/

[11] "Log4brains." GitHub. https://github.com/thomvaill/log4brains

[12] "Has Your Architectural Decision Record Lost Its Purpose?" InfoQ. https://www.infoq.com/articles/architectural-decision-record-purpose/

[13] Ford, N., Parsons, R., Kua, P. "Building Evolutionary Architectures." O'Reilly, 2017 (2nd ed. 2023). https://www.oreilly.com/library/view/building-evolutionary-architectures/9781492097532/

[14] "Fitness Functions: Safeguard Architecture with Automated Checks." Continuous Architecture. https://continuous-architecture.org/practices/fitness-functions/

[15] "ArchUnit: Unit test your Java architecture." https://www.archunit.org/

[16] "NetArchTest." GitHub. https://github.com/BenMorris/NetArchTest

[17] "dependency-cruiser." GitHub. https://github.com/sverweij/dependency-cruiser

[18] "Drift and Erosion in Software Architecture." ACM ICISDM 2020. https://dl.acm.org/doi/10.1145/3404663.3404665

[19] "Drift and Erosion in Software Architecture: Summary and Prevention Strategies." ResearchGate, 2020. https://www.researchgate.net/publication/339385701

[20] Murphy, G.C., Notkin, D., Sullivan, K. "Software Reflexion Models: Bridging the Gap between Source and High-Level Models." ACM SIGSOFT FSE, 1995. https://dl.acm.org/doi/10.1145/222124.222136

[21] Pruijt, L. et al. "The accuracy of dependency analysis in static architecture compliance checking." Software: Practice and Experience, 2017. https://onlinelibrary.wiley.com/doi/full/10.1002/spe.2421

[22] Fowler, M. "Technical Debt." martinfowler.com. https://martinfowler.com/bliki/TechnicalDebt.html

[23] "Conway's Law." Wikipedia / Fowler, M. https://martinfowler.com/bliki/ConwaysLaw.html
