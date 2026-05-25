// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContext } from "../src/server.ts";
import { runListTemplates } from "../src/tools/list-templates.ts";

const here = dirname(fileURLToPath(import.meta.url));
const example = join(here, "..", "..", "spec", "examples", "cinematic-editorial");

describe("buildContext", () => {
  it("loads the example project and composes base strategies (schema + project)", () => {
    const ctx = buildContext(example);
    expect(ctx.baseStrategies).toEqual({
      modifiers: { strategy: "replace" },
      lights: { strategy: "merge_by", key: "name" },
    });
    const names = runListTemplates(ctx, {}).map((t) => t.name).sort();
    expect(names).toEqual(["cinematic-editorial-base", "noir"]);
  });
});
