# ADR-0021: Use Hegelian dialectic for ADR review process

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0021                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

ADR review is the gate between a Proposed decision and an Accepted one. The quality of this gate determines the quality of every accepted decision in the corpus. A weak review process lets flawed decisions through. An overly heavy process discourages teams from writing ADRs at all.

The challenge is that the author of an ADR is often the person most invested in the decision and therefore least likely to see its weaknesses. Cognitive biases (anchoring on the chosen option, underweighting alternatives, optimism about consequences) are strongest in the person who did the analysis. A review process must counteract these biases without requiring a second human who deeply understands the context.

Blueprint already has agent infrastructure for specialized analysis. The question is how to structure the review interaction: as a simple gate, a structured adversarial process, or a committee.

## Options Considered

### Option 1: Approve/reject gate, reviewer reads ADR and decides

A single reviewer (human or agent) reads the ADR and either accepts or rejects it. Simple, fast, low overhead. But a single pass review tends to confirm rather than challenge. The reviewer sees a well-structured document and approves it without deeply questioning the assumptions, alternatives, or consequence analysis.

### Option 2: Hegelian dialectic: thesis, antithesis, synthesis

The proposed ADR serves as the thesis. A devil's advocate agent produces the antithesis: systematic challenges across multiple dimensions. The human author (or an orchestrator) produces the synthesis: either a strengthened ADR that addresses the challenges, or an informed rejection that acknowledges the fatal flaws the antithesis exposed. This is a structured adversarial process, not a rubber stamp.

### Option 3: Committee review with multiple reviewers

Multiple independent reviewers each provide feedback. The author addresses all feedback before acceptance. Thorough, but heavyweight. In a small team or a solo developer using blueprint, assembling a committee for every ADR is impractical. The process becomes a bottleneck rather than a quality gate.

## Decision

**We use a Hegelian dialectic via the devil's advocate agent for ADR review**, because decisions that survive structured adversarial challenge are worth committing to, and decisions that crumble under challenge were going to crumble in production anyway. Better to discover that before the decision becomes binding.

## Rationale

- The dialectic structure is not arbitrary philosophy. It maps directly to how good technical decisions are made: someone proposes an approach (thesis), someone else pokes holes in it (antithesis), and the team arrives at a decision that accounts for the holes (synthesis). Blueprint automates the "poke holes" step.
- The devil's advocate agent challenges across 5 specific dimensions: assumptions (what are you taking for granted?), alternatives (what did you not consider?), consequences (what will actually happen?), risks (what could go wrong?), and reversibility (can you undo this?). These dimensions are chosen because they target the most common blind spots in architectural decisions.
- A single-pass approval gate is susceptible to rubber-stamping. When a well-written ADR lands on a reviewer's desk, the path of least resistance is to approve it. The dialectic forces engagement with the weaknesses, not just the strengths.
- The process produces a written challenge report that becomes part of the ADR's history. Future readers can see not just what was decided, but what challenges were raised and how they were addressed. This is more valuable than a simple "Approved by X on Y" stamp.
- For solo developers, the devil's advocate agent serves as the adversarial reviewer they do not otherwise have. The agent does not replace human judgment (the human still decides whether to accept, revise, or reject) but it provides the challenge that a solo developer cannot give themselves.

## Consequences

### Positive

- Every accepted ADR has been stress-tested against systematic challenge. The average quality of accepted decisions increases.
- The challenge report surfaces blind spots that the author missed, even when the ADR is ultimately accepted without changes.
- Rejected or revised ADRs fail fast; flawed decisions are caught before they are committed to and implemented.
- The written challenge report adds context for future readers, improving the long-term value of the ADR corpus.

### Negative

- The review process takes longer than a simple approve/reject gate. The devil's advocate agent must analyze the ADR and produce a structured challenge, then the author must respond.
- Some challenges may be spurious; the agent may raise objections that are not relevant to the specific context. The author must spend time addressing invalid challenges.
- The adversarial framing may feel confrontational to users who expect a collaborative review process.

### Risks

- Devil's advocate quality: if the agent produces shallow or repetitive challenges, users will learn to ignore the review step, defeating its purpose. Mitigation: the agent's prompt is specifically designed to produce substantive, dimension-specific challenges rather than generic objections.
- Process fatigue: if every ADR requires a full dialectic review, teams may reduce the number of ADRs they write to avoid the overhead. Mitigation: the `/blueprint:transition` command provides a direct accept/reject path for decisions that do not warrant full adversarial review (e.g., minor or obvious decisions).
- False confidence: surviving a devil's advocate review may give unwarranted confidence in a decision. The agent cannot catch all flaws. Mitigation: the challenge report explicitly notes its limitations and the dimensions it covers.

## References

- ADR-0005: Adopt cranky senior engineer persona across all agents
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- Agent definition: `adr-devils-advocate`
- Hegel, G.W.F., *Phenomenology of Spirit* (dialectic method)
