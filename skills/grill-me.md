---
name: blueprint:grill-me
description: >
  Interactive ADR grilling session. Use when: "grill me on the ADRs", "quiz me on architecture decisions",
  "test my ADR knowledge", "help me defend these decisions", "practice arguing architecture",
  "do I understand the ADRs?". Supports --mode recall|debate|scenario|mixed, --count N,
  --context X, --status X, --adr N, and --report.
---

# Grill Me on ADRs

Run an interactive, read-only grilling session over the current project's Architecture Decision Records.
The goal is not trivia. The goal is whether the user can explain, defend, challenge, and apply the
architecture decisions that constrain this codebase.

## Command Shape

Supported invocations:

```text
/blueprint:grill-me
/blueprint:grill-me --mode recall
/blueprint:grill-me --mode debate
/blueprint:grill-me --mode scenario
/blueprint:grill-me --mode mixed
/blueprint:grill-me --count 5
/blueprint:grill-me --context lifecycle
/blueprint:grill-me --status accepted
/blueprint:grill-me --adr 12
/blueprint:grill-me --report
```

Defaults:

- `--mode mixed`
- `--count 5`
- no context, status, or ADR filter
- no report unless `--report` is present

## Process

### Step 1: Parse Arguments

Parse the user's command text:

- `--mode recall|debate|scenario|mixed`
- `--count N`
- `--context X`
- `--status X`
- `--adr N`, accepting `N`, `ADR-N`, `ADR-NNNN`, and `NNNN`
- `--report`

If the mode is missing or invalid, use `mixed`. If count is missing, use `5`. If count is below 1,
use `1`. If count is above 20, use `20`; nobody learns architecture from a 73-question hazing ritual.

### Step 2: Load ADR Source Material

Use the Blueprint config resolution protocol:

1. Detect the ADR directory in this order:
   - `docs/adr/`
   - `docs/decisions/`
   - `adr/`
   - `decisions/`
2. If no ADR directory exists, stop and say:
   `No ADR directory found. Run /blueprint:init to bootstrap Blueprint or /blueprint:new "topic" to create your first ADR.`
3. Glob ADR files in that directory matching `[0-9][0-9][0-9][0-9]-*.md`.
4. If no ADR files exist, stop and say:
   `No ADR files found in [directory]. Run /blueprint:new "topic" before asking to be grilled.`
5. Read each ADR file and extract:
   - number
   - title
   - status
   - context/problem section
   - decision section
   - alternatives/options section if present
   - consequences section
   - date metadata if present
6. Read optional mutable state files if present. Missing state files are not an error.
   Follow the root Blueprint config resolution protocol for mutable state:
   - prefer `{adr_directory}/.state/<file>.toml` when present for consumer projects
   - fall back to `config/<file>.toml` when running inside the Blueprint plugin repo
   - read `relationships.toml`, `contexts.toml`, and `evidence.toml`

### Step 3: Apply Filters

Apply filters before smart selection:

- `--adr N`: keep only that ADR number.
- `--status X`: case-insensitive match against extracted status.
- `--context X`: match ADRs assigned to that bounded context in `contexts.toml`, or ADR markdown mentioning that context.

If filters produce no matches, stop and report the filter set:

```text
No ADRs matched: [filters]. Relax the filters or run /blueprint:list to inspect the available ADRs.
```

### Step 4: Build a Smart Question Pool

Prefer a balanced pool rather than plain file order:

1. Accepted ADRs, because they constrain the codebase now.
2. Proposed or Deferred ADRs, because unresolved decisions need argument practice.
3. Cross-cutting ADRs from `contexts.toml`, because they affect multiple areas.
4. ADRs with many relationships in `relationships.toml`, because they shape other decisions.
5. ADRs with weak, stale, expired, or L0/L1 evidence in `evidence.toml`, because they make good debate targets.
6. Remaining ADRs by number, to avoid ignoring quiet decisions.

Do not spend tokens building a perfect ranking algorithm. Use the information available, explain the chosen
focus briefly, and start grilling.

### Step 5: Start the Session

Open with a compact setup line:

```text
Grill mode: [mode]. Questions: [count]. Pool: [N] ADRs after filters. I will ask one question at a time and score 0-2. No hand-waving.
```

Then ask exactly one question and stop for the user's answer.

Do not reveal the expected answer before the user answers. For recall questions, you may name the ADR number
or title if the question requires it. For debate and scenario questions, prefer withholding the exact ADR until
after the answer unless naming it makes the question clearer.

## Modes

### recall

Test whether the user knows the facts:

- What decision was made?
- What status is it in?
- What problem was it solving?
- What consequences did it call out?
- Which ADR owns this rule or invariant?

Example recall question:

```text
Which ADR explains why Blueprint decomposes behavior into focused sub-skills instead of one giant command prompt?
```

### debate

Test whether the user can defend or attack a decision:

- Why was this decision better than plausible alternatives?
- Which assumptions does it depend on?
- What trade-off did the team knowingly accept?
- What would make the decision invalid later?
- If you opposed this ADR, where would you press hardest?

Example debate question:

```text
Defend the decision to encode lifecycle rules as a state machine instead of prose. What does that buy us, and what does it cost?
```

### scenario

Test whether the user can apply ADRs to new situations:

- A proposed change conflicts with an accepted ADR. What happens?
- A team wants to bypass the documented workflow. Which decision constrains that?
- A codebase symptom appears. Which ADR explains or challenges it?
- A new requirement arrives. Which ADRs become relevant before implementation starts?

Example scenario question:

```text
A contributor wants to add a new architecture analysis feature by expanding the root /blueprint router with 200 lines of logic. Which ADRs push back, and what should happen instead?
```

### mixed

Rotate recall, debate, and scenario questions. Use `mixed` as the default because memorizing titles is cheap;
applying decisions under pressure is the useful part.

## Feedback and Scoring

After each user answer:

1. Cite the relevant ADR number and title.
2. Score the answer using this rubric:
   - `0`: missed the decision, invented facts, or contradicted the ADR.
   - `1`: partly correct but shallow, missing trade-offs, alternatives, or consequences.
   - `2`: accurate, grounded in the ADR, and defensible under follow-up questioning.
3. Give concise feedback:
   - what was right
   - what was missing
   - the sharper version of the answer
4. Track score by ADR and mode in conversation context.
5. Ask the next question if the count has not been reached.

Tone: use the Blueprint cranky senior engineer persona. Be direct, specific, evidence-backed, and allergic
to vague architecture incense. Do not be cruel; the point is useful pressure.

Escalate when the user answers well:

1. Recall the decision.
2. Explain the rationale.
3. Compare rejected alternatives.
4. Identify consequences and failure modes.
5. Apply the decision to a new scenario.

## Report Mode

If `--report` is not present, do not write files.

If `--report` is present, after the final question write a scorecard markdown file under:

```text
outputs/grill-me/YYYY-MM-DD-HHMM-scorecard.md
```

Create `outputs/grill-me/` if it does not exist.

The report must include:

```markdown
# ADR Grill-Me Scorecard

Date: YYYY-MM-DD HH:MM
Mode: [mode]
Filters: [filters or none]
Questions: [answered]/[planned]

## Score Summary

| Mode | Questions | Points | Max | Average |
|------|-----------|--------|-----|---------|
| recall | N | X | Y | Z |
| debate | N | X | Y | Z |
| scenario | N | X | Y | Z |

## ADRs Covered

| ADR | Title | Mode(s) | Score |
|-----|-------|---------|-------|

## Strengths

- [specific strength]

## Weak Spots

- [specific weakness]

## Recommended Follow-Up

- Reread ADR-NNNN: [reason]
- Drill: [specific next prompt]
```

Report safety:

- Do not include secrets, credentials, tokens, private personal data, or unrelated confidential details.
- Prefer summaries of user answers over verbatim quotes.
- If the user explicitly asks for a transcript after the session, redact sensitive content before writing it.

Do not include a full transcript unless the user explicitly asks for one after the session.

## End Condition

When the session ends, summarize in 3-5 lines:

- total score
- strongest area
- weakest area
- next ADRs to reread
- report path if `--report` was used
