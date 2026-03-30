import { readFile, writeFile } from 'fs/promises';

const BEGIN = '<!-- BEGIN blueprint -->';
const END = '<!-- END blueprint -->';

const SECTION = `${BEGIN}
## blueprint

Architecture Decision Records with teeth. Cranky senior engineer persona.

### Commands

| Command | What it does |
|---------|-------------|
| \`/blueprint:help\` | Full reference + contextual suggestions |
| \`/blueprint:list\` | ADR table + next actions |
| \`/blueprint:new "topic"\` | Create ADR (add \`--research\` for evidence) |
| \`/blueprint:review N\` | Devil's advocate challenge before acceptance |
| \`/blueprint:transition accept N\` | Accept / reject / defer / deprecate |
| \`/blueprint:search "term"\` | Find decisions by topic |
| \`/blueprint:impact N\` | Check for cross-ADR conflicts |
| \`/blueprint:audit\` | Verify codebase follows accepted decisions |
| \`/blueprint:retro\` | Post-fix retrospective (band-aid or systemic?) |
| \`/blueprint:evaluate\` | 5-agent architecture evaluation team |
| \`/blueprint:rearchitect "topic"\` | Research + supersede a decision |

### Architecture Evaluation Dimensions

| Dimension | Command |
|-----------|---------|
| Structural consistency | \`/blueprint:evaluate consistency\` |
| Bug surface mapping | \`/blueprint:evaluate bugs\` |
| Long-term maintainability | \`/blueprint:evaluate maintainability\` |
| Testing strategy | \`/blueprint:evaluate testing\` |
| Conway's Law alignment | \`/blueprint:evaluate conways\` |
${END}`;

export async function updateClaudeMd(claudeMdPath) {
  let content = '';
  try {
    content = await readFile(claudeMdPath, 'utf-8');
  } catch {
    // File doesn't exist yet
  }

  const regex = new RegExp(
    `${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  );

  if (regex.test(content)) {
    content = content.replace(regex, SECTION);
  } else {
    content = content ? content.trimEnd() + '\n\n' + SECTION + '\n' : SECTION + '\n';
  }

  await writeFile(claudeMdPath, content, 'utf-8');
}
