import { readdir, copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getTargetPaths } from './paths.js';
import { updateClaudeMd } from './claude-md.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, '..');

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
  for (const subDir of ['', 'help', 'list', 'new', 'review', 'transition', 'search', 'impact', 'audit', 'retro', 'evaluate', 'rearchitect', 'agents', 'config']) {
    await mkdir(join(paths.commands, subDir), { recursive: true });
  }
  spinner.succeed('Directories created');

  // Copy root command (router)
  spinner.start('Installing router...');
  await copyFile(
    join(PLUGIN_ROOT, 'commands', 'blueprint.md'),
    join(paths.commands, 'SKILL.md'),
  );
  spinner.succeed('Router installed');

  // Copy sub-commands as SKILL.md in their directories
  spinner.start('Installing commands...');
  const commands = ['help', 'list', 'new', 'review', 'transition', 'search', 'impact', 'audit', 'retro', 'evaluate', 'rearchitect'];
  for (const cmd of commands) {
    await copyFile(
      join(PLUGIN_ROOT, 'commands', `${cmd}.md`),
      join(paths.commands, cmd, 'SKILL.md'),
    );
  }
  spinner.succeed(`${commands.length} commands installed`);

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

  // Copy config
  spinner.start('Installing config...');
  const configFiles = await readdir(join(PLUGIN_ROOT, 'config'));
  for (const file of configFiles) {
    await copyFile(
      join(PLUGIN_ROOT, 'config', file),
      join(paths.config, file),
    );
  }
  spinner.succeed(`${configFiles.length} config files installed`);

  // Update CLAUDE.md
  spinner.start('Updating CLAUDE.md...');
  await updateClaudeMd(paths.claudeMd);
  spinner.succeed('CLAUDE.md updated');

  console.log(`\n✓ blueprint installed (${scope})`);
  console.log(`  Commands: ${paths.commands}`);
  console.log(`  Run /blueprint:help to get started\n`);
}
