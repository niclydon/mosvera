<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Mosvera

> **Name: Mosvera.** Selected through a full brand-availability process
> (web search for commercial collisions + domains + GitHub org + npm scope
> + social handles, per Doctrines 5 and 6), with no commercial brand
> collision in any vertical. Registered domains: **`mosvera.com`**,
> **`mosvera.io`**, **`mosvera.org`**, **`mosvera.dev`** — with
> **`mosvera.io` as the canonical home** (`.com`, `.org`, and `.dev`
> redirect to it). The GitHub organization exists at
> **`github.com/mosvera`**. Schema `$id`s are
> rooted there (`https://mosvera.io/schema/0.1/…`). Phase 6 public unlock
> is in preparation; external publication is complete only when the public
> repos, npm packages, schema hosting, and launch essay are verified live. See
> [ADR-0009](./docs/decisions/0009-project-name-selection.md) (name) and
> [ADR-0014](./docs/decisions/0014-canonical-public-domain.md) (canonical
> public domain).

**A declarative runtime for aesthetic intent in AI-native systems.**

Mosvera defines aesthetic primitives — templates, palettes,
modifiers, compositions — and compiles them into provider-specific
outputs (OpenAI, FLUX, SDXL, Runway, …) through a provider-neutral
canonical model. AI-native systems consume Mosvera through its MCP
server, the same way they consume any other standardized tool
surface.

If "prompts plus a folder of JSON" is the AI-native era's assembly
language, Mosvera is one layer above: a structural representation of
aesthetic intent that can be versioned, inherited, composed,
validated, and compiled — the way infrastructure became code with
Terraform, the way instrumentation became standardized with
OpenTelemetry, the way HTTP services became contract-first with
OpenAPI.

For the conceptual frame, see **[`MANIFESTO.md`](./MANIFESTO.md)**.
For the phased plan, see **[`ROADMAP.md`](./ROADMAP.md)**.
For the project's operating doctrines, see
**[`CLAUDE.md`](./CLAUDE.md)**.

## Status

**Phase 6 public-unlock preparation.** Phases 0-5 are complete: SDXL,
OpenAI, and FLUX adapters are implemented; three worked example systems have
deterministic three-provider emissions and checked-in generated images; and
119 tests pass across runtime, MCP, provider workspaces, and cross-provider
vectors. Public release still depends on the external unlock steps in
[`ROADMAP.md`](./ROADMAP.md#phase-6--public-unlock-in-progress).

The full status of each surface is in
[`ROADMAP.md`](./ROADMAP.md#phases). The decisions that shaped the
repository — license, layout, governance, naming, runtime language,
provider pairing — are recorded as ADRs in
[`docs/decisions/`](./docs/decisions/).

## Surfaces

| Directory | What it is | Status |
|-----------|------------|--------|
| [`spec/`](./spec/) | The Mosvera specification — schemas, MEPs, prose, conformance vectors. Long-term center of gravity. | Phases 1-5 |
| [`runtime/`](./runtime/) | Reference runtime (TypeScript first; Python committed). Parses, resolves, merges, composes, validates, compiles. | Phase 2 |
| [`mcp/`](./mcp/) | MCP server exposing the runtime's operations as standardized tools. | Phase 3 |
| [`providers/`](./providers/) | Provider adapters — OpenAI, FLUX, and SDXL via Replicate. | Phase 5 |
| [`examples/`](./examples/) | End-to-end aesthetic systems demonstrating composition + provider portability. | Phase 5 |
| [`docs/`](./docs/) | Narrative documentation, decision records, strategy. | Phase 0b ongoing |

## Doctrines

Mosvera operates under six [Primary Doctrines](./CLAUDE.md#primary-doctrines):

1. **Public-first** — built for strangers, not the author.
2. **Adoption-over-convenience** — every choice judged by external
   adoption.
3. **Spec-neutrality** — the spec is language-agnostic; no
   host-language idioms leak in.
4. **Comparable-class framing** — benchmark against OpenTelemetry,
   GraphQL, Terraform, Kubernetes.
5. **Research-first** — look up what already exists, cite sources,
   don't invent.
6. **Academic-grade documentation** — substantive docs carry precise
   terminology, explicit limits, and sources.

These doctrines are binding. They shape every decision recorded in
[`docs/decisions/`](./docs/decisions/).

## What this project isn't

Mosvera is infrastructure, not a product. It is:

- **Not** an image generator.
- **Not** a SaaS.
- **Not** a prompt manager.
- **Not** a creator-facing tool.
- **Not** a branding agency surface.
- **Not** a single-vendor workflow.

It is the substrate those things should be built on top of.

## Prior art

Mosvera is positioned with explicit awareness of adjacent work — the
[W3C Design Tokens Community Group](https://www.designtokens.org/),
[Style Dictionary](https://github.com/style-dictionary/style-dictionary),
[Carbon](https://carbondesignsystem.com/), and declarative-prompt
research like [DSPy](https://github.com/stanfordnlp/dspy) and
[BAML](https://github.com/BoundaryML/baml). The specific gap Mosvera
fills, and the reasoning for filling it, is documented in
[ADR-0006](./docs/decisions/0006-prior-art-survey.md). If the gap
turns out to be smaller than the spec claims, Mosvera should fold
into adjacent ecosystems rather than ship competing surface — per
Doctrine 2.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). The short version:

- MEPs go in [`spec/meps/`](./spec/meps/) for spec changes.
- ADRs go in [`docs/decisions/`](./docs/decisions/) for repo
  architecture.
- Pull requests for everything else, with `git commit -s` for the
  Developer Certificate of Origin.

Mosvera uses [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md).

## Packages

The public package set is prepared for npm publication under the
`@mosvera` scope:

```bash
npm install @mosvera/runtime
```

Packages emit JavaScript and declarations under `dist/` at publish time.
Until the external npm publish is complete, use this repository's workspaces
for local development.

## License

Dual-licensed per
[ADR-0001](./docs/decisions/0001-license-choice.md):

- **Code, schemas, in-tree adapters** — Apache-2.0
  ([`LICENSE`](./LICENSE), [`LICENSES/Apache-2.0.txt`](./LICENSES/Apache-2.0.txt)).
- **Documentation, specification prose, ADRs, RFCs, READMEs** —
  CC-BY-4.0 ([`LICENSES/CC-BY-4.0.txt`](./LICENSES/CC-BY-4.0.txt)).

Per-file SPDX headers identify which license applies. Mixed-content
follows the [REUSE](https://reuse.software/) convention.

## Acknowledgements

Mosvera takes structural inspiration from a small set of
comparable-class open standards: OpenTelemetry, GraphQL,
CloudEvents, OpenAPI, Terraform, Kubernetes. Where those projects
shipped patterns that solved problems Mosvera also faces, Mosvera
adopts the pattern and cites the source. The full inventory of
those choices lives in [`docs/decisions/`](./docs/decisions/).
