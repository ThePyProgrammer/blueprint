---
name: blueprint:new
description: >
  Create a new Architecture Decision Record. Use when: the user says "new adr", "create adr",
  "document this decision", "we should record this"; or when you notice a significant architectural
  choice being made without an ADR. Add --research to spawn a researcher agent first.
  Examples: "/blueprint:new use Redis for caching", "/blueprint:new --research session management strategy".
---

# Create a New ADR

Create a new Architecture Decision Record, optionally with research-backed evidence gathering.

## Shared Context

Before starting, read these files from the parent `adr/` skill directory:
- `config/lifecycle.toml` — valid statuses (new ADRs start as Proposed)
- `config/taxonomy.toml` — decision categories, severity levels
- `config/state.toml` — ADR directory location (if previously detected)
- `config/relationships.toml` — existing ADR relationships (for impact awareness)
- `agents/persona.md` — your personality

## Directory Detection

If `config/state.toml` has an `adr_directory`, use it. Otherwise detect:
1. `docs/adr/` (preferred)
2. `docs/decisions/`
3. `adr/`
4. `decisions/`

If found, update `config/state.toml` with the detected path.
Read `template.md` from the ADR directory if it exists.

## Process

1. **Determine next sequence number** — glob `[0-9][0-9][0-9][0-9]-*.md` in ADR directory
2. **Interview the user** if context is insufficient:
   - What decision needs to be made?
   - What alternatives were considered?
   - What constraints or forces are at play?
   - User can say "you fill it in" for parts you can infer
3. **Research (if `--research` flag or user requests):**
   - Read `agents/adr-researcher.md` from the parent skill directory
   - Spawn a `general-purpose` agent with the researcher instructions + `agents/persona.md`
   - Provide: decision topic, constraints, ADR directory path, existing ADR filenames
   - Present the research brief to the user
   - Pre-populate Options Considered from research
4. **Draft the ADR** using the project's template, status = `Proposed`
5. **Write the file** — `NNNN-short-descriptive-title.md`
6. **Update the index** in README.md
7. **Update `config/relationships.toml`** — add the new ADR as a node
8. **Update `config/state.toml`** — set `last_adr_created` to today
9. **Present** to user for review before commit
10. **Commit** with message: `docs(adr): propose ADR-NNNN <title>`

## Quality Checks

Read `config/taxonomy.toml` for decision categories and severity levels. Verify:
- Title uses present-tense imperative verb phrase
- Context explains forces/constraints
- At least 2 options considered
- Consequences include positive AND negative
- Category assigned from taxonomy

If thin on alternatives or consequences, push back — a rubber-stamp ADR is worse than none.

## File Naming

`NNNN-short-descriptive-title.md` — zero-padded, kebab-case, imperative verb phrase.

## Commit Convention

`docs(adr): propose ADR-NNNN <title>`
Include both the ADR file and updated README.md.
