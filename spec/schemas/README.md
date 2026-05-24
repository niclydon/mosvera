<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# spec/schemas/

Normative JSON Schema definitions for Tessera's aesthetic primitives.
Schemas are first-class peers of the prose specification: they are
machine-readable, language-agnostic, and embedded into conforming
runtimes.

## Conventions

- **Field names** use `snake_case` per
  [ADR-0005](../../docs/decisions/0005-schema-naming-conventions.md).
- **`$`-prefixed keys** are reserved for Tessera spec directives
  (`$schema`, `$id`, `$ref`, `$extends`, `$compose`). User-defined
  field names MUST NOT begin with `$`.
- **Allowed characters** in field names: `[a-z][a-z0-9_]*`. No
  hyphens, no uppercase, no dots.
- **License:** Apache-2.0 (schemas ship inside conforming runtimes
  and therefore use the code license, not the documentation license)
  per [ADR-0001](../../docs/decisions/0001-license-choice.md).

## Status

Phase 0b. The directory scaffold exists; the first JSON Schemas land
in Phase 1 per [`ROADMAP.md`](../../ROADMAP.md#phase-1--specification-genesis):

- `aesthetic-template.schema.json`
- `palette.schema.json`
- `modifier.schema.json`
- `composition.schema.json`

## Meta-schema check

Every published schema must validate against the JSON Schema
meta-schema. The check runs in CI once the schemas exist.
