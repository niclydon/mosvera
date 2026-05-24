<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# spec/

The Mosvera specification — the long-term center of gravity of the
project per [`MANIFESTO.md`](../MANIFESTO.md) and the strategic plan.
The specification is language-agnostic, ships under CC-BY-4.0 (with
schemas under Apache-2.0) per
[ADR-0001](../docs/decisions/0001-license-choice.md), and is
structured per
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).

## Layout

| Directory | Purpose |
|-----------|---------|
| `specification/` | Normative prose specification, versioned. `draft/` holds work-in-progress; numbered subdirectories (`0.1/`, `0.2/`) hold ratified versions. |
| `schemas/` | JSON Schema definitions for the primitives — normative, machine-readable. Field names use `snake_case` per [ADR-0005](../docs/decisions/0005-schema-naming-conventions.md). |
| `teps/` | [Mosvera Enhancement Proposals](./meps/) — long-form proposals for spec changes. See [ADR-0003](../docs/decisions/0003-rfc-and-proposal-format.md) for the process. |
| `compliance/` | Conformance test vectors in JSON, runnable against any conforming runtime. Required by [ADR-0007](../docs/decisions/0007-reference-runtime-language.md). |

## Status

Phase 0b. The directory scaffold exists; substantive specification
content lands in Phase 1 (Specification Genesis) per
[`ROADMAP.md`](../ROADMAP.md#phase-1--specification-genesis).

## Eventual repo split

This directory is the seed of a future standalone repository at
`github.com/mosvera/spec` per
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
The directory layout here matches the eventual repository layout to
make the split a relocation, not a rename.
