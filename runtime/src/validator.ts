// SPDX-License-Identifier: Apache-2.0
//
// Schema validator (boundary module). Validates input documents against the
// canonical JSON Schemas in spec/schemas/ (ADR-0005 naming, MEP directive
// vocabulary). Binds to `ajv` (JSON Schema 2020-12).
//
// This is a BOUNDARY module, not part of the pure semantic core. Each language
// port replaces this binding with that language's native JSON Schema
// validator (e.g. Python `jsonschema`). The portable artifacts are the schemas
// themselves; the validator is a thin per-language binding over them.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020, { type ValidateFunction } from "ajv/dist/2020.js";

export type DocumentKind =
  | "composition"
  | "template"
  | "modifier"
  | "palette"
  | "capability-manifest";

export interface ValidationIssue {
  /** JSON Pointer to the offending location, "" for the document root. */
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
}

export interface Validator {
  validate(doc: unknown, kind: DocumentKind): ValidationResult;
}

const SCHEMA_FILES = [
  "common.schema.json",
  "composition.schema.json",
  "template.schema.json",
  "modifier.schema.json",
  "palette.schema.json",
  "capability-manifest.schema.json",
];

const KIND_TO_ID: Record<DocumentKind, string> = {
  composition: "urn:mosvera:schema:0.1:composition",
  template: "urn:mosvera:schema:0.1:template",
  modifier: "urn:mosvera:schema:0.1:modifier",
  palette: "urn:mosvera:schema:0.1:palette",
  "capability-manifest": "urn:mosvera:schema:0.1:capability-manifest",
};

function defaultSchemaDir(): string {
  // runtime/src/validator.ts -> repo-root/spec/schemas
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "..", "..", "spec", "schemas");
}

/**
 * Create a validator backed by the canonical schemas. By default it loads
 * them from `spec/schemas/` relative to this module; pass `schemaDir` to
 * override (e.g. once schemas ship as a published package after the repo
 * split per ADR-0002).
 */
export function createValidator(schemaDir: string = defaultSchemaDir()): Validator {
  // strict:false so the runtime tolerates the `x-mosvera-merge` schema
  // annotation (MEP-0001 list-merge strategy) without treating it as an error.
  const ajv = new Ajv2020({ allErrors: true, strict: false });

  for (const file of SCHEMA_FILES) {
    const schema = JSON.parse(readFileSync(join(schemaDir, file), "utf8"));
    ajv.addSchema(schema);
  }

  const compiled = new Map<DocumentKind, ValidateFunction>();
  for (const [kind, id] of Object.entries(KIND_TO_ID) as [DocumentKind, string][]) {
    const fn = ajv.getSchema(id);
    if (fn === undefined) throw new Error(`schema not found for kind "${kind}" (${id})`);
    compiled.set(kind, fn);
  }

  return {
    validate(doc: unknown, kind: DocumentKind): ValidationResult {
      const fn = compiled.get(kind)!;
      const ok = fn(doc) as boolean;
      if (ok) return { valid: true, errors: [] };
      const errors: ValidationIssue[] = (fn.errors ?? []).map((e) => ({
        path: e.instancePath,
        message: `${e.instancePath || "(root)"} ${e.message ?? "is invalid"}`.trim(),
      }));
      return { valid: false, errors };
    },
  };
}
