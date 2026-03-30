---
name: blueprint:fitness
description: >
  Generate executable architecture fitness functions from accepted ADRs. Produces test files
  that enforce architectural invariants as CI-runnable checks. Use when: "generate fitness
  functions", "architecture tests", "enforce invariants", "create architecture guards",
  "fitness functions from adrs", or after accepting ADRs with structural constraints.
---

# Architecture Fitness Functions

Translates accepted ADR invariants into executable test files. Fitness functions are
unit tests for architecture — they run in CI and fail when architectural constraints
are violated.

> "An architecture that isn't tested will drift. An architecture with fitness functions
> drifts and gets caught."

## Shared Context

Read from parent `blueprint/` skill directory:
- `{adr_directory}/.state/state.toml` — ADR directory location
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

### Step 4: Present and Commit

Show the user:
- How many ADRs produced fitness functions
- List of generated test files
- How to run them: `pytest tests/architecture/` or equivalent

Commit: `test(architecture): generate fitness functions from [N] ADRs`

## Updating Fitness Functions

When an ADR is superseded or deprecated, the corresponding fitness function should
be updated or removed. Suggest running `/blueprint:fitness` after any ADR lifecycle
transition that changes invariants.
