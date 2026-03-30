# ADR-0003: Use TOML over JSON for config DSL

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0003                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint's configuration layer encodes several structured concerns: the lifecycle state machine (valid states, transitions, requirements), taxonomy (decision categories, impact levels), persistent state (ADR registry, cross-references), and relationship mappings between ADRs. This configuration was initially implemented in JSON.

JSON is verbose. Every key requires double quotes. Every object requires braces. Every array requires brackets. Colons separate keys from values. Commas separate entries. For a lifecycle transition rule like "Proposed can move to Accepted if it has a review," JSON requires roughly 3x the tokens that the same information needs in a more compact format.

This matters because blueprint's config files are read by LLM agents. Every token in a config file consumes context window budget. Blueprint's agents load config on every invocation to determine valid lifecycle transitions, resolve relationships, and check taxonomy constraints. Token-expensive config formats directly reduce the context budget available for actual reasoning.

## Options Considered

### Option 1: JSON

The status quo. Universal support, no ambiguity, every tool and language can parse it. But the verbosity tax is real: mandatory quoting of all keys, no comments, no multiline strings without escaping, deeply nested structures for what are often flat key-value mappings.

### Option 2: TOML

Tom's Obvious Minimal Language. Designed for configuration files. Supports comments, bare keys (no quoting required for simple keys), dotted keys for moderate nesting, inline tables for compact structures. Less token-heavy than JSON for flat-to-moderate nesting patterns. Well-specified with a formal grammar.

### Option 3: YAML

Compact, human-readable, supports comments. But indentation-sensitive parsing is fragile — a single misplaced space changes semantics silently. The spec is enormous (86 pages vs TOML's 30). Implicit typing causes surprises (`no` becomes `false`, `3.10` becomes `3.1`). Norway problem. Multiple valid representations for the same data create inconsistency.

## Decision

**We use TOML for all blueprint configuration files**, because it is less token-heavy than JSON, more predictable than YAML, and handles the flat-to-moderate nesting that our configuration naturally requires without the indentation sensitivity that makes YAML fragile in LLM-generated contexts.

## Rationale

- Token efficiency: TOML's bare keys, lack of mandatory quoting, and section headers (`[lifecycle.transitions]`) encode the same information as JSON in roughly 40-60% fewer tokens. Over dozens of agent invocations per session, this reclaims meaningful context budget.
- Comments: TOML supports inline comments. Config files can explain why a transition requires review or why a taxonomy category exists. JSON cannot do this; the explanations would need to live elsewhere.
- Predictable parsing: TOML has no implicit type coercion surprises. A string is always quoted, a number is always bare. Unlike YAML, `no` is the string `"no"`, not the boolean `false`.
- Blueprint's config is naturally flat-to-moderate nesting. Lifecycle states are a flat list. Transitions are two levels deep. Taxonomy is one level. TOML handles this nesting range well. It struggles with deeply nested structures (4+ levels), but blueprint's config does not have those.
- LLM generation: agents occasionally need to update config (e.g., registering a new ADR in state). TOML's lack of indentation sensitivity makes LLM-generated config edits less error-prone than YAML.

## Consequences

### Positive

- Measurably fewer tokens consumed per config load, freeing context budget for reasoning.
- Config files are self-documenting via inline comments.
- No indentation-sensitivity bugs in LLM-generated config updates.
- Clean section headers make config files navigable by both humans and agents.

### Negative

- TOML is less universally known than JSON or YAML. Contributors may need to learn the format.
- Deeply nested structures (if blueprint's config ever needs them) are awkward in TOML. Arrays of tables (`[[section]]`) are less intuitive than JSON arrays.
- Fewer editor plugins and syntax highlighting options compared to JSON/YAML, though coverage is improving.

### Risks

- If blueprint's config grows to require deep nesting (4+ levels), TOML becomes the wrong tool and a migration to a different format may be needed.
- LLMs are trained on more JSON than TOML. There is a small risk that agents parse or generate TOML less reliably. Mitigation: config files are read-heavy, write-rare, and writes are validated.

## References

- TOML specification: https://toml.io/en/v1.0.0
- ADR-0004: Encode lifecycle as state machine data, not prose
- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
