import { readdir, copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getTargetPaths } from './paths.js';
import { updateClaudeMd } from './claude-md.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, '..');

// Single source of truth for all sub-commands (DRY — used for both dirs and file copy)
const SUB_COMMANDS = [
  // v1 commands
  'help', 'list', 'new', 'review', 'transition', 'search', 'impact', 'audit',
  'retro', 'evaluate', 'rearchitect', 'init', 'architect', 'eli5', 'fitness',
  'drift', 'debt', 'guard', 'digest', 'timeline', 'status', 'health', 'hooks',
  // v2 commands
  'scope', 'challenge', 'reflect', 'evidence', 'map', 'diagram', 'trace',
  'advise', 'tradeoff', 'risk', 'export', 'views', 'federate', 'radar', 'govern',
  // v3 commands
  'grill-me',
];

export async function install(opts) {
  let scope = opts.global ? 'global' : opts.project ? 'project' : null;

  if (!scope) {
    const { select } = await import('@inquirer/prompts');
    scope = await select({
      message: 'Where should blueprint be installed?',
      choices: [
        { name: 'Global (~/.claude/) — available in all projects', value: 'global' },
        { name: 'Project (.claude/) — this project only', value: 'project' },
      ],
    });
  }

  const { default: ora } = await import('ora');
  const paths = getTargetPaths(scope);

  // Create directories
  const spinner = ora('Creating directories...').start();
  for (const subDir of ['', 'agents', 'config', ...SUB_COMMANDS]) {
    await mkdir(join(paths.commands, subDir), { recursive: true });
  }
  spinner.succeed('Directories created');

  // Copy root command (router)
  spinner.start('Installing router...');
  await copyFile(
    join(PLUGIN_ROOT, 'skills', 'blueprint.md'),
    join(paths.commands, 'SKILL.md'),
  );
  spinner.succeed('Router installed');

  // Copy sub-skills as SKILL.md in their directories
  spinner.start('Installing skills...');
  for (const cmd of SUB_COMMANDS) {
    await copyFile(
      join(PLUGIN_ROOT, 'skills', `${cmd}.md`),
      join(paths.commands, cmd, 'SKILL.md'),
    );
  }
  spinner.succeed(`${SUB_COMMANDS.length} skills installed`);

  // Copy agents
  spinner.start('Installing agents...');
  const agentFiles = await readdir(join(PLUGIN_ROOT, 'agents'));
  for (const file of agentFiles) {
    await copyFile(
      join(PLUGIN_ROOT, 'agents', file),
      join(paths.agents, file),
    );
  }
  spinner.succeed(`${agentFiles.length} agents installed`);

  // Copy config — only static schema files, not per-project mutable state
  spinner.start('Installing config...');
  const STATIC_CONFIG = ['lifecycle.toml', 'taxonomy.toml'];
  for (const file of STATIC_CONFIG) {
    await copyFile(
      join(PLUGIN_ROOT, 'config', file),
      join(paths.config, file),
    );
  }
  spinner.succeed(`${STATIC_CONFIG.length} config files installed (static schemas only)`);

  // Copy state templates — used by /blueprint:init to seed per-project state
  const STATE_TEMPLATES_DIR = join(paths.config, 'state-templates');
  await mkdir(STATE_TEMPLATES_DIR, { recursive: true });
  const STATE_FILES = ['state.toml', 'relationships.toml', 'contexts.toml', 'evidence.toml', 'governance.toml', 'radar.toml'];
  for (const file of STATE_FILES) {
    await copyFile(
      join(PLUGIN_ROOT, 'config', file),
      join(STATE_TEMPLATES_DIR, file),
    );
  }
  spinner.start('').succeed(`${STATE_FILES.length} state templates installed (seeded per-project by /blueprint:init)`);

  // Update CLAUDE.md
  spinner.start('Updating CLAUDE.md...');
  await updateClaudeMd(paths.claudeMd);
  spinner.succeed('CLAUDE.md updated');

  console.log(`\n✓ blueprint installed (${scope})`);
  console.log(`  Commands: ${paths.commands}`);
  console.log(`  Run /blueprint:help to get started\n`);
}
