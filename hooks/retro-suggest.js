#!/usr/bin/env node
// PostToolUse:Bash hook — suggest /blueprint:retro after fix commits.
// Deterministic script replaces prompt-based hook to avoid false positives
// where the LLM would explain its reasoning on non-matching commands.

let input = '';
const timeout = setTimeout(() => process.exit(0), 5000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(timeout);
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};
    const toolOutput = data.tool_output || '';

    // Only match git commit commands
    const cmd = toolInput.command || '';
    if (!cmd.match(/\bgit\s+commit\b/)) {
      process.exit(0);
    }

    // Only match if commit succeeded and message contains fix keywords
    const output = typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput);
    if (/\b(fix|bugfix|hotfix|patch)\b/i.test(output) && !output.includes('nothing to commit')) {
      const result = {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: "A bug fix was just committed. Consider running /blueprint:retro to classify the root cause and check if this warrants an ADR."
        }
      };
      process.stdout.write(JSON.stringify(result));
    }
    // Otherwise: zero output = silent pass-through
  } catch (e) {
    process.exit(0);
  }
});
