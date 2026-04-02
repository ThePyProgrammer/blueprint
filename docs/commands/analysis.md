---
title: "Analysis"
description: "Commands for deep architectural analysis: impact detection, compliance auditing, reflexion models, evidence validation, strategic mapping, tradeoffs, risk, traceability, and retrospectives."
---

# Analysis

These ten commands provide deep architectural analysis, from cross-ADR conflict detection through formal conformance checking to post-fix retrospectives. Each spawns a specialized agent with a single analytical focus.

---

### `/blueprint:impact`: Cross-ADR Conflict Detection

Analyze an ADR's impact on other decisions and the codebase. Detects conflicts, dependencies, duplications, and affected components.

**Syntax:** `/blueprint:impact N`

**Examples:**

```
/blueprint:impact 12
# Check ADR-0012 for conflicts with all other accepted ADRs

/blueprint:impact 3
# Before accepting: does this conflict with anything?
```

!!! tip
    Run `impact` before accepting any ADR that touches shared infrastructure (databases, auth, messaging). Cross-ADR conflicts are the most expensive bugs in architecture.

---

### `/blueprint:audit`: Compliance Verification

Verify the codebase actually follows accepted decisions. The compliance auditor scans code for evidence of compliance and violations against each accepted ADR.

**Syntax:** `/blueprint:audit [N]`

Without an argument, audits all accepted ADRs. With a number, audits a specific one.

**Verdicts:** COMPLIANT, PARTIAL, VIOLATING, or INSUFFICIENT EVIDENCE.

**Examples:**

```
/blueprint:audit
# Full compliance audit of all accepted decisions

/blueprint:audit 7
# Check compliance for ADR-0007 specifically
```

!!! tip
    Run audits after major feature branches merge. Individual PRs may each be compliant, but the aggregate can drift.

---

### `/blueprint:reflect`: Reflexion Model Conformance

Compute a [reflexion model](https://dl.acm.org/doi/10.1145/222124.222136) (Murphy, Notkin, Sullivan, 1995) by comparing the intended architecture (from accepted ADRs + ARCHITECTURE.md) against actual source code structure. Reports convergences, divergences, and absences with file:line evidence.

**Syntax:** `/blueprint:reflect`

- **Convergences:** Code matches the intended architecture
- **Divergences:** Code contradicts the intended architecture
- **Absences:** Intended architecture elements not found in code

**Examples:**

```
/blueprint:reflect
# Full reflexion model: convergences, divergences, absences
```

!!! tip
    `reflect` is the most rigorous conformance check Blueprint offers. Use it when you need formal evidence that the code matches the architecture, not just that it "seems right."

---

### `/blueprint:evidence`: Epistemic Status Audit

Audit the epistemic status and temporal validity of evidence supporting accepted ADRs. Detects stale evidence, unverified AI-generated research, expired assumptions, and dead source URLs.

**Syntax:** `/blueprint:evidence`

**Evidence levels:**

- **L0:** Unverified, AI-generated or unsourced
- **L1:** Partially verified, some sources checked
- **L2:** Fully verified, all claims traced to authoritative sources

**Examples:**

```
/blueprint:evidence
# Full epistemic audit of all ADR evidence

# Output includes:
# - ADR-0003: Evidence STALE (benchmark from 2024, library has had 3 major versions since)
# - ADR-0007: Evidence L0 (AI-generated, no external sources cited)
# - ADR-0012: Evidence L2 VALID (all sources verified, within expiry)
```

---

### `/blueprint:map`: Wardley Map Strategic Analysis

Generate a [Wardley Map](https://learnwardleymapping.com/) classifying components by evolution stage (Genesis, Custom, Product, Commodity). Detects strategic misalignment: building custom solutions for commodity problems, or using commodity tools for genesis-stage differentiators.

**Syntax:** `/blueprint:map`

**Examples:**

```
/blueprint:map
# Generate Wardley Map linked to ADRs
# Flags: "You're building a custom auth system (Genesis effort) for a problem
#         that has commodity solutions (Auth0, Clerk). ADR-0005 should be revisited."
```

---

### `/blueprint:tradeoff`: ATAM Quality Attribute Utility Trees

Generate [ATAM](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)-style quality attribute utility trees from accepted ADRs. Identifies sensitivity points, tradeoff points, risks, and non-risks.

**Syntax:** `/blueprint:tradeoff`

- **Sensitivity point:** A property where a small change in one attribute causes a large change in another
- **Tradeoff point:** A property that is a sensitivity point for multiple attributes
- **Risk:** A potentially problematic architectural decision
- **Non-risk:** A decision that appears sound under analysis

**Examples:**

```
/blueprint:tradeoff
# Generate utility tree with quality attributes, scenarios, and tradeoff identification
```

---

### `/blueprint:risk`: Architecture Risk Heat Map

Generate a risk heat map by analyzing ADR coverage gaps, component complexity, git churn, coupling density, and missing governance.

**Syntax:** `/blueprint:risk`

Risk score formula: **(Complexity x Churn x Coupling) / Governance**

Components with high complexity, frequent changes, tight coupling, and no governing ADR are the highest risk.

**Examples:**

```
/blueprint:risk
# Heat map: "src/auth/ HIGH RISK: 12 files, 847 lines average, 23 cross-imports,
#            high churn (42 commits in 30 days), NO governing ADR"
```

---

### `/blueprint:trace`: ADR-to-Fitness Traceability

Show the traceability matrix between accepted ADRs and fitness functions. Reveals governance gaps: decisions that have no automated enforcement.

**Syntax:** `/blueprint:trace`

**Examples:**

```
/blueprint:trace
# Matrix output:
# ADR-0001 → fitness_001.sh [PASS]
# ADR-0003 → fitness_003.sh [PASS]
# ADR-0005 → [NO FITNESS FUNCTION] ← governance gap
# ADR-0007 → fitness_007.sh [FAIL]
```

---

### `/blueprint:retro`: Post-Fix Retrospective

After any fix, evaluate whether it was a band-aid or systemic. Classifies root causes using `config/taxonomy.toml`, verifies proposed improvements against 3+ external sources, and produces a SYSTEMIC / BAND-AID / PARTIAL verdict.

**Syntax:** `/blueprint:retro`

**Examples:**

```
/blueprint:retro
# After fixing a bug:
# Verdict: BAND-AID
# Root cause: implicit contract between UserService and AuthMiddleware
# Proposed: /blueprint:new "explicit service contracts via TypeScript interfaces"
# External validation: 3/3 sources confirm (Microsoft, ThoughtWorks, Fowler)
```

!!! tip
    The retro is Blueprint's institutional memory mechanism. When the same root cause class produces bugs repeatedly, the architecture has a gap that needs a *decision*, not another patch.

---

### `/blueprint:rearchitect`: Supersede a Decision

Research a new approach, draft a superseding ADR, run impact analysis, and transition old ADR(s) to Superseded.

**Syntax:** `/blueprint:rearchitect "topic"`

**Examples:**

```
/blueprint:rearchitect "migrate from MongoDB to PostgreSQL"
# Research → draft superseding ADR → impact analysis → transition
```
