# Dashboard Bugs

Issues found in `docs/adr/web/index.html` after wireframe integration.
**Status: All addressed in `assets/dashboard.html` template rewrite (2026-03-30).**

## Graph

- [x] **Nodes not draggable** — Fixed: mousedown/move/up drag handlers with live edge redraw.
- [x] **Edges not directed** — Fixed: SVG marker-end arrowheads per relationship type.
- [x] **Relationships not labeled** — Fixed: text labels on each edge showing relationship type.

## Top Bar

- [x] **Query Nodes search doesn't work** — Fixed: filters ADRs by number/title/category/status with overlay results.
- [x] **Notifications button has no panel** — Fixed: dropdown showing recent governance events.
- [x] **Settings button has no panel** — Fixed: dropdown with quick-copy links to /blueprint:hooks, /blueprint:fitness, /blueprint:guard.

## Status View

- [x] **Graph not responsive to screen size** — Fixed: ResizeObserver triggers re-render on container resize.
- [x] **Graph nodes don't auto-fit** — Fixed: nodes placed in circular layout scaled to min(W,H)*0.3, centering force in simulation.

## Sidebar

- [x] **Blueprint icon misaligned** — Fixed: icon-box uses flex-shrink:0 and margin-top:2px, sidebar-brand uses items-start alignment.
- [x] **Active tab loses JetBrains Mono** — Fixed: all nav items use font-mono consistently, active state only adds color/border/background.

## Missing Views

- [x] **Audit view not present** — Fixed: full Audit view with operation recency, decision registry, fitness function monitor cards, and governance event log.
- [x] **IDE/Editor view not present** — Deferred: not part of /blueprint:status scope (requires separate editor implementation).

## Priority

~~Fix order: nav font -> icon alignment -> draggable nodes -> directed edges -> responsive graph -> missing views -> search -> notification/settings panels.~~
All items resolved except IDE/Editor view (architectural scope beyond dashboard).
