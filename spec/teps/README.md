<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Tessera Enhancement Proposals (TEPs)

TEPs are the mechanism for proposing changes to Tessera's public
specification. The process is defined in
[ADR-0003](../../docs/decisions/0003-rfc-and-proposal-format.md) and
modeled on OpenTelemetry Enhancement Proposals (OTEPs), which in
turn borrow from Rust RFCs and Kubernetes Enhancement Proposals.

**TEPs ≠ ADRs.** TEPs propose changes to the public spec. ADRs
record repository-architecture decisions. The two systems do not
overlap — see [ADR-0003](../../docs/decisions/0003-rfc-and-proposal-format.md)
for the full distinction.

## Format

Use [`0000-template.md`](./0000-template.md). The template's seven
sections are: Motivation, Explanation, Internal details, Trade-offs
and mitigations, Prior art and alternatives, Open questions, and
Future possibilities.

## Numbering

TEPs are numbered by the **PR number at merge time**, four-digit
zero-padded (`TEP-0017`). Before merge, a discussion PR is
referenced by descriptive slug (`teps/inheritance-resolution.md`).

## Lifecycle

| State | Meaning |
|-------|---------|
| `provisional` | Open PR, under discussion. |
| `accepted` | PR merged, design agreed. |
| `implementable` | Accepted and ready for runtime / provider work. |
| `implemented` | Runtime and at least one provider ship it. |
| `final` | Promoted into the normative spec; immutable. |
| `deferred` | Paused, may resume. |
| `rejected` | Declined. |
| `withdrawn` | Author withdrew. |
| `superseded` | Replaced by a later TEP (carries `superseded-by: TEP-NNNN`). |

## Review

Review happens on the GitHub PR. During incubation, **2 maintainer
approvals** are required, with a **7-day Final Comment Period
before merge** once approvals land. Approval threshold raises to 4
once the maintainer pool exceeds 4 (matching OTel).

## Status

Phase 0b. The template and process documentation are in place; the
first real TEPs land in Phase 1 (Specification Genesis) covering:

- Composition semantics
- Inheritance rules
- Provider compilation contract

See [`../../ROADMAP.md`](../../ROADMAP.md#phase-1--specification-genesis)
for the full Phase 1 plan.

## Index

| TEP | Title | Status |
|-----|-------|--------|
| [0001](./0001-composition-semantics.md) | Composition Semantics | provisional |

Planned (Phase 1):

- **TEP-0002** — Inheritance Rules (templates extending templates; reuses the merge operation from TEP-0001)
- **TEP-0003** — Provider Compilation Contract (canonical model → provider payloads)
