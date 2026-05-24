<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# providers/

Reference provider adapters for Mosvera. Each adapter implements
the provider compilation contract — translating Mosvera's canonical
composition model into a specific generative provider's API
payload — without leaking provider vocabulary back into the
specification.

## Phase 4 reference set

Phase 4 ships two adapters per
[ADR-0008](../docs/decisions/0008-provider-adapter-pairing.md), chosen
to demonstrate the abstraction is real by spanning genuinely
different execution surfaces:

| Adapter | Provider | Surface signal |
|---------|----------|----------------|
| `openai/` | OpenAI `gpt-image-1` | Sync POST, enum-coded `quality`, server-side moderation, `output_format` + `output_compression`. |
| `flux/` | Black Forest Labs `flux-2-pro` (hosted BFL API) | Async polling URL, numeric `steps` + `guidance`, `safety_tolerance` numeric, `input_image` for editing. |

The compiler contract handles the divergence axes both providers
surface: sync vs async transport, enum vs numeric quality,
divergent moderation models, different image-input semantics. This
is the abstraction stress test.

Both adapters sit on top of each provider's official SDK to inherit
error semantics and retry behavior.

## Phase 5 community adapter

`sdxl/` — Stable Diffusion XL via [Replicate](https://replicate.com)
lands in Phase 5 per ADR-0008, introducing the open-weights /
community-aggregator axis.

## Phase 8 motion adapter

`runway/` — Runway Gen-4 lands in Phase 8 alongside Mosvera's
introduction of motion / temporal primitives.

## Exclusion policy

Per ADR-0008, **Mosvera does not accept provider adapters that rely
on unofficial or reverse-engineered APIs.** This rules out
third-party Midjourney integrations until and unless a broadly
available official Midjourney API ships. Adapter PRs against
unofficial endpoints will be closed.

## Adding a provider

When the maintainer pool is open to provider contributions (Phase 4
onward), the path is:

1. File a MEP if the existing compilation contract doesn't cover
   the provider's surface cleanly.
2. Implement against the shared contract in `_base/`.
3. Add a self-contained directory under `providers/<provider-name>/`
   with its own README, the adapter implementation, tests, and an
   example composition that compiles successfully.

## Status

Phase 0b. Scaffold only. Adapters land in Phase 4 per
[`ROADMAP.md`](../ROADMAP.md#phase-4--provider-adapters-multi-provider-proof).

## Layout

| Directory | Purpose |
|-----------|---------|
| `_base/` (future) | Shared adapter contract — a TypeScript interface derived from the provider compilation MEP. |
| `<provider-name>/` | Each adapter is self-contained: implementation, tests, examples, provider-specific README. |

## License

Apache-2.0 per
[ADR-0001](../docs/decisions/0001-license-choice.md).

## Eventual repo split

The reference adapter set is expected to stay in tree alongside the
runtime in the early ecosystem. The long tail of community
adapters will eventually move to a sibling
`github.com/mosvera/providers-contrib` repository, matching the
OpenTelemetry core/contrib pattern referenced in
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
