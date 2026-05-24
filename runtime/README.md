<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# runtime/

The Mosvera reference runtime — parses schemas, resolves
inheritance, merges modifiers, composes primitives, validates
structures, and compiles provider outputs.

## Language

TypeScript first, per
[ADR-0007](../docs/decisions/0007-reference-runtime-language.md).
The TS pick is grounded in the MCP ecosystem (Anthropic's reference
SDK is TS), mature JSON Schema tooling, and the largest AI-native
dev audience — not because TS is anyone's day-to-day preference.

A Python port is **committed-to** as a binding follow-on. The
runtime architecture must keep semantic logic separable from
TS-idiomatic glue so the Python port is a translation rather than
a rewrite. The
[conformance suite](../spec/compliance/) is the cross-language
correctness contract.

## Responsibilities

| Module | Responsibility |
|--------|---------------|
| `src/parser` | Load and validate spec documents (YAML/JSON → typed AST). |
| `src/resolver` | Walk inheritance chains; detect cycles. |
| `src/merger` | Apply modifier merge semantics per MEP. |
| `src/composer` | Produce a canonical composition object. |
| `src/validator` | Runtime-level structural validation. |
| `src/compiler` | Translate canonical model → provider payloads (with adapters). |

## Status

Phase 0b. Scaffold only. The runtime lands in Phase 2 per
[`ROADMAP.md`](../ROADMAP.md#phase-2--reference-runtime-typescript)
once Phase 1 (Specification Genesis) freezes the spec primitives.

## Layout

| Directory | Purpose |
|-----------|---------|
| `src/` | Source code. |
| `tests/` | Unit tests for runtime semantics (inheritance, merge, cycle detection, validation). |
| `examples/` | Runtime-scoped examples (end-to-end examples live in `../examples/`). |

## License

Apache-2.0 per
[ADR-0001](../docs/decisions/0001-license-choice.md).

## Eventual repo split

This directory is the seed of a future standalone repository at
`github.com/mosvera/runtime` per
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
