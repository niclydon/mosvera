#!/usr/bin/env python3
"""High-confidence secret scanner for agent hooks and git pre-commit.

The scanner intentionally favors low false positives over broad entropy
matching. It blocks raw secret files and well-known token/key shapes before
they enter git history. It is not a replacement for a full history audit.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from urllib.parse import urlsplit
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


REPO_ROOT = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Finding:
    path: str
    line: int | None
    kind: str
    detail: str


SECRET_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("private-key", re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----")),
    ("openai-key", re.compile(r"\bsk-(?!lf-|ant-)(?:proj-)?[A-Za-z0-9_-]{24,}\b")),
    ("anthropic-key", re.compile(r"\bsk-ant-[A-Za-z0-9_-]{24,}\b")),
    ("langfuse-secret-key", re.compile(r"\bsk-lf-[A-Za-z0-9-]{24,}\b")),
    ("xai-key", re.compile(r"\bxai-[A-Za-z0-9_-]{24,}\b")),
    ("google-api-key", re.compile(r"\bAIzaSy[A-Za-z0-9_-]{30,}\b")),
    ("github-token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b")),
    ("github-pat", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{40,}\b")),
    ("slack-token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b")),
    ("discord-webhook", re.compile(r"https://(?:canary\.|ptb\.)?discord(?:app)?\.com/api/webhooks/[0-9]+/[A-Za-z0-9_-]+")),
    ("aws-access-key-id", re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
]

GENERIC_SECRET_ASSIGNMENT = re.compile(
    r"""(?ix)
    (?<![:/])\b([A-Z0-9_]*(?:API[_-]?KEY|SECRET|TOKEN|PASSWORD|WEBHOOK)[A-Z0-9_]*)\b
    \s*[:=]\s*
    ['"]?([^'"\s#]{20,})['"]?
    """
)

PLACEHOLDER_HINTS = (
    "change_me",
    "changeme",
    "placeholder",
    "replace_me",
    "example",
    "fake",
    "your_",
    "from-vault",
    "vault",
)

RAW_SECRET_BASENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".env.test",
    "credentials",
    "credentials.json",
}

SAFE_ENV_EXAMPLE_SUFFIXES = (
    ".example",
    ".sample",
    ".template",
    ".tmpl",
    ".dist",
)

SECRET_FILE_SUFFIXES = (
    ".pem",
    ".p8",
    ".p12",
    ".pfx",
)


def run_git(args: list[str]) -> str:
    return subprocess.check_output(["git", *args], cwd=Path.cwd(), text=True, stderr=subprocess.DEVNULL)


def repo_name() -> str:
    try:
        root = run_git(["rev-parse", "--show-toplevel"]).strip()
        return Path(root).name
    except Exception:
        return Path.cwd().name


def is_raw_secret_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    base = os.path.basename(normalized).lower()

    if base.endswith(SAFE_ENV_EXAMPLE_SUFFIXES):
        return False

    if base in RAW_SECRET_BASENAMES:
        return True

    if base.startswith(".env.") and not base.endswith(SAFE_ENV_EXAMPLE_SUFFIXES):
        return True

    if base.endswith(SECRET_FILE_SUFFIXES):
        return True

    if base.endswith(".key") and "public" not in base and "example" not in base:
        return True

    return False


def looks_like_placeholder(value: str) -> bool:
    lower = value.lower()
    if any(hint in lower for hint in PLACEHOLDER_HINTS):
        return True
    if "$" in value or "<" in value or ">" in value or "{" in value or "}" in value:
        return True
    if value.startswith("/") or value.startswith("./") or value.startswith("../"):
        return True
    parsed = urlsplit(value)
    if parsed.scheme in {"http", "https"} and parsed.hostname and "." not in parsed.hostname:
        return True
    return False


def looks_secretish(value: str) -> bool:
    if looks_like_placeholder(value):
        return False
    if len(value) < 20:
        return False
    has_alpha = any(ch.isalpha() for ch in value)
    has_digit = any(ch.isdigit() for ch in value)
    return has_alpha and has_digit


def scan_line(path: str, line_no: int | None, text: str) -> list[Finding]:
    if "secret-scan:ignore" in text:
        return []

    findings: list[Finding] = []
    for name, pattern in SECRET_PATTERNS:
        match = pattern.search(text)
        if match and not looks_like_placeholder(match.group(0)):
            findings.append(Finding(path, line_no, name, "known secret/token pattern"))

    for match in GENERIC_SECRET_ASSIGNMENT.finditer(text):
        value = match.group(2).strip().strip("'\"")
        if looks_secretish(value):
            findings.append(
                Finding(
                    path,
                    line_no,
                    "secret-assignment",
                    f"secret-like value assigned to {match.group(1)}",
                )
            )

    return findings


def staged_paths() -> list[str]:
    raw = subprocess.check_output(
        ["git", "diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR"],
        cwd=Path.cwd(),
    )
    return [p.decode() for p in raw.split(b"\0") if p]


def staged_added_lines() -> Iterable[tuple[str, int | None, str]]:
    diff = subprocess.check_output(
        ["git", "diff", "--cached", "--unified=0", "--no-ext-diff", "--text"],
        cwd=Path.cwd(),
        text=True,
        errors="replace",
    )

    current_path = "<staged-diff>"
    new_line = None
    hunk_re = re.compile(r"@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@")

    for raw_line in diff.splitlines():
        if raw_line.startswith("+++ b/"):
            current_path = raw_line[6:]
            new_line = None
            continue
        if raw_line.startswith("@@ "):
            match = hunk_re.search(raw_line)
            new_line = int(match.group(1)) if match else None
            continue
        if raw_line.startswith("+") and not raw_line.startswith("+++"):
            yield current_path, new_line, raw_line[1:]
            if new_line is not None:
                new_line += 1
            continue
        if raw_line.startswith(" ") and new_line is not None:
            new_line += 1


def scan_staged() -> list[Finding]:
    findings: list[Finding] = []
    for path in staged_paths():
        if is_raw_secret_path(path):
            findings.append(Finding(path, None, "raw-secret-file", "raw secret file path is not commit-safe"))

    for path, line_no, text in staged_added_lines():
        findings.extend(scan_line(path, line_no, text))

    return dedupe(findings)


def tracked_paths() -> list[str]:
    raw = subprocess.check_output(
        ["git", "ls-files", "-z"],
        cwd=Path.cwd(),
    )
    return [p.decode() for p in raw.split(b"\0") if p]


def _read_tracked_text(path: Path) -> str | None:
    try:
        data = path.read_bytes()
    except OSError:
        return None
    if b"\0" in data[:8192]:
        return None
    return data.decode("utf-8", errors="replace")


def scan_tracked() -> list[Finding]:
    """Scan every currently tracked file. Report-only; never mutates the tree."""
    findings: list[Finding] = []
    root = Path.cwd()
    for rel in tracked_paths():
        if is_raw_secret_path(rel):
            findings.append(
                Finding(rel, None, "raw-secret-file", "raw secret file path is not commit-safe")
            )
        text = _read_tracked_text(root / rel)
        if text is None:
            continue
        for line_no, line in enumerate(text.splitlines(), start=1):
            findings.extend(scan_line(rel, line_no, line))
    return dedupe(findings)


def extract_patch_paths(command: str) -> list[str]:
    paths: list[str] = []
    for line in command.splitlines():
        match = re.match(r"^\*\*\* (?:Update|Add|Delete) File: (.+)$", line)
        if match:
            paths.append(match.group(1))
    return paths


def walk_strings(obj: Any) -> Iterable[str]:
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for value in obj.values():
            yield from walk_strings(value)
    elif isinstance(obj, list):
        for value in obj:
            yield from walk_strings(value)


def scan_tool_input(stdin_text: str) -> list[Finding]:
    findings: list[Finding] = []
    try:
        payload = json.loads(stdin_text or "{}")
    except json.JSONDecodeError:
        payload = {"raw": stdin_text}

    tool_input = payload.get("tool_input") if isinstance(payload, dict) else {}
    if not isinstance(tool_input, dict):
        tool_input = {}

    candidate_paths: list[str] = []
    for key in ("file_path", "path", "notebook_path"):
        value = tool_input.get(key)
        if isinstance(value, str):
            candidate_paths.append(value)

    command = tool_input.get("command")
    if isinstance(command, str):
        candidate_paths.extend(extract_patch_paths(command))

    for path in candidate_paths:
        if is_raw_secret_path(path):
            findings.append(Finding(path, None, "raw-secret-file", "agent edit targets a raw secret file"))

    for idx, text in enumerate(walk_strings(tool_input), start=1):
        for finding in scan_line("<tool-input>", idx, text):
            findings.append(finding)

    return dedupe(findings)


def dedupe(findings: list[Finding]) -> list[Finding]:
    seen: set[tuple[str, int | None, str, str]] = set()
    out: list[Finding] = []
    for finding in findings:
        key = (finding.path, finding.line, finding.kind, finding.detail)
        if key not in seen:
            seen.add(key)
            out.append(finding)
    return out


def print_findings(findings: list[Finding]) -> None:
    print("secret-scan: blocked potential secret leak", file=sys.stderr)
    for finding in findings[:20]:
        loc = finding.path
        if finding.line is not None:
            loc += f":{finding.line}"
        print(f"  - {loc}: {finding.kind}: {finding.detail}", file=sys.stderr)
    if len(findings) > 20:
        print(f"  ... {len(findings) - 20} more finding(s)", file=sys.stderr)
    print("Move real values to the secrets vault/runtime env and commit placeholders only.", file=sys.stderr)


def finding_payload(finding: Finding, mode: str, repo: str) -> dict[str, Any]:
    return {
        "repo": repo,
        "path": finding.path,
        "line": finding.line,
        "kind": finding.kind,
        "detail": finding.detail,
        "mode": mode,
    }


def evidence_record(finding: Finding, mode: str, repo: str, occurred_at: str) -> dict[str, Any]:
    dedupe_line = "none" if finding.line is None else str(finding.line)
    dedupe_key = f"homelab.secret-scan:{repo}:{finding.path}:{dedupe_line}:{finding.kind}"
    payload = finding_payload(finding, mode, repo)
    return {
        "producer_key": "homelab.secret-scan",
        "record_type": "control_event",
        "dedupe_key": dedupe_key,
        "severity": "high",
        "source_surface": "homelab:secret-scan",
        "host": os.uname().nodename,
        "occurred_at": occurred_at,
        "envelope": {
            "producer_key": "homelab.secret-scan",
            "record_type": "control_event",
            "occurred_at": occurred_at,
            "source_surface": "homelab:secret-scan",
            "severity": "high",
            "dedupe_key": dedupe_key,
            "title": "secret-scan blocked a credential-shaped value",
            "summary": f"{finding.kind} in {finding.path}",
            "evidence_refs": {
                "repo": repo,
                "path": finding.path,
                "line": finding.line,
                "kind": finding.kind,
                "mode": mode,
            },
            "redaction": {
                "rule": "metadata_only",
                "redacted_fields": ["matched_value"],
            },
        },
        "payload": payload,
    }


def emit_block_events(findings: list[Finding], mode: str) -> None:
    """Best-effort evidence-plane emission. Never raises to the caller."""
    url = os.environ.get("NEXUS_SECURITY_EVIDENCE_URL", "").strip()
    token = (
        os.environ.get("NEXUS_SECURITY_EVIDENCE_TOKEN")
        or os.environ.get("NEXUS_SYSTEM_KEY")
        or ""
    ).strip()
    if not url or not token or not findings:
        return

    from datetime import datetime, timezone

    repo = repo_name()
    occurred_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    body = json.dumps({
        "records": [evidence_record(finding, mode, repo, occurred_at) for finding in findings[:100]],
    }).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=2) as resp:
            if resp.status >= 400:
                print(f"secret-scan: evidence emit failed HTTP {resp.status}", file=sys.stderr)
    except (OSError, urllib.error.URLError, TimeoutError) as err:
        print(f"secret-scan: evidence emit failed: {err}", file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--staged", action="store_true", help="scan staged git paths and added lines")
    parser.add_argument("--tool-input", action="store_true", help="scan Claude/Codex hook JSON from stdin")
    parser.add_argument("--text", action="store_true", help="scan raw stdin text; useful for tests")
    parser.add_argument(
        "--tree",
        "--all-tracked",
        action="store_true",
        help="scan every currently tracked file (report-only audit; no evidence emit)",
    )
    args = parser.parse_args()

    if args.staged:
        findings = scan_staged()
        mode = "staged"
        exit_code = 1
    elif args.tool_input:
        findings = scan_tool_input(sys.stdin.read())
        mode = "tool-input"
        exit_code = 2
    elif args.text:
        findings = scan_line("<stdin>", 1, sys.stdin.read())
        mode = "text"
        exit_code = 1
    elif args.tree:
        findings = scan_tracked()
        mode = "tree"
        exit_code = 1
    else:
        parser.error("choose --staged, --tool-input, --text, or --tree")

    if findings:
        print_findings(findings)
        if mode != "tree":
            emit_block_events(findings, mode)
        return exit_code
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
