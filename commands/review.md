---
name: blueprint:review
description: >
  Review a Proposed ADR with devil's advocate challenge before acceptance. Use when:
  "review adr N", "let's review the proposed adrs", "challenge adr N". Spawns a devil's
  advocate agent to find blind spots before the decision becomes binding. For direct
  acceptance without challenge, use the lifecycle transitions in the root /blueprint skill.
---

# Review a Proposed ADR

Review a Proposed ADR through a devil's advocate challenge process. This is the gate
between "someone wrote a decision" and "the team committed to it."

## Shared Context

Read from parent `adr/` skill directory:
- `config/lifecycle.toml` — valid transitions (Proposed → Accepted/Rejected/Deferred)
- `config/state.toml` — ADR directory location
- `agents/persona.md` — personality
- `agents/adr-devils-advocate.md` — agent instructions

## Process

1. **Read the target ADR** — user specifies by number or title
2. **Validate status** — must be `Proposed` (read lifecycle.toml for valid transitions)
3. **Spawn devil's advocate:**
   - Read `agents/adr-devils-advocate.md` and `agents/persona.md`
   - Spawn `general-purpose` agent with:
     - Full text of the Proposed ADR
     - ADR file path and directory path
     - List of all ADR filenames (for cross-reference)
     - Full content of both agent files as instructions
4. **Present the challenge report** to the user
5. **Ask for verdict** using AskUserQuestion:
   - **Accept** — Challenges noted, decision stands. Transition to Accepted.
   - **Reject** — Fatal flaw found. Ask for rejection reason. Transition to Rejected.
   - **Defer** — Need more information. Ask for trigger condition. Transition to Deferred.
   - **Revise** — Address specific challenges, re-review later.
6. **Execute transition** per `config/lifecycle.toml`:
   - Update ADR status and metadata
   - Update README.md index
   - Update `config/relationships.toml` if applicable
   - Commit with: `docs(adr): [accept|reject|defer] ADR-NNNN <title>`

## Skip Challenge

If the user says "just accept ADR N" or "accept adr N" without "review", this skill
should NOT be invoked — that's a direct lifecycle transition handled by the root `/blueprint` skill.
The challenge step is part of *review*, not *accept*.
