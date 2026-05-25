// SPDX-License-Identifier: Apache-2.0
//
// compile_generation tool handler. Resolves a composition, then runs the
// MEP-0003 compilation contract (compile) against a provider capability
// manifest sourced inline or from the loaded registry. PHASE 3 BOUNDARY: no
// provider HTTP call is made; the result is the contract decision plus the
// canonical model. Real provider payload emission arrives in Phase 4.

import {
  compile,
  parse,
  resolveComposition,
  type CapabilityManifest,
  type Criticality,
  type JsonObject,
  type MergeStrategies,
  type Registry,
} from "@mosvera/runtime";
import { invalidDocument, isResolutionError, mapResolutionError, toolError } from "../errors.ts";
import { collectMissingReferences } from "../registry/preflight.ts";
import { composeStrategies, mergeRegistry } from "../registry/strategies.ts";
import type { CompileResultMcp, ToolContext } from "../types.ts";

export interface CompileArgs {
  composition: object | string;
  provider: string;
  registry?: Registry;
  manifest?: CapabilityManifest;
  criticality?: Record<string, Criticality>;
  merge_strategies?: MergeStrategies;
}

export function runCompileGeneration(ctx: ToolContext, args: CompileArgs): CompileResultMcp {
  let composition: JsonObject;
  try {
    composition = parse(args.composition);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return invalidDocument([{ path: "", message: `parse error: ${message}` }]);
  }

  const cv = ctx.validator.validate(composition, "composition");
  if (!cv.valid) return invalidDocument(cv.errors);

  const registry = mergeRegistry(ctx.project.registry, args.registry);
  const missing = collectMissingReferences(composition, registry);
  if (missing.length > 0) {
    return toolError("unknown_reference", { missing } as unknown as JsonObject);
  }

  const manifest = args.manifest ?? ctx.project.manifests[args.provider];
  if (manifest === undefined) {
    return toolError("unknown_provider", { provider: args.provider } as unknown as JsonObject);
  }
  const mv = ctx.validator.validate(manifest, "capability-manifest");
  if (!mv.valid) return invalidDocument(mv.errors);

  const strategies = composeStrategies(ctx.baseStrategies, args.merge_strategies);
  let canonical: JsonObject;
  try {
    canonical = resolveComposition(composition, registry, strategies);
  } catch (e) {
    if (isResolutionError(e)) return mapResolutionError(e);
    throw e;
  }

  const result = compile(canonical, manifest, args.criticality ?? {});
  if (result.status === "error") {
    return { status: "error", error: result.error, construct: result.construct, canonical };
  }
  return { status: "compiled", warnings: result.warnings, canonical };
}
