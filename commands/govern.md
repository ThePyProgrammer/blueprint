---
name: blueprint:govern
description: >
  Configure governance mode for ADR lifecycle — lightweight (default), advised (Advice Process
  required), governed (N approvals required), or formal (phase-based gates). Use when: "governance
  mode", "change governance", "require approvals", "formal governance", "enterprise governance".
  Examples: "/blueprint:govern", "/blueprint:govern set advised", "/blueprint:govern set governed --approvers 2".
---

# Configurable Governance Tiers

Configure how strictly ADR lifecycle transitions are governed. Supports four modes from
lightweight to formal, enabling Blueprint adoption across startups to regulated enterprises.

## Governance Modes

| Mode | Description | Best For |
|------|------------|---------|
| **Lightweight** | Single proposer, optional review. Current default. | Startups, small teams, rapid iteration |
| **Advised** | Advice Process required before proposing. Must consult affected parties. | Growing teams, distributed architecture |
| **Governed** | N approvals required before acceptance. Named approvers. | Enterprise teams, compliance-conscious |
| **Formal** | Phase-based gate reviews with board approval. | Regulated industries, large organizations |

## Process

### View Current Mode (`/blueprint:govern`)

1. Read `{adr_directory}/.state/governance.toml`
2. Display current mode, requirements, and configured approvers
3. Show governance statistics (approval rates, average time to accept)

### Set Mode (`/blueprint:govern set <mode>`)

1. Update `{adr_directory}/.state/governance.toml` with new mode
2. Validate mode-specific requirements:
   - `advised`: requires `{adr_directory}/.state/contexts.toml` with owners
   - `governed`: requires `--approvers N` and named approver list
   - `formal`: requires board members and gate definitions
3. Commit: `feat(adr): set governance mode to [mode]`

### Mode-Specific Behavior

#### Lightweight (default)
- `/blueprint:new` creates Proposed ADR immediately
- `/blueprint:transition accept` works without review
- No approval tracking

#### Advised
- `/blueprint:new` prompts for `/blueprint:advise` first if not completed
- Advice section required in ADR before acceptance
- `/blueprint:transition accept` checks for advice documentation

#### Governed
- `/blueprint:new` creates Proposed ADR
- `/blueprint:transition accept` blocked until N approvers sign off
- Approval tracked in ADR metadata: `Approved-By: [name1, name2]`
- `/blueprint:review` auto-requested on proposal
- `/blueprint:challenge` optionally auto-requested (if `auto_request_challenge = true`)

#### Formal
- Phase gates: Proposed → Research → Challenge → Review → Board → Accepted
- Each phase requires explicit completion before next
- Board review generates formal minutes
- Full audit trail in state.toml

## Config File: `{adr_directory}/.state/governance.toml`

```toml
# Governance Configuration
# Controls how strictly ADR lifecycle transitions are managed.

mode = "lightweight"   # lightweight | advised | governed | formal

[advised]
require_advice_before_propose = true
minimum_consultations = 2

[governed]
required_approvals = 2
approvers = ["alice", "bob", "carol"]
auto_request_review = true

[formal]
board_members = ["vp-eng", "principal-architect", "security-lead"]
gate_phases = ["research", "review", "board-review"]
require_impact_analysis = true
```

## Integration with Other Commands

- `/blueprint:transition` — respects governance mode (blocks acceptance if requirements unmet)
- `/blueprint:advise` — mandatory in "advised" mode
- `/blueprint:review` — auto-triggered in "governed" mode
- `/blueprint:challenge` — auto-triggered in "formal" mode
- `/blueprint:status` — dashboard shows governance mode and compliance
