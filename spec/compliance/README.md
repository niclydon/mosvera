<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# spec/compliance/

Conformance test vectors for Tessera.
[ADR-0007](../../docs/decisions/0007-reference-runtime-language.md)
makes language-portable conformance a requirement: every conforming
runtime — TypeScript reference, Python committed port, and any
future-language community implementation — must pass the suite here.

## Format

Each conformance case is a JSON document containing:

- The input — a Tessera composition (schema-conformant).
- The expected canonical model after parsing, inheritance
  resolution, modifier merge, and composition.
- For provider-compilation cases, the expected provider payload
  output for a specified provider.
- Any expected validation errors, identified by their normative
  rule reference.

Runtimes consume these JSON cases directly. There is no host-
language code in this directory — the entire suite is the
language-neutral contract that makes Tessera implementations
substitutable.

## Status

Phase 0b. Scaffold only. The first conformance cases land in Phase 1
alongside the initial JSON Schemas and TEPs.

## Why this exists

The runtime architecture is required to keep semantic logic
separable from host-language idioms so that the eventual Python
port (and any community-language implementations) are translations
rather than rewrites. Conformance cases are the testable contract
that proves the abstraction holds across languages — preventing the
single-language reference runtime from quietly becoming
TypeScript-shaped semantics that other languages can only
approximate.

See
[ADR-0007](../../docs/decisions/0007-reference-runtime-language.md)
for the full rationale.
