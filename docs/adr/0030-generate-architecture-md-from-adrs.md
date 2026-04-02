# ADR-0030: Generate ARCHITECTURE.md as bird's-eye codemap from ADRs

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0030                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

A developer joins a project with 50,000 lines of code and 25 accepted ADRs. They need to answer two questions quickly: "where is everything?" and "why is it organized this way?" The ADR corpus answers the second question well; each ADR explains a decision and its rationale. But ADRs do not answer the first question. They do not tell you that `src/adapters/` contains all external service integrations, that `src/core/` is the domain layer that must not import from `src/adapters/`, or that `src/api/routes/` maps 1:1 with the REST endpoints documented in the OpenAPI spec.

matklad (the developer behind rust-analyzer) articulated this problem clearly: every project needs an `ARCHITECTURE.md` that provides a bird's-eye view of the codebase: a codemap that tells you what each top-level directory does, what the major modules are, where the important entry points live, and what invariants govern the code's organization. This document answers WHERE. ADRs answer WHY. Both are necessary; neither is sufficient alone.

Currently, blueprint generates and maintains ADRs but does not produce an `ARCHITECTURE.md`. Teams that want a codemap must write it manually. This manual document quickly drifts from reality as the codebase evolves. More importantly, the ADR corpus already contains the invariants that should appear in `ARCHITECTURE.md`: layering rules, module boundaries, naming conventions, dependency constraints. The information exists; it is just not assembled into the right format.

## Options Considered

### Option 1: Single combined document, ADRs and codemap in one

Merge architectural decisions and codebase mapping into a single document. Each section describes a part of the codebase and includes the relevant decisions inline. This avoids maintaining two documents but produces a large, unwieldy file that is hard to navigate. A developer looking for "where is the authentication code?" must wade through decision rationale to find the answer. A reviewer looking for "why do we use JWT?" must scan through directory listings to find the reasoning.

**Pros:** Single source of truth. No cross-referencing required. All information in one place.

**Cons:** Conflates two different information needs (WHERE vs. WHY). Document becomes too large to be useful. Navigation is difficult. Updates require editing a single large file rather than targeted ADR edits.

### Option 2: Two-layer system, ARCHITECTURE.md answers WHERE, ADRs answer WHY

Generate `docs/ARCHITECTURE.md` as a bird's-eye codemap: top-level directory descriptions, module responsibilities, layer boundaries, key entry points, and cross-cutting concerns. Invariants in `ARCHITECTURE.md` are derived from accepted ADRs and link back to their source ADR for rationale. `ARCHITECTURE.md` is the map; ADRs are the explanations. The codemap is generated from a combination of directory scanning (what exists), ADR invariants (what the rules are), and relationship analysis (how modules connect).

**Pros:** Each document has a clear purpose and audience. `ARCHITECTURE.md` is concise and navigable, optimized for "where is X?" questions. ADRs remain the authoritative source for decision rationale. Invariants in `ARCHITECTURE.md` are traceable to the ADRs that established them.

**Cons:** Two documents to maintain (though `ARCHITECTURE.md` is generated, not hand-written). Cross-references between documents must be kept consistent. Generation logic must understand both code structure and ADR content.

### Option 3: Wiki-style documentation, flexible but unmaintained

Use a wiki (GitHub Wiki, Notion, Confluence) for codebase documentation. Flexible, searchable, supports rich media. But wikis are where documentation goes to die. They are not versioned with the code, they drift immediately after writing, and they are not enforceable. A wiki page that says "controllers must not access the database" has no mechanism to detect or prevent violations. Wiki documentation is supplementary at best and misleading at worst.

**Pros:** Rich formatting. Collaborative editing. Searchable. Supports diagrams and embedded media.

**Cons:** Not versioned with code. Drifts immediately. Not enforceable. Not discoverable from the repository. Maintenance requires separate process.

## Decision

**We generate `docs/ARCHITECTURE.md` following matklad's philosophy, a bird's-eye codemap with invariants derived from ADRs**, because ARCHITECTURE.md answers WHERE, ADRs answer WHY, and a developer needs both: a two-layer documentation system where the map is generated from the decisions that shaped the territory.

## Rationale

- The WHERE/WHY separation matches how developers actually seek information. When onboarding, they first need to know where things are (ARCHITECTURE.md). When understanding a specific design choice, they need to know why (ADRs). Combining these into one document forces every reader to filter for their current need.
- Generation from ADRs and code structure keeps ARCHITECTURE.md synchronized. When a new ADR is accepted that changes a layering rule, regenerating ARCHITECTURE.md picks up the change. When a new module is added to the codebase, regeneration includes it in the codemap.
- matklad's philosophy emphasizes that ARCHITECTURE.md should be short, high-level, and focused on structure, not a comprehensive design document. This aligns with blueprint's approach: ARCHITECTURE.md provides the 5-minute overview, ADRs provide the depth.
- Invariants in ARCHITECTURE.md link to their governing ADRs, creating traceability. A reader who sees "the `core/` module must not import from `adapters/`" can follow the link to the ADR that explains why this constraint exists.
- The generated document is a Markdown file in the repository, versioned with the code. It is discoverable (GitHub renders it), diffable (changes are visible in PRs), and reviewable (team members can flag inaccuracies).

## Consequences

### Positive

- New team members have a concise entry point to the codebase. ARCHITECTURE.md provides the bird's-eye view that README.md typically omits and that ADRs are too granular to provide.
- Invariants from ADRs are surfaced in context, next to the modules they govern, not in a separate decision document. A developer reading about the `controllers/` directory sees the invariant "controllers must not contain business logic (ADR-0006)" right there.
- Generation keeps the document current. Manual ARCHITECTURE.md files decay; generated ones are refreshed on demand.
- The two-layer system creates natural depth: skim ARCHITECTURE.md for orientation, dive into ADRs for rationale. This matches the progressive disclosure pattern.

### Negative

- Generated ARCHITECTURE.md may not capture project-specific nuances that a hand-written document would include. Teams may need to supplement the generated content.
- The generation process must understand both code structure (directories, modules, entry points) and ADR content (invariants, scope). This dual analysis adds complexity.
- Teams accustomed to hand-writing ARCHITECTURE.md may resist a generated version that does not match their expectations.

### Risks

- Over-generation: producing an ARCHITECTURE.md that is too detailed defeats the purpose of a bird's-eye view. Mitigation: the generator follows matklad's principle: one sentence per module, focus on structure, omit implementation details. Length is capped.
- Stale references: if ARCHITECTURE.md references ADRs that have been superseded, the links become misleading. Mitigation: generation resolves supersession chains. If ADR-0005 was superseded by ADR-0015, ARCHITECTURE.md links to ADR-0015.
- Format fragility: teams that customize the generated ARCHITECTURE.md will lose their changes on regeneration. Mitigation: the generator supports a merge mode that preserves manually added sections while updating generated sections. Manual sections are marked with delimiters.

## References

- matklad, "ARCHITECTURE.md" (2020): https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
- ADR-0002: Decompose into focused sub-skills
- ADR-0010: Use relationship graph for impact analysis
- ADR-0022: Design config layer as a domain-specific language
