# Research Plan: Software Architecture Paradigms, Auditing, and Management

## Context
Blueprint is an ADR (Architecture Decision Record) management system. This research aims to identify the major paradigms and schools of thought in software architecture that Blueprint should address, and how organizations audit and manage architecture in practice.

## Questions
1. **How do organizations audit software architecture?** What methods, frameworks, and tools exist for architecture evaluation and compliance checking?
2. **What are the major paradigms/schools of thought in software architecture?** (e.g., ATAM, TOGAF, C4, arc42, Domain-Driven Design, evolutionary architecture, etc.)
3. **What is the history and evolution of Architecture Decision Records (ADRs)?** Who created them, how have they evolved, what variants exist?
4. **What are architecture fitness functions and how are they used?** How do teams enforce architectural invariants programmatically?
5. **How do teams detect and manage architectural drift and technical debt?** What tools and processes exist?
6. **What governance models exist for architecture decisions?** Centralized vs. decentralized, architecture review boards, etc.
7. **What are the emerging trends in architecture management?** AI-assisted architecture, continuous architecture, platform engineering, etc.

## Strategy
- **Researcher 1 — Architecture Evaluation Methods:** ATAM, SAAM, ARID, DCAR, and other formal evaluation frameworks. Academic origins, industry adoption, practical application.
- **Researcher 2 — Architecture Paradigms & Frameworks:** TOGAF, Zachman, C4, arc42, 4+1, IEEE 42010, Domain-Driven Design. Compare their philosophies and where they apply.
- **Researcher 3 — ADRs, Fitness Functions & Drift:** History of ADRs (Michael Nygard), variants (MADR, Y-statements), fitness functions (Building Evolutionary Architectures), drift detection, technical debt management.
- **Researcher 4 — Governance, Emerging Trends & Tools:** Architecture governance models, architecture review boards, tooling landscape, AI-assisted architecture, continuous architecture, platform engineering.

## Acceptance Criteria
- [x] All 7 key questions answered with ≥2 independent sources
- [x] Contradictions identified and addressed
- [x] No single-source claims on critical findings (except arXiv 2026 epistemic staleness paper — noted)
- [x] Coverage of at least 8 distinct architecture paradigms/frameworks (covered 11)
- [x] Practical implications for Blueprint identified per paradigm

## Task Ledger
| ID | Owner | Task | Status | Output |
|---|---|---|---|---|
| T1 | researcher-1 | Architecture evaluation methods (ATAM, SAAM, etc.) | **done** | outputs/arch-eval-methods.md |
| T2 | researcher-2 | Architecture paradigms & frameworks survey | **done** | outputs/arch-paradigms.md |
| T3 | researcher-3 | ADRs, fitness functions, drift management | **done** | outputs/adr-fitness-drift.md |
| T4 | researcher-4 | Governance models, trends, tooling | **done** | outputs/governance-trends.md |
| T5 | lead | Synthesize into final report | **done** | papers/software-architecture-paradigms.md |
| T6 | lead | Generate PDF | **done** | papers/software-architecture-paradigms.pdf |

## Verification Log
| Item | Method | Status | Evidence |
|---|---|---|---|
| ATAM origin and process | source cross-read (2 researchers) | **verified** | SEI/CMU publications, Wikipedia, practitioner guides |
| ADR history (Nygard 2011) | direct fetch of original post | **verified** | Cognitect blog post confirmed |
| Fitness function concept origin | source cross-read (2 researchers) | **verified** | Ford/Parsons/Kua 2017, O'Reilly |
| TOGAF framework details | direct fetch | **verified** | The Open Group publications |
| C4 model details | WebFetch of c4model.com | **verified** | Simon Brown's official site confirmed |
| Architectural drift definitions | source cross-read | **verified** | ACM 2020 paper, ResearchGate 2020 |
| matklad ARCHITECTURE.md | WebFetch | **verified** | Blog post confirmed, Feb 6, 2021 |
| Architecture Advice Process | WebFetch | **verified** | ThoughtWorks Radar Trial ring, April 2025 |
| Harmel-Law article | WebFetch | **verified** | martinfowler.com, December 15, 2021 |

## Decision Log
- **Round 1 sufficient:** All 4 researchers returned comprehensive results with strong source coverage. No second round needed.
- **Mermaid diagrams:** Included as code blocks in markdown; rendered as text in PDF (no client-side Mermaid renderer in Chromium headless). Acceptable tradeoff — diagrams are readable as graph definitions.
- **PDF generation:** Used Chromium headless --print-to-pdf. 431KB output, well-formatted.
