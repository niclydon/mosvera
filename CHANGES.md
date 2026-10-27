# Changes

Chronological per-phase log for `mosvera` (the combined repository). Newest
entries on top. The rich "why/how" lives in `docs/narrative/`; entries here
are the scannable index.

---

## 2026-10-27 — Release train published; family tidy pass complete

**Decision:** the public face (mosvera.io plus the `mosvera` org repos) is
the project; this combined repo stays open as a labeled signpost to it (see
the 2026-10-20 entry). The week of October 20-27 closed the gap between the
public face and the code: three packages published, dependency automation
and code scanning enabled across the org repos, and all twenty-six of the
resulting Dependabot proposals disposed of the day they were filed.

- `@mosvera/runtime` 0.1.3 and `@mosvera/mcp` 0.1.10 published to npm;
  `mosvera` 0.1.3 published to PyPI via trusted publishing (OIDC, no stored
  secret). npm publishes ran from a maintainer shell using staged,
  content-verified tarballs, because npm is deprecating token-based
  publishing; the workflows now stage and verify, the shell publishes.
- GitHub release `v0.1.10` on `mosvera/mcp` carries the
  `mosvera-mcp-0.1.10.mcpb` bundle that mosvera.io links.
- Dependabot configured in the seven org repos that lacked it; CodeQL added
  to the same seven via an explicit workflow (the default-setup API route
  was unavailable). First scan found and fixed a real escaping bug in
  `mosvera/examples` (PR #5).
- Majors landed as combined, CI-verified PRs: `mosvera/runtime` #10,
  `mosvera/mcp` #11 (includes the zod 4 adaptation), `mosvera/providers`
  #10 (OpenAI 7, Runway SDK 4). Actions bumps merged directly in `python`,
  `spec`, `examples`, `mosvera.io`.
- `niclydon/mosvera-web` README corrected to its real role (PR #4).

End state: zero open pull requests and zero open Dependabot or CodeQL
alerts across the family. Full record:
`docs/narrative/2026-10-27-public-face-and-the-0-1-3-release-train.md`.
Still pending by choice: the Phase 6 launch essay (a writing task, parked).

---

## 2026-10-20 — README becomes a signpost; release train departs

**Decision:** keep this repository open as a signpost rather than archiving
it. Its README now states that the project lives at mosvera.io and in the
`mosvera` org repositories, links each of them plus the npm and PyPI
packages, and describes this repo as a historical snapshot (PR #12, commit
`4b76f63`). Archiving was rejected (it holds the pre-split history and reads
as abandonment); leaving the old README was rejected (it described this repo
as the project home, which is no longer true).

The same week, the 0.1.3 / 0.1.10 release train departed: the OB-59048
registry-loader parity fix for Python (`mosvera/python` PR #1), the runtime
0.1.3 version prep (`mosvera/runtime` PR #2), and the MCP 0.1.10 adapter
diagnostics release (`mosvera/mcp` PR #1). Publishing completed on
2026-10-27; see the entry above and the narrative.

---
