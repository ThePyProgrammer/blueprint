---
name: blueprint:radar
description: >
  Maintain an internal Technology Radar tracking technology adoption lifecycle (Adopt/Trial/Assess/Hold)
  linked to ADRs. Use when: "technology radar", "tech radar", "adoption status", "should we adopt X?",
  "what technologies are on hold?", "radar update".
  Examples: "/blueprint:radar", "/blueprint:radar add redis adopt", "/blueprint:radar hold jquery".
---

# Internal Technology Radar

Maintain a team/project Technology Radar tracking adoption lifecycle. Technologies on
the radar link to the ADRs that mandate or constrain them. Based on ThoughtWorks Technology
Radar methodology, adapted for project-level use.

## Rings

| Ring | Meaning | ADR Implication |
|------|---------|----------------|
| **Adopt** | Use by default for new work | ADRs may mandate this technology |
| **Trial** | Use in low-risk contexts to learn | ADRs may permit but not mandate |
| **Assess** | Worth exploring, not for production yet | No ADR commitment — research only |
| **Hold** | Do not use for new work | ADRs should flag if they introduce this |

## Quadrants

| Quadrant | Examples |
|----------|---------|
| Languages & Frameworks | TypeScript, React, FastAPI, Rails |
| Platforms & Infrastructure | AWS, Kubernetes, Vercel, PostgreSQL |
| Tools | ESLint, Docker, GitHub Actions, Terraform |
| Techniques & Patterns | Event Sourcing, CQRS, TDD, Microservices |

## Process

### View Radar (`/blueprint:radar`)

1. Read `{adr_directory}/.state/radar.toml`
2. Display radar table grouped by ring, with linked ADRs
3. Highlight technologies in "Hold" that are still used in the codebase
4. Suggest `/blueprint:new` for technologies without governing ADRs

### Add/Move Technology (`/blueprint:radar add <tech> <ring>`)

1. Add or update technology in `{adr_directory}/.state/radar.toml`
2. Cross-reference with existing ADRs
3. If moving to "Hold" and ADRs mandate this technology, warn about conflict
4. Commit: `docs(adr): move [tech] to [ring] on technology radar`

### Audit (`/blueprint:radar audit`)

1. Scan codebase for technologies in "Hold" ring
2. Report violations (code using Hold technologies in new contexts)
3. Suggest `/blueprint:rearchitect` for technologies that need replacement

## Config File: `{adr_directory}/.state/radar.toml`

```toml
# Internal Technology Radar
# Tracks technology adoption lifecycle linked to ADRs.

[[technologies]]
name = "TypeScript"
ring = "adopt"
quadrant = "Languages & Frameworks"
governing_adrs = ["ADR-0002"]
moved = "2026-01-15"
notes = "Default for all new services"

[[technologies]]
name = "jQuery"
ring = "hold"
quadrant = "Languages & Frameworks"
governing_adrs = []
moved = "2026-03-01"
notes = "Legacy only — use React for new UI work"
```

## Integration with Other Commands

- `/blueprint:new` — warn when proposing a technology on the "Hold" ring
- `/blueprint:review` — devil's advocate checks radar alignment
- `/blueprint:map` — radar rings correlate with Wardley evolution stages
- `/blueprint:advise` — radar is a key input to the advice process
