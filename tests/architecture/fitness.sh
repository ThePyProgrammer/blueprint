#!/usr/bin/env bash
# Architecture Fitness Functions for Blueprint
# Generated from accepted ADRs. Run: bash tests/architecture/fitness.sh
# Exit code 0 = all pass, non-zero = failures found.
#
# These enforce Blueprint's own architectural invariants.

set -uo pipefail
PASS=0
FAIL=0
WARN=0

pass() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
fail() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }
warn() { echo "  ⚠ $1"; WARN=$((WARN + 1)); }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " BLUEPRINT ARCHITECTURE FITNESS FUNCTIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─── ADR-0002: Decompose into focused sub-skills ───
echo "ADR-0002: Decompose into focused sub-skills"
SKILL_COUNT=$(ls skills/*.md 2>/dev/null | wc -l)
if [ "$SKILL_COUNT" -ge 30 ]; then
  pass "skills/ has $SKILL_COUNT skill files (≥30 expected)"
else
  fail "skills/ has $SKILL_COUNT skill files (expected ≥30)"
fi

# ─── ADR-0003: Use TOML for config DSL ───
echo "ADR-0003: Use TOML for config DSL"
JSON_CONFIG=$(find config/ -name "*.json" 2>/dev/null | wc -l)
YAML_CONFIG=$(find config/ -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
TOML_CONFIG=$(find config/ -name "*.toml" 2>/dev/null | wc -l)
if [ "$JSON_CONFIG" -eq 0 ] && [ "$YAML_CONFIG" -eq 0 ]; then
  pass "No JSON/YAML config files (TOML only: $TOML_CONFIG files)"
else
  fail "Found $JSON_CONFIG JSON and $YAML_CONFIG YAML config files (should be TOML only)"
fi

# ─── ADR-0005: Adopt cranky senior engineer persona ───
echo "ADR-0005: Adopt cranky senior engineer persona"
if [ -f agents/persona.md ]; then
  AGENTS_WITH_PERSONA=$(grep -l "persona.md" agents/adr-*.md 2>/dev/null | wc -l)
  TOTAL_AGENTS=$(ls agents/adr-*.md 2>/dev/null | wc -l)
  if [ "$AGENTS_WITH_PERSONA" -eq "$TOTAL_AGENTS" ]; then
    pass "All $TOTAL_AGENTS agents reference persona.md"
  else
    fail "$AGENTS_WITH_PERSONA/$TOTAL_AGENTS agents reference persona.md"
  fi
else
  fail "agents/persona.md does not exist"
fi

# ─── ADR-0006: Use thin router pattern ───
echo "ADR-0006: Use thin router pattern"
ROUTER_LINES=$(wc -l < skills/blueprint.md)
if [ "$ROUTER_LINES" -le 120 ]; then
  pass "Router is $ROUTER_LINES lines (≤120 expected)"
else
  warn "Router is $ROUTER_LINES lines (target ≤120 — getting thick)"
fi

# ─── ADR-0007: Separate evaluation into five dimensions ───
echo "ADR-0007: Separate evaluation into five dimensions"
EVAL_AGENTS=$(ls agents/adr-consistency-auditor.md agents/adr-bug-surface-mapper.md agents/adr-maintainability-assessor.md agents/adr-testing-strategy-evaluator.md agents/adr-conways-law-analyzer.md 2>/dev/null | wc -l)
if [ "$EVAL_AGENTS" -eq 5 ]; then
  pass "All 5 evaluation agents exist"
else
  fail "Only $EVAL_AGENTS/5 evaluation agents found"
fi

# ─── ADR-0008: Agents return inline output ───
echo "ADR-0008: Agents return inline output"
FILE_WRITERS=$(grep -l "Write.*file\|write.*to.*file\|save.*to" agents/adr-*.md 2>/dev/null | grep -v "architect-cartographer\|diagram-generator" | wc -l)
if [ "$FILE_WRITERS" -eq 0 ]; then
  pass "No agents write files (except cartographer and diagram generator)"
else
  warn "$FILE_WRITERS agents may write files (check manually)"
fi

# ─── ADR-0016: Single responsibility per agent ───
echo "ADR-0016: Single responsibility per agent"
AGENT_COUNT=$(ls agents/adr-*.md 2>/dev/null | wc -l)
MULTI_ROLE=$(grep -l "responsibilities.*:" agents/adr-*.md 2>/dev/null | while read f; do
  RESP_COUNT=$(grep -c "^- " <(sed -n '/responsibilities/,/^<\//p' "$f") 2>/dev/null || echo 0)
  if [ "$RESP_COUNT" -gt 7 ]; then echo "$f"; fi
done | wc -l)
if [ "$MULTI_ROLE" -eq 0 ]; then
  pass "All $AGENT_COUNT agents have focused responsibility lists"
else
  warn "$MULTI_ROLE agents have >7 responsibilities (may be overloaded)"
fi

# ─── ADR-0023: Fitness functions from ADRs ───
echo "ADR-0023: Fitness functions from ADRs"
if [ -f tests/architecture/fitness.sh ]; then
  pass "This file exists (meta-fitness: we practice what we preach)"
else
  fail "No fitness function file exists"
fi

# ─── ADR-0035: Research-backed paradigm integration ───
echo "ADR-0035: Research-backed paradigm integration"
if [ -f papers/software-architecture-paradigms.md ]; then
  pass "Research report exists at papers/software-architecture-paradigms.md"
else
  fail "Research report missing"
fi
if [ -f ROADMAP.md ]; then
  pass "ROADMAP.md exists linking extensions to paradigms"
else
  fail "ROADMAP.md missing"
fi

# ─── ADR-0036: DDD bounded context scoping ───
echo "ADR-0036: DDD bounded context scoping"
if [ -f skills/scope.md ] && [ -f agents/adr-context-mapper.md ] && [ -f config/contexts.toml ]; then
  pass "Scope skill, context-mapper agent, and contexts.toml all exist"
else
  fail "Missing scope implementation files"
fi

# ─── ADR-0039: Epistemic status tracking ───
echo "ADR-0039: Epistemic status tracking"
if [ -f skills/evidence.md ] && [ -f agents/adr-evidence-auditor.md ] && [ -f config/evidence.toml ]; then
  pass "Evidence skill, evidence-auditor agent, and evidence.toml all exist"
else
  fail "Missing evidence implementation files"
fi

# ─── Structural Invariants ───
echo ""
echo "Structural Invariants:"

# Every command has a corresponding YAML frontmatter
COMMANDS_WITHOUT_FRONTMATTER=$(for f in skills/*.md; do
  head -1 "$f" | grep -q "^---" || echo "$f"
done | wc -l)
if [ "$COMMANDS_WITHOUT_FRONTMATTER" -eq 0 ]; then
  pass "All commands have YAML frontmatter"
else
  fail "$COMMANDS_WITHOUT_FRONTMATTER commands missing YAML frontmatter"
fi

# Native Claude Code plugins discover skills from skills/<name>/SKILL.md
MISSING_NATIVE_SKILLS=$(for f in skills/*.md; do
  cmd=$(basename "$f" .md)
  [ -f "skills/$cmd/SKILL.md" ] || echo "$cmd"
done | wc -l)
if [ "$MISSING_NATIVE_SKILLS" -eq 0 ]; then
  pass "All commands have native plugin skill directories"
else
  fail "$MISSING_NATIVE_SKILLS commands missing native plugin skill directories"
fi

# Every agent has required XML sections
AGENTS_WITHOUT_ROLE=$(grep -rL "<role>" agents/adr-*.md 2>/dev/null | wc -l)
if [ "$AGENTS_WITHOUT_ROLE" -eq 0 ]; then
  pass "All agents have <role> section"
else
  fail "$AGENTS_WITHOUT_ROLE agents missing <role> section"
fi

AGENTS_WITHOUT_OUTPUT=$(grep -rL "<output_format>" agents/adr-*.md 2>/dev/null | wc -l)
if [ "$AGENTS_WITHOUT_OUTPUT" -eq 0 ]; then
  pass "All agents have <output_format> section"
else
  fail "$AGENTS_WITHOUT_OUTPUT agents missing <output_format> section"
fi

AGENTS_WITHOUT_GATE=$(grep -rL "<quality_gate>" agents/adr-*.md 2>/dev/null | wc -l)
if [ "$AGENTS_WITHOUT_GATE" -eq 0 ]; then
  pass "All agents have <quality_gate> section"
else
  fail "$AGENTS_WITHOUT_GATE agents missing <quality_gate> section"
fi

# ─── Summary ───
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Results: $PASS passed, $FAIL failed, $WARN warnings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
