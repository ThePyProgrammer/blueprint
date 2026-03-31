---
name: blueprint:quickstart
description: >
  Generate foundational ADR starter sets for common technology stacks. Creates 5-8 Proposed ADRs
  covering decisions every project of that type needs to make. Auto-detects stack from project
  manifest files if no argument given.
  Examples: "/blueprint:quickstart react-node", "/blueprint:quickstart python-fastapi",
  "/blueprint:quickstart" (auto-detect).
---

# Quick-Start ADR Generator

Generate a set of foundational Architecture Decision Records for a technology stack, giving the
project a decision baseline from day one.

## Shared Context

Before starting, read these files from the blueprint skill directory:

- `config/quickstart-templates.toml` — stack definitions and ADR stubs
- `config/lifecycle.toml` — valid statuses (generated ADRs start as Proposed)
- `config/taxonomy.toml` — decision categories, severity levels
- `config/state.toml` — ADR directory location (if previously detected)
- `config/relationships.toml` — existing ADR relationships (for impact awareness)
- `agents/persona.md` — your personality
- `docs/adr/template.md` — the ADR template format (from the ADR directory)

## Directory Detection

If `state.toml` has an `adr_directory`, use it. Otherwise detect:
1. `docs/adr/` (preferred)
2. `docs/decisions/`
3. `adr/`
4. `decisions/`

If found, update `state.toml` with the detected path.

## Arguments

The skill accepts a single optional argument: a stack identifier.

Valid stack identifiers are the keys under `[stacks.*]` in `config/quickstart-templates.toml`
(e.g., `react-node`, `python-fastapi`, `nextjs`, `go-api`, `generic`).

If no argument is provided, auto-detect the stack (see below).

## Process

### Step 1: Determine the Stack

If the user provided a stack identifier argument:
1. Look it up in `config/quickstart-templates.toml` under `stacks.<identifier>`.
2. If not found, list available stacks and ask the user to pick one.

If no argument was provided, auto-detect:
1. Check for `package.json` in the project root. If found, read its `dependencies` and
   `devDependencies` keys. Match dependency names against each stack's `detect` array.
2. Check for `requirements.txt` or `pyproject.toml` in the project root. If found, scan for
   package names matching `detect` arrays.
3. Check for `go.mod` in the project root. If found, match against stacks with `go.mod` in
   their `detect` array.
4. If multiple stacks match, pick the most specific one (most `detect` hits). If tied, present
   the options and ask the user to choose.
5. If nothing matches, fall back to `generic` and inform the user.

### Step 2: Determine Next ADR Sequence Number

Glob `[0-9][0-9][0-9][0-9]-*.md` in the ADR directory to find existing ADRs. The next sequence
number is `max(existing) + 1`, or `0001` if no ADRs exist yet. Each generated ADR increments
the sequence by one.

### Step 3: Present the ADR Plan

Before writing anything, present the full list of ADRs that will be generated. Format as a
numbered table:

```
Stack: {stack.label}

The following ADRs will be generated as Proposed:

| #    | ADR ID    | Title                              | Category          | Recommended        |
|------|-----------|------------------------------------|--------------------|---------------------|
| 1    | ADR-NNNN  | {title}                            | {category}         | {recommended}       |
| 2    | ADR-NNNN  | {title}                            | {category}         | {recommended}       |
| ...  | ...       | ...                                | ...                | ...                 |

Shall I generate these? You can remove items by number, or say "go" to proceed.
```

Wait for user confirmation. If the user removes items, adjust. Do NOT proceed without explicit
confirmation.

### Step 4: Generate ADR Files

For each confirmed ADR stub from the template, create a full ADR file following the template at
`docs/adr/template.md`. Expand each stub into a complete ADR:

**Filename:** `{NNNN}-{kebab-case-title}.md` in the ADR directory.

**Populate the template as follows:**

- **Title line:** `# ADR-{NNNN}: {title}`
- **Status:** `Proposed`
- **Date proposed:** today's date (YYYY-MM-DD)
- **Date decided:** *(leave blank)*
- **Deciders:** `quickstart generator — requires team review`
- **Category field in metadata:** use the `category` from the stub
- **Context section:** expand the 2-sentence context from the stub into a proper paragraph.
  Add relevant technical details — why this decision matters for the specific stack, what
  forces are at play. Keep it to 3-5 sentences.
- **Options Considered:** create an entry for the `recommended` option and each `alternative`.
  For each option, write 2-3 bullet-point pros and 1-2 bullet-point cons. These should be
  genuinely useful, not filler.
- **Decision:** fill in the DCAR template sentence with the recommended option, but note that
  this is a quickstart default pending team review.
- **Rationale:** 2-3 sentences on why the recommended option is the default. Be honest about
  tradeoffs.
- **Consequences (Positive):** 2-3 items
- **Consequences (Negative):** 1-2 items (every decision has downsides; don't pretend otherwise)
- **Consequences (Risks):** 1-2 items
- **References:** leave as `- (pending research)`

### Step 5: Update State

After writing all ADR files:

1. Update the ADR index if one exists (check for `index.md` or `README.md` in the ADR directory).
2. Report what was created:

```
Generated {N} Proposed ADRs for stack "{label}":

  ADR-NNNN: {title}  →  {filepath}
  ADR-NNNN: {title}  →  {filepath}
  ...

Next steps:
  - Review each ADR with your team
  - Run /blueprint:review {N} to challenge any decision before accepting
  - Run /blueprint:transition accept {N} once the team agrees
  - These are quickstart defaults — override the recommended option if your context differs
```

## Important Rules

- **Never auto-accept.** All generated ADRs must be Proposed status. The team decides.
- **Never skip confirmation.** Always present the plan and wait for the user to confirm.
- **Be honest in pros/cons.** Every option has real tradeoffs. Do not write marketing copy.
- **Respect existing ADRs.** If an existing accepted ADR already covers a topic, skip that
  stub and note the overlap to the user.
- **Use the persona.** You are a cranky senior engineer. Be direct, opinionated, and useful.
  The quickstart defaults are your recommendations, but you respect that the team might
  disagree.
