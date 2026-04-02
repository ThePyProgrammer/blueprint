# ADR-0001: Use ADRs to document blueprint's own architectural decisions

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0001                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint is a Claude Code plugin for ADR lifecycle management. It helps other projects create, review, evaluate, and maintain Architecture Decision Records. The question arose early: should blueprint use its own ADR process to document its internal architectural decisions?

This is a non-trivial question. Many tools that generate or manage artifacts for other projects do not use those same artifacts internally. The risk of not dogfooding is that the tool's design drifts from real usage patterns. The risk of dogfooding is that internal process overhead slows development of a tool whose whole purpose is to reduce process overhead.

Blueprint's configuration, agent decomposition, persona choices, and evaluation strategies all constitute genuine architectural decisions with trade-offs worth recording.

## Options Considered

### Option 1: Document decisions informally in README and code comments

Lowest overhead. Decisions get captured where developers already look. But informal documentation lacks structure, is hard to search, and decays as READMEs get rewritten. No lifecycle tracking, no review process, no way to trace why a decision was made six months later.

### Option 2: Use blueprint's own ADR format for self-documentation

Full dogfooding. Every significant decision gets the same treatment blueprint provides to other projects: structured context, options analysis, Alexandrian prologue decision, consequences tracking, and lifecycle management. Serves double duty as both documentation and proof-of-concept.

### Option 3: Use a separate lighter-weight format

A custom decision log (maybe a simple table or bullet-point format) that captures decisions without the full ADR ceremony. Less overhead than Option 2, more structured than Option 1, but creates a second format that blueprint's team has to maintain alongside the real one.

## Decision

**We use blueprint's own ADR format and process to document blueprint's architectural decisions**, because a tool that manages ADRs but does not use them for its own decisions has no credibility, and because dogfooding surfaces usability problems that synthetic testing never will.

## Rationale

- Dogfooding is the most reliable way to find friction in the ADR workflow. If writing an ADR for blueprint feels painful, it will feel painful for users.
- The ADR corpus doubles as a living test suite. Every ADR exercises the template format, lifecycle states, cross-references, and search surface that blueprint manages for other projects.
- Structured decisions are searchable and auditable. Six months from now, someone can run `/blueprint:search "persona"` and find ADR-0005 instead of grepping through git blame on a README.
- The overhead is justified because blueprint's decisions are genuinely architectural. Choosing TOML over JSON, decomposing into sub-skills, adopting a shared persona: these have lasting consequences that deserve structured reasoning.

## Consequences

### Positive

- Blueprint's own ADR corpus serves as example output and integration test material.
- The team experiences the same workflow they ship to users, catching friction early.
- Decision history is preserved in a structured, searchable format.
- New contributors can understand why blueprint is built the way it is by reading the ADR directory.

### Negative

- Writing ADRs for internal decisions adds process overhead during early rapid iteration.
- There is a bootstrapping problem: the first few ADRs must be written before the tooling that manages them is complete.

### Risks

- Dogfooding bias: the team may unconsciously design the ADR format to suit their own preferences rather than general-purpose usage.
- Over-documentation: the temptation to write an ADR for every minor choice, diluting the signal of genuinely important decisions.

## References

- Michael Nygard, "Documenting Architecture Decisions" (2011)
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- ADR-0003: Use TOML over JSON for config DSL
