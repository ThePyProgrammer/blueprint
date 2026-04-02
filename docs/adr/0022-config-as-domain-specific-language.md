# ADR-0022: Design config layer as a domain-specific language

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0022                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint encodes significant domain knowledge: the ADR lifecycle has defined states and valid transitions, root cause analysis uses a specific taxonomy of failure categories, architecture evaluation covers 5 named dimensions with defined criteria, and ADR relationships follow typed patterns (supersedes, depends-on, conflicts-with, related-to).

This domain knowledge must live somewhere. In the initial implementation, it was embedded directly in agent prompts: the lifecycle states were listed in the `new` skill's instructions, the root cause categories were enumerated in the `retro` agent's prompt, and the evaluation dimensions were described in each evaluator agent's system prompt. This worked, but it scattered domain concepts across 12 skill files and 10 agent definitions.

When a lifecycle rule changed, every skill that referenced lifecycle states needed updating. When a new root cause category was added, the retro agent's prompt needed editing. Domain knowledge was interleaved with agent logic, making it hard to audit, hard to change, and hard for users to customize.

## Options Considered

### Option 1: Inline in agent prompts, simple but scattered

Keep domain knowledge embedded in the prompts where it is used. Each agent contains its own copy of the relevant domain rules. Simple to implement: the knowledge is right where it is consumed. But every change requires editing multiple files, inconsistencies between copies are inevitable over time, and users who want to customize the lifecycle or taxonomy must edit agent prompts, a task that requires understanding prompt engineering, not just domain configuration.

### Option 2: Externalized as structured TOML config with formal schemas

Extract domain knowledge into dedicated config files: `lifecycle.toml` (states, transitions, validation rules), `taxonomy.toml` (root cause categories, evaluation dimensions, relationship types), `state.toml` (runtime state; see ADR-0019), `relationships.toml` (ADR cross-reference patterns). Agents read the config at invocation time. Domain concepts are expressed in domain terms, not prompt fragments.

### Option 3: Executable DSL (JavaScript/Python)

Define domain rules as executable code in a scripting language. Lifecycle transitions become functions, validation rules become predicates, taxonomy lookups become API calls. Maximum flexibility and expressiveness, but introduces a runtime dependency, requires users to write code to customize behavior, and crosses the complexity threshold that blueprint's scope does not justify.

## Decision

**We externalize domain knowledge as structured TOML config files that function as a lightweight domain-specific language**, because data outlives code. When lifecycle rules or root cause categories change, you should edit a config file, not an agent prompt. And because domain concepts expressed in domain terms are readable by domain experts, not just prompt engineers.

## Rationale

- Separation of concerns: agent prompts define *how* to analyze. Config files define *what* to analyze. The retro agent knows how to perform a retrospective. The taxonomy config knows what root cause categories exist. Neither needs to know about the other's internals.
- Single source of truth: lifecycle states are defined once in `lifecycle.toml`. Every agent that references lifecycle states reads the same file. When a state is added or a transition rule changes, one file is edited and all agents pick up the change.
- User customization: teams that want to add a root cause category or modify lifecycle transitions edit a TOML file. They do not need to understand agent prompts, skill instructions, or Claude Code internals. The config surface is the customization surface.
- TOML was already chosen as blueprint's config format (ADR-0003). Extending its use to domain knowledge maintains format consistency across the project.
- The config files are lightweight enough to be read in full at invocation time without meaningful token cost. The largest file (`taxonomy.toml`) is under 100 lines. This is a DSL that fits in an agent's context window alongside its instructions.
- The "DSL" label is intentional. These config files define a vocabulary (lifecycle states, root cause categories, evaluation dimensions, relationship types) and grammar (valid transitions, required fields, typed relationships) that constitute a small, focused language for expressing ADR management concepts.

## Consequences

### Positive

- Domain knowledge changes are isolated to config files. No agent prompt editing required for taxonomy or lifecycle changes.
- Config files are human-readable and editable by anyone who understands the domain, regardless of their familiarity with Claude Code or prompt engineering.
- The config corpus serves as documentation of blueprint's domain model. Reading `lifecycle.toml` tells you exactly what states exist and what transitions are valid.
- Validation rules in the config files catch errors at invocation time rather than producing wrong output at analysis time.

### Negative

- Agents must parse config files at invocation time, adding a small amount of processing to every command.
- Indirection: understanding an agent's full behavior now requires reading both its prompt and the config files it references. The behavior is no longer self-contained in a single file.
- Config schema evolution must be managed carefully. Adding required fields to a config file breaks existing installations that have not updated their config.

### Risks

- Config sprawl: as blueprint's domain model grows, the number of config files and their complexity may increase to the point where they are as hard to manage as the prompts they replaced. Mitigation: strict scoping. Each config file owns one domain concept. No catch-all config files.
- Parsing fragility: malformed TOML causes agent failures. Mitigation: config reads use defensive parsing with clear error messages that identify the file and line causing the problem.
- Over-abstraction: extracting *everything* into config makes simple things complicated. Not every piece of domain knowledge benefits from externalization. Mitigation: only extract knowledge that is referenced by multiple agents or that users are likely to customize. Agent-specific implementation details stay in the agent prompt.

## References

- ADR-0003: Use TOML over JSON for config DSL
- ADR-0019: Use session state persistence across invocations
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- Martin Fowler, "Domain-Specific Languages" (2010)
