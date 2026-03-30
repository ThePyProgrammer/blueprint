# Dogfood Test: /blueprint:trace
**Date:** 2026-03-31
**Target:** Blueprint's own ADRs (41 accepted)
**Command tested:** /blueprint:trace

## Traceability Matrix

Coverage: **0/41** accepted ADRs have fitness functions (**0%**)

| ADR | Title | Fitness Functions | Type | Status |
|-----|-------|------------------|------|--------|
| 0001 | Use ADRs to document blueprint's own decisions | -- | NONE | Gap |
| 0002 | Decompose into focused sub-skills | -- | NONE | Gap |
| 0003 | Use TOML over JSON for config DSL | -- | NONE | Gap |
| 0004 | Encode lifecycle as state machine data | -- | NONE | Gap |
| 0005 | Adopt cranky senior engineer persona | -- | NONE | Gap |
| 0006 | Use thin router pattern for command dispatch | -- | NONE | Gap |
| 0007 | Separate evaluation into five dimensions | -- | NONE | Gap |
| 0008 | Agents return inline output, not files | -- | NONE | Gap |
| 0009 | Devil's advocate on review, not accept | -- | NONE | Gap |
| 0010 | Use relationship graph for impact analysis | -- | NONE | Gap |
| 0011 | Two-step verify in retrospective | -- | NONE | Gap |
| 0012 | Extensible taxonomy for root causes | -- | NONE | Gap |
| 0013 | Infer ownership from git history | -- | NONE | Gap |
| 0014 | Anti-pattern tests as first-class | -- | NONE | Gap |
| 0015 | Proactive intervention for undocumented decisions | -- | NONE | Gap |
| 0016 | Single responsibility per agent | -- | NONE | Gap |
| 0017 | Package as Claude Code plugin | -- | NONE | Gap |
| 0018 | Contextual suggestions in help and list | -- | NONE | Gap |
| 0019 | Session state persistence | -- | NONE | Gap |
| 0020 | Parallel evaluation agents | -- | NONE | Gap |
| 0021 | Hegelian dialectic for review | -- | NONE | Gap |
| 0022 | Config as domain-specific language | -- | NONE | Gap |
| 0023 | Generate fitness functions from ADRs | -- | NONE | Gap |
| 0024 | Temporal drift detection over point audits | -- | NONE | Gap |
| 0025 | Track decision debt with trigger monitoring | -- | NONE | Gap |
| 0026 | Pre-commit architecture guard | -- | NONE | Gap |
| 0027 | Stakeholder digest for non-technical audience | -- | NONE | Gap |
| 0028 | Architecture evolution timeline | -- | NONE | Gap |
| 0029 | Bootstrap from existing context | -- | NONE | Gap |
| 0030 | Generate ARCHITECTURE.md from ADRs | -- | NONE | Gap |
| 0031 | ELI5 plain-English explanations | -- | NONE | Gap |
| 0032 | Visual knowledge graph dashboard | -- | NONE | Gap |
| 0033 | Self-diagnostic health check | -- | NONE | Gap |
| 0034 | Automatic hooks for workflow integration | -- | NONE | Gap |
| 0035 | Research-backed paradigm integration | -- | NONE | Gap |
| 0036 | DDD bounded context scoping | -- | NONE | Gap |
| 0037 | Dual review protocol | -- | NONE | Gap |
| 0038 | Reflexion model conformance checking | -- | NONE | Gap |
| 0039 | Epistemic status tracking | -- | NONE | Gap |
| 0040 | Wardley mapping strategic context | -- | NONE | Gap |
| 0041 | Configurable governance tiers | -- | NONE | Gap |

**Gaps:** 41 ADRs have no fitness function
**Orphans:** 0 fitness functions have no ADR (there are no fitness functions at all)

### Partial enforcement (not fitness functions)

`src/verify.js` checks that expected command files, agent files, and config files exist on disk. This partially validates ADR-0002 (sub-skill decomposition) and ADR-0017 (plugin packaging) structurally, but it is an installation verifier, not an architecture fitness function. It does not assert behavioral invariants or run in CI.

## Issues Found

### Issues with the trace skill definition (`commands/trace.md`)

1. **Search patterns too narrow.** The skill says to glob for `*.arch.test.*` and `*.fitness.*` but Blueprint is a markdown-and-TOML skill system with a single `bin/cli.js` entry point. There are no conventional test files to find. The trace command needs to also recognize:
   - Structural assertions in install/verify scripts (like `src/verify.js`)
   - Inline validation logic within skill markdown files (e.g., `commands/guard.md` describes enforcement but is not executable)
   - Claude Code hooks configured in `.claude/settings.json` as a form of triggered fitness function
   - TOML-based constraint definitions in `config/` files (e.g., `lifecycle.toml` encodes the state machine from ADR-0004)

2. **No fallback for skill-based codebases.** Blueprint is a Claude Code plugin -- its "code" is mostly markdown skill definitions consumed by an LLM, not compiled/interpreted code. The trace skill assumes a traditional software project with test frameworks. It has no strategy for detecting enforcement in LLM-prompt-based systems where the "fitness function" may be a rule embedded in a markdown file.

3. **Taxonomy classification assumes executable tests exist.** The Ford/Parsons taxonomy (Atomic/Holistic, Triggered/Continual, etc.) only makes sense if there is something to classify. With 0% coverage the taxonomy is dead weight. The skill should surface the gap severity before attempting classification.

4. **No severity tiers for gaps.** Not all gaps are equal. ADR-0023 (Generate fitness functions from ADRs) having no fitness function is deeply ironic -- the ADR about generating fitness functions is itself unenforced. ADR-0001 (Use ADRs for own decisions) is self-evidently enforced by the existence of the 41 ADRs. The trace skill should distinguish between:
   - **Self-evident** decisions (existence is proof of compliance)
   - **Structurally enforceable** decisions (could have automated tests)
   - **Behaviorally enforceable** decisions (need runtime/integration checks)
   - **Human-only** decisions (persona, communication style -- no automation possible)

5. **Missing: scan for enforcement-by-convention.** Several ADRs are enforced by the file structure itself:
   - ADR-0002 (sub-skills): enforced by `commands/` directory having one file per command
   - ADR-0003 (TOML config): enforced by `config/*.toml` existing (no JSON config files present)
   - ADR-0016 (single responsibility per agent): enforced by `agents/` having one file per agent
   - ADR-0017 (plugin packaging): enforced by `package.json` + `.claude-plugin/plugin.json`
   The trace skill should detect these structural patterns as implicit fitness functions.

6. **`last_trace` in state.toml is never written.** The skill says to update `last_trace` but this is a prompt-based skill -- it cannot actually write to disk unless the LLM is instructed to do so with explicit file-write steps. The instruction is aspirational.

## Suggested Fixes

### Fix 1: Add structural-convention detection to trace skill

Add a step between steps 2 and 3 in `commands/trace.md`:

```
2b. **Scan for enforcement-by-convention:**
    - File-per-X patterns (one command file per skill = ADR-0002 compliance)
    - Config format consistency (all config in TOML, none in JSON = ADR-0003)
    - Directory structure invariants (agents/ has single-purpose files = ADR-0016)
    - Classify these as: Atomic/Triggered/Static/Automated (structural)
```

### Fix 2: Add gap severity classification

```
4b. **Classify gap severity:**
    - SELF-EVIDENT: Decision compliance is proven by its own existence
    - STRUCTURAL: Could be enforced by file/dir pattern checks
    - BEHAVIORAL: Needs runtime or integration testing
    - HUMAN-ONLY: Requires manual review (persona, tone, naming)
```

### Fix 3: Add LLM-skill-aware search patterns

The trace skill should search for:
- `hooks` entries in `.claude/settings.json` that reference blueprint commands
- Validation logic in `src/verify.js` and similar files
- Guard/enforcement language in skill markdown files (`MUST`, `NEVER`, `always check`)
- TOML constraint definitions (lifecycle FSM transitions, taxonomy enums)

### Fix 4: Create actual fitness functions for Blueprint itself

Priority fitness functions Blueprint should have (ordered by irony level):

1. **ADR-0023** (fitness functions from ADRs): The meta-irony -- write a fitness function that asserts fitness functions exist
2. **ADR-0003** (TOML config): `find config/ -name "*.json" | wc -l` should equal 0
3. **ADR-0002** (sub-skills): Assert each command in help text has a matching `commands/*.md` file
4. **ADR-0004** (lifecycle state machine): Assert `lifecycle.toml` defines all valid transitions and no command references invalid states
5. **ADR-0016** (single responsibility): Assert each agent file has exactly one `description:` field and it matches a single concern
6. **ADR-0006** (thin router): Assert `commands/blueprint.md` (the router) contains no business logic, only dispatch rules

### Fix 5: Wire trace skill to actually write `last_trace`

Add explicit instruction: "After displaying the matrix, write today's date to `last_trace` in `{adr_directory}/.state/state.toml` using the Edit tool."

## Verdict

**FAIL**

### Rationale

The `/blueprint:trace` command, when executed against Blueprint's own codebase, reveals two compounding failures:

1. **Blueprint has zero fitness function enforcement.** All 41 accepted ADRs have governance gaps. The project that advocates "Architecture Decision Records with teeth" has no teeth of its own. ADR-0023 literally says "generate executable architecture fitness functions from ADRs" and is itself unenforced -- a hall-of-mirrors irony.

2. **The trace skill definition is not equipped to find enforcement in non-traditional codebases.** It assumes test frameworks, CI pipelines, and compiled code. Blueprint is a markdown-and-TOML skill system for an LLM. The skill would correctly report 0% even if some structural enforcement existed (like `src/verify.js`), because it does not know to look for it.

The trace skill needs to be broadened to handle LLM-plugin codebases, and Blueprint itself needs to practice what it preaches by generating and maintaining fitness functions for its own ADRs.
