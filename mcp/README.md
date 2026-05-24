<!--
SPDX-License-Identifier: CC-BY-4.0
-->

# mcp/

The Tessera Model Context Protocol (MCP) server. Exposes the
[runtime](../runtime/)'s capabilities as standardized MCP tools so
AI-native systems — agents, copilots, editors, automated content
pipelines — can resolve and compile aesthetic compositions without
re-implementing the runtime.

## Tools

| Tool | Purpose |
|------|---------|
| `list_templates` | Enumerate available templates with descriptions and metadata. |
| `resolve_composition` | Walk inheritance, merge modifiers, return the canonical model for a composition. |
| `compile_generation` | Compile a canonical model to a provider-specific payload via the named provider adapter. |
| `get_palette` | Resolve a palette by name, returning its semantic roles and color values. |
| `validate_schema` | Validate a Tessera document against the published schemas; return structured errors. |

Each tool ships with a strict JSON schema for inputs and outputs
and well-defined error responses. No do-everything calls — small,
composable, strict.

## Transport

stdio first, per the MCP convention for editor and agent
integrations. HTTP/SSE deferred until external integrators ask for
it.

## Status

Phase 0b. Scaffold only. The MCP server lands in Phase 3 per
[`ROADMAP.md`](../ROADMAP.md#phase-3--mcp-surface) once the
runtime (Phase 2) and its tool surface are stable.

## Layout

| Directory | Purpose |
|-----------|---------|
| `src/` | MCP server source. Shares types with `../runtime/`. |
| `tests/` | Tool conformance and protocol tests. |
| `examples/` | Sample MCP client calls demonstrating each tool. |

## License

Apache-2.0 per
[ADR-0001](../docs/decisions/0001-license-choice.md).

## Eventual repo split

This directory is the seed of a future standalone repository at
`github.com/tessera/mcp` per
[ADR-0002](../docs/decisions/0002-top-level-repository-layout.md).
