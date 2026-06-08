// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from "vitest";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadExpressionOverlay, parseExpressionOverlay } from "../src/expression-overlay.ts";

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, "fixtures");

describe("expression overlay", () => {
  it("loads a tiny synthetic local overlay fixture", () => {
    expect(loadExpressionOverlay(join(fixtures, "expression-overlay.synthetic.json"))).toEqual({
      canonical: { style_note: "synthetic overlay guidance" },
      criticality: { style_note: "optional" },
    });
  });

  it("rejects unsupported top-level keys without echoing contents", () => {
    expect(() => parseExpressionOverlay({ canonical: {}, private_value: "do not echo" })).toThrow(
      "invalid expression overlay: unsupported top-level key",
    );
  });

  it("rejects invalid criticality values without echoing contents", () => {
    expect(() => parseExpressionOverlay({ criticality: { style_note: "do not echo" } })).toThrow(
      "invalid expression overlay: criticality values must be required or optional",
    );
  });

  it("rejects invalid merge strategy entries without echoing contents", () => {
    expect(() => parseExpressionOverlay({ merge_strategies: { style_note: { strategy: "do not echo" } } })).toThrow(
      "invalid expression overlay: merge strategy must be replace, append, or merge_by",
    );
  });
});
