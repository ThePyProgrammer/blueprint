---
name: blueprint:tradeoff
description: >
  Generate ATAM-style quality attribute utility trees and tradeoff analysis from accepted ADRs.
  Identifies sensitivity points, tradeoff points, risks, and non-risks. Use when: "tradeoff analysis",
  "quality attributes", "utility tree", "sensitivity points", "where are the tradeoffs?",
  "which decisions conflict?", "ATAM analysis".
  Examples: "/blueprint:tradeoff", "/blueprint:tradeoff --focus performance".
---

# ATAM Tradeoff Analysis

Generate quality attribute utility trees and identify tradeoff points across accepted ADRs.
Brings ATAM's most valuable outputs — sensitivity points, tradeoff points, risk identification —
without the 3-4 day ceremony. Based on ATAM (SEI/CMU, 1998).

## Shared Context

Read from parent `adr/` skill directory:
- `state.toml` — ADR directory location
- `relationships.toml` — ADR dependency graph
- `contexts.toml` — bounded context assignments
- `agents/persona.md` — your personality

## Process

1. **Read `agents/adr-tradeoff-analyzer.md`** from parent skill directory
2. **Spawn a `blueprint:adr-tradeoff-analyzer` agent** with:
   - Full agent instructions + `agents/persona.md`
   - All accepted ADR contents
   - `relationships.toml` content
   - Optional: `--focus <quality>` to prioritize one attribute
   - Project root path
3. **Present the tradeoff analysis** to the user
4. **Based on findings:**
   - **High-risk tradeoffs:** Suggest `/blueprint:challenge` on the relevant ADRs
   - **Missing quality attributes:** Suggest new ADRs to cover gaps
   - **Unresolved conflicts:** Highlight and ask for user guidance
5. **Update `state.toml`** — set `last_tradeoff_analysis` to today

## Quality Attributes Tracked

Performance, Scalability, Security, Modifiability, Availability, Testability,
Operability, Cost. Extensible via `config/taxonomy.toml`.
