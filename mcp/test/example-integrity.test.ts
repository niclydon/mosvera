// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createValidator,
  deriveStrategies,
  resolveComposition,
  compile,
  type CapabilityManifest,
  type JsonObject,
  type MergeStrategies,
  type Registry,
} from "@mosvera/runtime";
import { loadRegistry } from "../src/registry/loader.ts";

const here = dirname(fileURLToPath(import.meta.url));
const exDir = join(here, "..", "..", "spec", "examples", "cinematic-editorial");
const read = (p: string) => JSON.parse(readFileSync(join(exDir, p), "utf8")) as JsonObject;

describe("cinematic-editorial example integrity", () => {
  const v = createValidator();

  it("every document validates against its schema", () => {
    expect(v.validate(read("template.base.json"), "template").valid).toBe(true);
    expect(v.validate(read("template.noir.json"), "template").valid).toBe(true);
    expect(v.validate(read("modifier.golden-hour.json"), "modifier").valid).toBe(true);
    expect(v.validate(read("modifier.high-contrast.json"), "modifier").valid).toBe(true);
    expect(v.validate(read("palette.editorial-warm.json"), "palette").valid).toBe(true);
    expect(v.validate(read("composition.json"), "composition").valid).toBe(true);
    expect(v.validate(read("manifests/illustrative-image.manifest.json"), "capability-manifest").valid).toBe(true);
  });

  it("the composition resolves to the expected canonical model", () => {
    const registry: Registry = {
      templates: {
        "cinematic-editorial-base": read("template.base.json"),
        noir: read("template.noir.json"),
      },
      modifiers: {
        "golden-hour": read("modifier.golden-hour.json"),
        "high-contrast": read("modifier.high-contrast.json"),
      },
    };
    const strategies: MergeStrategies = {
      ...deriveStrategies(),
      ...(read("merge-strategies.json") as unknown as MergeStrategies),
    };
    const canonical = resolveComposition(read("composition.json"), registry, strategies);
    expect(canonical).toEqual({
      subject: "a lighthouse on a basalt cliff at dusk",
      medium: "cinematic",
      lighting: { scheme: "three_point", mood: "warm" },
      lights: [
        { name: "key", power: 6 },
        { name: "fill", power: 5 },
        { name: "rim", power: 2 },
      ],
      color_grade: { contrast: "very_high", saturation: "desaturated" },
      color_temperature: "warm",
      palette: { accent: "#c8943f" },
      aspect_ratio: "3:2",
      quality: "high",
      safety: "standard",
    });
  });

  it("compiles against the illustrative manifest with the expected warnings", () => {
    const canonical: JsonObject = {
      subject: "a lighthouse on a basalt cliff at dusk",
      medium: "cinematic",
      lighting: { scheme: "three_point", mood: "warm" },
      lights: [{ name: "key", power: 6 }],
      color_grade: { contrast: "very_high", saturation: "desaturated" },
      color_temperature: "warm",
      palette: { accent: "#c8943f" },
      aspect_ratio: "3:2",
      quality: "high",
      safety: "standard",
    };
    const manifest = read("manifests/illustrative-image.manifest.json") as unknown as CapabilityManifest;
    expect(compile(canonical, manifest, {})).toEqual({
      status: "compiled",
      warnings: [
        { construct: "color_grade", action: "approximate" },
        { construct: "color_temperature", action: "unsupported" },
        { construct: "lighting", action: "approximate" },
        { construct: "lights", action: "emulate" },
        { construct: "palette", action: "approximate" },
        { construct: "safety", action: "unsupported" },
      ],
    });
  });
});

describe("Phase 5 example integrity", () => {
  const cases = [
    {
      name: "dashboard-minimalism",
      expected: {
        medium: "digital_illustration",
        lighting: { scheme: "flat", mood: "neutral" },
        color_grade: { contrast: "medium", saturation: "muted" },
      },
    },
    {
      name: "documentary-realism",
      expected: {
        medium: "photographic",
        lighting: { scheme: "natural", mood: "observational" },
        color_grade: { contrast: "low", saturation: "natural" },
      },
    },
  ] as const;

  for (const c of cases) {
    it(`${c.name} resolves and compiles against all Phase 5 manifests`, () => {
      const dir = join(here, "..", "..", "spec", "examples", c.name);
      const project = loadRegistry(dir);
      const composition = JSON.parse(readFileSync(join(dir, "composition.json"), "utf8")) as JsonObject;
      const canonical = resolveComposition(composition, project.registry, {
        ...deriveStrategies(),
        ...project.strategies,
      });

      expect(canonical).toMatchObject(c.expected);
      expect(Object.keys(project.manifests).sort()).toEqual(["bfl-flux-2-pro", "openai-gpt-image-1", "sdxl-replicate"]);
      for (const manifest of Object.values(project.manifests)) {
        expect(compile(canonical, manifest, {}).status).toBe("compiled");
      }
    });
  }
});
