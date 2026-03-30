---
name: blueprint:drift
description: >
  Detect gradual architectural drift by comparing codebase evolution against ADR expectations
  over time. Not a point-in-time audit but a trajectory analysis. Use when: "check for drift",
  "is the architecture eroding?", "drift analysis", "architecture trajectory", "are we
  drifting from our decisions?", or periodically as a health check.
---

# Architecture Drift Detection

Detects gradual architectural erosion — the kind where every individual commit is fine
but the aggregate trajectory moves away from the architecture. The building inspector
who compares photographs six months apart.

## Shared Context

Read from parent `blueprint/` skill directory:
- `config/state.toml` — ADR directory, last operations
- `config/relationships.toml` — ADR dependency graph
- `agents/persona.md` — personality

## Process

### Step 1: Establish the Baseline

Read all accepted ADRs and extract what the architecture *should* look like:
- Module boundaries and their responsibilities
- Dependency direction rules
- Technology constraints
- Pattern expectations

Read `docs/ARCHITECTURE.md` if it exists for the canonical map.

### Step 2: Analyze Git History for Trajectory

Examine recent git history (configurable, default: last 3 months):

```bash
# File churn — which areas change most?
git log --since="3 months ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -30

# Cross-boundary commits — changes that touch multiple modules simultaneously
git log --since="3 months ago" --name-only --pretty=format:"---COMMIT---" | ...

# New files — where is the codebase growing?
git log --since="3 months ago" --diff-filter=A --name-only --pretty=format: | sort | uniq -c | sort -rn

# Deleted files — where is it shrinking?
git log --since="3 months ago" --diff-filter=D --name-only --pretty=format:
```

### Step 3: Detect Drift Patterns

For each accepted ADR, check if recent changes are moving toward or away from it:

**Boundary erosion:** Module A was self-contained 3 months ago. Now it imports from
3 new modules. The boundary is dissolving.

**Responsibility creep:** A module that ADR-NNNN defines as "handles X" now also
does Y and Z. Functions and files are accumulating outside the original scope.

**Technology sprawl:** ADR says "use PostgreSQL." New code includes SQLite imports,
a Redis client, and a JSON file database. The single-technology decision is fragmenting.

**Pattern divergence:** ADR says "two-stage pipeline." Recent commits add a shortcut
path that bypasses stage 1. The pattern is being undermined.

**Dependency inversion:** ADR says "services depend on repositories, not vice versa."
Recent imports show repositories importing from services.

### Step 4: Quantify Drift

For each detected drift:

- **Direction:** Drifting TOWARD or AWAY from the ADR's intent
- **Velocity:** How fast — number of drift-contributing commits per month
- **Severity:** LOW (cosmetic), MEDIUM (architectural tension), HIGH (invariant violated)
- **Reversibility:** Easy (rename/move), Moderate (refactor), Hard (rewrite)

### Step 5: Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► DRIFT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Period: [start] — [end]
Overall trajectory: STABLE / DRIFTING / ERODING

| ADR | Decision | Drift | Velocity | Severity |
|-----|----------|-------|----------|----------|
| ... | ... | TOWARD/AWAY/STABLE | N commits/mo | H/M/L |

## Drift Details
[Per-ADR analysis with evidence]

## Recommendations
- [Highest-impact corrective actions]
- [ADRs that may need revision to match reality]
```

Suggest `/blueprint:rearchitect` for ADRs where reality has legitimately diverged
from the decision — sometimes the drift is correct and the ADR is wrong.
