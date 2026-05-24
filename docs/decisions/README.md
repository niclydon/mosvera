# Architecture Decision Records (ADRs)

This directory holds Architecture Decision Records for Tessera's repository
architecture, infrastructure choices, and governance decisions.

ADRs follow the [Nygard format](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html):
short, immutable, retrospective records of decisions already made. Once
accepted, an ADR is **never edited** — it is superseded by a later ADR if the
decision changes.

## ADRs vs TEPs

Tessera uses **two distinct document types**:

| Type | Location | Purpose | Mutability |
|------|----------|---------|------------|
| **ADR** | `docs/decisions/` | Repo architecture, license, layout, naming, governance | Immutable once accepted |
| **TEP** | `spec/teps/` | Tessera Enhancement Proposals — changes to the public spec | Tracked through a lifecycle (provisional → accepted → implementable → implemented → final) |

See [ADR-0003](./0003-rfc-and-proposal-format.md) for the full distinction
and the TEP process design.

## Format

Each ADR is a numbered Markdown file: `NNNN-short-kebab-title.md`. Numbering
is monotonic starting at 0001. Use the [template](./0000-template.md).

Required sections:

- **Status** — `Accepted`, `Superseded by ADR-NNNN`, `Deprecated`, etc.
- **Date** — ISO 8601 date of acceptance.
- **Doctrines invoked** — which of the five Primary Doctrines from
  [`CLAUDE.md`](../../CLAUDE.md#primary-doctrines) drove the decision.
- **Context** — what's at stake and why a decision is needed.
- **Research** — what comparable projects and standards actually do, with
  inline citations. Doctrine 5 (Research-first) is binding: at least three
  authoritative sources per ADR.
- **Decision** — the concrete choice, stated unambiguously.
- **Consequences** — what this enables, what it precludes, what tradeoffs
  are accepted.
- **Sources** — full source list at the end.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](./0001-license-choice.md) | License choice | Accepted |
| [0002](./0002-top-level-repository-layout.md) | Top-level repository layout | Accepted |
| [0003](./0003-rfc-and-proposal-format.md) | RFC / specification proposal format | Accepted |
| [0004](./0004-governance.md) | Pre-public and first-release governance | Accepted |
| [0005](./0005-schema-naming-conventions.md) | Schema field naming conventions | Accepted |
| [0006](./0006-prior-art-survey.md) | Prior art survey for aesthetic infrastructure | Accepted |
| [0007](./0007-reference-runtime-language.md) | Reference runtime language | Accepted |
| [0008](./0008-provider-adapter-pairing.md) | Phase 4 provider adapter pairing | Accepted |
