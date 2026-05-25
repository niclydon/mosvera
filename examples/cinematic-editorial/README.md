<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Cinematic Editorial

This gallery demonstrates the Phase 4 proof target: one resolved Mosvera
composition emitted deterministically to both OpenAI `gpt-image-1` and BFL
`flux-2-pro`.

The source composition lives at
[`spec/examples/cinematic-editorial/composition.json`](../../spec/examples/cinematic-editorial/composition.json).
It resolves to a lighthouse editorial still with warm three-point lighting,
merged named lights, high-contrast desaturated color grading, and an editorial
warm palette accent.

## Emitted Prompt

Both adapters emit the same prompt text:

```text
a lighthouse on a basalt cliff at dusk, cinematic style, warm lighting, three-point lighting setup, key light at power 6, fill light at power 5, rim light at power 2, very high contrast, desaturated saturation, warm tones, accent color (#c8943f)
```

## Provider Payloads

The deterministic payloads and provenance are checked in at
[`generated/metadata.json`](./generated/metadata.json).

OpenAI lowers `aspect_ratio` to `size: "1536x1024"`, keeps `quality: "high"`
native, and maps `safety: "standard"` to `moderation: "auto"`.

FLUX lowers the same `aspect_ratio` to `width: 1536` and `height: 1024`, maps
`safety: "standard"` to `safety_tolerance: 2`, and warns/drops `quality`
because `flux-2-pro` exposes no hosted quality control.

## Generated Images

The checked-in side-by-side image pair is:

- [`generated/openai.png`](./generated/openai.png) from OpenAI `gpt-image-1`
- [`generated/flux.png`](./generated/flux.png) from Replicate-hosted
  `black-forest-labs/flux-2-pro`

Regenerate them with:

```sh
OPENAI_API_KEY=... npm run execute:manual -w @mosvera/provider-openai
BFL_API_KEY=... npm run execute:manual -w @mosvera/provider-flux
# or, when using the Replicate-hosted FLUX.2 Pro model:
REPLICATE_API_TOKEN=... npm run execute:replicate -w @mosvera/provider-flux
```

Those scripts write provider outputs under each adapter's `test/output/`
directory. The checked-in gallery metadata records the exact payloads and
image metadata used for the side-by-side generation.
