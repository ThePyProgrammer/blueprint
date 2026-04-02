---
title: "Quickstart"
description: "Your first Architecture Decision Record in 5 minutes. Bootstrap, record, challenge, accept, verify."
---

# Quickstart

## Step 1: Bootstrap

```
/blueprint:init
```

Blueprint scans your codebase for existing architectural decisions (dependency manifests, convention files, planning artifacts, git history) and creates the ADR directory with inferred decisions.

Output:

```
Scanning codebase...
  Found: package.json (React 18, TypeScript 5, Tailwind CSS)
  Found: CLAUDE.md (12 conventions detected)
  Found: .planning/ROADMAP.md (3 architectural choices)

Generated:
  docs/adr/0001-use-react-with-typescript.md [Proposed]
  docs/adr/0002-tailwind-for-styling.md [Proposed]
  docs/adr/0003-monorepo-structure.md [Proposed]
  docs/ARCHITECTURE.md

3 ADRs drafted. Review with /blueprint:list
```

## Step 2: Record a New Decision

```
/blueprint:new "use PostgreSQL for primary storage"
```

Blueprint interviews you about context, constraints, and alternatives, then generates a structured ADR:

```
/blueprint:new --research "use PostgreSQL for primary storage"
```

The `--research` flag spawns a researcher agent that evaluates alternatives with evidence before generating the ADR. The research brief covers: options analysis, benchmark data, ecosystem maturity, team experience fit, and a recommendation.

## Step 3: Challenge It

```
/blueprint:review 4
```

The devil's advocate challenges ADR-0004 across 5 dimensions:

```
Devil's Advocate Challenge: ADR-0004

1. HIDDEN ASSUMPTIONS
   - Assumes PostgreSQL can handle projected write volume
   - Assumes team will learn PostgreSQL operations

2. UNCONSIDERED ALTERNATIVES
   - CockroachDB for horizontal scaling without sharding
   - DynamoDB if query patterns are primarily key-value

3. MISSING CONSEQUENCES
   - No migration strategy for existing 50M rows
   - JSONB queries bypass indexes at scale

4. CODEBASE FIT
   - Current ORM abstractions are database-agnostic: good
   - Connection pooling not configured: needs work

5. TEAM CAPABILITY
   - Zero PostgreSQL ops experience on the team
   - Recommendation: pair with a DBA for first 3 months
```

## Step 4: Accept (or Revise)

If the decision survives the challenge:

```
/blueprint:transition accept 4
```

If it needs revision, update the ADR with the devil's advocate findings, then review again.

## Step 5: Verify Compliance

After the code is written:

```
/blueprint:audit
```

The compliance auditor checks whether the codebase actually follows the accepted decisions. Evidence-based verdicts: COMPLIANT, PARTIAL, VIOLATING, or INSUFFICIENT EVIDENCE.

---

## What's Next?

- `/blueprint:evaluate`: Run the 5-agent architecture evaluation team
- `/blueprint:fitness`: Generate CI-runnable architecture tests
- `/blueprint:hooks install all`: Enable automatic governance triggers
- `/blueprint:status`: View the governance dashboard

!!! tip
    For a faster start with pre-built decisions, try `/blueprint:quickstart`. It auto-detects your stack and generates 5-8 foundational ADRs from templates covering common choices (framework, styling, state management, API patterns, testing strategy).
