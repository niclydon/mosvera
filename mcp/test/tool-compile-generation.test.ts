// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { createValidator, type CapabilityManifest } from "@mosvera/runtime";
import { runCompileGeneration } from "../src/tools/compile-generation.ts";
import type { ToolContext } from "../src/types.ts";

const manifest: CapabilityManifest = {
  provider: "demo",
  adapter_version: "0.0.0",
  constructs: {
    medium: { lowering_action: "native" },
    color_temperature: { lowering_action: "approximate", note: "mapped to a warmth prompt phrase" },
  },
};

function ctx(): ToolContext {
  return {
    project: {
      registry: {
        templates: { base_t: { id: "base_t", medium: "photographic" } },
        modifiers: { warm: { id: "warm", color_temperature: "warm" } },
        palettes: {},
      },
      manifests: { demo: manifest },
      strategies: {},
    },
    validator: createValidator(),
    baseStrategies: {},
  };
}

describe("compile_generation", () => {
  it("resolves then compiles against a registry manifest, returning warnings + canonical", () => {
    const res = runCompileGeneration(ctx(), { composition: { base: "base_t", modifiers: ["warm"] }, provider: "demo" });
    expect(res).toEqual({
      status: "compiled",
      warnings: [{ construct: "color_temperature", action: "approximate" }],
      canonical: { medium: "photographic", color_temperature: "warm" },
    });
  });

  it("returns unknown_provider when no manifest matches", () => {
    const res = runCompileGeneration(ctx(), { composition: { base: "base_t" }, provider: "nope" });
    expect(res).toEqual({ error: "unknown_provider", detail: { provider: "nope" } });
  });

  it("returns unknown_reference for a missing modifier (pre-flight)", () => {
    const res = runCompileGeneration(ctx(), { composition: { base: "base_t", modifiers: ["ghost"] }, provider: "demo" });
    expect(res).toEqual({ error: "unknown_reference", detail: { missing: ["ghost"] } });
  });

  it("passes through a required_unsupported hard error with the canonical model", () => {
    const res = runCompileGeneration(ctx(), {
      composition: { base: "base_t", modifiers: ["warm"] },
      provider: "demo",
      criticality: { color_temperature: "required" },
      manifest: { provider: "demo", adapter_version: "0.0.0", constructs: { medium: { lowering_action: "native" } } },
    });
    expect(res).toEqual({
      status: "error",
      error: "required_unsupported",
      construct: "color_temperature",
      canonical: { medium: "photographic", color_temperature: "warm" },
    });
  });
});
