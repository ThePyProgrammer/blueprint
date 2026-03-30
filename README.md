# blueprint

*"The best time to plant a tree was twenty years ago. The second best time is before you write the code."*

---

Architecture Decision Records with teeth. A Claude Code plugin that treats architectural decisions as first-class engineering artifacts — researched before they're proposed, challenged before they're accepted, audited after they're implemented, and revisited when the world changes.

Every agent speaks with the voice of a senior engineer who has watched too many "temporary" decisions become permanent load-bearing walls.

## The Problem Blueprint Solves

> "We shape our buildings; thereafter they shape us." — Winston Churchill

Software architecture is not a document. It is the set of decisions that constrain all future decisions. Every technology choice, every boundary drawn, every pattern adopted closes some doors and opens others. The tragedy of most software projects is not that these decisions are made poorly — it is that they are made *invisibly*. A decision made in a Slack thread at 4pm on a Friday becomes the foundation of a system that runs for a decade.

Architecture Decision Records (ADRs) were invented to solve this. But in practice, most ADR implementations fail for the same reason most New Year's resolutions fail: there is no enforcement mechanism. Writing the decision down is the easy part. *Researching it before committing, challenging it before accepting, verifying that the codebase actually follows it, and revisiting it when circumstances change* — that's where ADR processes quietly die.

Blueprint doesn't let them die.

## Philosophical Foundations

### On the Nature of Decisions

Blueprint is built on a specific epistemological claim: **architectural decisions are hypotheses, not declarations**. When you write "use PostgreSQL for primary storage," you are not stating a fact — you are stating a bet. You are betting that PostgreSQL's properties (ACID guarantees, ecosystem maturity, JSONB flexibility) will serve your needs better than the alternatives, given your constraints, for the foreseeable future.

Like any hypothesis, an architectural decision should be:
- **Falsifiable** — there must be conditions under which it would be wrong
- **Evidence-based** — supported by research, not just preference
- **Challengeable** — subjected to adversarial review before acceptance
- **Revisable** — updated when the evidence changes

This is why blueprint has a devil's advocate, not just a reviewer. The [Hegelian dialectic](https://en.wikipedia.org/wiki/Dialectic#Hegelian_dialectic) — thesis, antithesis, synthesis — is not academic decoration. It is the mechanism by which decisions become robust. A decision that has never been challenged is a decision that has never been tested.

### On Conway's Law

> "Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure." — Melvin Conway, 1967

Conway's observation is not a suggestion to be followed or a bug to be fixed. It is a *law of nature* — as inescapable as gravity. You can either design your architecture to align with how your team actually communicates, or you can watch your architecture slowly reshape itself to match the communication structure anyway, usually in the worst possible way.

Blueprint's Conway's Law analyzer doesn't ask "does your architecture match your org chart?" It asks "does your architecture match how people *actually work*?" — because the org chart is a theory, and git blame is the data.

### On Technical Debt as Deferred Decisions

Cunningham's original metaphor of [technical debt](https://wiki.c2.com/?TechnicalDebt) was specifically about the gap between what the code *does* and what the team now *understands*. It was not about sloppy code — it was about decisions that were correct at the time but have been superseded by new understanding.

Blueprint's retrospective agent (`/blueprint:retro`) operationalizes this insight. After every fix, it asks: was this a band-aid on a symptom, or did it address the structural cause? If the same root cause class keeps producing bugs, the architecture has a gap that no amount of patching will close. The gap needs a *decision* — an ADR that addresses the structural issue — not another fix.

### On the Cranky Senior Engineer

> "I'm not being difficult. I'm being precise. There's a difference, and the fact that you can't tell is part of the problem."

Blueprint's agents share a persona: the senior engineer who has been paged at 3 AM because someone thought shared mutable state was "simpler." This is not aesthetic — it is functional.

Research on [code review effectiveness](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs/) shows that polite, hedging feedback ("you might want to consider...") is systematically ignored, while direct, specific feedback ("this should be const — it's never reassigned") produces action. The persona ensures that findings are stated with the clarity and conviction required to actually change behavior.

The persona is blunt but not cruel. It respects the developer, not the code. It backs every opinion with evidence. And it credits good work when it sees it — briefly, then moves on to what isn't good.

## How Blueprint Works

### The Decision Lifecycle

Every architectural decision passes through a formal lifecycle encoded as a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) in `config/lifecycle.toml`:

```
                ┌──────────┐
                │ Proposed │
                └────┬─────┘
                     │
              ┌──────┴──────┐
              │   Review    │  ← devil's advocate challenges here
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Accepted │ │ Rejected │ │ Deferred │
   └────┬─────┘ └──────────┘ └─────┬────┘
        │                          │
        │    (trigger met)         │
        │◄─────────────────────────┘
        │
   ┌────┴──────────────┐
   ▼                   ▼
┌──────────────┐ ┌──────────────┐
│  Deprecated  │ │  Superseded  │
│              │ │  by ADR-NNNN │
└──────────────┘ └──────────────┘
```

Transitions are validated against the state machine. You cannot accept a rejected ADR (create a new one). You cannot supersede a proposed ADR (decide on it first). You cannot deprecate something that was never accepted. These rules are not enforced by prose — they are enforced by data.

### The Agent Architecture

Blueprint decomposes architectural governance into orthogonal concerns, each handled by a specialized agent:

```
┌─────────────────────────────────────────────────────────┐
│                    BLUEPRINT ROUTER                      │
│            (thin dispatcher, 48 lines)                   │
└───────┬──────┬──────┬──────┬──────┬──────────────────────┘
        │      │      │      │      │      │
        ▼      ▼      ▼      ▼      ▼      ▼
     ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
     │ new ││ rev ││ eval││retro││audit││ ... │  ← 15 focused skills
     └──┬──┘└──┬──┘└──┬──┘└──┬──┘└──┬──┘└─────┘
        │      │      │      │      │
        ▼      ▼      ▼      ▼      ▼
  ┌──────────────────────────────────────────┐
  │           AGENT POOL (12 agents)          │
  │                                          │
  │  researcher · devil's advocate · impact   │
  │  compliance · consistency · bug surface   │
  │  maintainability · testing · conways      │
  │  retrospective · cartographer             │
  │                                          │
  │  ┌────────────────────────────────────┐  │
  │  │     SHARED PERSONA (persona.md)    │  │
  │  │  cranky senior engineer, 20 years  │  │
  │  └────────────────────────────────────┘  │
  └──────────────────────────────────────────┘
        │      │      │      │
        ▼      ▼      ▼      ▼
  ┌──────────────────────────────────────────┐
  │         CONFIG DSL (TOML)                │
  │                                          │
  │  lifecycle.toml     ← state machine      │
  │  taxonomy.toml      ← classifications    │
  │  state.toml         ← session memory     │
  │  relationships.toml ← dependency graph   │
  └──────────────────────────────────────────┘
```

This is a deliberate application of the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) at the agent level. The researcher doesn't review. The reviewer doesn't audit. The auditor doesn't evaluate. Each agent has one job and does it with the depth that comes from focus.

### The Config DSL

Blueprint encodes its domain knowledge as structured TOML rather than prose instructions. This is an application of the principle that **data outlives code** — when the lifecycle rules, root cause categories, or evaluation dimensions need to change, you edit a config file, not an agent prompt.

| Config | What it encodes | Why it matters |
|--------|----------------|----------------|
| `lifecycle.toml` | Status × Transition × Requirement matrix | Agents validate transitions against data, not English |
| `taxonomy.toml` | Root cause categories, eval dimensions, severity levels | Classification is consistent across agents and sessions |
| `state.toml` | Last audit/evaluation/retro dates, ADR directory | Contextual suggestions without re-scanning every time |
| `relationships.toml` | ADR dependency graph (edges + types) | Impact analysis is incremental, not O(n^2) every time |

This is a lightweight [domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language) — not a general-purpose programming language, but a structured vocabulary for expressing architectural governance concepts.

## Commands

### Setup

| Command | Agent(s) | Purpose |
|---------|----------|---------|
| `/blueprint:init` | cartographer | Bootstrap blueprint onto an existing codebase — scan `.planning/`, `.research/`, CLAUDE.md, package files, git history for existing decisions, create ADR directory with template and lifecycle docs, infer ADRs, generate ARCHITECTURE.md |

`/blueprint:init` is the "day one" command. It reads every available source of architectural context — GSD planning artifacts, research files, CLAUDE.md conventions, dependency manifests, even early git commit messages — classifies discovered decisions by impact, and produces the full documentation suite in a single atomic commit. Think of it as an archaeological dig that turns implicit decisions into explicit records.

### Lifecycle

| Command | Agent(s) | Purpose |
|---------|----------|---------|
| `/blueprint:new "topic"` | — | Create an ADR from interview |
| `/blueprint:new --research "topic"` | researcher | Evidence-backed option analysis, then create |
| `/blueprint:list` | — | Status table + contextual next actions |
| `/blueprint:review N` | devil's advocate | Challenge across 5 dimensions before acceptance |
| `/blueprint:transition accept N` | — | Direct lifecycle transitions |
| `/blueprint:search "term"` | — | Find decisions by topic + relationship graph |
| `/blueprint:help` | — | Full reference + context-aware suggestions |

### Analysis

| Command | Agent(s) | Purpose |
|---------|----------|---------|
| `/blueprint:impact N` | impact analyzer | Cross-ADR conflict and dependency detection |
| `/blueprint:audit` | compliance auditor | Verify codebase follows accepted decisions |
| `/blueprint:retro` | retrospective | Post-fix: band-aid or systemic? Verified against sources. |
| `/blueprint:rearchitect "topic"` | researcher + impact | Research → draft → impact check → supersede |

### Architecture Evaluation Team

| Command | Agent(s) | Focus |
|---------|----------|-------|
| `/blueprint:evaluate` | **all 5 in parallel** | Unified architecture health report |
| `/blueprint:evaluate consistency` | consistency auditor | Pattern adherence, naming, layering, dependency direction |
| `/blueprint:evaluate bugs` | bug surface mapper | Complexity hotspots, coupling, missing boundaries |
| `/blueprint:evaluate maintainability` | maintainability assessor | Dependencies, abstractions, change amplification, debt |
| `/blueprint:evaluate testing` | testing evaluator | Pyramid health, anti-pattern tests, risk-aligned coverage |
| `/blueprint:evaluate conways` | Conway's Law analyzer | Ownership alignment, friction points, scaling readiness |

The full evaluation spawns all 5 agents in parallel, synthesizes an executive summary with a health score (STRONG / ADEQUATE / CONCERNING / CRITICAL), and auto-drafts Proposed ADRs for the most critical findings.

### Documentation

| Command | Agent(s) | Purpose |
|---------|----------|---------|
| `/blueprint:architect` | cartographer | Generate or update `docs/ARCHITECTURE.md` — bird's-eye codemap following [matklad's philosophy](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) |
| `/blueprint:eli5` | — | Explain the entire architectural landscape in plain English — grouped by theme, no jargon, 30-second version at the end |
| `/blueprint:eli5 N` | — | Explain a single ADR with analogies, expanded acronyms, and "what this means for you" consequences |

The eli5 commands exist because ADRs are written for the people who make decisions, not the people who live with them. `/blueprint:eli5` translates architecture-speak into language that any developer — or any smart person who isn't a developer — can understand. Every acronym gets expanded. Every technical term gets a concrete analogy. Every decision gets a "so what?"

## The Five Dimensions of Architectural Health

Blueprint's evaluation team assesses architecture across five orthogonal dimensions. Each dimension captures a different failure mode:

### 1. Structural Consistency

> "A foolish consistency is the hobgoblin of little minds." — Emerson
>
> A *useful* consistency is the foundation of navigable codebases.

A codebase that consistently uses a mediocre pattern is more maintainable than one that mixes three "better" patterns. Inconsistency is the leading cause of "surprise" bugs — a developer assumes one pattern applies everywhere, but one module silently uses another.

**What it checks:** Naming conventions, module structure, dependency direction, error handling patterns, API consistency, configuration approach.

### 2. Bug Surface

Not bug hunting — bug *cartography*. This dimension maps the architectural properties that make certain areas structurally bug-prone: high cyclomatic complexity, tight coupling, shared mutable state, missing boundaries, and implicit contracts.

The insight from [Lehman's laws of software evolution](https://en.wikipedia.org/wiki/Lehman%27s_laws_of_software_evolution) is that complexity grows unless actively fought. The bug surface mapper identifies where complexity has concentrated so you can address it architecturally rather than playing whack-a-mole with individual bugs.

### 3. Maintainability

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

Evaluates the structural properties that determine whether changes will be easy (localized, predictable, safe) or painful (cascading, surprising, risky). Change amplification, cognitive load, dependency health, abstraction quality, documentation accuracy, and technical debt indicators.

The key metric is not "how good is this code?" but "will this codebase be pleasant or painful to work in 12 months from now?"

### 4. Testing Strategy

90% code coverage that only tests happy paths is worse than 60% that tests boundaries, error cases, and anti-patterns. This dimension evaluates whether the testing strategy protects against the things that would actually hurt.

Special attention to **anti-pattern tests** — tests that verify the system does NOT do things it shouldn't. These are the most valuable tests in any codebase and they are almost always missing. Negative authorization tests, input rejection tests, state corruption guards, regression guards, architecture enforcement tests, and performance bounds.

### 5. Conway's Law Alignment

The most subtle and often most consequential dimension. Do module boundaries align with ownership boundaries? Are there shared modules that nobody clearly owns? Does the coupling between modules force communication between people who don't naturally coordinate?

Architecture is ultimately a human problem. A perfectly designed system that doesn't match how the team works will be slowly reshaped by the team's communication structure until it does — usually in the worst possible way.

## Continuous Governance: Beyond Point-in-Time

Most architecture governance is episodic — someone runs an audit, finds problems, files tickets, and goes back to sleep. Blueprint makes governance continuous:

**Fitness functions** (`/blueprint:fitness`) translate ADR invariants into executable tests that run in CI. Every build verifies that the architecture hasn't been violated. This is the difference between "we decided to do X" and "the build fails if we don't do X." Inspired by [Neal Ford's Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/).

**Drift detection** (`/blueprint:drift`) analyzes git history *trajectory* — not "is the code correct now?" but "is the code moving toward or away from the architecture over time?" Individual commits may each be fine, but the aggregate direction matters. A module that has gained 8 cross-boundary imports in 3 months is eroding, even if no single import was wrong.

**Decision debt** (`/blueprint:debt`) tracks deferred ADRs the way a lender tracks loans. Each deferred decision has a trigger condition, a severity, and dependencies. The debt score (severity x age x dependency count) surfaces which deferrals are becoming dangerous. Decision debt compounds faster than technical debt — a deferred technology choice becomes a deferred architecture choice becomes a deferred rewrite.

**Pre-commit guard** (`/blueprint:guard`) catches violations at the point of creation. Not a full audit — a fast, targeted check on just the staged files. Under 10 seconds. The goal is to make architectural violations as inconvenient as syntax errors.

## The Retrospective: Closing the Loop

> "Those who cannot remember the past are condemned to repeat it." — George Santayana

`/blueprint:retro` is blueprint's mechanism for institutional memory. After any fix — whether via `/gsd:quick`, `/rapid:quick`, `/rapid:bug-fix`, or a manual patch — it performs two steps:

**Step 1: Root Cause Classification.** Not "what broke" but "what structural property made this possible?" Using the taxonomy from `config/taxonomy.toml`: missing validation, implicit contracts, state management failures, error swallowing, missing or wrong abstractions, configuration drift, dependency coupling, missing tests, or architectural gaps.

**Step 2: Pattern Verification.** For every architectural improvement proposed, the agent searches for 3+ authoritative external sources confirming the pattern is established practice. This step exists because AI systems confidently recommend patterns that don't exist. An unverified recommendation is explicitly flagged as unverified — never passed off as established practice.

The output is a verdict: **SYSTEMIC** (the fix addressed the root cause, move on), **BAND-AID** (the symptom was treated but the root cause remains), or **PARTIAL** (partially addressed with remaining exposure). Band-aid verdicts include a proposed systemic improvement with effort estimate and a ready-to-run `/blueprint:new` command to formalize it as an ADR.

## Installation

```bash
# From source
cd ~/pragnition/blueprint
npm install
npm link
claude-blueprint install --global

# Verify
claude-blueprint verify
```

The installer deploys 21 commands, 12 agents, and 4 config files to `~/.claude/commands/blueprint/`, and inserts a managed section into `CLAUDE.md` with the command reference.

## Architecture of Blueprint Itself

```
blueprint/
├── commands/              21 skill files
│   ├── blueprint.md       Thin router
│   ├── init.md            Bootstrap from existing codebase
│   ├── help.md            Contextual command reference
│   ├── list.md            Status table with suggestions
│   ├── new.md             ADR creation + research
│   ├── review.md          Devil's advocate flow
│   ├── transition.md      Lifecycle state changes
│   ├── search.md          Topic-based ADR search
│   ├── impact.md          Cross-ADR conflict detection
│   ├── audit.md           Compliance verification
│   ├── retro.md           Post-fix retrospective
│   ├── evaluate.md        5-agent evaluation team
│   ├── rearchitect.md     Supersession workflow
│   ├── architect.md       ARCHITECTURE.md generation
│   ├── eli5.md            Plain English explanations
│   ├── fitness.md         CI-runnable architecture tests
│   ├── drift.md           Temporal erosion detection
│   ├── debt.md            Decision debt tracker
│   ├── guard.md           Pre-commit invariant check
│   ├── digest.md          Stakeholder summary
│   └── timeline.md        Evolution narrative
├── agents/                12 agent definitions
│   ├── persona.md         Shared senior engineer personality
│   ├── adr-researcher.md
│   ├── adr-devils-advocate.md
│   ├── adr-impact-analyzer.md
│   ├── adr-compliance-auditor.md
│   ├── adr-consistency-auditor.md
│   ├── adr-bug-surface-mapper.md
│   ├── adr-maintainability-assessor.md
│   ├── adr-testing-strategy-evaluator.md
│   ├── adr-conways-law-analyzer.md
│   ├── adr-retrospective.md
│   └── adr-architect-cartographer.md
├── config/                Domain-specific language (TOML)
│   ├── lifecycle.toml     Finite state machine
│   ├── taxonomy.toml      Classification system
│   ├── state.toml         Session memory
│   └── relationships.toml ADR dependency graph
├── docs/
│   ├── ARCHITECTURE.md    Bird's-eye codemap (matklad style)
│   └── adr/               31 self-referential ADRs
├── bin/cli.js             CLI entry point
├── src/                   Install / verify / CLAUDE.md management
└── .claude-plugin/        Plugin registration metadata
```

Blueprint practices what it preaches: each skill is focused, the router is thin, domain knowledge is in config (not code), and agents have single responsibilities. 21 commands, 12 agents, 4 config files, 31 ADRs.

## Intellectual Heritage

Blueprint draws on several traditions:

- **[Architecture Decision Records](https://adr.github.io/)** (Nygard, 2011) — the original lightweight documentation format for architectural decisions
- **[Hegelian Dialectic](https://en.wikipedia.org/wiki/Dialectic#Hegelian_dialectic)** — thesis (proposed ADR) → antithesis (devil's advocate challenge) → synthesis (accepted decision that has survived scrutiny)
- **[Domain-Specific Languages](https://en.wikipedia.org/wiki/Domain-specific_language)** (Fowler, 2010) — encoding domain concepts as structured data rather than general-purpose code
- **[Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law)** (Conway, 1967) — the recognition that system structure mirrors organizational structure, whether you design for it or not
- **[Lehman's Laws of Software Evolution](https://en.wikipedia.org/wiki/Lehman%27s_laws_of_software_evolution)** — the observation that software complexity grows unless actively countered
- **[Technical Debt](https://wiki.c2.com/?TechnicalDebt)** (Cunningham, 1992) — the gap between current code and current understanding, not merely "sloppy code"
- **[Finite State Machines](https://en.wikipedia.org/wiki/Finite-state_machine)** — the formal model underlying lifecycle management
- **[Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/)** (Ford & Parsons, 2017) — architecture fitness functions as automated, CI-runnable invariant checks
- **[The Cathedral and the Bazaar](http://www.catb.org/~esr/writings/cathedral-bazaar/)** (Raymond, 1997) — "given enough eyeballs, all bugs are shallow" — blueprint's evaluation team as a systematic implementation of this principle
- **[ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)** (matklad, 2021) — bird's-eye codemap as a high-leverage onboarding document

## License

MIT

---

*"Architecture is the thoughtful making of space."* — Louis Kahn

*Blueprint is the thoughtful making of decisions.*
