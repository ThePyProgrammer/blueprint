---
name: blueprint:retro
description: >
  Post-fix retrospective — evaluates whether recent changes are band-aids or systemic fixes,
  classifies root causes, verifies proposed improvements against external sources, and proposes
  ADRs for architectural improvements worth formalizing. Use after: /gsd:quick, /rapid:quick,
  /rapid:bug-fix, manual fixes, or any commit that patches a symptom. Also triggered by:
  "was that a band-aid?", "should we document that?", "review this fix", "retrospective".
---

# Post-Fix Retrospective

Evaluates recent changes for band-aid vs systemic quality. Answers two questions:
1. Was this fix a band-aid? Could the bug class be prevented by design, not just this instance?
2. Are the proposed improvements real? Verified against external sources, not confabulated.

## Shared Context

Read from parent `adr/` skill directory:
- `config/taxonomy.toml` — root cause categories (the classification system)
- `state.toml` — ADR directory, retro history
- `agents/persona.md` — personality
- `agents/adr-retrospective.md` — agent instructions

## Process

1. **Determine what was fixed:**
   - If a commit range is provided, use that
   - Otherwise, read last 3 commits: `git log --oneline -3` and `git diff HEAD~3..HEAD`
   - Include conversation context about what was fixed
2. **Spawn retrospective agent:**
   - Read `agents/adr-retrospective.md` and `agents/persona.md`
   - Spawn `general-purpose` agent with:
     - Diff / commit messages
     - Root cause categories from `config/taxonomy.toml`
     - ADR directory path and existing ADR filenames
     - Full agent instructions + persona
3. **Present retrospective report** to the user
4. **If ADR recommended:**
   - Ask user if they want to create it now
   - If yes, invoke `/blueprint:new` with the proposed title and context pre-filled
5. **Update state:**
   - Set `last_retro` in `state.toml` to today
   - Append to `retro_history` with date, verdict, and ADR created (if any)

## Proactive Triggering

After observing a quick fix workflow (gsd:quick, rapid:quick, rapid:bug-fix, manual patch),
suggest: "That fix is in. Want to run `/blueprint:retro` to check if it warrants an ADR?"
Don't force it — just offer.
