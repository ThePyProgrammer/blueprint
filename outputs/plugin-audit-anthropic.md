# Plugin Audit: Anthropic Official Guidance

**Researcher:** Claude Opus 4.6 (research agent)
**Date:** 2026-03-30
**Scope:** Primary sources only -- Anthropic documentation, official repos, engineering blog

---

## 1. Plugin Specification

### 1.1 Directory Structure

Anthropic's official plugin structure [1][2]:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json              # Manifest (REQUIRED if present)
├── commands/                    # Legacy skill location (flat .md files)
├── skills/                      # Preferred skill location (SKILL.md dirs)
│   └── my-skill/
│       ├── SKILL.md             # Required entrypoint
│       ├── reference.md         # Optional supporting files
│       └── scripts/
├── agents/                      # Subagent definitions (.md files)
├── hooks/
│   └── hooks.json               # Hook configuration
├── output-styles/               # Output style definitions
├── scripts/                     # Hook and utility scripts
├── settings.json                # Default settings (only "agent" key supported)
├── .mcp.json                    # MCP server definitions
├── .lsp.json                    # LSP server configurations
├── LICENSE
├── CHANGELOG.md
└── README.md
```

**Critical rule**: Only `plugin.json` goes inside `.claude-plugin/`. All other directories must be at the plugin root [2].

### 1.2 plugin.json Manifest Schema

Complete schema from the plugins reference [2]:

```json
{
  "name": "plugin-name",           // REQUIRED if manifest exists (kebab-case)
  "version": "1.2.0",             // Semantic versioning
  "description": "Brief desc",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json",
  "userConfig": { ... },
  "channels": [ ... ]
}
```

**Field details**:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `name` | string | Yes (if manifest exists) | Unique ID, kebab-case. Becomes namespace prefix |
| `version` | string | No | Semver. plugin.json takes priority over marketplace entry |
| `description` | string | No | Shown in plugin manager |
| `author` | object | No | `{name, email, url}` |
| `homepage` | string | No | Documentation URL |
| `repository` | string | No | Source code URL |
| `license` | string | No | SPDX identifier |
| `keywords` | array | No | Discovery tags |
| `commands` | string\|array | No | Custom command paths (replaces default `commands/`) |
| `agents` | string\|array | No | Custom agent paths (replaces default `agents/`) |
| `skills` | string\|array | No | Custom skill paths (replaces default `skills/`) |
| `hooks` | string\|array\|object | No | Hook config paths or inline config |
| `mcpServers` | string\|array\|object | No | MCP config paths or inline config |
| `outputStyles` | string\|array | No | Custom output style paths |
| `lspServers` | string\|array\|object | No | LSP server configs |
| `userConfig` | object | No | User-configurable values prompted at enable time |
| `channels` | array | No | Message injection channels |

**Manifest is optional**: If omitted entirely, Claude Code auto-discovers components in default locations and derives the plugin name from the directory name [2].

### 1.3 Plugin Installation & Namespacing

- Plugin skills are namespaced: `/plugin-name:skill-name` [1]
- Standalone skills use bare names: `/skill-name`
- Install via `claude plugin install <name>` or `--plugin-dir ./path` for development [1]
- Scopes: user (`~/.claude/settings.json`), project (`.claude/settings.json`), local (`.claude/settings.local.json`), managed [2]

### 1.4 Environment Variables for Plugins

| Variable | Description |
|----------|-------------|
| `${CLAUDE_PLUGIN_ROOT}` | Absolute path to plugin install dir. Changes on update |
| `${CLAUDE_PLUGIN_DATA}` | Persistent data dir surviving updates (`~/.claude/plugins/data/{id}/`) |

Both are available in skill content, agent content, hook commands, and MCP/LSP configs [2].

---

## 2. Skill/Command System

### 2.1 Skill File Format

The official format is `SKILL.md` inside a named directory [3]:

```
skills/
└── my-skill/
    ├── SKILL.md           # Required entrypoint
    ├── template.md        # Optional supporting files
    ├── examples/
    │   └── sample.md
    └── scripts/
        └── validate.sh
```

Legacy format (`commands/name.md` flat files) still works but skills are preferred [3].

### 2.2 YAML Frontmatter Fields

**All fields are optional.** Only `description` is recommended [3]:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name. Defaults to directory name. Lowercase, numbers, hyphens. Max 64 chars |
| `description` | Recommended | What the skill does. Used by Claude for auto-invocation. Truncated at 250 chars |
| `argument-hint` | No | Shown in autocomplete. E.g., `[issue-number]` |
| `disable-model-invocation` | No | `true` = only user can invoke. Default: `false` |
| `user-invocable` | No | `false` = hidden from `/` menu. Default: `true` |
| `allowed-tools` | No | Tools Claude can use without permission when skill is active |
| `model` | No | Model to use when skill is active |
| `effort` | No | Effort level: `low`, `medium`, `high`, `max` |
| `context` | No | `fork` = run in subagent |
| `agent` | No | Subagent type when `context: fork` (e.g., `Explore`, `Plan`, custom name) |
| `hooks` | No | Hooks scoped to skill lifecycle |
| `paths` | No | Glob patterns limiting when skill activates |
| `shell` | No | `bash` (default) or `powershell` |

### 2.3 String Substitutions in Skills

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` or `$N` | Specific argument by 0-based index |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing the SKILL.md |

### 2.4 Dynamic Context Injection

The `` !`<command>` `` syntax runs shell commands before skill content is sent to Claude. Output replaces the placeholder [3]:

```yaml
## Context
- PR diff: !`gh pr diff`
- Changed files: !`gh pr diff --name-only`
```

### 2.5 Skill Discovery and Loading

- Skills are discovered from: `~/.claude/skills/`, `.claude/skills/`, plugin `skills/`, `--add-dir` directories [3]
- **Description** is always loaded into context (budget: 1% of context window, fallback 8K chars) [3]
- **Full content** loads only when invoked (by user or Claude)
- Skills with `disable-model-invocation: true` are not loaded into context at all [3]
- Nested `.claude/skills/` in subdirectories are auto-discovered (monorepo support)
- Priority: enterprise > personal > project. Plugin skills use namespace so no conflicts [3]

### 2.6 Agent Skills Open Standard

Claude Code skills follow the [Agent Skills](https://agentskills.io) open standard maintained at `github.com/anthropics/skills` [3][4]. This standard works across multiple AI tools, not just Claude Code. Claude Code extends it with invocation control, subagent execution, and dynamic context injection.

---

## 3. CLAUDE.md Specification

### 3.1 Format

CLAUDE.md files are plain markdown. No special schema required [5]:

- Use markdown headers and bullets to group related instructions
- Target under 200 lines per file
- Instructions are context, not enforced configuration -- specificity improves adherence
- HTML block comments (`<!-- ... -->`) are stripped before injection (use for human-only notes)

### 3.2 Loading Hierarchy

| Scope | Location | Priority |
|-------|----------|----------|
| Managed policy | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS), `/etc/claude-code/CLAUDE.md` (Linux) | Highest (cannot be excluded) |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared |
| User | `~/.claude/CLAUDE.md` | Personal, all projects |
| Subdirectory | `subdir/CLAUDE.md` | On-demand when Claude reads files there |

CLAUDE.md loads as a **user message** after the system prompt, not as part of the system prompt itself [5].

### 3.3 Import Syntax

```markdown
See @README for project overview and @package.json for npm commands.
@docs/git-instructions.md
@~/.claude/my-project-instructions.md
```

- Max depth: 5 hops
- Relative paths resolve relative to the containing file [5]

### 3.4 Path-Specific Rules

`.claude/rules/` directory supports scoped instructions via frontmatter:

```yaml
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
...
```

Rules without `paths` load unconditionally. Path-scoped rules load when matching files are read [5].

### 3.5 Auto Memory

Separate from CLAUDE.md. Claude writes notes to `~/.claude/projects/<project>/memory/`. First 200 lines or 25KB of `MEMORY.md` loaded per session. Topic files loaded on demand [5].

### 3.6 How Plugins Interact with CLAUDE.md

Plugins do NOT inject into CLAUDE.md. Plugin skills and agents are loaded through their own mechanism (skill descriptions into context, full content on invocation). The CLAUDE.md system is orthogonal to the plugin system [5].

---

## 4. Agent/Subagent Definitions

### 4.1 File Format

Agents are markdown files with YAML frontmatter + system prompt body [6]:

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep, Bash
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback.
```

### 4.2 Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique ID, lowercase + hyphens |
| `description` | Yes | When Claude should delegate to this agent |
| `tools` | No | Tool allowlist. Inherits all if omitted |
| `disallowedTools` | No | Tool denylist, removed from inherited set |
| `model` | No | `sonnet`, `opus`, `haiku`, full ID, or `inherit` (default) |
| `permissionMode` | No | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Max agentic turns |
| `skills` | No | Skills to preload into subagent context |
| `mcpServers` | No | MCP servers scoped to this subagent |
| `hooks` | No | Lifecycle hooks scoped to this subagent |
| `memory` | No | Persistent memory: `user`, `project`, `local` |
| `background` | No | `true` = run concurrently |
| `effort` | No | `low`, `medium`, `high`, `max` |
| `isolation` | No | `worktree` for git worktree isolation |
| `initialPrompt` | No | Auto-submitted as first user turn when running as main agent |

**Plugin agent restrictions**: `hooks`, `mcpServers`, and `permissionMode` are **not supported** for plugin-shipped agents (security) [2][6].

### 4.3 Built-in Agent Types

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| Explore | Haiku | Read-only | Fast codebase search/analysis |
| Plan | Inherit | Read-only | Research for planning mode |
| general-purpose | Inherit | All | Complex multi-step tasks |

### 4.4 Agent Body = System Prompt

The markdown body becomes the subagent's system prompt. Subagents receive only this system prompt (plus basic environment details), **not** the full Claude Code system prompt [6]. CLAUDE.md still loads.

### 4.5 Subagent Invocation

- Claude auto-delegates based on `description` field
- Users can `@agent-name` for guaranteed delegation
- `claude --agent <name>` makes agent the main thread
- Subagents cannot spawn other subagents [6]

---

## 5. Hooks System

### 5.1 Hook Configuration Format

Plugins use `hooks/hooks.json` [2][7]:

```json
{
  "description": "Optional description",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 5.2 Hook Types

| Type | Description |
|------|-------------|
| `command` | Execute shell command. Event data on stdin as JSON |
| `http` | POST event JSON to URL |
| `prompt` | Send to Claude for yes/no evaluation |
| `agent` | Spawn subagent for verification |

### 5.3 Lifecycle Events (26 events)

`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Notification`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Stop`, `StopFailure`, `TeammateIdle`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `PreCompact`, `PostCompact`, `Elicitation`, `ElicitationResult`, `SessionEnd` [2][7].

### 5.4 Matcher Syntax

Regex patterns matching on tool name, agent type, or file name depending on event [7]:

```json
"matcher": "Edit|Write"       // OR pattern
"matcher": "Bash"             // Exact
"matcher": "mcp__.*"          // Wildcard
```

### 5.5 Exit Codes (command hooks)

| Code | Meaning |
|------|---------|
| 0 | Success. Parse stdout for JSON |
| 2 | Block the operation. stderr fed back as error |
| Other | Non-blocking error. stderr shown in verbose mode |

---

## 6. Anthropic Prompt Engineering Guidance

### 6.1 XML Tags

Official guidance from Anthropic's prompt engineering docs [8][9]:

- XML tags help Claude parse complex prompts unambiguously
- Use when mixing instructions, context, examples, and variable inputs
- **No canonical "best" tag names** -- use descriptive names matching content
- Consistent, descriptive tag names across prompts recommended
- Nest tags when content has natural hierarchy
- Tags like `<instructions>`, `<context>`, `<example>`, `<documents>` are common patterns
- Benefits: clarity, accuracy, flexibility, parseability

### 6.2 System Prompts

- System prompt focuses Claude's behavior and tone [8]
- Even a single sentence makes a difference
- CLAUDE.md loads as user message, not system prompt [5]
- For system-level injection, use `--append-system-prompt` (CLI flag, must be passed every invocation) [5]

### 6.3 Context Engineering (Anthropic Engineering Blog)

Key principles from "Effective Context Engineering for AI Agents" [9]:

- **Context is a finite resource** -- treat as an "attention budget" depleted by each token
- **Minimal yet sufficient** system prompts. Start minimal, add based on failure modes
- **Altitude calibration** -- avoid both too-specific hardcoded logic and too-vague guidance
- **Just-in-time retrieval** -- maintain lightweight identifiers, load data dynamically via tools
- **Multi-agent architectures** -- sub-agents return condensed summaries (1-2K tokens)
- **Structured note-taking** -- persist notes outside context window for long-horizon tasks
- **Tool design** -- tools must be "self-contained, robust to error, and extremely clear"

### 6.4 Prompt Style for Claude 4.6

From the comprehensive prompt engineering guide [8]:

- Claude 4.6 is more responsive to system prompts; dial back aggressive language
- Replace "CRITICAL: You MUST use this tool" with "Use this tool when..."
- `<xml_tags>` around instruction blocks remain effective
- Roles still matter: "You are a senior code reviewer" focuses behavior
- Few-shot examples in `<example>` tags dramatically improve consistency
- For agent systems: balance autonomy vs. safety with explicit reversibility guidance

---

## 7. Blueprint Alignment Analysis

### 7.1 Plugin Manifest

| Aspect | Official Spec | Blueprint | Status |
|--------|--------------|-----------|--------|
| `name` field | Required (kebab-case) | `"blueprint"` | ALIGNED |
| `version` | Semver recommended | `"2.0.0"` | ALIGNED |
| `description` | Brief string | Long description (193 words) | DEVIATION -- too long for plugin manager display |
| `author` | `{name, email, url}` | `{name: "Prannaya Gupta"}` | ALIGNED (email/url optional) |
| `homepage` / `repository` | URL strings | Present | ALIGNED |
| `license` | SPDX string | `"MIT"` | ALIGNED |
| `keywords` | Array of strings | 28 keywords | ALIGNED |
| Missing: `commands`, `agents`, `skills` | Path overrides | Not specified | OK (defaults apply) |

### 7.2 Directory Structure

| Aspect | Official Spec | Blueprint | Status |
|--------|--------------|-----------|--------|
| `.claude-plugin/plugin.json` | Required location | Present | ALIGNED |
| `skills/` directory | Preferred for skills | **Missing** -- uses `commands/` only | DEVIATION |
| `commands/` directory | Legacy, still works | 39 command files | FUNCTIONAL but legacy |
| `agents/` directory | At plugin root | Present with 21 agents | ALIGNED |
| `hooks/hooks.json` | For plugin hooks | **Missing** | GAP -- no hooks |
| `.mcp.json` | For MCP servers | **Missing** | N/A (not needed) |
| `settings.json` | Plugin default settings | **Missing** | GAP -- could set default agent |
| `config/` directory | Not part of spec | Present (8 .toml files) | CUSTOM -- not standard |
| `src/` directory | Not part of spec | Present (JS files) | CUSTOM -- not standard |
| `README.md` | Required | Present | ALIGNED |

### 7.3 Skill/Command Format

| Aspect | Official Spec | Blueprint | Status |
|--------|--------------|-----------|--------|
| Location | `skills/<name>/SKILL.md` preferred | `commands/<name>.md` (legacy) | DEVIATION -- should migrate |
| Frontmatter `name` | Optional, kebab-case | Uses `blueprint:<name>` with colon | ALIGNED (colon-prefix is plugin namespace) |
| Frontmatter `description` | Recommended, <250 chars | Present, some are long | MOSTLY ALIGNED |
| `disable-model-invocation` | Official field | Not used | OK for most skills |
| `context: fork` | For subagent execution | Not used | POSSIBLE IMPROVEMENT |
| `allowed-tools` | Official field | Not used | POSSIBLE IMPROVEMENT |
| `$ARGUMENTS` substitution | Official mechanism | Uses `$ARGUMENTS` | ALIGNED |
| `` !`command` `` injection | Official mechanism | Not used | POSSIBLE IMPROVEMENT |
| Supporting files | `reference.md`, `scripts/` in skill dir | Not applicable (flat files) | GAP -- migration to `skills/` would enable |
| SKILL.md size guidance | Under 500 lines | `status.md` is 315 lines (largest) | ALIGNED |

### 7.4 Agent Definitions

| Aspect | Official Spec | Blueprint | Status |
|--------|--------------|-----------|--------|
| `name` field | Required | Present | ALIGNED |
| `description` field | Required | Present | ALIGNED |
| `tools` field | Optional (allowlist) | Used correctly | ALIGNED |
| `model` field | Optional | Set to `inherit` | ALIGNED |
| `color` field | Optional | Used (e.g., `red`) | ALIGNED |
| Body = system prompt | Official behavior | Used with detailed prompts | ALIGNED |
| `<xml_tags>` in body | Supported by Claude | Used extensively (`<persona>`, `<role>`, `<scoring>`) | ALIGNED with Anthropic guidance |
| `permissionMode` | Not supported in plugins | Not used | ALIGNED |
| `hooks`, `mcpServers` | Not supported in plugins | Not used | ALIGNED |
| `memory` field | Optional | Not used | POSSIBLE IMPROVEMENT |
| `skills` preloading | Official field | Not used (agents reference files manually) | DEVIATION -- should use `skills` field |
| `maxTurns` | Official field | Not used | POSSIBLE IMPROVEMENT |

### 7.5 Prompt Engineering Alignment

| Aspect | Anthropic Guidance | Blueprint | Status |
|--------|-------------------|-----------|--------|
| XML tags for structure | Recommended | Uses `<persona>`, `<role>`, `<scoring>`, etc. | ALIGNED |
| Descriptive tag names | Recommended | Tags are domain-specific and clear | ALIGNED |
| Role/persona in prompts | "Even a single sentence makes a difference" | Full persona file + per-agent persona blocks | ALIGNED |
| Specific over vague | "Say what you mean" | Very specific instructions | ALIGNED |
| Claude 4.6 tone | "Dial back aggressive language" | Uses CAPS like "NEVER", "CRITICAL" in some places | POSSIBLE IMPROVEMENT |
| Few-shot examples | Recommended in `<example>` tags | Some commands include example outputs | ALIGNED |
| Context engineering | "Minimal yet sufficient" | Agent prompts are detailed but focused | MOSTLY ALIGNED |
| Just-in-time retrieval | Load data via tools at runtime | Commands reference config files on-demand | ALIGNED |

---

## 8. Key Recommendations

### 8.1 High Priority

1. **Migrate `commands/` to `skills/`**: The official recommendation is `skills/<name>/SKILL.md` format. The flat `commands/` directory is legacy. Migration enables supporting files, better organization, and future-proofing. Both formats work today, but Anthropic recommends skills.

2. **Move config files into skill directories**: Blueprint's `config/*.toml` files are custom and not discoverable by Claude Code's standard mechanisms. Moving them into skill supporting directories (e.g., `skills/blueprint/config/`) would align with the spec and allow `${CLAUDE_SKILL_DIR}` references.

3. **Add `hooks/hooks.json`**: Blueprint's `hooks.md` command teaches users to configure hooks manually. Shipping pre-built hooks in `hooks/hooks.json` would provide out-of-box automation (e.g., auto-guard on pre-commit).

### 8.2 Medium Priority

4. **Shorten plugin.json description**: At 193 words, the description is far too long for plugin manager display. Front-load the key value in one sentence.

5. **Use `skills` field in agent frontmatter**: Instead of agents referencing `agents/persona.md` with "Read and internalize", use the official `skills` field to preload the persona skill into subagent context.

6. **Add `context: fork`** to appropriate skills: Commands like `evaluate`, `retro`, and `audit` that spawn multiple agents could benefit from subagent isolation via `context: fork` + `agent` fields.

7. **Soften Claude 4.6 trigger language**: Anthropic explicitly warns that Claude 4.6 is more responsive to aggressive prompting. Replace "CRITICAL", "MUST", "NEVER" with calmer directive language where possible.

### 8.3 Low Priority

8. **Add `memory` to agents**: The `memory: project` field would let agents like the compliance-auditor and drift-detector accumulate findings across sessions.

9. **Add `settings.json`**: Could set a default agent (e.g., `blueprint:persona`) as the main thread agent when the plugin is enabled.

10. **Use `$CLAUDE_SKILL_DIR`**: For referencing config files, templates, and scripts relative to the skill directory rather than hardcoded paths.

---

## Sources

1. [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins) -- Official plugin creation guide
2. [Plugins reference - Claude Code Docs](https://code.claude.com/docs/en/plugins-reference) -- Complete technical specification
3. [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills) -- Skill format, frontmatter, discovery
4. [anthropics/skills - GitHub](https://github.com/anthropics/skills) -- Agent Skills open standard repository
5. [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory) -- CLAUDE.md specification
6. [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents) -- Agent definition format
7. [Hooks - Claude Code Docs](https://code.claude.com/docs/en/hooks) -- Hook system specification
8. [Prompting best practices - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags) -- XML tags, prompt engineering
9. [Effective context engineering for AI agents - Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) -- Agent system design principles
10. [Slash Commands in the SDK - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/slash-commands) -- SDK slash command integration
