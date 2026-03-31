# Research Plan: Is Blueprint's Plugin Architecture Correct?

## Context
Blueprint v2.0.0 is a Claude Code plugin with 39 markdown skills, 21 agent definitions, 8 TOML config files, and a thin router pattern. This research evaluates whether this architecture aligns with Anthropic's official guidance, peer plugin patterns, and industry best practices for AI plugin design.

## Questions
1. **What does Anthropic officially recommend for Claude Code plugin structure?** (.claude-plugin spec, plugin.json schema, skill format, agent definitions)
2. **How do other successful Claude Code plugins structure their code?** (GSD, RAPID, superpowers, feynman — same marketplace)
3. **Is the markdown+YAML frontmatter skill format the right choice?** vs. other approaches
4. **Are XML-tagged agent sections (<persona>, <role>, <execution_flow>, <output_format>, <quality_gate>) best practice?** What does prompt engineering research say?
5. **Is TOML config optimal for LLM-consumed configuration?** vs. JSON, YAML, markdown tables
6. **Is the thin router pattern correct?** vs. flat skill dispatch, hierarchical routing
7. **Are there anti-patterns in Blueprint's design that conflict with official guidance?**

## Strategy
- **Researcher 1 — Official Anthropic Sources:** Claude Code docs, plugin specification, CLAUDE.md format, skill system design, agent SDK documentation. Primary sources only.
- **Researcher 2 — Peer Plugin Analysis:** Analyze the actual file structure and patterns of GSD, RAPID, superpowers, feynman plugins on this machine. Code-level comparison.
- **Researcher 3 — Prompt Engineering & AI Plugin Patterns:** Academic and practitioner sources on structured prompting (XML tags, persona injection, quality gates), LLM config formats, AI extension architecture patterns.

## Acceptance Criteria
- [ ] Anthropic's official plugin spec documented with specific requirements
- [ ] At least 3 peer plugins structurally analyzed
- [ ] Prompt engineering best practices sourced from 2+ independent references
- [ ] TOML vs alternatives evaluated with LLM-specific evidence
- [ ] Blueprint's architecture scored against each finding
- [ ] Anti-patterns identified with specific evidence

## Task Ledger
| ID | Owner | Task | Status | Output |
|---|---|---|---|---|
| T1 | researcher-1 | Official Anthropic plugin docs and guidance | todo | outputs/plugin-audit-anthropic.md |
| T2 | researcher-2 | Peer plugin structural analysis (GSD, RAPID, superpowers, feynman) | todo | outputs/plugin-audit-peers.md |
| T3 | researcher-3 | Prompt engineering + AI plugin architecture patterns | todo | outputs/plugin-audit-patterns.md |
| T4 | lead | Synthesize into audit report | todo | outputs/plugin-architecture-audit.md |

## Verification Log
| Item | Method | Status | Evidence |
|---|---|---|---|
| Anthropic plugin.json schema | direct fetch of docs | pending | — |
| Claude Code skill format spec | direct fetch | pending | — |
| Peer plugin file counts and structure | local file scan | pending | — |
| XML tag prompt engineering evidence | web search | pending | — |
| TOML token efficiency claims | comparison test | pending | — |

## Decision Log
(Updated as the workflow progresses)
