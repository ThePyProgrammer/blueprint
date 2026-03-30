---
name: blueprint:health
description: >
  Self-diagnostic for the blueprint ADR system. Checks internal consistency: broken
  supersession chains, index sync, orphaned references, missing relationship edges,
  stale config, template drift. Use when: "blueprint health", "check adr health",
  "validate adrs", "is the adr system consistent?", "health check", or when things
  seem off.
---

# Blueprint Health Check

Validates the ADR system's internal consistency and offers to repair issues found.
Think of it as fsck for your architecture decisions.

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — cached paths
- `config/lifecycle.toml` — valid statuses
- `config/relationships.toml` — graph to validate

## Process

### Step 1: Run All Checks

Execute these checks in order, collecting findings:

**1. ADR Directory Structure**
- [ ] ADR directory exists at detected path
- [ ] `template.md` exists
- [ ] `README.md` exists with index table
- [ ] File naming follows `NNNN-kebab-case.md` pattern
- [ ] Sequence numbers are contiguous (no gaps, no duplicates)

**2. Index Sync**
- [ ] Every ADR file has a corresponding row in README.md index
- [ ] Every index row points to an existing file
- [ ] Status in index matches status in the ADR file
- [ ] Dates in index match dates in the ADR file
- [ ] Index is sorted by ADR number

**3. ADR Content Validity**
- [ ] Every ADR has the required Metadata table (Status, Date proposed)
- [ ] Status is a valid value from `lifecycle.toml`
- [ ] Every ADR has Context, Options Considered, Decision, Consequences sections
- [ ] At least 2 options were considered (not just the chosen one)
- [ ] Consequences has both Positive and Negative subsections

**4. Supersession Chain Integrity**
- [ ] Every "Superseded by ADR-NNNN" points to a real ADR
- [ ] The target ADR has "Supersedes ADR-MMMM" pointing back (bidirectional)
- [ ] No circular supersession chains
- [ ] Superseded ADRs have status "Superseded"
- [ ] Superseding ADRs have status "Accepted" or "Proposed"

**5. Relationship Graph Consistency**
- [ ] Every node in `relationships.toml` corresponds to a real ADR file
- [ ] Every edge references existing nodes
- [ ] No duplicate edges
- [ ] Edge types are valid (from the edge_types definition)
- [ ] No self-referencing edges

**6. Config Freshness**
- [ ] `state.toml` adr_directory matches actual location
- [ ] `state.toml` timestamps are plausible (not in the future)
- [ ] `relationships.toml` has nodes for all existing ADRs
- [ ] `lifecycle.toml` statuses cover all statuses used in ADRs
- [ ] `taxonomy.toml` categories cover all categories used in ADRs

**7. Cross-Reference Integrity**
- [ ] ADRs that reference other ADRs (e.g., "see ADR-0003") point to real ADRs
- [ ] Referenced ADRs are not Rejected (referencing rejected decisions is suspicious)
- [ ] `docs/ARCHITECTURE.md` ADR references (if file exists) point to real ADRs

**8. Staleness Detection**
- [ ] No accepted ADR is older than 12 months without a review (flag as "consider revisiting")
- [ ] `docs/ARCHITECTURE.md` last updated within 6 months (if it exists)
- [ ] Deferred ADRs older than 6 months flagged as "may be forgotten"

### Step 2: Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► HEALTH CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Results

  | Check                    | Status | Issues |
  |--------------------------|--------|--------|
  | Directory structure      | ✓      | 0      |
  | Index sync               | ⚠      | 2      |
  | ADR content validity     | ✓      | 0      |
  | Supersession chains      | ✓      | 0      |
  | Relationship graph       | ⚠      | 3      |
  | Config freshness         | ✓      | 0      |
  | Cross-references         | ✓      | 0      |
  | Staleness                | ⚠      | 1      |

  Overall: 5 issues found (0 critical, 3 warnings, 2 info)

## Issues

  ⚠ INDEX-001: ADR-0029 status in index (Accepted) doesn't match
    file (Proposed). Fix: update index row.

  ⚠ INDEX-002: ADR-0031 missing from README.md index.
    Fix: add index row.

  ⚠ GRAPH-001: 12 ADRs have no nodes in relationships.toml.
    Fix: run /blueprint:impact on each to populate.

  ⚠ GRAPH-002: Edge ADR-0003 → ADR-0008 exists but reverse not declared.
    Fix: add bidirectional edge.

  ⚠ GRAPH-003: Node ADR-0099 in graph but no file exists.
    Fix: remove orphaned node.

  ℹ STALE-001: ADR-0001 accepted 8 months ago, never reviewed.
    Suggestion: revisit or confirm still valid.
```

### Step 3: Offer Repair

For each fixable issue, offer to repair automatically:

- Index sync issues → update README.md index
- Missing graph nodes → add nodes for all existing ADRs
- Orphaned graph nodes → remove nodes with no file
- Status mismatches → update index to match file (file is authoritative)
- Missing bidirectional edges → add the missing direction

Ask: "Fix [N] repairable issues?" (Yes / No / Let me pick)

### Step 4: Commit Repairs

If repairs were made:
`docs: repair ADR system health — [N] issues fixed`
