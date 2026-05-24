<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Changelog

All notable changes to Mosvera are documented here. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and
this project will adhere to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)
once it ships its first release.

For deeper context on architectural changes, see
[`docs/decisions/`](./docs/decisions/). For specification changes
once Phase 1 ships, see [`spec/meps/`](./spec/meps/).

## [Unreleased]

### Added

- **Phase 1 — Specification Genesis (in progress).** Specification
  proposals:
  - [MEP-0001: Composition Semantics](./spec/meps/0001-composition-semantics.md)
    — defines the core merge algebra (deep-merge object model, schema-declared
    keyed list merging via `merge_by`, `$unset`/`$revert` directives), the
    total precedence chain (base → ordered modifiers → inline overrides),
    mandatory DAG/cycle detection for references, and the determinism +
    legibility guarantees. Grounded in a cited survey of CSS cascade, JSON
    Merge Patch (RFC 7396), JSON Patch (RFC 6902), Kubernetes Strategic Merge
    Patch, DTCG, Tailwind, Sass, and Terraform. Status: provisional.
  - [MEP-0002: Inheritance Rules](./spec/meps/0002-inheritance-rules.md)
    — defines the `$extends` mechanism as **single inheritance** (one parent),
    resolved as a linear ancestor chain folded with MEP-0001's `merge` (child
    wins). Extends cycle detection to the inheritance graph. Unifies
    inheritance + composition into one total precedence order
    (`ancestors → self → modifiers → overrides`). Multiple inheritance + C3
    linearization reserved as a gated future possibility. Grounded in a cited
    survey of C3/Python MRO, Jinja2/Twig/JS prototype chains, Scala/Ruby/PHP
    traits, JSON Schema `allOf`, CUE unification, Dhall, and the
    composition-over-inheritance doctrine. Status: provisional.
  - [MEP-0003: Provider Compilation Contract](./spec/meps/0003-provider-compilation-contract.md)
    — defines how the canonical model compiles to provider payloads. Each
    adapter ships a machine-readable **capability manifest** declaring a
    **lowering action** per construct (`native` / `approximate` / `emulate` /
    `unsupported`); every canonical construct carries a **criticality**
    (`required` / `optional`). Compilation rule: `required` + `unsupported`
    → hard error before any provider call; everything lossy → compile +
    structured warning; **loss is never silent**. Determinism boundary at the
    payload-emission line (compilation deterministic; generation not).
    Provenance map traces payload fields back to canonical constructs. Worked
    example: one composition compiling to both OpenAI gpt-image-1 and FLUX.2-pro
    per ADR-0008. Grounded in a cited survey of LLVM, glTF, Terraform,
    OpenTelemetry, Style Dictionary, Pandoc, and SQLAlchemy. Status: provisional.

    **The three foundational MEPs (0001–0003) now define the complete semantic
    model:** aesthetic intent composes, inherits, and compiles to provider-ready
    requests.
  - **Conformance suite** in [`spec/compliance/`](./spec/compliance/): 21
    language-agnostic JSON vectors (+ `vector.schema.json` meta-schema)
    covering the normative behaviors of all three foundational MEPs —
    deep/scalar/type-mismatch merge, the three list strategies,
    `$unset`/`$revert`, the precedence chain, single inheritance,
    multi-level chains, the inheritance/composition seam, `$revert` and
    `merge_by` across the inheritance boundary, inheritance-cycle and
    multiple-inheritance rejection, and the full compilation
    criticality × lowering-action rule table. Each vector verified during
    authoring against an independent reference oracle, the vector
    meta-schema, and the Mosvera primitive schemas. This is the
    cross-language correctness contract ADR-0007 requires; the Phase 2
    runtime will be the first implementation checked against it.
  - **v0.1 JSON Schemas** in [`spec/schemas/`](./spec/schemas/) encoding the
    three MEPs + ADR-0005 naming: `common` (shared `$defs`), `composition`,
    `template`, `modifier`, `palette`, and `capability-manifest`. JSON Schema
    2020-12 dialect, URN-style `$id`s, snake_case enforcement, `$`-directives
    (`$extends`/`$unset`/`$revert`) permitted and unknown `$`-keys rejected.
    The aesthetic vocabulary is left open at v0.1 by design. All six validate
    against the 2020-12 meta-schema; verified with positive/negative document
    tests (valid composition accepted; hyphenated/uppercase/unknown-directive/
    missing-required documents rejected; capability manifest requires a `note`
    on `approximate`/`emulate` mappings).

- **Project named: Mosvera.** The project was renamed from its original
  working name "Tessera" to **Mosvera**, selected through a full
  brand-availability process (web search for commercial collisions +
  domains + GitHub org + npm scope + social handles). "Tessera" was
  unusable for an open standard — every relevant domain and the GitHub
  org were taken and the word is a brand across many industries.
  "Mosvera" is clean across `.com`/`.io`/`.dev`/`.org`, the GitHub org,
  the npm scope, and Bluesky, with no commercial brand collision. The
  rename touched the whole repo: prose, schema `$id` URNs
  (`urn:tessera:` → `urn:mosvera:`), and the enhancement-proposal series
  (**TEP → MEP**, `spec/teps/` → `spec/meps/`, vector field `tep` →
  `mep`). The project remains in quiet incubation; only the name is now
  settled. Recorded in
  [ADR-0009](./docs/decisions/0009-project-name-selection.md), which also
  documents the methodology lesson: run the full availability process
  before building on a name, not a domain DNS lookup after the fact.

- **Phase 0b — Foundation deliverables.** Standing up the repository
  per [ADR-0002](./docs/decisions/0002-top-level-repository-layout.md):
  - Root-level `MANIFESTO.md`, `ROADMAP.md`, `GLOSSARY.md`, `README.md`.
  - Root-level governance files: `GOVERNANCE.md`, `CONTRIBUTING.md`,
    `MAINTAINERS.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1),
    `SECURITY.md`, `CHANGELOG.md`.
  - Dual licensing per [ADR-0001](./docs/decisions/0001-license-choice.md):
    root `LICENSE` (Apache-2.0), and `LICENSES/` directory with the
    full Apache-2.0 and CC-BY-4.0 texts per REUSE convention.
  - Scaffold directories with stub READMEs: `spec/`, `spec/meps/`,
    `spec/schemas/`, `spec/specification/`, `spec/compliance/`,
    `runtime/`, `mcp/`, `providers/`, `examples/`, `docs/`,
    `docs/guides/`, `docs/strategy/`.
  - Strategic plan relocated from repo root to
    `docs/strategy/strategic-plan.md`.

- **Phase 0a — Doctrine + research deposit.** Eight Architecture
  Decision Records under [`docs/decisions/`](./docs/decisions/)
  validating every structural choice with at least three
  authoritative sources each:
  - [ADR-0001](./docs/decisions/0001-license-choice.md) — License
    choice (Apache-2.0 + CC-BY-4.0).
  - [ADR-0002](./docs/decisions/0002-top-level-repository-layout.md)
    — Top-level repository layout.
  - [ADR-0003](./docs/decisions/0003-rfc-and-proposal-format.md) —
    RFC / specification proposal format (MEPs + ADRs).
  - [ADR-0004](./docs/decisions/0004-governance.md) — Pre-public
    and first-release governance.
  - [ADR-0005](./docs/decisions/0005-schema-naming-conventions.md)
    — Schema field naming conventions (snake_case).
  - [ADR-0006](./docs/decisions/0006-prior-art-survey.md) — Prior
    art survey.
  - [ADR-0007](./docs/decisions/0007-reference-runtime-language.md)
    — Reference runtime language (TypeScript first, Python
    committed).
  - [ADR-0008](./docs/decisions/0008-provider-adapter-pairing.md)
    — Phase 4 provider adapter pairing (OpenAI + FLUX.2-pro).

- **Five Primary Doctrines** at the top of [`CLAUDE.md`](./CLAUDE.md):
  Public-first, Adoption-over-convenience, Spec-neutrality,
  Comparable-class framing, Research-first.

- **Private working-layer convention.** `.local/` added to
  `.gitignore` to give contributors a gitignored space for
  per-contributor notes and personal-tooling integrations that must
  not reach the public repo.

- **Initial commit.** Strategic ecosystem plan and agent guidance.

---

The `[Unreleased]` section captures work since the most recent
release tag. Once Mosvera ships its first release, entries will
graduate into dated, semver-tagged sections.
