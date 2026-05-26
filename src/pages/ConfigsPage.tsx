import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronDown, RotateCcw, ExternalLink, CheckCircle2,
  AlertTriangle, GitFork, Copy, Check,
} from "lucide-react";
import { toast } from "sonner";
import { ComponentConfig } from "@/types/config";
import defaultDashboardConfig from "@/configs/sampleDashboard.json";
import defaultFormConfig from "@/configs/sampleForm.json";
import defaultTableConfig from "@/configs/sampleTable.json";
import defaultRichConfig from "@/configs/richDemo.json";

export const RENDERER_CLONE_KEY = "appforge_renderer_clone";

interface ConfigEntry {
  key: string;
  title: string;
  description: string;
  route: string;
  defaultConfig: ComponentConfig[];
  storageKey: string | null;
  sourceFile: string;
}

const CONFIGS: ConfigEntry[] = [
  {
    key: "dashboard",
    title: "Dashboard Config",
    description: "Stat cards on the Overview page. Each entry is a card component with title, value, trend, and icon.",
    route: "/",
    defaultConfig: defaultDashboardConfig as ComponentConfig[],
    storageKey: "appforge_page_dashboard",
    sourceFile: "src/configs/sampleDashboard.json",
  },
  {
    key: "forms",
    title: "Form Config",
    description: "Form fields on the Dynamic Forms page. Includes validation rules: required, email, minLength.",
    route: "/forms",
    defaultConfig: defaultFormConfig as ComponentConfig[],
    storageKey: "appforge_page_forms",
    sourceFile: "src/configs/sampleForm.json",
  },
  {
    key: "table",
    title: "Table Config",
    description: "Column definitions and row data for the Dynamic Table. Supports sorting, search, and pagination.",
    route: "/table",
    defaultConfig: defaultTableConfig as ComponentConfig[],
    storageKey: "appforge_page_table",
    sourceFile: "src/configs/sampleTable.json",
  },
  {
    key: "rich",
    title: "Rich Demo Config",
    description: "A nested section layout used in the Live Renderer. Shows sections, headings, inputs, and buttons.",
    route: "/renderer",
    defaultConfig: defaultRichConfig as ComponentConfig[],
    storageKey: null,
    sourceFile: "src/configs/richDemo.json",
  },
];

function getStoredConfig(storageKey: string | null): string | null {
  if (!storageKey) return null;
  try { return localStorage.getItem(storageKey); } catch { return null; }
}

function resetStoredConfig(storageKey: string | null) {
  if (!storageKey) return;
  localStorage.removeItem(storageKey);
}

function CopyButton({ json }: { json: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, [json]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8 text-muted-foreground"
          onClick={handleCopy}
          data-testid="button-copy-json"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy JSON"}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Copy JSON to clipboard</TooltipContent>
    </Tooltip>
  );
}

function ConfigCard({ entry }: { entry: ConfigEntry }) {
  const [expanded, setExpanded] = useState(false);
  const [, forceRender] = useState(0);
  const [, setLocation] = useLocation();

  const storedJson = getStoredConfig(entry.storageKey);
  const isModified = !!storedJson;

  let activeConfig: ComponentConfig[] = entry.defaultConfig;
  let parseError: string | null = null;
  if (storedJson) {
    try {
      activeConfig = JSON.parse(storedJson);
    } catch (e) {
      parseError = (e as Error).message;
      activeConfig = entry.defaultConfig;
    }
  }

  const activeJson = JSON.stringify(activeConfig, null, 2);
  const componentCount = Array.isArray(activeConfig) ? activeConfig.length : 0;

  const handleReset = () => {
    resetStoredConfig(entry.storageKey);
    toast.success(`"${entry.title}" reset to default`);
    forceRender((n) => n + 1);
  };

  const handleClone = () => {
    sessionStorage.setItem(RENDERER_CLONE_KEY, activeJson);
    setLocation("/renderer");
    toast.success(`Cloned "${entry.title}" to Live Renderer`, {
      description: "The config is now loaded in the editor.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl bg-card shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{entry.title}</h3>
              {isModified ? (
                <Badge variant="secondary" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  Modified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Default
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs font-normal">
                {componentCount} component{componentCount !== 1 ? "s" : ""}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
            {parseError && (
              <p className="text-xs text-destructive font-mono mt-1">Parse error: {parseError}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {isModified && entry.storageKey && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground h-8"
                    onClick={handleReset}
                    data-testid={`button-reset-${entry.key}`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Restore default config</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8 border-primary/40 text-primary hover:bg-primary/5"
                  onClick={handleClone}
                  data-testid={`button-clone-${entry.key}`}
                >
                  <GitFork className="h-3.5 w-3.5" />
                  Clone to Renderer
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Open this config in the Live Renderer for editing
              </TooltipContent>
            </Tooltip>

            <Link href={entry.route}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8"
                data-testid={`button-open-${entry.key}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <div className="border-t px-5 py-2 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs text-muted-foreground font-mono truncate">
              {isModified ? "localStorage override active" : entry.sourceFile}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <CopyButton json={activeJson} />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                View JSON
                <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="border-t bg-muted/20 p-4 font-mono text-xs overflow-x-auto max-h-72">
            <pre><code>{activeJson}</code></pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

export function ConfigsPage() {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Config Registry</h1>
          <p className="text-muted-foreground mt-2">
            Every page in AppForge is driven by a JSON config. View the active config for each page,
            reset overrides, copy JSON, or clone a config directly into the Live Renderer to experiment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CONFIGS.map((entry) => (
            <ConfigCard key={entry.key} entry={entry} />
          ))}
        </div>

        <div className="border rounded-xl p-6 bg-muted/30 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">1. JSON Source Files</p>
              <p className="text-muted-foreground text-xs">
                Each page loads its default config from{" "}
                <code className="font-mono bg-muted px-1 rounded">src/configs/*.json</code>. No hardcoded UI elements.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">2. localStorage Overrides</p>
              <p className="text-muted-foreground text-xs">
                Editing a config via the "Edit Config" button on any page persists the override in localStorage.
                The "Modified" badge shows when an override is active.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">3. DynamicRenderer</p>
              <p className="text-muted-foreground text-xs">
                The active config array is passed to{" "}
                <code className="font-mono bg-muted px-1 rounded">DynamicRenderer</code>, which looks up each{" "}
                <code className="font-mono bg-muted px-1 rounded">type</code> in{" "}
                <code className="font-mono bg-muted px-1 rounded">componentMap</code> and renders it.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">4. Clone to Renderer</p>
              <p className="text-muted-foreground text-xs">
                The "Clone to Renderer" button copies the current active config (including any overrides) into the
                Live Renderer so you can freely experiment without modifying the source page's config.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
