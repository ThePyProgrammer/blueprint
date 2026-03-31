# The Hooks Saga: A Postmortem

*What happened when Blueprint tried to use Claude Code's hook system for architecture governance, and why it didn't work.*

**Versions affected:** v2.0.2 through v2.0.7 (7 fix commits across 5 patch releases)
**Duration:** Implemented and fully reverted within one session
**Root cause:** Prompt-type hooks are fundamentally unsuited for deterministic governance checks
**Resolution:** All prompt-type hooks disabled. Cross-plugin integration moved to skill-level proactive intervention.

---

## What We Built

In v2.0.2, Blueprint shipped 10 hooks in `hooks/hooks.json` designed to make architecture governance automatic:

| Hook | Type | Trigger | Purpose |
|------|------|---------|---------|
| Pre-commit guard | `prompt` | PreToolUse (Write/Edit) | Check file changes against ADR invariants |
| Retro-suggest (git) | `prompt` | PostToolUse (Bash) | Suggest `/blueprint:retro` after fix commits |
| Retro-suggest (plugins) | `prompt` | PostToolUse (Skill) | Detect `rapid:bug-fix` / `gsd:debug` completion |
| Feynman evidence | `prompt` | PostToolUse (Skill) | Link research to ADR evidence |
| GSD/RAPID ADR detection | `prompt` | PostToolUse (Skill) | Detect undocumented architecture decisions |
| Agent ADR detection | `prompt` | SubagentStop | Review agent output for architecture choices |
| Architecture sync | `prompt` | Stop | Suggest updating ARCHITECTURE.md after ADR transitions |
| Planning artifact watch | `prompt` | FileChanged | Detect architecture in PLAN.md / .planning/ |
| Session-end sweep | `prompt` | SessionEnd | Scan conversation for undocumented decisions |
| Periodic nudge | `prompt` | SessionStart | Governance staleness check (~1-in-20 sessions) |
| Dependency watch | `prompt` | FileChanged | Suggest ADR for new dependencies |
| Skill refresh | `prompt` | FileChanged | Suggest reinstall when skills change |

The vision was beautiful: Blueprint would run as a background architecture conscience, detecting undocumented decisions across GSD, RAPID, and Feynman workflows without the user invoking anything.

## What Went Wrong

### Problem 1: Prompt hooks fire on every matching event (v2.0.3)

The `PostToolUse` hook with matcher `Bash` fires on **every** Bash command — not just git commits. A session running 50 Bash commands would trigger 50 prompt evaluations, each adding latency and context consumption.

**Fix attempt:** Scoped the matcher, then replaced with a deterministic `command`-type script.

### Problem 2: Prompt hooks produce unpredictable output (v2.0.4)

Prompt-type hooks send a prompt to the LLM and expect structured output. But the LLM's response is non-deterministic. Sometimes it outputs a clean suggestion. Sometimes it outputs nothing. Sometimes it outputs malformed text that the hook runner can't parse.

**Fix attempt:** Disabled the Bash hook by default.

### Problem 3: Hook stdin field names are undocumented (v2.0.5)

The hook system passes event data as JSON on stdin. The field names in the JSON payload are not well-documented. We used the wrong field name, causing the deterministic script to fail silently.

**Fix attempt:** Corrected the field name. Re-enabled the hook.

### Problem 4: Prompt hooks cause JSON validation errors (v2.0.6)

The hook runner expects prompt-type hooks to return specific JSON structures. When the LLM produces output that doesn't match the expected schema — which happens non-deterministically — the entire hook chain fails with a JSON validation error. This **blocks the user's workflow** — the hook error must be dismissed before Claude Code continues.

**Fix attempt:** Stripped all prompt-type hooks that had caused errors.

### Problem 5: The fundamental problem (v2.0.7)

After 5 patch releases trying to make prompt hooks work, the pattern became clear:

**Prompt-type hooks are fundamentally unreliable for governance checks because:**

1. **Non-deterministic output.** The LLM may or may not produce the expected format. A governance check that works 80% of the time is worse than no check at all — it creates false confidence.

2. **Latency on every event.** Each prompt hook adds an LLM round-trip. With 10 hooks, every file write, every Bash command, every skill completion adds seconds of latency. Users disable hooks that slow them down.

3. **Context contamination.** Prompt hooks consume context window to evaluate their prompts. In a long session, governance hooks compete with the user's actual work for context space.

4. **Error propagation.** When a prompt hook produces malformed output, the error blocks the user's workflow. A governance system that blocks work is an anti-governance system.

5. **No state access.** Prompt hooks can't reliably read state files (state.toml, contexts.toml) because the prompt is evaluated in isolation, not in the skill's context. The hook has no way to know which ADRs exist or what the governance mode is.

## The Resolution

All prompt-type hooks were disabled in v2.0.7. The `hooks/hooks.json` file is now empty.

Blueprint's cross-plugin integration was **not lost** — it was moved to the right layer:

### What works instead

**Skill-level proactive intervention.** The Blueprint router (`skills/blueprint.md`) already has a "Proactive Intervention" section that triggers when it detects architectural decisions being made without ADRs. This fires through the normal skill system — no hooks needed. It has full context access, full state access, and deterministic behavior.

**The `/blueprint:nudge` skill.** Periodic governance checks work as a user-invocable skill, not a hook. Users run it when they want to, or it's suggested at natural breakpoints.

**The `/blueprint:onboard` skill.** New developer orientation doesn't need hooks — it's a one-time invocation.

### What hook types actually work

Based on this experience, only `command`-type hooks are reliable in Claude Code:

| Hook Type | Reliability | Use Case |
|-----------|-------------|----------|
| `command` | **Reliable** | Deterministic scripts with exit codes. No LLM involved. |
| `prompt` | **Unreliable** | Non-deterministic LLM output. JSON validation failures. |
| `http` | **Untested** | Potentially reliable for webhook-based checks. |
| `agent` | **Untested** | Spawns a subagent — likely has context/latency issues. |

If Blueprint adds hooks in the future, they should be `command`-type scripts that check specific, deterministic conditions (file existence, grep patterns, git state) and return exit code 0 (pass) or 2 (block with message).

## Lessons Learned

1. **Don't use LLMs for deterministic checks.** If you can express the check as a bash script, do that. LLMs are for judgment calls, not for "does this file contain the word 'fix'?"

2. **Hooks should be invisible when passing.** A hook that adds 2 seconds of latency to every file write will be disabled by the user within a day, regardless of how valuable its checks are.

3. **Test hooks in real workflows, not in isolation.** Our hooks worked fine when tested individually. They failed when 10 of them fired on every event in a real coding session.

4. **Fail open, not closed.** A governance hook that blocks the user's workflow on a validation error is worse than no hook at all. Governance should inform, not obstruct.

5. **The right layer matters more than the right feature.** Cross-plugin integration is a good idea. Implementing it as prompt hooks was the wrong layer. The skill system (proactive intervention) was the right layer all along.

## Timeline

| Version | Date | What Changed |
|---------|------|-------------|
| v2.0.2 | 2026-03-31 | Shipped 10 prompt-type hooks |
| v2.0.3 | 2026-03-31 | Scoped retro-suggest to git commits, added deterministic script |
| v2.0.4 | 2026-03-31 | Disabled Bash hook by default |
| v2.0.5 | 2026-03-31 | Corrected stdin field name, re-enabled |
| v2.0.6 | 2026-03-31 | Stripped hooks causing JSON validation errors |
| v2.0.7 | 2026-03-31 | Disabled all prompt-type hooks — accepted they're unreliable |

Seven fix commits. Five patch releases. One lesson: **prompt hooks are not governance infrastructure.**

---

*This postmortem exists so we don't repeat this mistake. The next time someone suggests "let's add a hook that uses a prompt to check for X," point them here.*
