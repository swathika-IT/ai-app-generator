export interface BaseComponentConfig {
  id: string;
  type: string;
  label?: string;
  className?: string;
}

export interface InputConfig extends BaseComponentConfig {
  type: "input";
  placeholder?: string;
  inputType?: string;
  required?: boolean;
  validation?: "email" | "url";
  minLength?: number;
  maxLength?: number;
}

export interface TextareaConfig extends BaseComponentConfig {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface SelectConfig extends BaseComponentConfig {
  type: "select";
  options: { label: string; value: string }[];
  required?: boolean;
}

export interface ButtonConfig extends BaseComponentConfig {
  type: "button";
  text: string;
  variant?: "primary" | "secondary" | "danger";
  isSubmit?: boolean;
}

export interface CardConfig extends BaseComponentConfig {
  type: "card";
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: string;
}

export interface TableConfig extends BaseComponentConfig {
  type: "table";
  columns: { key: string; label: string; sortable?: boolean }[];
  rows: Record<string, string | number>[];
}

export interface SectionConfig extends BaseComponentConfig {
  type: "section";
  title?: string;
  children: ComponentConfig[];
}

export interface HeadingConfig extends BaseComponentConfig {
  type: "heading";
  text: string;
  level?: 1 | 2 | 3 | 4;
}

export type ComponentConfig =
  | InputConfig
  | TextareaConfig
  | SelectConfig
  | ButtonConfig
  | CardConfig
  | TableConfig
  | SectionConfig
  | HeadingConfig;
