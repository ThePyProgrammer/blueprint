# ADR-0032: Visual knowledge graph dashboard for architecture governance status

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0032                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint accumulates architectural decisions over time. As the ADR corpus grows past a dozen entries, understanding the state of architecture governance becomes non-trivial. How many decisions are accepted? How many are proposed and awaiting review? Which ADRs supersede others? Where is decision debt accumulating? What is the relationship topology between decisions? These questions cannot be answered by listing ADR files — the information exists but is scattered across individual documents.

A text listing (ADR-0018's contextual list output) provides a flat view: number, title, status. This is sufficient for finding a specific ADR but insufficient for understanding the governance landscape. The relationships between ADRs — which decisions depend on, extend, contradict, or supersede others — form a graph. Graphs are poorly conveyed as text lists. The temporal dimension (when decisions were made, how long proposed ADRs have been waiting, which eras of the project produced the most architectural activity) is invisible in a flat listing.

The status command needs to convey three things simultaneously: a quick textual summary for terminal workflows, a visual relationship graph for understanding decision topology, and governance health metrics for identifying systemic issues (staleness, debt, orphaned decisions). No single output format serves all three needs well.

## Options Considered

### Option 1: Terminal-only text dashboard — simple and universal

Print a structured text summary to the terminal: ADR counts by status, recent decisions, decision debt score, and a list of flagged issues. This works everywhere, requires no browser, and integrates naturally into scripted workflows. The output can be piped, grepped, and logged.

**Pros:** Universal compatibility. No external dependencies. Fast to render. Works in CI, SSH sessions, and headless environments. Output is greppable and scriptable.

**Cons:** Cannot effectively convey relationship graphs — text representations of graphs (ASCII art, adjacency lists) are unreadable past 10 nodes. Cannot show temporal trends (sparklines in terminal are fragile and font-dependent). Misses the opportunity to provide the kind of at-a-glance understanding that visual dashboards excel at.

### Option 2: Dual-mode with generated interactive HTML — terminal summary plus visual dashboard

The status command always prints a terminal text summary (counts, debt score, flagged issues). Additionally, it generates a self-contained HTML file and opens it in the default browser. The HTML contains a force-directed knowledge graph of ADR relationships (nodes are ADRs, edges are relationships like "supersedes," "extends," "depends on"), a decision timeline showing when ADRs were proposed and decided, governance metrics with inline sparklines, and a decision debt table with age and trigger status. The HTML file uses zero external dependencies — no D3.js, no CDN links, no npm packages. All JavaScript and CSS is inlined. The file is a single portable artifact that works offline.

**Pros:** Best of both worlds — fast terminal output for quick checks, rich visual dashboard for deep understanding. The force-directed graph makes relationship topology immediately comprehensible. Self-contained HTML means no build step, no server, no network dependency. The file can be shared, archived, or committed. Terminal output preserves scriptability.

**Cons:** Generating HTML adds complexity to the status command. The HTML rendering of force-directed graphs without D3 requires a custom physics simulation (simple but non-trivial). Browser opening may not work in headless/CI environments (but the terminal summary still works). The generated HTML file needs a location (temp directory or docs directory).

### Option 3: Persistent web server dashboard — always-on monitoring

Run a local web server (e.g., on port 3000) that serves a live dashboard. The dashboard auto-refreshes as ADRs change, provides real-time governance metrics, and supports interactive exploration of the ADR graph. This is the most powerful option for teams that want continuous architectural visibility.

**Pros:** Real-time updates. Rich interactivity (filtering, searching, zooming). Could support collaborative features (commenting on ADRs from the dashboard). Most powerful visualization capabilities.

**Cons:** A persistent server is operationally heavy for a governance tool. Requires port management, process lifecycle management, and adds a daemon to the developer's environment. Overkill for a tool that is consulted occasionally, not continuously. Conflicts with the philosophy of blueprint as a lightweight, embedded tool rather than a separate application. Introduces network dependencies and potential security surface.

## Decision

**We render a dual-mode governance dashboard — terminal text summary always, plus an interactive HTML file opened in the browser**, because the relationship topology between ADRs is a graph that demands visual representation, governance health is best conveyed through metrics with sparklines and trend indicators, and a self-contained HTML file with zero external dependencies provides rich visualization without adding operational burden.

## Rationale

- The ADR relationship graph is the most valuable and least accessible piece of governance information. Which decisions build on others, which supersede previous choices, where dependency chains create fragility — these are graph properties that are immediately visible in a force-directed layout and nearly invisible in a text list.
- Terminal output remains essential. Many developers check status from the terminal, in CI logs, or over SSH. The text summary must always print, regardless of whether the HTML dashboard opens successfully. The terminal output is the minimum viable status; the HTML is the enriched view.
- Zero external dependencies in the HTML is a hard constraint. A single HTML file that works when double-clicked from a file manager, with no network access, is maximally portable. CDN-dependent dashboards break in air-gapped environments, on planes, and when CDNs change URLs. Inlining everything (a simple canvas-based force simulation, inline CSS, inline SVG sparklines) keeps the file self-contained and permanent.
- A persistent web server (Option 3) solves a problem that does not exist. Architecture governance is consulted at decision points, not monitored continuously. The overhead of running and managing a server process is disproportionate to the frequency of use. A generated HTML file provides comparable visualization with zero operational cost.
- The decision timeline provides temporal context that raw ADR metadata does not. Seeing that 12 ADRs were decided in March and none in April tells a story about architectural activity cadence. Seeing that a proposed ADR has been pending for 45 days tells a story about decision bottlenecks. These insights emerge from visual presentation of temporal data.

## Consequences

### Positive

- Teams can see the full relationship topology of their architectural decisions at a glance. Clusters of tightly related ADRs, isolated decisions, and supersession chains become immediately visible.
- Governance metrics (decision debt score, staleness indicators, coverage gaps) are surfaced proactively rather than requiring manual investigation.
- The self-contained HTML file can be committed to the repository, attached to status reports, or shared with stakeholders who do not have CLI access.
- Terminal output preserves existing workflows. Developers who never open the HTML still get a useful summary.

### Negative

- The HTML generation adds code complexity to the status command. A canvas-based force simulation, even a simple one, requires physics calculations (spring forces, repulsion, damping) that are outside the core domain of ADR management.
- The HTML file needs a storage location. Writing to a temp directory means the file is ephemeral; writing to the docs directory means it may be committed accidentally. The choice of location requires a convention.
- Browser auto-opening is environment-dependent. On macOS it uses `open`, on Linux `xdg-open`, on WSL it may fail entirely. Graceful fallback (print the file path if the browser cannot be opened) is necessary.

### Risks

- Stale dashboard: if a developer opens the HTML file days after generation, the data is stale but looks authoritative. Mitigation: the HTML includes a prominent generation timestamp and a note that it reflects a point-in-time snapshot.
- Over-investment in visualization: the dashboard could become a feature sink where effort goes into making the graph prettier rather than improving governance substance. Mitigation: the visualization serves the data, not the other way around. If the terminal summary conveys the same information, the HTML visualization is not needed.
- Accessibility: the force-directed graph is inherently visual. Screen readers cannot interpret it. Mitigation: the terminal text summary contains all the same information in accessible form. The HTML graph is an enhancement, not the sole representation.

## References

- ADR-0010: Use relationship graph for impact analysis
- ADR-0025: Track decision debt with trigger monitoring
- ADR-0028: Architecture evolution timeline
- ADR-0018: Contextual suggestions in help and list
- ADR-0004: Encode lifecycle as state machine
