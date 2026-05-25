<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# providers/

Reference provider adapters for Mosvera. Each adapter implements the provider
compilation contract: translate Mosvera's canonical composition model into a
specific generative provider payload without leaking provider vocabulary back
into the specification.

The Phase 4 architecture is recorded in
[ADR-0012](../docs/decisions/0012-adapter-emission-architecture.md). The
provider pairing is recorded in
[ADR-0008](../docs/decisions/0008-provider-adapter-pairing.md).

## Phase 4 Reference Set

| Package | Provider | Surface signal |
|---------|----------|----------------|
| [`_base/`](./_base/) | Shared contract | Adapter interface, lowering table schema, pure clause assembly, `BaseAdapter`. |
| [`openai/`](./openai/) | OpenAI `gpt-image-1` | Sync SDK call, enum-coded `quality`, `moderation`, `size` enum. |
| [`flux/`](./flux/) | BFL `flux-2-pro` | Async polling URL, computed `width` / `height`, `safety_tolerance`; `quality` is unsupported on hosted `pro`. |

The deterministic boundary is `emit()`: same canonical composition, adapter,
and manifest produce byte-identical payloads. `execute()` is the
non-deterministic provider network boundary.

## Testing

From the repository root:

```sh
npm test --workspaces
npm run test:providers
```

Workspace tests cover the shared assembler and both adapter emission
snapshots. `providers/test/` covers cross-adapter structural equivalence and
the language-neutral vectors in `spec/compliance/emission/`.

## Phase 5 Community Adapter

`sdxl/` — Stable Diffusion XL via [Replicate](https://replicate.com) lands in
Phase 5 per ADR-0008, introducing the open-weights / community-aggregator
axis.

## Phase 8 Motion Adapter

`runway/` — Runway Gen-4 lands in Phase 8 alongside Mosvera's introduction of
motion / temporal primitives.

## Exclusion Policy

Per ADR-0008, **Mosvera does not accept provider adapters that rely on
unofficial or reverse-engineered APIs.** This rules out third-party Midjourney
integrations until and unless a broadly available official Midjourney API
ships. Adapter PRs against unofficial endpoints will be closed.

## Adding A Provider

When the maintainer pool is open to provider contributions, the path is:

1. File a MEP if the existing compilation contract does not cover the
   provider's surface cleanly.
2. Implement against the shared contract in `_base/`.
3. Add a self-contained directory under `providers/<provider-name>/` with its
   own README, adapter implementation, tests, and example composition.

## Layout

| Directory | Purpose |
|-----------|---------|
| `_base/` | Shared adapter contract and emission engine. |
| `openai/` | OpenAI `gpt-image-1` adapter, tests, and manual execution script. |
| `flux/` | BFL `flux-2-pro` adapter, tests, and manual execution script. |
| `test/` | Cross-adapter and emission-vector tests. |

## License

Apache-2.0 per [ADR-0001](../docs/decisions/0001-license-choice.md).

## Eventual Repo Split

The reference adapter set is expected to stay in tree alongside the runtime in
the early ecosystem. The long tail of community adapters will eventually move
to a sibling `github.com/mosvera/providers-contrib` repository, matching the
OpenTelemetry core/contrib pattern referenced in
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
