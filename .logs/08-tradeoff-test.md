# Dogfood Test: /blueprint:tradeoff
**Date:** 2026-03-31
**Target:** Blueprint's own ADRs (10 key decisions: 0003, 0004, 0005, 0007, 0016, 0020, 0035, 0036, 0037, 0039)
**Command tested:** /blueprint:tradeoff

## ATAM Analysis Output

### Quality Attribute Extraction

| ADR | Primary Quality Attribute | Secondary Quality Attribute |
|-----|--------------------------|----------------------------|
| ADR-0003 (TOML config) | Performance (token efficiency) | Modifiability (LLM write safety) |
| ADR-0004 (Lifecycle state machine) | Modifiability (config-driven change) | Operability (single source of truth) |
| ADR-0005 (Cranky persona) | Operability (actionable feedback) | Modifiability (single persona file) |
| ADR-0007 (Five eval dimensions) | Testability (isolated agents) | Scalability (parallel execution) |
| ADR-0016 (Single responsibility agents) | Modifiability (independent improvement) | Testability (isolated testing) |
| ADR-0020 (Parallel evaluation) | Performance (4x wall-clock reduction) | Availability (partial failure tolerance) |
| ADR-0035 (Research-backed extensions) | Modifiability (defensible rationale) | Cost (research overhead) |
| ADR-0036 (DDD bounded contexts) | Scalability (domain-scoped ADRs) | Operability (noise reduction) |
| ADR-0037 (Dual review protocol) | Testability (two review lenses) | Modifiability (independent methods) |
| ADR-0039 (Epistemic status) | Security (evidence accountability) | Operability (proactive staleness detection) |

### Quality Attribute Utility Tree

```
System Utility
├── Performance
│   ├── Token Efficiency
│   │   ├── "Config loads consume <60% tokens vs JSON" (H,M) — ADR-0003
│   │   └── "State machine data is more compact than prose rules" (M,L) — ADR-0004
│   └── Execution Speed
│       └── "Full eval completes in 1x agent time, not 5x" (H,H) — ADR-0020
│
├── Modifiability
│   ├── Agent Independence
│   │   ├── "Improving one agent cannot break another" (H,H) — ADR-0016
│   │   └── "New eval dimension = new agent, no existing changes" (H,M) — ADR-0007
│   ├── Config-Driven Change
│   │   ├── "Lifecycle rule change = edit TOML, not rewrite prompts" (H,M) — ADR-0004
│   │   └── "Tone change = edit one persona.md file" (M,L) — ADR-0005
│   └── Defensible Design
│       └── "Every v2 feature traces to published research" (M,H) — ADR-0035
│
├── Scalability
│   ├── ADR Volume
│   │   └── "50+ ADRs manageable via bounded context scoping" (H,H) — ADR-0036
│   └── Agent Architecture
│       └── "Add 6th eval dimension without modifying existing 5" (M,M) — ADR-0007
│
├── Testability
│   ├── Agent Isolation
│   │   └── "Each agent testable with dedicated fixtures" (H,M) — ADR-0016
│   └── Review Completeness
│       └── "Two orthogonal review methods catch more defects" (H,H) — ADR-0037
│
├── Operability
│   ├── Feedback Quality
│   │   └── "Direct feedback acted upon; hedged feedback ignored" (H,M) — ADR-0005
│   ├── Evidence Freshness
│   │   └── "Stale evidence surfaces proactively, not during incidents" (H,H) — ADR-0039
│   └── Noise Reduction
│       └── "Teams see only domain-relevant ADRs" (M,M) — ADR-0036
│
├── Security (Evidence Integrity)
│   └── Evidence Accountability
│       └── "AI research flagged L0 until empirically validated" (H,M) — ADR-0039
│
└── Cost
    ├── Token Consumption
    │   └── "11 single-responsibility agents cost more tokens than 5 multi-purpose" (M,H) — ADR-0016
    └── Research Overhead
        └── "109-source survey before any v2 code written" (L,H) — ADR-0035
```

**(H,H) scenarios — the ones that matter most:**
1. Parallel evaluation speed (ADR-0020) — High importance, high difficulty
2. Agent independence / independent improvement (ADR-0016) — High importance, high difficulty
3. ADR volume scalability via bounded contexts (ADR-0036) — High importance, high difficulty
4. Dual review completeness (ADR-0037) — High importance, high difficulty
5. Proactive evidence staleness detection (ADR-0039) — High importance, high difficulty

### Sensitivity Points (High Leverage)

| ADR | Why It's Sensitive | Impact Radius | Dependent ADRs |
|-----|-------------------|---------------|----------------|
| ADR-0016 (Single responsibility agents) | Load-bearing pillar — every agent, every evaluation, every review depends on this decomposition. Reversing it cascades to ADR-0007, ADR-0020, ADR-0037, and all 11 agent definitions. | 5+ ADRs, all agent files | ADR-0007, ADR-0020, ADR-0037, ADR-0005 |
| ADR-0003 (TOML config) | Every config file (lifecycle.toml, relationships.toml, contexts.toml, evidence.toml, taxonomy.toml, state.toml) depends on this format choice. Changing it means migrating 6+ config files and updating every agent's parsing logic. | All config files, all agents that read config | ADR-0004, ADR-0036, ADR-0039, ADR-0041 |
| ADR-0004 (Lifecycle state machine) | The lifecycle state machine is read by transition, review, audit, and status commands. ADR-0041 (configurable governance) extends it. Any change to the state machine schema affects at minimum 4 commands and 1 extension ADR. | 4+ commands | ADR-0041, ADR-0037, ADR-0009 |
| ADR-0005 (Cranky persona) | Injected into all 11 agents via persona.md. Not structurally complex, but a single-point-of-failure for tone. A miscalibration propagates to every output Blueprint produces. | All 11 agents | ADR-0007, ADR-0016, ADR-0037 |
| ADR-0035 (Research-backed extensions) | Meta-decision governing all v2 ADRs (0036-0041). If the research foundation is wrong, six downstream decisions inherit bad premises. The relationship graph shows ADR-0035 as the root node for all v2 edges. | 6 v2 ADRs | ADR-0036, ADR-0037, ADR-0038, ADR-0039, ADR-0040, ADR-0041 |

### Tradeoff Points (Quality Attribute Conflicts)

| ADR Pair | Quality Up | Quality Down | Tradeoff |
|----------|-----------|-------------|----------|
| ADR-0016 vs ADR-0020 | **Modifiability** up (independent agents), **Performance** up (parallel execution) | **Cost** up (11 agents consume more total tokens than 5 multi-purpose agents; all 5 eval agents hit codebase simultaneously) | Single responsibility enables parallelism but multiplies token cost. Each agent independently loads codebase context, meaning the same files are read 5 times. The wall-clock win masks the total-token loss. |
| ADR-0005 vs ADR-0036 | **Operability** up (direct feedback), **Scalability** up (domain scoping) | **Modifiability** down (persona is one-size-fits-all across contexts) | The persona is globally uniform but bounded contexts imply different stakeholders with different tolerance for bluntness. A payments team in a regulated bank may need a different tone than a greenfield startup context. The persona has no per-context override mechanism. |
| ADR-0037 vs ADR-0016 | **Testability** up (two review methods) | **Cost** up, **Operability** down (users must learn two review commands) | Dual review adds a 12th agent responsibility (forces evaluator). The benefit is real — analytical + adversarial review is more thorough — but it pulls against single-responsibility's goal of keeping agent count manageable. More agents = more orchestration = more cognitive load for users. |
| ADR-0039 vs ADR-0035 | **Security** up (evidence accountability) | **Operability** down (re-validation churn) | Research-backed design generates 109+ sources of evidence. Epistemic status tracking means all of that evidence needs L0/L1/L2 classification and expiry dates. The very thoroughness of the research creates a maintenance burden that epistemic tracking amplifies. Blueprint's own research could trigger its own staleness alerts. |
| ADR-0003 vs ADR-0039 | **Performance** up (compact config) | **Modifiability** down (TOML fights deep nesting) | Evidence.toml needs per-ADR, per-evidence-item metadata with L0/L1/L2 levels, expiry dates, and source URLs. This is 3-4 levels of nesting — exactly where ADR-0003 acknowledges TOML "struggles." The config format choice is under tension from the evidence tracking decision. |

### Risks

| ADR | Risk | Materializes When | Severity |
|-----|------|-------------------|----------|
| ADR-0016 | **Agent proliferation** — 11 agents today, 15+ after v2, each needing maintenance, testing, prompt tuning. The "just add another agent" pattern has no braking mechanism. | Agent count exceeds 15 and orchestration DAG becomes hard to reason about. Or when two agents' outputs consistently overlap and nobody merges them. | High |
| ADR-0003 | **TOML nesting ceiling** — evidence.toml (ADR-0039) and contexts.toml (ADR-0036) push toward 4+ levels of nesting. TOML's `[[array.of.tables]]` syntax becomes unreadable. | A config file requires arrays of objects nested inside arrays of objects (e.g., per-context, per-ADR evidence with multiple sources). | Medium |
| ADR-0035 | **Research-practice gap** — 15 commands from 15 different paradigms risks being "a mile wide and an inch deep." Some paradigms may not translate to automated tooling. | A v2 command derived from an academic paradigm ships but nobody uses it because the paradigm doesn't match practitioner workflow. | Medium |
| ADR-0020 | **Synthesis bottleneck** — parallel execution is only as good as the orchestrator's ability to synthesize 5 independent reports. Cross-dimensional insights are deferred to synthesis. | The orchestrator misses a correlation that a sequential model would have caught (e.g., naming inconsistency in the same files that have high bug-surface complexity). | Medium |
| ADR-0039 | **Epistemic gaming** — teams mark everything L2 to avoid re-validation churn, defeating the purpose. Or L0 label discourages use of AI research entirely. | Team adoption drops because evidence tracking feels like paperwork, or evidence levels become rubber stamps. | Medium |
| ADR-0036 | **Context boundary errors** — agent-inferred bounded contexts may be wrong. Wrong context assignment means wrong impact analysis propagation — either too narrow (missed impacts) or too broad (noise). | The codebase has ambiguous boundaries (shared libraries, cross-cutting services) that the context mapper misclassifies. | Medium |

### Non-Risks (Confirmed Sound)

| ADR | Why It's Sound |
|-----|---------------|
| ADR-0004 (Lifecycle state machine) | The state machine is flat (5 states, ~8 transitions). TOML handles this nesting level trivially. The single-source-of-truth benefit is proven — multiple agents do read the same lifecycle rules. Config-driven lifecycle change is the industry standard pattern (finite state machines in data, not code). |
| ADR-0005 (Cranky persona) | The persona file explicitly draws the line between blunt and hostile, with examples of each. The single-file injection model is simple and works. Research (Bacchelli & Bird 2013) supports the claim that direct feedback is more actionable. The risk of persona fatigue is low because Blueprint interactions are intermittent, not continuous. |
| ADR-0007 (Five eval dimensions) | The five dimensions map to five distinct, well-documented classes of architectural failure. They are genuinely orthogonal — consistency findings don't predict bug surface findings. The extensibility story (add a 6th agent) has already been exercised by v2 additions. |
| ADR-0020 (Parallel evaluation) | The decision follows directly from ADR-0007's orthogonality claim. If dimensions are independent, parallel execution is strictly better on wall-clock time with no information loss. The partial-failure tolerance (4/5 reports still useful) is a genuine availability benefit. |

### Assessment

Blueprint's architecture is a coherent bet on **modifiability and agent independence** as the primary quality attributes. ADR-0016 (single responsibility) is the load-bearing pillar — it enables ADR-0007 (five dimensions), ADR-0020 (parallel execution), and ADR-0037 (dual review). This is a sound bet for a tool that will iterate rapidly.

The biggest tension is **modifiability vs. cost**. Single-responsibility agents are individually excellent but collectively expensive. Every new capability adds an agent, a config file, a prompt to maintain, and tokens to consume. There is no architectural mechanism to push back against agent proliferation — no "agent budget" or "merge threshold" that forces consolidation when two agents' scopes drift together.

The second tension is **TOML's nesting ceiling vs. v2 complexity**. ADR-0003 was a sound decision for v1's flat config. But v2 introduced evidence.toml (per-ADR, per-source, multi-field nested structures) and contexts.toml (per-context with models, owners, relationships) that push TOML past its comfort zone. This is not a crisis yet, but it's the most likely format-migration trigger.

The third tension is **research breadth vs. practitioner depth**. ADR-0035 grounds v2 in 109 sources and 15 paradigms. ADR-0039 then requires tracking the epistemic validity of all that evidence. The research thoroughness creates a maintenance flywheel: more research -> more evidence to track -> more staleness alerts -> more re-validation work. Blueprint risks drowning in its own epistemic rigor.

What's missing from the utility tree: **Security** (in the traditional sense — Blueprint handles codebases but has no threat model for prompt injection, config tampering, or agent output manipulation) and **Availability** (no discussion of graceful degradation when agents fail beyond ADR-0020's "4/5 reports" scenario).

---

## Issues Found

### Issue 1: Skill does not specify how to handle absent relationship graph
The `tradeoff.md` skill says to read `{adr_directory}/.state/relationships.toml`. In this repo, the relationships file is at `config/relationships.toml`, not `.state/relationships.toml`. The skill assumes a `.state/` directory that does not exist. The agent would fail or produce incomplete analysis if it couldn't find the relationship graph.

### Issue 2: Agent quality gate is necessary but incomplete
The quality gate requires "every accepted ADR maps to at least one quality attribute." With 41 ADRs, a full ATAM pass is expensive. The agent should support `--scope` or `--adrs` to analyze a subset. The skill's `--focus <quality>` flag filters by attribute, not by ADR subset.

### Issue 3: No guidance on business driver identification
The utility tree format is `Business Driver -> Quality Attribute -> Scenario -> Priority`. But the agent instructions never explain how to identify business drivers from ADR text. For Blueprint's own ADRs, I had to infer drivers like "token efficiency for LLM context" and "rapid iteration velocity" from scattered context sections. The agent needs explicit heuristics for extracting business drivers.

### Issue 4: Sensitivity point identification relies on relationship graph completeness
The agent says to use "ADRs referenced by many other ADRs (high in-degree in relationship graph)." But the relationship graph in `relationships.toml` only contains v2 ADRs (0035-0041). ADRs 0003-0020 are referenced in each other's text but have no edges in the graph. The agent would miss the most connected ADRs (0003, 0004, 0005, 0016) because they predate the relationship tracking.

### Issue 5: Output format does not include the utility tree structure
The output format template shows a flat table for the utility tree. The actual ATAM utility tree is hierarchical (Business Driver -> Quality Attribute -> Scenario). A flat table loses the hierarchy that makes the tree useful. The template should either use indented markdown or a tree format.

### Issue 6: No integration with existing `/blueprint:impact` data
The tradeoff analyzer rebuilds relationship analysis from scratch rather than consuming the output of `/blueprint:impact`. These commands should share state — impact analysis produces exactly the dependency graph the tradeoff analyzer needs.

## Suggested Fixes

### Fix 1: Normalize relationship graph path
In `commands/tradeoff.md`, change the shared context to read from `config/relationships.toml` as a fallback if `.state/relationships.toml` does not exist. Or standardize on one location and update both files.

### Fix 2: Add `--adrs` flag for subset analysis
Add `--adrs 3,4,5,7,16,20` flag to the skill so users can analyze a subset without paying for a full corpus scan. The agent instructions should include: "If `--adrs` is provided, analyze only those ADRs but still check for cross-references to non-analyzed ADRs."

### Fix 3: Add business driver extraction heuristics to agent
In `agents/adr-tradeoff-analyzer.md`, Step 2, add:
```
To identify business drivers, look for:
- The "Context" section's problem statement (what pressure motivated this decision?)
- The "Rationale" section's first bullet (what benefit was most important?)
- Recurring themes across multiple ADRs (e.g., "token efficiency" appearing in ADR-0003 and ADR-0004)
Common drivers for tools: Developer velocity, Operational simplicity, Correctness/safety, Scalability, Cost efficiency
```

### Fix 4: Supplement graph with text-based reference extraction
In `agents/adr-tradeoff-analyzer.md`, Step 3, add:
```
The relationship graph may be incomplete. Supplement it by scanning each ADR's
"References" section for cross-ADR citations (e.g., "ADR-0003" in ADR-0004's references).
Build a supplementary in-degree count from these textual references.
```

### Fix 5: Use tree format in output template
Replace the flat utility tree table with an indented tree format:
```
Business Driver
├── Quality Attribute
│   ├── "Scenario description" (Importance, Difficulty) — ADR-NNNN
```

### Fix 6: Add state consumption from impact analyzer
In `commands/tradeoff.md`, add to the shared context:
```
- `{adr_directory}/.state/impact-cache.toml` — cached impact analysis results (if available)
```
And in the agent, Step 3: "If impact analysis cache exists, use it as the primary source for dependency edges. Fall back to relationships.toml and text-based extraction."

## Verdict

**PASS WITH NOTES**

The skill and agent are structurally sound. The ATAM framework is correctly decomposed into the right steps (quality extraction, utility tree, sensitivity points, tradeoff points, risk classification). The quality gate catches real problems. The output format is usable.

But the implementation has blind spots that this dogfood exposed:
1. The relationship graph path is wrong for this repo (would cause a runtime failure).
2. The agent has no mechanism to handle incomplete relationship graphs — and most real repos will have incomplete graphs, especially early in Blueprint adoption.
3. Business driver identification is hand-waved in a step that is actually the hardest part of ATAM.
4. The flat table output format loses the hierarchical structure that makes utility trees valuable.

None of these are blockers. All are fixable with the specific changes described above. The core analytical framework works — this dogfood produced genuine insights about Blueprint's own tradeoff landscape (the modifiability-vs-cost tension, the TOML nesting ceiling, the epistemic maintenance flywheel) that were not previously documented.
