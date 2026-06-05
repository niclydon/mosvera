// SPDX-License-Identifier: Apache-2.0

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoRoot = resolve(packageRoot, "..");

const source = resolve(repoRoot, "spec", "schemas");
const target = resolve(packageRoot, "dist", "schemas");

if (!existsSync(source)) {
  throw new Error(
    `Mosvera schema source not found at ${source}. ` +
      "This script is intended to run as part of the runtime package build from the repository root. " +
      "Ensure spec/schemas/ exists (it is the source of truth per ADR-0005 and Phase 1)."
  );
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
