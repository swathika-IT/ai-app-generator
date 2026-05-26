import { useState, useEffect, useCallback } from "react";

export interface SavedConfig {
  id: string;
  name: string;
  json: string;
  savedAt: number;
}

const STORAGE_KEY = "appforge_config_library";

function loadFromStorage(): SavedConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedConfig[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(configs: SavedConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function useConfigLibrary() {
  const [library, setLibrary] = useState<SavedConfig[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(library);
  }, [library]);

  const saveConfig = useCallback((name: string, json: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const entry: SavedConfig = {
      id: `cfg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      json,
      savedAt: Date.now(),
    };
    setLibrary((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const deleteConfig = useCallback((id: string) => {
    setLibrary((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const renameConfig = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setLibrary((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
    );
  }, []);

  const updateConfig = useCallback((id: string, json: string) => {
    setLibrary((prev) =>
      prev.map((c) => (c.id === id ? { ...c, json, savedAt: Date.now() } : c))
    );
  }, []);

  return { library, saveConfig, deleteConfig, renameConfig, updateConfig };
}
