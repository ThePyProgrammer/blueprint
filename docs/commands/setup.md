---
title: "Setup"
description: "Commands for bootstrapping Blueprint onto a codebase, generating starter ADRs, onboarding developers, and configuring automation hooks."
---

# Setup

These four commands get Blueprint running on a project. `init` is the day-one command. `quickstart` generates starter ADRs. `onboard` brings new developers up to speed. `hooks` makes governance automatic.

---

### `/blueprint:init`: Bootstrap from Codebase

Scan an existing codebase for architectural decisions and create the full ADR system. Reads every available source of context (planning artifacts, convention files, dependency manifests, git history) and classifies discovered decisions by impact, and produces ADR drafts, `ARCHITECTURE.md`, and config files in a single atomic commit.

Think of it as an archaeological dig that turns implicit decisions into explicit records.

**Syntax:** `/blueprint:init`

No arguments. Auto-detects project root from the current directory.

**What it scans:**

- `.planning/`, `.research/`, `PLAN.md`: planning artifacts
- `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`: convention files
- `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`: dependency manifests
- Git history: early commit messages with structural choices
- `ARCHITECTURE.md`, `docs/`, README: existing documentation

**Examples:**

```
/blueprint:init
# Full codebase scan, generate ADRs + ARCHITECTURE.md

/blueprint:init
# Safe to run on a project that already has ADRs (detects and preserves existing ones)
```

!!! tip
    Run `init` once at the start. For a faster path with pre-built decisions, follow up with `/blueprint:quickstart`.

---

### `/blueprint:quickstart`: Stack-Specific ADR Bootstrapping

Generate 5-8 foundational ADRs from pre-built templates for your technology stack. Auto-detects the stack from package manifests.

**Syntax:** `/blueprint:quickstart [stack]`

Available stacks: `react-node`, `python-fastapi`, `nextjs`, `go-api`, `generic`. If omitted, auto-detects from `package.json`, `requirements.txt`, `go.mod`, etc.

**Examples:**

```
/blueprint:quickstart
# Auto-detect stack, generate foundational ADRs

/blueprint:quickstart react-node
# Explicitly target React + Node.js stack
```

!!! tip
    Quickstart generates *Proposed* ADRs, not Accepted ones. Review and challenge them before accepting. They're starting points for conversation, not final decisions.

---

### `/blueprint:onboard`: New Developer Walkthrough

5-minute architecture walkthrough for new team members. Covers key decisions, domain structure, governance mode, health status, and what to read first.

**Syntax:** `/blueprint:onboard`

**Examples:**

```
/blueprint:onboard
# "Here's how this codebase is structured, here are the decisions that matter,
#  here's the governance mode, here's where to start reading."
```

---

### `/blueprint:hooks`: Configure Automation

Install, list, or remove hooks that fire Blueprint commands automatically at the right moments.

**Syntax:** `/blueprint:hooks [install|list|remove] [hook-name|all]`

**Available hooks:**

| Hook | When | What | Default |
|------|------|------|---------|
| `guard` | Before Write/Edit | Check staged files against ADR invariants | Off |
| `retro-suggest` | After git fix commits | Suggest `/blueprint:retro` | On |
| `bugfix-retro` | After `rapid:bug-fix`, `gsd:debug` | Retro for plugin-driven fixes | On |
| `architecture-sync` | After ADR transitions | Suggest ARCHITECTURE.md update | On |
| `dependency-watch` | Package file changed | Suggest `/blueprint:new` for new deps | On |
| `planning-watch` | PLAN.md / .planning/ changed | Detect architectural decisions | On |
| `periodic-nudge` | ~Every 20 sessions | Governance staleness check | On |
| `session-sweep` | Session end | Scan for undocumented decisions | On |
| `feynman-evidence` | After Feynman research | Link research to ADRs | On |
| `gsd-rapid-adr` | After GSD/RAPID phases | Detect undocumented decisions | On |

**Examples:**

```
/blueprint:hooks install all
# Enable all automation hooks

/blueprint:hooks install guard
# Enable pre-commit architecture guard (the only one that blocks)

/blueprint:hooks list
# Show which hooks are currently enabled

/blueprint:hooks remove periodic-nudge
# Disable the periodic governance check
```

!!! tip
    Hooks *suggest* rather than block (except `guard`, which is opt-in precisely because it blocks). The goal is to make governance a natural part of the workflow, not a gate.
