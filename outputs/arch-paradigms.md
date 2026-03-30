# Software Architecture Paradigms and Frameworks: A Research Brief

*Research date: 2026-03-30*
*Purpose: Inform Blueprint ADR system extension strategy*

---

## Table of Contents

1. [TOGAF](#1-togaf)
2. [Zachman Framework](#2-zachman-framework)
3. [C4 Model](#3-c4-model)
4. [arc42](#4-arc42)
5. [4+1 View Model](#5-41-view-model)
6. [Domain-Driven Design](#6-domain-driven-design)
7. [Hexagonal / Clean Architecture](#7-hexagonal--clean-architecture)
8. [Evolutionary Architecture](#8-evolutionary-architecture)
9. [Cell-Based Architecture](#9-cell-based-architecture)
10. [Event-Driven Architecture](#10-event-driven-architecture)
11. [ARCHITECTURE.md (matklad)](#11-architecturemd-matklad)
12. [Paradigm Comparison Matrix](#12-paradigm-comparison-matrix)
13. [Blueprint Extension Opportunities](#13-blueprint-extension-opportunities)
14. [Sources](#14-sources)

---

## 1. TOGAF

**The Open Group Architecture Framework**

| Attribute | Detail |
|-----------|--------|
| Origin | The Open Group, 1995 (based on US DoD TAFIM) |
| Type | Enterprise architecture framework + methodology |
| Core artifact | Architecture Development Method (ADM) cycle |
| Industry adoption | Claimed 80% of Global 50, 60% of Fortune 500 [1] |
| Certification body | The Open Group (100,000+ certified professionals) |

### Core Philosophy

TOGAF provides a comprehensive approach for designing, planning, implementing, and governing enterprise information technology architecture. It treats architecture as a continuous, iterative process organized around its Architecture Development Method (ADM) — a 10-phase cycle that moves from vision through business, information systems, and technology architecture into implementation governance [2].

### Key Concepts

- **ADM Cycle**: Preliminary, Architecture Vision (Phase A), Business Architecture (B), Information Systems Architecture (C), Technology Architecture (D), Opportunities & Solutions (E), Migration Planning (F), Implementation Governance (G), Architecture Change Management (H), Requirements Management (center) [3]
- **Content Metamodel**: Defines entity types (actors, business services, applications, data entities, technology components) and their relationships. Divided into core metamodel (minimum traceability) and extension modules for deeper modeling [4]
- **Architecture Building Blocks (ABBs)**: Packages of functionality defined to meet business needs; progressively refined through Phases A-D [4]
- **Architecture Repository**: Stores architecture outputs, reference models, governance records, and capability assessments [5]
- **Governance Framework**: Formal structure for oversight, compliance review, and architecture board decision-making [5]

### Strengths

- Comprehensive coverage of enterprise-level concerns
- Well-defined governance and stakeholder management
- Strong metamodel for traceability between business and technology
- Large ecosystem of tools, training, and certified practitioners
- Iterative ADM accommodates incremental refinement

### Weaknesses

- Criticized as theory-focused with few practical worked examples [6]
- Heavyweight — expensive and time-consuming to implement fully [6]
- Most TOGAF recommendations found inapplicable in practice; successful TOGAF implementations rarely follow prescriptions literally [6]
- Poor fit for agile/fast-moving teams without significant tailoring
- Certification does not guarantee practical competence

### When to Use / Not Use

**Use when**: Large enterprise transformation, regulatory environments requiring governance trails, multi-year IT strategy programs, organizations with dedicated EA teams.

**Avoid when**: Startup/small team contexts, projects requiring rapid iteration, organizations without EA governance appetite, purely application-level architecture.

### Relation to ADR Decision-Making

TOGAF's Architecture Repository concept includes decision logs, but they are embedded within a heavyweight governance structure. ADRs (as lightweight records per Nygard [7]) serve as a complementary or replacement approach for capturing decisions without full TOGAF overhead. TOGAF's governance board concept could inform ADR approval workflows [8].

---

## 2. Zachman Framework

| Attribute | Detail |
|-----------|--------|
| Origin | John Zachman, IBM, 1987 |
| Type | Enterprise architecture classification taxonomy |
| Core artifact | 6x6 matrix (interrogatives x perspectives) |
| Industry adoption | Foundational/historical; declining active use |

### Core Philosophy

The Zachman Framework is not a methodology — it is a classification system. It provides a logical structure for organizing the complete set of descriptive representations needed to understand and manage any complex enterprise [9]. Its analogy is the periodic table: it classifies what exists, not how to create it.

### Key Concepts

**Six Columns (Communication Interrogatives):**
- What (Data) — inventory sets
- How (Function) — process flows
- Where (Network) — distribution nodes
- Who (People) — organization charts
- When (Time) — timing/event cycles
- Why (Motivation) — business goals/strategies

**Six Rows (Reification Transformations / Stakeholder Perspectives):**
1. Scope (Planner) — contextual view of the enterprise
2. Business Model (Owner) — conceptual business model
3. System Model (Designer) — logical system model
4. Technology Model (Builder) — physical technology model
5. Detailed Representations (Implementer) — configuration specifications
6. Functioning Enterprise — operational instances

Each cell in the 6x6 grid represents a unique intersection — not merely increasing detail but genuinely different representations with different context, meaning, and use [9].

### Strengths

- Comprehensive classification ensures nothing is overlooked
- Technology-agnostic and timeless in concept
- Forces explicit consideration of all stakeholder perspectives
- Good pedagogical tool for understanding EA scope

### Weaknesses

- Static — does not accommodate dynamic/evolving enterprises [10]
- No methodology or process guidance; purely structural [10]
- Filling all 36 cells is impractical for most organizations [10]
- Over-simplified analogy (enterprises are not manufactured products) [10]
- Misaligned with agile methods; promotes sequential thinking [10]
- Heavy tooling dependency for practical use

### When to Use / Not Use

**Use when**: Comprehensive EA taxonomy needed, academic/training contexts, establishing shared vocabulary for what architecture covers, auditing completeness of documentation.

**Avoid when**: Need process/methodology guidance, agile or fast-moving environments, small-to-medium projects, limited EA resources.

### Relation to ADR Decision-Making

Zachman's interrogatives (what, how, where, who, when, why) could inform a structured decision template — ensuring ADRs address all six dimensions when relevant. The row-based perspectives could inform ADR audience tagging (which stakeholder view does this decision serve?).

---

## 3. C4 Model

| Attribute | Detail |
|-----------|--------|
| Origin | Simon Brown, developed 2006-2011 |
| Type | Architecture visualization/diagramming approach |
| Core artifact | 4-level diagram hierarchy |
| Industry adoption | Widely adopted in developer-facing architecture |
| Tooling | Structurizr (Brown's own tool), PlantUML, Mermaid, draw.io |

### Core Philosophy

The C4 model addresses the gap between complex UML and informal whiteboard sketches. It provides a lean, developer-friendly approach to software architecture diagramming based on progressive detail — like zooming into a map from country to street level [11]. It builds on ideas from UML and the 4+1 view model but strips away ceremony.

### Key Concepts

**Four Abstraction Levels:**
1. **System Context** — Shows the system as a box within its environment: users and other systems it interacts with. Answers "what does this system do and who uses it?"
2. **Container** — Zooms into the system to show separately deployable/runnable units (web apps, APIs, databases, message queues). Not Docker containers — runtime units.
3. **Component** — Zooms into a single container to show its internal structural building blocks and their relationships.
4. **Code** — Zooms into a component to show classes/interfaces. Often auto-generated; recommended only for critical components.

**Supplementary Diagrams:**
- System landscape diagram (multiple systems context)
- Dynamic diagram (runtime interactions for specific scenarios)
- Deployment diagram (infrastructure mapping)

**Core Abstractions:**
- Person (human user)
- Software System (highest-level building block)
- Container (deployable unit within a system)
- Component (structural unit within a container)

### Strengths

- Extremely simple to learn and apply
- Notation-independent and tooling-independent
- Maps naturally to how developers think about systems
- Progressive detail avoids information overload
- Strong community and free tooling ecosystem

### Weaknesses

- Limited to structural/static views; no formal process/behavioral notation
- Less suited for enterprise-wide architecture (system-level focus)
- Container level can be ambiguous for complex deployments
- Code level rarely useful in practice
- No governance or decision-tracking built in

### When to Use / Not Use

**Use when**: Team needs shared architecture vocabulary, documenting existing systems, onboarding developers, communicating with mixed-technical audiences, projects of any size.

**Avoid when**: Need enterprise-wide transformation views, behavioral/process modeling is primary concern, formal compliance documentation required.

### Relation to ADR Decision-Making

C4 diagrams could be generated from ADR content — each accepted ADR describes architectural elements that map to C4 abstractions. An ADR accepting a database choice creates a Container; an ADR about module boundaries defines Components. Blueprint could auto-generate C4 context/container diagrams from the ADR graph.

---

## 4. arc42

| Attribute | Detail |
|-----------|--------|
| Origin | Dr. Gernot Starke and Dr. Peter Hruschka, 2005 |
| Type | Architecture documentation template |
| Core artifact | 12-section document structure |
| Industry adoption | Strong in German-speaking engineering; growing globally |
| License | Open source, free to use |

### Core Philosophy

arc42 is a pragmatic, minimalist documentation template that provides a standardized structure without mandating completeness. Every section is optional — treat it like compartments in a cabinet that retain value even when some are empty [12]. It is explicitly tool-agnostic and technology-agnostic.

### Key Concepts — The 12 Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | Introduction and Goals | Top 3-5 quality requirements, key stakeholders |
| 2 | Constraints | Organizational, technical, and regulatory constraints |
| 3 | Context and Scope | Business and technical context; system boundary |
| 4 | Solution Strategy | Fundamental decisions and solution approaches |
| 5 | Building Block View | Static decomposition (white-box/black-box hierarchy) |
| 6 | Runtime View | Behavioral scenarios for important use cases |
| 7 | Deployment View | Infrastructure and environment mapping |
| 8 | Cross-cutting Concepts | Domain models, patterns, rules shared across components |
| 9 | Architecture Decisions | Important, expensive, or risky decisions with rationale |
| 10 | Quality Requirements | Quality scenarios linked to section 1 goals |
| 11 | Risks and Technical Debt | Known risks and mitigation strategies |
| 12 | Glossary | Domain and technical terminology |

### Strengths

- Lightweight yet comprehensive — covers all aspects without mandating ceremony
- Sections map directly to common architecture concerns
- Section 9 (Architecture Decisions) explicitly calls for decision records
- Scales from small projects to large enterprise systems
- Language, tool, and methodology agnostic
- Active community with books, examples, and training

### Weaknesses

- No built-in methodology or process (template, not method)
- Section numbering can feel rigid for some team cultures
- No formal metamodel or relationship tracking between sections
- Limited guidance on governance or decision lifecycle
- German-centric origins mean some English resources lag

### When to Use / Not Use

**Use when**: Need a documentation structure without methodology overhead, teams want pragmatic "good enough" documentation, projects of any size, especially when combined with ADRs for section 9.

**Avoid when**: Need a full methodology/process, enterprise transformation requiring governance framework, team prefers fully freeform documentation.

### Relation to ADR Decision-Making

arc42 Section 9 is literally "Architecture Decisions" — it is the natural home for ADRs within the arc42 structure. Blueprint's ADR system could serve as the implementation engine for arc42 Section 9, while arc42's other 11 sections provide context that enriches ADR decision-making. The arc42 quality tree (Section 10) maps to fitness function targets.

---

## 5. 4+1 View Model

| Attribute | Detail |
|-----------|--------|
| Origin | Philippe Kruchten, 1995 (IEEE Software paper) |
| Type | Architecture description framework |
| Core artifact | 5 concurrent architectural views |
| Industry adoption | Foundational; influenced RUP, UML, C4, ISO 42010 |

### Core Philosophy

A single view cannot adequately represent a software architecture. Different stakeholders need different perspectives. The 4+1 model organizes architecture descriptions around four views plus illustrative scenarios, with each view addressing a specific set of concerns for a specific stakeholder group [13].

### Key Concepts

**The Five Views:**

| View | Concerns | Stakeholders | Notation |
|------|----------|-------------|----------|
| Logical | Object model, key abstractions, mechanisms | End users, domain experts | Class diagrams, state diagrams |
| Development | Software organization, modules, layers | Developers, managers | Package diagrams, component diagrams |
| Process | Concurrency, synchronization, performance | System engineers, integrators | Activity diagrams, sequence diagrams |
| Physical | Hardware topology, deployment, distribution | System engineers, operations | Deployment diagrams |
| Scenarios (+1) | Use cases that tie views together | All stakeholders | Use case diagrams, narratives |

The "+1" (scenarios) is special: it validates the other four views by walking through concrete use cases. Scenarios are the mechanism by which views are shown to be consistent and complete [13].

### Strengths

- Elegant separation of concerns by stakeholder perspective
- Scenarios as validation mechanism is powerful
- Highly influential — shaped subsequent frameworks (C4, ISO 42010)
- Simple enough to learn quickly
- View independence allows partial adoption

### Weaknesses

- Originally tied to UML notation (though adaptable)
- Five views may be insufficient for modern concerns (security, data, operations)
- No lifecycle or governance model
- Scenario validation is informal — no automation path
- Development view less relevant in microservices/cloud-native contexts

### When to Use / Not Use

**Use when**: Need to organize architecture description for multiple audiences, teaching architecture fundamentals, documenting complex systems with diverse stakeholders.

**Avoid when**: Simple systems with one stakeholder group, need for operational/security views not covered, desire for formal governance.

### Relation to ADR Decision-Making

ADRs could be tagged with which view(s) they affect (logical, development, process, physical). This enables filtering — a developer sees development-view ADRs, operations sees physical-view ADRs. The scenario view maps to Blueprint's existing fitness function concept (concrete scenarios validating architecture).

---

## 6. Domain-Driven Design

| Attribute | Detail |
|-----------|--------|
| Origin | Eric Evans, 2003 ("Domain-Driven Design: Tackling Complexity in the Heart of Software") |
| Type | Software design approach / methodology |
| Core artifact | Bounded contexts, ubiquitous language, context map |
| Industry adoption | Very high; foundational for microservices movement |

### Core Philosophy

Software should model the domain it serves. Complexity in software reflects complexity in the business domain, and the primary way to manage this complexity is through a rich domain model developed in close collaboration with domain experts. The model and the language used to describe it (ubiquitous language) must be shared between developers and business stakeholders within a bounded context [14].

### Key Concepts

**Strategic Design (system-level):**

- **Bounded Context**: An explicit boundary within which a domain model applies. Different contexts may have different models for the same real-world concept. Each context has its own ubiquitous language [15].
- **Context Map**: A visualization of relationships between bounded contexts and their integration patterns.
- **Context Mapping Patterns** [16]:
  - Customer-Supplier — upstream/downstream dependency with negotiation
  - Open Host Service — well-defined API protocol
  - Published Language — shared interchange format (JSON, Protobuf, etc.)
  - Anti-Corruption Layer — translation barrier protecting downstream model
  - Shared Kernel — overlapping model owned jointly
  - Conformist — downstream adopts upstream model as-is
  - Separate Ways — no integration; independent evolution
  - Partnership — mutual coordination between teams

**Tactical Design (code-level):**

- Entities (identity-bearing domain objects)
- Value Objects (identity-free, immutable)
- Aggregates (consistency boundaries)
- Domain Events (significant occurrences)
- Repositories (collection-like persistence abstraction)
- Services (domain operations not belonging to entities)
- Factories (complex object creation)

**Ubiquitous Language**: A shared vocabulary between developers and domain experts, used in code, conversations, and documentation. Language boundaries align with bounded context boundaries.

### Strengths

- Forces alignment between code and business domain
- Bounded contexts provide natural system decomposition
- Context mapping patterns address real integration challenges
- Ubiquitous language reduces miscommunication
- Foundational for microservices boundary identification
- Rich pattern vocabulary for complex domains

### Weaknesses

- Steep learning curve; requires significant domain expertise investment
- Overkill for simple CRUD applications
- Tactical patterns can lead to over-engineering
- Bounded context identification is more art than science
- Requires continuous collaboration with domain experts
- Evans' original book is dense and challenging

### When to Use / Not Use

**Use when**: Complex business domains, systems with rich business rules, microservices decomposition, teams needing shared language with business, long-lived systems where domain understanding is critical.

**Avoid when**: Simple data-driven applications, technical-only systems (infrastructure tools), projects without domain expert access, short-lived/throwaway projects.

### Relation to ADR Decision-Making

DDD's bounded contexts could scope ADR applicability — an ADR might apply to one bounded context but not another. Context maps could inform the ADR relationship graph (which decisions affect which contexts). The ubiquitous language concept maps to Blueprint's glossary and persona consistency. Anti-corruption layers are architectural decisions that deserve ADRs.

---

## 7. Hexagonal / Clean Architecture

| Attribute | Detail |
|-----------|--------|
| Hexagonal | Alistair Cockburn, 2005 (conceived ~2005, published as HaT TR 2005.02) |
| Onion | Jeffrey Palermo, 2008 |
| Clean | Robert C. Martin ("Uncle Bob"), 2012 |
| Type | Application architecture patterns |
| Core artifact | Ports & adapters / concentric layers with dependency inversion |

### Core Philosophy

Business logic must be isolated from external concerns (UI, database, frameworks, messaging). The application core defines ports (interfaces) that external adapters implement. Dependencies point inward — outer layers depend on inner layers, never the reverse [17].

### Key Concepts

**Hexagonal Architecture (Ports & Adapters):**

- **Inside/Outside asymmetry**: Application core (inside) communicates with external world (outside) exclusively through ports [17]
- **Primary (driving) ports**: External actors drive the application (user interfaces, test harnesses, other applications)
- **Secondary (driven) ports**: Application drives external systems (databases, services, file systems)
- **Adapters**: Technology-specific implementations of ports (HTTP adapter, PostgreSQL adapter, in-memory test adapter)
- **Key rule**: "Code pertaining to the inside part should not leak into the outside part" [17]

**Clean Architecture (Robert Martin):**

Synthesizes hexagonal, onion, and other variants into concentric rings [18]:
1. **Entities** — enterprise-wide business rules
2. **Use Cases** — application-specific business rules
3. **Interface Adapters** — controllers, presenters, gateways
4. **Frameworks & Drivers** — external tools, DB, UI, web

The **Dependency Rule**: source code dependencies must point inward only. Inner circles know nothing about outer circles.

**Onion Architecture (Palermo):**

Similar concentric model with slightly different terminology [18]:
- Domain Model (center)
- Domain Services
- Application Services
- Infrastructure (outermost)

### Strengths

- Strong testability — swap adapters for test doubles
- Technology independence — change database/UI without touching business logic
- Clear dependency direction enables reasoning about change impact
- Framework-agnostic application core
- Well-suited to long-lived systems with evolving tech stacks

### Weaknesses

- Overhead for simple applications (added abstraction layers)
- Can lead to excessive interface/abstraction proliferation
- Mapping between layers adds boilerplate
- Teams may struggle with where to place cross-cutting concerns
- Performance overhead from indirection in hot paths

### When to Use / Not Use

**Use when**: Long-lived applications, complex business logic worth protecting, need to support multiple UIs or data stores, high testability requirements, teams practicing TDD.

**Avoid when**: Simple CRUD applications, scripts/tools, prototypes, performance-critical systems where indirection cost matters, very small codebases.

### Relation to ADR Decision-Making

Hexagonal/Clean architecture is itself an ADR-worthy decision. The ports-and-adapters pattern defines a dependency direction invariant that maps directly to fitness functions (no import from outer to inner layer). Blueprint could detect hexagonal architecture adoption and generate appropriate dependency-direction fitness functions.

---

## 8. Evolutionary Architecture

| Attribute | Detail |
|-----------|--------|
| Origin | Neal Ford, Rebecca Parsons, Patrick Kua (ThoughtWorks), 2017 |
| Type | Architecture methodology / philosophy |
| Core artifact | Fitness functions |
| Industry adoption | Growing; especially among ThoughtWorks-influenced orgs |
| Second edition | 2023 ("Automated Software Governance" subtitle) |

### Core Philosophy

Architecture should support guided, incremental change across multiple dimensions. Rather than attempting to design a perfect architecture up front, evolutionary architecture provides mechanisms (fitness functions) to ensure that incremental changes preserve important architectural characteristics while allowing the architecture to evolve [19].

### Key Concepts

- **Fitness Functions**: Objective mechanisms that assess whether architectural characteristics are being maintained. Borrowed from evolutionary computing (genetic algorithms) [20]. Can be:
  - **Atomic** (single characteristic) vs. **Holistic** (multiple characteristics)
  - **Triggered** (on event) vs. **Continual** (always running) vs. **Temporal** (periodic)
  - **Static** (fixed pass/fail) vs. **Dynamic** (shifting target based on context)
  - **Automated** (CI pipeline checks) vs. **Manual** (human review)
- **Architectural Characteristics**: The "-ilities" — performance, scalability, security, maintainability, etc. Fitness functions protect these.
- **Incremental Change**: Small, reversible changes rather than big-bang rewrites
- **Guided Change**: Fitness functions guide evolution — changes that degrade protected characteristics fail automated checks
- **Automated Governance**: Second edition emphasis — fitness functions as governance policy enforcement [20]

**Examples of fitness functions [20]:**
- ArchUnit tests enforcing layer dependencies
- Performance budgets in CI
- Security scanning in deployment pipeline
- Cyclomatic complexity thresholds
- Dependency drift detection
- API compatibility checks

### Strengths

- Directly actionable — fitness functions are executable
- Aligns with CI/CD and DevOps practices
- Acknowledges that architecture must change over time
- Provides objective measurement rather than subjective review
- Second edition adds practical automation patterns
- Complementary to ADRs (ADRs state intent, fitness functions verify it)

### Weaknesses

- Fitness function identification requires architectural maturity
- Some characteristics are hard to express as automated checks (e.g., "simplicity")
- Risk of false confidence from passing fitness functions
- Requires CI/CD infrastructure investment
- Limited guidance on when to retire/evolve fitness functions

### When to Use / Not Use

**Use when**: Systems that must evolve continuously, organizations with CI/CD maturity, teams wanting objective architecture governance, long-lived systems with changing requirements.

**Avoid when**: Throwaway prototypes, waterfall environments without CI/CD, systems with fixed/frozen architectures.

### Relation to ADR Decision-Making

**This is Blueprint's closest intellectual neighbor.** Blueprint already has `/blueprint:fitness` to generate fitness functions from accepted ADRs, and `/blueprint:drift` for temporal drift detection. The evolutionary architecture concept of "fitness functions as automated governance" is precisely what Blueprint implements. Extension opportunities lie in fitness function categorization (atomic/holistic, triggered/continual) and dynamic fitness functions.

---

## 9. Cell-Based Architecture

| Attribute | Detail |
|-----------|--------|
| Origin | Asanka Abeysinghe, Paul Fremantle (WSO2), ~2018 |
| Type | Distributed systems reference architecture |
| Core artifact | Cell (composable, independently deployable unit) |
| Industry adoption | Emerging; adopted by AWS Well-Architected, some enterprises |

### Core Philosophy

Microservices are too fine-grained to serve as architecture units. Cell-based architecture groups related microservices, data stores, and infrastructure into independently deployable, governable, observable cells — each with a well-defined gateway as its single access point [21]. It addresses the gap between individual microservices and monolithic enterprise layers.

### Key Concepts

- **Cell**: A composable unit containing a logically connected set of microservices plus their dependencies (databases, message buses). Independently scalable, deployable, manageable, and observable [21].
- **Cell Gateway**: The single access point for a cell. Acts as policy enforcement point, observability touchpoint, and governance enabler [21].
- **Cell Router**: Thinnest possible routing layer that directs requests to the appropriate cell [21].
- **Control Plane**: Administrative layer for provisioning, de-provisioning, and migrating cells [21].
- **Inter-cell Communication**: Cells communicate through well-defined APIs and events via their gateways.
- **Component Types**: Legacy/data services, microservices/serverless, gateways/brokers, governance/utility components [21].

### Strengths

- Natural alignment with team/domain boundaries (Conway's Law)
- Reduces blast radius — failures contained within cells
- Governance enforced at gateway level
- Supports brownfield + greenfield hybrid (critical for enterprises)
- Scales organizational complexity better than flat microservices

### Weaknesses

- Emerging pattern — limited proven case studies
- Gateway overhead for intra-cell communication
- Cell boundary identification is as challenging as bounded context identification
- Additional operational complexity (cell routers, control planes)
- Tooling ecosystem still maturing

### When to Use / Not Use

**Use when**: Large microservices estates needing organizational structure, enterprise systems requiring governance at deployment boundaries, teams aligned to domains, hybrid brownfield/greenfield environments.

**Avoid when**: Small systems, monoliths that don't need decomposition, teams without operational maturity for distributed systems.

### Relation to ADR Decision-Making

Cells could serve as ADR scope boundaries — decisions within a cell vs. cross-cell decisions. Cell gateways represent architectural invariants that deserve ADRs. The control plane concept maps to architecture governance (who can modify cell configurations?). Blueprint could model cell boundaries in its relationship graph.

---

## 10. Event-Driven Architecture

| Attribute | Detail |
|-----------|--------|
| EDA origins | Distributed systems research, 1990s-2000s; no single creator |
| CQRS | Greg Young, ~2010 (building on Bertrand Meyer's CQS, 1988) |
| Event Sourcing | Greg Young, ~2010 (building on earlier transaction log concepts) |
| Type | Architecture style / pattern family |
| Industry adoption | Very high; foundational for modern distributed systems |

### Core Philosophy

Systems communicate through events — signals that something has happened. Producers emit events without caring about consumers. This inverts the coupling pattern of request/response: producers don't need to know who consumes their events [22].

### Key Concepts

**Martin Fowler's Four EDA Patterns [22]:**

| Pattern | Description | Trade-offs |
|---------|-------------|------------|
| Event Notification | System sends events to notify others of domain changes; source doesn't care about response | Low coupling, simple setup; but logical flows across events become invisible |
| Event-Carried State Transfer | Events carry all data consumers need, so consumers maintain local copies | Improved availability, reduced coupling; but data replication and eventual consistency |
| Event Sourcing | Every state change recorded as immutable event; state derived from event replay | Full audit trail, temporal queries, debugging; but complexity, replay performance, event versioning |
| CQRS | Separate models for reads (queries) and writes (commands) | Independent scaling, optimized read/write models; but eventual consistency, increased complexity |

**CQS to CQRS lineage:**
- Bertrand Meyer's Command-Query Separation (CQS, 1988): "Asking a question should not change the answer" — methods either return data (query) or change state (command), never both [23]
- Greg Young's CQRS (2010): Extends CQS from method level to system level — separate objects/services for commands vs. queries [23]
- Event Sourcing often paired with CQRS: commands produce events (write side), projections consume events to build read models (read side) [23]

### Strengths

- Loose coupling between producers and consumers
- Natural fit for asynchronous, distributed systems
- Event sourcing provides complete audit trail and temporal queries
- CQRS enables independent optimization of read and write paths
- Resilience through decoupled processing

### Weaknesses

- Eventual consistency requires careful handling
- Event versioning and schema evolution are hard problems
- Debugging asynchronous event flows is challenging
- Event sourcing replay can be slow for large event stores
- Increased operational complexity (message brokers, event stores)
- CQRS overkill for simple read-heavy applications

### When to Use / Not Use

**Use when**: Distributed systems needing loose coupling, audit trail requirements (event sourcing), different read/write scaling needs (CQRS), reactive/real-time processing, complex domain with many integrations.

**Avoid when**: Simple CRUD applications, strong consistency requirements everywhere, small monolithic systems, teams without async debugging skills.

### Relation to ADR Decision-Making

Adopting EDA/CQRS/Event Sourcing are major architectural decisions that deserve ADRs. Event sourcing itself is analogous to ADR management — both maintain an append-only log of decisions/events from which current state can be derived. Blueprint's ADR lifecycle (Proposed -> Accepted -> Deprecated -> Superseded) is structurally similar to event sourcing's state derivation from event sequence.

---

## 11. ARCHITECTURE.md (matklad)

| Attribute | Detail |
|-----------|--------|
| Origin | Aleksey Kladov (matklad), February 2021 blog post |
| Type | Documentation philosophy / practice |
| Core artifact | ARCHITECTURE.md file in repository root |
| Industry adoption | Growing; adopted by rust-analyzer, many OSS projects |
| Scope | Projects in the 10k-200k LOC range |

### Core Philosophy

New contributors spend roughly 2x longer writing patches due to unfamiliarity, but **10x longer discovering where changes should occur**. An ARCHITECTURE.md externalizes the mental map that experienced maintainers possess, addressing the larger multiplier. This is not "write more docs" advice — it is targeted at the specific high-leverage documentation gap [24].

### Key Concepts

- **Codemap**: The centerpiece — a "map of a country, not an atlas of maps of its states." Describes coarse-grained modules and their relationships. Answers: where to find functionality X, and what does this code section accomplish? [24]
- **Invariants**: Explicitly document architectural invariants, especially those expressed as absences (e.g., "the model layer does NOT depend on views"). Absences are invisible in code and cannot be discovered by reading [24].
- **Boundaries**: Identify layer and system boundaries that constrain implementations [24].
- **Cross-cutting concerns**: Addressed in a separate section [24].
- **Naming without linking**: Name important files, modules, and types but avoid direct links (links decay). Use symbol search instead [24].
- **Stability**: Content should be unaffected by routine code changes; revisit a couple of times yearly [24].

### Strengths

- Extremely low overhead — one file, updated infrequently
- Addresses the highest-leverage documentation gap (navigation)
- Invariants documentation prevents accidental architecture erosion
- Practical and battle-tested (rust-analyzer, other large OSS projects)
- Complements rather than replaces code comments and ADRs

### Weaknesses

- Only covers structural overview — not decisions, rationale, or governance
- Requires discipline to keep updated (though infrequent updates help)
- No formal structure — quality depends entirely on author
- Limited applicability below 10k LOC or above 200k LOC
- Single-file approach doesn't scale for very large systems

### When to Use / Not Use

**Use when**: Any project in the 10k-200k LOC range, open source projects with contributors, teams with onboarding needs, projects where "where does this go?" is a frequent question.

**Avoid when**: Very small projects where code is self-evident, very large systems needing structured documentation, projects where decisions/rationale matter more than navigation.

### Relation to ADR Decision-Making

**Blueprint already implements this** — `/blueprint:architect` generates ARCHITECTURE.md from accepted ADRs using the matklad philosophy (ADR-0030). The codemap, invariants, and boundaries from ARCHITECTURE.md are derived from ADR content. This is a solved integration in Blueprint. The key insight is that ARCHITECTURE.md describes **what is**, while ADRs describe **why it is that way** — they are complementary, not competing.

---

## 12. Paradigm Comparison Matrix

### Scope and Focus

| Paradigm | Scope | Primary Focus | Process? | Decisions? |
|----------|-------|--------------|----------|------------|
| TOGAF | Enterprise | Strategy + governance | Yes (ADM) | Embedded in governance |
| Zachman | Enterprise | Classification/taxonomy | No | Implicit in cells |
| C4 | System | Visualization | No | No |
| arc42 | System | Documentation | No | Section 9 |
| 4+1 | System | Multi-view description | No | No |
| DDD | Domain/system | Domain modeling | Partially | Context mapping |
| Hex/Clean | Application | Dependency management | No | No |
| Evolutionary | System | Change management | Yes (fitness) | Via fitness functions |
| Cell-based | Distributed | Deployment boundaries | Partially | Gateway governance |
| EDA/CQRS | System | Communication patterns | No | No |
| ARCHITECTURE.md | Codebase | Navigation/onboarding | No | No (complements ADRs) |

### Maturity and Adoption

| Paradigm | Year | Maturity | Adoption Level | Trend |
|----------|------|----------|----------------|-------|
| TOGAF | 1995 | Very mature | High (enterprise) | Stable/declining |
| Zachman | 1987 | Very mature | Low (declining) | Declining |
| C4 | 2006-2011 | Mature | High (developer) | Growing |
| arc42 | 2005 | Mature | Medium | Growing |
| 4+1 | 1995 | Very mature | High (foundational) | Stable (embedded in others) |
| DDD | 2003 | Mature | High | Stable/growing |
| Hex/Clean | 2005-2012 | Mature | High | Stable |
| Evolutionary | 2017 | Maturing | Medium | Growing |
| Cell-based | 2018 | Emerging | Low | Growing |
| EDA/CQRS | 2010 | Mature | High | Growing |
| ARCHITECTURE.md | 2021 | Young | Medium (OSS) | Growing |

---

## 13. Blueprint Extension Opportunities

Based on this research, the following paradigms offer the highest-value extension opportunities for Blueprint, ranked by impact and feasibility.

### Tier 1: High Impact, High Feasibility

#### 1. DDD Bounded Context Scoping for ADRs

**Source paradigm**: Domain-Driven Design
**Current gap**: Blueprint ADRs are global — no mechanism to scope decisions to a bounded context or domain.
**Extension**: Add `context:` field to ADR metadata. ADRs can be tagged with bounded contexts. Impact analysis (`/blueprint:impact`) respects context boundaries. Relationship graph shows context map overlays.
**Value**: Prevents irrelevant ADR noise in large systems; enables per-team/per-domain decision views.
**Effort**: Medium (metadata extension + filter logic).

#### 2. C4 Diagram Generation from ADR Graph

**Source paradigm**: C4 Model
**Current gap**: Blueprint generates ARCHITECTURE.md text but no visual diagrams.
**Extension**: `/blueprint:diagram` command that generates C4 System Context and Container diagrams from accepted ADRs. Each ADR that accepts a system/service/database creates a C4 element. Relationships from the ADR graph become C4 relationships. Output as Structurizr DSL, Mermaid, or PlantUML.
**Value**: Visual architecture communication; auto-updated diagrams that stay in sync with decisions.
**Effort**: Medium (ADR-to-C4 mapping rules + template rendering).

#### 3. Fitness Function Categorization (Evolutionary Architecture)

**Source paradigm**: Evolutionary Architecture
**Current gap**: Blueprint's `/blueprint:fitness` generates fitness functions but doesn't categorize them (atomic/holistic, triggered/continual, static/dynamic).
**Extension**: Categorize generated fitness functions per Ford/Parsons taxonomy. Add holistic fitness functions that check multiple ADRs together. Support temporal fitness functions with scheduled re-evaluation triggers.
**Value**: More nuanced governance; fitness functions matched to appropriate enforcement cadence.
**Effort**: Low (extend existing fitness function generation with metadata).

### Tier 2: High Impact, Medium Feasibility

#### 4. arc42 Export Format

**Source paradigm**: arc42
**Current gap**: Blueprint outputs ADRs and ARCHITECTURE.md but no standardized documentation format.
**Extension**: `/blueprint:export arc42` command that maps Blueprint's ADR collection into arc42's 12-section structure. ADRs populate Section 9; ARCHITECTURE.md content populates Sections 3-7; fitness functions map to Section 10; risk assessments from retrospectives populate Section 11.
**Value**: Bridges Blueprint's ADR-centric approach with industry-standard documentation format.
**Effort**: Medium-high (mapping rules + template system).

#### 5. Multi-View ADR Tagging (4+1 Model)

**Source paradigm**: 4+1 View Model
**Current gap**: ADRs are not tagged by which architectural view they affect.
**Extension**: Add `views:` metadata to ADRs with values from {logical, development, process, physical, scenario}. `/blueprint:list --view=physical` shows only deployment/infrastructure ADRs. `/blueprint:evaluate` agents report per-view findings.
**Value**: Stakeholder-appropriate ADR filtering; enables role-based architecture dashboards.
**Effort**: Medium (metadata + filtering + dashboard integration).

#### 6. TOGAF-Inspired Governance Workflows

**Source paradigm**: TOGAF ADM
**Current gap**: Blueprint's transition workflow is simple (propose -> review -> accept). No architecture board concept, no governance tiers.
**Extension**: Optional governance modes: "lightweight" (current behavior), "governed" (requires N approvals, board review), "formal" (TOGAF-style phases with gate reviews). Configurable in `config/lifecycle.toml`.
**Value**: Enables Blueprint adoption in regulated/enterprise environments without losing agile default.
**Effort**: Medium-high (workflow state machine extensions).

### Tier 3: Future Consideration

#### 7. Event-Sourced ADR History

**Source paradigm**: Event-Driven Architecture / Event Sourcing
**Current gap**: ADR transitions are tracked but the full event history (edits, reviews, challenges, fitness function results) is not maintained as an event stream.
**Extension**: Record every ADR operation as an immutable event. Enable temporal queries ("what did the architecture look like on date X?"), replay, and full audit trail.
**Value**: Complete governance audit trail; enables architecture evolution analytics.
**Effort**: High (event store infrastructure, replay mechanics).

#### 8. Cell-Based ADR Governance

**Source paradigm**: Cell-Based Architecture
**Current gap**: No concept of deployment-unit-scoped governance.
**Extension**: Define "architecture cells" as groups of related ADRs with their own governance gateway. Cross-cell ADRs require explicit inter-cell review. Cell-level dashboards.
**Value**: Scales Blueprint for large distributed systems with team-aligned architecture boundaries.
**Effort**: High (new abstraction layer + governance model).

#### 9. Hexagonal Dependency Detection

**Source paradigm**: Hexagonal / Clean Architecture
**Current gap**: Fitness functions are generated generically; no architecture-pattern-aware generation.
**Extension**: Detect hexagonal/clean architecture patterns in the codebase and auto-generate dependency-direction fitness functions (no import from infrastructure to domain layer).
**Value**: Pattern-aware fitness functions with higher signal-to-noise ratio.
**Effort**: Medium (codebase analysis + pattern detection heuristics).

### Extension Priority Matrix

| # | Extension | Impact | Feasibility | Priority |
|---|-----------|--------|-------------|----------|
| 1 | DDD bounded context scoping | High | High | **P0** |
| 2 | C4 diagram generation | High | Medium | **P0** |
| 3 | Fitness function categorization | Medium | High | **P1** |
| 4 | arc42 export | Medium | Medium | **P1** |
| 5 | Multi-view tagging | Medium | Medium | **P2** |
| 6 | Governance workflows | High | Low | **P2** |
| 7 | Event-sourced history | Medium | Low | **P3** |
| 8 | Cell-based governance | Low | Low | **P3** |
| 9 | Hexagonal detection | Low | Medium | **P3** |

---

## 14. Sources

1. [TOGAF Wikipedia](https://en.wikipedia.org/wiki/The_Open_Group_Architecture_Framework) — adoption statistics, history
2. [TOGAF ADM (The Open Group)](https://pubs.opengroup.org/togaf-standard/adm/chap01.html) — official ADM specification
3. [TOGAF ADM Phases Explained (Conexiam)](https://conexiam.com/togaf-adm-phases-explained/) — phase breakdown
4. [TOGAF Content Metamodel (The Open Group)](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap30.html) — metamodel specification
5. [TOGAF Architecture Repository (The Open Group)](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap37.html) — repository structure
6. [TOGAF Criticism (BCS)](https://www.bcs.org/articles-opinion-and-research/enterprise-architecture-is-not-togaf/) — theory-practice gap critique
7. [ADR Origin (Michael Nygard)](https://adr.github.io/) — original ADR concept
8. [ADR and TOGAF Governance](https://www.go-togaf.com/architecture-decision-records-best-practices-transparent-tech-choices/) — ADR-TOGAF integration
9. [Zachman Framework (Ardoq)](https://www.ardoq.com/knowledge-hub/zachman-framework) — comprehensive overview
10. [Zachman Criticism (Swiftorial)](https://www.swiftorial.com/swiftlessons/enterprise-architecture-framework/zachman-framework/criticisms-of-zachman) — limitations analysis
11. [C4 Model (c4model.com)](https://c4model.com/) — official specification by Simon Brown
12. [arc42 Template Overview (arc42.org)](https://arc42.org/overview) — official template structure
13. [4+1 View Model (IEEE/Kruchten)](https://arxiv.org/abs/2006.04975) — original paper
14. [Domain-Driven Design (Martin Fowler)](https://martinfowler.com/bliki/DomainDrivenDesign.html) — DDD overview
15. [Bounded Context (Martin Fowler)](https://martinfowler.com/bliki/BoundedContext.html) — bounded context definition
16. [Context Mapping Patterns (DDD Crew)](https://github.com/ddd-crew/context-mapping) — pattern catalog
17. [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture) — original specification
18. [Clean Architecture (Robert Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) — original blog post
19. [Building Evolutionary Architectures (ThoughtWorks)](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition) — book overview
20. [Fitness Functions (O'Reilly)](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781492097532/ch02.html) — fitness function specification
21. [Cell-Based Architecture (WSO2)](https://github.com/wso2/reference-architecture/blob/master/reference-architecture-cell-based.md) — reference architecture
22. [What Do You Mean by Event-Driven? (Martin Fowler)](https://martinfowler.com/articles/201701-event-driven.html) — four EDA patterns
23. [CQRS (Martin Fowler)](https://martinfowler.com/bliki/CQRS.html) — CQRS overview and CQS lineage
24. [ARCHITECTURE.md (matklad)](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) — original blog post
25. [ADR Best Practices (AWS)](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html) — ADR process guidance
26. [Cell-Based Architecture (AWS Well-Architected)](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html) — AWS adoption
