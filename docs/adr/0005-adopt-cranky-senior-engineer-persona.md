# ADR-0005: Adopt cranky senior engineer persona across all agents

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0005                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's agents produce output that humans read and act on: ADR reviews, architecture evaluations, compliance audits, retrospective analyses. The tone of this output directly affects whether the feedback is acted upon or ignored.

The original agents communicated in neutral, clinical prose. Review feedback read like "It may be worth considering whether the chosen approach adequately addresses scalability concerns" and evaluation output read like "There are some potential issues with the current testing strategy that could be explored further."

Research on code review effectiveness consistently shows that hedged feedback is systematically ignored. Phrases like "you might want to consider," "it could be beneficial to," and "perhaps it would be worth" signal uncertainty to the reader, who interprets hedging as the reviewer being unsure. Direct feedback ("this should be const," "this will break under concurrent access," "the test is missing the error path") produces action because it signals confidence and specificity.

Blueprint agents are not having a social conversation. They are delivering technical assessments. The output needs to be direct, specific, and actionable.

## Options Considered

### Option 1: Neutral professional tone

The default. Polite, measured, full of hedging qualifiers. Inoffensive but ineffective. Feedback gets read, acknowledged, and ignored because it does not convey urgency or confidence.

### Option 2: Shared cranky senior engineer persona

A single persona definition in persona.md, injected into all agents. Blunt but not cruel. Opinionated but backs opinions with evidence. Zero hedging: replaces "you might want to" with "this should." Direct about problems, generous with credit for good work. The persona of someone who has been burned enough times to know which mistakes actually matter.

### Option 3: Per-agent configurable tone

Each agent gets its own tone configuration. The devil's advocate is aggressive, the compliance auditor is formal, the retrospective agent is reflective. More nuanced, but creates inconsistency across the toolset and adds configuration complexity.

## Decision

**We adopt a shared cranky senior engineer persona defined in persona.md and injected into all agents**, because hedged feedback is ignored feedback, and because a consistent voice across all blueprint output builds trust and recognition.

## Rationale

- Hedging kills action. "You might want to consider error handling" gets skipped. "This will crash on null input" gets fixed. The persona's directness is not a stylistic preference; it is an effectiveness requirement.
- Consistency builds recognition. When every blueprint agent speaks with the same voice, users learn to trust (or at least recognize) that voice. Inconsistent tone across agents makes the tool feel like a collection of unrelated scripts rather than a coherent system.
- Blunt is not cruel. The persona is specific about what is wrong and why it matters. It does not attack the author. "This function is doing three things and should be split" is blunt. "Whoever wrote this does not understand separation of concerns" is cruel. The persona draws this line explicitly.
- Opinionated with receipts. The persona does not just say "this is wrong." It says "this is wrong because X, and here is what happens when you ship it." Evidence-backed directness is respected. Unsupported opinions are not.
- A shared persona.md file is simple to implement. Each agent's prompt includes the persona file. Changes to tone propagate to all agents by editing one file.

## Consequences

### Positive

- Feedback is more likely to be acted upon due to direct, unhedged language.
- Consistent voice across all agents creates a unified tool identity.
- Single persona.md file makes tone changes trivial and atomic.
- The persona naturally produces shorter output, since direct statements are more concise than hedged ones.

### Negative

- Some users may find the blunt tone off-putting, particularly those accustomed to diplomatic code review norms.
- The persona constrains creative expression in agent output. All agents sound the same, which may feel monotonous over extended use.
- "Cranky senior engineer" is a cultural reference that may not translate across all engineering cultures.

### Risks

- Tone miscalibration: if the persona drifts from "blunt but fair" to "abrasive," users will disengage. Mitigation: the persona.md explicitly defines the line between direct and hostile, with examples.
- Persona fatigue: users who interact with blueprint heavily may grow tired of the consistent tone. Mitigation: the persona emphasizes that it is generous with credit for good work, not relentlessly negative.

## References

- Bacchelli & Bird, "Expectations, Outcomes, and Challenges of Modern Code Review" (ICSE 2013)
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0008: Agents return inline output, not files
