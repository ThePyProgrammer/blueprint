# Plugin Architecture Audit: Is Blueprint Designed Correctly?

**Date:** 2026-03-31
**Researchers:** 3 parallel agents (Anthropic docs, peer plugins, prompt engineering patterns)
**Sources:** 31 unique sources across official documentation, peer codebases, and research literature
**Verdict:** **MOSTLY CORRECT — 6/7 design choices validated, 3 spec misalignments to fix**

---

## Executive Summary

Blueprint's core architecture — markdown skills, XML-tagged agent definitions, shared persona, thin router, and domain-specific config — is validated by Anthropic's official guidance, peer plugin patterns, and prompt engineering research. The design choices are not just acceptable; they represent best practice in several areas (XML tags, persona injection, quality gates, single-responsibility agents).

However, the research uncovered **3 misalignments with Anthropic's current plugin specification** and **3 missed opportunities** that peer plugins have adopted. None are architectural — they're migration and polishing issues, not design flaws.

## Scorecard

| Design Choice | Anthropic Spec | Peer Plugins | Research | Overall |
|--------------|---------------|-------------|----------|---------|
| Markdown + YAML frontmatter skills | ✓ Official format | ✓ Universal | ✓ Standard | **VALIDATED** |
| XML-tagged agent sections | ✓ Explicitly recommended | ✓ Used by RAPID, Blueprint | ✓ 4+ sources confirm | **VALIDATED** |
| Shared persona injection | ✓ "Role assignment focuses behavior" | ✓ Blueprint-unique but peer-compatible | ✓ EMNLP + persona pattern research | **VALIDATED** |
| Quality gates (checklists) | ○ Not mentioned | ○ Blueprint-unique | ✓ CoVe, SelfCheck research | **VALIDATED** |
| Thin router + dispatch | ○ Not prescribed | ✓ GSD and Blueprint use it | ✓ Microsoft orchestration patterns | **VALIDATED** |
| Single-responsibility agents | ✓ Agent spec supports it | ✓ RAPID (58 agents) validates scale | ✓ Industry consensus | **VALIDATED** |
| TOML config DSL | ✗ No official analog | ✗ Peers use JSON or none | ○ Defensible but YAML ~5-10% leaner | **PARTIALLY VALIDATED** |

## What Blueprint Gets Right

### 1. Skill format is exactly correct
Markdown files with YAML frontmatter in named directories. This is the official format from `code.claude.com/docs/en/skills`. Blueprint's skills use the right frontmatter fields (`name`, `description`, `tools`, `model`). The body content follows Anthropic's guidance on structured instructions.

### 2. XML tags are Anthropic's explicit recommendation
The `<persona>`, `<role>`, `<execution_flow>`, `<output_format>`, `<quality_gate>` tags follow Anthropic's prompt engineering guide: "Claude was trained specifically to recognize XML tags as a prompt organizing mechanism." Anthropic recommends "descriptive names matching content" — Blueprint's tag names are exactly that.

### 3. Agent definitions follow the spec
YAML frontmatter with `name`, `description`, `tools`, `model` matches the agent definition format at `code.claude.com/docs/en/sub-agents`. The markdown body becomes the subagent's system prompt, which Blueprint uses correctly.

### 4. Persona pattern is research-backed
A 2025 EMNLP study on role-playing prompts, Anthropic's own guidance ("even a single sentence makes a difference"), and the Persona Pattern literature all validate shared persona injection. Blueprint's layered approach (base persona + role-specific adaptation) is the most sophisticated version of this pattern found in any peer plugin.

### 5. Quality gates measurably improve accuracy
Blueprint's `<quality_gate>` checklists align with Chain-of-Verification (CoVe) research showing 10-30% accuracy improvement from self-verification prompts. No other peer plugin uses this pattern — it's a genuine innovation.

### 6. Thin router maps to established orchestration patterns
Microsoft's Azure Architecture Center documents the "routing" pattern for multi-agent systems. Blueprint's thin router with natural language dispatch is a textbook implementation. GSD uses the same pattern, validating it at scale.

## What Needs Fixing (Spec Misalignments)

### ISSUE 1: `commands/` should migrate to `skills/` (MEDIUM)
**Finding:** Anthropic's docs say `commands/` is "legacy" and `skills/<name>/SKILL.md` is preferred. Blueprint uses `commands/` exclusively.
**Impact:** Both formats work today. Migration is recommended but not urgent.
**Fix:** Rename `commands/` → `skills/`, update installer, update all internal references.

### ISSUE 2: No `hooks/hooks.json` shipped (LOW)
**Finding:** Blueprint teaches users to configure hooks via `/blueprint:hooks` but doesn't ship pre-built hook definitions. Anthropic's spec supports a `hooks/hooks.json` file in plugins.
**Impact:** Users must manually configure hooks instead of getting sane defaults on install.
**Fix:** Create `hooks/hooks.json` with the 5 hooks Blueprint already defines (guard, retro-suggest, architecture-sync, dependency-watch, periodic-health).

### ISSUE 3: Agent `skills` frontmatter field unused (LOW)
**Finding:** Agents manually reference `persona.md` via prose instructions ("Read and internalize agents/persona.md"). The official `skills` frontmatter field would preload content automatically.
**Impact:** Works correctly but misses an efficiency optimization. Using `skills` would inject persona content without consuming agent prompt tokens for the instruction.
**Fix:** Add `skills: ["persona"]` to agent frontmatter where appropriate.

## Missed Opportunities (From Peer Analysis)

### OPPORTUNITY 1: Multi-platform registration
**Source:** Superpowers plugin supports Claude Code, Cursor, Codex, Gemini CLI, and OpenCode from one codebase via platform-specific adapters.
**Blueprint impact:** Blueprint is Claude Code-only. Adding `GEMINI.md` and `AGENTS.md` adapters could reach a much larger audience.

### OPPORTUNITY 2: `${CLAUDE_PLUGIN_DATA}` for persistent state
**Source:** Anthropic provides `${CLAUDE_PLUGIN_DATA}` — a persistent data directory at `~/.claude/plugins/data/{id}/` that survives plugin updates.
**Blueprint impact:** Blueprint's per-project `.state/` approach is more granular (per-project, not per-plugin), but global state (last install date, usage stats) could use this official mechanism.

### OPPORTUNITY 3: `userConfig` for install-time configuration
**Source:** The plugin.json spec supports `userConfig` — values prompted at plugin enable time.
**Blueprint impact:** Blueprint could prompt for governance mode, default evidence expiry, or context discovery preferences at install time instead of requiring post-install configuration.

## The TOML Question

TOML is Blueprint's most debatable choice. Research findings:

- **Token efficiency:** YAML is ~5-10% more token-efficient than TOML for equivalent structures. JSON is ~15-20% more expensive.
- **Parse reliability:** TOML's explicit typing (strings vs integers vs booleans) reduces LLM parsing errors compared to YAML's implicit typing.
- **Peer practice:** No other peer plugin uses TOML. GSD and RAPID use JSON. Superpowers uses none.
- **Anthropic guidance:** No official recommendation on config format.

**Verdict:** TOML is defensible. The parsing reliability advantage offsets the minor token cost. But it's a non-standard choice that creates friction for contributors familiar with JSON/YAML.

## Conclusion

Blueprint's architecture is **correct by the standards that matter** — Anthropic's official spec, peer plugin patterns, and prompt engineering research all validate the core design. The 3 spec misalignments (`commands/` → `skills/`, missing hooks.json, unused `skills` frontmatter) are migration tasks, not architectural flaws. The 3 missed opportunities (multi-platform, plugin data dir, userConfig) are enhancements, not corrections.

The most architecturally distinctive thing about Blueprint — that it has **zero runtime code** (pure prompt engineering) — is neither validated nor invalidated by any source. It's unique in the ecosystem. RAPID has 61 Node.js modules; GSD has 30+; Blueprint has 0. Whether this is visionary minimalism or a missing validation layer is a question only real-world adoption will answer.
