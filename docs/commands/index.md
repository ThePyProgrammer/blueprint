---
title: "Command Reference"
description: "Complete reference for all 43 Blueprint commands organized into 8 categories, from project setup to continuous governance."
---

# Command Reference

Blueprint provides **43 commands** organized into **8 categories**, covering the full lifecycle of architectural governance: setup, decision management, analysis, evaluation, documentation, continuous enforcement, strategic planning, and system administration.

## Essential Commands

If you read nothing else, learn these three:

| Command | What it does |
|---------|-------------|
| [`/blueprint:init`](setup.md#blueprintinit-bootstrap-from-codebase) | Scan your codebase and bootstrap the ADR system |
| [`/blueprint:new "topic"`](lifecycle.md#blueprintnew-create-an-adr) | Record an architectural decision |
| [`/blueprint:review N`](lifecycle.md#blueprintreview-devils-advocate-challenge) | Challenge a decision before accepting it |

## Categories

| Category | Commands | Page |
|----------|----------|------|
| **Setup** | init, quickstart, onboard, hooks | [Setup](setup.md) |
| **Lifecycle** | advise, new, list, review, challenge, transition, search, grill-me, help, rearchitect | [Lifecycle](lifecycle.md) |
| **Analysis** | impact, audit, reflect, evidence, map, tradeoff, risk, trace, retro | [Analysis](analysis.md) |
| **Evaluation Team** | evaluate (5 dimensions: consistency, bugs, maintainability, testing, conways) | [Evaluation](evaluation.md) |
| **Documentation** | architect, diagram, eli5, digest, timeline, export, views | [Documentation](documentation.md) |
| **Continuous Governance** | fitness, drift, debt, guard, nudge | [Continuous Governance](continuous-governance.md) |
| **Strategic** | scope, radar, govern, federate | [Strategic](strategic.md) |
| **System** | status, health | [System](system.md) |

## Command Anatomy

Every Blueprint command follows a consistent pattern:

```
/blueprint:<command> [positional args] [--flags]
```

- **Positional arguments** are typically ADR numbers (`3`), topics (`"use PostgreSQL"`), or subcommands (`accept`).
- **Flags** modify behavior (`--research`, `--format github-actions`, `--flat`).
- All commands auto-detect the ADR directory using the [config resolution protocol](../getting-started/configuration.md#config-resolution-protocol).
- Read-only commands (list, search, status, trace) never modify files.
