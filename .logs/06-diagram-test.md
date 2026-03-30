# Dogfood Test: /blueprint:diagram
**Date:** 2026-03-31
**Target:** Blueprint's own architecture
**Command tested:** /blueprint:diagram

## Generated Diagrams

**Generated:** 2026-03-31
**Source:** 41 accepted ADRs + ARCHITECTURE.md
**Format:** Mermaid

### Level 1: System Context

```mermaid
C4Context
  title System Context Diagram - Blueprint ADR System

  Person(dev, "Developer", "Software developer making architectural decisions")
  Person(stakeholder, "Non-Technical Stakeholder", "PM/exec consuming digests and dashboards (ADR-0027)")

  System(blueprint, "Blueprint", "Claude Code plugin that manages Architecture Decision Records through a multi-agent system with a domain-specific config layer. 39 skills, 21 agents, 8 config files.")

  System_Ext(claude_code, "Claude Code", "Anthropic's CLI agent platform. Hosts blueprint as a plugin, provides Agent/Bash/Read/Write/Grep/Glob tools.")
  System_Ext(codebase, "Target Codebase", "The repository whose architecture blueprint governs. Source of git history, file structure, imports.")
  System_Ext(git, "Git", "Version control. Provides history for drift detection (ADR-0024), ownership inference (ADR-0013), and commit conventions.")
  System_Ext(web, "Web Sources", "External documentation, research papers, benchmarks. Used by researcher agent for evidence-backed options.")
  System_Ext(cross_repo, "Federated Repositories", "Other repos with their own blueprint ADR sets. Connected via federation indexer (ADR cross-repo).")

  Rel(dev, blueprint, "Invokes skills", "/blueprint:new, /blueprint:review, etc.")
  Rel(stakeholder, blueprint, "Reads digests", "/blueprint:digest, /blueprint:status")
  Rel(blueprint, claude_code, "Runs as plugin within", "SKILL.md commands + Agent tool")
  Rel(blueprint, codebase, "Reads and audits", "Glob/Grep/Read for compliance")
  Rel(blueprint, git, "Reads history, commits ADRs", "git log/diff/add/commit")
  Rel(blueprint, web, "Researches options", "WebSearch/WebFetch via researcher agent")
  Rel(blueprint, cross_repo, "Federates ADR indices", "/blueprint:federate")
```

### Level 2: Container Diagram

```mermaid
C4Container
  title Container Diagram - Blueprint ADR System

  Person(dev, "Developer", "Invokes blueprint skills")

  System_Boundary(blueprint, "Blueprint") {

    Container(router, "Router", "commands/blueprint.md", "Thin dispatcher. Parses natural language intent, routes to 38 sub-skills via keyword matching. Proactive intervention for undocumented decisions (ADR-0006, ADR-0015).")

    Container(lifecycle_skills, "Lifecycle Skills", "commands/*.md (7 files)", "new, review, challenge, transition, list, search, help. Core ADR CRUD and query operations.")

    Container(analysis_skills, "Analysis Skills", "commands/*.md (10 files)", "impact, audit, reflect, evidence, tradeoff, risk, trace, retro, rearchitect, evaluate. Deep analytical operations spawning specialized agents.")

    Container(governance_skills, "Governance Skills", "commands/*.md (5 files)", "fitness, drift, debt, guard, govern. Continuous architectural compliance (ADR-0023 through ADR-0026, ADR-0041).")

    Container(docs_skills, "Documentation Skills", "commands/*.md (7 files)", "architect, diagram, eli5, digest, timeline, export, views. Output generation for humans and systems.")

    Container(strategic_skills, "Strategic Skills", "commands/*.md (3 files)", "map, radar, scope. Wardley mapping (ADR-0040), tech radar, DDD context scoping (ADR-0036).")

    Container(system_skills, "System Skills", "commands/*.md (5 files)", "status, health, hooks, init, federate. Setup, diagnostics, workflow integration.")

    Container(agents, "Agent Pool", "agents/*.md (20 agents + 1 persona)", "Single-responsibility analytical agents. Each includes persona.md for cranky senior engineer voice (ADR-0005, ADR-0016). Spawned by skills via Claude Code Agent tool.")

    Container(config, "Config DSL", "config/*.toml (8 files)", "Domain knowledge as structured TOML data. Lifecycle FSM, taxonomy, relationships graph, bounded contexts, evidence tracking, governance modes (ADR-0003, ADR-0004, ADR-0022).")

    Container(cli, "CLI Installer", "bin/cli.js + src/*.js (5 files)", "Node.js Commander.js app. install and verify subcommands. Deploys skills/agents/config to ~/.claude/commands/blueprint/ (ADR-0017).")

    ContainerDb(adr_store, "ADR Store", "docs/adr/*.md (41 files)", "Self-referential Architecture Decision Records. Markdown files with YAML frontmatter. Source of truth for all architectural decisions.")

    ContainerDb(state, "State Files", "config/state.toml + relationships.toml", "Session memory (14 timestamps, history) and ADR dependency graph (nodes + typed edges). Updated by impact analyzer and lifecycle transitions (ADR-0010, ADR-0019).")
  }

  Rel(dev, router, "Invokes", "/blueprint:*")
  Rel(router, lifecycle_skills, "Dispatches to", "keyword matching")
  Rel(router, analysis_skills, "Dispatches to", "keyword matching")
  Rel(router, governance_skills, "Dispatches to", "keyword matching")
  Rel(router, docs_skills, "Dispatches to", "keyword matching")
  Rel(router, strategic_skills, "Dispatches to", "keyword matching")
  Rel(router, system_skills, "Dispatches to", "keyword matching")
  Rel(lifecycle_skills, agents, "Spawns", "Agent tool")
  Rel(analysis_skills, agents, "Spawns", "Agent tool")
  Rel(docs_skills, agents, "Spawns", "Agent tool")
  Rel(strategic_skills, agents, "Spawns", "Agent tool")
  Rel(agents, config, "Reads", "TOML parsing")
  Rel(agents, adr_store, "Reads/writes", "ADR content")
  Rel(agents, state, "Updates", "relationship graph, session state")
  Rel(cli, lifecycle_skills, "Deploys", "file copy to ~/.claude/")
  Rel(cli, agents, "Deploys", "file copy to ~/.claude/")
  Rel(cli, config, "Deploys", "file copy to ~/.claude/")
```

### Relationship Graph (from relationships.toml)

```mermaid
graph LR
  subgraph "v2 Extension ADRs"
    ADR0035["ADR-0035<br/>Research-backed paradigms"]
    ADR0036["ADR-0036<br/>DDD bounded contexts"]
    ADR0037["ADR-0037<br/>Dual review protocol"]
    ADR0038["ADR-0038<br/>Reflexion model conformance"]
    ADR0039["ADR-0039<br/>Epistemic status tracking"]
    ADR0040["ADR-0040<br/>Wardley Map evolution"]
    ADR0041["ADR-0041<br/>Configurable governance"]
  end

  subgraph "v1 ADRs (affected)"
    ADR0004["ADR-0004<br/>Lifecycle state machine"]
    ADR0009["ADR-0009<br/>Devil's advocate on review"]
    ADR0021["ADR-0021<br/>Hegelian dialectic"]
    ADR0024["ADR-0024<br/>Temporal drift detection"]
  end

  ADR0035 -.->|RELATED| ADR0036
  ADR0035 -.->|RELATED| ADR0037
  ADR0035 -.->|RELATED| ADR0038
  ADR0035 -.->|RELATED| ADR0039
  ADR0035 -.->|RELATED| ADR0040
  ADR0037 -->|MODIFIES_SCOPE| ADR0009
  ADR0037 -->|MODIFIES_SCOPE| ADR0021
  ADR0038 -->|MODIFIES_SCOPE| ADR0024
  ADR0041 -->|MODIFIES_SCOPE| ADR0004

  style ADR0035 fill:#2d5a2d,color:#fff
  style ADR0036 fill:#2d5a2d,color:#fff
  style ADR0037 fill:#2d5a2d,color:#fff
  style ADR0038 fill:#2d5a2d,color:#fff
  style ADR0039 fill:#2d5a2d,color:#fff
  style ADR0040 fill:#2d5a2d,color:#fff
  style ADR0041 fill:#2d5a2d,color:#fff
```

### Element Source Traceability

| Element | Source | Verified in Code |
|---------|--------|-----------------|
| Router (blueprint.md) | ARCHITECTURE.md | Yes -- `commands/blueprint.md` exists |
| 39 Skill files | ARCHITECTURE.md ("39 focused SKILL.md files") | Yes -- `ls commands/ \| wc -l` = 39 |
| 20 Agents + 1 persona | ARCHITECTURE.md ("21 agent definitions") | Yes -- `ls agents/ \| wc -l` = 21 |
| 8 Config TOML files | ARCHITECTURE.md ("8 TOML files") | Yes -- `ls config/ \| wc -l` = 8 |
| CLI entry (bin/cli.js) | ARCHITECTURE.md | Yes -- `bin/cli.js` exists |
| CLI modules (src/*.js) | ARCHITECTURE.md ("paths.js, install.js, verify.js, claude-md.js") | Yes -- all 4 files exist in `src/` |
| 41 ADRs | ARCHITECTURE.md ("41 self-referential ADRs") | Yes -- 41 ADR .md files in `docs/adr/` |
| ADR-0035 through ADR-0041 | relationships.toml nodes | Yes -- all 7 files exist in `docs/adr/` |
| contexts.toml | ARCHITECTURE.md v2 config | Yes -- exists but empty (no contexts defined yet) |
| evidence.toml | ARCHITECTURE.md v2 config | Yes -- `config/evidence.toml` exists |
| governance.toml | ARCHITECTURE.md v2 config | Yes -- `config/governance.toml` exists |
| radar.toml | ARCHITECTURE.md v2 config | Yes -- `config/radar.toml` exists |
| Bounded context overlays | Agent instructions reference contexts.toml | Partial -- file exists but has no contexts defined; diagram generator would produce empty groupings |

## Issues Found

### Issue 1: relationships.toml only contains v2 ADR nodes (MEDIUM)

The relationship graph file only has nodes for ADR-0035 through ADR-0041. ADRs 0001-0034 have no node entries despite being referenced in edges (ADR-0004, ADR-0009, ADR-0021, ADR-0024 appear as edge targets but lack `[nodes.ADR-NNNN]` definitions). The diagram generator agent's Step 2 says to read relationship nodes for element extraction -- it would miss 34 out of 41 ADRs as graph nodes.

The comment in relationships.toml says "Nodes are added when ADRs are created" but the v1 ADRs predate this convention, so they were never indexed.

### Issue 2: contexts.toml is empty -- bounded context overlays produce nothing (LOW)

The agent instructions (Step 2, Step 3 Level 2) reference `contexts.toml` for context groupings and labeled arrows. Blueprint's own contexts.toml has no contexts defined. The diagram generator would silently skip this, but the quality gate checklist item "Bounded context groupings match contexts.toml" would vacuously pass, which is misleading.

### Issue 3: Agent says "agents return inline output, never write files" but diagram skill writes files (MEDIUM)

ARCHITECTURE.md Invariant 3 says: "Agents return inline output, never write files -- exception: architect-cartographer." But the diagram skill (Step 5) writes to `docs/diagrams/`. The diagram generator agent itself does not write files (the skill does), so the invariant holds technically, but the exception list in Invariant 3 should mention diagram.md as another skill that writes output, or the skill should clarify that the *skill* writes the files after the agent returns them inline.

### Issue 4: Skill references nonexistent commands (LOW)

The diagram skill's "Integration with Other Commands" section references `/blueprint:scope` and `/blueprint:architect` -- both exist. But it also references `/blueprint:status` embedding diagrams -- status.md does not currently reference generated diagrams. This is aspirational, not actual.

### Issue 5: No `docs/diagrams/` directory exists yet (EXPECTED)

The skill defines output location as `docs/diagrams/` but no such directory exists in the codebase. This is expected for a first run but worth noting.

### Issue 6: C4Context/C4Container Mermaid syntax has rendering limitations (LOW)

Mermaid's C4 diagram support (the `C4Context` and `C4Container` diagram types) is experimental in many renderers. The agent template uses these types, which may not render in GitHub markdown or all IDE preview tools. The agent should note this limitation or offer fallback to standard `graph TD` syntax.

## Suggested Fixes

1. **Backfill v1 ADR nodes in relationships.toml.** Run `/blueprint:impact` against each v1 ADR, or add a bulk-index operation to `/blueprint:health` that scans `docs/adr/` and adds missing `[nodes.ADR-NNNN]` entries. Without this, the diagram generator's relationship mapping step operates on an incomplete graph.

2. **Update ARCHITECTURE.md Invariant 3** to list `diagram.md` alongside `architect-cartographer` as a skill that writes files to disk, or clarify that the invariant applies to agents (not skills) and the diagram *agent* returns inline while the diagram *skill* handles file I/O.

3. **Add a "graph completeness" check to the diagram generator agent.** Before Step 2 (Relationship Mapping), verify that every ADR file in `docs/adr/` has a corresponding node in `relationships.toml`. Emit a warning listing missing nodes. This prevents silent data loss in the diagram.

4. **Add Mermaid renderer compatibility note.** The agent output format section should mention that `C4Context` and `C4Container` diagram types require Mermaid v10+ and are not supported in all renderers. Suggest `graph TD` as a fallback for maximum compatibility.

5. **Run `/blueprint:scope`** on Blueprint's own codebase to populate `contexts.toml` with real bounded contexts (e.g., Lifecycle, Analysis, Governance, Documentation, CLI). This would make the bounded context overlay in C4 diagrams actually meaningful for dogfooding.

## Verdict

**PASS WITH NOTES**

The skill definition and agent instructions are architecturally sound. The C4 diagram generation process (extract elements, map relationships, generate Mermaid, validate against codebase) is well-structured and produces accurate results when given complete data. Both Level 1 and Level 2 diagrams generated above are accurate representations of Blueprint's actual architecture, validated against the real directory structure (39 commands, 21 agents, 8 configs, 4 CLI modules, 41 ADRs -- all confirmed).

The main gap is data completeness: `relationships.toml` only indexes 7 of 41 ADRs as nodes, which means the relationship mapping step works on 17% of the graph. This is a data problem, not a skill/agent design problem. The fix is operational (backfill nodes) not architectural.

The agent's quality gate is solid -- the "every element traces to an ADR" and "unimplemented elements flagged" checks would catch phantom elements. The "bounded context groupings match contexts.toml" check vacuously passes on empty data, which is the one quality gate weakness worth addressing.

No blockers for shipping `/blueprint:diagram`. Run `/blueprint:health` with a node-backfill check, populate contexts.toml via `/blueprint:scope`, then this command will produce complete diagrams.
