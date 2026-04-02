# ADR-0029: Bootstrap from existing context via archaeological init

| Metadata     | Value                |
|-------------|----------------------|
| ADR ID      | 0029                 |
| Status      | Accepted             |
| Date proposed | 2026-03-30         |
| Date decided  | 2026-03-30         |
| Deciders    | Project team         |

## Context

Most projects that adopt blueprint are not greenfield. They are existing codebases with months or years of history, decisions already made, and architectural patterns already established. When a team runs `blueprint:init` on an existing project, the most important decisions have already been made: the language was chosen, the framework was selected, the database was picked, the deployment model was decided, the module boundaries were drawn. These decisions exist in the code, in the git history, in the `CLAUDE.md`, in the `.planning/` directory, in the `package.json` or `Cargo.toml` or `go.mod`, and in the `.research/` directory if the team used research tooling before adopting blueprint.

An init command that creates an empty `docs/adr/` directory and a template file ignores all of this context. It treats the project as if no decisions have been made, leaving the team to manually write ADRs for decisions that were made 6 months ago. Most teams will not do this. They will create ADRs going forward but never document the foundational decisions that shaped the existing architecture. The result: the ADR corpus starts at decision 15 of 50, and the first 14 decisions, often the most consequential, are never recorded.

Initialization should be archaeology, not greenfield setup. The existing codebase is an artifact. The git history is a stratigraphic record. The config files are inscriptions. Blueprint should read these sources and infer the decisions that have already been made, producing draft ADRs that the team can review, refine, and accept.

## Options Considered

### Option 1: Empty init, just create directories

Create the `docs/adr/` directory, copy the template, write the README, and stop. The team starts with a blank slate. Simple, fast, predictable. But it ignores the reality that the team has already made architectural decisions. Every foundational decision must be manually documented if it is to be documented at all.

**Pros:** Fast. Predictable. No risk of incorrect inference. No magic.

**Cons:** Ignores existing context entirely. Foundational decisions go undocumented. Team starts with a blank ADR corpus despite having a mature codebase. The most important decisions are the least likely to be recorded.

### Option 2: Full context scan with ADR inference, archaeology-first init

The init command scans multiple context sources: `.planning/` (project planning artifacts), `.research/` (research findings), `CLAUDE.md` (project conventions and constraints), package manifest files (`package.json`, `Cargo.toml`, `go.mod`, `requirements.txt`, `pom.xml`), git history (major structural changes, initial commits, framework introductions), and existing code structure (module organization, dependency patterns, framework usage). From these sources, blueprint infers decisions that have been made and generates draft ADRs with status Proposed, pre-filled context and decision sections, and a note indicating they were inferred from existing artifacts.

**Pros:** Captures foundational decisions that would otherwise go undocumented. Produces a comprehensive starting ADR corpus. Treats existing context as valuable signal, not noise. Team reviews and refines rather than writing from scratch.

**Cons:** Inference may be incorrect. Generated ADRs require review and may need significant editing. Scanning multiple sources is complex. Some inferred decisions may be too granular or too obvious to warrant an ADR.

### Option 3: Interactive questionnaire, guided but slow

Present the team with an interactive questionnaire: "What language does this project use? What framework? What database? What deployment model?" Use answers to generate ADRs. More accurate than automated inference because the team provides the answers, but slow and tedious. A team with 15 foundational decisions to document answers 15 sets of questions. Most teams will abandon the questionnaire partway through.

**Pros:** Accurate: the team provides the information. Structured: the questionnaire covers known decision categories. No risk of incorrect inference.

**Cons:** Slow and tedious for projects with many existing decisions. Requires the team to articulate decisions that may have been made implicitly. Does not leverage existing artifacts. Interactive mode is incompatible with automation.

## Decision

**The init command scans `.planning/`, `.research/`, `CLAUDE.md`, package files, git history, and existing code to infer ADRs from decisions already made**, because initialization is archaeology, not greenfield. The most important decisions were made before blueprint was adopted, and a tool that ignores them starts with a hole in the historical record.

## Rationale

- The decisions that matter most are the ones made earliest. Language choice, framework selection, database technology, deployment model: these foundational decisions constrain everything that follows. An ADR corpus that does not document them is missing its most important entries.
- Existing artifacts contain strong signals about decisions made. A `package.json` with Express.js records a framework decision. A `Cargo.toml` records a language decision. A git commit that introduces Docker files records a deployment decision. These signals are machine-readable and high-confidence.
- Draft status (Proposed) makes inference safe. Inferred ADRs are not automatically accepted. The team reviews each one, corrects inaccuracies, rejects false inferences, and accepts valid ones. The inference is a starting point, not an endpoint.
- `.planning/` and `.research/` directories contain explicit decision documentation that teams created before adopting blueprint. Ignoring these artifacts when they exist is wasteful; they contain exactly the information that ADRs should capture.
- `CLAUDE.md` often contains project conventions and constraints that are architectural decisions in everything but name: "always use the repository pattern for data access," "never import directly from the database layer in controllers." These are ADR-worthy invariants.
- The archaeology metaphor is precise: like real archaeology, init examines artifacts (code, config, history) to reconstruct decisions (the culture that produced the artifacts). The reconstruction is imperfect but far more useful than starting with no record at all.

## Consequences

### Positive

- Teams adopting blueprint on existing projects start with a populated ADR corpus that captures foundational decisions. The historical record has no gap between project start and blueprint adoption.
- Inferred ADRs surface decisions that the team may not have consciously recognized as architectural decisions. "We use PostgreSQL" is obvious; "we chose PostgreSQL over MongoDB because our data is relational" is an architectural decision that the inference process can prompt the team to articulate.
- The init scan serves as a project audit. The list of inferred decisions gives the team a structured overview of their existing architectural landscape.
- Teams review and refine rather than write from scratch, which is significantly lower friction.

### Negative

- Inference accuracy varies. Some inferred ADRs will be wrong, too granular, or too obvious. The team must spend time reviewing and pruning the initial corpus.
- Scanning multiple context sources adds complexity to the init command. Each source type requires specific parsing logic.
- Git history analysis on large repositories can be slow. Init on a project with 10,000 commits takes longer than init on a project with 100 commits.

### Risks

- False confidence in inferred ADRs: teams may accept inferred ADRs without reviewing them, treating inference as fact. Mitigation: inferred ADRs include a prominent header indicating they were machine-generated and require review. They are created with Proposed status, not Accepted.
- Noise from over-inference: scanning too many sources with too broad a pattern produces dozens of trivial inferred ADRs ("chose npm over yarn" or "uses tabs over spaces"), overwhelming the team. Mitigation: inference thresholds. Only produce ADRs for decisions that meet a significance threshold (affects multiple modules, involves technology choice, defines a structural pattern).
- Privacy concerns: scanning `.planning/`, `.research/`, and `CLAUDE.md` may surface information that teams did not intend to formalize. Mitigation: init shows what it found and what it inferred, giving the team full visibility before any files are created.

## References

- ADR-0001: Use ADRs for own decisions
- ADR-0004: Encode lifecycle as state machine
- ADR-0013: Infer ownership from git history
- ADR-0015: Proactive intervention for undocumented decisions
- ADR-0022: Design config layer as a domain-specific language
