import { useState, useCallback } from "react";
import { ComponentConfig } from "@/types/config";
import { validateConfig } from "@/utils/validateConfig";

export interface PageConfigState {
  config: ComponentConfig[];
  rawJson: string;
  parseError: string | null;
  validationErrors: string[];
  isModified: boolean;
  handleJsonChange: (json: string) => void;
  resetToDefault: () => void;
}

export function usePageConfig(
  pageKey: string,
  defaultConfig: ComponentConfig[]
): PageConfigState {
  const storageKey = `appforge_page_${pageKey}`;

  const loadInitial = (): { config: ComponentConfig[]; rawJson: string; modified: boolean } => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const arr: ComponentConfig[] = Array.isArray(parsed) ? parsed : [parsed];
        return { config: arr, rawJson: stored, modified: true };
      }
    } catch {
      // fall through to default
    }
    const json = JSON.stringify(defaultConfig, null, 2);
    return { config: defaultConfig, rawJson: json, modified: false };
  };

  const initial = loadInitial();
  const [config, setConfig] = useState<ComponentConfig[]>(initial.config);
  const [rawJson, setRawJson] = useState(initial.rawJson);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(initial.modified);

  const validation = validateConfig(config as unknown[]);

  const handleJsonChange = useCallback((json: string) => {
    setRawJson(json);
    try {
      const parsed = JSON.parse(json);
      const arr: ComponentConfig[] = Array.isArray(parsed) ? parsed : [parsed];
      setConfig(arr);
      setParseError(null);
      setIsModified(true);
      localStorage.setItem(storageKey, json);
    } catch (e) {
      setParseError((e as Error).message);
    }
  }, [storageKey]);

  const resetToDefault = useCallback(() => {
    const json = JSON.stringify(defaultConfig, null, 2);
    setRawJson(json);
    setConfig(defaultConfig);
    setParseError(null);
    setIsModified(false);
    localStorage.removeItem(storageKey);
  }, [defaultConfig, storageKey]);

  return {
    config,
    rawJson,
    parseError,
    validationErrors: validation.errors,
    isModified,
    handleJsonChange,
    resetToDefault,
  };
}
