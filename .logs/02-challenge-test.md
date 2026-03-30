# Dogfood Test: /blueprint:challenge
**Date:** 2026-03-31
**Target:** ADR-0037 (Dual review protocol)
**Command tested:** /blueprint:challenge 37

## DCAR Forces Evaluation Output

### DCAR Forces Evaluation: ADR-0037 — Dual review protocol

**Evaluated:** 2026-03-31
**Verdict:** CONFIRMED
**Force Balance:** 16 FOR : 7 AGAINST (ratio 2.3:1)

### Forces FOR This Decision

| # | Force | Weight | Evidence |
|---|-------|--------|----------|
| F1 | Analytical and adversarial methods answer fundamentally different questions | Critical (3) | ADR text: challenge answers "is this well-supported?" vs review answers "what did we miss?" These are orthogonal evaluation axes. DCAR paper (van Heesch 2014) confirms structured force-balancing and adversarial stress-testing are complementary, not redundant. |
| F2 | DCAR is Blueprint's natural formal method counterpart | Major (2) | ADR text: "DCAR treats decisions as first-class entities -- exactly what Blueprint does." Blueprint's entire model is decision-centric; DCAR was designed for this exact paradigm. Not a forced fit. |
| F3 | Force balance ratios enable quantitative comparison across ADRs | Major (2) | Agent template (adr-forces-evaluator.md lines 89-97): scoring thresholds are defined (>=1.5:1 CONFIRMED, 0.8-1.5 NEEDS-RE-EVALUATION, <0.8 RECONSIDER). This gives a repeatable metric that devil's advocate verdicts lack. |
| F4 | Users choose review depth appropriate to the decision | Major (2) | ADR text: "simple decisions may only need challenge; high-stakes decisions should get both." This respects ADR-0009's core principle of user autonomy over process. |
| F5 | Decision relationship views surface inter-ADR interactions | Minor (1) | Agent template Step 4: maps depends-on, depended-on-by, conflicts-with, supersedes. Devil's advocate does not systematically do this. |
| F6 | Two independent commands preserve single responsibility | Major (2) | ADR text explicitly cites ADR-0016 (single responsibility) as reason to reject Option 3 (merged command). Each command has one job. |
| F7 | Preserves existing devil's advocate investment | Major (2) | ADR-0009 and ADR-0021 are both Accepted and functional. Option 1 (replace) would discard a working, tested system. Option 2 is additive, not destructive. |
| F8 | Sequential use (challenge then review) produces maximally robust decisions | Minor (1) | ADR text and challenge.md both document this workflow. Structured analysis first, adversarial stress-test second. Two independent lenses on the same decision. |
| F9 | Solo developers gain structured analysis they cannot self-provide | Minor (1) | ADR-0021 rationale: "the devil's advocate agent serves as the adversarial reviewer they do not otherwise have." Challenge adds a second form of automated analysis for the same audience. |

**Total FOR: 3 + 2 + 2 + 2 + 1 + 2 + 2 + 1 + 1 = 16**

### Forces AGAINST This Decision

| # | Force | Weight | Evidence |
|---|-------|--------|----------|
| A1 | Two review-like commands create user confusion | Major (2) | ADR text acknowledges this directly: "Two review-like commands may confuse users." The names `challenge` and `review` do not intuitively convey which is analytical vs adversarial. Users will guess wrong. |
| A2 | Force weights are subjective (Critical/Major/Minor) | Minor (1) | ADR text lists this as a risk. Agent template defines thresholds but not calibration guidance. Two evaluations of the same ADR could produce different verdicts depending on weight assignments. |
| A3 | Users will default to one method and ignore the other | Major (2) | ADR text lists this as a risk. ADR-0009 already identified that users develop habits of skipping review. Adding a second review-like command makes it more likely one gets neglected, not less. |
| A4 | More process overhead when both are used | Minor (1) | Two agent spawns, two outputs to read, two verdicts to reconcile. For a tool that values velocity (ADR-0009 rationale), this doubles the review cost for high-stakes decisions. |
| A5 | Forces evaluator agent adds to agent count and maintenance burden | Minor (1) | ADR text acknowledges this. Each agent requires prompt engineering, testing, and maintenance. The agent file is 161 lines of structured instructions. |

**Total AGAINST: 2 + 1 + 2 + 1 + 1 = 7**

### Force Interactions

| Forces | Interaction | Effect |
|--------|------------|--------|
| F1 + F3 | Amplifying | The orthogonality of the two methods (F1) is strengthened by the fact that challenge produces a fundamentally different output format -- quantitative force ratios (F3) -- that review cannot produce. They are not just different questions but different output types. |
| F4 + A3 | Cancelling | User choice of review depth (F4) directly addresses the risk of defaulting to one method (A3). But it also enables the problem: the same autonomy that lets users pick the right tool also lets them always pick the easy one. Partial cancellation -- net effect is mildly negative. |
| F6 + A1 | Cancelling | Single responsibility (F6) is architecturally sound but creates the UX confusion (A1). The design principle and the user experience pull in opposite directions. The principle wins for maintainability; the user experience loses for discoverability. |
| F7 + A4 | Conditional | Preserving existing investment (F7) matters now but becomes irrelevant over time. If challenge proves more useful than review, the sunk cost of devil's advocate should not prevent consolidation. This force is conditional on the maturity of the system. |
| A2 + F3 | Cancelling | The subjectivity of force weights (A2) partially undermines the quantitative comparison advantage (F3). If weights are unreliable, ratios are unreliable. However, even imprecise quantification is more structured than pure narrative. Partial cancellation. |

### Decision Relationship View

| Related ADR | Relationship | Implication |
|-------------|-------------|-------------|
| ADR-0009 | Depends on | ADR-0037 extends 0009's principle that review is opt-in, not automatic. If 0009 were reversed (review becomes mandatory), 0037's "users choose depth" rationale collapses -- both would need to be mandatory or the dual protocol loses its flexibility argument. |
| ADR-0021 | Depends on | ADR-0037 depends on the Hegelian dialectic remaining the review method. If 0021 were superseded (e.g., review switched to a different adversarial approach), 0037's complementarity argument would need re-evaluation against the new method. |
| ADR-0016 (inferred) | Depends on | ADR-0037 cites single responsibility as justification for two commands over one merged command. If 0016 were relaxed, Option 3 (merged review) becomes viable again. |

### Assessment

The forces clearly favor the dual review protocol. The core argument -- that analytical force-balancing and adversarial blind-spot discovery are orthogonal evaluation methods -- is strong and well-evidenced by the DCAR literature. This is not a case of "two things are better than one" hand-waving; the methods genuinely answer different questions with different output structures. The 2.3:1 ratio reflects a decision with solid backing.

The most serious counter-force is A3: users defaulting to one method. This is not theoretical -- ADR-0009 already documented the same risk for a single review command, and adding a second review-like command multiplies the surface area for process neglect. The ADR acknowledges this but does not propose a concrete mitigation beyond documentation. A stronger mitigation would be for `/blueprint:list` to surface which ADRs were accepted without either form of review, creating social pressure without forcing process.

The naming confusion (A1) is real but solvable. `challenge` vs `review` is not the worst naming, but it could be better. The ADR's comparison table (analytical vs adversarial) belongs in `/blueprint:help` output, not buried in a skill file. The weight subjectivity risk (A2) is inherent to any scoring system and does not undermine the approach -- it just means verdicts should be treated as structured opinions, not ground truth.

What would change the verdict: if evidence emerged that users consistently cannot distinguish when to use `challenge` vs `review` and this leads to neither being used, the ratio would shift toward RECONSIDER in favor of Option 3 (merged command). But that is an empirical question that can only be answered after deployment.

### Recommendations

- **Monitor:** Track how often `challenge` and `review` are used independently vs together. If one command's usage drops below 10% of the other's, the dual protocol is not delivering its value.
- **Mitigate A3:** Add a "reviewed: none / challenge-only / review-only / both" indicator to `/blueprint:list` output so users can see which ADRs got what level of scrutiny.
- **Mitigate A1:** Ensure `/blueprint:help` prominently displays the comparison table from the ADR rationale section. Do not rely on users reading the ADR to understand the distinction.
- **Watch for A2:** After 10+ challenge evaluations, compare force weight assignments across evaluators (or across runs of the same ADR) to assess inter-rater reliability. If weights are wildly inconsistent, add calibration examples to the agent prompt.

---

## Issues Found

### Issue 1: `.state/` directory does not exist
**Severity:** Blocking for full command execution
The challenge.md skill file references `{adr_directory}/.state/relationships.toml`, `{adr_directory}/.state/contexts.toml`, and `{adr_directory}/.state/state.toml` in its Shared Context and Process sections. None of these files exist at `docs/adr/.state/`. The command as written would fail or degrade silently when trying to read these files.

### Issue 2: No guidance on handling missing state files
**Severity:** Major
The skill file says "Read from parent `adr/` skill directory" for state files but does not specify what to do if they are missing. Should the agent skip relationship mapping? Warn the user? Refuse to run? The agent template (Step 4) says "Map how this decision relates to adjacent decisions" and reads `relationships.toml`, but has no fallback behavior defined.

### Issue 3: Skill file says "Spawn a `blueprint:adr-forces-evaluator` agent" but no spawning mechanism is defined
**Severity:** Minor (operational, not definitional)
The skill file references spawning an agent in Step 5, but the actual execution model depends on the harness. This is fine for the current Claude Code implementation but would be unclear for someone trying to implement the skill in a different harness.

### Issue 4: Agent template quality gate says "at least 3 forces FOR and 2 forces AGAINST"
**Severity:** Minor
The minimum thresholds are reasonable but the gate does not specify what to do if the minimums are not met. "You didn't look hard enough" is the right sentiment but not actionable. Should the agent re-scan the codebase? Ask the user for context? The gate should say what the retry behavior is.

### Issue 5: No explicit instruction to read the ADR's related/referenced ADRs
**Severity:** Minor
The agent template says "Read all accepted ADRs" in project_context step 2, but this is overkill for most evaluations and the actually critical step -- reading the specific ADRs referenced in the Related field -- is not called out. In practice, the agent should prioritize the Related ADRs listed in the target ADR's metadata, then scan others if needed.

### Issue 6: `last_challenge` state update references non-existent state file
**Severity:** Minor (consequence of Issue 1)
Step 8 of the skill file says to update `state.toml` with `last_challenge` date. This file does not exist and no skill creates it.

### Issue 7: Scoring thresholds are defined but interaction adjustments are undefined
**Severity:** Major
The agent template Step 5 says "Apply interaction adjustments" after computing the raw force balance, but Step 3 (Force Interaction Analysis) does not define how interactions translate to numerical adjustments. Amplifying pairs -- do they add +1 to the relevant side? Multiply by 1.5? Cancelling pairs -- do they zero out both forces? Reduce by half? The evaluator is left to improvise, which undermines the repeatability that quantitative scoring is supposed to provide.

## Suggested Fixes

### Fix 1: Create `.state/` directory and bootstrap state files
Add initialization logic to `/blueprint:init` (or the challenge skill itself) that creates `docs/adr/.state/` with empty-but-valid `relationships.toml`, `contexts.toml`, and `state.toml` files. Alternatively, make the challenge skill gracefully degrade when state files are missing -- skip relationship mapping from state files and fall back to reading the ADR's Related metadata field directly.

### Fix 2: Add fallback behavior to skill and agent template
In challenge.md, after the Shared Context section, add:
```
If state files are missing, fall back to:
- relationships.toml: infer relationships from Related fields in ADR metadata
- contexts.toml: skip bounded context analysis, note this in output
- state.toml: skip last_challenge tracking, note this in output
```

### Fix 3: Define interaction adjustment formula
In the agent template, replace the vague "Apply interaction adjustments" with a concrete formula:
```
- Amplifying pair: add +1 to the amplified side's total
- Cancelling pair: subtract 1 from the stronger force's contribution
- Conditional: apply full weight only if the condition is met; otherwise halve the weight
```
This does not need to be mathematically perfect. It needs to be consistent across evaluations.

### Fix 4: Specify quality gate retry behavior
Change the quality gate from "you didn't look hard enough" to:
```
If minimums not met:
1. Re-read the ADR's Context and Consequences sections for overlooked forces
2. Grep codebase for implementation evidence that creates implicit forces
3. If still below minimum, note the gap explicitly: "Only N forces AGAINST identified --
   this may indicate a genuinely well-supported decision or insufficient counter-evidence."
```

### Fix 5: Prioritize Related ADRs over "read all accepted ADRs"
In the agent template project_context step 2, change:
```
2. Read all accepted ADRs — find adjacent/related decisions
```
to:
```
2. Read ADRs listed in the target's Related metadata field first, then scan other
   accepted ADR titles for additional adjacencies
```

### Fix 6: Add the comparison table to `/blueprint:help` output
The challenge vs review comparison table from ADR-0037's Rationale section should appear in the help output, not just in the ADR. Users should not need to read an ADR to understand which command to use.

## Verdict
**PASS WITH NOTES**

The DCAR forces evaluation methodology is well-designed and produces genuinely useful, structured output. The agent template is thorough -- the quality gate, output format, and execution flow are all well-specified. The skill file clearly differentiates challenge from review and documents when to use each.

The notes are:
1. **State file dependencies are broken.** The `.state/` directory does not exist, which means the command cannot fully execute as specified. This needs either initialization logic or graceful degradation. This is the most critical fix.
2. **Interaction adjustments are undefined.** The scoring system promises quantitative rigor but leaves the most subjective part -- how interactions modify the raw scores -- entirely to the evaluator's discretion. This undermines repeatability.
3. **The command naming could use reinforcement.** The distinction between `challenge` (analytical) and `review` (adversarial) is clear in the ADR but not self-evident from the command names. Help text needs to compensate.

The core design -- dual complementary review methods, each independently useful, maximally rigorous when combined -- is sound and well-justified. The issues are implementation gaps, not architectural flaws.
