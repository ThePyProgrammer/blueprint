# ADR-0018: Use contextual suggestions in help and list commands

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0018                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Help and list commands are the entry points for users who do not know what to do next. A user runs `/blueprint:help` or `/blueprint:list` because they need guidance. The question is whether that guidance should be static (the same output every time) or adaptive to the current state of their project.

Static help works fine when a user already knows the workflow and just needs a command name reminder. But new users and users returning after a break need more than a command reference — they need to know which command to run *right now*, given the current state of their ADRs, their codebase, and their recent activity.

The information needed to make contextual suggestions already exists: the ADR directory contains status metadata, the state file tracks operation timestamps, and the conversation context reveals what the user has been working on. The question is whether the help and list commands should use this information.

## Options Considered

### Option 1: Static command reference only

Help prints a fixed list of commands with descriptions. List prints ADRs with their status. No adaptation based on state. Simple to implement, predictable output, easy to test. But it leaves users to figure out the workflow on their own — they see 12 commands and must decide which one applies to their situation.

### Option 2: Dynamic reference with contextual next-action suggestions

Help and list scan current state — Proposed ADR count, last audit date, conversation topics, codebase presence — and suggest up to 3 relevant next actions. If there are Proposed ADRs, suggest reviewing them. If no audit has been run in 30 days, suggest an audit. If the conversation has been discussing a technology choice, suggest creating an ADR. The static reference is still present, but the contextual suggestions appear first.

### Option 3: Interactive wizard

A step-by-step guided flow that asks the user questions and walks them to the right command. More hand-holding than Option 2, but slower for experienced users and difficult to implement well in a CLI context where each interaction consumes tokens and context.

## Decision

**We use dynamic contextual suggestions in both help and list commands**, because a help command that does not know your current state is just documentation, and documentation is what users read once and forget, while contextual suggestions meet users where they actually are.

## Rationale

- The gap between "knowing what commands exist" and "knowing what to do right now" is where users stall. Contextual suggestions bridge that gap without requiring the user to understand the full ADR lifecycle.
- The information cost is low. Scanning the ADR directory for status counts and reading timestamps from state.toml is fast. The suggestions are generated from rules, not expensive analysis.
- Limiting to 3 suggestions prevents information overload. Three is enough to cover the most relevant next action, a maintenance action, and a discovery action, without turning the help output into a wall of text.
- The static reference remains available for users who want the full command list. Contextual suggestions are additive, not a replacement.
- This pattern is well-established in developer tools. `git status` suggests next actions. Package managers suggest updates. Blueprint's help and list should do the same.

## Consequences

### Positive

- New users always know what to do next without reading documentation.
- Maintenance operations (audits, evaluations, retros) surface naturally when they are due, rather than being forgotten.
- The help output becomes a lightweight project health indicator — the suggestions implicitly communicate whether ADRs need attention.
- Users returning after a break can run `/blueprint:help` and immediately see what needs their attention.

### Negative

- Help output varies between invocations, which can be disorienting for users who expect deterministic output.
- The suggestion logic must be maintained as new commands and states are added. Each new command potentially requires new suggestion rules.
- Scanning state adds a small latency to help and list commands that would otherwise be instant.

### Risks

- Stale suggestions: if the state file is not updated correctly by other commands, suggestions may be wrong (e.g., suggesting an audit when one was just completed). Mitigation: each command that modifies state updates the state file as its last action.
- Over-suggestion: if every possible condition triggers a suggestion, users may start ignoring them. Mitigation: the 3-suggestion cap and priority ranking ensure only the most relevant actions surface.

## References

- ADR-0019: Use session state persistence across invocations
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- Git status command pattern (contextual next-action suggestions)
