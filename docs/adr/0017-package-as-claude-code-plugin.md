# ADR-0017: Package as Claude Code plugin following feynman conventions

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0017                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Blueprint started as a collection of files in `~/.claude/commands/`. The initial development workflow was simple: edit the files in place, test them immediately. But this approach has no versioning, no distribution mechanism, and no way for someone else to install blueprint without manually copying files into the right directories.

As the plugin matured (12 sub-skills, 10 agent definitions, 4 config files, a state tracker) the "copy these files into your home directory" instruction became untenable. Users would miss files, place them in the wrong directory, or fail to update when new versions shipped. There was no way to track which version was installed, no upgrade path, and no distinction between global and project-scoped installation.

Distribution needed to be solved before the plugin could be used by anyone other than the original developer.

## Options Considered

### Option 1: Keep as raw files with manual copy instructions

No packaging overhead. Users clone the repo and copy files to `~/.claude/commands/`. This is how development started and it works for a single developer. But it does not scale to multiple users, provides no version tracking, no upgrade mechanism, and no way to handle the distinction between global commands (available everywhere) and project-scoped commands (available only in specific repos).

### Option 2: Package as Claude Code plugin with npm and CLI installer

Follow the feynman plugin pattern: `.claude-plugin/plugin.json` manifest, npm package for distribution and versioning, CLI installer (`claude-blueprint install`) that deploys commands, agents, and config to the correct scope. The installer handles the file placement that users would otherwise do manually. npm provides versioning, dependency management, and a familiar install workflow.

### Option 3: Distribute as a zip/tarball

Package everything into a versioned archive. Users download and extract. Simpler than npm packaging but provides no dependency management, no `npm update` workflow, and requires users to know where to extract the files. A halfway measure that solves versioning but not installation.

## Decision

**We package blueprint as a Claude Code plugin with npm packaging and a CLI installer**, because distribution without installation automation is distribution without adoption, and because the feynman plugin pattern already established conventions for Claude Code plugins that users and tooling expect.

## Rationale

- The feynman plugin pattern is a proven convention in the Claude Code ecosystem. Following it means blueprint works the way users expect plugins to work: `npm install`, run the installer, done.
- The CLI installer (`claude-blueprint install`) handles scope correctly. Global installation deploys to `~/.claude/commands/` and `~/.claude/agents/`. Project installation deploys to `.claude/commands/` and `.claude/agents/` within the repo. Users do not need to understand the directory structure.
- npm versioning provides a clear upgrade path. `npm update @pragnition/blueprint` pulls the latest version, and the installer can migrate config and state files across versions.
- The `.claude-plugin/plugin.json` manifest declares capabilities, entry points, and metadata in a machine-readable format that Claude Code can discover and present to users.
- Manual copy instructions do not scale. Every file added to blueprint is another line in the installation guide that someone will skip or misread.

## Consequences

### Positive

- Users install with a single command and get all 12 sub-skills, 10 agents, and 4 config files in the right places.
- Version tracking enables reliable upgrades and rollbacks.
- Scope distinction (global vs. project) is handled automatically by the installer.
- Following feynman conventions means blueprint benefits from any ecosystem tooling built for that pattern.

### Negative

- npm packaging adds build and publish overhead to the release process.
- Users must have Node.js and npm installed, which is a dependency blueprint did not previously require (though Claude Code itself requires Node.js, so this is rarely an additional burden).
- The installer must handle edge cases: existing files, partial installations, version conflicts between global and project scopes.

### Risks

- Feynman conventions may evolve. If the plugin pattern changes significantly, blueprint's packaging will need to adapt. Mitigation: the conventions are simple enough (manifest + file placement) that migration would be straightforward.
- npm registry dependency: if the registry is down, new installations fail. Mitigation: the git repo remains available as a fallback for manual installation.

## References

- ADR-0002: Decompose into focused sub-skills over monolithic SKILL.md
- Feynman plugin conventions (`.claude-plugin/plugin.json` manifest format)
- npm package distribution documentation
