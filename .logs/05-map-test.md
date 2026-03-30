# Dogfood Test: /blueprint:map
**Date:** 2026-03-31
**Target:** Blueprint's own architecture
**Command tested:** /blueprint:map

## Strategic Analysis Output

### Component Inventory

Blueprint decomposes into 6 major component groups with 13 classifiable components:

| # | Component | Description |
|---|-----------|-------------|
| 1 | TOML Config DSL | 8 TOML files encoding lifecycle FSM, taxonomy, state, relationships, contexts, evidence, radar, governance |
| 2 | ADR Lifecycle Engine | 6-status finite state machine with 6 valid transitions, 5 invalid — data-driven from lifecycle.toml |
| 3 | Skill Layer (39 SKILL.md files) | Declarative command definitions — orchestration-only, no domain logic |
| 4 | Agent System (21 agents) | Specialized analysis agents spawned by skills via Claude Code Agent tool |
| 5 | Shared Persona | Cranky senior engineer personality injected into every agent |
| 6 | CLI Installer (bin/cli.js + src/) | Node.js installer: copies commands, agents, config to ~/.claude/ |
| 7 | Router (blueprint.md) | Thin dispatcher — NL intent parsing, routes to 38 sub-skills |
| 8 | Evaluation Team | 5 parallel orthogonal agents for architecture evaluation |
| 9 | v2 Paradigm Extensions | DDD scoping, DCAR forces, reflexion, epistemic tracking, Wardley, C4, ATAM, risk maps, federation |
| 10 | State Management | state.toml session memory, relationships.toml graph, evidence.toml tracking |
| 11 | CLAUDE.md Integration | Fenced section management in user's CLAUDE.md |
| 12 | Commander.js (dependency) | CLI argument parsing |
| 13 | Inquirer.js (dependency) | Interactive prompts for install scope selection |
| 14 | Ora (dependency) | Terminal spinners |

### Component Evolution Map

| Component | Evolution Stage | Build/Buy Status | Alignment |
|-----------|----------------|-----------------|-----------|
| TOML Config DSL | **Genesis** | Build | ALIGNED -- novel encoding of architecture governance rules as structured data. No vendor sells this. |
| ADR Lifecycle Engine | **Custom-Built** | Build | ALIGNED -- ADR lifecycle is a known concept (Nygard 2011), but data-driven FSM execution via TOML is a unique implementation. |
| Skill Layer (39 SKILL.md) | **Genesis** | Build | ALIGNED -- Claude Code skill format is brand new. No alternative exists. This IS the product. |
| Agent System (21 agents) | **Genesis** | Build | ALIGNED -- multi-agent architecture governance via LLM agents is novel. Blueprint's core differentiator. |
| Shared Persona | **Genesis** | Build | ALIGNED -- personality-as-configuration injected into AI agents. Novel pattern, part of the brand. |
| CLI Installer | **Commodity** | Build | MINOR MISALIGNMENT -- file copying installer is commodity work, but the deployment target (Claude Code plugin directories) is non-standard enough that no package manager handles it natively. Acceptable custom build. |
| Router (blueprint.md) | **Custom-Built** | Build | ALIGNED -- NL intent routing within Claude Code skills is unique to this platform. |
| Evaluation Team (5 agents) | **Genesis** | Build | ALIGNED -- parallel orthogonal architecture evaluation by 5 AI agents. No product exists for this. |
| v2 Paradigm Extensions | **Genesis/Custom** | Build | ALIGNED -- applying Wardley/DCAR/ATAM/reflexion models via AI agents is novel synthesis. The paradigms are known; the AI-agent execution is genesis. |
| State Management | **Custom-Built** | Build | ALIGNED -- TOML-based state for a Claude Code plugin has no off-the-shelf alternative. Simple enough not to warrant a database. |
| CLAUDE.md Integration | **Custom-Built** | Build | ALIGNED -- platform-specific integration. No alternative. |
| Commander.js | **Commodity** | Buy (npm) | ALIGNED -- CLI framework, 10+ years old, 20k+ GitHub stars. Correct to use, not build. |
| Inquirer.js | **Commodity** | Buy (npm) | ALIGNED -- interactive prompts, commodity. Used for exactly one prompt (install scope). |
| Ora | **Commodity** | Buy (npm) | ALIGNED -- terminal spinners, pure commodity. Correct to use. |

### Core Differentiators (Genesis/Custom -- Should Build)

| Component | Stage | Status |
|-----------|-------|--------|
| Agent System (21 agents) | Genesis | Building custom -- correct. This IS the value proposition. |
| Skill Layer (39 SKILL.md) | Genesis | Building custom -- correct. Claude Code platform-native. |
| TOML Config DSL | Genesis | Building custom -- correct. Domain knowledge as structured data. |
| Shared Persona | Genesis | Building custom -- correct. Brand differentiator. |
| Evaluation Team | Genesis | Building custom -- correct. No equivalent exists. |
| v2 Paradigm Extensions | Genesis/Custom | Building custom -- correct. Novel synthesis of known paradigms via AI agents. |

### Build-vs-Buy Analysis

**No critical misalignments detected.**

The three npm dependencies (Commander.js, Inquirer.js, Ora) are all commodity libraries used correctly for commodity tasks. Blueprint is not building its own CLI parser, prompt library, or spinner -- good discipline.

The CLI installer (component #6) is the closest thing to a misalignment. File-copying installers are commodity, and Blueprint wrote its own (`src/install.js`, ~112 lines). However, the deployment target is `~/.claude/commands/blueprint/` with a specific directory structure (sub-skill directories, agent files, config files, state templates). No existing package manager or installer handles this layout. The custom build is justified by platform constraints, not by "we want more control" syndrome.

**Verdict: No vendor exists for "deploy Claude Code multi-agent architecture governance plugins." Custom build is correct.**

### Dependency Health

| Dependency | Version | Evolution Stage | Risk |
|------------|---------|----------------|------|
| commander | ^13.0.0 | Commodity | LOW -- stable, widely used, minimal API surface consumed |
| @inquirer/prompts | ^7.0.0 | Commodity | LOW -- used for exactly 1 prompt. Could be replaced with readline in 10 lines. |
| ora | ^8.0.0 | Commodity | LOW -- pure cosmetic. Removal would degrade UX, not functionality. |

Three dependencies. Total. For a tool with 39 commands and 21 agents. This is remarkably lean. The dependency surface is almost nonexistent because the actual work is done by Claude Code's Agent/Read/Grep/Bash tools, not by npm packages. Smart architecture.

**Potential concern:** All three dependencies are ESM-only (note `"type": "module"` in package.json). This is fine in 2026 but was a source of pain in 2023-2024. No action needed -- the Node.js >=18.0.0 engine requirement handles this correctly.

### Strategic Assessment

**Strategic health: ALIGNED**

Blueprint's architecture is unusually well-aligned with Wardley principles for a tool at this stage:

1. **Genesis components are where the engineering effort goes.** The 39 skill files and 21 agent definitions are the product. The TOML config DSL is the domain model. These are where all the complexity lives, and they should be.

2. **Commodity components are bought, not built.** CLI parsing, prompts, and spinners are npm packages. No NIH syndrome detected.

3. **The "platform" is Claude Code itself.** Blueprint treats Claude Code as infrastructure (commodity) and builds its differentiator on top. This is strategically correct -- Claude Code handles tool execution, file I/O, web search, and agent spawning. Blueprint provides the domain knowledge and orchestration logic.

4. **Zero backend infrastructure.** No database, no API server, no auth system. State is TOML files in the project directory. This eliminates an entire class of commodity-building temptation. You cannot accidentally build a custom database when your state is flat files.

5. **The only strategic risk is platform dependency.** Blueprint is 100% coupled to Claude Code's skill/agent system. If Claude Code changes its plugin format, Blueprint breaks entirely. This is an acceptable bet for a tool whose entire value proposition is "architecture governance for Claude Code users," but it should be documented as a known risk.

### Strategic Recommendations

1. **Document the platform coupling risk.** Blueprint has zero portability to other AI coding assistants (Cursor, Copilot, Windsurf). This is fine strategically -- Claude Code IS the platform -- but an ADR acknowledging this bet would be appropriate. If one doesn't exist, create ADR-0042: "Platform coupling to Claude Code is an intentional strategic choice."

2. **Consider dropping Inquirer.js.** It's used for exactly one `select()` call in `src/install.js` (global vs project scope). This could be a Commander.js option flag (`--global` / `--project`, which already exist) with a Node.js `readline` fallback for interactive mode. One fewer dependency for one prompt.

3. **The CLI installer is the weakest component architecturally.** It's a flat loop of `copyFile()` calls with a hardcoded list of 38 command names duplicated between the directory-creation loop and the file-copy loop (lines 32-37 and 53-61 of `install.js`). DRY violation. If a new command is added, both lists must be updated. Extract the command list to a constant or read it from the filesystem.

## Issues Found

### Issue 1: map.md references spawning an agent, but the agent definition has no spawn guard

The `map.md` skill says "Spawn a `blueprint:adr-strategic-analyzer` agent" but `adr-strategic-analyzer.md` includes `WebSearch` and `WebFetch` in its tool list. When dogfooding (analyzing Blueprint itself), web search for "TOML config DSL alternatives" or "Claude Code plugin alternatives" would return noise -- these are genesis-stage components with no meaningful vendor landscape. The agent should short-circuit web research for components it can identify as genesis-stage from the codebase alone.

**Severity:** Low. The agent's quality gate says "Evolution stage classifications are backed by web research (not just vibes)" but for genesis-stage components, web research will return nothing useful. The instruction should say "web research for Product/Commodity classification; codebase evidence for Genesis/Custom."

### Issue 2: map.md Step 6 commits automatically

The skill says: `Commit: docs(adr): generate Wardley strategic analysis for [N] components`. Strategic analysis is advisory output. Auto-committing advisory output to the repo is presumptuous. The user should be asked whether to commit. Compare with `review.md` which presents findings but doesn't auto-commit a review report.

**Severity:** Medium. Unwanted commits pollute git history.

### Issue 3: No output artifact path specified

The `map.md` skill updates `state.toml` with `last_strategic_map` timestamp but never specifies WHERE the strategic analysis gets written. Is it inline output only? Written to a file? The agent definition's quality gate checks content quality but not output destination. Compare with `architect.md` which explicitly writes to `docs/ARCHITECTURE.md`.

**Severity:** Medium. Without a defined output location, repeated `/blueprint:map` runs produce ephemeral output that can't be referenced later.

### Issue 4: adr-strategic-analyzer.md quality gate is aspirational for dogfooding

The quality gate says "Evolution stage classifications are backed by web research (not just vibes)." For a Claude Code plugin's own components, web research yields nothing actionable. The classification method says `WebSearch "[component] alternatives [year]"` -- searching "Claude Code SKILL.md agent system alternatives 2026" will return blog posts about AI coding assistants, not competing architecture governance frameworks.

**Severity:** Low. The quality gate should allow codebase-evidence-only classification for components where web research is not applicable.

## Suggested Fixes

### Fix 1: Add web research scoping to adr-strategic-analyzer.md

In the `## Step 2: Evolution Stage Classification` section, add after "Classification method:":

```markdown
**Research scoping:**
- For components that appear genesis-stage (no known alternatives, novel synthesis), skip web
  research and classify based on codebase evidence + domain knowledge. Document WHY web research
  was skipped: "No vendor landscape exists for [component description]."
- Reserve web research for components where alternatives plausibly exist (Product/Commodity candidates).
```

### Fix 2: Make map.md commit optional

Change Step 6 from:
```
6. Commit: `docs(adr): generate Wardley strategic analysis for [N] components`
```
To:
```
6. Offer to commit changes (metadata updates to ADRs and state.toml)
   - Only commit if Evolution-Stage metadata was actually added to ADRs
   - Commit message: `docs(adr): add Wardley evolution stages to [N] ADRs`
```

### Fix 3: Define output artifact for map.md

Add to map.md after Step 5:

```markdown
5a. Write full strategic analysis to `{adr_directory}/.state/wardley-analysis.md`
    - Overwrite on each run (latest analysis is canonical)
    - This file is the reference artifact; terminal output is the summary
```

### Fix 4: DRY the installer command list

In `src/install.js`, extract the duplicated command list:

```javascript
const COMMANDS = [
  // v1
  'help', 'list', 'new', 'review', 'transition', 'search', 'impact', 'audit',
  'retro', 'evaluate', 'rearchitect', 'init', 'architect', 'eli5', 'fitness',
  'drift', 'debt', 'guard', 'digest', 'timeline', 'status', 'health', 'hooks',
  // v2
  'scope', 'challenge', 'reflect', 'evidence', 'map', 'diagram', 'trace',
  'advise', 'tradeoff', 'risk', 'export', 'views', 'federate', 'radar', 'govern',
];
```

Use this single constant for both directory creation and file copying.

## Verdict

**PASS WITH NOTES**

The `/blueprint:map` command and `adr-strategic-analyzer` agent are well-designed. The Wardley framework integration is sound, the evolution stage taxonomy is correctly defined in `taxonomy.toml`, and the agent's execution flow (inventory -> classify -> detect misalignment -> recommend) follows Wardley's methodology faithfully.

When actually applied to Blueprint's own codebase, the strategic analysis reveals a healthy architecture: genesis-stage components are being built custom (correct), commodity components are npm dependencies (correct), and there are no serious build-vs-buy misalignments.

**Notes requiring action:**

1. The agent's web research requirement is too rigid for genesis-stage components where no vendor landscape exists. Add scoping guidance. (Low)
2. Auto-commit behavior should be opt-in, not default. (Medium)
3. The analysis output has no persistent artifact path -- repeated runs are ephemeral. (Medium)
4. `src/install.js` has a DRY violation in the command list that the map analysis surfaced as a maintenance risk. (Low, but ironic for a governance tool)

All four issues are fixable with targeted edits. None represents a design flaw in the Wardley mapping approach itself.
