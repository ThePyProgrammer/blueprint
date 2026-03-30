# Dogfood Test: /blueprint:scope
**Date:** 2026-03-31
**Target:** Blueprint's own codebase
**Command tested:** /blueprint:scope discover

## Execution Log

### Step 1: Read the skill definition
Read `/commands/scope.md` in full. The skill defines five modes: Discover, Assign, List, Add, Remove. For "Discover" mode it instructs:
1. Read `agents/adr-context-mapper.md`
2. Spawn that agent with project root, ADR directory, existing ADR filenames, and existing `{adr_directory}/.state/contexts.toml`
3. Present context map to user
4. Offer to write `contexts.toml`

### Step 2: Read the agent definition
Read `/agents/adr-context-mapper.md`. The agent defines a 5-step execution flow:
1. Directory & Module Analysis
2. Boundary Detection
3. Ownership Analysis
4. ADR Assignment
5. Context Map Generation

### Step 3: Directory Structure Analysis
Analyzed the top-level directory structure of Blueprint:

| Directory | Type | Domain Signal |
|-----------|------|---------------|
| `commands/` (41 files) | Domain-aligned | Skill definitions -- each is a user-facing command |
| `agents/` (21 files) | Domain-aligned | Specialized AI agents, one per architectural concern |
| `config/` (10 files) | Infrastructure | TOML config schemas: lifecycle, taxonomy, relationships, state, etc. |
| `src/` (4 files) | Infrastructure | Plugin installation mechanics (install.js, paths.js, verify.js, claude-md.js) |
| `docs/adr/` (41 ADRs + template + README) | Domain-aligned | The ADR documents themselves |
| `papers/` | Reference | Research papers backing v2 decisions |
| `outputs/` | Generated | Research output artifacts |
| `assets/` | Static | Dashboard HTML template |
| `bin/` | Infrastructure | CLI entry point |
| `.claude-plugin/` | Infrastructure | Plugin manifest |

### Step 4: Bounded Context Analysis
Checked for logical groupings within each directory:

**commands/ groupings identified:**

| Proposed Context | Commands | Rationale |
|-----------------|----------|-----------|
| ADR Lifecycle | new, review, transition, rearchitect, search, list | Core CRUD and state machine for ADRs |
| Architecture Analysis | evaluate, audit, drift, fitness, guard, trace, reflect | Codebase-vs-decision verification |
| Strategic Planning | scope, map, tradeoff, risk, radar, diagram, views | Higher-level architecture visualization and DDD |
| Communication | help, eli5, digest, timeline, status, export | Human-facing explanation and reporting |
| System Operations | init, health, hooks, federate, govern, debt | Meta-operations on the ADR system itself |
| Decision Quality | challenge, evidence, advise | Improving individual ADR quality |
| Router | blueprint | Top-level command dispatch |

**agents/ groupings identified:**

| Proposed Context | Agents | Rationale |
|-----------------|--------|-----------|
| Evaluation Team | consistency-auditor, bug-surface-mapper, maintainability-assessor, testing-strategy-evaluator, conways-law-analyzer | The 5-dimension evaluation team (ADR-0007, ADR-0020) |
| Review Pipeline | devils-advocate, forces-evaluator | Challenge and forces analysis during review |
| Codebase Mapping | architect-cartographer, context-mapper, diagram-generator, strategic-analyzer | Produce structural views of the codebase |
| Evidence & Quality | evidence-auditor, reflexion-analyzer, risk-mapper, tradeoff-analyzer | Assess decision quality and epistemic status |
| Retrospective | retrospective | Post-fix analysis |
| Research | researcher | Technology research for new ADRs |
| Shared | persona | Cross-cutting personality definition used by all agents |
| Meta | impact-analyzer, compliance-auditor, federation-indexer | System-level analysis across ADRs |

**config/ groupings identified:**

All config files serve the ADR system as a whole -- no domain separation exists within config. Files: `lifecycle.toml`, `taxonomy.toml`, `relationships.toml`, `state.toml`, `contexts.toml`, `evidence.toml`, `governance.toml`, `radar.toml`.

### Step 5: Git Ownership Analysis

```
git log --format='%an' --since='6 months ago' | sort | uniq -c | sort -rn
    172 Prannaya Gupta
```

Single contributor. Ownership analysis is a no-op -- every file is owned by the same person. This means Conway's Law alignment is trivially satisfied (one person, one architecture), and context boundaries are purely structural rather than organizational.

### Step 6: ADR-to-Context Assignment

Attempted to map all 41 ADRs to the discovered contexts:

| Context | ADRs | Count |
|---------|------|-------|
| **ADR Lifecycle** | 0004, 0009, 0019, 0021, 0037 | 5 |
| **Architecture Analysis** | 0007, 0014, 0020, 0023, 0024, 0026, 0038 | 7 |
| **Strategic Planning** | 0036, 0040 | 2 |
| **Communication** | 0018, 0027, 0028, 0031, 0032 | 5 |
| **System Operations** | 0017, 0029, 0033, 0034, 0041 | 5 |
| **Decision Quality** | 0011, 0035, 0039 | 3 |
| **Plugin Architecture** | 0002, 0006, 0008, 0016 | 4 |
| **Config & Data Model** | 0003, 0010, 0012, 0022, 0025 | 5 |
| **Cross-cutting** | 0001, 0005, 0013, 0015, 0030 | 5 |

Total mapped: 41/41

### Step 7: Context Map Relationships

| Upstream | Downstream | Pattern | Evidence |
|----------|-----------|---------|----------|
| Config & Data Model | ADR Lifecycle | Customer-Supplier | `commands/transition.md` reads `config/lifecycle.toml`; `commands/new.md` reads `config/taxonomy.toml` |
| Config & Data Model | Architecture Analysis | Customer-Supplier | `commands/evaluate.md` reads `config/taxonomy.toml`; `commands/audit.md` reads `config/lifecycle.toml` |
| ADR Lifecycle | Architecture Analysis | Customer-Supplier | Analysis commands consume ADR files produced by lifecycle commands |
| Plugin Architecture | All contexts | Shared Kernel | `agents/persona.md` imported by all agent-spawning commands |
| Architecture Analysis | Communication | Customer-Supplier | `commands/status.md` reads state produced by audit/evaluate/drift |
| Strategic Planning | Architecture Analysis | Partnership | `commands/scope.md` produces context boundaries consumed by impact analysis |
| System Operations | All contexts | Open Host Service | `commands/init.md` bootstraps the entire system; `commands/health.md` validates all state files |

## Findings

### Contexts Discovered

Blueprint has **7 meaningful bounded contexts** (plus "cross-cutting" for truly global ADRs):

1. **ADR Lifecycle** -- Core state machine: create, review, transition, search, list ADRs
2. **Architecture Analysis** -- Verify codebase conforms to decisions: evaluate, audit, drift, fitness, guard
3. **Strategic Planning** -- DDD scoping, Wardley maps, tradeoffs, risk, technology radar, diagrams
4. **Communication** -- Human-facing outputs: help, eli5, digest, timeline, status, export
5. **System Operations** -- Meta-operations: init, health, hooks, federate, govern, debt
6. **Decision Quality** -- Evidence, challenge, advise, retrospective
7. **Plugin Architecture** -- How Blueprint packages/distributes itself (cross-cutting structural concern)
8. **Config & Data Model** -- TOML schemas, relationship graph, taxonomy (infrastructure context)

### Key Observations

- **Blueprint is not a typical application codebase.** It has no `src/payments/` or `src/orders/`. The "modules" are markdown skill files and agent definitions. The agent's heuristics (grep for classes, interfaces, imports) are tailored for application codebases, not for tooling/plugin codebases like Blueprint.
- **Single owner means ownership analysis adds nothing.** The agent spends a full step on git ownership, which is useless for solo projects. There is no fallback logic for single-contributor repos.
- **The contexts are functional slices, not domain slices.** Blueprint doesn't have "domain models" in the DDD sense. Its bounded contexts are functional groupings of commands by purpose, which is a valid but different kind of boundary than what the agent instructions assume.

## Issues Found

### Issue 1: CRITICAL -- `.state/` directory path mismatch
The `scope.md` skill references `{adr_directory}/.state/contexts.toml` throughout. But Blueprint's actual `contexts.toml` lives at `config/contexts.toml`, NOT at `docs/adr/.state/contexts.toml`. There is no `.state/` directory inside `docs/adr/` at all.

The `state.toml` file (which stores `adr_directory`) is also at `config/state.toml` and has `adr_directory = ""` (empty), meaning the auto-detection logic would need to find `docs/adr/` and then look for `docs/adr/.state/` which does not exist.

**Impact:** The Discover flow would fail at step 2 (reading existing contexts) and step 4 (writing contexts) because the target path does not exist. The skill and the actual plugin layout disagree on where state lives.

### Issue 2: MODERATE -- Agent assumes application codebase structure
The `adr-context-mapper.md` agent's Step 1 says to grep for "Model definitions (class, interface, type, struct)" and "Imports from other domain directories." Blueprint is a collection of markdown files and 4 small JS files. The agent's heuristics would find almost nothing useful.

**Impact:** The agent would produce a thin, unhelpful analysis because its detection signals are calibrated for application code, not for tooling/documentation codebases.

### Issue 3: MODERATE -- No fallback for single-contributor repos
Step 3 (Ownership Analysis) instructs `git log --format='%an' -- <path>` for each context. When there is only one contributor, the entire step produces no differentiating information. The agent does not have instructions for what to do when ownership is uniform.

### Issue 4: MINOR -- Quality gate is unrealistic for non-application codebases
The quality gate requires "Every identified context has a root path, key models, and at least one governing ADR." For Blueprint, there are no "key models" in the DDD sense (no User, Order, Payment entities). The gate would force the agent to fabricate model names or fail the check.

### Issue 5: MINOR -- Missing error handling for empty `adr_directory`
The `state.toml` has `adr_directory = ""`. The scope skill says to auto-detect (`docs/adr/` -> `docs/decisions/` -> `adr/` -> `decisions/`), but the auto-detection instructions are only in the Shared Context section header comment, not as an explicit procedural step. If the agent reads `state.toml`, gets an empty string, and does not fall through to auto-detection, it would fail silently.

### Issue 6: MINOR -- No mention of `config/` as state location
Blueprint stores state in `config/` (at the plugin root level), not in `{adr_directory}/.state/`. The skill definition never mentions `config/` as an alternative state location. This creates a conceptual split: the skill was designed for installed-in-project Blueprint, but the plugin source itself organizes things differently.

### Issue 7: MINOR -- Skill does not handle the case where the codebase IS the ADR tool
A dogfooding scenario where the codebase is the ADR system itself is not accounted for. The skill's "discover" flow assumes it is analyzing a target project, not analyzing itself. There is no self-referential guard or special handling.

## Suggested Fixes

### Fix 1: Resolve `.state/` path ambiguity (Critical)
Add an explicit resolution step at the top of the Discover flow:

```markdown
0. **Resolve state directory:**
   - Read `config/state.toml` for `adr_directory`
   - If empty, auto-detect: check `docs/adr/`, `docs/decisions/`, `adr/`, `decisions/`
   - State files live at `{adr_directory}/.state/` when installed in a project,
     OR at `config/` when running from the plugin source directory
   - Create `{adr_directory}/.state/` if it does not exist
```

### Fix 2: Add codebase-type detection to the agent
Add a preliminary step to `adr-context-mapper.md`:

```markdown
## Step 0: Codebase Type Detection

Before applying heuristics, determine the codebase type:
- **Application codebase:** Has `src/`, domain directories, model classes -> use standard DDD heuristics
- **Tooling/plugin codebase:** Primarily config, scripts, markdown -> use functional grouping heuristics
- **Monorepo:** Has `packages/` or `apps/` -> analyze each package separately

For tooling codebases, replace "key models" with "key abstractions" and
"ubiquitous language" with "domain vocabulary."
```

### Fix 3: Make ownership analysis conditional
In `adr-context-mapper.md` Step 3, add:

```markdown
If only 1 contributor exists, skip detailed ownership analysis and note:
"Single-contributor project -- ownership boundaries are structural, not organizational."
```

### Fix 4: Relax quality gate for non-application codebases
Change the quality gate from "key models" to "key abstractions or models" and allow
contexts without traditional DDD models if the codebase type is tooling/infrastructure.

### Fix 5: Add explicit `adr_directory` resolution procedure
In `scope.md` Shared Context section, replace the parenthetical with an explicit step:

```markdown
1. Read `config/state.toml` (or `{plugin_root}/config/state.toml` if running as plugin source)
2. Extract `adr_directory`. If empty string:
   a. Check for `docs/adr/` -- if exists, use it
   b. Check for `docs/decisions/` -- if exists, use it
   c. Check for `adr/` -- if exists, use it
   d. Check for `decisions/` -- if exists, use it
   e. If none found, error: "No ADR directory found. Run /blueprint:init first."
3. Ensure `{adr_directory}/.state/` exists, create if needed
```

## Verdict

**PASS WITH NOTES**

The skill definition is well-structured and the agent instructions are thorough for their intended use case (application codebases with multiple contributors). However, the critical path mismatch on `.state/` directory location would cause a runtime failure on Blueprint's own codebase, and the heuristics are miscalibrated for non-application codebases. The command works conceptually but would produce poor results or outright errors when dogfooded.

**Summary of issues by severity:**
- 1 CRITICAL (state path mismatch -- would cause runtime failure)
- 2 MODERATE (agent heuristics assume app codebase; no single-contributor fallback)
- 4 MINOR (quality gate rigidity, empty adr_directory handling, missing config/ reference, no self-referential guard)
