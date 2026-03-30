---
name: blueprint:guard
description: >
  Pre-commit architecture guard — checks if staged changes violate any accepted ADR invariant
  before committing. Fast, targeted check on just the files being changed. Use when: "guard
  this commit", "check before commit", "architecture guard", "pre-commit check", or configure
  as an automatic pre-commit hook.
---

# Pre-Commit Architecture Guard

Fast, targeted invariant check on staged files. Not a full audit — just "do these specific
changes violate any accepted ADR?"

Catches violations at the point of creation, not after the fact.

## Shared Context

Read from parent `blueprint/` skill directory:
- `{adr_directory}/.state/state.toml` — ADR directory
- `config/lifecycle.toml` — to identify accepted statuses

## Process

### Step 1: Identify Staged Changes

```bash
git diff --cached --name-only
git diff --cached --stat
```

If nothing is staged, check unstaged changes instead and note the difference.

### Step 2: Map Changes to ADRs

For each changed file, determine which ADRs govern it:

- Read all accepted ADRs
- Match changed file paths against ADR scopes:
  - ADR about database → governs files in `models/`, `repositories/`, `migrations/`
  - ADR about API design → governs files in `api/`, `routes/`, `handlers/`
  - ADR about testing → governs files in `tests/`
  - ADR about architecture patterns → governs files matching the pattern's scope

If no ADRs govern the changed files, report "No architectural constraints apply to
these changes" and exit.

### Step 3: Fast Invariant Check

For each relevant ADR, check the diff (not the whole codebase) for violations:

- **Dependency direction:** Does the diff add an import that violates the rule?
- **Technology constraint:** Does the diff introduce a forbidden technology?
- **Pattern enforcement:** Does the diff bypass a required pattern?
- **Naming convention:** Does the diff introduce inconsistent naming?

Read only the diff, not the entire file. This must be fast — under 10 seconds
for a typical commit.

### Step 4: Report

**No violations:**
```
✓ Guard passed — [N] ADRs checked against [M] changed files
```

**Violations found:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► GUARD: VIOLATIONS FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| File | ADR | Violation |
|------|-----|-----------|
| [file] | ADR-NNNN | [what the diff does wrong] |

Fix these before committing, or run /blueprint:new to formally
change the decision if the violation is intentional.
```

## Hook Integration

To run automatically before every commit, suggest the user add a hook:

```bash
# .git/hooks/pre-commit or via settings.json hook
claude -p "Run /blueprint:guard on the currently staged changes"
```

Or via Claude Code settings.json:
```json
{
  "hooks": {
    "PreCommit": [{
      "type": "command",
      "command": "claude -p 'blueprint:guard'"
    }]
  }
}
```

Note: This is a suggestion, not automatic. The user decides whether to enable it.
