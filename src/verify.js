import { access } from 'fs/promises';
import { join } from 'path';
import { getTargetPaths } from './paths.js';

const EXPECTED_SKILLS = [
  'SKILL.md',
  // v1 skills
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
  'init/SKILL.md',
  'architect/SKILL.md',
  'eli5/SKILL.md',
  'fitness/SKILL.md',
  'drift/SKILL.md',
  'debt/SKILL.md',
  'guard/SKILL.md',
  'digest/SKILL.md',
  'timeline/SKILL.md',
  'status/SKILL.md',
  'health/SKILL.md',
  'hooks/SKILL.md',
  // v2 skills
  'scope/SKILL.md',
  'challenge/SKILL.md',
  'reflect/SKILL.md',
  'evidence/SKILL.md',
  'map/SKILL.md',
  'diagram/SKILL.md',
  'trace/SKILL.md',
  'advise/SKILL.md',
  'tradeoff/SKILL.md',
  'risk/SKILL.md',
  'export/SKILL.md',
  'views/SKILL.md',
  'federate/SKILL.md',
  'radar/SKILL.md',
  'govern/SKILL.md',
  // v3 skills
  'grill-me/SKILL.md',
];

const EXPECTED_AGENTS = [
  'persona.md',
  // v1 agents
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
  'adr-architect-cartographer.md',
  // v2 agents
  'adr-forces-evaluator.md',
  'adr-reflexion-analyzer.md',
  'adr-evidence-auditor.md',
  'adr-context-mapper.md',
  'adr-strategic-analyzer.md',
  'adr-diagram-generator.md',
  'adr-tradeoff-analyzer.md',
  'adr-risk-mapper.md',
  'adr-federation-indexer.md',
];

const EXPECTED_CONFIG = [
  'lifecycle.toml',
  'taxonomy.toml',
];

// These are per-project state files, NOT global config.
// They live in {adr_directory}/.state/ and are created by /blueprint:init.
const STATE_TEMPLATES = [
  'state-templates/state.toml',
  'state-templates/relationships.toml',
  'state-templates/contexts.toml',
  'state-templates/evidence.toml',
  'state-templates/governance.toml',
  'state-templates/radar.toml',
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

    // Check skills
    for (const cmd of EXPECTED_SKILLS) {
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

    // Check state templates
    for (const tmpl of STATE_TEMPLATES) {
      const ok = await fileExists(join(paths.config, tmpl));
      console.log(`  ${ok ? '✓' : '✗'} config/${tmpl}`);
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
