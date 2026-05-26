import { useState } from "react";

export function useJsonEditor(initialConfig: unknown[]) {
  const [rawJson, setRawJson] = useState(JSON.stringify(initialConfig, null, 2));
  const [parsed, setParsed] = useState<unknown[]>(initialConfig);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (value: string) => {
    setRawJson(value);
    try {
      const p = JSON.parse(value);
      setParsed(Array.isArray(p) ? p : [p]);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  
  return { rawJson, parsed, error, handleChange };
}
