// SPDX-License-Identifier: Apache-2.0

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoRoot = resolve(packageRoot, "..");

const source = resolve(repoRoot, "spec", "examples", "cinematic-editorial");
const target = resolve(packageRoot, "dist", "examples", "cinematic-editorial");

if (!existsSync(source)) {
  throw new Error(
    `Mosvera example registry source not found at ${source}. ` +
      "This script is intended to run as part of the mcp package build from the repository root. " +
      "Ensure spec/examples/cinematic-editorial/ exists (it is the default bundled registry per Phase 3/6)."
  );
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
