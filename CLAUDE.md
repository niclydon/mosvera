# CLAUDE.md

Guidance for Claude and other coding agents working in this repository.

> **Naming status.** The project name is **Mosvera**, selected after a
> full brand-availability process (web search for commercial collisions +
> domains + GitHub org + npm scope + social handles, per Doctrines 5/6 —
> not just a domain DNS check, which was the methodology failure that
> sank the earlier "Tessera" name). Mosvera is clean across
> `.com`/`.io`/`.dev`/`.org`, the GitHub org, the npm scope, and Bluesky,
> with no commercial brand collision. The name is settled; the project
> remains in quiet incubation with public launch deferred to Phase 6. See
> [ADR-0009](./docs/decisions/0009-project-name-selection.md).

---

## Primary Doctrines

These six doctrines are the operating constitution for every action taken in
this repo. Read them before doing any work. When two paths exist and the
doctrines point to one, that one wins — even if the other is more convenient.

### 1. Public-first

Mosvera is built for strangers, not the author.

- No internal naming, no references to any author's personal platforms,
  systems, side projects, or in-jokes.
- README, MANIFESTO, schemas, RFCs, examples, and prose must read as if
  authored for a public open-standard repository.
- Examples should be ones a stranger would recognize, not ones drawn from any
  contributor's private context.
- Documentation conventions follow open-source norms (CHANGELOG, ADRs, RFCs,
  releases) — not personal documentation patterns.

### 2. Adoption-over-convenience

Every decision is judged by external adoption of an open standard, not by
what's familiar or already on hand.

- Never default to a tool, framework, language, or pattern because it's the
  one a contributor already uses.
- "We already have this set up" is not a reason. "This is what comparable open
  standards do" is.
- If two paths exist, prefer the one that maximizes the chance an unrelated
  developer or organization picks Mosvera up — even when it requires more work.

### 3. Spec-neutrality

The specification is language-agnostic.

- JSON Schema and RFCs must read identically to a TypeScript dev, a Python
  dev, a Rust dev, or a Go dev.
- No host-language idioms in spec definitions. Picking conventions per
  artifact (snake_case vs camelCase vs kebab-case) requires technical
  justification documented in an ADR.
- Provider-specific prompt hacks, parameters, or assets never leak into core
  spec definitions. They live exclusively in provider adapters and trace back
  to the canonical Mosvera representation.

### 4. Comparable-class framing

When uncertain, ask: "What would OpenTelemetry, GraphQL, Terraform, or
Kubernetes do here?"

- Every structural decision (repo layout, license, governance, RFC format,
  contribution flow, release cadence) is benchmarked against established open
  standards rather than invented from scratch.
- These are analogies for ecosystem posture, not APIs to copy directly. Lift
  the patterns; don't lift the surface.

### 5. Research-first

The default position on any design, architecture, or systems decision is to
**look up what already exists** before proposing or coding.

- Web research on standards, conventions, and what comparable projects have
  done is the starting move, not the fallback.
- Do not invent answers from first principles when established practice
  exists. Do not pretend to be a domain expert when domain literature is
  available.
- Cite sources in the decision record (ADR). Minimum three sources per
  research-grounded decision.
- This applies especially to choices that already feel "obvious."
  Comfortable assumptions are exactly the ones most worth verifying.

### 6. Academic-grade documentation

All substantive Mosvera documentation — specification prose, MANIFESTO,
guides, MEPs, ADRs, glossary entries, READMEs that introduce concepts,
and any longform — meets an academic-rigor bar. Documentation is not a
wrapper around the work; it is part of the work.

- **Inline citations.** Non-obvious claims cite their sources where the
  claim is made, not just in a trailing bibliography. Where multiple
  sources are relevant, all are cited. Sources are authoritative:
  standards documents, peer-reviewed literature, comparable
  open-standard projects' own publications, primary technical
  documentation.
- **Term precision.** Every introduced term has a precise definition —
  either inline at first use, or by reference to the
  [Glossary](./GLOSSARY.md). Marketing-tone vocabulary that lacks a
  defined meaning is not used.
- **Explicit limitations.** Every substantive claim states its
  boundaries. If a claim holds only under certain conditions, the
  conditions are named. If a claim is unverified, that is said.
  Unfalsifiable claims are restated falsifiably or removed.
- **Engaged counter-positions.** Where the project takes a position
  against an alternative (snake_case over camelCase, BDFL over premature
  TSC, OpenAI+FLUX over alternative provider pairings), the alternative
  is fairly represented, not strawmanned.
- **Normative vs informative language.** Specification prose uses
  [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) keywords
  (MUST, SHOULD, MAY) to mark normative requirements. Informative
  commentary is clearly distinguished from normative text.
- **Document metadata.** Substantive documents carry date, version, and
  stable identifiers where applicable, so external work can cite
  Mosvera precisely.
- **Sources section.** Every substantive document ends with a Sources
  or References section enumerating every cited work, even when sources
  are already inlined in the body.

This doctrine raises the cost of producing documentation. That cost is
intentional: the project is staking a claim to define a missing
infrastructure layer, and the documentation that surrounds the claim is
part of the credibility surface. Documentation that does not meet this
bar will be revised or rejected at review.

Doctrine 6 binds going forward. It does not retroactively invalidate
existing documentation, but documentation **updated** after this
doctrine lands must meet the bar; new documents must meet it on first
authoring.

---

## Project Identity

Mosvera is an open aesthetic infrastructure standard and runtime.

Treat it as a declarative infrastructure layer for aesthetic intent in
AI-native systems. Do not collapse it into a startup app, SaaS product, image
generator, prompt manager, brand tool, or design surface unless an explicit
product layer is being requested.

Preferred framing:

- Declarative runtime for aesthetic intent
- Aesthetic Infrastructure for AI-native systems
- Provider-agnostic aesthetic orchestration
- Reusable multimodal identity systems
- Runtime composition for aesthetic primitives

Avoid framing Mosvera as:

- AI image tooling
- Prompt engineering
- Branding software
- Creator SaaS
- A single-provider workflow

## Strategic Source

Before making architecture, positioning, or repo-structure decisions, read:

```text
docs/strategy/strategic-plan.md
docs/ROADMAP.md
```

These documents are the current strategic and tactical source of truth for
incubation, eventual repository split, namespace strategy, and ecosystem
positioning. ADRs under `docs/decisions/` record the research-grounded
choices behind every structural decision in the repo.

## Incubation Posture

Assume Mosvera is in quiet incubation unless explicitly told otherwise.

The goal is to discover the abstraction correctly before public exposure
freezes weak concepts too early. Do not add launch copy, marketing pages,
public-roadmap claims, or hype-oriented positioning by default.

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

While this repository is still early, it incubates those surfaces in one
place. Structure here uses names that can later split cleanly:

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

Keep definitions provider-neutral. Aesthetic intent should be modeled before
it is compiled into provider-specific prompts, parameters, or assets.

## Runtime Principles

The runtime should be a substrate, not an app shell.

Expected responsibilities:

- Parse schemas
- Resolve inheritance
- Merge modifiers
- Compose primitives
- Validate structures
- Compile provider outputs

Runtime behavior should be explicit, testable, and documented near the
relevant schemas or modules.

## MCP Principles

Treat the MCP surface as first-class infrastructure for AI-native
orchestration.

Likely capabilities include:

```text
list_templates()
resolve_composition()
compile_generation()
get_palette()
validate_schema()
```

Prefer small, composable tools with strict schemas and clear errors over
broad do-everything calls.

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

Do not bake provider-specific prompt hacks into the core semantic model.
Keep adapter mappings traceable back to the canonical Mosvera representation.

## Examples

Examples are critical because people understand infrastructure through
concrete use.

Good examples include:

- Cinematic editorial systems
- Claymation builder systems
- Documentary realism
- Dashboard minimalism
- Multimodal presentation systems
- Motion systems

Examples should demonstrate reusable aesthetic primitives, provider
portability, and runtime composition rather than one-off prompt snippets.

## Engineering Expectations

- Prefer small, composable primitives.
- Keep semantics explicit and documented.
- Add tests around inheritance, merge, validation, and compilation behavior
  once code exists.
- Keep public-facing language separate from incubation notes.
- Preserve provider agnosticism unless working inside a provider adapter.
- Avoid premature UI, SaaS, or product assumptions.
- Favor durable contracts over clever demos.

## Documentation Conventions

Write with infrastructure clarity. The project is trying to define a missing
layer, not merely explain a tool.

Useful comparison classes:

- OpenTelemetry
- GraphQL
- Terraform
- Kubernetes

These are analogies for ecosystem posture, not APIs to copy directly.

Documentation formats follow open-source norms:

- `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/) format is
  the chronological change record.
- `docs/decisions/` holds Architecture Decision Records (ADRs) for every
  structural choice. Each ADR cites at least three sources per Doctrine 5.
- `spec/rfcs/` holds specification RFCs (format determined by ADR).
- `docs/ROADMAP.md` is the public-facing phased roadmap.

Personal narrative-style documentation patterns are explicitly out of scope
for the public-facing repo per Doctrine 1.

### Private working layer (gitignored)

Contributors may keep a private working layer for their own continuity and
tooling integrations:

```text
.local/
.local/docs/
.local/docs/narrative/
```

The `.local/` tree is gitignored and never reaches the public remote. It is
a safe place for:

- Per-contributor narrative documentation (e.g., long-form documentary-style
  writeups used by personal tooling).
- Scratch notes, exploration logs, or private context that would violate
  Doctrine 1 if committed.
- Local-only integrations with private knowledge systems.

Nothing in `.local/` is authoritative. The canonical record remains the
committed `CHANGELOG.md`, ADRs, RFCs, and ROADMAP. If a finding from a
private narrative doc matters to the project, it gets restated in
public-first voice and committed to the appropriate canonical location.
