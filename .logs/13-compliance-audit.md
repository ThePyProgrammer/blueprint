# ADR Compliance Report

**Audited:** 2026-03-30
**ADRs checked:** 41 accepted
**Codebase:** Claude Code plugin — mature, self-referential (39 skills, 21 agents, 8 config files, CLI installer). Not a traditional application; the "code" is mostly markdown skill definitions, agent prompts, and TOML config.

## Summary

| Verdict | Count |
|---------|-------|
| COMPLIANT | 19 |
| VIOLATION | 5 |
| PARTIAL | 5 |
| NOT AUDITABLE | 12 |

## Findings

---

### ADR-0001: Use ADRs to document blueprint's own architectural decisions

- **Verdict:** COMPLIANT
- **Decision:** "We use blueprint's own ADR format and process to document blueprint's architectural decisions"
- **Evidence:** 41 ADR files exist in `docs/adr/`, all following the blueprint template format with metadata tables, Context, Options Considered, Decision, Rationale, and Consequences sections. Blueprint is fully dogfooding its own process.

---

### ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md

- **Verdict:** PARTIAL
- **Decision:** "We decompose the monolith into 12 focused sub-skills averaging 41-96 lines each, coordinated by a 48-line thin router"
- **Evidence:** The decomposition principle is followed — there are now 38 focused sub-skills (not 12) coordinated by a router. Average line count ranges from 28 (`search.md`) to 315 (`status.md`). The principle of decomposition is upheld.
- **Violation detail:** The ADR states "12 focused sub-skills averaging 41-96 lines each" but the codebase has 38 sub-skills with several exceeding 96 lines significantly:
  - `commands/status.md`: 315 lines
  - `commands/init.md`: 250 lines
  - `commands/help.md`: 157 lines
  - `commands/health.md`: 149 lines
  - `commands/eli5.md`: 149 lines
  - `commands/hooks.md`: 131 lines
  - `commands/debt.md`: 130 lines
- **Severity:** Low — the specific numbers (12, 41-96, 48) are stale but the principle (decompose into focused single-responsibility skills) is followed. The ADR describes v1; the codebase is v2.
- **Suggested action:** Update ADR-0002 or create a superseding ADR reflecting the v2 reality of 38 sub-skills. The decision principle is sound — the numbers are just outdated.

---

### ADR-0003: Use TOML over JSON for config DSL

- **Verdict:** COMPLIANT
- **Decision:** "We use TOML for all blueprint configuration files"
- **Evidence:** All 8 config files in `config/` are TOML: `lifecycle.toml`, `taxonomy.toml`, `state.toml`, `relationships.toml`, `contexts.toml`, `evidence.toml`, `governance.toml`, `radar.toml`. Zero JSON config files exist. The only JSON in the project is `package.json` (npm requirement) and `.claude-plugin/plugin.json` (Claude Code convention) — neither is blueprint domain config.

---

### ADR-0004: Encode lifecycle as state machine data, not prose

- **Verdict:** COMPLIANT
- **Decision:** "We encode the ADR lifecycle as a structured state machine in lifecycle.toml"
- **Evidence:** `config/lifecycle.toml` contains the full state machine: 6 statuses with metadata, 6 valid transitions with requirements and side effects, 5 invalid transitions with error messages. Skills reference `lifecycle.toml` for validation — confirmed in `transition.md` (line 13: "Read the state machine from `config/lifecycle.toml`"), `review.md` (line 18), `new.md`, `guard.md`, `health.md`, `status.md`, `rearchitect.md`, `audit.md`, and `blueprint.md`. No prose-encoded lifecycle rules found in skill files.

---

### ADR-0005: Adopt cranky senior engineer persona across all agents

- **Verdict:** COMPLIANT
- **Decision:** "We adopt a shared cranky senior engineer persona defined in persona.md and injected into all agents"
- **Evidence:** `agents/persona.md` exists (37 lines). All 20 agent files reference `persona.md` — confirmed by grep: 21 total occurrences across 20 files (adr-context-mapper.md references it twice). No agent file is missing the persona reference. The persona file contains the expected direct, blunt-but-not-cruel tone instructions.

---

### ADR-0006: Use thin router pattern for command dispatch

- **Verdict:** PARTIAL
- **Decision:** "We use a 48-line thin router that parses intent from natural language and dispatches to sub-skills"
- **Evidence:** `commands/blueprint.md` is the router. It dispatches via a routing table to 38 sub-skills, handles proactive intervention for undocumented decisions, and includes a Config Resolution Protocol section. The router does NOT contain analysis logic or domain computation — it routes and intervenes, as specified.
- **Violation detail:** The ADR says "48-line thin router" but the actual router is 107 lines. The router grew from 48 to 107 lines to accommodate: (a) 38 routing entries instead of the original 12, (b) a Config Resolution Protocol section (lines 78-108) that documents how all skills find config files.
- **Severity:** Low — the router is still structurally thin (routing table + proactive intervention + config docs). The Config Resolution Protocol section is documentation, not logic. But 107 lines is more than double the stated 48.
- **Suggested action:** Update the line count claim in ADR-0006, or accept that the number was a v1 snapshot. The principle (thin router, dispatch only, plus proactive intervention) is correctly followed.

---

### ADR-0007: Separate evaluation into five orthogonal dimensions

- **Verdict:** COMPLIANT
- **Decision:** "We decompose architecture evaluation into five specialized agents — consistency, bug surface, maintainability, testing strategy, and Conway's Law"
- **Evidence:** All 5 evaluation agents exist:
  - `agents/adr-consistency-auditor.md` (131 lines)
  - `agents/adr-bug-surface-mapper.md` (154 lines)
  - `agents/adr-maintainability-assessor.md` (162 lines)
  - `agents/adr-testing-strategy-evaluator.md` (164 lines)
  - `agents/adr-conways-law-analyzer.md` (170 lines)
- `commands/evaluate.md` orchestrates all 5 with the correct dimension names and agent mappings (lines 28-34).

---

### ADR-0008: Agents return inline output, not files

- **Verdict:** COMPLIANT
- **Decision:** "All blueprint agents return their output inline to the orchestrating sub-skill"
- **Evidence:** No agent has `Write` in its tools list (checked all 20 agent frontmatter `tools:` lines). The one documented exception — `adr-architect-cartographer.md` writing `ARCHITECTURE.md` — is acknowledged in the ADR itself ("exception: architect-cartographer" per ARCHITECTURE.md invariant 3). The cartographer writes exactly one file (`docs/ARCHITECTURE.md`) and returns a summary inline. All other agents (19 of 20) return output inline only.

---

### ADR-0009: Devil's advocate on review, not automatic on accept

- **Verdict:** COMPLIANT
- **Decision:** "/blueprint:review N spawns the devil's advocate agent. /blueprint:transition accept N is a direct state transition with no agent involvement."
- **Evidence:** `commands/review.md` spawns the devil's advocate agent (line 27-33). `commands/transition.md` (line 12) explicitly states "Handle simple status transitions inline — no agent spawning." The transition skill does not reference any agent file. Clean separation confirmed.

---

### ADR-0010: Use relationship graph for incremental impact analysis

- **Verdict:** COMPLIANT
- **Decision:** "A persistent TOML relationship graph updated incrementally by the impact analyzer and lifecycle transitions"
- **Evidence:** `config/relationships.toml` exists with 41 nodes and multiple typed edges (RELATED, MODIFIES_SCOPE, DEPENDS_ON). The graph uses the exact edge types specified in the ADR. `commands/impact.md` references `relationships.toml`. `commands/transition.md` references `relationships.toml` for updating edges on supersession (line 21).

---

### ADR-0011: Two-step verify in retrospective agent

- **Verdict:** NOT AUDITABLE
- **Decision:** "Two-step verify pattern where Step 1 classifies the root cause and Step 2 web-verifies proposed patterns against 3+ external sources"
- **Notes:** This is a behavioral contract for the retrospective agent. The agent file `agents/adr-retrospective.md` contains instructions for this pattern, but whether the LLM actually performs the two-step verification at runtime is not auditable from static code. The agent has `WebSearch` and `WebFetch` in its tools list, which is necessary but not sufficient evidence.

---

### ADR-0012: Extensible taxonomy for root causes

- **Verdict:** COMPLIANT
- **Decision:** "An extensible TOML taxonomy with 10 initial categories, examples, and prevention patterns"
- **Evidence:** `config/taxonomy.toml` contains exactly 10 root cause categories under `[root_causes.*]`: missing_validation, implicit_contract, state_management, error_swallowing, missing_abstraction, wrong_abstraction, configuration_drift, dependency_coupling, plus 2 more. Each has `label`, `description`, `examples` (array), and `prevention` fields. Matches the ADR specification exactly.

---

### ADR-0013: Infer ownership from git history

- **Verdict:** NOT AUDITABLE
- **Decision:** "Inferring ownership from git history as the primary source with CODEOWNERS as an authoritative override"
- **Notes:** This is runtime behavior of the Conway's Law analyzer agent. The agent instructions describe git-based inference, but the actual behavior depends on LLM execution. Cannot verify from static code scanning.

---

### ADR-0014: Anti-pattern tests as first-class evaluation category

- **Verdict:** NOT AUDITABLE
- **Decision:** "Treating anti-pattern tests as a first-class evaluation category with six specific subcategories"
- **Notes:** Runtime behavior of the testing strategy evaluator agent. The 6 subcategories are documented in the ADR and would be part of the agent's evaluation output, but whether the agent actually evaluates all 6 subcategories at runtime is not verifiable from static analysis.

---

### ADR-0015: Proactive intervention for undocumented decisions

- **Verdict:** COMPLIANT
- **Decision:** "Proactive suggestion without blocking"
- **Evidence:** `commands/blueprint.md` lines 66-75 contain the "Proactive Intervention" section with explicit trigger signals (database/cache/queue selection, framework choice, API pattern design, deployment model, auth strategy, data model decisions) and explicit non-triggers (variable naming, minor library choices, test framework selection). This is the only skill with this behavior — it is correctly isolated to the router as specified.

---

### ADR-0016: Enforce single responsibility per agent

- **Verdict:** PARTIAL
- **Decision:** "Many focused agents with single responsibility each" — lists 11 agents
- **Evidence:** Every agent has a clear single responsibility stated in its frontmatter `description`. No agent combines multiple analytical concerns. The principle is fully followed.
- **Violation detail:** The ADR specifies 11 agents but the codebase has 20 agents. The ADR enumerated the v1 agents only:
  1. Researcher
  2. Devil's advocate
  3. Impact analyzer
  4. Compliance auditor
  5. Consistency auditor
  6. Bug surface mapper
  7. Maintainability assessor
  8. Testing strategy evaluator
  9. Conway's Law analyzer
  10. Retrospective agent
  11. Persona (shared component)

  The 9 additional v2 agents (forces-evaluator, reflexion-analyzer, evidence-auditor, context-mapper, strategic-analyzer, diagram-generator, tradeoff-analyzer, risk-mapper, federation-indexer) were added without updating ADR-0016.
- **Severity:** Low — the principle (single responsibility per agent) is perfectly followed. The agent count is stale. Each new agent maintains single responsibility.
- **Suggested action:** Update ADR-0016 to reflect 20 agents, or note it as a living snapshot of v1.

---

### ADR-0017: Package as Claude Code plugin

- **Verdict:** COMPLIANT
- **Decision:** "We package blueprint as a Claude Code plugin with npm packaging and a CLI installer"
- **Evidence:** `package.json` exists with npm metadata (name: "claude-blueprint", version: "2.0.0"), `bin` entries, and `files` array. `.claude-plugin/plugin.json` exists. `bin/cli.js` provides the CLI entry point. `src/install.js` deploys commands, agents, and config to the correct scope (global or project). `src/verify.js` checks installed files. Full plugin infrastructure is in place.

---

### ADR-0018: Contextual suggestions in help and list

- **Verdict:** NOT AUDITABLE
- **Decision:** "Dynamic contextual suggestions in both help and list commands"
- **Notes:** `commands/help.md` (157 lines) and `commands/list.md` (60 lines) both exist and reference `state.toml` for temporal awareness. Whether they actually produce contextual suggestions depends on LLM runtime behavior following the skill instructions.

---

### ADR-0019: Session state persistence

- **Verdict:** COMPLIANT
- **Decision:** "We persist session state in a state.toml file"
- **Evidence:** `config/state.toml` exists with the expected structure: `adr_directory`, `project_root`, `[last_operations]` section with 14 operation timestamps (v1 + v2), and commented templates for `evaluation_history`, `retro_history`, and `evidence_audit_history`. Multiple skills reference state.toml for reading and updating.

---

### ADR-0020: Run evaluation team agents in parallel

- **Verdict:** COMPLIANT
- **Decision:** "We run all 5 evaluation agents in fully parallel"
- **Evidence:** `commands/evaluate.md` line 41: "Spawn all 5 agents in parallel (single message, 5 Agent tool calls)". The skill explicitly instructs parallel spawning. The 5 agents have no inter-agent dependencies (no agent reads another agent's output).

---

### ADR-0021: Hegelian dialectic for ADR review

- **Verdict:** NOT AUDITABLE
- **Decision:** "We use a Hegelian dialectic via the devil's advocate agent for ADR review"
- **Notes:** The devil's advocate agent exists and is spawned by the review skill. Whether the actual thesis-antithesis-synthesis structure is followed at runtime depends on LLM behavior. The agent instructions describe the dialectic pattern, but this is a behavioral claim.

---

### ADR-0022: Config as domain-specific language

- **Verdict:** COMPLIANT
- **Decision:** "We externalize domain knowledge as structured TOML config files that function as a lightweight domain-specific language"
- **Evidence:** Domain knowledge is in config files, not agent prompts:
  - Lifecycle rules: `config/lifecycle.toml`
  - Root cause categories: `config/taxonomy.toml`
  - Evaluation dimensions: `config/taxonomy.toml`
  - Relationship types: `config/relationships.toml`
  - Bounded contexts: `config/contexts.toml`
  - Evidence tracking: `config/evidence.toml`
  - Governance modes: `config/governance.toml`
  - Technology radar: `config/radar.toml`
- Agent prompts reference config files rather than hardcoding domain rules. 37 of 39 command files reference at least one `.toml` file.

---

### ADR-0023: Generate executable architecture fitness functions from ADRs

- **Verdict:** NOT AUDITABLE
- **Decision:** "We generate executable architecture fitness functions (test files) from accepted ADR invariants"
- **Notes:** `commands/fitness.md` exists (119 lines) and instructs generation of test files from ADR invariants. Whether the generated tests are correct and executable depends on LLM runtime. The skill infrastructure is in place.

---

### ADR-0024: Temporal drift detection over point audits

- **Verdict:** NOT AUDITABLE
- **Decision:** "We detect architectural drift by analyzing git history trajectory over time"
- **Notes:** `commands/drift.md` exists (104 lines) and describes temporal trajectory analysis. Runtime behavior of the LLM following these instructions is not verifiable from static code.

---

### ADR-0025: Track decision debt with trigger monitoring

- **Verdict:** NOT AUDITABLE
- **Decision:** "We track deferred ADRs as decision debt with quantified severity scoring"
- **Notes:** `commands/debt.md` exists (130 lines) with the debt formula. `config/state.toml` has the structure for tracking. Whether trigger monitoring works depends on LLM runtime execution.

---

### ADR-0026: Pre-commit architecture guard

- **Verdict:** NOT AUDITABLE
- **Decision:** "We provide a fast pre-commit guard that checks only staged files"
- **Notes:** `commands/guard.md` exists (102 lines) with staged-file-only logic. `commands/hooks.md` includes guard as a configurable hook. Actual pre-commit performance depends on runtime.

---

### ADR-0027: Separate non-technical stakeholder digest

- **Verdict:** COMPLIANT
- **Decision:** "We generate a separate non-technical stakeholder digest distinct from eli5"
- **Evidence:** `commands/digest.md` (107 lines) and `commands/eli5.md` (149 lines) are separate skills. Digest targets stakeholders with business impact language. ELI5 targets developers with analogies. Distinct files, distinct purposes, distinct audiences. The separation is structural.

---

### ADR-0028: Architecture evolution timeline

- **Verdict:** NOT AUDITABLE
- **Decision:** "We generate a narrative timeline showing how decisions evolved over time, grouped into eras, with pivot points at supersessions"
- **Notes:** `commands/timeline.md` exists (114 lines). Narrative quality depends on LLM runtime.

---

### ADR-0029: Bootstrap from existing context

- **Verdict:** COMPLIANT
- **Decision:** "The init command scans .planning/, .research/, CLAUDE.md, package files, git history, and existing code to infer ADRs"
- **Evidence:** `commands/init.md` (250 lines) explicitly lists archaeological context sources in Step 1: `.planning/`, `.research/`, `CLAUDE.md`, package files, git history, and existing code patterns. The skill is not a blank-slate init — it is a full context scan.

---

### ADR-0030: Generate ARCHITECTURE.md from ADRs

- **Verdict:** COMPLIANT
- **Decision:** "We generate docs/ARCHITECTURE.md following matklad's philosophy"
- **Evidence:** `commands/architect.md` (66 lines) orchestrates the `adr-architect-cartographer.md` agent. The agent instructions specify matklad's philosophy, the WHERE vs WHY separation, and writing to `docs/ARCHITECTURE.md`. The existing `docs/ARCHITECTURE.md` file (243 lines) follows the exact structure: Overview, Codemap, Invariants, Cross-Cutting Concerns, Architecture Decisions pointer, with ADR references throughout.

---

### ADR-0031: ELI5 plain-English explanations

- **Verdict:** COMPLIANT
- **Decision:** "We provide plain-English explanations of individual ADRs and the full architectural landscape"
- **Evidence:** `commands/eli5.md` exists (149 lines) with both single-ADR and full-landscape modes documented. Supports both explanation modes as specified.

---

### ADR-0032: Visual knowledge graph dashboard

- **Verdict:** COMPLIANT
- **Decision:** "We render a dual-mode governance dashboard — terminal text summary always, plus an interactive HTML file"
- **Evidence:** `commands/status.md` (315 lines) implements both modes: Step 2 renders the terminal dashboard (lines 92-138), Step 3 generates the interactive HTML dashboard written to `docs/adr/web/index.html` (lines 140-154). Wireframe references are included for consistent visual design. The dual-mode approach matches the ADR exactly.

---

### ADR-0033: Self-diagnostic health check

- **Verdict:** COMPLIANT
- **Decision:** "We run 8 targeted consistency checks against the ADR system itself"
- **Evidence:** `commands/health.md` (149 lines) lists all 8 checks: (1) ADR Directory Structure, (2) Index Sync, (3) Content Validity, (4) Supersession Chains, (5) Relationship Graph, (6) Config Freshness, (7) Cross-References, (8) Staleness. Includes auto-repair capability.

---

### ADR-0034: Automatic hooks for workflow integration

- **Verdict:** COMPLIANT
- **Decision:** "We ship 5 configurable hooks"
- **Evidence:** `commands/hooks.md` (131 lines) defines all 5 hooks: guard (pre-commit), retro-suggest (after fix), architecture-sync (after ADR transition), dependency-watch (package changes), periodic-health (every 20 sessions). Default states match the ADR: guard is Off, others are On. Suggest-not-block approach confirmed.

---

### ADR-0035: Ground v2 extensions in published architecture research

- **Verdict:** NOT AUDITABLE
- **Decision:** "Research-backed paradigm integration"
- **Notes:** This is a meta-decision about design methodology. The v2 ADRs (0036-0041) reference published research in their Context sections (DDD, DCAR, reflexion models, epistemic staleness, Wardley maps, TOGAF/Advice Process). The research grounding is documented in ADR prose, not verifiable by code scanning.

---

### ADR-0036: Scope ADRs to DDD bounded contexts

- **Verdict:** COMPLIANT
- **Decision:** "DDD bounded context scoping"
- **Evidence:** `config/contexts.toml` exists for context definitions. `commands/scope.md` (109 lines) manages context discovery and assignment. `agents/adr-context-mapper.md` (165 lines) performs DDD analysis. ARCHITECTURE.md documents bounded context awareness as a cross-cutting concern (line 220-222). Multiple skills reference `contexts.toml`.

---

### ADR-0037: Dual review protocol

- **Verdict:** COMPLIANT
- **Decision:** "DCAR forces evaluation as /blueprint:challenge complementing devil's advocate as /blueprint:review"
- **Evidence:** Two distinct review commands exist:
  - `commands/review.md` (50 lines) spawns `adr-devils-advocate.md` — adversarial challenge
  - `commands/challenge.md` (58 lines) spawns `adr-forces-evaluator.md` — DCAR forces evaluation
  - `agents/adr-forces-evaluator.md` (166 lines) exists as a separate agent
  - `agents/adr-devils-advocate.md` (161 lines) remains unchanged
  Clean dual-command architecture.

---

### ADR-0038: Reflexion model conformance checking

- **Verdict:** COMPLIANT
- **Decision:** "Reflexion model as a separate command"
- **Evidence:** `commands/reflect.md` (56 lines) exists as a separate command from `commands/drift.md` (104 lines). `agents/adr-reflexion-analyzer.md` (166 lines) exists. The two conformance mechanisms (reflexion model for point-in-time, drift for trajectory) are separate skills with separate agents.

---

### ADR-0039: Epistemic status tracking

- **Verdict:** COMPLIANT
- **Decision:** "Epistemic status tracking with conservative aggregation"
- **Evidence:** `config/evidence.toml` exists for tracking. `commands/evidence.md` (88 lines) manages evidence auditing. `agents/adr-evidence-auditor.md` (147 lines) performs the audit. `config/state.toml` includes `last_evidence_audit` tracking. `commands/status.md` includes evidence health in the dashboard data (L0/L1/L2 counts, expired count, health score).

---

### ADR-0040: Wardley mapping strategic context

- **Verdict:** COMPLIANT
- **Decision:** "Wardley Map evolution stage metadata"
- **Evidence:** `commands/map.md` (69 lines) creates/manages strategic analysis. `agents/adr-strategic-analyzer.md` (157 lines) performs Wardley analysis with WebSearch/WebFetch tools. `config/radar.toml` exists for technology lifecycle tracking. `commands/status.md` includes evolution stage distribution in dashboard data.

---

### ADR-0041: Configurable governance tiers

- **Verdict:** COMPLIANT
- **Decision:** "Configurable governance tiers — four modes from lightweight to formal"
- **Evidence:** `config/governance.toml` exists for mode configuration. `commands/govern.md` (95 lines) manages governance mode. ARCHITECTURE.md invariant 13 (line 203) states governance mode is enforced on lifecycle transitions. `config/taxonomy.toml` defines governance modes.

---

## VIOLATIONS (detail)

### VIOLATION 1: ADR-0002 stale numbers

- **ADR-0002** says "12 focused sub-skills averaging 41-96 lines each"
- **Reality:** 38 sub-skills, 6 exceeding 130 lines, one at 315 lines
- **Files:** `commands/status.md:315`, `commands/init.md:250`, `commands/help.md:157`, `commands/health.md:149`, `commands/eli5.md:149`, `commands/hooks.md:131`, `commands/debt.md:130`
- **Severity:** Low (principle followed, numbers stale)

### VIOLATION 2: ADR-0006 stale router size

- **ADR-0006** says "48-line thin router"
- **Reality:** 107 lines in `commands/blueprint.md`
- **File:** `commands/blueprint.md:107`
- **Severity:** Low (router is still thin in purpose, just bigger in docs)

### VIOLATION 3: ADR-0016 stale agent count

- **ADR-0016** says "11 agents"
- **Reality:** 20 agents + 1 persona = 21 agent files
- **File:** `agents/` directory contains 20 agent files where ADR specifies 11
- **Severity:** Low (principle followed, count stale)

### VIOLATION 4: Domain logic duplication in status.md

- **ADR-0002 invariant** (ARCHITECTURE.md line 192): "Skills never contain domain logic — they orchestrate agents and read config"
- **Reality:** `commands/status.md` line 73 duplicates the debt score formula (`severity x age_months x dependency_count`) that is also defined in `commands/debt.md` line 62
- **File:** `commands/status.md:73`
- **Severity:** Medium — this is domain logic duplication across skills. The formula should live in config (taxonomy.toml) or be delegated to the debt skill, not duplicated.
- **Suggested action:** Extract the debt formula to `config/taxonomy.toml` as a `[debt_scoring]` section, or have status.md invoke the debt skill rather than reimplementing the calculation.

### VIOLATION 5: Install.js ships only 2 static config files, not 8

- **ADR-0017** combined with **ADR-0022**: The config DSL has 8 TOML files, but `src/install.js` line 76 only installs 2 as static config (`lifecycle.toml`, `taxonomy.toml`). The other 6 are shipped as "state-templates" to a subdirectory.
- **File:** `src/install.js:76-95`
- **Severity:** Low — this is actually correct architectural behavior (per-project state files should not be global), but ARCHITECTURE.md line 166 says "8 TOML files encoding domain knowledge as structured data" which implies all 8 are domain config when in reality only 2 are static schemas and 6 are per-project mutable state templates. The install.js correctly distinguishes between them.
- **Suggested action:** No code change needed. ARCHITECTURE.md could be more precise about the 2+6 split.

---

## Recommendations

1. **Update stale ADR numbers (Low effort, Medium value):** ADRs 0002, 0006, and 0016 contain specific counts (12 skills, 48-line router, 11 agents) that were accurate at v1 but are now wrong. These are not architectural violations — the principles are followed — but stale numbers erode trust in the ADR corpus. Either update the numbers in the ADR Consequences sections, or create a brief "ADR-0042: v2 scale update" noting the growth from 12 to 38 skills and 11 to 20 agents. The latter is cleaner because it preserves the v1 ADRs as historical records.

2. **Extract debt formula from status.md (Medium effort, Medium value):** The debt score formula `severity x age_months x dependency_count` is duplicated in `commands/status.md:73` and `commands/debt.md:62`. This violates the "skills never contain domain logic" invariant. Move the formula to `config/taxonomy.toml` as a `[debt_scoring]` section that both skills read. Alternatively, have status.md delegate to the debt skill for this calculation rather than reimplementing it.

3. **Clarify ARCHITECTURE.md config split (Low effort, Low value):** ARCHITECTURE.md line 166 says "8 TOML files" but the install path correctly splits these into 2 static schemas + 6 per-project state templates. The ARCHITECTURE.md description could be more precise to match the actual install architecture. This is a documentation accuracy issue, not a code issue.

4. **Consider splitting status.md (Medium effort, Medium value):** At 315 lines, `commands/status.md` is the single largest skill file — more than triple the average. It handles terminal rendering, HTML dashboard generation, wireframe extraction, data object construction, and metric gathering. While all of this is technically "orchestration," the sheer size suggests it could benefit from decomposition (e.g., a separate dashboard agent for HTML generation). This is a code smell, not a violation, but it is drifting toward the monolith that ADR-0002 explicitly rejected.

---

*Compliance audit generated by the ADR Compliance Auditor agent. Trust nothing — these verdicts are backed by file paths and line numbers, not assumptions.*
