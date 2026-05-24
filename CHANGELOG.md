<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Changelog

All notable changes to Tessera are documented here. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and
this project will adhere to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)
once it ships its first release.

For deeper context on architectural changes, see
[`docs/decisions/`](./docs/decisions/). For specification changes
once Phase 1 ships, see [`spec/teps/`](./spec/teps/).

## [Unreleased]

### Added

- **Phase 1 — Specification Genesis (in progress).** First specification
  proposal:
  - [TEP-0001: Composition Semantics](./spec/teps/0001-composition-semantics.md)
    — defines the core merge algebra (deep-merge object model, schema-declared
    keyed list merging via `merge_by`, `$unset`/`$revert` directives), the
    total precedence chain (base → ordered modifiers → inline overrides),
    mandatory DAG/cycle detection for references, and the determinism +
    legibility guarantees. Grounded in a cited survey of CSS cascade, JSON
    Merge Patch (RFC 7396), JSON Patch (RFC 6902), Kubernetes Strategic Merge
    Patch, DTCG, Tailwind, Sass, and Terraform. Status: provisional.

- **Naming status.** "Tessera" marked as an internal working codename;
  public-facing name deferred to Phase 6 after brand-collision research
  found the name unacquirable. See README and CLAUDE.md notices.

- **Phase 0b — Foundation deliverables.** Standing up the repository
  per [ADR-0002](./docs/decisions/0002-top-level-repository-layout.md):
  - Root-level `MANIFESTO.md`, `ROADMAP.md`, `GLOSSARY.md`, `README.md`.
  - Root-level governance files: `GOVERNANCE.md`, `CONTRIBUTING.md`,
    `MAINTAINERS.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1),
    `SECURITY.md`, `CHANGELOG.md`.
  - Dual licensing per [ADR-0001](./docs/decisions/0001-license-choice.md):
    root `LICENSE` (Apache-2.0), and `LICENSES/` directory with the
    full Apache-2.0 and CC-BY-4.0 texts per REUSE convention.
  - Scaffold directories with stub READMEs: `spec/`, `spec/teps/`,
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
    RFC / specification proposal format (TEPs + ADRs).
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
release tag. Once Tessera ships its first release, entries will
graduate into dated, semver-tagged sections.
