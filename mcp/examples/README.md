<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# MCP Tool Example Transcripts

One sample JSON-RPC `tools/call` request and its expected response for each
of the five Mosvera MCP tools, run against the default
[`cinematic-editorial`](../../spec/examples/cinematic-editorial/) registry.

All responses are the direct JSON output of the tool handler; the MCP SDK
wraps them in `{ "content": [{ "type": "text", "text": "<json>" }] }` over
the wire.

---

## `list_templates`

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_templates",
    "arguments": {}
  }
}
```

**Response**

```json
[
  { "name": "cinematic-editorial-base" },
  { "name": "noir", "extends": "cinematic-editorial-base" }
]
```

`cinematic-editorial-base` has no parent. `noir` extends it via
`$extends: "cinematic-editorial-base"`.

---

## `get_palette`

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_palette",
    "arguments": {
      "name": "editorial-warm"
    }
  }
}
```

**Response**

```json
{
  "palette": {
    "$schema": "https://mosvera.dev/schema/0.1/palette",
    "id": "editorial-warm",
    "roles": {
      "background": "#1a1410",
      "foreground": "#f5e6d3",
      "accent": "#c8943f",
      "shadow": "#0a0805"
    }
  }
}
```

`editorial-warm` declares no `$extends`, so `inheritance_unresolved` is
absent.

---

## `validate_schema`

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "validate_schema",
    "arguments": {
      "document": {
        "$schema": "https://mosvera.dev/schema/0.1/template",
        "id": "t",
        "medium": "photographic"
      },
      "kind": "template"
    }
  }
}
```

**Response**

```json
{ "valid": true, "errors": [] }
```

A validation failure returns `{ "valid": false, "errors": [...] }` — still a
successful call result, not an error.

---

## `resolve_composition`

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "resolve_composition",
    "arguments": {
      "composition": {
        "base": "noir",
        "modifiers": ["golden-hour", "high-contrast"],
        "overrides": { "medium": "cinematic" }
      }
    }
  }
}
```

**Response**

```json
{
  "canonical": {
    "medium": "cinematic",
    "lighting": {
      "scheme": "three_point",
      "mood": "warm"
    },
    "lights": [
      { "name": "key", "power": 6 },
      { "name": "fill", "power": 5 },
      { "name": "rim", "power": 2 }
    ],
    "color_grade": {
      "contrast": "very_high",
      "saturation": "desaturated"
    },
    "color_temperature": "warm"
  }
}
```

Precedence chain (lowest to highest):

1. `cinematic-editorial-base` (resolved via `noir`'s `$extends` lineage)
2. `noir`
3. `golden-hour` modifier
4. `high-contrast` modifier
5. `overrides` block — `medium: "cinematic"` replaces the template's
   `"photographic"` value at the highest precedence tier.

`lights` is merged by the `name` key (declared in
[`merge-strategies.json`](../../spec/examples/cinematic-editorial/merge-strategies.json)),
so the `rim` light added by `golden-hour` is appended rather than replacing
the whole list.

---

## `compile_generation`

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "compile_generation",
    "arguments": {
      "composition": {
        "base": "noir",
        "modifiers": ["golden-hour", "high-contrast"],
        "overrides": { "medium": "cinematic" }
      },
      "provider": "illustrative-image"
    }
  }
}
```

**Response**

```json
{
  "status": "compiled",
  "warnings": [
    { "construct": "color_grade",     "action": "approximate" },
    { "construct": "color_temperature", "action": "unsupported" },
    { "construct": "lighting",        "action": "approximate" },
    { "construct": "lights",          "action": "emulate" }
  ],
  "canonical": {
    "medium": "cinematic",
    "lighting": {
      "scheme": "three_point",
      "mood": "warm"
    },
    "lights": [
      { "name": "key", "power": 6 },
      { "name": "fill", "power": 5 },
      { "name": "rim", "power": 2 }
    ],
    "color_grade": {
      "contrast": "very_high",
      "saturation": "desaturated"
    },
    "color_temperature": "warm"
  }
}
```

`canonical` is identical to the `resolve_composition` output above; this is
by design — `compile_generation` resolves first, then applies the compilation
contract.

**Why `color_temperature` warns `unsupported`:** the
`illustrative-image.manifest.json` does not declare a `color_temperature`
construct; the canonical model contains the field but the provider cannot
fulfill it. Because `color_temperature` was not passed as `required` in
`criticality`, the call compiles with a warning rather than returning
`status: "error"`.

**Phase-3 boundary:** no provider HTTP call was made. The `status: "compiled"`
result contains the MEP-0003 contract decision (lowering actions, warnings)
and the canonical model. Real provider payload emission arrives in Phase 4.

The `illustrative-image` provider is an **illustrative** capability manifest
included solely to exercise the compilation contract end-to-end. It is not a
real provider adapter. Real adapters (OpenAI gpt-image-1, FLUX.2) arrive in
Phase 4 per [ADR-0008](../../docs/decisions/0008-provider-adapter-pairing.md).
