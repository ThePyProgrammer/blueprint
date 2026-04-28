---
name: blueprint:audit
description: >
  Verify the codebase actually follows accepted ADRs. Scans code for compliance evidence and
  violations against each accepted decision. Use when: "audit adrs", "are we following our
  decisions?", "check adr compliance", "compliance audit". Optionally audit a single ADR
  with "/blueprint:audit N".
---

# Compliance Audit

Scans the codebase to verify accepted ADRs are actually being followed. Produces a
per-ADR compliance verdict with evidence.

## Shared Context

Read from parent `adr/` skill directory:
- `config/lifecycle.toml` — to identify which statuses are "accepted" (auditable)
- `state.toml` — ADR directory, last audit date
- `agents/persona.md` — personality
- `agents/adr-compliance-auditor.md` — agent instructions

## Process

1. **Spawn compliance auditor:**
   - Read `agents/adr-compliance-auditor.md` and `agents/persona.md`
   - Spawn `general-purpose` agent with:
     - ADR directory path
     - List of all ADR filenames
     - Specific ADR number if user specified one
     - Full agent instructions + persona
2. **Present compliance report** to the user
3. **For each violation, suggest remediation:**
   - Fix the code to comply with the ADR, OR
   - Create a new ADR via `/blueprint:new` to formally change the decision
4. **Update state:**
   - Set `last_audit` in `state.toml` to today

## Commit Convention

If violations lead to ADR changes: `docs(adr): [action] ADR-NNNN <title>`
