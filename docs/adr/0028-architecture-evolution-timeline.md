# ADR-0028: Narrative architecture evolution timeline with eras and pivot points

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0028                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

A project with 30 ADRs has a history, but the ADR directory does not tell that history. The files are numbered sequentially, and each records a single decision in isolation. Reading ADR-0001 through ADR-0030 in order provides facts but not narrative. You learn that ADR-0012 chose PostgreSQL and ADR-0023 superseded it with CockroachDB, but you do not learn why the project's data layer went through three iterations, what external pressure caused the pivot, or how the early decisions about deployment topology made the later database migration both necessary and painful.

Architecture evolves through eras. A typical project might have a "monolith era" (ADRs 1-8), a "scaling crisis era" (ADRs 9-15), and a "microservices migration era" (ADRs 16-30). Within each era, decisions cluster around a theme. Between eras, pivot points mark fundamental shifts in direction — usually triggered by a supersession, a production incident, or a business pivot. This narrative structure exists implicitly in every ADR corpus but is never made explicit.

New team members, architects joining mid-project, and teams conducting retrospectives all need to understand not just what was decided, but how the architecture evolved — what were the eras, where were the pivots, and what forces drove the transitions. This is the difference between reading a history book and reading a list of dates.

## Options Considered

### Option 1: Chronological list — facts without narrative

Present ADRs in date order with status annotations. "2025-01-15: ADR-0001 Accepted. 2025-01-20: ADR-0002 Accepted. 2025-06-01: ADR-0012 Superseded by ADR-0023." This is a changelog, not a timeline. It provides temporal ordering but no grouping, no thematic analysis, and no explanation of why decisions cluster or pivot. Useful for auditing, useless for understanding.

**Pros:** Simple to generate. Factually accurate. No interpretation required.

**Cons:** No narrative structure. No era identification. No pivot point analysis. Does not explain how decisions relate to each other across time. Reading 30 dated entries provides no more insight than reading the ADR directory listing.

### Option 2: Narrative with eras and pivot points — architecture as story

Generate a narrative timeline that groups decisions into thematic eras, identifies pivot points where the architecture's direction changed, and explains the forces that drove transitions between eras. The timeline reads as a story: "The Monolith Era (ADRs 1-8): the team optimized for speed to market, choosing a single deployment unit with shared database. The Scaling Crisis (ADRs 9-15): as traffic grew, the monolith's database became a bottleneck, triggering a series of decisions about caching, read replicas, and eventual consistency. The pivot came with ADR-0012's supersession: the team recognized that vertical scaling had reached its limit and committed to service decomposition."

**Pros:** Provides understanding, not just information. Eras make the decision corpus digestible. Pivot points highlight the most consequential moments. New team members can read the timeline to understand architectural history in 10 minutes rather than reading 30 individual ADRs.

**Cons:** Narrative construction requires interpretation. Era boundaries are subjective. The generated narrative may impose a story that does not match the team's lived experience.

### Option 3: Visual graph diagram — visual but tool-dependent

Generate a visual dependency/timeline graph (Mermaid, Graphviz) showing ADRs as nodes with edges for relationships (supersedes, depends-on, related-to) arranged chronologically. Visually compelling and useful for identifying clusters and dependencies, but visual graphs do not explain why clusters exist or what forces drove transitions. The graph shows structure; the narrative explains meaning.

**Pros:** Visual clarity for relationship patterns. Good for identifying dependency clusters. Can be embedded in documentation.

**Cons:** Does not explain the narrative. Visual complexity increases rapidly with ADR count. Requires rendering tools. Supplementary to narrative, not a replacement.

## Decision

**We generate a narrative timeline showing how decisions evolved over time, grouped into eras, with pivot points at supersessions**, because architecture has a story — and a list of dates is not a story, it is a log file.

## Rationale

- Eras emerge naturally from ADR clustering. Decisions made in the same period about the same architectural concern (data layer, deployment, communication patterns) form natural groups. Identifying these groups and naming the eras makes the decision corpus navigable.
- Pivot points are the most important moments in architectural history. They mark where the team changed direction — usually because reality invalidated an earlier assumption. Supersessions are the clearest pivot markers: when ADR-N supersedes ADR-M, something fundamental changed.
- The narrative format is optimized for human comprehension. People understand stories better than lists. A narrative timeline of architectural evolution serves the same purpose as a project postmortem — it extracts lessons and provides context that raw data cannot.
- Blueprint has the data to construct narratives: ADR dates, statuses, relationships (especially supersedes), and context sections that explain the forces behind each decision. The relationship graph (ADR-0010) provides the structural connections. The narrative adds the temporal and causal interpretation.
- The timeline complements, not replaces, individual ADRs. ADRs provide depth on each decision. The timeline provides breadth across the decision corpus. Together they give both the forest and the trees.

## Consequences

### Positive

- New team members can understand the project's architectural history in minutes rather than hours. The timeline provides the context that individual ADRs assume.
- Pivot points are explicitly identified and explained, making it clear where and why the architecture changed direction. This prevents teams from repeating the conditions that caused previous pivots.
- Era grouping makes large ADR corpora manageable. A project with 50 ADRs grouped into 5 eras is navigable; 50 ungrouped ADRs are not.
- The narrative serves as institutional memory. When the original architects leave, the timeline preserves not just their decisions but the story of how those decisions evolved.

### Negative

- Narrative generation involves interpretation. Era boundaries and pivot point significance are judgment calls that may not match every team member's perspective.
- The narrative may oversimplify complex decision histories. Real architectural evolution is messy; narratives impose order that may not exist.
- Generated narratives require review. An inaccurate narrative is worse than no narrative because it creates false institutional memory.

### Risks

- Narrative bias: the generated timeline may impose a coherent story on what was actually a series of ad-hoc reactions. Mitigation: the timeline explicitly notes where decision clustering appears intentional vs. reactive, and flags eras with high decision density as potential crisis periods.
- Staleness: the timeline must be regenerated as new ADRs are added. A timeline that stops at ADR-20 when the project is on ADR-30 is misleading. Mitigation: the timeline includes a generation timestamp and the ADR range it covers.
- Over-reliance: teams may treat the timeline as the authoritative history, skipping the individual ADRs. Mitigation: the timeline links to each referenced ADR and explicitly states that it is a summary, not a replacement.

## References

- ADR-0004: Encode lifecycle as state machine
- ADR-0010: Use relationship graph for impact analysis
- ADR-0013: Infer ownership from git history
- ADR-0024: Temporal drift detection over point audits
