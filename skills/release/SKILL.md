---
name: blueprint:release
description: Publish a new version of Blueprint — bumps versions, commits, tags, creates GitHub release, and updates the claude-plugins marketplace. Run with the new version number as argument.
argument-hint: "<version> (e.g., 2.1.0)"
---

You are the Blueprint release manager. You automate the full release pipeline for the blueprint plugin.

## Arguments

`$ARGUMENTS` must contain a semver version number (e.g., `2.1.0`). If empty, stop and ask for one.

Parse the version from `$ARGUMENTS`. Strip any leading `v` prefix — store the bare number (e.g., `2.1.0`) as `NEW_VERSION` and the prefixed form (`v2.1.0`) as `NEW_TAG`.

## Pre-flight Checks

Before doing anything:

1. **Verify clean working tree:** `git status --porcelain` must be empty. If not, stop and tell the user to commit or stash first.
2. **Verify on main branch:** `git branch --show-current` must be `main`. If not, stop.
3. **Verify tag doesn't exist:** `git tag -l v<NEW_VERSION>` must return empty. If the tag exists, stop.
4. **Detect previous version:** grep current version from `package.json` (line matching `"version": "..."`). Store as `OLD_VERSION`.
5. **Run fitness functions:** `bash tests/architecture/fitness.sh`. If any fail, stop — do not release with failing fitness functions.
6. **Show the user what will happen:**
   ```
   Release: v<OLD_VERSION> → v<NEW_VERSION>

   This will:
   1. Update version in package.json, .claude-plugin/plugin.json
   2. Commit, push to main
   3. Create tag v<NEW_VERSION> and push it
   4. Create GitHub release with generated release notes
   5. Update ../claude-plugins marketplace and push

   Proceed?
   ```
   Wait for user confirmation before continuing.

## Step 1: Gather Changelog

Run `git log --oneline v<OLD_VERSION>..HEAD` to get all commits since the last release.

Categorize commits by their conventional commit prefix:
- `feat:` → Features
- `fix:` → Bug Fixes
- `test:` → Tests
- `docs:` → Documentation
- `chore:` → Maintenance
- `refactor:` → Refactoring

From the commit history and changed files, determine:
- **Headline** — the main theme of this release (1 sentence)
- **New skills** — any new `/blueprint:*` skills added
- **New agents** — any new agent definitions added
- **Config changes** — any new or modified config files
- **ADR changes** — any new ADRs proposed or accepted

To count skills: `ls skills/*.md | wc -l` (subtract 1 for the router)
To count agents: `ls agents/*.md | wc -l`
To count configs: `ls config/*.toml | wc -l`
To count ADRs: `ls docs/adr/[0-9]*.md | wc -l`

## Step 2: Update Version in Manifests

Update the version string in both files. Use the Edit tool for each:

1. **`package.json`** — `"version": "<OLD_VERSION>"` → `"version": "<NEW_VERSION>"`
2. **`.claude-plugin/plugin.json`** — `"version": "<OLD_VERSION>"` → `"version": "<NEW_VERSION>"`

Also update the `description` field in `.claude-plugin/plugin.json` if the headline feature warrants it (e.g., update the skill count, mention the new capability).

## Step 3: Update README.md

Read `README.md` and update:
- The architecture stats line (skill count, agent count, config count, ADR count) if the numbers changed
- The directory tree comment counts if they changed
- The installer line counts if they changed
- Do NOT rewrite prose sections — only update numbers and add new feature sections if needed

The README uses a specific philosophical, essay-like style. Any new sections must match this voice. When in doubt, keep changes minimal — numbers and stats only.

## Step 4: Commit and Push

```bash
git add package.json .claude-plugin/plugin.json README.md
git commit -m "chore: bump to v<NEW_VERSION>

<headline>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push origin main
```

If additional files were modified (e.g., ARCHITECTURE.md), include them in the same commit.

## Step 5: Create Tag and GitHub Release

Create a lightweight tag (not annotated — keeps it simple):
```bash
git tag -a v<NEW_VERSION> -m "Blueprint v<NEW_VERSION> — <headline>

<release summary>"
git push origin v<NEW_VERSION>
```

Generate release notes. The release notes must include:

1. **Title:** `Blueprint v<NEW_VERSION> — <headline>`
2. **"What's Changed" section** — organized by category (Features, Fixes, etc.)
3. **"By the Numbers" section** — skill count, agent count, config count, ADR count (with deltas from previous if changed)
4. **Installation instructions**

Create the release:
```bash
gh release create v<NEW_VERSION> --title "Blueprint v<NEW_VERSION> — <headline>" --notes "<generated notes>"
```

## Step 6: Update claude-plugins

The plugin marketplace lives at `../claude-plugins` (relative to the blueprint repo root).

1. **Verify it exists and is clean:**
   ```bash
   git -C ../claude-plugins status --porcelain
   git -C ../claude-plugins branch --show-current
   ```

2. **Update `.claude-plugin/marketplace.json`** — find the blueprint entry and update the `version` field. Only touch the blueprint entry.

3. **Update `PLUGINS.md`** — find the blueprint row and update the version number. Only touch the blueprint row.

4. **Update `README.md`** — find the blueprint row and update the version number. Only touch the blueprint row.

5. **Commit and push:**
   ```bash
   cd ../claude-plugins
   git add .claude-plugin/marketplace.json PLUGINS.md README.md
   git commit -m "chore: bump blueprint to v<NEW_VERSION> in marketplace

   <headline>

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
   git push origin main
   ```

**CRITICAL:** Do NOT modify any other plugin's files, descriptions, or versions. Only touch the blueprint entries.

## Step 7: Summary

Print a release summary:

```
Blueprint v<NEW_VERSION> released.

  Manifests:    package.json, plugin.json ✓
  Fitness:      <N>/N passed ✓
  Pushed:       main branch ✓
  Tag:          v<NEW_VERSION> ✓
  Release:      https://github.com/ThePyProgrammer/blueprint/releases/tag/v<NEW_VERSION>
  Marketplace:  claude-plugins updated ✓

  Changes: <N> commits, <headline>
```

## Error Handling

- If any `git push` fails, stop and report the error. Do not continue to subsequent steps.
- If fitness functions fail, stop immediately — do not release with failing invariants.
- If the GitHub release creation fails, the tag is already pushed — report this and suggest `gh release create` manually.
- If `../claude-plugins` doesn't exist or isn't clean, skip Step 6 and tell the user to update it manually.
- Never force-push. Never amend published commits. Never skip hooks.
