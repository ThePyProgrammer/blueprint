---
name: blueprint:trace
description: >
  Show the ADR-to-fitness-function traceability matrix. Reveals which accepted ADRs have
  fitness function enforcement, which don't (governance gaps), and the pass/fail status of
  each function. Use when: "trace fitness", "which adrs are enforced?", "governance coverage",
  "fitness matrix", "traceability", "enforcement gaps".
  Examples: "/blueprint:trace", "/blueprint:trace ADR-0005".
---

# ADR-to-Fitness-Function Traceability

Display the traceability matrix showing how accepted ADRs map to fitness functions.
The critical bridge: "A decision record documents the decision. A fitness function
assures the decision." Most teams only do the first. This command shows the gap.

## Shared Context

Read from parent `adr/` skill directory:
- `config/state.toml` — ADR directory location
- `config/taxonomy.toml` — fitness function categories
- `agents/persona.md` — your personality

## Process

1. **Read all accepted ADRs** from ADR directory
2. **Scan for fitness functions:**
   - Glob for test files matching architecture test patterns (`*.arch.test.*`, `*.fitness.*`)
   - Grep for ArchUnit/NetArchTest/dependency-cruiser rule definitions
   - Read any existing fitness function output from `/blueprint:fitness`
   - Check CI config for architecture-related test stages
3. **Build traceability matrix:**
   - For each accepted ADR, find fitness functions that reference or enforce it
   - Classify each fitness function by Ford/Parsons taxonomy:
     - **Scope:** Atomic (single attribute) / Holistic (multiple attributes)
     - **Cadence:** Triggered (on event) / Continual (always monitoring)
     - **Result:** Static (pass/fail) / Dynamic (adaptive threshold)
     - **Execution:** Automated (CI) / Manual (human verification)
4. **Identify gaps:**
   - ADRs with no fitness function = governance gap
   - ADRs with only manual fitness functions = automation gap
   - Fitness functions with no corresponding ADR = orphaned enforcement
5. **Display matrix:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADR-TO-FITNESS TRACEABILITY MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Coverage: [N]/[total] accepted ADRs have fitness functions ([%])

| ADR | Title | Fitness Functions | Type | Status |
|-----|-------|------------------|------|--------|
| 0003 | Use TOML for config | config-format.fitness.sh | Atomic/Triggered | ✓ Pass |
| 0004 | Lifecycle state machine | lifecycle-fsm.test.ts | Atomic/Triggered | ✓ Pass |
| 0006 | Thin router pattern | — | NONE | ⚠ Gap |
| 0007 | Five eval dimensions | agent-count.fitness.sh | Holistic/Triggered | ✗ Fail |

Gaps: [N] ADRs have no fitness function
Orphans: [N] fitness functions have no ADR
```

6. **For gaps, offer:** "Run `/blueprint:fitness` to generate missing fitness functions?"
7. **Update `config/state.toml`** — set `last_trace` to today

## Fitness Function Taxonomy (Ford/Parsons/Kua)

| Dimension | Type A | Type B |
|-----------|--------|--------|
| Scope | Atomic (single attribute) | Holistic (multiple attributes) |
| Cadence | Triggered (on event) | Continual (always monitoring) |
| Result | Static (pass/fail) | Dynamic (adaptive threshold) |
| Execution | Automated (CI pipeline) | Manual (human verification) |

## Integration with Other Commands

- `/blueprint:fitness` — generates the fitness functions this command traces
- `/blueprint:status` — dashboard shows governance coverage percentage
- `/blueprint:debt` — ADRs without fitness functions flagged as enforcement debt
- `/blueprint:guard` — pre-commit guard uses fitness functions identified here
