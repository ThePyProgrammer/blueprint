# Architecture Governance, Emerging Trends, and Tooling: A Comprehensive Research Brief

**Date:** 2026-03-30
**Purpose:** Research brief for Blueprint extension planning
**Scope:** Governance models, emerging trends, tooling landscape, case studies, and extension opportunities

---

## Table of Contents

1. [Part 1: Architecture Governance Models](#part-1-architecture-governance-models)
2. [Part 2: Emerging Trends](#part-2-emerging-trends)
3. [Part 3: Tooling Landscape](#part-3-tooling-landscape)
4. [Part 4: Case Studies](#part-4-case-studies)
5. [Blueprint Extension Opportunities](#blueprint-extension-opportunities)
6. [Sources](#sources)

---

## Part 1: Architecture Governance Models

### 1.1 Centralized Governance

Traditional architecture governance operates through Architecture Review Boards (ARBs), enterprise architect roles, and gate reviews. Decisions flow through a central architecture function that owns standards, principles, and approval authority.

**Characteristics:**
- Centralized decision authority with formal gate reviews
- Enterprise architects define standards, reference architectures, and technology roadmaps
- All significant architectural changes require board approval
- Strong alignment and consistency across the organization

**Limitations:** The State of DevOps report reveals that traditional ARBs correlate with *low* organizational performance [1]. They become bottlenecks, slow delivery, and create adversarial relationships between architects and delivery teams. As Harmel-Law writes, the traditional approach "hinders workflow" at scale [2].

### 1.2 Decentralized / Federated Governance

#### The Spotify Model

Spotify's organizational model -- squads, tribes, chapters, and guilds -- decentralizes architectural decision-making to autonomous squads while maintaining alignment through guilds (cross-cutting communities of practice) and chapters (functional groupings within a tribe) [3]. Key outcomes:

- Architectural decisions are made by squads closest to the problem
- Guilds dedicated to particular technologies (Web, Backend) develop and maintain "Golden Paths" -- tutorials and templates guiding engineers toward best practices [4]
- Conflicting architectural decisions across squads are resolved through guild discussions, not top-down mandates

A 2021 academic paper demonstrated that tailoring the Spotify model for architecture governance successfully "transforms architectural decision-making into decentralized based decision-making" and "mitigates key technical risks across autonomous squads" [5].

#### The Architecture Advice Process

The most significant development in decentralized governance is the Architecture Advice Process, placed at **Trial** on the ThoughtWorks Technology Radar (April 2025) [6]. Originated by Andrew Harmel-Law and documented on Martin Fowler's site [2], its core mechanism is:

> **The Rule:** Anyone can make an architectural decision.
> **The Constraint:** Before deciding, seek advice from (a) those meaningfully affected and (b) those with relevant expertise. Advice-seekers are not obliged to agree; they must listen and document.

Supporting elements include:
- **Architecture Decision Records (ADRs)** with an "advice" section capturing all counsel received
- **Architecture Advisory Forum (AAF)** -- a weekly hour-long gathering for discussing proposed decisions (advice-giving, not approval authority)
- **Team-sourced architectural principles** that are SMART (Specific, Measurable, Achievable, Realistic, Testable)
- **Internal Technology Radar** mapping local technology trends

This model explicitly replaces gatekeeping with expertise-sharing, and approval with conversation [2].

### 1.3 Hybrid Models

The market data supports hybrid approaches: approximately 65% of technical leaders prefer hybrid or federated governance, with 29% choosing hybrid, 36% federated, and only 36% purely centralized [7]. Federated models with automated enforcement have been shown to cut incidents by 50% [7].

**Effective hybrid patterns:**
- Central team sets principles, guardrails, and golden paths; teams make tactical decisions autonomously
- Architecture fitness functions enforce invariants automatically (no human gate required)
- Advisory forums replace review boards -- same expertise, different power dynamic
- Centralized governance for strategic/cross-cutting decisions; decentralized for team-scoped decisions

### 1.4 Architecture Decision Rights

A critical governance question is *who decides what*. The emerging consensus:

| Decision Type | Who Decides | Governance Mechanism |
|---|---|---|
| **Strategic** (platform choices, data strategy, cross-cutting concerns) | Architecture function + affected teams | ADR + Advisory Forum |
| **Tactical** (library choices, local patterns, implementation approaches) | Delivery team | ADR (lightweight), team review |
| **Operational** (configuration, deployment topology) | DevOps/Platform team | Golden paths, automated policy |
| **Emergency** (production incidents, security patches) | On-call engineer | Post-hoc ADR + retrospective |

The Architecture Advice Process formalizes this: anyone *can* decide anything, but the social cost of ignoring advice from affected parties self-regulates decision scope [2].

### 1.5 Governance Anti-Patterns

| Anti-Pattern | Description | Detection Signal |
|---|---|---|
| **Ivory Tower Architecture** | Architects disconnected from code, making pronouncements nobody follows [8] | ADRs that nobody references; architecture diagrams that don't match production |
| **Rubber Stamp Reviews** | Committees that appear to govern but approve everything [9] | 100% approval rate; review meetings under 15 minutes |
| **Governance Theater** | Extensive documentation produced for optics rather than function [9] | Documentation packages for minimal-risk changes; every deviation escalated |
| **Governance as Control** | Approval gates that exist to control rather than enable [8] | Teams route around governance; shadow decisions in Slack |
| **Steering Via the Underside** | Architecture delegated through IT departments, making EA inconsequential [8] | Architectural control exercised by IT ops, not architects |
| **Architecture by Committee** | Decisions averaged across too many stakeholders | Bland, compromise-driven decisions that satisfy nobody |

The root cause of most anti-patterns: "governance designed for the optics of oversight rather than the function of it" [9]. The fix is structural change, not policy change [8].

### 1.6 Agile Architecture Governance

#### SAFe Architectural Runway

In SAFe, the Architectural Runway provides "the technology required to quickly define, build, validate, and release Features and Capabilities" [10]. Key principles:

- **Just-Enough Architecture** -- only the outlines ready at start, detailed enough for sprint teams to begin
- **Collectively owned** -- constructed at the lowest scaling level by agile teams
- **Architect as enabler** -- "somebody who enables design rather than governs" [10]
- Enterprise architects create **enabler epics** for large architectural changes at the portfolio level

#### Continuous Architecture (Erder & Pureur)

The Continuous Architecture framework [11] defines six principles:

1. **Architect products, not just solutions for projects**
2. **Focus on quality attributes, not functional requirements**
3. **Delay design decisions until absolutely necessary**
4. **Architect for change** -- leverage "the power of small"
5. **Architect for build, test, and deploy**
6. **Model the organization after the design of the system** (Conway's Law operationalized)

This is not a methodology but a set of principles and practices. The core insight: architecture is a continuous activity, not an upfront phase.

---

## Part 2: Emerging Trends

### 2.1 AI-Assisted Architecture

**Current State (2026):**
- Over 1.3 million repositories actively using AI code review integrations (4x increase from 2024) [12]
- 47% of professional developers have used AI-assisted code review [12]
- Repositories with AI-assisted review show 32% faster merge times and 28% fewer post-merge defects [12]

**Architecture-Specific AI Applications:**
- LLMs as "co-design partners" participating in architectural creation, optimization, documentation, verification, and continuous adaptation [13]
- Tools like Tanagram build multiple codebase graphs (lexical, referential, dependency) achieving 85%+ accuracy on enforced policies with zero hallucinations [14]
- AI agent architectures for code review using multi-agent patterns (orchestrator-worker, pipeline, debate) [14]

**Critical Challenge -- Epistemic Staleness:**
A 2026 academic paper [15] identified that AI-assisted engineering amplifies decision staleness:
- A retrospective audit of 62 architectural decisions found ~23% had stale evidence within two months
- 86% of staleness was discovered reactively during incidents, not proactively
- The paper proposes three requirements: **epistemic layers** (L0 unverified, L1 logically consistent, L2 empirically validated), **conservative aggregation** (min-based, no conclusion more reliable than weakest evidence), and **temporal validity tracking** (explicit evidence expiry windows)

> "Decisions are made faster than they can be validated." -- Gilda & Gilda, 2026 [15]

### 2.2 Continuous Architecture

Beyond Erder & Pureur's principles (see 1.6), the InfoQ Architecture Trends Report 2025 [16] positions key continuous architecture practices:

| Trend | Adoption Stage | Notes |
|---|---|---|
| Decentralized decision-making | Early Majority | Eliminates architects as bottlenecks |
| Socio-technical architecture | Early Majority | Designing systems around people who build them |
| AI-enhanced/AI-native architectures | Early Adopters | New patterns for LLM integration |
| Small language models | Early Adopters | Finely-tuned models replacing monolithic LLMs |
| Sustainability in architecture | Early Adopters | Reducing software carbon footprint |

### 2.3 Platform Engineering and Architecture

Platform engineering has matured from DevOps evolution to a distinct discipline with direct architectural implications [17]:

- **Golden Paths** (Spotify origin, adopted by Google, Netflix): Opinionated, well-documented workflows representing the most efficient way to accomplish common engineering tasks [17]
- **Paved Roads** (Netflix terminology): Same concept, emphasis on the road being maintained by a platform team
- **Internal Developer Platforms (IDPs)**: Self-service products abstracting infrastructure complexity

**Architectural significance:** Golden paths encode architectural decisions as executable defaults. Security, observability, and cost management become platform features rather than per-team responsibilities [17]. Teams *can* deviate, but the default path embodies the architecture.

### 2.4 Architecture Observability

Architecture fitness functions have evolved from static build-time checks to continuous runtime validation [18]:

| Type | When | Example | Tools |
|---|---|---|---|
| **Static** | Build/deploy time | All APIs use protocol buffers | ArchUnit, dependency-cruiser |
| **Dynamic** | Runtime (staging/prod) | Latency under load < 200ms | Custom metrics, load tests |
| **Continuous** | Always (observability) | Error rate < 1% across environments | Prometheus, Datadog |
| **Chaos** | Periodic | Service survives node failure | Chaos Monkey, Litmus |

The shift: architectural governance moves from "did you follow the rules?" to "is the system exhibiting the qualities we designed for?" -- validating architecture in production, not just in documents.

### 2.5 Architecture as Code

**Structurizr and the C4 Model:**
- 50% of dev teams adopt C4 for stakeholder communication, boosting clarity by 30% [19]
- Structurizr DSL enables version-controlled, automatable architecture models
- One team's switch to Structurizr cut diagramming time by 60% [19]
- Multiple rendering options: PlantUML, Mermaid, SVG, web-based

**The broader "as code" movement:**
- Architecture models stored alongside code in version control
- Diagrams generated from models, not hand-drawn
- Architecture changes reviewed in pull requests
- ThoughtWorks Vol. 33 highlights "everything-as-code" as a persistent trend [20]

### 2.6 Team Topologies (Skelton & Pais)

Team Topologies operationalizes Conway's Law through four team types [21]:

| Team Type | Purpose | Architecture Implication |
|---|---|---|
| **Stream-aligned** | End-to-end value delivery | Service/domain boundaries |
| **Platform** | Providing services to other teams | Internal platform architecture |
| **Enabling** | Helping teams build capability | Architecture coaching, golden paths |
| **Complicated-subsystem** | Complex specialized components | Clear API boundaries, encapsulation |

Three interaction modes (collaboration, X-as-a-service, facilitating) define how teams couple, which directly maps to architectural coupling.

**The Inverse Conway Maneuver:** Deliberately designing team structure to match desired architecture, using the isomorphic force between org structure and system structure as a *tool* rather than fighting it [21].

**Integration with Wardley Mapping and DDD:**
Susanne Kaiser's *Architecture for Flow* [22] combines Wardley Mapping, DDD, and Team Topologies into a holistic approach for adaptive, socio-technical systems -- arguably the most complete modern framework for architecture-organization alignment.

### 2.7 Wardley Mapping

Wardley Mapping provides strategic context for architectural decisions by mapping components along two axes [23]:

- **Value Chain (vertical):** Visibility to user, from user-facing to infrastructure
- **Evolution (horizontal):** Genesis -> Custom-built -> Product -> Commodity

**Architecture decision value:** Wardley maps answer "should we build, buy, or use a commodity?" based on where a component sits on the evolution axis:
- **Genesis:** Build custom, accept uncertainty
- **Custom-built:** Differentiate, invest in quality
- **Product:** Evaluate vendor solutions
- **Commodity:** Use utility/SaaS, do not invest engineering effort

**Practical example:** Mapping an application reveals the team is building a custom authentication system (evolved to commodity). Switching to Auth0 frees engineering for genesis-stage differentiators [23].

---

## Part 3: Tooling Landscape

### 3.1 ADR Tools

| Tool | Type | Key Features | Maintenance |
|---|---|---|---|
| **adr-tools** | Bash CLI | Lightweight, widely adopted, Markdown-based | Stable, low activity |
| **Log4brains** | CLI + Web | Searchable website, decision graphs, status tracking, diagram support | Active |
| **MADR** | Template | Markdown ADR template standard, used by many tools | Active |
| **adr-log** | CLI | Git-integrated, template support, policy enforcement | Active |
| **Talo** | CLI | ADRs, RFCs, and design docs in one tool | Newer |
| **dotnet-adr** | .NET CLI | Cross-platform .NET global tool | Moderate |

Log4brains is evaluated as the most feature-rich standalone ADR tool, with modern CLI, web visualization, and diagram support [24]. However, all existing tools are *passive* -- they help document decisions but do not research, challenge, audit, or enforce them.

### 3.2 Architecture Modeling

| Tool | Approach | Best For |
|---|---|---|
| **Structurizr** | C4 model, DSL, model-first | Teams wanting architecture-as-code with C4 |
| **Archi** | ArchiMate, visual editor | Enterprise architecture modeling |
| **PlantUML** | Text-based UML | Developers who want diagrams in code |
| **Mermaid** | Markdown-embedded diagrams | Documentation, GitHub rendering |
| **D2** | Modern diagram scripting | Developer-friendly, aesthetic output |

### 3.3 Architecture Analysis

| Tool | Languages | Key Capability |
|---|---|---|
| **Sonargraph** | Java, C#, C/C++, TypeScript, Go, Python | Most detailed dependency analysis, virtual refactoring, DSL-based architecture checks [25] |
| **Structure101** | Java, C#, C/C++ | Interactive dependency visualization, architecture rule enforcement, technical debt as tangles [25] |
| **Lattix** | Multi-language | DSM (Dependency Structure Matrix), impact analysis [25] |
| **NDepend** | .NET | Dependency analysis + code quality metrics, CQLinq queries [25] |

### 3.4 Architecture Fitness Testing

| Tool | Ecosystem | What It Enforces |
|---|---|---|
| **ArchUnit** | Java/Kotlin | Package dependencies, layer rules, naming conventions, cycle detection [26] |
| **ArchUnitNET** | C# | Same concepts, .NET port |
| **NetArchTest** | .NET | Fluent API for architecture rule assertion in unit tests [26] |
| **dependency-cruiser** | JavaScript/TypeScript | Module boundaries, circular dependencies, orphan detection [27] |
| **deptry** | Python | Dependency validation |

dependency-cruiser is notably the most flexible tool in the JS/TS ecosystem, actively maintained (v17.3.9, March 2026), supporting custom rule definition, visualization, and CI integration [27].

### 3.5 Architecture Knowledge Management

| Tool | Type | Key Features | Considerations |
|---|---|---|---|
| **Backstage** (Spotify/CNCF) | Open-source framework | Software catalog, TechDocs, templates, rich plugin ecosystem | 6-12 month implementation, 3-15 FTE maintenance [28] |
| **Compass** (Atlassian) | SaaS | Catalog, scorecards, metrics | Rigid data model, limited extensibility, best for Atlassian-heavy shops [28] |
| **Port** | SaaS | Visual catalog modeling, self-service actions | 3-6 month deployment, polished UX [28] |
| **OpsLevel** | SaaS | Service catalog, scorecards, checks | Developer experience focus |
| **Roadie** | Managed Backstage | Backstage without maintenance burden | Reduces Backstage's implementation cost |

### 3.6 How Blueprint Compares

Blueprint occupies a unique position in this landscape that no other tool fills:

| Capability | Log4brains | adr-tools | ArchUnit | Backstage | Blueprint |
|---|---|---|---|---|---|
| ADR creation | Yes | Yes | No | Partial | Yes |
| ADR lifecycle management | Partial | Partial | No | No | **Full FSM** |
| Research before proposing | No | No | No | No | **Yes (agent)** |
| Devil's advocate review | No | No | No | No | **Yes (agent)** |
| Codebase compliance audit | No | No | Yes (rules) | No | **Yes (agent)** |
| Architecture drift detection | No | No | Partial | No | **Yes (agent)** |
| Fitness function generation | No | No | Manual | No | **Yes (auto)** |
| Conway's Law analysis | No | No | No | No | **Yes (agent)** |
| Decision debt tracking | No | No | No | No | **Yes** |
| Retrospective / root cause | No | No | No | No | **Yes (agent)** |
| Architecture evaluation (5-dim) | No | No | No | No | **Yes (5 agents)** |

**Blueprint's differentiator:** It is the only tool that treats ADRs as *living hypotheses* with a full lifecycle -- researched, challenged, accepted, audited, and revisited. Every other ADR tool stops at documentation. Architecture analysis tools (ArchUnit, Sonargraph) enforce rules but do not connect them to decisions. Knowledge management tools (Backstage) catalog services but do not govern decisions.

Blueprint's gap: it currently operates at the *decision* layer without connecting to *strategic context* (Wardley Mapping), *team structure* (Team Topologies), or *runtime behavior* (architecture observability).

---

## Part 4: Case Studies

### Case Study 1: Multinational Manufacturing Company -- Centralized EA Success

**Context:** Large multinational manufacturer struggling with operational inefficiency, poor interdepartmental collaboration, and limited technology leverage [29].

**Approach:**
- Comprehensive enterprise architecture framework with centralized data management
- Integration of legacy systems with cloud-based solutions
- Cross-functional stakeholder collaboration between business and IT

**Outcomes:** Streamlined processes, reduced duplication, enhanced data integrity, cost savings, and improved innovation capacity.

**Governance Lesson:** Centralized governance works when EA objectives are explicitly aligned with business strategy and cross-functional collaboration is mandated, not optional.

### Case Study 2: Financial Services Firm ($500B+ AUM) -- Governance for Compliance

**Context:** Large financial services firm facing regulatory complexity, data security risks, and business continuity threats [29].

**Approach:**
- Robust governance structures focused on compliance
- Continuous auditing and monitoring protocols
- Geographically redundant disaster recovery
- Encryption and access controls as architectural requirements

**Outcomes:** Passed 16 regulatory audits without issue, zero downtime during disasters, identified 5 security risks preemptively, achieved 25% YoY growth.

**Governance Lesson:** In regulated industries, strong governance frameworks with continuous monitoring create organizational resilience. Architecture governance is not overhead -- it is the mechanism that enables growth.

### Case Study 3: Spotify -- Decentralized Governance at Scale

**Context:** Fast-growing technology company with hundreds of developers distributed across 4 cities [3][4].

**Approach:**
- Squads, tribes, chapters, and guilds replacing traditional hierarchies
- Golden Paths developed by technology-specific guilds
- Architecture decisions driven by squads with guild-level coordination
- Decentralized decision-making with cultural alignment mechanisms

**Outcomes:** Successfully scaled engineering from dozens to hundreds of developers while maintaining development velocity. Golden Paths became the industry standard for platform engineering.

**Governance Lesson:** Decentralized governance requires strong cultural alignment mechanisms (guilds, chapters) to prevent fragmentation. The key is making the right thing the easy thing (golden paths), not mandating compliance.

### Cross-Case Analysis

| Factor | Centralized Success | Compliance Success | Decentralized Success |
|---|---|---|---|
| **Decision authority** | Central EA team | Central + automated | Distributed to squads |
| **Alignment mechanism** | Stakeholder workshops | Audit protocols | Guilds + golden paths |
| **Enforcement** | Gate reviews | Continuous monitoring | Social pressure + defaults |
| **Scale** | Medium (enterprise) | Large (regulated) | Large (tech company) |
| **Key enabler** | Business-IT alignment | Governance = growth enabler | Cultural trust + autonomy |

---

## Blueprint Extension Opportunities

### Priority 1: Wardley Mapping Integration (High Impact)

**What:** Add strategic context to ADRs by linking decisions to Wardley Map components and their evolution stage.

**Why:** Currently, Blueprint evaluates decisions in isolation. A Wardley Map would answer: "Is this decision appropriate for a component at this evolution stage?" Building custom auth (commodity) wastes engineering effort. Building a custom ML pipeline (genesis) is appropriate.

**Implementation ideas:**
- `/blueprint:map` -- generate or update a project Wardley Map
- ADR template field: `Evolution Stage: [genesis|custom|product|commodity]`
- Devil's advocate agent checks: "You're building custom for a commodity component. Why?"
- Drift detection: alert when a component has evolved past its ADR's assumed stage

**Evidence:** Susanne Kaiser's *Architecture for Flow* [22] demonstrates the integration of Wardley Mapping with DDD and Team Topologies as the most complete modern framework. The "build what's novel, buy what's commodity" principle is a high-signal architectural heuristic that Blueprint could automate.

### Priority 2: Epistemic Status and Temporal Validity (High Impact)

**What:** Track the evidence quality and expiry of each ADR's supporting evidence.

**Why:** The Gilda & Gilda 2026 paper [15] found 23% of architectural decisions had stale evidence within two months, and 86% of staleness was discovered reactively. Blueprint already tracks decision lifecycle -- adding evidence validity tracking is a natural extension.

**Implementation ideas:**
- ADR fields: `Evidence Validity: [L0-unverified|L1-consistent|L2-validated]`, `Evidence Expires: YYYY-MM-DD`
- `/blueprint:debt` enhanced to surface decisions with expired evidence
- Alert when AI-generated ADR research has not been empirically validated (L0 -> flag for L1/L2 promotion)
- Conservative aggregation: decision confidence = min(evidence confidence)

### Priority 3: Team Topologies Alignment (Medium-High Impact)

**What:** Extend Conway's Law analysis with explicit Team Topologies concepts.

**Why:** Blueprint already has a Conway's Law analyzer. Adding Team Topologies vocabulary (stream-aligned, platform, enabling, complicated-subsystem) and interaction modes (collaboration, X-as-a-service, facilitating) would make the analysis more actionable.

**Implementation ideas:**
- `/blueprint:teams` -- map codebase modules to Team Topologies team types
- ADR template field: `Team Topology Impact: [which team types affected, interaction mode changes]`
- Evaluate agent checks: "This decision creates a coupling between two stream-aligned teams. Consider an X-as-a-service interaction via a platform team."

### Priority 4: Continuous Architecture Principles Integration (Medium Impact)

**What:** Embed Erder & Pureur's six principles as evaluation criteria.

**Why:** The six principles (architect products not projects, focus on quality attributes, delay decisions, architect for change, architect for build/test/deploy, model org after system) provide a validated checklist for ADR quality.

**Implementation ideas:**
- Devil's advocate checks against each principle: "Is this decision being made too early? (Principle 3)" or "Does this ADR focus on functional requirements rather than quality attributes? (Principle 2)"
- `/blueprint:evaluate` enhanced with a "continuous architecture" dimension
- Decision debt trigger: "This project-scoped decision should be a product-scoped decision (Principle 1)"

### Priority 5: Architecture Observability Bridge (Medium Impact)

**What:** Connect ADR fitness functions to runtime observability.

**Why:** Blueprint generates fitness functions (`/blueprint:fitness`), but they are currently static/build-time. Extending to runtime and continuous fitness functions would close the loop between architectural intent and production reality.

**Implementation ideas:**
- Fitness function categories: static (build-time), dynamic (runtime), continuous (observability)
- ADR field: `Observable Invariant: [metric/threshold that validates this decision in production]`
- `/blueprint:observe` -- check whether production metrics validate or contradict accepted ADRs
- Integration hooks for Prometheus/Datadog/OpenTelemetry alerting on architectural violations

### Priority 6: AI Architecture Review Enhancement (Lower Priority -- Already Partial)

**What:** Blueprint already uses AI agents for review, research, and analysis. Enhancements could include:

- **Multi-model debate:** Two LLMs argue for/against an ADR (adversarial review at scale)
- **Codebase graph analysis:** Build dependency graphs and use them for impact analysis (similar to Tanagram's approach [14])
- **Reference application anchoring:** Use a reference application to validate AI-generated architecture recommendations (ThoughtWorks Radar Vol. 33 technique [20])
- **Context engineering:** Optimize agent prompts and context management for long-horizon architectural analysis (ThoughtWorks Radar Vol. 33 [20])

### Opportunity Summary

| Extension | Impact | Effort | Blueprint Uniqueness |
|---|---|---|---|
| Wardley Mapping integration | **High** | Medium | No other ADR tool does this |
| Epistemic status / temporal validity | **High** | Low-Medium | Addresses a documented gap in AI-assisted decisions |
| Team Topologies alignment | **Medium-High** | Medium | Extends existing Conway's Law agent |
| Continuous Architecture principles | **Medium** | Low | Adds validated evaluation criteria |
| Architecture observability bridge | **Medium** | High | Connects decisions to production reality |
| AI review enhancement | **Lower** | Medium | Already partially implemented |

---

## Sources

1. [State of DevOps Report -- Architecture and Governance Findings](https://www.thoughtworks.com/en-us/radar/techniques/architecture-advice-process) -- Referenced in ThoughtWorks Radar entry on Architecture Advice Process, April 2025
2. [Scaling the Practice of Architecture, Conversationally -- Andrew Harmel-Law, Martin Fowler's Site](https://martinfowler.com/articles/scaling-architecture-conversationally.html)
3. [Decentralized Decision-Making and Scaled Autonomy at Spotify -- Journal of Systems and Software, 2023](https://www.sciencedirect.com/science/article/pii/S0164121223000444)
4. [An Architecture Governance Approach for Agile Development by Tailoring the Spotify Model -- AI & Society, Springer, 2021](https://link.springer.com/article/10.1007/s00146-021-01240-x)
5. [Spotify Tailoring for Architectural Governance -- Springer, 2020](https://link.springer.com/chapter/10.1007/978-3-030-58858-8_24)
6. [Architecture Advice Process -- ThoughtWorks Technology Radar, April 2025](https://www.thoughtworks.com/en-us/radar/techniques/architecture-advice-process)
7. [Enterprise Architecture Operating Model & Governance 2026 -- Intelance](https://www.intelance.co.uk/enterprise-architecture-operating-models-and-governance-2026-centralised-vs-federated-vs-hybrid/)
8. [Enterprise Architecture Anti-Patterns -- Ben Morris](https://www.ben-morris.com/enterprise-architecture-anti-patterns/)
9. [Governance Anti-Patterns: Your Governance Framework Is Thorough, Well-Documented, and Mostly Ignored -- ServiceNow](https://www.servicenow.com/community/developer-blog/governance-anti-patterns-your-governance-framework-is-thorough/ba-p/3506112)
10. [Architectural Runway -- Scaled Agile Framework](https://framework.scaledagile.com/architectural-runway)
11. [Continuous Architecture in Practice -- Erder, Pureur, Woods (Addison-Wesley)](https://www.amazon.com/Continuous-Architecture-Practice-Addison-Wesley-Signature/dp/0136523560)
12. [The State of AI Code Review in 2026 -- DEV Community](https://dev.to/rahulxsingh/the-state-of-ai-code-review-in-2026-trends-tools-and-whats-next-2gfh)
13. [AI-Assisted Architecture in 2025: How LLMs Are Transforming Software Design -- Sprint2Scale](https://sprint2scale.com/ai-assisted-architecture-in-2025-how-llms-are-transforming-software-design/)
14. [AI Agent Architecture Patterns for Code Review Automation -- Tanagram](https://tanagram.ai/blog/ai-agent-architecture-patterns-for-code-review-automation-the-complete-guide)
15. [AI-Assisted Engineering Should Track the Epistemic Status and Temporal Validity of Architectural Decisions -- arXiv, 2026](https://arxiv.org/html/2601.21116)
16. [InfoQ Software Architecture and Design Trends Report 2025](https://www.infoq.com/articles/architecture-trends-2025/)
17. [What Are Golden Paths? A Guide to Streamlining Developer Workflows -- platformengineering.org](https://platformengineering.org/blog/what-are-golden-paths-a-guide-to-streamlining-developer-workflows)
18. [Fitness Function-Driven Development -- ThoughtWorks](https://www.thoughtworks.com/en-us/insights/articles/fitness-function-driven-development)
19. [C4 Model Architecture Explained: Practical Guide with Structurizr -- Devot](https://devot.team/blog/c4-model)
20. [ThoughtWorks Technology Radar Vol. 33, November 2025](https://www.thoughtworks.com/about-us/news/2025/thoughtworks-tech-radar-33-rapid-ai)
21. [Team Topologies -- Complete Book Summary -- HowToES, 2025](https://howtoes.blog/2025/06/05/team-topologies-a-book-summary/)
22. [Architecture for Flow: Adaptive Systems with DDD, Wardley Mapping, and Team Topologies -- Susanne Kaiser (Addison-Wesley)](https://www.amazon.com/Adaptive-Systems-Domain-Driven-Wardley-Topologies/dp/0137393032)
23. [Using Wardley Maps to Get Big Architecture Decisions Right -- Small Step Systems](https://www.smallstepsystems.com/using-wardley-maps-to-get-big-architecture-decisions-right/)
24. [Log4brains -- GitHub](https://github.com/thomvaill/log4brains)
25. [Sonargraph-Architect -- hello2morrow](https://www.hello2morrow.com/products/sonargraph/architect)
26. [ArchUnit -- Architecture Unit Testing for Java](https://www.archunit.org/)
27. [dependency-cruiser -- GitHub](https://github.com/sverweij/dependency-cruiser)
28. [Top 4 Backstage Alternatives for 2025 -- Port](https://www.port.io/blog/top-backstage-alternatives)
29. [Case Studies: Successful Enterprise Architecture Implementations -- Enterprise Architecture Work, 2024](https://enterprisearchitecture.work/blog/2024/case-studies-successful-enterprise-architecture-implementations/)
30. [Architecture Decision Record -- Martin Fowler](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
31. [Empowering Teams: Decentralizing Architectural Decision-Making -- InfoQ](https://www.infoq.com/articles/empowering-decentralizing-architectural-decision-making/)
32. [Adaptive, Socio-Technical Systems with Architecture for Flow -- InfoQ](https://www.infoq.com/articles/adaptive-socio-technical-systems-flow/)
33. [Architectural Fitness Functions: Automating Modern Architecture Governance in .NET -- DevelopersVoice](https://developersvoice.com/blog/architecture/architectural-fitness-functions-automating-governance/)
