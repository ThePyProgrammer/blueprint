---
title: "Getting Started"
description: "Install Blueprint, bootstrap it onto your codebase, and record your first Architecture Decision Record in under 10 minutes."
---

# Getting Started

Blueprint gets you from zero to governed architecture in four steps:

<div class="layer-grid">

<div class="layer-card">
  <span class="layer-card__number">1</span>
  <h4>Install</h4>
  <p>Add Blueprint to your Claude Code environment via npm, plugin marketplace, or local path.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">2</span>
  <h4>Bootstrap</h4>
  <p><code>/blueprint:init</code> scans your codebase for existing architectural decisions and creates the ADR directory.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">3</span>
  <h4>Decide</h4>
  <p><code>/blueprint:new "topic"</code> records your first decision. Add <code>--research</code> for evidence-backed analysis.</p>
</div>

<div class="layer-card">
  <span class="layer-card__number">4</span>
  <h4>Govern</h4>
  <p><code>/blueprint:review N</code> challenges the decision. <code>/blueprint:audit</code> verifies the code follows it. The lifecycle begins.</p>
</div>

</div>

---

## What Happens During Bootstrap

`/blueprint:init` is an archaeological dig. It reads every available source of architectural context in your project:

- **Planning artifacts**: `.planning/`, `.research/`, `PLAN.md`
- **Convention files**: `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`
- **Dependency manifests**: `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`
- **Git history**: Early commit messages that document structural choices
- **Existing documentation**: `ARCHITECTURE.md`, `docs/`, README files

It classifies discovered decisions by impact (High / Medium / Low), generates ADR drafts for the most significant ones, creates `ARCHITECTURE.md` following [matklad's philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html), and produces the full documentation suite in a single atomic commit.

---

## Pages

- [Installation](installation.md): Three installation methods with verification
- [Quickstart](quickstart.md): Your first ADR in 5 minutes
- [Configuration](configuration.md): The TOML domain-specific language that encodes Blueprint's domain knowledge
