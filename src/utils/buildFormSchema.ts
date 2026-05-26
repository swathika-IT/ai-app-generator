import { z } from "zod";
import { ComponentConfig, InputConfig, TextareaConfig, SelectConfig, SectionConfig } from "@/types/config";

function collectFieldConfigs(configs: ComponentConfig[]): ComponentConfig[] {
  const fields: ComponentConfig[] = [];
  for (const cfg of configs) {
    if (["input", "textarea", "select"].includes(cfg.type)) {
      fields.push(cfg);
    }
    if (cfg.type === "section") {
      fields.push(...collectFieldConfigs((cfg as SectionConfig).children));
    }
  }
  return fields;
}

export function buildFormSchema(configs: ComponentConfig[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  const fields = collectFieldConfigs(configs);

  for (const cfg of fields) {
    if (cfg.type === "input") {
      const ic = cfg as InputConfig;
      let schema: z.ZodString = z.string();

      if (ic.required) {
        schema = schema.min(1, `${ic.label || "This field"} is required`);
      }
      if (ic.validation === "email") {
        schema = schema.email("Enter a valid email address");
      }
      if (ic.validation === "url") {
        schema = schema.url("Enter a valid URL");
      }
      if (ic.minLength) {
        schema = schema.min(ic.minLength, `Minimum ${ic.minLength} characters required`);
      }
      if (ic.maxLength) {
        schema = schema.max(ic.maxLength, `Maximum ${ic.maxLength} characters allowed`);
      }

      shape[cfg.id] = ic.required ? schema : schema.optional();
    }

    if (cfg.type === "textarea") {
      const tc = cfg as TextareaConfig;
      let schema: z.ZodString = z.string();

      if (tc.required) {
        schema = schema.min(1, `${tc.label || "This field"} is required`);
      }
      if (tc.minLength) {
        schema = schema.min(tc.minLength, `Minimum ${tc.minLength} characters required`);
      }
      if (tc.maxLength) {
        schema = schema.max(tc.maxLength, `Maximum ${tc.maxLength} characters allowed`);
      }

      shape[cfg.id] = tc.required ? schema : schema.optional();
    }

    if (cfg.type === "select") {
      const sc = cfg as SelectConfig;
      let schema: z.ZodString = z.string();

      if (sc.required) {
        schema = schema.min(1, `${sc.label || "This field"} is required`);
      }

      shape[cfg.id] = sc.required ? schema : schema.optional();
    }
  }

  return z.object(shape);
}

export function getFormDefaultValues(configs: ComponentConfig[]): Record<string, string> {
  const values: Record<string, string> = {};
  const fields = collectFieldConfigs(configs);
  for (const cfg of fields) {
    values[cfg.id] = "";
  }
  return values;
}
