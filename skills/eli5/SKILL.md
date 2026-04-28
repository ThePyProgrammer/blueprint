---
name: blueprint:eli5
description: >
  Explain an ADR or the entire architectural landscape in plain English. No jargon, no
  acronyms left unexpanded, concrete analogies. Use when: "explain adr N", "eli5 adr N",
  "what does adr 3 mean?", "explain architecture", "eli5 the whole thing", "summarise
  our decisions", "what have we decided so far?", "give me the big picture", or when
  onboarding someone who hasn't read the ADRs.
---

# ELI5 — Explain Like I'm 5 (but an intelligent 5)

Two modes depending on whether a number is provided:

- **`/blueprint:eli5 N`** — Explain a single ADR in plain English
- **`/blueprint:eli5`** (no number) — Explain the entire architectural landscape

No jargon survives this skill. Every technical term gets an analogy. Every decision gets
a "so what?" The goal is that someone who has never read an ADR can understand what was
decided and why it matters after reading the output.

## Shared Context

Read from parent `blueprint/` skill directory:
- `state.toml` — ADR directory location
- `relationships.toml` — how ADRs relate to each other

## Mode 1: Single ADR (`/blueprint:eli5 N`)

Read the specified ADR file. Produce a plain-English explanation with this structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► ELI5: ADR-NNNN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## The Problem

[1-2 sentences: what situation made this decision necessary.
Use a real-world analogy. Not "we needed a database" but "we needed
somewhere to store patient records that wouldn't lose data if the
power went out."]

## What We Decided

[1-2 sentences: the decision in plain English. No acronyms.
"We chose PostgreSQL" becomes "We chose a traditional relational
database (PostgreSQL) — think of it as a very organized filing
cabinet where every drawer has a label and everything is
cross-referenced."]

## What We Considered

[For each option that was evaluated, one sentence:]
- **[Option]**: [Plain English description + why we didn't pick it]

## Why This One

[2-3 sentences: the actual rationale in non-technical terms.
What made this option better than the others for our situation?]

## What This Means for You

[1-3 bullets: practical consequences a developer would care about.
"So what?" answers:]
- If you need to X, do it this way because of this decision
- Don't do Y — this decision rules it out
- This connects to ADR-NNNN which decided [related thing]

## The Trade-Off

[1 sentence: what we gave up by making this choice.
Every decision has a cost. Name it plainly.]
```

**Rules:**
- Every acronym gets expanded AND explained on first use
- Technical terms get a concrete analogy (not "asynchronous processing" but "like a restaurant where you order at the counter and they call your number when it's ready")
- No hedging — state things directly
- Keep total length under 30 lines
- If the ADR references other ADRs, briefly note the connection

## Mode 2: Full Landscape (`/blueprint:eli5`, no number)

Read ALL ADR files and `docs/ARCHITECTURE.md` if it exists. Produce a narrative summary
of the entire architectural landscape:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLUEPRINT ► ELI5: THE BIG PICTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## What We're Building

[2-3 sentences from ARCHITECTURE.md or inferred from ADRs.
Plain English, no jargon.]

## The Key Decisions (in order of importance)

[Group related ADRs into themes. For each theme:]

### [Theme: e.g., "How We Store Data"]

We decided to [plain English summary]. This means [practical
consequence]. (ADR-NNNN, ADR-MMMM)

### [Theme: e.g., "How the AI Works"]

...

[Continue for each theme. 3-6 themes typical.]

## The Rules

[From ARCHITECTURE.md invariants or inferred from ADRs.
Plain English list of things you must not do:]

1. Never [rule] — because [one-sentence reason]
2. Always [rule] — because [one-sentence reason]

## What We Deliberately Don't Do

[From out-of-scope decisions and rejected ADRs.
These are just as important as what we do:]

- We don't [thing] — because [reason]

## The 30-Second Version

[One paragraph. If someone reads nothing else, they read this.
What is it, what are the 3 most important decisions, what are
the 2 most important rules.]
```

**Rules for full landscape:**
- Group by theme, not by ADR number — humans think in topics, not sequence numbers
- Read `relationships.toml` to identify clusters of related ADRs
- Lead with the most impactful decisions, not the first ones chronologically
- The 30-second version at the end is the most important part — write it last
- Keep total length under 80 lines
- If there are more than 15 ADRs, focus on the top 10 by impact and mention the rest as "also decided: [list]"

## Tone

This is the ONE skill where the cranky senior engineer persona softens slightly. The
persona still applies — direct, no hedging, no fluff — but the goal is comprehension,
not challenge. Think of it as the senior engineer explaining the system to a smart new
hire on their first day. Patient about the concepts, impatient about unnecessary
complexity in the explanation itself.
