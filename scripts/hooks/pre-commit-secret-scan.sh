#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
scanner="$repo_root/scripts/hooks/secret-scan.py"

if [[ ! -x "$scanner" ]]; then
  echo "secret-scan: missing or non-executable scanner: $scanner" >&2
  exit 1
fi

cd "$repo_root"
"$scanner" --staged
