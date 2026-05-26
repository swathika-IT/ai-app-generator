export function validateConfig(configs: unknown[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(configs)) {
    return { valid: false, errors: ["Configuration must be an array of components"] };
  }

  configs.forEach((cfg, i) => {
    if (typeof cfg !== "object" || cfg === null) {
      errors.push(`Item ${i}: must be an object`);
      return;
    }
    const c = cfg as Record<string, unknown>;
    if (!c.id) errors.push(`Item ${i}: missing required field "id"`);
    if (!c.type) errors.push(`Item ${i}: missing required field "type"`);
  });
  
  return { valid: errors.length === 0, errors };
}
