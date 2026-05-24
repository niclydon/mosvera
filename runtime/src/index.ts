// SPDX-License-Identifier: Apache-2.0
//
// @mosvera/runtime — reference runtime for Mosvera.
//
// Public surface: the pure semantic core that takes declarative aesthetic
// intent (MEP-0001 composition, MEP-0002 inheritance) to a canonical model,
// and applies the provider compilation contract (MEP-0003). Checked against
// the language-agnostic conformance suite in spec/compliance.

export { merge } from "./merge.ts";
export { resolveTemplate } from "./resolve.ts";
export { resolveComposition } from "./compose.ts";
export { compile } from "./compile.ts";
export { ResolutionError } from "./types.ts";
export type {
  Json,
  JsonObject,
  MergeStrategy,
  MergeStrategies,
  Registry,
  LoweringAction,
  Criticality,
  CapabilityManifest,
  CompileWarning,
  CompileResult,
  ResolutionErrorKind,
} from "./types.ts";
