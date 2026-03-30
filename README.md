# blueprint

Architecture Decision Records with teeth.

A Claude Code plugin that enforces a formal ADR lifecycle with research, devil's advocate review, architecture evaluation, compliance auditing, and post-fix retrospectives. Every agent has the personality of a cranky senior engineer who has been paged at 3 AM one too many times.

## Install

```bash
# From npm (when published)
npm install -g claude-blueprint
claude-blueprint install --global

# From source
cd ~/pragnition/blueprint
npm install
npm link
claude-blueprint install --global
```

## Commands

### Lifecycle

| Command | What it does |
|---------|-------------|
| `/blueprint:help` | Full reference + contextual suggestions |
| `/blueprint:list` | ADR table + next actions |
| `/blueprint:new "topic"` | Create ADR (add `--research` for evidence) |
| `/blueprint:review N` | Devil's advocate challenge before acceptance |
| `/blueprint:transition accept N` | Accept / reject / defer / deprecate |
| `/blueprint:search "term"` | Find decisions by topic |

### Analysis

| Command | What it does |
|---------|-------------|
| `/blueprint:impact N` | Check for cross-ADR conflicts |
| `/blueprint:audit` | Verify codebase follows accepted decisions |
| `/blueprint:retro` | Post-fix retrospective (band-aid or systemic?) |
| `/blueprint:rearchitect "topic"` | Research + supersede a decision |

### Architecture Evaluation Team

| Command | What it does |
|---------|-------------|
| `/blueprint:evaluate` | Run all 5 evaluators in parallel |
| `/blueprint:evaluate consistency` | Pattern adherence, naming, layering |
| `/blueprint:evaluate bugs` | Complexity hotspots, coupling, boundaries |
| `/blueprint:evaluate maintainability` | Dependency health, abstractions, tech debt |
| `/blueprint:evaluate testing` | Test pyramid, anti-pattern tests, coverage |
| `/blueprint:evaluate conways` | Team-architecture alignment, ownership |

## Architecture

```
blueprint/
├── commands/           12 skill files (SKILL.md per sub-command)
├── agents/             11 agent definitions (cranky senior engineer persona)
│   ├── persona.md      Shared personality layer
│   ├── adr-researcher.md
│   ├── adr-devils-advocate.md
│   ├── adr-impact-analyzer.md
│   ├── adr-compliance-auditor.md
│   ├── adr-consistency-auditor.md
│   ├── adr-bug-surface-mapper.md
│   ├── adr-maintainability-assessor.md
│   ├── adr-testing-strategy-evaluator.md
│   ├── adr-conways-law-analyzer.md
│   └── adr-retrospective.md
├── config/             DSL config layer (TOML)
│   ├── lifecycle.toml  State machine for ADR statuses
│   ├── taxonomy.toml   Root causes, eval dimensions, categories
│   ├── state.toml      Session memory across invocations
│   └── relationships.toml  ADR dependency graph
├── bin/cli.js          CLI entry point
├── src/                Install/verify/CLAUDE.md management
└── .claude-plugin/     Plugin registration metadata
```

## Persona

Every agent in blueprint speaks with the voice of a senior engineer who:
- Says what they mean (no "consider using const" — it's "this should be const")
- Treats best practices as non-negotiable
- Is petty about the right things (naming, consistency, error handling)
- Backs opinions with evidence, not vibes
- Credits good work briefly, then moves on to what isn't

## License

MIT
