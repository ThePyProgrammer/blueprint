# ADR-0015: Trigger proactive intervention for undocumented architectural decisions

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0015                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Users forget to create ADRs. Significant architectural decisions get made in conversation — "let's use Redis for caching," "we should switch to event sourcing," "let's go with Kubernetes" — without anyone stopping to document the decision, the alternatives considered, or the trade-offs accepted. The decision enters the codebase as an implementation fact, and the reasoning evaporates.

This is the central failure mode of any decision documentation system: the tool exists, the team agrees it is valuable, but in the flow of building things, nobody remembers to invoke it. The decision is made in the moment, and retroactive documentation rarely happens.

Blueprint can address this by detecting decision signals in conversation and suggesting that the user create an ADR. The question is how aggressively to intervene. A passive tool waits for explicit invocation and accepts that most decisions will go undocumented. A mandatory tool blocks execution until an ADR exists, which would be intolerable for rapid prototyping. A proactive tool suggests documentation without blocking, preserving flow while increasing the documentation rate.

## Options Considered

### Option 1: Passive — only act on explicit invocation

- **Pros:** Zero interruption. Users are fully in control. No false positive suggestions.
- **Cons:** Most decisions go undocumented because users forget to invoke blueprint. The tool's value is limited to the small fraction of decisions that users consciously decide to record.

### Option 2: Proactive — detect decision patterns and suggest creating an ADR

- **Pros:** Catches decisions that would otherwise slip through. Non-blocking — a suggestion, not a requirement. Increases documentation rate without disrupting flow. Teachable — the detection patterns improve over time.
- **Cons:** False positives are annoying ("no, choosing a variable name is not an architectural decision"). Requires monitoring conversation content, which has privacy implications.

### Option 3: Mandatory — block execution until an ADR exists

- **Pros:** Guarantees every decision is documented. No gaps in the decision record.
- **Cons:** Intolerable friction for rapid prototyping, spikes, and exploratory work. Users will disable the tool entirely rather than write an ADR for every technology mention. Turns a documentation aid into a bureaucratic gate.

## Decision

**In the context of** architectural decisions being made in conversation without documentation, **facing** the reality that users forget to create ADRs even when they value the practice, **we decided for** proactive suggestion without blocking, **to achieve** higher documentation rates while preserving development flow, **accepting** the risk of false positive suggestions and the need for good signal detection.

The router skill monitors conversation for decision signals: technology selection ("let's use X for Y"), pattern choice ("we should adopt the repository pattern"), deployment model changes ("let's move to serverless"), data store selection ("we'll store this in Postgres"), and similar architectural inflection points. When a signal is detected, the router suggests `/blueprint:new` with a pre-populated title based on the detected decision. The suggestion is a single line — not a modal dialog, not a blocking prompt, not a repeated nag.

## Rationale

- The biggest threat to an ADR practice is not bad documentation but missing documentation. The decisions that are never recorded are more damaging than the ones recorded imperfectly.
- Proactive suggestion matches the behavior of effective human colleagues. A good tech lead hearing "let's use Redis" would say "sounds good — let's write that up." Blueprint does the same.
- Non-blocking is essential. The suggestion must be ignorable without guilt or friction. If the user is in flow and does not want to stop to write an ADR, the suggestion disappears and the work continues.
- Single-line suggestions avoid the "clippy problem" where verbose, repeated interventions train users to ignore all output from the tool.
- Option 1 was rejected because passive-only tools have adoption rates below 10% for decision documentation in practice. Option 3 was rejected because mandatory gates cause tool abandonment.

## Consequences

### Positive

- Decisions that would have been undocumented are surfaced for potential recording.
- The pre-populated title reduces the activation energy for creating an ADR from "open a file and write context" to "confirm this suggestion."
- Documentation rate increases without adding mandatory process.
- The detection patterns serve as a definition of what constitutes an "architectural decision" for the project.

### Negative

- False positives create noise. "Let's use console.log for debugging" is not an architectural decision but may match technology selection patterns.
- Users who consistently dismiss suggestions may develop "suggestion blindness" and ignore genuine prompts.
- Conversation monitoring requires parsing unstructured text for intent, which is inherently imprecise.

### Risks

- Privacy concerns if conversation content is logged or transmitted for pattern detection. Mitigation: all detection happens locally in the Claude Code session. No conversation content is stored or transmitted. The router skill sees the same conversation context that any other skill sees.
- Suggestion fatigue leading to tool disablement. Mitigation: the router implements a cooldown — no more than one suggestion per 10-minute window, and it tracks dismissed suggestions to reduce false positives on similar patterns.
- Detection patterns that are too broad, flagging every technology mention as a potential ADR. Mitigation: the router requires both a technology/pattern AND a commitment signal ("let's," "we should," "I'm going to," "the plan is to") to trigger a suggestion. Mere mentions ("Redis supports pub/sub") do not trigger.

## References

- ADR-0009: Devil's advocate on review, not accept (same principle of opt-in rigor)
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0001: Use ADRs to document blueprint's own architectural decisions
- "Nudge" — Thaler and Sunstein, on choice architecture and non-coercive intervention
