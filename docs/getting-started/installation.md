---
title: "Installation"
description: "Three ways to install Blueprint: plugin marketplace, npm, or local path. Includes verification and what gets deployed."
---

# Installation

## Via npm

```bash
npm install -g claude-blueprint
claude-blueprint install --global
claude-blueprint verify
```

## Via Local Path

```bash
claude plugin add /path/to/blueprint
```

Or from source:

```bash
cd ~/blueprint
npm install
npm link
claude-blueprint install --global
```

---

## What Gets Deployed

The installer deploys to `~/.claude/commands/blueprint/`:

| Component | Count | Description |
|-----------|-------|-------------|
| Skills | 42 | CLI commands (lifecycle, analysis, documentation, governance) |
| Agents | 21 | Specialized agents with the shared senior engineer persona |
| Config files | 9 | TOML domain-specific language (lifecycle, taxonomy, state, etc.) |
| Hooks | 10 | Automatic governance triggers |

It also inserts a managed section into your `CLAUDE.md` with the full command reference table.

---

## Verification

After installation, verify everything is in place:

```bash
claude-blueprint verify
```

This checks:

- All 42 skill files are present and parseable
- All 21 agent definitions exist
- Config files are valid TOML
- Hook definitions are valid JSON
- CLAUDE.md section is present

!!! tip
    If you're upgrading from v1, run `/blueprint:health` after installation. It validates internal consistency across 8 dimensions and offers auto-repair for fixable issues.
