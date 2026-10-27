# The public face, and the 0.1.3 / 0.1.10 release train

For most of October 2026 the Mosvera repositories presented a public face that
had quietly fallen behind the code: a registry-loader fix had sat unpublished
for six weeks, the MCP server in production was silently missing one of its
provider adapters, one repository's README described a job it no longer did,
and none of the split repositories had dependency automation or code scanning.
Between October 20 and October 27 the family was inventoried, cleaned,
released, and put on rails: three packages published, twenty-six update
proposals disposed of, scanning enabled everywhere it can run, and every
repository left at zero open pull requests and zero open security alerts.

This narrative is the family-level record. The MCP server's own release has a
companion narrative in the `mosvera/mcp` repository
(`docs/narrative/2026-10-27-mcp-0-1-10-adapter-diagnostics-and-zod-4.md`).

## The state found (October 20, 2026)

A read-only upgrades scan covered all eleven repositories in the family: the
combined `niclydon/mosvera` repo, the seven `mosvera` org repos (`spec`,
`runtime`, `mcp`, `providers`, `python`, `examples`, `mosvera.io`), and three
supporting repos (`mosvera-registry`, `mosvera-web`, `mosvera-github-profile`).

What was healthy:

- Zero open Dependabot alerts across all eleven repos.
- All eight schema `$id` URLs under `mosvera.io/schema/0.1` resolving with
  HTTP 200.
- Every provider package published; CI green on every repo that had it.

What was not:

- Local checkouts had drifted: several were behind their remotes, and one
  service directory held an unused duplicate checkout of the MCP server.
- The TypeScript runtime carried the OB-59048 registry-loader fix on `main`
  since September 7, 2026, but the published package was still 0.1.2. The
  Python port of the same loader did not have the fix at all (see the release
  train below).
- The deployed MCP server was missing its HeyGen adapter
  (`heygen-avatar-video`). The cause turned out to be a stale `node_modules`
  in the deployment, not a packaging defect: a clean install restored it.
  Nothing had logged the absence, which is what made it worth a code change
  rather than just a reinstall.
- `mosvera-web`'s README still claimed the repo served the mosvera.io
  coming-soon placeholder. The live site had been built from
  `mosvera/mosvera.io` for some time; `mosvera-web`'s actual role is the brand
  layer (mark, lockups, tokens) compiled from `mosvera-registry`.
- Outside the combined repo, no repository had a Dependabot configuration,
  and none of the split repos ran CodeQL scanning.

## The structure decision: signpost, not archive

The combined repo raised the first question. The project had split into the
org repos, and `mosvera.io` already linked only to the org repos, npm, and
PyPI, never to the combined repo. Three options were considered:

- Archive the combined repo. Rejected: it holds the pre-split history and the
  design record (ADRs, RFCs), and archiving reads as abandonment to a visitor
  who lands there from an old link.
- Leave it as it was. Rejected: its README described the combined repo as the
  project home, which was no longer true, and a stale front door is worse than
  a closed one.
- Keep it open as a labeled signpost. Chosen. The README now states plainly
  that the project lives at mosvera.io and in the org repos, points to each of
  them and to the npm and PyPI packages, and describes the combined repo as a
  historical snapshot (PR #12, commit `4b76f63`, October 20, 2026). The repo
  description was updated to match.

## The release train (October 20-21, 2026)

Three packages needed to move, in dependency order.

### Python parity fix first

OB-59048 was a loader defect: a registry document whose file name matched its
kind pattern (`<kind>.mosvera.json`) could be skipped during load, silently
dropping a palette or aesthetic from the registry. The TypeScript loader had
been fixed in September; the Python loader had not. `mosvera/python` PR #1
(commit `e7505ec`) ported the fix as a kind-prefix guard with a regression
test that loads a kind-named document alongside a regular one. Version bumped
to 0.1.3; the suite passes on Python 3.10 through 3.13.

### Runtime 0.1.3

`mosvera/runtime` PR #2 (commit `245c030`) bumped the version to 0.1.3. No
code change was needed: the release exists to publish the OB-59048 fix that
had been waiting on `main`.

### MCP 0.1.10

`mosvera/mcp` PR #1 (commit `07d7718`) carried three things:

- The adapter diagnostic. The server now writes one line to stderr at startup
  listing the optional provider adapters that loaded, so a missing adapter is
  visible in any log. Stderr is deliberate: stdout carries the MCP JSON-RPC
  transport and must stay clean.
- A dependency refresh: MCP SDK 1.32.1, provider-base 0.1.3, TypeScript
  5.9.3, vitest 4.1.12, zod 3.25.76.
- The version bump in all four places the server carries it: `package.json`,
  the `SERVER_VERSION` constant, the MCPB manifest, and the bundle file name.

The server's own narrative tells this story in full; see the companion doc in
`mosvera/mcp`.

## The tidy pass (October 27, 2026)

With the train merged, the remaining scan items were mechanical hygiene.

### Dependabot everywhere

Seven repos gained a `.github/dependabot.yml` mirroring the combined repo's
posture (monthly, grouped where the repo is a workspace, at most ten open
update PRs): `runtime` (PR #3), `mcp` (PR #3), `python` (PR #2), `spec`
(PR #1), `providers` (PR #1), `examples` (PR #1), and `mosvera.io` (PR #1).
Three repos needed no config: `mosvera-registry`, `mosvera-web`, and
`mosvera-github-profile` have no package manifests or workflows to update.

Within-range refreshes landed with the configs where versions had drifted:
runtime (TypeScript 5.9.3, vitest 4.1.12, ajv 8.20.0, yaml 2.9.1), spec
(ajv 8.20.0), providers (TypeScript 5.9.3, vitest 4.1.12, tsx 4.23.15), each
with the repo's full CI green.

### CodeQL via workflow, not default setup

Enabling CodeQL's default setup through the API was attempted first and was
not available to the automation credential in use. Rather than leave scanning
off, each public org repo gained an explicit advanced-setup workflow
(`.github/workflows/codeql.yml`: push, pull request, and a weekly schedule,
`security-events: write` permission), in `runtime` PR #9, `mcp` PR #10,
`python` PR #5, `spec` PR #4, `providers` PR #9, `examples` PR #4, and
`mosvera.io` PR #4. First analyses were confirmed present after merge.
The two private repos in the family cannot take default setup without a paid
GitHub Advanced Security plan and were left out of scope deliberately.

The scanner paid for itself on its first day. Its initial run on
`mosvera/examples` flagged `js/incomplete-sanitization` (high) in
`scripts/export-open-design-system.mjs`: the `cssString` helper escaped double
quotes but not backslashes, so a token value containing a backslash could
break out of the generated CSS string. PR #5 fixed the escape order
(backslashes, then quotes, then newlines); the alert closed as fixed.

### The mosvera-web README

`niclydon/mosvera-web` PR #4 rewrote the README's opening to state the repo's
real role (brand identity assets and design tokens compiled from
`mosvera-registry`) and to say explicitly that it does not serve mosvera.io.
The layout and source-of-truth sections were already accurate and are
unchanged.

## Twenty-six update proposals in one hour

The new Dependabot configs fired immediately: twenty-six PRs across the seven
repos, including every major version the ecosystem had been holding back.
They were worked the same day, under two rules: each change lands CI-green,
and majors are tested as the combination that would actually ship.

- The eight GitHub Actions bumps (checkout 7, setup-node 7, setup-python 7)
  merged directly in `python`, `spec`, `examples`, and `mosvera.io`. One
  needed a manual rebase: in `python`, the checkout and setup-python PRs
  edited the same workflow lines, and the second was rebased and resolved by
  hand (PR #3).
- The three code repos each took one combined PR, closing their individual
  Dependabot PRs as superseded with the reason recorded on each:
  - `runtime` PR #10: TypeScript 7.0.2, vitest 5.0.5, @types/node 26.6.5,
    Actions 7. 68 tests green.
  - `mcp` PR #11: zod 4.6.7, TypeScript 7.0.2, vitest 5.0.5, @types/node
    26.6.5, MCP SDK 1.32.2, Actions 7. Zod 4 needed a code adaptation:
    seven single-argument `z.record(...)` schemas in `src/server.ts` became
    the two-argument form. 56 tests green, plus a stdio smoke of the built
    server.
  - `providers` PR #10: OpenAI 7.45.1, @runwayml/sdk 4.24.0, TypeScript
    7.0.2, vitest 5.0.5, @types/node 26.6.5 applied in the root manifest and
    all ten workspace manifests (each workspace pins its own copies, which a
    root-only bump silently misses). Full workspace suite green.

End state: zero open pull requests on all ten GitHub repos in the family, and
zero open Dependabot or CodeQL alerts on every scanned repo.

## Publishing in the token-deprecation era

The train's code was merged on October 21; the packages did not move for six
days, because both registries were missing a piece of account configuration
that no code change can supply.

PyPI was the clean half. The project had no trusted publisher registered, so
the workflow's OIDC token exchange failed at the door. Once the maintainer
registered the publisher (GitHub owner `mosvera`, repository `python`,
workflow `release.yml`, environment `pypi`), the same workflow ran green end
to end and `mosvera` 0.1.3 (wheel and sdist) published on October 27 with no
stored secret anywhere in the path.

npm was the instructive half. The repos carried a repo-level `NPM_TOKEN`
secret from May 2026 that could not write the `@mosvera` scope (the publish
PUT returned 404). A fresh granular token scoped to `@mosvera` fixed the
permission, and then a second, newer wall appeared: npm is deprecating
token-based publishing, so with the correct token the workflows stage and
verify completely and fail only at the publish step itself. The adopted
pattern, the same one the maintainer's other packages moved to, is:

1. Automation takes the release all the way to a verified, packed tarball.
2. The maintainer runs the final `npm publish` from an interactive shell.

On October 27 the two tarballs were packed from clean `main` trees, their
contents inspected (both carry their compiled `dist/`), and published by the
maintainer from those staged artifacts: `@mosvera/runtime` 0.1.3 and
`@mosvera/mcp` 0.1.10. One verification note for future releases: after a
publish, read the registry's HTTP API directly. The npm CLI's cached view
lagged several minutes behind the API and briefly reported the old versions
as current.

Follow-ups completed the same day: GitHub release `v0.1.10` on `mosvera/mcp`
with the `mosvera-mcp-0.1.10.mcpb` bundle attached (the download mosvera.io
links), a lockfile refresh bringing the server's installed runtime to 0.1.3
(`mosvera/mcp` PR #12), and the production deployment updated to the final
`main` and verified healthy with all eleven provider adapters loaded.

## End state

| Repo | State at close (October 27, 2026) |
| --- | --- |
| `niclydon/mosvera` | Signpost README to mosvera.io and the org repos |
| `mosvera/spec` | Dependabot + CodeQL on; docs current |
| `mosvera/runtime` | 0.1.3 published; majors current |
| `mosvera/mcp` | 0.1.10 published; release v0.1.10 with bundle; majors current |
| `mosvera/providers` | Majors current (OpenAI 7, Runway 4); packages unchanged at 0.1.x |
| `mosvera/python` | 0.1.3 published to PyPI; OB-59048 parity restored |
| `mosvera/examples` | CodeQL alert fixed; Dependabot + CodeQL on |
| `mosvera/mosvera.io` | Dependabot + CodeQL on; still the live site's source |
| `niclydon/mosvera-web` | README states its real role (brand layer) |
| `niclydon/mosvera-registry` | Unchanged; still the brand source of truth |

What remains open, deliberately:

- The Phase 6 launch essay is still unwritten. That is a writing task for the
  maintainer, not a gap in the repos, and it stays parked until it is picked
  up as writing.
- The private repos (`mosvera-registry`, `mosvera-web`) have no code
  scanning; enabling it needs a paid GitHub Advanced Security plan.
- Future npm releases follow the staged-tarball pattern above. The workflow
  half is healthy and worth keeping: it is the verification, even though it
  no longer performs the publish.

See `CHANGES.md` for the chronological diff summary.

> Executed by Nova (model: Muse Wonder), October 27, 2026.
