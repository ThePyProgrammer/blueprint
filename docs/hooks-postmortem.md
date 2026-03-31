# The Hooks Saga

*How we built the perfect background architecture conscience, shipped it, watched it burn, tried to save it five times, and learned the most expensive lesson in Blueprint's history — all in a single afternoon.*

---

## Act I: The Vision

It started with an innocent question: *"Is there a way to make sure that Blueprint adds ADRs after GSD finishes plan-phase or RAPID finishes execute-set? Without having to be prompted."*

The answer seemed obvious. Claude Code has a hook system. Hooks fire on events — tool calls, file changes, session lifecycle. You write a prompt, attach it to an event, and the LLM evaluates it automatically. No user action required.

We saw the future: Blueprint running silently in the background of every coding session, watching every file write, every skill invocation, every agent completion — detecting the moment an architectural decision was made and surfacing it before the developer moved on. A background architecture conscience. The cranky senior engineer who never sleeps, never forgets, and never needs to be asked.

In 45 minutes, we built 10 hooks:

```
Pre-commit guard ............ Check file changes against ADR invariants
Retro-suggest (git) ......... Suggest /blueprint:retro after fix commits
Retro-suggest (plugins) ..... Detect rapid:bug-fix / gsd:debug completion
Feynman evidence pipeline ... Link research to existing ADRs
GSD/RAPID ADR detection ..... Catch undocumented architecture decisions
Agent ADR detection ......... Review agent output for architecture choices
Architecture sync ........... Update ARCHITECTURE.md after ADR transitions
Planning artifact watch ..... Detect architecture in PLAN.md / .planning/
Session-end sweep ........... Scan entire conversation for missed decisions
Periodic nudge .............. Governance staleness check every ~20 sessions
Dependency watch ............ Suggest ADR for new package dependencies
Skill refresh ............... Suggest reinstall when skills change
```

Twelve hooks. Every lifecycle event covered. Every cross-plugin integration wired. The v2.0.2 release notes proudly declared: *"Blueprint now runs as a background architecture conscience across the plugin ecosystem."*

It was the most elegant thing we'd built all session.

It lasted about four minutes.

---

## Act II: The First Cracks

### v2.0.3 — "Why is everything so slow?"

The `PostToolUse` hook with matcher `Bash` fires on **every Bash command**. Not just git commits. Every `ls`. Every `grep`. Every `cat`. A normal coding session runs 50-100 Bash commands. Each one triggered an LLM evaluation: *"Does this look like a bug fix?"*

Fifty invisible LLM round-trips per session. Each one adding 1-3 seconds of latency. Each one consuming context window. The user doesn't see the hooks firing — they just feel the system getting heavier, slower, like coding through mud.

**Fix attempt:** Scope the Bash matcher to only git commands. Then, when that was still too broad, replace the prompt with a deterministic shell script. A `command`-type hook that greps the Bash output for "fix" in commit messages. No LLM involved. Instant.

This worked. For this one hook. But the other 11 were still prompt-type.

### v2.0.4 — "It just... doesn't fire sometimes?"

The second problem was more insidious. Prompt hooks send a prompt to the LLM and expect structured output. But the LLM's response is non-deterministic. Ask it "did this skill invocation involve an architectural decision?" and sometimes you get:

```
Architectural decisions were made during this phase:
- Database choice: PostgreSQL selected over MongoDB
Run /blueprint:new "use PostgreSQL for primary storage" to document.
```

Beautiful. Exactly what we wanted. Other times you get:

```
No architectural decisions detected.
```

Fine. And sometimes you get:

```

```

Nothing. Empty string. The LLM decided the prompt wasn't worth responding to, or it hallucinated a response that got truncated, or the context window was too full to fit the hook evaluation. The hook runner expects *something*. It gets nothing. It silently moves on.

A governance check that works 80% of the time is worse than no check at all. It creates false confidence. "The hooks didn't flag anything" means either "everything is fine" or "the hooks didn't fire." You can't tell which.

**Fix attempt:** Disable the Bash hook by default. Leave the others running.

### v2.0.5 — "The script doesn't see any data"

We tried to make the deterministic `command`-type hook smarter. The hook system passes event data as JSON on stdin — tool name, arguments, output. Our script would parse the stdin JSON and check for fix-related patterns.

Except the JSON field names aren't documented. We used `tool_name`. The actual field was something else. The script parsed empty data, found no matches, and silently passed everything through.

**Fix attempt:** Read the actual stdin payload, find the right field name. Re-enable.

This is the point where a reasonable person would have stepped back and asked: *"Are we fighting the tool or using it?"*

We were not yet reasonable people.

---

## Act III: The Wall

### v2.0.6 — "JSON validation error, hook execution failed"

This was the one that broke the camel's back.

The hook runner expects prompt-type hooks to return JSON matching a specific schema. When the LLM produces output that doesn't match — a common occurrence with non-deterministic text generation — the hook runner throws a **JSON validation error**. This error doesn't just log a warning. It **blocks the user's workflow**. A red error message appears. The user must dismiss it before Claude Code continues.

Imagine: you're writing code. You save a file. Blueprint's pre-commit guard hook fires. The LLM generates a response that's slightly malformed. Claude Code freezes with a JSON error. You dismiss it. You save another file. Different malformed response. Another error. You've now spent more time dismissing governance errors than writing code.

A governance system that blocks work is an anti-governance system. It trains users to disable hooks. Which is exactly what they'll do.

**Fix attempt:** Strip every prompt-type hook that had ever caused an error. Leave only the ones that hadn't... yet.

### v2.0.7 — "Turn it all off"

We'd been through four fix cycles in the same afternoon. Each time, we thought we'd found the specific hook that was broken, when the reality was that the **category of hook** was broken.

The fifth time, we stopped patching and started thinking.

**Prompt-type hooks are fundamentally unsuited for deterministic governance checks because:**

**They're non-deterministic.** The entire point of a governance check is certainty. "Does this code violate ADR-0005?" has a yes or no answer. An LLM might answer yes, might answer no, might answer with a malformed paragraph, might answer with nothing. A governance system built on "might" is not a governance system.

**They add latency to every event.** Ten hooks means ten LLM evaluations per event. Not per session — per event. Save a file? Ten evaluations. Run a Bash command? Ten evaluations. A skill completes? Ten evaluations. Users don't tolerate invisible latency. They disable what slows them down.

**They contaminate context.** Every hook evaluation consumes context window. In a 200-turn session, governance hooks compete with the user's actual work for the finite resource of attention. The more hooks you add, the less context remains for the work the user is actually trying to do.

**They fail closed.** When a hook produces bad output, the user is blocked. Good governance fails open — it informs when it catches something, and is invisible when it doesn't. Hooks that block on their own errors are the opposite.

**They can't access state.** A prompt hook fires in isolation. It doesn't know what ADRs exist. It doesn't know what the governance mode is. It doesn't know what bounded contexts are defined. It can't read `state.toml` or `contexts.toml`. It's making governance judgments without access to the governance data.

We disabled everything. `hooks/hooks.json` became:

```json
{
  "description": "All hooks disabled — prompt-type hooks produce unreliable output.",
  "hooks": {}
}
```

Seven fix commits. Five patch releases. Twelve hooks built, twelve hooks removed. All in one afternoon.

---

## Act IV: The Lesson

The cross-plugin integration wasn't lost. It was never in the right place.

Blueprint's router — `skills/blueprint.md` — already had a "Proactive Intervention" section from v1. When the router detects that the conversation is heading toward a significant architectural choice and no ADR exists, it pauses and suggests `/blueprint:new`. This works because it fires through the normal skill system. It has full context access. It has full state access. It has deterministic behavior. It doesn't add latency to unrelated events. It doesn't block on its own errors.

The router was the governance mechanism all along. We just didn't trust it because it required the user to have Blueprint in their skill list, not because it didn't work.

The `/blueprint:nudge` skill handles periodic checks. Users run it when they want to, or it's suggested at natural breakpoints. No hook needed.

The `/blueprint:onboard` skill handles new developer orientation. A one-time invocation. No hook needed.

Every problem we tried to solve with hooks was already solvable with skills. We just wanted the hooks version because it felt more automatic. More invisible. More like the system was watching over you without you having to ask.

But the system watching over you without asking is only valuable if the system is reliable. An unreliable watcher is worse than no watcher — because you stop checking yourself.

---

## The Rules We Now Follow

**Rule 1: Don't use LLMs for deterministic checks.** If you can express the check as a bash script, use a `command`-type hook. LLMs are for judgment calls ("is this an architectural decision?"), not for pattern matching ("does this commit message contain 'fix'?").

**Rule 2: Hooks must be invisible when passing.** A hook that adds 2 seconds to every file write will be disabled within a day, regardless of how valuable its checks are. If the user can feel the hook, the hook is too heavy.

**Rule 3: Test hooks in real workflows, not in isolation.** Our hooks worked fine individually. They failed when 10 of them fired on every event in a real coding session. Unit testing hooks is necessary but insufficient.

**Rule 4: Fail open, not closed.** A governance hook that blocks the user's workflow on a validation error is worse than no hook at all. Governance should inform, not obstruct. Always.

**Rule 5: The right layer matters more than the right feature.** Cross-plugin integration is a good idea. Prompt hooks were the wrong layer. The skill system was the right layer all along. The feature was correct. The implementation was wrong. Knowing the difference saved us from abandoning a good idea because of a bad implementation.

---

## The Scoreboard

```
Hooks conceived:     12
Hooks shipped:       12
Fix commits:          7
Patch releases:       5
Hooks surviving:      0
Hours elapsed:        ~2
Lesson value:         Permanent
```

---

## Epilogue

There's an irony here that the cranky senior engineer in `persona.md` would appreciate.

Blueprint is a tool that forces teams to document their architectural decisions *before* committing to them. To research alternatives. To challenge assumptions. To verify evidence. To think before acting.

And then Blueprint's own developers shipped 12 hooks without testing them in a real workflow, iterated through five panic patches, and learned the hard way what anyone who has ever been paged at 3 AM already knows:

*The system that watches the watchers must itself be watched.*

We didn't ADR the hooks decision. We didn't challenge it. We didn't research alternatives. We just built what felt right and shipped it.

Every tool eventually fails its own principles. The measure of the tool is not whether it fails, but whether it has the mechanisms to detect the failure and course-correct. Blueprint detected this failure through real usage — the most reliable test there is — and course-corrected in the same session.

The hooks are gone. The lesson stays. And the next time someone says "let's add a prompt hook," we'll point them here.

---

*v2.0.2 → v2.0.7. March 31, 2026. We shipped fast, broke things, and learned the kind of lesson you can only learn by shipping.*
