---
name: blueprint:fitness
description: >
  Generate executable architecture fitness functions from accepted ADRs. Produces test files
  that enforce architectural invariants as CI-runnable checks. Use when: "generate fitness
  functions", "architecture tests", "enforce invariants", "create architecture guards",
  "fitness functions from adrs", or after accepting ADRs with structural constraints.
arguments:
  --format:
    type: string
    default: shell
    choices: [shell, github-actions, gitlab-ci, justfile]
    description: >
      Output format for generated fitness functions. "shell" (default) generates standalone
      bash scripts and test files. "github-actions" generates a .github/workflows/architecture.yml
      workflow. "gitlab-ci" generates a .gitlab-ci.yml job. "justfile" generates a just recipe.
---

# Architecture Fitness Functions

Translates accepted ADR invariants into executable test files. Fitness functions are
unit tests for architecture — they run in CI and fail when architectural constraints
are violated.

> "An architecture that isn't tested will drift. An architecture with fitness functions
> drifts and gets caught."

## Shared Context

Read from parent `blueprint/` skill directory:
- `state.toml` — ADR directory location
- `config/taxonomy.toml` — severity levels
- `agents/persona.md` — personality

## Process

### Step 1: Extract Testable Invariants

Read all accepted ADRs. For each, determine if the decision produces a testable
invariant:

**Testable invariants (generate fitness functions):**
- Dependency direction rules: "Module A must not import from module B"
- Technology constraints: "All database access must go through the ORM"
- Pattern enforcement: "All API endpoints must have input validation"
- Boundary rules: "No direct database queries outside the repository layer"
- Constraint rules: "All code suggestions must come from the validated database"
- File structure rules: "Every service must have a corresponding test file"

**Non-testable (skip):**
- Process decisions: "Use ADRs for decisions"
- Deployment decisions: "Deploy as standalone web app"
- Deferred decisions: "Defer auth to v2"

### Step 2: Generate Test Files

For each testable invariant, generate an executable test:

**Detect the project's test framework:**
- Python: pytest (check for pytest.ini, conftest.py, pyproject.toml [tool.pytest])
- JavaScript/TypeScript: vitest or jest (check package.json)
- Go: go test (check go.mod)
- If unclear, ask the user

**Test file naming:** `tests/architecture/test_adr_NNNN.py` (or equivalent)

**Each test includes:**
```python
"""
Architecture Fitness Function: ADR-NNNN — [Title]

This test enforces the architectural invariant from ADR-NNNN.
If this test fails, either fix the code to comply with the ADR,
or create a new ADR to formally change the decision.

DO NOT skip or delete this test without updating the ADR.
"""
```

**Test patterns by invariant type:**

Dependency direction:
```python
def test_adr_NNNN_no_service_imports_from_api():
    """Services must not import from the API layer (ADR-NNNN)."""
    violations = find_imports(source_dir="src/services", forbidden_pattern="from src.api")
    assert not violations, f"Dependency violation: {violations}"
```

Technology constraint:
```python
def test_adr_NNNN_no_raw_sql():
    """All database access must use the ORM (ADR-NNNN)."""
    violations = grep_source(pattern=r"cursor\.execute|\.raw\(", exclude_dirs=["migrations"])
    assert not violations, f"Raw SQL found: {violations}"
```

Pattern enforcement:
```python
def test_adr_NNNN_all_endpoints_validated():
    """Every API endpoint must have Pydantic input validation (ADR-NNNN)."""
    endpoints = find_route_handlers("src/api")
    unvalidated = [e for e in endpoints if not has_pydantic_param(e)]
    assert not unvalidated, f"Unvalidated endpoints: {unvalidated}"
```

### Step 3: Generate Helper Module

Create `tests/architecture/conftest.py` (or equivalent) with shared utilities:
- `find_imports(source_dir, forbidden_pattern)` — grep for import violations
- `grep_source(pattern, include_dirs, exclude_dirs)` — regex search across source
- `find_files(pattern, directory)` — glob for structural checks
- `assert_no_violations(violations, adr_id, message)` — standard assertion

### Step 4: Generate Output Format

Apply the requested `--format` (default: `shell`). See the **Output Formats** section below
for the exact templates and rules for each format.

Always generate the test files from Steps 2–3 first, then wrap them in the CI/runner format.

### Step 5: Present and Commit

Show the user:
- How many ADRs produced fitness functions
- List of generated test files
- Which output format was used and what files were created
- How to run them: `pytest tests/architecture/` or equivalent (for shell/justfile),
  or "push to trigger CI" (for github-actions/gitlab-ci)

Commit: `test(architecture): generate fitness functions from [N] ADRs [format: <format>]`

## Output Formats

After generating test files (Steps 1–3), wrap them in the requested output format.
If `--format` is omitted, default to `shell`.

### `--format shell` (default)

Current behavior. Generate test files and a runner script at `tests/architecture/fitness.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== Architecture Fitness Functions ==="
# Run the test suite for the detected framework
# e.g., pytest tests/architecture/ or go test ./tests/architecture/...
<detected_test_command>

echo "All architecture fitness functions passed."
```

No additional CI wrapper is generated. The user runs or integrates this script manually.

### `--format github-actions`

Generate a GitHub Actions workflow file at `.github/workflows/architecture.yml`:

```yaml
name: Architecture Fitness
on: [push, pull_request]
jobs:
  fitness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up runtime
        # Include language-specific setup (actions/setup-python, actions/setup-node, etc.)
        # based on the detected test framework from Step 2.
        <setup_step>
      - name: Install dependencies
        run: <install_command>
      - name: Run architecture fitness functions
        run: bash tests/architecture/fitness.sh
```

**Rules:**
- Always generate `tests/architecture/fitness.sh` alongside the workflow (the workflow calls it).
- Detect the project language and add the appropriate setup action (`actions/setup-python@v5`,
  `actions/setup-node@v4`, `actions/setup-go@v5`, etc.).
- Add dependency installation (`pip install -r requirements.txt`, `npm ci`, `go mod download`).
- If dependencies cannot be detected, omit the install step and add a YAML comment:
  `# TODO: add dependency installation for your project`.

### `--format gitlab-ci`

Generate a GitLab CI job. If `.gitlab-ci.yml` already exists, append the job. If not, create it.

```yaml
architecture-fitness:
  stage: test
  script:
    - bash tests/architecture/fitness.sh
  rules:
    - changes:
        - "src/**/*"
        - "docs/adr/**/*"
```

**Rules:**
- Always generate `tests/architecture/fitness.sh` alongside the job definition.
- Adjust the `rules.changes` paths to match the project's actual source and ADR directories
  (read `state.toml` for the ADR path, detect `src/`, `lib/`, `app/`, etc. for source).
- If appending to an existing `.gitlab-ci.yml`, do not duplicate stages — check whether
  `test` is already in the `stages:` list.
- Add language-specific `image:` if detectable (e.g., `image: python:3.12`, `image: node:20`).

### `--format justfile`

Generate a `just` recipe. If a `justfile` already exists, append the recipe. If not, create one.

```just
# Architecture fitness functions — generated by blueprint:fitness
# Re-run /blueprint:fitness --format justfile after ADR changes.
architecture-test:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "=== Architecture Fitness Functions ==="
    <detected_test_command>
    echo "All architecture fitness functions passed."
```

**Rules:**
- If appending to an existing `justfile`, add a blank line separator before the new recipe.
- Do not duplicate the recipe if `architecture-test` already exists — replace it in-place.
- The recipe body uses bash via the shebang so it works identically to the shell format.

## Updating Fitness Functions

When an ADR is superseded or deprecated, the corresponding fitness function should
be updated or removed. Suggest running `/blueprint:fitness` after any ADR lifecycle
transition that changes invariants.
