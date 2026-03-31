# ADR-0006: Use thin router pattern for command dispatch

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0006                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

With the decomposition into 12 sub-skills (ADR-0002), the root `/blueprint` command needs a mechanism to dispatch user input to the correct sub-skill. A user typing `/blueprint review ADR-0003` needs to reach the review sub-skill. A user typing `/blueprint what did we decide about caching?` needs to reach the search sub-skill.

The dispatch mechanism also needs to handle natural language. Users do not always use exact command names. "Show me all the ADRs" should route to list. "Why did we pick TOML?" should route to search. "Let's document this decision" should route to new.

Beyond routing, there is one responsibility unique to the root entry point: proactive intervention. When a user is making an architectural decision in a normal coding session without explicitly invoking blueprint, the router should recognize the decision-making pattern and suggest creating an ADR. This is the only behavior that does not belong in any sub-skill.

## Options Considered

### Option 1: Fat router with inline logic for simple commands

The router handles simple commands (help, list) inline and only dispatches to sub-skills for complex operations (new, review, evaluate). Reduces the number of sub-skill invocations for trivial commands but makes the router responsible for more than routing, violating single responsibility.

### Option 2: Thin router that only dispatches and handles proactive intervention

The router's only jobs are: (1) parse intent from user input, (2) dispatch to the appropriate sub-skill, and (3) detect architectural decisions being made without ADRs and intervene. Everything else — including trivially simple commands like help and list — is handled by sub-skills.

### Option 3: No router (users invoke sub-skills directly)

Users call `/blueprint:review`, `/blueprint:list`, etc. directly. No routing layer needed. But this requires users to know all sub-skill names, eliminates natural language dispatch, and removes the proactive intervention capability entirely.

## Decision

**We use a thin router (~107 lines as of v2.0.0) that parses intent from natural language and dispatches to sub-skills**, because the router should do exactly two things — route commands and detect unrecorded architectural decisions — and nothing else.

## Rationale

- Single responsibility: the router routes. It does not list ADRs, it does not create ADRs, it does not evaluate architecture. If the router is doing anything beyond intent parsing, dispatch, and proactive intervention, it has too much responsibility.
- 48 lines is small enough to verify by inspection. The entire routing logic is auditable in one screen. This is a deliberate constraint — if the router grows beyond ~60 lines, something that belongs in a sub-skill has leaked into the router.
- Natural language dispatch is a user experience requirement, not an optional feature. Users should be able to type `/blueprint why did we choose TOML?` and get results without knowing that `search` is the command name.
- Proactive intervention is the router's unique capability. No sub-skill can detect that a user is making an architectural decision during a normal coding session, because no sub-skill is invoked during normal coding sessions. Only the router, as the entry point, can perform this detection.
- The thin router pattern aligns with ADR-0002's decomposition rationale: load only what you need. The router loads 48 lines of routing logic, then the dispatched sub-skill loads its own 41-96 lines. At no point does the agent hold all 12 sub-skills in context.

## Consequences

### Positive

- The router is trivially simple and easy to debug.
- Natural language dispatch means users do not need to memorize sub-skill names.
- Proactive intervention catches architectural decisions that would otherwise go unrecorded.
- Adding a new sub-skill requires only adding a route to the router's dispatch table — the router does not need to understand the new skill's logic.

### Negative

- Every invocation has one extra dispatch step (router to sub-skill). This adds marginal latency.
- The natural language intent parser may misroute ambiguous commands. "Review the architecture" could mean `review` (ADR review) or `evaluate` (architecture evaluation).
- Proactive intervention requires the router to be loaded in contexts beyond explicit `/blueprint` invocations, which has token cost implications.

### Risks

- Router creep: the temptation to add "just one more" responsibility to the router because it is the entry point. Mitigation: the 48-line budget is a hard constraint. If a change would push past ~60 lines, it belongs in a sub-skill.
- Intent parsing errors: misrouting degrades user experience. Mitigation: when the router is uncertain, it asks the user to clarify rather than guessing.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0004: Encode lifecycle as state machine data, not prose
