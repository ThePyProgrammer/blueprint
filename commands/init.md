---
name: blueprint:init
description: >
  Bootstrap blueprint onto an existing codebase. Scans for existing architecture context
  (.planning/, .research/, CLAUDE.md, existing code, git history), creates the ADR directory
  with template and lifecycle docs, infers ADRs from discovered decisions, and generates
  ARCHITECTURE.md. Use when: starting blueprint on a new project, "init blueprint",
  "bootstrap adrs", "set up architecture docs", "onboard blueprint", or first time using
  blueprint in a project.
---

# Initialize Blueprint

Bootstraps the full blueprint documentation system onto an existing codebase. Scans every
available source of architectural context and produces:

1. **ADR directory** with template, lifecycle README, and index
2. **Inferred ADRs** from existing decisions found in the codebase
3. **ARCHITECTURE.md** via the architect-cartographer agent
4. **Populated config** (state.toml with detected paths, relationships.toml seeded)

This is a one-time setup command. If `docs/adr/` already exists with ADRs, suggest
`/blueprint:help` instead.

## Process

### Step 1: Detect Existing Context

Scan the project root for every source of architectural decisions. Cast a wide net —
the goal is to find decisions that were made but never formally documented.

**Scan these locations (in order of richness):**

```
.planning/PROJECT.md          — GSD project context, key decisions table
.planning/REQUIREMENTS.md     — what was scoped in/out and why
.planning/ROADMAP.md          — phase structure decisions
.planning/research/           — STACK.md, ARCHITECTURE.md, FEATURES.md, PITFALLS.md
.planning/STATE.md            — current project state
.planning/config.json         — workflow preferences (tech stack, parallelization)
CLAUDE.md                     — project conventions, constraints, stack
README.md                     — project description, sometimes tech choices
docs/                         — any existing architecture docs
package.json / pyproject.toml / go.mod / Cargo.toml  — tech stack, dependencies
docker-compose.yml / Dockerfile — deployment decisions
.env.example                  — configuration approach
tsconfig.json / .eslintrc     — tooling decisions
```

**From git history:**

```bash
# Key decisions often in early commits
git log --oneline --reverse | head -30

# Commit messages mentioning "choose", "switch to", "use", "adopt", "replace"
git log --oneline --all --grep="choose\|switch to\|adopt\|replace\|migrate" | head -20
```

For each source found, extract:
- What decision was made (technology, pattern, boundary, constraint)
- Why (if documented — rationale, trade-offs)
- When (commit date or file date)
- What alternatives were considered (if documented)

### Step 2: Classify Discovered Decisions

Group discovered decisions into categories from `config/taxonomy.toml`:

- Technology Choice (stack, database, framework, libraries)
- Architecture Pattern (monolith/microservice, API style, data flow)
- Data Model (schema decisions, storage strategy)
- Deployment Strategy (containerization, hosting, CI/CD)
- Authentication / Authorization (auth approach, deferred or implemented)
- Testing Strategy (framework choice, coverage approach)
- Process / Workflow (coding conventions, branching strategy)
- Integration Strategy (external APIs, data sources)
- Out-of-scope decisions (explicit exclusions with reasoning)

**Prioritize by impact:** High-impact decisions that constrain future work get ADRs first.
Low-impact decisions (linter config, date formatting library) get skipped.

### Step 3: Present Discovery Report

Before creating anything, present what was found to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Context Discovered

| Source | Found | Decisions Extracted |
|--------|-------|-------------------|
| .planning/PROJECT.md | Yes/No | [N] |
| .planning/research/ | Yes/No | [N] |
| CLAUDE.md | Yes/No | [N] |
| package.json | Yes/No | [N] |
| git history | Yes/No | [N] |
| ... | ... | ... |

## Proposed ADRs ([N] total)

| # | Title | Source | Category |
|---|-------|--------|----------|
| 0001 | Use ADRs for architectural decisions | (meta) | Process |
| 0002 | [inferred decision] | [source file] | [category] |
| 0003 | [inferred decision] | [source file] | [category] |
| ... | ... | ... | ... |

## Will Also Create

- docs/adr/README.md — lifecycle documentation and index
- docs/adr/template.md — ADR template
- docs/ARCHITECTURE.md — bird's-eye codemap (via architect agent)
- config/state.toml — populated with detected paths
```

Ask the user:
- "Create all proposed ADRs?" / "Let me pick" / "Adjust"
- If "Let me pick" — present list with checkboxes
- If "Adjust" — let user add, remove, or modify proposed ADRs

### Step 4: Create ADR Directory Structure

```bash
mkdir -p docs/adr
```

Write `docs/adr/template.md` — the standard ADR template with Metadata table, Context,
Options Considered, Decision (Alexandrian prologue), Rationale, Consequences, References.

Write `docs/adr/README.md` — lifecycle documentation with:
- State machine diagram (Proposed → Accepted/Rejected/Deferred → Deprecated/Superseded)
- Status definitions and transition rules
- File naming convention (NNNN-kebab-case-title.md)
- Principles (one decision per ADR, immutable history, honest consequences)
- Index table (initially populated with the ADRs about to be created)

### Step 5: Generate ADRs

For each approved ADR:

1. Write the ADR file: `docs/adr/NNNN-title.md`
2. Status: `Accepted` (these are decisions already in effect, not proposals)
3. Context: extracted from the source where the decision was found
4. Options Considered: if the source documented alternatives, include them.
   If not, include at minimum the chosen option and "Status quo / do nothing"
5. Decision: Alexandrian prologue format
6. Consequences: infer from what's observable in the codebase
7. References: link to the source file where the decision was found

**ADR-0001 is always "Use ADRs for architectural decisions"** — the meta-ADR that
establishes the process. Include it automatically.

**Quality bar:** Even inferred ADRs must have real context and consequences. Don't
generate vacuous ADRs like "Use JavaScript" with no context. If a decision is too
trivial to have meaningful context, skip it.

### Step 6: Generate ARCHITECTURE.md

After ADRs are written, spawn the architect-cartographer agent to generate
`docs/ARCHITECTURE.md`:

- Read `agents/adr-architect-cartographer.md` and `agents/persona.md`
- Spawn with: project root, ADR directory, list of newly created ADR filenames
- The agent produces the codemap, invariants (from the new ADRs), and cross-cutting concerns

### Step 7: Populate Config

Update `config/state.toml`:
- Set `adr_directory` to the detected/created path
- Set `project_root` to the current working directory
- Set `last_adr_created` to today

Seed `config/relationships.toml` with nodes for all created ADRs.

### Step 8: Commit

Commit all created files in a single atomic commit:

```
docs: initialize blueprint — [N] ADRs, ARCHITECTURE.md, lifecycle docs
```

Include: all ADR files, README.md, template.md, ARCHITECTURE.md.

### Step 9: Present Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► INITIALIZED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Artifact | Location |
|----------|----------|
| ADRs | docs/adr/ ([N] decisions) |
| Template | docs/adr/template.md |
| Lifecycle | docs/adr/README.md |
| Architecture | docs/ARCHITECTURE.md |
| Index | docs/adr/README.md |

Run /blueprint:help for the full command reference.
Run /blueprint:evaluate to assess architecture health.
Run /blueprint:list to see all decisions.
```

## Edge Cases

**No existing decisions found:** Create just ADR-0001 (meta-ADR), the template, lifecycle
README, and ARCHITECTURE.md. Suggest `/blueprint:new --research` for the first real decision.

**ADR directory already exists:** Check if it has ADRs. If yes, abort with "Blueprint is
already initialized. Use `/blueprint:help` for commands." If the directory exists but is
empty, proceed with initialization.

**Conflicting documentation:** If .planning/PROJECT.md and CLAUDE.md disagree on tech stack,
flag the conflict and ask the user which is authoritative before creating the ADR.

**.planning/research/ is rich:** GSD research files (STACK.md, FEATURES.md, ARCHITECTURE.md,
PITFALLS.md) are goldmines. Extract:
- From STACK.md: technology choices with rationale
- From FEATURES.md: scope decisions (what's in v1, what's deferred, what's excluded)
- From ARCHITECTURE.md: structural decisions (components, boundaries, data flow)
- From PITFALLS.md: constraint decisions (what to avoid and why)

**Large existing codebase:** Don't try to create an ADR for every library import. Focus on
decisions that constrain future work — the things a new developer needs to know.
