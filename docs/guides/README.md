<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# docs/guides/

How-to guides and concept guides for Mosvera. The reference runtime
(Phase 2), MCP server (Phase 3), and provider adapters for OpenAI + FLUX
+ SDXL (Phases 4-5) have shipped; worked examples with deterministic
three-provider emissions and checked-in renders are present under
`examples/`. Guide content will be added as the public-unlock (Phase 6)
progresses and external adoption surfaces grow.

## Planned guides

- **Authoring an aesthetic template** — concepts, primitives, the
  composition file format.
- **Inheritance and modifier semantics** — the canonical model
  walkthrough.
- **Writing a provider adapter** — implementing the provider
  compilation contract.
- **Running the MCP server** — stdio setup, tool invocation from
  agents and editors.
- **Migrating from prompts to compositions** — how to express an
  existing prompt-based workflow as a Mosvera composition.

## What goes here vs elsewhere

- **Specification text** lives in [`spec/specification/`](../../spec/specification/),
  not here.
- **Schemas** live in [`spec/schemas/`](../../spec/schemas/), not here.
- **Architecture rationale** lives in [`docs/decisions/`](../decisions/),
  not here.
- **Roadmap and changelog** live at the [repository root](../../).

Guides explain *how to use* Mosvera. They do not redefine what
Mosvera is.
