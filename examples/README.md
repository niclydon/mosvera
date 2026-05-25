<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# examples/

End-to-end Mosvera examples — concrete aesthetic systems expressed
as Mosvera compositions, rendered through multiple provider
adapters to demonstrate that the abstraction holds.

People understand infrastructure through examples. This directory is
where the abstraction becomes legible: schemas + composition + at
least two providers + comparable rendered outputs, all in one place
per example.

## Conventions

Each example is a self-contained directory:

```text
examples/<example-name>/
├── README.md                 # Aesthetic intent in prose, what this example demonstrates
├── composition.yaml          # The Mosvera composition document
├── templates/                # Templates this composition references
├── palettes/                 # Palettes this composition references
├── modifiers/                # Modifiers this composition uses
└── outputs/
    ├── openai/               # Rendered outputs via the OpenAI adapter
    └── flux/                 # Rendered outputs via the Flux adapter
```

Each example must compile successfully through **all reference
provider adapters available at the example's release time**. An
example that only compiles to one provider is not a valid Mosvera
example.

## Planned examples (Phase 5)

Per [`ROADMAP.md`](../ROADMAP.md#phase-5--examples--open-weights-adapter),
the initial example set covers a deliberately diverse range of
aesthetic intent so the spec's coverage is testable:

- [`cinematic-editorial/`](./cinematic-editorial/) — long-form magazine /
  film-still aesthetic with deterministic Phase 4 payloads for OpenAI
  `gpt-image-1` and BFL `flux-2-pro`
- `dashboard-minimalism/` — clean, information-dense UI-adjacent
- `documentary-realism/` — naturalistic, hand-held, lived-in

Additional examples will be welcome from community contributors
after Phase 5 ships.

## Status

Phase 0b. Scaffold only. Examples land in Phase 5.

## License

Examples are licensed dual: CC-BY-4.0 for the prose, schema files,
and composition documents (documentation per
[ADR-0001](../docs/decisions/0001-license-choice.md)); Apache-2.0
for any runtime / build glue. Rendered output images carry the
license of the provider that produced them (consult each provider's
output license).

## Eventual repo split

This directory is the seed of a future standalone repository at
`github.com/mosvera/examples` per
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
