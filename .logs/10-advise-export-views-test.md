# Dogfood Test: /blueprint:advise, /blueprint:export, /blueprint:views
**Date:** 2026-03-31

## Test 1: /blueprint:advise
### Execution Log

**Simulated topic:** "Add WebSocket support for real-time dashboard updates"

**Step 1 — Identify affected parties:**

The skill instructs reading three sources: `contexts.toml`, git log, and existing ADRs.

- **`config/contexts.toml`:** The file exists but is empty — no bounded contexts defined, no owners listed. The `cross_cutting_adrs` array is `[]`. The template has placeholder comments showing expected fields (`label`, `root_path`, `owner`, `governed_adrs`) but no actual context entries. This means the advise skill **cannot auto-populate affected parties from config** for Blueprint's own codebase.
- **Git log contributors:** Only one contributor found: `Prannaya Gupta`. A single-contributor project means the "affected parties" checklist would contain only one person, which makes the advice process somewhat degenerate (you are seeking advice from yourself).
- **Related ADRs:** ADR-0032 (Visual Knowledge Graph Dashboard) would be the most directly affected — WebSocket support would change the dashboard's architecture. ADR-0008 (Agents Return Inline Output) is tangentially related as WebSocket introduces a new output channel pattern.

**Step 2 — Generated consultation checklist (simulated):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADVICE PROCESS: Add WebSocket support for real-time dashboard updates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

People to consult before deciding:

 Affected Parties (their work changes):
  □ Prannaya Gupta — sole contributor, all commits in affected area
  □ Author of ADR-0032 (Visual Knowledge Graph Dashboard)

 Subject Matter Experts:
  □ [No SMEs identifiable — single-contributor project, contexts.toml empty]

 Optional:
  □ Architecture Advisory Forum (weekly meeting)
```

**Step 3 — Advice Received section template:**

The skill provides a clear Markdown table template:

```markdown
## Advice Received

| Consulted | Role | Advice | Influence on Decision |
|-----------|------|--------|----------------------|
| [Name] | [context owner] | [summary of advice] | [how it shaped the decision] |
```

This template is well-structured and actionable. The four columns cover who, what role, what they said, and how it mattered. The skill also instructs recording agreement/disagreement and asking "How did this advice influence your thinking?" — good conversational scaffolding.

### Issues Found

1. **Empty contexts.toml is a blocker for affected-party discovery.** The skill says "Read `contexts.toml` — which contexts are affected? Who owns them?" but Blueprint's own `contexts.toml` has no contexts defined. The skill has no fallback strategy for when contexts.toml is empty. It should gracefully degrade to git-log-only discovery.

2. **Single-contributor projects make the advice process degenerate.** The skill assumes a multi-person team. For solo projects, the checklist produces one entry and the "seek advice from those meaningfully affected" rule has no one to consult. The skill should detect this edge case and note it (e.g., "This appears to be a single-contributor project. Consider seeking external advice or deferring to `/blueprint:review` for adversarial challenge.").

3. **No guidance on what happens when all three sources return empty/thin results.** If contexts.toml has no owners, git has one contributor, and no related ADRs exist, the consultation checklist is nearly empty. The skill should explicitly handle this scenario.

4. **Integration section references `/blueprint:scope`** which should populate contexts.toml — but this creates a chicken-and-egg: advise needs populated contexts, scope populates them, but scope might not have been run yet. No guidance on ordering.

### Verdict: PASS WITH NOTES

The skill's logic is clear, the Advice Received section template is well-designed, and the overall workflow (identify -> consult -> record -> feed into ADR) is sound. However, it breaks down on thin data: empty contexts.toml, single contributors, and no related ADRs. These are not theoretical edge cases — they are the reality for Blueprint's own codebase. The skill needs fallback paths for sparse data.

---

## Test 2: /blueprint:export arc42
### Execution Log

**Attempted mapping of Blueprint's 41 ADRs (0001-0041) into the 12 arc42 sections:**

| arc42 Section | Blueprint Source (per skill) | Actual ADRs That Map | Notes |
|---|---|---|---|
| 1. Introduction and Goals | README + high-severity ADRs | ADR-0001 (use ADRs for own decisions) | Only one ADR qualifies as "introduction" — no severity field exists in ADR metadata to filter by |
| 2. Constraints | ADRs categorized as constraints | **NONE** | No ADR uses a "constraint" category. No category/constraint field in ADR template or metadata. |
| 3. Context and Scope | ARCHITECTURE.md + `/blueprint:diagram` L1 | ARCHITECTURE.md exists | No diagram L1 output exists. Could work if ARCHITECTURE.md is present. |
| 4. Solution Strategy | Core accepted ADRs (high severity) | ADR-0002, 0003, 0004, 0005, 0006 | These are the foundational "strategy" decisions, but there is no severity field to filter — the skill says "high severity" but the ADR template has no severity metadata |
| 5. Building Block View | ARCHITECTURE.md codemap + diagram L2/L3 | ARCHITECTURE.md codemap section | Would work if ARCHITECTURE.md has a codemap |
| 6. Runtime View | ADRs about communication patterns, EDA, CQRS | ADR-0008 (inline output), ADR-0020 (parallel eval agents) | Only 2 ADRs touch runtime communication — thin section |
| 7. Deployment View | ADRs about deployment, infrastructure | ADR-0017 (package as Claude Code plugin) | Only 1 ADR touches deployment — thin section |
| 8. Cross-cutting Concepts | ADRs tagged as cross-cutting in contexts.toml | **NONE** | `cross_cutting_adrs = []` in contexts.toml — nothing tagged |
| 9. Architecture Decisions | All accepted ADRs | ADR-0001 through ADR-0041 | This section is the native home for ADRs — would be populated fully |
| 10. Quality Requirements | Fitness functions from `/blueprint:fitness` | **NONE (no fitness functions generated yet)** | Blueprint has ADR-0023 about generating fitness functions but none have been generated |
| 11. Risks and Technical Debt | `/blueprint:risk` + deferred ADRs | **NONE (no deferred ADRs, no risk output)** | All ADRs are Accepted — no deferred decisions to surface |
| 12. Glossary | Ubiquitous language from contexts.toml | **NONE** | contexts.toml has no ubiquitous_language entries |

**Section coverage summary:**

- Populated sections: 1, 3 (partial), 4 (no filter mechanism), 5 (partial), 6 (thin), 7 (thin), 9 (full)
- Empty sections: 2, 8, 10, 11, 12
- That is **5 of 12 sections empty** — nearly half the arc42 output would be blank.

### Issues Found

1. **No severity/category metadata in ADR template.** The mapping table references "high-severity ADRs" (sections 1, 4) and "ADRs categorized as constraints" (section 2), but Blueprint's ADR template (`template.md`) has no `Severity` or `Category` field. The export skill assumes metadata that does not exist in the standard template. This is a fundamental gap — the mapping cannot be executed as written without adding new ADR metadata fields.

2. **Dependency on unpopulated state files.** Sections 8 (cross-cutting) and 12 (glossary) rely on `contexts.toml` having populated data. For Blueprint itself (and likely for many real projects early in adoption), this file is a skeleton. The export should warn about empty sources rather than silently producing blank sections.

3. **Dependency on unexecuted commands.** Sections 10 and 11 rely on output from `/blueprint:fitness`, `/blueprint:risk`, and `/blueprint:debt`. If these commands have never been run, the export cannot populate those sections. The skill should detect this and either run prerequisite commands or note the gaps.

4. **No content-based classification fallback.** When metadata-based filtering fails (no severity, no category), the skill should fall back to content analysis — reading the Decision and Context sections to infer which arc42 section an ADR belongs to. The mapping table is metadata-first with no fallback.

5. **Section 9 is redundant.** Section 9 is "all accepted ADRs" — essentially a dump of the ADR directory. Every ADR already appears in other sections. The skill does not address deduplication between section 9 and sections 1-8.

### Verdict: PASS WITH NOTES

The mapping table is intellectually sound — the 12 arc42 sections map logically to Blueprint artifacts. But execution against Blueprint's own codebase reveals that the skill assumes a level of metadata richness (severity, category, cross-cutting tags, populated contexts, fitness function output) that does not exist in practice. The skill would produce a document where nearly half the sections are empty and the populated sections lack proper filtering. It needs a content-analysis fallback for classification and explicit handling of missing prerequisites.

---

## Test 3: /blueprint:views
### Execution Log

**Auto-tag classification of ADRs 0001-0010 using the skill's keyword-based heuristics:**

The skill defines five views with classification signals:
- **Logical:** Database/ORM/data model mentions
- **Development:** Build tool/package/module mentions
- **Process:** Queue/event/async/concurrency mentions
- **Physical:** Deploy/infra/cloud/container mentions
- **Scenario:** Performance/user flow/scenario mentions

**ADR-0003 (Use TOML for config DSL):**

Content analysis: discusses TOML vs JSON vs YAML for configuration files. Mentions "config," "token efficiency," "LLM agents." No database, ORM, build tool, queue, deploy, or performance keywords match cleanly.

- Skill's auto-tag heuristic: No strong keyword match for any view.
- Best fit by reasoning: **Development view** — this is about code organization tooling (config format choice affects how modules/skills load configuration). It is a developer-facing concern about build-time and development-time tooling.
- Issue: The auto-tag keyword list does not include "config," "format," "DSL," or "tooling" — all of which signal development view. The heuristic would leave this ADR **unclassified**.

**ADR-0005 (Cranky senior engineer persona):**

Content analysis: discusses persona, tone, feedback effectiveness, hedged language, blunt communication. No database, build, queue, deploy, or performance keywords.

- Skill's auto-tag heuristic: No keyword match for any view.
- Best fit by reasoning: This ADR does not cleanly fit the 4+1 model at all. It is a **cross-cutting concern** about output quality and user experience. If forced into a view, it is closest to **Scenario** (it concerns how users experience and act on output — a use-case-level concern about feedback effectiveness).
- Issue: The 4+1 model was designed for software system architecture, not for meta-concerns like persona and communication style. Blueprint's ADRs include decisions that are about the tool's UX and process, not about its runtime/deployment/logical architecture. The views model has a **category gap** for these meta-architectural decisions.

**ADR-0007 (Five evaluation dimensions):**

Content analysis: discusses agent decomposition, parallel execution, specialized analysis, fan-out pattern. Mentions "parallel execution," "agents," "orchestrator."

- Skill's auto-tag heuristic: "concurrency" and "async" are process-view signals. "Parallel execution" partially matches.
- Best fit by reasoning: **Process view** — this is fundamentally about concurrency (parallel agent execution), communication patterns (fan-out from orchestrator to agents), and async flows. It also touches **Development view** (module decomposition into 5 agents).
- Classification: **Process, Development** (multi-view). The auto-tag would likely catch "parallel" as a process signal but miss the development-view aspect.

**Full classification attempt for ADRs 0001-0010:**

| ADR | Title | Auto-tag Keywords Found | Proposed View(s) | Correct View(s) |
|-----|-------|------------------------|-------------------|------------------|
| 0001 | Use ADRs for own decisions | None | Unclassified | Scenario (meta/process) |
| 0002 | Decompose into sub-skills | "module" | Development | Development |
| 0003 | TOML for config | None | Unclassified | Development |
| 0004 | Lifecycle as state machine | None | Unclassified | Logical (domain model of lifecycle) |
| 0005 | Cranky persona | None | Unclassified | Scenario (cross-cutting UX) |
| 0006 | Thin router pattern | None | Unclassified | Development |
| 0007 | Five eval dimensions | "parallel" (weak) | Process (maybe) | Process, Development |
| 0008 | Inline output | None | Unclassified | Process |
| 0009 | Devil's advocate on review | None | Unclassified | Scenario (workflow/process) |
| 0010 | Relationship graph | "graph" (no match) | Unclassified | Logical (data model) |

**Auto-tag success rate: 1-2 out of 10 ADRs correctly classified. 7-8 left unclassified.**

### Issues Found

1. **Keyword list is far too narrow for LLM/tooling projects.** The classification signals are tuned for traditional software systems: databases, deployment, queues, build tools. Blueprint's ADRs discuss agent orchestration, prompt engineering, persona design, lifecycle state machines, and configuration formats — none of which match the keyword heuristics. The keyword list needs domain-adaptive expansion or a semantic classification fallback.

2. **No semantic/LLM-based classification fallback.** The skill relies purely on keyword matching ("Database/ORM/data model mentions -> logical"). For an LLM-powered tool, it is ironic that classification does not leverage LLM reasoning. The auto-tag should analyze the Decision and Context sections semantically, not just scan for keywords.

3. **The 4+1 model does not cover meta-architectural decisions.** ADRs like 0005 (persona), 0009 (review workflow), and 0001 (dogfooding) are decisions *about the decision-making process itself*. Kruchten's 4+1 was designed for system architecture, not for process/tooling/meta decisions. The skill should either add a sixth view (e.g., "Governance" or "Meta") or acknowledge that some ADRs are inherently cross-view.

4. **"Analyze the Decision and Context sections" is underspecified.** The skill says to analyze these sections for keywords, but does not define what constitutes a keyword match. Is it exact word matching? Substring? Semantic similarity? The instruction is too vague for reliable execution.

5. **No confidence scoring.** When an ADR weakly matches multiple views (like ADR-0007 matching both Process and Development), there is no mechanism to express confidence or rank the primary vs secondary view.

### Verdict: PASS WITH NOTES

The views skill's conceptual framework (Kruchten 4+1) is well-chosen and the workflow (tag, list, auto-tag) is clean. But the auto-tag classification logic fails catastrophically on Blueprint's own ADRs: 7-8 out of 10 would be left unclassified because the keyword heuristics are tuned for traditional software systems, not LLM tooling. The skill needs semantic classification (using the LLM's reasoning, not just keyword grep), domain-adaptive keyword expansion, and possibly a sixth "Governance/Meta" view for decisions about the decision process itself.

---

## Summary

| Test | Command | Verdict |
|------|---------|---------|
| 1 | `/blueprint:advise` | PASS WITH NOTES |
| 2 | `/blueprint:export arc42` | PASS WITH NOTES |
| 3 | `/blueprint:views` | PASS WITH NOTES |

**Common theme across all three skills:** They assume richer metadata and state than Blueprint's own codebase actually has. contexts.toml is empty, ADRs have no severity/category fields, no fitness functions have been generated, and keyword-based classification is too narrow for meta-architectural decisions. All three skills need graceful degradation paths for sparse data and content-based fallbacks for when metadata is missing.
