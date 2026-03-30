# ADR-0034: Automatic hooks for workflow integration

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0034                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint provides powerful governance capabilities — pre-commit guards, retrospective analysis, health checks, drift detection, decision debt tracking — but all of them require the developer to remember to invoke them at the right moment. The pre-commit guard (ADR-0026) is useless if no one runs it before committing. The retrospective agent (ADR-0011) produces the most value immediately after a bug fix, but developers do not think about architecture when they have just fixed a bug. The health check (ADR-0033) catches inconsistencies, but only if someone remembers to run it periodically.

This is the classic tooling adoption problem: the tool works, but adoption requires behavior change, and behavior change is the hardest part of any process improvement. Tools that require the developer to remember to invoke them at the right moment have low adoption. Tools that embed themselves into existing workflows — firing automatically at the moments when they add the most value — have high adoption. The difference is not capability; it is timing.

The development workflow already has natural trigger points where governance checks add value: before a commit (guard), after a bug fix (retro), after an ADR status change (architecture sync), after dependency changes (dependency watch), and periodically regardless of activity (health). These trigger points exist whether or not blueprint is present. The question is whether blueprint inserts itself at these points automatically or relies on the developer to remember.

## Options Considered

### Option 1: Manual invocation only — developer-driven governance

All blueprint commands are invoked manually by the developer. The developer decides when to run the guard, when to trigger a retrospective, when to check health. This respects developer autonomy and avoids any perception of the tool being intrusive. It is also the current state.

**Pros:** Maximum developer autonomy. No surprise invocations. No configuration complexity. The tool does exactly what the developer asks, when the developer asks. Zero risk of the tool being perceived as annoying or intrusive.

**Cons:** Adoption depends entirely on developer memory and discipline. The commands that add the most value at specific moments (retro after a fix, guard before a commit) are the ones least likely to be invoked manually because the developer is focused on the task, not on governance. Over time, manual invocation converges to zero for all but the most disciplined teams.

### Option 2: Configurable hooks that suggest at the right moments — embedded governance

Ship 5 configurable hooks that fire automatically at natural workflow trigger points: (1) pre-commit guard (opt-in, must be explicitly enabled) that checks staged changes against accepted ADR invariants before committing, (2) retro-suggest that detects recent bug-fix patterns (keywords like "fix," "patch," "hotfix" in recent commits) and suggests running a retrospective, (3) architecture-sync that fires after ADR status transitions to update dependent artifacts (ARCHITECTURE.md, relationship graph, index), (4) dependency-watch that detects changes to package manifests (package.json, Cargo.toml, pyproject.toml, go.mod) and suggests reviewing dependency-related ADRs, (5) periodic-health that runs the health check every 20 sessions to catch accumulated inconsistencies. All hooks suggest rather than block — they print a recommendation and the command to run, but do not prevent the developer from proceeding. The exception is the pre-commit guard, which blocks by design but is opt-in. Hooks are implemented via CLAUDE.md managed sections (for hook registration) and settings.json (for enable/disable and threshold configuration).

**Pros:** Governance checks fire at the moments when they add the most value, without requiring developer memory. Suggest-not-block respects developer autonomy — the hook informs, the developer decides. Opt-in pre-commit guard prevents surprise blocking. Configurable thresholds let teams tune sensitivity. Five hooks cover the most valuable trigger points without being exhaustive.

**Cons:** Hooks that fire too frequently become noise. Even suggestions, if constant, train developers to ignore them. The CLAUDE.md managed sections add complexity to the configuration model. Five hooks is a meaningful surface area to maintain and debug. Developers who dislike automated suggestions may perceive the tool as nagging.

### Option 3: Mandatory gates that block until resolved — strict governance enforcement

Implement hooks as mandatory gates. The pre-commit guard blocks all commits that violate ADR invariants. The retro gate blocks merges of bug-fix branches until a retrospective has been run. The health gate blocks new ADR creation if existing health issues are unresolved. These gates enforce governance compliance rather than suggesting it.

**Pros:** Maximum governance compliance. No architectural violations can slip through. Creates a culture where governance is non-negotiable. Consistent enforcement eliminates the "I forgot" failure mode entirely.

**Cons:** Mandatory gates create friction that is disproportionate to the value in most cases. A developer fixing a typo in a README should not be blocked by a governance gate. Strict enforcement breeds resentment and workarounds (developers will find ways to bypass gates that block them from shipping). The tool becomes an obstacle rather than an ally. Mandatory gates are appropriate for critical systems (medical devices, financial infrastructure) but oppressive for most software projects.

## Decision

**We ship 5 configurable hooks that embed governance into the development workflow automatically — pre-commit guard (opt-in), retro-suggest after fixes, architecture-sync after ADR transitions, dependency-watch on package changes, periodic-health every 20 sessions — with hooks that suggest rather than block**, because governance adoption is a timing problem, not a capability problem, and tools that fire automatically at the right moments achieve adoption that manual invocation never will, while suggest-not-block respects the developer autonomy that makes the suggestions trustworthy rather than resented.

## Rationale

- The adoption problem is empirical, not theoretical. Every team that has tried manual-only governance tooling reports the same pattern: enthusiastic adoption for the first two weeks, declining usage over the next month, and near-zero usage by month three. The tools work; the timing does not. Hooks solve the timing problem.
- Suggest-not-block is the critical design decision. A tool that blocks a developer from committing code they believe is correct creates an adversarial relationship. A tool that says "this commit may conflict with ADR-0012 — consider running `blueprint guard` to check" creates a collaborative relationship. The developer still has full control; the hook provides information they would not otherwise have at that moment.
- The pre-commit guard is opt-in because blocking is a different contract than suggesting. The other 4 hooks suggest and the developer can ignore the suggestion. The guard blocks the commit. This is appropriate for teams that want strict enforcement, but it must be a conscious choice, not a default.
- Five hooks cover the high-value trigger points without being exhaustive. More hooks could be added (post-merge check, release audit, PR review), but starting with 5 provides meaningful coverage without overwhelming the configuration surface. Additional hooks can be added as the system matures and usage patterns reveal which trigger points matter most.
- The periodic-health hook (every 20 sessions) catches slow-accumulating issues that no event-driven hook would detect. Staleness, config drift, and gradual index desynchronization are time-dependent problems, not event-dependent problems. A periodic check is the only way to catch them.
- Implementation via CLAUDE.md managed sections and settings.json leverages existing infrastructure. CLAUDE.md is already the mechanism for Claude Code hook registration. settings.json is already the mechanism for blueprint configuration. No new configuration system is needed.

## Consequences

### Positive

- Governance checks fire at the moments when they add the most value. The retro-suggest hook fires after a bug fix, when the developer has the most context about what went wrong and why. The dependency-watch hook fires after a package change, when the developer is already thinking about dependencies.
- Developer autonomy is preserved. Every hook except the opt-in guard produces a suggestion, not a gate. The developer can always proceed without acting on the suggestion. This builds trust — the tool is an advisor, not a gatekeeper.
- Architecture-sync eliminates a category of manual bookkeeping. When an ADR transitions from Proposed to Accepted, the relationship graph, index, and ARCHITECTURE.md should update. Doing this automatically prevents the staleness that manual updates inevitably produce.
- The configuration surface (enable/disable per hook, threshold tuning) lets teams calibrate the hooks to their workflow. A team that never wants retro suggestions can disable that hook. A team that wants health checks every 5 sessions instead of 20 can adjust the threshold.

### Negative

- Five hooks add surface area to the codebase that must be maintained, tested, and documented. Each hook has trigger logic, suggestion formatting, and configuration handling. This is not trivial.
- Hooks that fire at the wrong time (false positives) erode trust faster than hooks that fire at the right time build it. A retro-suggest that fires after every commit containing the word "fix" (including "fix typo in README") will be perceived as noisy and ignored.
- The CLAUDE.md managed sections create a coupling between blueprint configuration and the Claude Code hook system. Changes to the Claude Code hook API require updates to blueprint's hook management.

### Risks

- Alert fatigue: if hooks fire too frequently, developers will disable all of them rather than tuning individual thresholds. Mitigation: conservative default thresholds (e.g., retro-suggest only fires when 3+ recent commits contain fix-related keywords, not on every single one). The goal is fewer, higher-quality suggestions.
- Configuration complexity: 5 hooks with individual enable/disable and threshold settings create a configuration matrix that may be difficult to understand. Mitigation: sensible defaults that work without configuration. A developer who never touches hook settings gets reasonable behavior. Configuration is for tuning, not for basic operation.
- Workflow disruption: hooks that fire during time-sensitive workflows (debugging a production issue, rushing a hotfix) may be perceived as obstacles even if they are only suggestions. Mitigation: a global `blueprint hooks pause` command that temporarily disables all hooks for the current session, with automatic re-enable on the next session.

## References

- ADR-0026: Pre-commit architecture guard
- ADR-0011: Two-step verify in retrospective
- ADR-0033: Self-diagnostic health check for ADR system integrity
- ADR-0030: Generate ARCHITECTURE.md from ADRs
- ADR-0022: Config as domain-specific language
- ADR-0015: Proactive intervention for undocumented decisions
