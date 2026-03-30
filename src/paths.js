import { homedir } from 'os';
import { join } from 'path';

export function getTargetPaths(scope) {
  if (scope === 'global') {
    const base = join(homedir(), '.claude');
    return {
      commands: join(base, 'commands', 'blueprint'),
      agents: join(base, 'commands', 'blueprint', 'agents'),
      config: join(base, 'commands', 'blueprint', 'config'),
      claudeMd: join(base, 'CLAUDE.md'),
      scope: 'global',
    };
  }

  // Project scope
  const base = join(process.cwd(), '.claude');
  return {
    commands: join(base, 'commands', 'blueprint'),
    agents: join(base, 'commands', 'blueprint', 'agents'),
    config: join(base, 'commands', 'blueprint', 'config'),
    claudeMd: join(process.cwd(), 'CLAUDE.md'),
    scope: 'project',
  };
}
