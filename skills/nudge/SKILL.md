---
name: blueprint:nudge
description: >
  Periodic health nudge — checks project governance timestamps in state.toml and surfaces
  reminders for overdue operations. Use when: "nudge", "what governance checks are overdue?",
  "health nudge", "what should I run?", "governance reminders", or triggered automatically
  via the SessionStart hook roughly every 20 sessions.
---

# Periodic Health Nudge

Checks governance operation timestamps and surfaces a prioritized reminder list for
anything overdue. The quiet voice that says "hey, you haven't checked X in a while."

## Shared Context

Read from parent `blueprint/` skill directory:
- `state.toml` — last operation timestamps (Config Resolution Protocol: check `config/` then `{adr_directory}/.state/`)
- `config/lifecycle.toml` — valid statuses (for Deferred ADR check)
- `relationships.toml` — ADR graph

## Process

### Step 1: Resolve Config and Read State

1. Locate `state.toml` via Config Resolution Protocol:
   - Check `config/state.toml` in the blueprint skill directory
   - Fall back to `{adr_directory}/.state/state.toml`
2. Read `[last_operations]` section — extract all timestamps
3. Parse each timestamp as a date (empty string = never run)
4. Compute days since each operation relative to today

### Step 2: Locate ADR Directory

Auto-detect adr_directory from `state.toml` or scan for:
`docs/adr/` → `docs/decisions/` → `adr/` → `decisions/`

### Step 3: Apply Nudge Rules

Evaluate each rule against the timestamps. A rule fires if the operation was never run
(timestamp is empty) or exceeds its staleness threshold.

| Rule | Operation Key | Threshold | Nudge Message |
|------|--------------|-----------|---------------|
| Evidence audit stale | `last_evidence_audit` | >90 days | "Evidence may be stale. Run `/blueprint:evidence`" |
| Compliance audit stale | `last_audit` | >60 days | "Run `/blueprint:audit` to verify ADRs are followed" |
| Architecture evaluation stale | `last_evaluation` | >90 days | "Run `/blueprint:evaluate` for a health check" |
| Drift check stale | `last_drift` | >30 days | "Run `/blueprint:drift` to check erosion trajectory" |
| Risk assessment stale | `last_risk_assessment` | >90 days | "Run `/blueprint:risk` to update the risk heat map" |
| Reflexion model stale | `last_reflect` | >60 days | "Run `/blueprint:reflect` for conformance check" |
| Strategic map stale | `last_strategic_map` | >180 days | "Run `/blueprint:map` to check strategic alignment" |
| Deferred ADRs aging | (scan ADR files) | >6 months deferred | "Deferred decisions aging. Run `/blueprint:debt`" |
| No fitness functions | (check for fitness test files) | existence check | "Run `/blueprint:fitness` to generate architecture tests" |
| ARCHITECTURE.md stale | (check file mtime) | >6 months old | "Run `/blueprint:architect` to refresh the codemap" |

### Step 4: Check for Deferred ADR Aging

1. Read all ADR files in the ADR directory
2. Find any with status `Deferred`
3. Check the `Date proposed` or `Date deferred` field
4. If any Deferred ADR is older than 6 months, fire the deferred nudge rule

### Step 5: Check for Fitness Functions

1. Look for fitness function test files (typically in `tests/fitness/`, `test/fitness/`,
   or referenced in `state.toml` under `last_trace`)
2. If no fitness function files exist at all, fire the fitness nudge rule

### Step 6: Check ARCHITECTURE.md Staleness

1. Look for `docs/ARCHITECTURE.md` or `ARCHITECTURE.md` in the project root
2. If it does not exist, fire the architecture nudge
3. If it exists, check its last modification date via git log:
   ```bash
   git log -1 --format="%ai" -- docs/ARCHITECTURE.md ARCHITECTURE.md 2>/dev/null
   ```
4. If older than 6 months, fire the architecture nudge

### Step 7: Display Results

Sort all fired nudges by staleness (most overdue first — "never run" operations sort
to the top, then by days overdue descending).

Display as a prioritized checklist:

```
## Governance Nudges

[ ] Evidence audit: never run — "Evidence may be stale. Run /blueprint:evidence"
[ ] Architecture evaluation: 142 days overdue — "Run /blueprint:evaluate for a health check"
[ ] Compliance audit: 73 days overdue — "Run /blueprint:audit to verify ADRs are followed"
[ ] Drift check: 45 days overdue — "Run /blueprint:drift to check erosion trajectory"
```

If **no rules fire**, output:

```
All governance checks are current.
```

### Step 8: Update State

Set `last_nudge` in `state.toml` `[last_operations]` to today's date (`YYYY-MM-DD`).

## Hook Integration

This skill can be triggered:
- **Manually:** `/blueprint:nudge`
- **Automatically:** Via the `SessionStart` hook (roughly every 20 sessions)
- **From other skills:** Any skill can suggest running `/blueprint:nudge` when it detects staleness

## Output Format

- Terminal: markdown checklist as shown above
- Keep output concise — this is a nudge, not a full report
- Each nudge line should include: the check name, how overdue it is, and the command to run
- Never block the user — nudges are suggestions, not gates
