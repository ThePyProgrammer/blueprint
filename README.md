# blueprint

*Architecture Decision Records with teeth.*

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.1-ffd43b?style=flat-square&labelColor=0d1117" alt="Version" /> 
  <img src="https://img.shields.io/badge/license-MIT-4dabf7?style=flat-square&labelColor=0d1117" alt="License" /> 
  <img src="https://img.shields.io/badge/Claude_Code-plugin-4dabf7?style=flat-square&labelColor=0d1117" alt="Claude Code" /> 
  <img src="https://img.shields.io/badge/Node.js-18%2B-4dabf7?style=flat-square&labelColor=0d1117" alt="Node.js" />
</p>

A Claude Code plugin that treats architectural decisions as first-class engineering artifacts: researched before they're proposed, challenged before they're accepted, audited after they're implemented, and revisited when the world changes. Every agent speaks with the voice of a [senior engineer](docs/philosophy/the-cranky-senior-engineer.md) who has watched too many "temporary" decisions become permanent load-bearing walls. We shape our buildings; thereafter they shape us.

- **Hypotheses:** architectural decisions are bets, not declarations: falsifiable, evidence-based, challengeable, revisable
- **Challenge:** a devil's advocate challenges every decision across 5 dimensions before it becomes binding
- **Enforcement:** fitness functions in CI, compliance audits, drift detection, pre-commit guards
- **Memory:** every decision tracked, every root cause classified, every deferred choice monitored

> [!NOTE]
> Blueprint is in active development. Some features are rough around the edges. [Issues and feedback welcome.](https://github.com/pragnition/blueprint/issues)

## Install

> [!TIP]
> ```
> /plugin install blueprint@pragnition/claude-plugins
> ```
> alternatively,
> ```
> /plugin marketplace add pragnition/claude-plugins
> /plugin install blueprint@pragnition-plugins
> ```

## The Decision Lifecycle

Architectural decisions are hypotheses. Like any hypothesis, they should be tested before they become the foundation of a system. Blueprint encodes this as a [finite state machine](docs/architecture/decision-lifecycle.md):

```
Proposed → Review (devil's advocate) → Accepted → Audited → Enforced → Revisited
```

The interface is three verbs:

```
/blueprint:new --research "use PostgreSQL"   Research alternatives, then record
/blueprint:review 3                           Devil's advocate challenge
/blueprint:audit                              Does the code actually follow it?
```

Everything in between (lifecycle validation, impact analysis, evidence tracking, fitness functions, drift detection, decision debt) is infrastructure connecting those endpoints. You think about *what* to decide. Blueprint handles *how* to govern it.

### What a Session Looks Like

```
/blueprint:init                       Scan codebase, infer existing decisions
/blueprint:new "use Redis for caching" Record a new decision
/blueprint:review 4                    Devil's advocate finds 3 blind spots
/blueprint:transition accept 4         Accept after addressing the challenge
/blueprint:audit                       Verify the code follows it
```

For the full governance loop:

```
/blueprint:evaluate                    5-agent architecture health assessment
/blueprint:fitness --format github-actions  CI-runnable architecture tests
/blueprint:drift                       Is the architecture eroding over time?
```

## How It Works

**The decision lifecycle.** Every ADR transitions through a formal state machine encoded in `config/lifecycle.toml`: Proposed → Accepted/Rejected/Deferred → Deprecated/Superseded. Transitions are validated against data, not English. You cannot accept an untested hypothesis. You cannot supersede something that was never decided.

**The devil's advocate.** `/blueprint:review` spawns an adversarial agent that challenges across 5 dimensions: hidden assumptions, unconsidered alternatives, missing consequences, codebase fit, and team capability. The [Hegelian dialectic](https://en.wikipedia.org/wiki/Dialectic#Hegelian_dialectic) (thesis, antithesis, synthesis) is the mechanism by which decisions become robust.

**21 agents, one persona.** Each agent has a single responsibility: the researcher doesn't review, the reviewer doesn't audit, the auditor doesn't evaluate. All share the [cranky senior engineer persona](docs/philosophy/the-cranky-senior-engineer.md): direct, specific, evidence-backed, zero hedging. Research shows that [hedging feedback is systematically ignored](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs/); the persona ensures findings actually land.

**Config as domain language.** Domain knowledge lives in [TOML config files](docs/architecture/config-dsl.md), not agent prompts. Lifecycle rules, root cause categories, relationship graphs, evidence tracking. All parseable, testable, diffable. Data outlives code, and code outlives prompts.

**Continuous governance.** Fitness functions translate ADR invariants into CI tests. Drift detection analyzes git history trajectory. Decision debt tracks deferred choices with trigger monitoring. The pre-commit guard catches violations at creation. Governance is continuous, not episodic.

## Command Reference

### Lifecycle

| Command | What it does |
|---------|-------------|
| `/blueprint:init` | Bootstrap from codebase: scan context, infer decisions |
| `/blueprint:new "topic" [--research]` | Create ADR. `--research` for evidence-backed analysis first. |
| `/blueprint:advise "topic"` | Architecture Advice Process: structured consultation |
| `/blueprint:review N` | Devil's advocate challenge across 5 dimensions |
| `/blueprint:challenge N` | DCAR structured forces evaluation |
| `/blueprint:transition accept N` | Accept, reject, defer, or deprecate |
| `/blueprint:list` | Status table + contextual next actions |
| `/blueprint:search "term"` | Find decisions by topic |
| `/blueprint:grill-me [--mode mixed]` | Quiz and cross-examine your ADR understanding. Add `--report` for a scorecard. |
| `/blueprint:rearchitect "topic"` | Research → draft → supersede |

### Analysis

| Command | What it does |
|---------|-------------|
| `/blueprint:impact N` | Cross-ADR conflict and dependency detection |
| `/blueprint:audit` | Verify codebase follows accepted decisions |
| `/blueprint:reflect` | Reflexion model: formal conformance (Murphy et al., 1995) |
| `/blueprint:evidence` | Epistemic status audit: stale evidence, expired claims |
| `/blueprint:tradeoff` | ATAM quality attribute utility trees |
| `/blueprint:risk` | Architecture risk heat map |
| `/blueprint:retro` | Post-fix retrospective: band-aid or systemic? |
| `/blueprint:evaluate` | 5-agent architecture health assessment |

### Governance & Strategy

| Command | What it does |
|---------|-------------|
| `/blueprint:fitness [--format]` | CI-runnable architecture tests (shell, GitHub Actions, GitLab CI) |
| `/blueprint:drift` | Temporal erosion detection via git trajectory |
| `/blueprint:debt` | Decision debt tracker with trigger monitoring |
| `/blueprint:guard` | Pre-commit architecture invariant check |
| `/blueprint:scope` | DDD bounded context scoping |
| `/blueprint:map` | Wardley Map: strategic build-vs-buy analysis |
| `/blueprint:radar` | Technology Radar (Adopt/Trial/Assess/Hold) |
| `/blueprint:status` | Governance dashboard + interactive HTML knowledge graph |

See [the command reference](docs/commands/index.md) for all 43 commands.

## Credits

Blueprint would not exist without these ideas, traditions, and the people who articulated them:

**Traditions**

- [Architecture Decision Records](https://adr.github.io/) (Nygard, 2011): the original lightweight documentation format. Blueprint adds the lifecycle.
- [Hegelian Dialectic](https://en.wikipedia.org/wiki/Dialectic#Hegelian_dialectic): thesis → antithesis → synthesis. The devil's advocate is the antithesis that makes decisions robust.
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) (Evans, 2003): bounded contexts as the natural scoping mechanism for architectural decisions.
- [Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/) (Ford & Parsons, 2017): fitness functions as automated architectural invariants.
- [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) (1967): architecture mirrors communication structure whether you design for it or not. Git blame is the data; the org chart is a theory.

**Frameworks**

- [ATAM](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/) (SEI/CMU, 1998): quality attribute utility trees, sensitivity points, tradeoff identification.
- [Reflexion Models](https://dl.acm.org/doi/10.1145/222124.222136) (Murphy, Notkin, Sullivan, 1995): formal convergence/divergence/absence analysis for architecture conformance.
- [DCAR](https://ieeexplore.ieee.org/document/6449237/) (van Heesch et al., 2014): structured forces evaluation for decision-centric reviews.
- [Wardley Mapping](https://learnwardleymapping.com/) (Wardley): strategic context for build-vs-buy via evolution stage classification.
- [C4 Model](https://c4model.com/) (Brown, 2006-2011): progressive architecture visualization from system context to code.
- [Architecture Advice Process](https://martinfowler.com/articles/scaling-architecture-conversationally.html) (Harmel-Law, 2021): decentralized decision-making with structured consultation.

**Ideas**

- "We shape our buildings; thereafter they shape us." (Churchill): architecture constrains all future decisions.
- [Technical Debt](https://wiki.c2.com/?TechnicalDebt) (Cunningham, 1992): the gap between what code does and what the team now understands. Not sloppy code, but decisions that haven't evolved with understanding.
- [Lehman's Laws](https://en.wikipedia.org/wiki/Lehman%27s_laws_of_software_evolution) (1974-1996): software complexity grows unless actively fought. Deferred decisions are hidden complexity.
- [Code review effectiveness](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs/) (Microsoft): hedging feedback is systematically ignored; direct, specific feedback produces change. The cranky senior engineer persona is functional, not decorative.
- [ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) (matklad, 2021): bird's-eye codemap as a high-leverage onboarding document.
- [Epistemic Staleness in AI-Assisted Decisions](https://arxiv.org/html/2601.21116) (Gilda & Gilda, 2026): evidence expires. AI-generated research needs verification. `/blueprint:evidence` exists because of this paper.

## Links

- [License](LICENSE) (MIT)

---

*"The best time to plant a tree was twenty years ago. The second best time is before you write the code."*

*Blueprint governs the decisions. You make them.*
