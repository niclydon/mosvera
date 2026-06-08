// SPDX-License-Identifier: Apache-2.0
//
// Runtime-only local expression overlay support. Overlay files are private
// inputs supplied by the caller at server startup; validation errors describe
// only the shape, never the overlay contents.

import { readFileSync } from "node:fs";
import type { Criticality, Json, JsonObject, MergeStrategies, MergeStrategy } from "@mosvera/runtime";

export interface ExpressionOverlay {
  canonical?: JsonObject;
  criticality?: Record<string, Criticality>;
  merge_strategies?: MergeStrategies;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCriticality(value: unknown): value is Criticality {
  return value === "required" || value === "optional";
}

function isJson(value: unknown): value is Json {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isJson);
  if (isRecord(value)) return Object.values(value).every(isJson);
  return false;
}

function assertRecord(value: unknown, message: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new Error(message);
}

function parseMergeStrategy(value: unknown): MergeStrategy {
  assertRecord(value, "invalid expression overlay: merge strategy entries must be objects");
  const strategy = value.strategy;
  if (strategy !== "replace" && strategy !== "append" && strategy !== "merge_by") {
    throw new Error("invalid expression overlay: merge strategy must be replace, append, or merge_by");
  }
  if (strategy === "merge_by" && typeof value.key !== "string") {
    throw new Error("invalid expression overlay: merge_by strategy requires a string key");
  }
  return typeof value.key === "string" ? { strategy, key: value.key } : { strategy };
}

export function parseExpressionOverlay(input: unknown): ExpressionOverlay {
  assertRecord(input, "invalid expression overlay: expected a JSON object");

  const allowed = new Set(["canonical", "criticality", "merge_strategies"]);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new Error("invalid expression overlay: unsupported top-level key");
  }

  const overlay: ExpressionOverlay = {};

  if ("canonical" in input) {
    assertRecord(input.canonical, "invalid expression overlay: canonical must be a JSON object");
    if (!isJson(input.canonical)) throw new Error("invalid expression overlay: canonical must contain only JSON values");
    overlay.canonical = input.canonical as JsonObject;
  }

  if ("criticality" in input) {
    assertRecord(input.criticality, "invalid expression overlay: criticality must be an object");
    const criticality: Record<string, Criticality> = {};
    for (const [key, value] of Object.entries(input.criticality)) {
      if (!isCriticality(value)) {
        throw new Error("invalid expression overlay: criticality values must be required or optional");
      }
      criticality[key] = value;
    }
    overlay.criticality = criticality;
  }

  if ("merge_strategies" in input) {
    assertRecord(input.merge_strategies, "invalid expression overlay: merge_strategies must be an object");
    const mergeStrategies: MergeStrategies = {};
    for (const [key, value] of Object.entries(input.merge_strategies)) {
      mergeStrategies[key] = parseMergeStrategy(value);
    }
    overlay.merge_strategies = mergeStrategies;
  }

  return overlay;
}

export function loadExpressionOverlay(path: string): ExpressionOverlay {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    throw new Error("failed to read expression overlay file");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("invalid expression overlay JSON");
  }

  return parseExpressionOverlay(parsed);
}
