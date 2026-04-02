# ADR-0041: Support configurable governance tiers from lightweight to formal

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0041                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |
| Related     | [ADR-0004](0004-encode-lifecycle-as-state-machine.md) |

## Context

Blueprint's ADR lifecycle (ADR-0004) uses a single governance mode: any user can propose, review is optional, acceptance is a simple transition. This works well for small teams and startups but creates a barrier to adoption in organizations with regulatory requirements, compliance mandates, or established architecture review boards.

The research survey identified a governance spectrum: ~36% of organizations prefer centralized governance, ~29% prefer hybrid, ~36% prefer federated (Intelance, 2026). The Architecture Advice Process (Harmel-Law, ThoughtWorks Radar Trial 2025) represents the most innovative decentralized approach: anyone can decide, provided they seek advice first. TOGAF represents the most formal approach: phase-based gate reviews with board approval.

Blueprint should serve the full spectrum without forcing all users into one mode. A startup needs lightweight governance; a bank needs formal governance with audit trails. The same tool should serve both.

## Options Considered

### Option 1: One governance mode: lightweight for all

Keep the current lightweight mode. Organizations that need formal governance should use external processes alongside Blueprint.

- **Pros:** Simple. No configuration. Fast to adopt. Avoids bloating Blueprint with enterprise features.
- **Cons:** Excludes regulated industries and enterprise teams. These organizations represent the majority of software development. External governance processes create workflow fragmentation. Blueprint cannot be the "goto system" for architecture management if it only serves startups.

### Option 2: Configurable governance tiers: four modes from lightweight to formal

Support four governance modes: lightweight (current), advised (Advice Process required), governed (N approvals required), formal (phase-based gates). Configurable per project in `config/governance.toml`. Default is lightweight.

- **Pros:** Serves the full governance spectrum. Default is unchanged (lightweight). Enterprise adoption enabled without changing the core workflow. Advice Process integration is progressive (advised mode). Config-driven (ADR-0003: TOML for config).
- **Cons:** More complex configuration. Four modes to test and maintain. Risk of "governance theater" in formal mode. Users may over-configure.

## Decision

> In the context of enabling Blueprint adoption across organizational types, facing the barrier that a single governance mode excludes regulated industries and enterprise teams, we decided for configurable governance tiers (Option 2) to achieve full-spectrum architecture governance, accepting the complexity of four governance modes.

## Rationale

The default is lightweight; existing users are unaffected. The governance mode is configuration, not code. Moving from lightweight to advised is a one-line config change that integrates the Architecture Advice Process. Moving to governed adds approval tracking. Moving to formal adds phase gates. Each tier adds structure incrementally; you don't have to jump from startup to TOGAF.

The governance mode enforces through the existing lifecycle state machine (ADR-0004). In "governed" mode, `transition accept` checks for N approvals before allowing the transition. In "formal" mode, intermediate phases (Research → Review → Board) are inserted into the lifecycle. The state machine handles the enforcement; the governance config defines the requirements.

## Consequences

### Positive
- Blueprint serves startups to enterprises without workflow changes
- Default behavior is unchanged (lightweight)
- Architecture Advice Process available as "advised" mode
- Enterprise adoption barrier removed
- Governance mode is config-driven (ADR-0003)

### Negative
- Four modes to document, test, and maintain
- Risk of users over-configuring (formal mode for a 3-person team)
- Governance enforcement adds complexity to lifecycle transitions

### Risks
- Formal mode becomes "governance theater" if board reviews are rubber stamps
- Configuration may be set once and never revisited as team/project evolves
- Users in governed mode may see Blueprint as a bottleneck rather than an enabler

## References
- Harmel-Law, A. "Scaling Architecture Conversationally" martinfowler.com, 2021
- ThoughtWorks Technology Radar, April 2025: Architecture Advice Process (Trial)
- TOGAF Architecture Board: pubs.opengroup.org
- commands/govern.md: Skill implementation
- ADR-0004: Encode lifecycle as state machine
