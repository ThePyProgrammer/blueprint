---
title: "System"
description: "System administration commands: the governance dashboard and self-diagnostic with auto-repair."
---

# System

These two commands provide visibility into the health and status of the ADR system itself.

---

### `/blueprint:status`: Governance Dashboard

The control room. Renders a terminal summary with ADR counts, governance health metrics, fitness coverage, and a text relationship graph, then generates and opens a self-contained HTML dashboard in your browser.

**Syntax:** `/blueprint:status`

**The HTML dashboard has four tabs:**

1. **Knowledge Graph:** Force-directed graph where nodes are ADRs colored by status, edges are relationships styled by type. Click to explore.
2. **Decision Timeline:** Chronological view of decisions, transitions, and supersessions.
3. **Governance Metrics:** Health scores with history sparklines.
4. **Decision Debt Table:** Deferred decisions ranked by debt score.

Zero external dependencies. Works offline.

**Examples:**

```
/blueprint:status
# Terminal summary + open HTML dashboard
```

!!! tip
    `status` is the first thing to check at the start of a session. It tells you what needs attention without running any analysis.

---

### `/blueprint:health`: Self-Diagnostic

`fsck` for your ADR system. Validates internal consistency across 8 dimensions and offers auto-repair for fixable issues.

**Syntax:** `/blueprint:health`

**What it checks:**

1. **Directory structure:** ADR directory exists and is properly organized
2. **Index-to-file sync:** Every ADR file has a matching index entry and vice versa
3. **ADR content completeness:** Required sections present (Context, Decision, Consequences)
4. **Supersession chain integrity:** Bidirectional links, no cycles
5. **Relationship graph consistency:** No orphaned nodes, no self-references
6. **Config freshness:** State and relationship files are valid and current
7. **Cross-reference validity:** ADRs reference valid ADR numbers
8. **Staleness:** ADRs older than 12 months without review

**Examples:**

```
/blueprint:health
# "8/8 checks passed. System is healthy."

/blueprint:health
# "6/8 checks passed. 2 issues found:
#  [FIXABLE] ADR-0003 superseded by ADR-0012, but ADR-0012 doesn't reference ADR-0003
#  [FIXABLE] relationships.toml has orphan edge referencing deleted ADR-0005
#  Run auto-repair? (y/n)"
```

!!! tip
    Run `health` after any manual edits to ADR files, after git rebases that touch the ADR directory, or after upgrading Blueprint versions.
