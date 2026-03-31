# Peer Plugin Structural Audit

**Date:** 2026-03-30
**Scope:** Structural comparison of Blueprint against peer Claude Code plugins installed on this machine.
**Method:** Direct file system inspection of installed plugin caches and command directories.

---

## Plugins Analyzed

| Plugin | Version | Author | Marketplace |
|--------|---------|--------|-------------|
| **Blueprint** | 2.0.0 | pragnition | pragnition-plugins |
| **GSD** | 1.30.0 | GSD team | Direct install (~/.claude/get-shit-done/) |
| **RAPID** | 5.0.0 | pragnition | pragnition-plugins |
| **Superpowers** | 5.0.5 | Jesse Vincent | claude-plugins-official |
| **Feynman** | 1.0.0 | pragnition | pragnition-plugins |

---

## 1. File Counts and Composition

### Skills / Command Files

| Plugin | Skill/Command Files | Format | Naming Pattern |
|--------|-------------------|--------|----------------|
| **Blueprint** | 39 SKILL.md files (in subdirectories) + 1 root SKILL.md router | Markdown with YAML frontmatter | `blueprint/{skill-name}/SKILL.md` |
| **GSD** | 56 command .md files (flat) + 56 workflow .md files (separate) | Markdown with YAML frontmatter | `gsd/{command-name}.md` (thin shell) + `workflows/{name}.md` (logic) |
| **RAPID** | 28 SKILL.md files (in subdirectories) | Markdown with YAML frontmatter | `rapid/skills/{skill-name}/SKILL.md` |
| **Superpowers** | 14 SKILL.md files (in subdirectories) | Markdown with YAML frontmatter | `superpowers/skills/{skill-name}/SKILL.md` |
| **Feynman** | 11 command .md files (flat) | Markdown with YAML frontmatter (minimal) | `feynman/commands/{name}.md` |

**Observation:** All plugins converge on Markdown with YAML frontmatter. Blueprint uses the most granular subdirectory pattern with the most skills. GSD uses a unique two-layer pattern: thin command shells in `~/.claude/commands/gsd/` that reference workflow files in `~/.claude/get-shit-done/workflows/`.

### Agent Definitions

| Plugin | Agent Files | Format | XML Tags Used |
|--------|-------------|--------|---------------|
| **Blueprint** | 21 (including persona.md) | Markdown with XML sections | `<persona>`, `<role>`, `<execution_flow>`, `<output_format>`, `<quality_gate>` |
| **GSD** | 0 dedicated agent files | N/A -- agent prompts are inline in workflow .md files or constructed dynamically by gsd-tools.cjs | None |
| **RAPID** | 27 agent files | Markdown with YAML frontmatter + XML sections | `<identity>`, structured return protocol sections |
| **Superpowers** | 1 agent file (code-reviewer.md) + per-skill prompt templates | Markdown with YAML frontmatter, no XML tags | None |
| **Feynman** | 0 dedicated agent files | N/A -- agent behavior is inline in command files | None |

**Key difference:** Blueprint and RAPID both use dedicated agent definition files with XML-tagged structural sections. GSD and Feynman embed agent behavior inline. Superpowers uses a hybrid -- 1 reusable agent file plus per-skill prompt template files (e.g., `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md`).

### RAPID Agent Frontmatter vs Blueprint Agent Format

RAPID agents use YAML frontmatter with `name`, `description`, `tools`, `model`, `color` fields. Blueprint agents use free-form markdown with XML-tagged sections. RAPID's approach is more structured for machine parsing; Blueprint's is more expressive for persona injection.

---

## 2. Config Architecture

| Plugin | Config Format | Config Files | What's Configured |
|--------|--------------|--------------|-------------------|
| **Blueprint** | TOML (10 files) | `lifecycle.toml`, `relationships.toml`, `state.toml`, `taxonomy.toml` + 6 state templates | ADR lifecycle state machine, relationship types, per-project state schemas, governance rules, radar, evidence tracking, bounded contexts |
| **GSD** | JSON (1 file) | `config.json` template | Workflow toggles, parallelization settings, safety gates, confirmation gates |
| **RAPID** | JSON (1 file) | `config.json` | Lock timeout, agent size warning threshold |
| **Superpowers** | None | No config files | No configurable state -- purely skill-based |
| **Feynman** | None | No config files | No configurable state -- purely skill-based |

**Blueprint is the only plugin using TOML.** All others use JSON or no config at all. Blueprint's 10 TOML files represent the most elaborate config surface of any plugin in this audit.

---

## 3. Router / Dispatch Pattern

| Plugin | Pattern | Implementation |
|--------|---------|----------------|
| **Blueprint** | Thin router (SKILL.md) dispatching via routing table | Root `SKILL.md` contains a markdown table mapping user intent phrases to sub-skills. Routes via `/blueprint:{sub-skill}`. |
| **GSD** | Thin command shells + separate workflow files + CLI tool dispatcher | Command .md files are ~30 lines that reference `@$HOME/.claude/get-shit-done/workflows/{name}.md` via `<execution_context>` tags. Also has `/gsd:do` as a natural-language intent router. |
| **RAPID** | Direct skill dispatch (no central router) | Skills are invoked directly as `/rapid:{skill-name}`. No meta-router exists -- each skill is self-contained. |
| **Superpowers** | Behavior-triggered skills (no explicit router) | `using-superpowers` SKILL.md acts as a meta-instruction that fires on every conversation start, compelling skill invocation whenever relevant. Not a routing table -- a behavioral mandate. |
| **Feynman** | Direct command dispatch (no router) | Commands invoked directly as `/feynman:{name}`. No router, no meta-skill. |

**Observation:** Blueprint and GSD both have explicit routing layers. Superpowers takes a radically different approach: rather than routing, it injects a "you MUST use skills" behavioral mandate on every session start. RAPID and Feynman skip routing entirely.

GSD's `<execution_context>` pattern (command shell -> workflow file) is architecturally notable: it separates the Claude-facing interface (command .md) from the implementation logic (workflow .md), allowing workflow updates without touching the registered command surface.

---

## 4. Persona / Personality

| Plugin | Approach | File |
|--------|----------|------|
| **Blueprint** | Shared persona.md injected into all agents | `agents/persona.md` -- cranky senior engineer with 20 years experience |
| **GSD** | Per-workflow tone via `references/ui-brand.md` | UI brand reference loaded by commands; not a persona per se but a visual/output brand |
| **RAPID** | Shared identity block in agents | `<identity>` XML block copy-pasted into every agent file -- describes RAPID agent role, worktree mechanics, namespace isolation |
| **Superpowers** | None | No persona. Skills are procedural, not character-driven. |
| **Feynman** | Per-command persona ("You are the Lead Researcher") | Inline in each command file, not shared |

**Blueprint is unique in having a dedicated, reusable persona file.** RAPID has a shared identity concept but it's duplicated (copy-pasted) across agent files rather than referenced. GSD has brand consistency via a separate reference file.

---

## 5. State Management

| Plugin | State Location | State Format | Mechanism |
|--------|---------------|--------------|-----------|
| **Blueprint** | `{adr_directory}/.state/` (per-project) | TOML files from state templates | Agents read/write TOML state files. Templates in `config/state-templates/` define schemas for relationships, evidence, governance, contexts, radar, and base state. |
| **GSD** | `.planning/` (per-project) | Markdown files (PROJECT.md, ROADMAP.md, STATE.md, etc.) + JSON (config.json) | `gsd-tools.cjs` CLI (17 library modules) handles all state mutations. Agents interact with state exclusively through CLI commands, never by editing files directly. |
| **RAPID** | `.planning/` (per-project) + `.rapid-worktrees/` | JSON (STATE.json) + Markdown (PLAN.md, CONTEXT.md per set) | `rapid-tools.cjs` CLI (61 source modules, 58 test files) manages state. Includes state machine, lock management, DAG computation, worktree management. |
| **Superpowers** | None | N/A | Stateless. No per-project state. Plans are saved to `docs/superpowers/plans/` as artifacts but there is no state machine or lifecycle tracking. |
| **Feynman** | `outputs/`, `papers/`, `notes/` (per-project) | Markdown artifacts | Output-only. Research artifacts are written to filesystem directories but there is no state tracking, lifecycle management, or cross-session persistence. |

**Key finding:** Blueprint, GSD, and RAPID all maintain structured per-project state. But GSD and RAPID use CLI tooling (Node.js) to mediate all state access, while Blueprint lets agents read/write TOML files directly. This is an architectural divergence worth examining:

- **CLI-mediated state (GSD, RAPID):** Enforces constraints, enables validation, prevents concurrent corruption. RAPID adds file locking and state machine validation in code.
- **Direct file state (Blueprint):** Simpler, no runtime dependency, but relies on agent prompt compliance for constraint enforcement.

---

## 6. Plugin Registration

| Plugin | Registration File | Structure |
|--------|-------------------|-----------|
| **Blueprint** | `.claude-plugin/plugin.json` | Standard: `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords` |
| **GSD** | None (direct install to `~/.claude/commands/gsd/` + `~/.claude/get-shit-done/`) | Not a marketplace plugin. Installs via custom installer. Commands appear in `~/.claude/commands/gsd/`. |
| **RAPID** | `.claude-plugin/plugin.json` | Standard format, same fields as Blueprint |
| **Superpowers** | `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` + `.cursor-plugin/plugin.json` | Multi-platform registration: Claude Code, Cursor, Codex, OpenCode, Gemini CLI. Has `marketplace.json` for development marketplace context. |
| **Feynman** | `.claude-plugin/plugin.json` | Standard format |

**Superpowers is the only plugin with multi-platform registration** (Claude Code, Cursor, Codex, OpenCode, Gemini). It includes platform-specific adapter files (`.cursor-plugin/`, `.codex/`, `.opencode/`). All pragnition plugins use the standard single-platform registration.

---

## 7. Hooks System

| Plugin | Has Hooks | Format | What Triggers |
|--------|-----------|--------|---------------|
| **Blueprint** | Blueprint has a `/blueprint:hooks` skill for configuring Claude Code hooks, but does not ship pre-configured hooks | Skill-based configuration, no hooks.json | N/A |
| **GSD** | No hooks.json shipped | N/A | N/A |
| **RAPID** | Shell script hooks in `src/hooks/` | `rapid-task-completed.sh`, `rapid-verify.sh` | Task completion, verification |
| **Superpowers** | `hooks/hooks.json` + shell scripts | JSON hook config + `session-start` script | SessionStart event -- runs on every session start, compact, and clear |
| **Feynman** | No hooks | N/A | N/A |

**Superpowers is the only plugin that ships a pre-configured hooks.json** that fires on SessionStart. RAPID has hook scripts but they appear to be invoked by the CLI tool rather than Claude Code's native hook system.

---

## 8. Tooling / Runtime Dependencies

| Plugin | CLI Tool | Language | Test Suite | Lines of Code (approx) |
|--------|----------|----------|------------|----------------------|
| **Blueprint** | None | Pure markdown/TOML | None | 0 (all prompt-based) |
| **GSD** | `gsd-tools.cjs` + 17 lib modules | Node.js (CommonJS) | Not found in install | ~3,000+ estimated |
| **RAPID** | `rapid-tools.cjs` + 61 lib modules | Node.js (CommonJS) | 58 test files (.test.cjs) | ~10,000+ estimated |
| **Superpowers** | `server.cjs` (brainstorm server) + `helper.js` | Node.js (CommonJS + ESM) | 6 test files (shell + JS) | ~1,500 estimated |
| **Feynman** | `cli.js` + 4 src modules (install, verify, paths, claude-md) | Node.js (ESM) | None | ~500 estimated |

**RAPID has by far the heaviest runtime dependency** -- a full Node.js CLI with state machines, locking, DAGs, worktree management, scaffolding, and extensive tests. Blueprint is the lightest -- zero runtime code, everything is prompt engineering. GSD sits in the middle. Superpowers has a targeted server for its brainstorming visual companion feature.

---

## 9. Reference / Supporting Files

| Plugin | Reference Files | Templates | Documentation Files |
|--------|----------------|-----------|-------------------|
| **Blueprint** | 0 reference files | 0 templates (TOML state templates serve this role) | 0 |
| **GSD** | 15 reference .md files | 42 template .md files | 0 |
| **RAPID** | 0 reference files | Templates generated by rapid-tools.cjs | DOCS.md, technical_documentation.md |
| **Superpowers** | 8 reference/supporting .md files per skill | 0 | README.md, CHANGELOG.md, RELEASE-NOTES.md |
| **Feynman** | 0 | 0 | DOCS.md, README.md |

GSD has the most elaborate template system (42 templates for projects, milestones, phases, context, etc.). Blueprint encodes its templates as TOML state schemas.

---

## Comparison Matrix

| Concern | Blueprint | GSD | RAPID | Superpowers | Feynman |
|---------|-----------|-----|-------|-------------|---------|
| **Skills/Commands** | 39 | 56 | 28 | 14 | 11 |
| **Agent Definitions** | 21 dedicated | 0 (inline) | 27 dedicated | 1 + prompt templates | 0 (inline) |
| **Config Format** | TOML (10 files) | JSON (1 file) | JSON (1 file) | None | None |
| **Router** | Routing table in SKILL.md | Command shell -> workflow file + NL router | No router | Behavioral mandate | No router |
| **Persona** | Shared persona.md | Brand reference | Copy-pasted identity block | None | Inline per-command |
| **State Location** | `{adr_dir}/.state/` | `.planning/` | `.planning/` + `.rapid-worktrees/` | None (stateless) | `outputs/` (artifacts only) |
| **State Format** | TOML | Markdown + JSON | JSON + Markdown | N/A | Markdown |
| **State Access** | Direct file read/write by agents | CLI-mediated (gsd-tools.cjs) | CLI-mediated (rapid-tools.cjs) | N/A | Direct file write |
| **CLI Tooling** | None | Node.js (17 modules) | Node.js (61 modules, 58 tests) | Node.js (brainstorm server) | Node.js (4 modules) |
| **Hooks** | Skill for configuring | None | Shell scripts | hooks.json (SessionStart) | None |
| **Plugin Registration** | Standard plugin.json | Non-standard (direct install) | Standard plugin.json | Multi-platform (5 platforms) | Standard plugin.json |
| **XML Tags in Skills** | Yes (`<persona>`, `<role>`, etc.) | Yes (`<objective>`, `<execution_context>`, `<context>`, `<process>`) | Yes (`<identity>`) | Yes (`<EXTREMELY-IMPORTANT>`, `<SUBAGENT-STOP>`) | No |
| **Skill File Structure** | YAML frontmatter + markdown body | YAML frontmatter + XML-tagged sections | YAML frontmatter + markdown steps | YAML frontmatter + markdown prose | YAML frontmatter + markdown workflow |
| **Multi-platform** | No | No | No | Yes (5 platforms) | No |

---

## Architectural Patterns Worth Noting

### 1. GSD's Two-Layer Command Pattern
GSD separates the Claude-visible command surface (`~/.claude/commands/gsd/*.md`) from the implementation logic (`~/.claude/get-shit-done/workflows/*.md`). Command files are thin shells (~30 lines) that use `@$HOME/.claude/get-shit-done/workflows/{name}.md` in `<execution_context>` tags. This enables updating workflow logic without re-registering commands.

Blueprint does not have this separation -- skill logic lives directly in `SKILL.md` files.

### 2. RAPID's CLI-First State Management
RAPID treats its Node.js CLI (`rapid-tools.cjs`) as the single source of truth for all state operations. Every skill invocation begins with environment setup and CLI calls. State mutations go through validated code paths with file locking, state machine enforcement, and JSON schema validation. This is the most engineering-heavy approach in the audit.

Blueprint's TOML-based state relies on agent prompt compliance for consistency. No runtime validation exists outside of what agents choose to do.

### 3. Superpowers' Behavioral Injection
Rather than routing or dispatching, Superpowers injects a meta-skill (`using-superpowers`) that fires on every conversation and contains the instruction: "IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT." This is architecturally unusual -- it's a prompt-level behavioral mandate rather than a structural dispatch pattern.

### 4. Feynman's Minimalism
Feynman is the leanest plugin: 11 command files, no agents, no config, no state machine. Each command is a self-contained workflow description. This is the opposite end of the complexity spectrum from Blueprint and RAPID.

### 5. Agent Identity Patterns
- **Blueprint:** Shared persona.md referenced across all agents -- single personality, multiple roles.
- **RAPID:** Shared `<identity>` block duplicated in each agent -- same content, separate copies. Includes namespace isolation rules preventing agents from using non-RAPID skills.
- **Superpowers:** No agent identity. One generic code-reviewer agent plus per-skill prompt templates.
- **GSD / Feynman:** No dedicated agent files.

---

## Risks and Opportunities for Blueprint

### Blueprint Does Better Than Peers
1. **Richest governance model** -- lifecycle state machine in TOML, relationship graph, evidence tracking, bounded contexts, governance tiers. No other plugin comes close.
2. **Dedicated shared persona** -- cleaner than RAPID's copy-paste approach, more characterful than Superpowers' procedural style.
3. **Zero runtime dependency** -- no Node.js CLI to maintain, no lock files, no state machine bugs. Pure prompt engineering.
4. **Most agent definitions** -- 21 specialized agents with structured XML sections. Only RAPID has more (27) but RAPID's are more homogeneous.

### Blueprint Could Learn From Peers
1. **CLI-mediated state access (from RAPID/GSD):** Blueprint's agents read/write TOML files directly. RAPID and GSD force all state access through a CLI tool, enabling validation, locking, and atomic operations. Blueprint's approach risks concurrent state corruption if multiple agents write simultaneously.
2. **Command/workflow separation (from GSD):** GSD's thin command shell -> workflow file pattern enables updating logic without touching the command registration surface. Blueprint's SKILL.md files contain both interface and implementation.
3. **Multi-platform support (from Superpowers):** Superpowers registers for 5 different AI coding platforms. Blueprint only registers for Claude Code.
4. **Hooks integration (from Superpowers):** Superpowers ships a ready-to-use hooks.json. Blueprint has a skill for configuring hooks but doesn't ship default hooks.
5. **Test suite for tooling (from RAPID):** RAPID has 58 test files for its CLI. Blueprint has no tests because it has no runtime code -- but if it ever adds tooling, RAPID's test discipline is the standard.
6. **Behavioral trigger pattern (from Superpowers):** The `using-superpowers` meta-skill that fires on every conversation is an interesting pattern for ensuring plugin engagement without explicit invocation.

---

## Summary Statistics

| Metric | Blueprint | GSD | RAPID | Superpowers | Feynman |
|--------|-----------|-----|-------|-------------|---------|
| Total non-git files | ~70 | ~130+ | ~200+ | ~100+ | ~20 |
| Skill/command files | 39 | 56 | 28 | 14 | 11 |
| Agent files | 21 | 0 | 27 | 1 | 0 |
| Config files | 10 | 1 | 1 | 0 | 0 |
| Runtime code modules | 0 | 17 | 61 | 3 | 4 |
| Test files | 0 | 0 | 58 | 6 | 0 |
| Reference/template files | 0 | 57 | 0 | 8 | 0 |
| Hooks files | 0 | 0 | 2 | 2 | 0 |
