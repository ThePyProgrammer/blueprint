---
name: blueprint:hooks
description: >
  Configure automatic blueprint triggers via Claude Code hooks. Install, list, or remove
  hooks that fire blueprint commands automatically at the right moments. Use when: "set up
  blueprint hooks", "install hooks", "auto-retro after fixes", "auto-guard on commits",
  "blueprint hooks", "configure automation", "what hooks are available?".
---

# Blueprint Hooks

Configure automatic triggers that embed blueprint into the development workflow.
Without hooks, blueprint is a tool you remember to use. With hooks, it speaks up on its own.

## Available Hooks

| Hook | Trigger | What it does | Default |
|------|---------|-------------|---------|
| **guard** | Pre-commit | Run `/blueprint:guard` on staged files | Off |
| **retro-suggest** | After fix workflows | Suggest `/blueprint:retro` | On |
| **architecture-sync** | After ADR transition | Suggest updating ARCHITECTURE.md + fitness functions | On |
| **dependency-watch** | package.json/requirements.txt change | Suggest `/blueprint:new` for tech choice | On |
| **periodic-health** | Every 20 sessions | Suggest `/blueprint:health` + `/blueprint:debt` | On |

## Process

### `/blueprint:hooks` (no args) — List Current Hooks

Read Claude Code settings.json and check for blueprint hook entries:

```bash
cat ~/.claude/settings.json 2>/dev/null | grep -A5 "blueprint"
```

Display current hook status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► HOOKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  | Hook              | Status    | Trigger |
  |-------------------|-----------|---------|
  | guard             | ✗ Off     | Pre-commit |
  | retro-suggest     | ✓ On      | After fix workflows |
  | architecture-sync | ✓ On      | After ADR transition |
  | dependency-watch  | ✓ On      | Dependency file change |
  | periodic-health   | ✓ On      | Every 20 sessions |

  /blueprint:hooks install guard     — enable pre-commit guard
  /blueprint:hooks remove guard      — disable pre-commit guard
  /blueprint:hooks install all       — enable all hooks
```

### `/blueprint:hooks install <hook>` — Install a Hook

Use the `update-config` skill to add the hook to Claude Code settings.json.

**guard hook** — adds a PreToolUse hook that runs before Bash git commit:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "if echo \"$INPUT\" | grep -q 'git commit'; then echo 'Run /blueprint:guard first'; fi"
      }]
    }]
  }
}
```

**retro-suggest hook** — adds a PostToolUse notification after fix-related tool calls:

The retro-suggest hook doesn't block — it adds a note after fix workflows suggesting
`/blueprint:retro`. This is implemented as a behavioral instruction in the project's
CLAUDE.md rather than a settings.json hook:

```markdown
<!-- BEGIN blueprint-hooks -->
## Blueprint Automation

After completing any fix workflow (gsd:quick, rapid:quick, rapid:bug-fix, or manual
bug fix commits), suggest: "Fix is in. Run `/blueprint:retro` to check if it warrants
an ADR?"

After any ADR lifecycle transition (accept, reject, deprecate, supersede), suggest:
"ADR updated. Consider `/blueprint:architect` to refresh ARCHITECTURE.md and
`/blueprint:fitness` to update architecture tests."

When package.json, requirements.txt, pyproject.toml, go.mod, or Cargo.toml is modified,
check if the change introduces a new major dependency. If so, suggest:
"New dependency detected. Consider `/blueprint:new` to document this technology choice."
<!-- END blueprint-hooks -->
```

**architecture-sync hook** — same CLAUDE.md section as above.

**dependency-watch hook** — same CLAUDE.md section as above.

**periodic-health hook** — adds a session counter note to state.toml:

```toml
[hooks]
sessions_since_health = 0
health_interval = 20
```

The help and status commands check this counter and suggest `/blueprint:health` when
it exceeds the interval.

### `/blueprint:hooks remove <hook>` — Remove a Hook

Reverse the installation: remove the relevant section from settings.json or CLAUDE.md.

### `/blueprint:hooks install all` — Install All Hooks

Install all 5 hooks in one go. Present the configuration and ask for confirmation
before writing.

## Implementation Notes

Blueprint hooks are intentionally lightweight — they suggest, they don't block (except
guard, which is opt-in). The goal is to make architectural governance a natural part of
the workflow, not a gate that slows development.

Hooks that go into CLAUDE.md use the same fenced-section pattern as the main blueprint
installer (<!-- BEGIN --> / <!-- END -->). They're updated by re-running the hooks
command, never manually edited.
