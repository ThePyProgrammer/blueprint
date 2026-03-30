# Dogfood Test: /blueprint:risk
**Date:** 2026-03-31
**Target:** Blueprint's own codebase
**Command tested:** /blueprint:risk

## Risk Heat Map Output

**Analyzed:** 2026-03-31
**Components assessed:** 6
**Risk distribution:** 0 Critical, 0 High, 3 Medium, 3 Low
**Fitness functions:** 0 (none exist — this caps maximum governance score at 2)
**Unique authors (90d):** 1 (sole contributor — bus factor = 1 across everything)

### Risk Heat Map

| Component | Files | LOC | Commits (90d) | Authors (90d) | Bug Fixes (90d) | Complexity | Churn | Coupling | Governance | Risk Score | Level |
|-----------|-------|-----|---------------|---------------|-----------------|-----------|-------|----------|------------|------------|-------|
| `commands/` | 39 | 3602 | 67 | 1 | 20 | 2 | 3 | 3 (18 outgoing) | 2 (15 ADRs, 0 fitness) | **9.0** | MEDIUM |
| `docs/adr/` | 43 | 3214 | 47 | 1 | 1 | 2 | 3 | 1 | 1 (2 ADRs mention path) | **6.0** | MEDIUM |
| `agents/` | 21 | 3112 | 24 | 1 | 1 | 2 | 3 | 1 (2 cross-refs) | 2 (18 ADRs, 0 fitness) | **3.0** | LOW |
| `src/` | 4 | 303 | 7 | 1 | 3 | 1 | 2 | 3 (14 require/imports) | 2 (3 ADRs, 0 fitness) | **3.0** | LOW |
| `config/` | 8 | 504 | 11 | 1 | 2 | 1 | 2 | 1 (pure data) | 2 (23 ADRs, 0 fitness) | **1.0** | LOW |
| `bin/` | 1 | 33 | 1 | 1 | 0 | 1 | 1 | 1 | 2 (9 ADRs, 0 fitness) | **0.5** | LOW |

### Medium Risks

#### `commands/` — MEDIUM (Score: 9.0)

- **Path:** `commands/`
- **Risk factors:** Highest churn (67 commits, 20 bug fixes in 90 days) + highest coupling (references 15 agents, 3 config files)
- **Evidence:** 39 skill files, 315-line max file (status.md), 20 of 67 commits are bug fixes (30% fix rate)
- **Missing governance:** No fitness functions enforce the invariant "skills never contain domain logic" (Invariant #1 from ARCHITECTURE.md). This is the single most important invariant in the system and it has zero automated enforcement.
- **Recommended:** `/blueprint:fitness` to generate tests for the skills-are-orchestrators invariant. The 30% bug fix rate on the highest-churn component is a smell.

#### `docs/adr/` — MEDIUM (Score: 6.0)

- **Path:** `docs/adr/`
- **Risk factors:** High churn (47 commits in 90d) + lowest governance score (only 2 ADRs reference the ADR directory itself)
- **Evidence:** 43 files, rapid growth. The governance score is misleading — ADRs are inherently self-governing. But the mechanical grep for "docs/adr" only finds 2 mentions, which exposes a flaw in the risk command's governance measurement (see Issues below).
- **Missing governance:** ADR template consistency, naming convention enforcement, and index sync are governed by convention, not by fitness functions.
- **Recommended:** This is more of a measurement problem than a real risk. See Issues.

#### `commands/` Detail: Top Risk Factors

The commands layer is the riskiest part of blueprint for three reasons:

1. **It's the coupling hub.** Every command references agents, config, and state. 18 outgoing dependencies make it the most coupled component. When anything changes downstream, commands probably need updating.
2. **It churns the hardest.** 67 commits in 90 days, with 20 of those being fixes. That's not iteration velocity — that's instability. Something in the skill authoring process isn't settling.
3. **Zero automated enforcement.** The core invariant — "skills never contain domain logic" — has no fitness function. Every new skill is one copy-paste away from violating the architecture.

### Risk Register (All Components)

| # | Component | Level | Score | Top Factor | Recommended Action |
|---|-----------|-------|-------|-----------|-------------------|
| 1 | `commands/` | MEDIUM | 9.0 | High churn (67 commits) + high coupling (18 deps) + 30% fix rate | `/blueprint:fitness` for skills-are-orchestrators invariant |
| 2 | `docs/adr/` | MEDIUM | 6.0 | High churn + governance measurement gap | Fix governance scoring for self-referential components |
| 3 | `agents/` | LOW | 3.0 | Moderate churn, low coupling | No action needed |
| 4 | `src/` | LOW | 3.0 | High coupling (14 imports) for small codebase | No action needed — proportional to responsibility |
| 5 | `config/` | LOW | 1.0 | None — well-governed pure data | No action needed |
| 6 | `bin/` | LOW | 0.5 | None — minimal stable entry point | No action needed |

### Assessment

Blueprint's risk profile is lopsided in a predictable way. The `commands/` layer absorbs the most change, has the most coupling, and has the highest bug fix rate — but it also has reasonable ADR coverage. The problem isn't that nobody thought about how skills should work; it's that nobody enforced it. Fifteen ADRs say "skills should be thin orchestrators" but zero fitness functions verify that claim. That's architectural governance as aspirational prose rather than executable constraint.

The single-author situation (bus factor = 1 across all components for the entire 90-day window) doesn't show up in the risk formula, and it should. A component with 3 authors and 20 commits is fundamentally different from one with 1 author and 20 commits — the former has been validated by multiple perspectives, the latter is a single person's mental model that nobody has challenged. The risk formula treats them identically.

The absence of any executable fitness functions means that the maximum governance score is capped at 2 for every component. Blueprint has 41 ADRs — far more governance thinking than most projects — but none of it compiles into tests. That's like having a building code with no inspectors.

## Issues Found

### Issue 1: Governance Score Conflates ADR Count with Enforcement

The rubric says governance 3 = "3+ ADRs + fitness." Since blueprint has zero fitness functions, no component can score above 2. But 15 ADRs governing `commands/` should count for more than 2 ADRs governing `src/`. The formula treats "lots of unenforced decisions" the same as "a couple of unenforced decisions." That's lossy.

**Root cause:** The governance factor is a single ordinal that mashes together two orthogonal things: decision coverage (do ADRs exist?) and decision enforcement (do tests exist?). These should be separate factors, or at minimum the ADR count should provide a gradient within the "no fitness" tier.

### Issue 2: Self-Referential Components Break Governance Measurement

`docs/adr/` scores governance = 1 (only 2 ADRs mention the path "docs/adr"). But the ADRs ARE the governance — they're self-documenting by definition. The grep-for-path approach doesn't handle components that are their own governance artifacts.

**Root cause:** The agent measures governance by grepping ADR content for the component path. This works for code directories but fails for the ADR directory itself, config files referenced by name rather than path, and any component whose governance is implicit rather than path-based.

### Issue 3: Bus Factor Not Captured

Single-author components are invisible in the formula. All 6 components have exactly 1 author in the 90-day window. The "unique authors" metric is collected but never used in the risk score. A component that only one person understands is higher risk than one that three people actively modify, but the formula ignores this.

### Issue 4: Coupling Measurement Is Inconsistent

For `commands/`, coupling was measured as outgoing references to agents + config (18 deps = High). For `src/`, coupling was measured as `require/import` lines (14 = High). For `config/`, coupling was measured as "pure data, no outgoing" (0 = Low). These are three different methodologies applied to components with different file types (.md vs .js vs .toml). The agent instructions don't specify how to measure coupling for non-code files.

### Issue 5: Risk Levels May Be Miscalibrated for Small Projects

The thresholds (1-4 LOW, 5-12 MEDIUM, 13-27 HIGH, 28+ CRITICAL) seem calibrated for larger systems. Blueprint's highest score is 9.0 — solidly MEDIUM. But `commands/` has a 30% bug fix rate and is the coupling hub for the entire system. In a 6-component project, that probably qualifies as the thing you should worry about most. The absolute thresholds don't account for relative risk within a project's own landscape.

## Suggested Fixes

### Fix 1: Split Governance into Coverage and Enforcement

Replace the single governance factor with two:

```
| Factor | Low (1) | Medium (2) | High (3) |
| Coverage | 0 ADRs | 1-2 ADRs | 3+ ADRs |
| Enforcement | 0 fitness funcs | Manual checks | Automated fitness |
```

New formula: `Risk = (Complexity * Churn * Coupling) / (Coverage * Enforcement)`

This would let well-documented-but-unenforced components (like `commands/` with 15 ADRs, 0 fitness) score differently from undocumented-and-unenforced ones.

### Fix 2: Add Bus Factor as a Churn Modifier

When unique authors = 1, multiply churn by 1.5 (knowledge concentration penalty). When unique authors >= 3, multiply churn by 0.75 (knowledge distribution bonus). The insight: high churn by a single author is riskier than high churn by a diverse team.

### Fix 3: Normalize Coupling Measurement

Define coupling measurement per file type:
- **Markdown (.md):** Count references to other component paths (`agents/`, `config/`, etc.)
- **JavaScript (.js):** Count `require()`/`import` statements pointing outside the component
- **TOML (.toml):** Count cross-references to other config files or paths
- **Meta-rule:** Incoming deps count too — who references THIS component?

### Fix 4: Add Relative Risk Ranking

After computing absolute risk scores, add a percentile rank within the project. Even if nothing hits CRITICAL on the absolute scale, flag the top 20% as "highest relative risk" so small projects still get actionable output.

### Fix 5: Handle Self-Referential Components

For `docs/adr/`, governance should be measured differently: count how many ADRs define the ADR process itself (meta-ADRs), not how many ADRs mention the path. ADR-0001 ("Use ADRs for own decisions"), ADR-0004 ("Encode lifecycle as state machine"), etc. are governance for the ADR directory — the grep-for-path heuristic misses them.

### Fix 6: Surface the Bug Fix Ratio

The agent collects bug fix counts but doesn't use them in the formula. A component where 30% of commits are fixes (commands: 20/67) is fundamentally different from one where 4% are fixes (agents: 1/24). Add bug fix ratio as a churn sub-factor or a separate risk indicator.

## Verdict

**PASS WITH NOTES**

The `/blueprint:risk` command successfully produces a useful risk heat map. The component inventory, git metric collection, and scoring rubric all work as specified. The output format is clear and actionable. The formula correctly identifies `commands/` as the highest-risk component, which matches intuition (highest churn, highest coupling, highest bug fix rate).

However, the formula has five meaningful blind spots: governance scoring is too coarse (Issue 1), self-referential components break the measurement (Issue 2), bus factor is collected but unused (Issue 3), coupling measurement is inconsistent across file types (Issue 4), and absolute thresholds don't account for project scale (Issue 5). None of these are fatal — they're refinement opportunities. The risk command does what it says it does; it just leaves signal on the table.

The agent definition (`adr-risk-mapper.md`) is well-structured and the execution flow is clear. The quality gate checklist is a good guardrail. The output format template is production-ready. The main gap is that the risk formula is too simple for edge cases (self-referential components, single-author projects, non-code files).

**Bottom line:** Ship it. Then iterate on the formula with the six fixes above. The command finds real risks — it just underweights some of them.
