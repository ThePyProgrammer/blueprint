import { access } from 'fs/promises';
import { join } from 'path';
import { getTargetPaths } from './paths.js';

const EXPECTED_COMMANDS = [
  'SKILL.md',
  'help/SKILL.md',
  'list/SKILL.md',
  'new/SKILL.md',
  'review/SKILL.md',
  'transition/SKILL.md',
  'search/SKILL.md',
  'impact/SKILL.md',
  'audit/SKILL.md',
  'retro/SKILL.md',
  'evaluate/SKILL.md',
  'rearchitect/SKILL.md',
];

const EXPECTED_AGENTS = [
  'persona.md',
  'adr-researcher.md',
  'adr-devils-advocate.md',
  'adr-impact-analyzer.md',
  'adr-compliance-auditor.md',
  'adr-consistency-auditor.md',
  'adr-bug-surface-mapper.md',
  'adr-maintainability-assessor.md',
  'adr-testing-strategy-evaluator.md',
  'adr-conways-law-analyzer.md',
  'adr-retrospective.md',
];

const EXPECTED_CONFIG = [
  'lifecycle.toml',
  'taxonomy.toml',
  'state.toml',
  'relationships.toml',
];

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function verify(opts) {
  const scopes = opts.scope ? [opts.scope] : ['global', 'project'];
  let found = false;

  for (const scope of scopes) {
    const paths = getTargetPaths(scope);
    const exists = await fileExists(join(paths.commands, 'SKILL.md'));
    if (!exists) continue;
    found = true;

    console.log(`\n✓ blueprint found (${scope}): ${paths.commands}\n`);

    let missing = 0;

    // Check commands
    for (const cmd of EXPECTED_COMMANDS) {
      const ok = await fileExists(join(paths.commands, cmd));
      console.log(`  ${ok ? '✓' : '✗'} commands/${cmd}`);
      if (!ok) missing++;
    }

    // Check agents
    for (const agent of EXPECTED_AGENTS) {
      const ok = await fileExists(join(paths.agents, agent));
      console.log(`  ${ok ? '✓' : '✗'} agents/${agent}`);
      if (!ok) missing++;
    }

    // Check config
    for (const cfg of EXPECTED_CONFIG) {
      const ok = await fileExists(join(paths.config, cfg));
      console.log(`  ${ok ? '✓' : '✗'} config/${cfg}`);
      if (!ok) missing++;
    }

    // Check CLAUDE.md
    const claudeOk = await fileExists(paths.claudeMd);
    console.log(`  ${claudeOk ? '✓' : '✗'} CLAUDE.md`);

    console.log(`\n  ${missing === 0 ? '✓ Installation complete' : `✗ ${missing} files missing — run claude-blueprint install`}\n`);
  }

  if (!found) {
    console.log('\n✗ blueprint not found. Run: claude-blueprint install\n');
  }
}
