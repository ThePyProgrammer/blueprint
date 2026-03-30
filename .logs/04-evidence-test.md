# Dogfood Test: /blueprint:evidence
**Date:** 2026-03-31
**Target:** Blueprint's own ADRs (focus on 0035-0041)
**Command tested:** /blueprint:evidence

## Evidence Audit Output

### Summary

| Metric | Count |
|--------|-------|
| ADRs assessed | 7 (ADR-0035 through ADR-0041) |
| ADRs with L2 evidence (validated) | 0 |
| ADRs with L1 evidence (consistent) | 4 |
| ADRs with L0 evidence (unverified) | 3 |
| ADRs with expired evidence (>6 months) | 0 |
| ADRs with dead source URLs | 0 |
| ADRs with changed context | 0 |
| Evidence health | AGING |

All 7 ADRs were proposed and accepted on the same day (2026-03-30) -- 1 day old at audit time. No temporal staleness yet, but multiple epistemic quality issues.

---

### Per-ADR Evidence Assessment

#### ADR-0035: Ground v2 extensions in published research
- **Overall confidence:** L1
- **Evidence age:** 1 day (proposed 2026-03-30)
- **Claims assessed:** 3
  1. "20+ architecture paradigms surveyed (109 sources)" -- references `papers/software-architecture-paradigms.md` which exists. L1: sourced, not empirically validated in a project context.
  2. "15 specific extensions identified" -- references ROADMAP.md. L1: traceable internal claim.
  3. "ATAM (1998) to epistemic staleness (2026)" -- name-drops timeline without specific citations inline. L1: reasonable but vague.
- **Stale claims:** None (1 day old)
- **Dead URLs:** None (no external URLs cited directly)
- **Context changes:** None
- **Recommendation:** Keep. Promote to L2 when extensions are implemented and validated.

#### ADR-0036: DDD bounded context scoping
- **Overall confidence:** L1
- **Evidence age:** 1 day
- **Claims assessed:** 3
  1. "Evans' Domain-Driven Design (2003)" -- canonical reference, universally accepted. L1.
  2. "DDD bounded context scoping identified as #1 extension opportunity by impact" -- claims this came from the research survey but no specific source for the "#1" ranking beyond internal assessment. L0-borderline.
  3. "Most requested capability in ADR tooling across practitioner sources" -- no specific practitioner source cited. L0.
- **Stale claims:** None
- **Dead URLs:** None (book reference, not URL)
- **Context changes:** None
- **Conservative aggregation applied:** The "#1 extension" and "most requested" claims are unsourced. Under strict conservative aggregation, this ADR drops to **L0** because those claims lack citations.
- **Recommendation:** Add specific citations for the "most requested" claim or downgrade the language to "frequently discussed."

#### ADR-0037: Dual review protocol (DCAR + devil's advocate)
- **Overall confidence:** L1
- **Evidence age:** 1 day
- **Claims assessed:** 2
  1. "van Heesch et al., IEEE Software, 2014" -- specific academic citation. L1.
  2. "Blueprint's most natural formal method counterpart" -- this is an internal assessment from the research survey, not an external claim. L1: logically sound editorial judgment.
- **Stale claims:** None
- **Dead URLs:** No external URLs to check (journal citation only)
- **Context changes:** None
- **Recommendation:** Keep. Solid L1. Promote to L2 after `/blueprint:challenge` is used on real ADRs and produces measurably better reviews.

#### ADR-0038: Reflexion models for conformance checking
- **Overall confidence:** L1
- **Evidence age:** 1 day
- **Claims assessed:** 2
  1. "Murphy, Notkin, Sullivan, 1995" -- canonical academic reference, 30+ years of citations. L1.
  2. "Blueprint already has the inputs needed for reflexion models" -- verifiable internal claim (ADRs exist, ARCHITECTURE.md exists). L1.
- **Stale claims:** None
- **Dead URLs:** None
- **Context changes:** None
- **Recommendation:** Keep. Clean L1. The 1995 paper is a foundational CS reference -- age is not a concern for theoretical frameworks.

#### ADR-0039: Epistemic status tracking
- **Overall confidence:** L0 (conservative aggregation)
- **Evidence age:** 1 day
- **Claims assessed:** 4
  1. "Koenig et al. (2026, arXiv:2601.21116)" -- **AUTHOR ATTRIBUTION ERROR.** The actual paper at arXiv:2601.21116 is by Sankalp Gilda and Shlok Gilda, not "Koenig et al." The paper exists and covers the claimed topic, but the author name is wrong. L0: factually inaccurate citation.
  2. "~23% of architectural decisions had stale evidence within two months" -- the actual paper says "20-25%", so the 23% figure is within range but presented with false precision. L1 with caveat.
  3. "86% of staleness discovered reactively during incidents" -- needs verification against paper text. Could not confirm this exact statistic from the abstract. L0: unverified specific claim.
  4. "Three requirements: epistemic layers, conservative aggregation, temporal validity" -- consistent with the paper's abstract description. L1.
- **Stale claims:** None temporally, but the author attribution is factually wrong TODAY.
- **Dead URLs:** arXiv:2601.21116 is LIVE and accessible.
- **Context changes:** None
- **Conservative aggregation applied:** Wrong author name = L0 citation accuracy. The 86% statistic is unverified. **Overall: L0.**
- **Recommendation:** Fix the author attribution from "Koenig et al." to "Gilda and Gilda" across ADR-0039, the evidence.md skill, and the adr-evidence-auditor.md agent. Verify the 86% claim against the full paper text.

#### ADR-0040: Wardley Map evolution stages
- **Overall confidence:** L1
- **Evidence age:** 1 day
- **Claims assessed:** 3
  1. "Simon Wardley's Wardley Mapping framework" -- canonical reference. learnwardleymapping.com verified LIVE. L1.
  2. "Kaiser, S. 'Architecture for Flow' (2023)" -- book reference, not URL-checked but a known publication. L1.
  3. "Building custom authentication in 2026 is building for a commodity" -- editorial assertion, reasonable but not sourced. L1: logically consistent opinion.
- **Stale claims:** None
- **Dead URLs:** learnwardleymapping.com is LIVE and contains the claimed content.
- **Context changes:** None
- **Recommendation:** Keep. Solid L1.

#### ADR-0041: Configurable governance tiers
- **Overall confidence:** L0 (conservative aggregation)
- **Evidence age:** 1 day
- **Claims assessed:** 4
  1. "~36% centralized, ~29% hybrid, ~36% federated (Intelance, 2026)" -- no URL or publication details for "Intelance, 2026." This is an unsourced statistic. L0.
  2. "Harmel-Law, ThoughtWorks Radar Trial 2025" -- martinfowler.com article verified LIVE. The article is from 2021, not 2025. The ThoughtWorks Radar "Trial" designation for 2025 is a separate claim. L1 for the article existing; the "Trial 2025" radar status is unverified.
  3. "TOGAF Architecture Board -- pubs.opengroup.org" -- canonical reference. L1.
  4. "Architecture Advice Process" -- well-documented concept via verified Harmel-Law article. L1.
- **Stale claims:** None temporally
- **Dead URLs:** martinfowler.com article is LIVE
- **Context changes:** None
- **Conservative aggregation applied:** The "Intelance, 2026" statistics are unsourced (no URL, no publication title). **Overall: L0.**
- **Recommendation:** Either provide a full citation for "Intelance, 2026" with a URL, or remove the specific percentages.

---

### URL Spot-Check Results

| URL / Reference | ADR | Status | Notes |
|-----------------|-----|--------|-------|
| arXiv:2601.21116 | 0039 | LIVE | Paper exists but authors are Gilda & Gilda, NOT "Koenig et al." |
| learnwardleymapping.com | 0040 | LIVE | Active educational site about Wardley Mapping |
| martinfowler.com/articles/scaling-architecture-conversationally.html | 0041 | LIVE | Article by Andrew Harmel-Law, published 2021-12-15 |

---

## Issues Found

### Issue 1: Wrong author attribution (CRITICAL)
ADR-0039 cites "Koenig et al. (2026)" for arXiv:2601.21116. The actual authors are Sankalp Gilda and Shlok Gilda. This error is propagated to `commands/evidence.md` (line 13) and `agents/adr-evidence-auditor.md` (line 23). Three files carry the same wrong citation. This is exactly the kind of AI-generated citation error that the evidence command is supposed to catch -- and it is present in the evidence command's own documentation.

### Issue 2: Unsourced statistics (HIGH)
- ADR-0041 cites "Intelance, 2026" for governance mode percentages (36%/29%/36%) with no URL, publication title, or way to verify. This is an L0 claim presented as authoritative data.
- ADR-0039 cites "86% of staleness discovered reactively" -- could not verify this specific statistic from the paper abstract.

### Issue 3: Missing `.state/` directory
The evidence.md skill specifies that evidence classifications live in `{adr_directory}/.state/evidence.toml`. The `.state/` directory under `docs/adr/` does not exist. The `config/evidence.toml` file exists at the project root level but is in the wrong location per the skill's own specification. The skill says `{adr_directory}/.state/evidence.toml` but the actual file is at `config/evidence.toml`.

### Issue 4: No per-ADR evidence records
The `config/evidence.toml` file has the settings section but zero per-ADR records. The file template shows `[adrs.ADR-NNNN]` entries but none have been created. The evidence command has never been run against its own ADRs.

### Issue 5: All 7 ADRs proposed and accepted same day
Every v2 ADR was proposed AND accepted on 2026-03-30 with no time gap. The metadata shows `Date proposed: 2026-03-30` and `Date decided: 2026-03-30`. This means no review period occurred. For a tool that preaches rigorous review (ADR-0009, ADR-0037), batch-accepting 7 ADRs on the same day they were proposed is not a great look.

### Issue 6: Self-referential irony in ADR-0039
ADR-0039 establishes the principle that "AI-generated research explicitly flagged as L0 until validated." The ADR itself contains AI-generated research (wrong author name, unverified 86% statistic) that was accepted without validation. The evidence command exists to catch exactly this problem -- and the problem exists in the evidence command's own foundational ADR.

---

## Suggested Fixes

### Fix 1: Correct author attribution
Replace "Koenig et al." with "Gilda and Gilda" (or "Gilda, S. and Gilda, S.") in:
- `docs/adr/0039-epistemic-status-tracking.md` (3 occurrences)
- `commands/evidence.md` (line 13)
- `agents/adr-evidence-auditor.md` (line 23)
- `config/evidence.toml` (line 3)

### Fix 2: Source or remove the "Intelance, 2026" citation
In `docs/adr/0041-configurable-governance-tiers.md`, either:
- Add a full citation with URL for "Intelance, 2026"
- Or soften the language: "Industry surveys suggest roughly even distribution across centralized, hybrid, and federated governance models" without fake-precise percentages.

### Fix 3: Reconcile evidence.toml location
The skill says `{adr_directory}/.state/evidence.toml`. The actual file is `config/evidence.toml`. Either:
- Move `config/evidence.toml` to `docs/adr/.state/evidence.toml` (requires creating `.state/` directory)
- Or update the skill to reference `config/evidence.toml`
Pick one and be consistent.

### Fix 4: Bootstrap per-ADR evidence records
Run `/blueprint:evidence` against the accepted ADRs to populate per-ADR records in `evidence.toml`. The config file is empty scaffolding with no data.

### Fix 5: Verify the 86% statistic
Fetch the full text of arXiv:2601.21116 and verify or correct the "86% of staleness discovered reactively during incidents" claim. If it cannot be verified, mark it as approximate or remove it.

---

## Verdict

**PASS WITH NOTES**

The evidence skill and agent are well-designed. The epistemic level framework (L0/L1/L2) is sound. The conservative aggregation rule is the right call. The config file structure is sensible. The process described in the agent (5-step extraction, classification, temporal check, aggregation, context change detection) is thorough.

But the tool fails its own standards:
1. The foundational citation is attributed to the wrong authors -- the exact kind of AI hallucination the tool exists to catch.
2. Two ADRs contain unsourced statistics that would classify as L0 under the tool's own rules.
3. The evidence.toml file location does not match the skill specification.
4. No per-ADR evidence records exist -- the tool has never been run.
5. All v2 ADRs were accepted the same day they were proposed, with no review period.

None of these are architectural failures. They are execution gaps -- the kind that accumulate when you ship fast and validate later. The evidence command is the right tool to catch them. It just needs to be run.

The irony is not lost: a tool designed to detect stale and unverified evidence ships with unverified evidence in its own foundational ADR. Fix the author name, source the statistics, reconcile the file paths, and run the tool against itself. Then it earns L1.
