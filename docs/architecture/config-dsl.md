---
title: "Config DSL"
description: "Blueprint's domain-specific language: TOML files that encode lifecycle rules, taxonomies, relationships, and governance as parseable, testable, version-controlled data."
---

# Config DSL

Blueprint encodes its domain knowledge as structured TOML rather than prose instructions. This is an application of the principle that **data outlives code**, and code outlives prompts.

---

## Why TOML, Not Prompts?

Agent prompts drift. A rule written in English gets paraphrased, reinterpreted, and quietly modified over multiple sessions. A TOML config file is immutable until explicitly changed, parseable by code, testable by CI, and diffable in git.

Three concrete benefits:

1. **Testability.** Blueprint has tests for the lifecycle state machine, the taxonomy, and the relationship graph. You cannot test a paragraph.

2. **Consistency.** When the retrospective agent classifies a root cause as "implicit contract," it uses the same definition as the evaluation team, because both read from `taxonomy.toml`. If the definition were in prose, each agent would paraphrase it differently.

3. **Evolvability.** Adding a new root cause category is a one-line TOML change. Every agent that reads the taxonomy automatically uses the new category. No prompt updates, no agent redeployment.

---

## Static Schemas

These ship with the plugin and define the domain model:

<div class="tier-stack">
<div class="tier-card tier-card--primary">
  <h4>lifecycle.toml</h4>
  <p>Finite state machine: statuses, transitions, requirements, error messages. The foundation of the decision lifecycle. <code>requires = ["review"]</code> on the <code>accept</code> transition means what it says.</p>
</div>
<div class="tier-card tier-card--accent">
  <h4>taxonomy.toml</h4>
  <p>Classification vocabulary: 10 root cause categories, 5 evaluation dimensions, 3 severity levels, 4 evolution stages, 5 architectural views. Shared across all agents.</p>
</div>
<div class="tier-card tier-card--muted">
  <h4>quickstart-templates.toml</h4>
  <p>Pre-built ADR stubs for 5 technology stacks: react-node, python-fastapi, nextjs, go-api, generic. 27 stubs total.</p>
</div>
</div>

---

## Mutable State Files

These are created and managed per-project, stored in `{adr_directory}/.state/`:

<div class="tier-stack">
<div class="tier-card tier-card--primary">
  <h4>relationships.toml</h4>
  <p>ADR dependency graph: edges with typed relationships (DEPENDS_ON, CONFLICTS, SUPERSEDES, INFORMS, EXTENDS). Enables incremental impact analysis.</p>
</div>
<div class="tier-card tier-card--accent">
  <h4>evidence.toml</h4>
  <p>Epistemic status per ADR: evidence level (L0/L1/L2), expiry dates, stale claims. Enables temporal validity tracking.</p>
</div>
<div class="tier-card tier-card--muted">
  <h4>contexts.toml</h4>
  <p>DDD bounded contexts: context definitions, owned ADRs, inter-context relationships (Customer-Supplier, Shared Kernel, etc.).</p>
</div>
<div class="tier-card tier-card--muted">
  <h4>governance.toml</h4>
  <p>Governance mode: lightweight, advised, governed, or formal. Created on first use of <code>/blueprint:govern</code>.</p>
</div>
<div class="tier-card tier-card--muted">
  <h4>radar.toml</h4>
  <p>Technology radar: rings (Adopt/Trial/Assess/Hold), quadrants, linked ADRs. Created on first use of <code>/blueprint:radar</code>.</p>
</div>
<div class="tier-card tier-card--dark">
  <h4>state.toml</h4>
  <p>Session memory: ADR directory path, project root, timestamps for last audit/evaluation/retro. Enables contextual suggestions.</p>
</div>
</div>

---

## The Design Principle

The config DSL is not a general-purpose language. It is a structured vocabulary for expressing exactly these concepts:

- **What statuses exist and how they transition** (lifecycle)
- **What categories exist and how things are classified** (taxonomy)
- **How decisions relate to each other** (relationships)
- **What we know and how confident we are** (evidence)
- **Who owns what** (contexts)
- **How strictly we govern** (governance)

Each file has a narrow scope and a clear owner. No file tries to do two things. This is the Single Responsibility Principle applied to configuration.

!!! tip
    You never need to edit these files manually. Every mutable config is managed by Blueprint commands. But because they're TOML, you *can*. And because they're in git, every change is tracked, diffable, and reversible.
