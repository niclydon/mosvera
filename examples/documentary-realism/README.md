<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# Documentary Realism Gallery

Source system:
[`spec/examples/documentary-realism/`](../../spec/examples/documentary-realism/)

This example targets observational photographic imagery: natural light, low
overcast contrast, natural saturation, and a concrete documentary subject. The
Phase 5 gallery renders that intent through all three reference image adapters.

## Generated Images

- [`generated/openai.png`](./generated/openai.png) from OpenAI `gpt-image-1`
- [`generated/flux.png`](./generated/flux.png) from Replicate-hosted
  `black-forest-labs/flux-2-pro`
- [`generated/sdxl.png`](./generated/sdxl.png) from Replicate-hosted SDXL

The exact deterministic payloads, warnings, image dimensions, and byte counts
are recorded in [`generated/metadata.json`](./generated/metadata.json).
