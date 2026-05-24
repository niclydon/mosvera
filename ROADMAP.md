<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Tessera Roadmap

Phased plan for Tessera's incubation through first public release.
This roadmap is the living revision of the project plan first written
during Phase 0 and updated against the research-grounded decisions
recorded in [`docs/decisions/`](./docs/decisions/).

For the strategic framing this plan implements, see
[`docs/strategy/strategic-plan.md`](./docs/strategy/strategic-plan.md).
For the project's operating doctrines, see
[`CLAUDE.md`](./CLAUDE.md#primary-doctrines).

## Status

Currently in **Phase 0b — Foundation deliverables**. Private incubation,
no public claims.

## Phases

### Phase 0a — Doctrine and Research (complete)

Locked the operating constitution and produced the research-grounded
decisions that gate every structural choice.

Outputs:
- `CLAUDE.md` with the five Primary Doctrines at the top
- Eight ADRs in `docs/decisions/` (0001–0008)
- Gitignored private working layer under `.local/`

### Phase 0b — Foundation deliverables (in progress)

Scaffolding the repository per [ADR-0002](./docs/decisions/0002-top-level-repository-layout.md)
and standing up the governance, license, and contribution surface per
[ADR-0001](./docs/decisions/0001-license-choice.md) and
[ADR-0004](./docs/decisions/0004-governance.md).

Outputs:
- `MANIFESTO.md`, `ROADMAP.md`, `GLOSSARY.md`, `README.md` at root
- `LICENSE` (Apache-2.0) + `LICENSES/` dual-license texts (Apache-2.0,
  CC-BY-4.0) per REUSE convention
- `CONTRIBUTING.md`, `GOVERNANCE.md`, `MAINTAINERS.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`
- Scaffold directories with stub READMEs: `spec/`, `runtime/`, `mcp/`,
  `providers/`, `examples/`, `docs/`
- `spec/teps/` with the TEP template and process README per
  [ADR-0003](./docs/decisions/0003-rfc-and-proposal-format.md)

### Phase 1 — Specification Genesis

The specification is Tessera's long-term center of gravity. Phase 1
defines the primitives, the inheritance and composition semantics,
and the provider compilation contract — before any reference runtime
locks behavior.

Outputs in `spec/`:
- `spec/specification/draft/` — prose specification, language-agnostic
  per [Doctrine 3](./CLAUDE.md#3-spec-neutrality)
- `spec/schemas/` — first JSON Schemas, snake_case wire format per
  [ADR-0005](./docs/decisions/0005-schema-naming-conventions.md):
  - `aesthetic-template.schema.json`
  - `palette.schema.json`
  - `modifier.schema.json`
  - `composition.schema.json`
- `spec/teps/` — initial TEPs covering composition semantics,
  inheritance rules, and the provider compilation contract
- `spec/compliance/` — conformance test vectors in JSON, runnable
  against any conforming runtime (foundation for the cross-language
  portability requirement in [ADR-0007](./docs/decisions/0007-reference-runtime-language.md))
- `spec/examples/` — one worked aesthetic system expressed entirely
  in schema form, with no runtime dependency

Specification must validate against itself (meta-schema check). DTCG
compatibility at color-token export boundary is a target, per
[ADR-0006](./docs/decisions/0006-prior-art-survey.md).

### Phase 2 — Reference Runtime (TypeScript)

Smallest runtime that exercises the Phase 1 spec end-to-end: parse,
resolve inheritance, merge modifiers, compose primitives, validate
structures. No providers yet.

Outputs in `runtime/`:
- `runtime/src/parser` — load and validate spec documents
- `runtime/src/resolver` — walk inheritance chains, detect cycles
- `runtime/src/merger` — modifier merge semantics per TEP
- `runtime/src/composer` — produce a canonical composition object
- `runtime/src/validator` — runtime-level structural validation
- Test coverage on inheritance, merge, cycle detection, validation
- Implementation passes the Phase 1 conformance suite

Architectural constraint from [ADR-0007](./docs/decisions/0007-reference-runtime-language.md):
semantic logic stays as pure functions, separable from TS-idiomatic
glue, so the Python port is a translation rather than a rewrite. No
clever TS-only patterns in the semantic core.

### Phase 3 — MCP Surface

Expose Phase 2 runtime capabilities as a strict MCP server. Aligns
Tessera with AI-native orchestration from day one.

Outputs in `mcp/`:
- `mcp/src/server` — MCP server skeleton (TS SDK), shares types with
  `runtime/`
- Tool surface, each with strict JSON schemas and clear errors:
  - `list_templates`
  - `resolve_composition`
  - `compile_generation`
  - `get_palette`
  - `validate_schema`
- stdio transport first; HTTP/SSE deferred until external integrators
  ask
- `mcp/examples/` — sample client calls demonstrating each tool

### Phase 4 — Provider Adapters (multi-provider proof)

Two adapters from the start to prove the abstraction is real. Same
composition object → two genuinely different execution surfaces.
Specifies the pairing locked in
[ADR-0008](./docs/decisions/0008-provider-adapter-pairing.md).

Outputs in `providers/`:
- `providers/_base/` — shared adapter contract derived from the
  provider compilation TEP
- `providers/openai/` — `gpt-image-1` adapter (sync POST, enum-coded
  quality, server-side moderation)
- `providers/flux/` — `flux-2-pro` adapter via the BFL hosted API
  (async polling, numeric `steps`+`guidance`, `safety_tolerance`
  numeric)
- Compiler contract handles the divergence axes the two providers
  surface: sync vs async transport, enum vs numeric quality, divergent
  moderation models, different image-input semantics
- Each adapter sits on top of the provider's official SDK to inherit
  error semantics and retry behavior

### Phase 5 — Examples + Open-weights Adapter

Adoption happens through worked examples. Each example must
demonstrate composition + portability across both Phase 4 adapters.
Adds the open-weights axis via SDXL.

Outputs in `examples/` and `providers/`:
- `examples/cinematic-editorial/`
- `examples/dashboard-minimalism/`
- `examples/documentary-realism/`
- Each example: a Tessera composition file, a README explaining the
  aesthetic intent, and rendered outputs from at least two providers
  showing the abstraction holds
- `providers/sdxl/` — SDXL via Replicate, the first community
  adapter (per ADR-0008 staging)

### Phase 6 — Public Unlock (gated, not scheduled)

Triggered when Phases 1–5 feel durable, not on a date. The strategic
plan's Phase 2/3 sequence.

Outputs:
- Namespace acquisition (`tessera` GitHub org, `tessera.dev`,
  `tessera.ai`)
- Manifesto publication on a separate public surface ("Infrastructure-
  as-Style")
- Transfer this repo (or split) into `github.com/tessera/spec` first
  as the public flagship
- `runtime`, `mcp`, `providers`, `examples` follow as separate repos
  per the eventual split signaled in ADR-0002
- Open TEP process — `spec/teps/` becomes externally contributable
- Governance transition: BDFL → small Technical Committee per
  [ADR-0004](./docs/decisions/0004-governance.md)
- Foundation evaluation begins (CNCF / Linux Foundation / Joint
  Development Foundation candidates), gated on having at least one
  external provider implementation in production

### Phase 7 — Python Runtime Port

[ADR-0007](./docs/decisions/0007-reference-runtime-language.md)
commits to a Python runtime port no later than the second minor
release after 1.0. The conformance suite from Phase 1 is the
correctness contract; the Python implementation passes it before the
port is published.

### Phase 8 — Motion Surface and Runway Adapter

Tessera introduces motion/temporal primitives and adds the Runway
adapter per ADR-0008's deferral. Same composition compiles to image
providers (Phase 4) and video providers (Phase 8) — the strongest
demonstration of the abstraction's reach.

## What this roadmap does not promise

Per [Doctrine 1](./CLAUDE.md#1-public-first), no aspirational
marketing. The roadmap states what's planned, not what's claimed.

- No timeline commitments. Phases ship when their criteria are met.
- No multi-language SDKs claimed before they exist. The Python port
  in Phase 7 is committed-to, but it is not in the README until it
  ships.
- No foundation hosting claimed before it is signed.
- No provider adapters claimed beyond OpenAI + FLUX until they ship.

## Living document

This roadmap is revised in place as decisions evolve. The chronological
record of changes lives in [`CHANGELOG.md`](./CHANGELOG.md). The full
research-grounded decision history lives in
[`docs/decisions/`](./docs/decisions/).
