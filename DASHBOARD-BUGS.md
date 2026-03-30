# Dashboard Bugs

Issues found in `docs/adr/web/index.html` after wireframe integration.

## Graph

- [ ] **Nodes not draggable** — Force-directed layout is static after initial render. Nodes should be draggable with mouse (mousedown → track → mouseup). Update positions and redraw edges on drag.
- [ ] **Edges not directed** — Lines have no arrowheads. Add SVG marker-end arrowheads to show dependency direction (DEPENDS_ON points from dependent to dependency).
- [ ] **Relationships not labeled** — Edge type (DEPENDS_ON, CONFLICTS, RELATED, etc.) not shown. Add text labels on edges or on hover.

## Top Bar

- [ ] **Query Nodes search doesn't work** — Input field is cosmetic. Wire it to filter ADRs by title/number/category and highlight matching graph nodes.
- [ ] **Notifications button has no panel** — Add a dropdown panel showing recent governance events (last audit, new ADRs, triggered deferrals).
- [ ] **Settings button has no panel** — Add a dropdown panel or link to `/blueprint:hooks` configuration.

## Status View

- [ ] **Graph not responsive to screen size** — SVG has fixed height `h-64`. Should use `calc(100% - header)` or resize observer to fill available space.
- [ ] **Graph nodes don't auto-fit** — When there are few nodes they cluster in center. When many, they overlap edges. Need zoom-to-fit after layout.

## Sidebar

- [ ] **Blueprint icon misaligned** — The architecture icon vertically aligns with title+subtitle combined. Should align center with just the "Blueprint" title text. Fix: `items-start` on the icon, or adjust padding.
- [ ] **Active tab loses JetBrains Mono** — When a nav item becomes active, it switches from `font-mono` (JetBrains Mono) to `font-label` (Space Grotesk). All nav items should stay `font-mono` regardless of active state. Fix: change `nav-active` class to keep `font-mono`.

## Missing Views

- [ ] **Audit view not present** — Wireframe `wireframes/governance_health/code.html` shows a full audit view with decision debt table, arch drift chart, fitness function monitor cards, and governance event log. Currently only a simplified "Health" view exists.
- [ ] **IDE/Editor view not present** — Wireframe `wireframes/adr_editor_ide/code.html` shows an ADR editor with markdown preview, metadata form, and relationship picker. Not implemented at all.

## Priority

Fix order: nav font → icon alignment → draggable nodes → directed edges → responsive graph → missing views → search → notification/settings panels.
