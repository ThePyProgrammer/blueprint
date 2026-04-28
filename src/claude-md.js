import { readFile, writeFile } from 'fs/promises';

const BEGIN = '<!-- BEGIN blueprint -->';
const END = '<!-- END blueprint -->';

const SECTION = `${BEGIN}
## blueprint

Architecture Decision Records with teeth. Cranky senior engineer persona.
40 skills, 21 agents, 15 architecture paradigms.

### Core Commands

| Command | What it does |
|---------|-------------|
| \\`/blueprint:help\\` | Full reference + contextual suggestions |
| \\`/blueprint:list\\` | ADR table with context, evidence, and filters |
| \\`/blueprint:new "topic"\\` | Create ADR (add \\`--research\\` for evidence) |
| \\`/blueprint:advise "topic"\\` | Architecture Advice Process before proposing |
| \\`/blueprint:challenge N\\` | DCAR forces evaluation — weigh arguments |
| \\`/blueprint:review N\\` | Devil's advocate adversarial challenge |
| \\`/blueprint:transition accept N\\` | Accept / reject / defer / deprecate |
| \\`/blueprint:search "term"\\` | Find decisions by topic |
| \\`/blueprint:grill-me\\` | Quiz and cross-examine your ADR understanding |

### Analysis

| Command | What it does |
|---------|-------------|
| \\`/blueprint:impact N\\` | Cross-ADR conflict detection |
| \\`/blueprint:audit\\` | Verify codebase follows accepted decisions |
| \\`/blueprint:reflect\\` | Reflexion model — formal conformance check |
| \\`/blueprint:evidence\\` | Audit epistemic status + temporal validity |
| \\`/blueprint:tradeoff\\` | ATAM utility tree — sensitivity + tradeoff points |
| \\`/blueprint:risk\\` | Risk heat map (complexity × churn ÷ governance) |
| \\`/blueprint:trace\\` | ADR-to-fitness-function traceability |
| \\`/blueprint:retro\\` | Post-fix retrospective (band-aid or systemic?) |

### Strategic & Governance

| Command | What it does |
|---------|-------------|
| \\`/blueprint:scope\\` | DDD bounded context scoping for ADRs |
| \\`/blueprint:map\\` | Wardley Map — strategic build-vs-buy analysis |
| \\`/blueprint:radar\\` | Technology Radar (Adopt/Trial/Assess/Hold) |
| \\`/blueprint:govern\\` | Configure governance mode (lightweight → formal) |
| \\`/blueprint:evaluate\\` | 5-agent architecture evaluation team |

### Documentation

| Command | What it does |
|---------|-------------|
| \\`/blueprint:architect\\` | Generate/update ARCHITECTURE.md |
| \\`/blueprint:diagram\\` | Auto-generate C4 diagrams from ADR graph |
| \\`/blueprint:eli5\\` | Plain English explanation of ADRs |
| \\`/blueprint:export arc42\\` | Export to arc42 12-section format |
| \\`/blueprint:views\\` | Tag ADRs with 4+1 architectural views |
| \\`/blueprint:digest\\` | Non-technical stakeholder summary |
| \\`/blueprint:timeline\\` | Architecture evolution narrative |

### Continuous Governance

| Command | What it does |
|---------|-------------|
| \\`/blueprint:fitness\\` | Generate CI-runnable architecture tests |
| \\`/blueprint:drift\\` | Detect gradual architecture erosion |
| \\`/blueprint:debt\\` | Track decision debt + evidence expiry |
| \\`/blueprint:guard\\` | Pre-commit invariant check |
| \\`/blueprint:federate\\` | Cross-repo ADR aggregation |
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
