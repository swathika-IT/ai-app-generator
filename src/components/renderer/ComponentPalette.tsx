import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TextCursorInput, AlignLeft, ListFilter, MousePointerClick,
  LayoutDashboard, Table2, Layers, Heading1, ChevronDown, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { ComponentConfig } from "@/types/config";

interface PaletteItem {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  snippet: () => Omit<ComponentConfig, "id">;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: "heading",
    label: "Heading",
    description: "Section title (h1–h4)",
    icon: Heading1,
    snippet: () => ({
      type: "heading",
      text: "Heading Text",
      level: 2,
    }),
  },
  {
    type: "input",
    label: "Input",
    description: "Single-line text field with optional validation",
    icon: TextCursorInput,
    snippet: () => ({
      type: "input",
      label: "Text Field",
      placeholder: "Enter text...",
    }),
  },
  {
    type: "textarea",
    label: "Textarea",
    description: "Multi-line text input",
    icon: AlignLeft,
    snippet: () => ({
      type: "textarea",
      label: "Text Area",
      placeholder: "Enter text...",
      rows: 4,
    }),
  },
  {
    type: "select",
    label: "Select",
    description: "Dropdown with configurable options",
    icon: ListFilter,
    snippet: () => ({
      type: "select",
      label: "Dropdown",
      options: [
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2" },
        { label: "Option 3", value: "opt3" },
      ],
    }),
  },
  {
    type: "button",
    label: "Button",
    description: "Action button with primary / secondary / danger variant",
    icon: MousePointerClick,
    snippet: () => ({
      type: "button",
      text: "Click Me",
      variant: "primary",
    }),
  },
  {
    type: "card",
    label: "Card",
    description: "Metric card with value, trend, and icon",
    icon: LayoutDashboard,
    snippet: () => ({
      type: "card",
      title: "Metric",
      value: "42",
      description: "Change from last period",
      trend: 5,
    }),
  },
  {
    type: "table",
    label: "Table",
    description: "Data table with sortable columns and rows",
    icon: Table2,
    snippet: () => ({
      type: "table",
      label: "Data Table",
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "status", label: "Status" },
        { key: "value", label: "Value", sortable: true },
      ],
      rows: [
        { name: "Row 1", status: "Active", value: 100 },
        { name: "Row 2", status: "Inactive", value: 200 },
      ],
    }),
  },
  {
    type: "section",
    label: "Section",
    description: "Container with an optional title and nested children",
    icon: Layers,
    snippet: () => ({
      type: "section",
      title: "Section Title",
      children: [],
    }),
  },
];

interface ComponentPaletteProps {
  rawJson: string;
  onInsert: (newJson: string) => void;
}

export function ComponentPalette({ rawJson, onInsert }: ComponentPaletteProps) {
  const [open, setOpen] = useState(true);

  const handleInsert = (item: PaletteItem) => {
    let current: ComponentConfig[];
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        toast.error("Config must be a JSON array to insert a component.");
        return;
      }
      current = parsed;
    } catch {
      toast.error("Fix JSON parse errors before inserting a component.");
      return;
    }

    const id = `${item.type}-${Date.now()}`;
    const newItem = { id, ...item.snippet() } as ComponentConfig;
    const updated = [...current, newItem];
    onInsert(JSON.stringify(updated, null, 2));
    toast.success(`Added ${item.label}`, { description: `id: "${id}"` });
  };

  return (
    <TooltipProvider>
      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <button
          className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-testid="palette-toggle"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">Component Palette</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — click a type to insert a starter snippet
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Chip grid */}
        {open && (
          <div className="px-4 py-3 flex flex-wrap gap-2 border-t bg-background/50">
            {PALETTE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs font-normal hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => handleInsert(item)}
                      data-testid={`palette-insert-${item.type}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {item.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
