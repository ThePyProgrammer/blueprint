---
title: "Decision Debt"
description: "Why deferred architectural decisions compound faster than sloppy code. Cunningham's original insight, Lehman's laws, and how Blueprint's retrospective closes the loop."
---

# Decision Debt

!!! quote "George Santayana"

    "Those who cannot remember the past are condemned to repeat it."

Ward Cunningham coined the term "technical debt" in 1992, and almost everyone misunderstands what he meant.

Cunningham was **not** talking about sloppy code. He was describing the gap between what the code *does* and what the team now *understands*. When you ship v1 with a simplified model of your domain and then learn that the domain is more complex than you thought, the gap between your code and your understanding is the debt. The code was correct *at the time*. Your understanding has evolved. The code hasn't.

This is exactly what happens with architectural decisions, except the compounding is faster and the consequences are structural.

---

## Why Decision Debt Compounds Faster

A deferred technology choice becomes a deferred architecture choice becomes a deferred rewrite. Each layer of deferral constrains the solution space for the next decision, creating a cascade:

1. **Month 1:** "We'll decide on a message queue later." (Deferred)
2. **Month 3:** Three services now communicate through the database. (Workaround hardens)
3. **Month 6:** A fourth service needs async processing but can't use the database pattern. (Conflict)
4. **Month 9:** The team implements a custom queue on top of Redis. (Local fix, global complexity)
5. **Month 12:** The Redis queue doesn't support exactly-once delivery. (The original deferral is now a production bug.)

Each step was locally reasonable. No individual commit was wrong. But the *trajectory* (visible only in aggregate) shows an architecture shaped by avoidance rather than decision.

---

## Lehman's Laws and Architectural Entropy

Meir Lehman's [Laws of Software Evolution](https://en.wikipedia.org/wiki/Lehman%27s_laws_of_software_evolution) (1974-1996) formalize what every experienced engineer knows intuitively: software complexity grows unless it is actively fought.

The relevant laws for decision debt:

| Law | Implication for decisions |
|-----|--------------------------|
| **Continuing Change** | A system must be continually adapted or it becomes progressively less satisfactory. Decisions made for v1 constraints may be wrong for v3 reality. |
| **Increasing Complexity** | Unless actively reduced, complexity grows with every change. Deferred decisions add *hidden* complexity: workarounds that aren't documented as workarounds. |
| **Self-Regulation** | The rate of functional change is statistically constant. If architectural decisions aren't made, the velocity goes into workarounds, not features. |
| **Declining Quality** | Unless rigorously maintained, quality declines. "Maintained" includes revisiting the decisions that shaped the quality. |

Blueprint's drift detector (`/blueprint:drift`) operationalizes Lehman's insight. It analyzes git history *trajectory*, not just current state. A module that has gained 8 cross-boundary imports in 3 months is eroding, even if no single import was wrong. The drift is the signal that a decision needs revisiting.

---

## The Retrospective: Closing the Loop

`/blueprint:retro` is Blueprint's mechanism for institutional memory. After any fix, it performs two steps:

**Step 1: Root Cause Classification.** Not "what broke" but "what structural property made this possible?" Using the taxonomy from `config/taxonomy.toml`:

- Missing validation
- Implicit contracts
- State management failures
- Error swallowing
- Missing or wrong abstractions
- Configuration drift
- Dependency coupling
- Missing tests
- Architectural gaps

**Step 2: Pattern Verification.** For every architectural improvement proposed, the agent searches for 3+ authoritative external sources confirming the pattern is established practice. This step exists because AI systems confidently recommend patterns that don't exist. An unverified recommendation is explicitly flagged as unverified, never passed off as established practice.

The output is a verdict:

- **SYSTEMIC**: the fix addressed the root cause. Move on.
- **BAND-AID**: the symptom was treated but the root cause remains. Includes a proposed systemic improvement with effort estimate and a ready-to-run `/blueprint:new` command.
- **PARTIAL**: partially addressed with remaining exposure. Specifies what's left.

When the same root cause class keeps producing bugs, the architecture has a gap that no amount of patching will close. The gap needs a *decision* (an ADR that addresses the structural issue), not another fix.

---

## Tracking Decision Debt

`/blueprint:debt` tracks deferred ADRs with the discipline of a lender tracking loans. Each deferred decision has:

- **Trigger condition**: When should this decision be revisited?
- **Severity**: How much does deferral cost?
- **Dependencies**: What other decisions are blocked by this deferral?

The debt score is computed as: **severity × age × dependency count**. This surfaces which deferrals are becoming dangerous. A low-severity deferral with zero dependencies can wait. A high-severity deferral that blocks three other decisions is compounding at a rate that will eventually force a painful, expensive reckoning.

---

## Further Reading

- [Decisions as Hypotheses](decisions-as-hypotheses.md): The framework that makes revisiting decisions natural
- [The Cranky Senior Engineer](the-cranky-senior-engineer.md): The voice that warns you before the debt comes due
- [Continuous Governance](../commands/continuous-governance.md): The four mechanisms that keep debt visible
