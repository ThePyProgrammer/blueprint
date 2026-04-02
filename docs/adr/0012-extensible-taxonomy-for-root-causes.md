# ADR-0012: Use extensible taxonomy for root cause classification

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0012                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's retrospective agent (ADR-0011) classifies root causes as the first step of its two-step verify pattern. The classification drives both the analysis and the type of recommendation produced. The question is where these categories live and how they evolve.

Hardcoding categories in the agent prompt is the simplest approach. The agent receives a fixed list of root cause types and classifies accordingly. But software projects vary enormously in their failure modes. A distributed systems project encounters different root causes than a frontend application. A fixed taxonomy cannot cover the long tail of project-specific failure patterns.

Free-form classification (letting the agent invent categories) produces inconsistent labels. "Race condition," "concurrency issue," "timing bug," and "thread safety violation" might all describe the same root cause but get counted as four separate categories, defeating the purpose of classification.

An extensible taxonomy provides a structured starting point with the ability to grow. Initial categories cover the most common architectural root causes. Teams add project-specific categories as they encounter failures that do not fit the defaults.

## Options Considered

### Option 1: Hardcoded in agent prompt

- **Pros:** Simplest implementation. No external file to manage. Categories are version-controlled with the agent code.
- **Cons:** Cannot adapt to project-specific failure modes. Changes require modifying the agent prompt. No way for users to contribute categories without forking.

### Option 2: Extensible TOML taxonomy with categories, examples, and prevention patterns

- **Pros:** Structured starting point with 10 initial categories. Teams add project-specific categories. Each category includes examples (for classification accuracy) and prevention patterns (for recommendation quality). Consistent with TOML-first strategy (ADR-0003).
- **Cons:** Another configuration file to manage. Users must understand the taxonomy format to extend it. Categories can proliferate without governance.

### Option 3: Free-form classification

- **Pros:** No predefined categories to maintain. Agent adapts naturally to any project.
- **Cons:** Inconsistent labels across analyses. No aggregation possible; cannot answer "what are our most common root causes?" Recommendations lack structure because they are not grounded in a defined prevention pattern.

## Decision

**In the context of** root cause classification in the retrospective agent, **facing** the need for consistent yet project-adaptable categorization, **we decided for** an extensible TOML taxonomy with 10 initial categories, examples, and prevention patterns, **to achieve** consistent classification that teams can customize without forking, **accepting** the overhead of maintaining an additional configuration file.

The taxonomy lives at `.blueprint/taxonomy.toml`. Initial categories: missing validation, implicit contract, state management, error handling gaps, concurrency/ordering, missing boundary, configuration drift, dependency assumption, performance cliff, and security boundary violation. Each category includes 2-3 example scenarios and 1-2 prevention patterns.

## Rationale

- Consistent labels enable aggregation. After 20 retrospectives, a team can see "40% of our bugs come from implicit contracts" and prioritize accordingly. Free-form labels make this impossible.
- Examples improve classification accuracy. Providing the agent with concrete scenarios for each category reduces misclassification. "Missing validation" with examples like "API endpoint accepts negative quantities" is more precise than the bare label.
- Prevention patterns connect classification to action. Knowing a bug was caused by "state management" is useful; knowing the prevention pattern is "use state machines for multi-step workflows" is actionable.
- TOML format is consistent with ADR-0003 and human-editable. Teams can add categories with a text editor.
- 10 initial categories were chosen by surveying common architectural failure modes across open-source post-mortems. The number is large enough to be useful but small enough to be learnable.

## Consequences

### Positive

- Root cause trends become visible over time through consistent categorization.
- Teams can add domain-specific categories (e.g., "HIPAA boundary violation" for healthcare, "eventual consistency misunderstanding" for distributed systems).
- Prevention patterns provide concrete, actionable recommendations rather than generic advice.
- The taxonomy serves as institutional memory of failure modes the team has encountered.

### Negative

- Another file (`.blueprint/taxonomy.toml`) to maintain and version-control.
- Category proliferation risk: teams may add overlapping or overly specific categories.
- The initial 10 categories may not cover every project's primary failure modes, requiring early customization.

### Risks

- Taxonomy bloat making classification less accurate as the agent must choose among too many similar categories. Mitigation: the taxonomy format supports a `deprecated` flag to retire categories, and the retrospective agent prefers broader categories when confidence is low.
- Teams may never customize the taxonomy, treating the defaults as authoritative even when they do not fit. Mitigation: the retrospective agent's output includes a note when a root cause was a poor fit for all existing categories, prompting taxonomy extension.

## References

- ADR-0011: Two-step verify in retrospective agent
- ADR-0003: Use TOML over JSON for config DSL
- Orthogonal Defect Classification (ODC), IBM Research, structured defect categorization
