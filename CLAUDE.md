# CLAUDE.md

Guidance for Claude and other coding agents working in this repository.

## Project Identity

Tessera is an open aesthetic infrastructure standard and runtime.

Treat it as a declarative infrastructure layer for aesthetic intent in AI-native
systems. Do not collapse it into a startup app, SaaS product, image generator,
prompt manager, brand tool, or design surface unless the user explicitly asks for
that product layer.

Preferred framing:

- Declarative runtime for aesthetic intent
- Aesthetic Infrastructure for AI-native systems
- Provider-agnostic aesthetic orchestration
- Reusable multimodal identity systems
- Runtime composition for aesthetic primitives

Avoid framing Tessera as:

- AI image tooling
- Prompt engineering
- Branding software
- Creator SaaS
- A single-provider workflow

## Strategic Source

Before making architecture, positioning, or repo-structure decisions, read:

```text
tessera-strategic-open-source-ecosystem-plan.md
```

That plan is the current strategic source of truth for incubation, eventual
repository split, namespace strategy, and ecosystem positioning.

## Incubation Posture

Assume Tessera is in quiet incubation unless the user says otherwise.

The goal is to discover the abstraction correctly before public exposure freezes
weak concepts too early. Do not add launch copy, marketing pages, public-roadmap
claims, or hype-oriented positioning by default.

Work should prioritize:

- Schemas
- Semantic models
- Inheritance behavior
- Composition semantics
- Runtime validation
- Provider compilation contracts
- MCP interfaces
- Concrete examples that clarify the abstraction

## Expected Architecture

The strategic end state is a small ecosystem of focused repositories:

```text
/spec
/runtime
/mcp
/providers
/examples
```

While this repository is still early, it may incubate those surfaces in one
place. If adding structure here, prefer names that can later split cleanly:

```text
spec/
runtime/
mcp/
providers/
examples/
docs/
```

## Spec Principles

The specification is the long-term center of gravity.

Spec work should define:

- Schemas
- RFCs
- Semantic definitions
- Runtime semantics
- Inheritance rules
- Provider interoperability contracts
- Composition behavior
- Glossary terms

Keep definitions provider-neutral. Aesthetic intent should be modeled before it
is compiled into provider-specific prompts, parameters, or assets.

## Runtime Principles

The runtime should be a substrate, not an app shell.

Expected responsibilities:

- Parse schemas
- Resolve inheritance
- Merge modifiers
- Compose primitives
- Validate structures
- Compile provider outputs

Runtime behavior should be explicit, testable, and documented near the relevant
schemas or modules.

## MCP Principles

Treat the MCP surface as first-class infrastructure for AI-native orchestration.

Likely capabilities include:

```text
list_templates()
resolve_composition()
compile_generation()
get_palette()
validate_schema()
```

Prefer small, composable tools with strict schemas and clear errors over broad
do-everything calls.

## Provider Principles

Provider adapters should preserve the same canonical aesthetic intent across
different execution systems.

Potential provider lanes include:

```text
providers/openai
providers/flux
providers/sdxl
providers/kling
providers/runway
```

Do not bake provider-specific prompt hacks into the core semantic model. Keep
adapter mappings traceable back to the canonical Tessera representation.

## Examples

Examples are critical because people understand infrastructure through concrete
use.

Good examples include:

- Cinematic editorial systems
- Claymation builder systems
- Documentary realism
- Dashboard minimalism
- Multimodal presentation systems
- Motion systems

Examples should demonstrate reusable aesthetic primitives, provider portability,
and runtime composition rather than one-off prompt snippets.

## Engineering Expectations

- Prefer small, composable primitives.
- Keep semantics explicit and documented.
- Add tests around inheritance, merge, validation, and compilation behavior once
  code exists.
- Keep public-facing language separate from incubation notes.
- Preserve provider agnosticism unless working inside a provider adapter.
- Avoid premature UI, SaaS, or product assumptions.
- Favor durable contracts over clever demos.

## Documentation Tone

Write with infrastructure clarity. The project is trying to define a missing
layer, not merely explain a tool.

Useful comparison classes:

- OpenTelemetry
- GraphQL
- Terraform
- Kubernetes

These are analogies for ecosystem posture, not APIs to copy directly.
