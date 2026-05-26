import { useState, useEffect } from "react";
import { useJsonEditor } from "@/hooks/useJsonEditor";
import { useConfigLibrary } from "@/hooks/useConfigLibrary";
import { validateConfig } from "@/utils/validateConfig";
import { DynamicRenderer } from "@/components/renderer/DynamicRenderer";
import { SaveConfigDialog } from "@/components/editor/SaveConfigDialog";
import { ConfigLibrarySheet } from "@/components/editor/ConfigLibrarySheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Play, BookOpen, Save, GitFork, FileCode2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ComponentConfig } from "@/types/config";
import dashboardConfig from "@/configs/sampleDashboard.json";
import formConfig from "@/configs/sampleForm.json";
import tableConfig from "@/configs/sampleTable.json";
import richDemoConfig from "@/configs/richDemo.json";
import { RENDERER_CLONE_KEY } from "@/pages/ConfigsPage";
import { ComponentPalette } from "@/components/renderer/ComponentPalette";
import { ExportCodeDialog } from "@/components/editor/ExportCodeDialog";
import { generateReactComponent } from "@/utils/generateReactComponent";

const templates: Record<string, unknown[]> = {
  dashboard: dashboardConfig,
  form: formConfig,
  table: tableConfig,
  rich: richDemoConfig,
};

export function RendererPage() {
  const [activeTemplate, setActiveTemplate] = useState("rich");
  const [isCloned, setIsCloned] = useState(false);
  const { rawJson, parsed, error, handleChange } = useJsonEditor(templates.rich);
  const { library, saveConfig, deleteConfig, renameConfig } = useConfigLibrary();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Pick up any config cloned from the Config Registry
  useEffect(() => {
    const cloned = sessionStorage.getItem(RENDERER_CLONE_KEY);
    if (cloned) {
      sessionStorage.removeItem(RENDERER_CLONE_KEY);
      handleChange(cloned);
      setActiveTemplate("");
      setIsCloned(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTemplateChange = (val: string) => {
    setActiveTemplate(val);
    setIsCloned(false);
    handleChange(JSON.stringify(templates[val], null, 2));
  };

  const handleSave = (name: string) => {
    saveConfig(name, rawJson);
    toast.success(`Saved "${name}" to your library`);
  };

  const handleLoad = (config: { json: string; name: string }) => {
    handleChange(config.json);
    setActiveTemplate("");
    setIsCloned(false);
    toast.success(`Loaded "${config.name}"`);
  };

  const validation = validateConfig(parsed as unknown[]);
  const isError = !!error || !validation.valid;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Renderer</h1>
            <p className="text-muted-foreground mt-1">Edit JSON to instantly update the UI.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="w-full sm:w-52">
              <Select value={activeTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger data-testid="select-template">
                  <SelectValue placeholder={isCloned ? "Cloned config" : "Load template..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard Config</SelectItem>
                  <SelectItem value="form">Form Config</SelectItem>
                  <SelectItem value="table">Table Config</SelectItem>
                  <SelectItem value="rich">Rich App Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setLibraryOpen(true)}
              data-testid="button-open-library"
            >
              <BookOpen className="h-4 w-4" />
              Library
              {library.length > 0 && (
                <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-px leading-none">
                  {library.length}
                </span>
              )}
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setSaveDialogOpen(true)}
              disabled={isError}
              data-testid="button-save-config"
            >
              <Save className="h-4 w-4" />
              Save to Library
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setExportOpen(true)}
              disabled={isError}
              data-testid="button-export-tsx"
            >
              <FileCode2 className="h-4 w-4" />
              Export TSX
            </Button>
          </div>
        </div>

        <ComponentPalette rawJson={rawJson} onInsert={handleChange} />

        <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-[600px]">
          {/* Editor panel */}
          <div className="w-full lg:w-1/2 flex flex-col border rounded-lg bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-3 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">config.json</span>
                {isCloned && (
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 text-primary border-primary/30 bg-primary/10"
                  >
                    <GitFork className="h-3 w-3" />
                    Cloned from Registry
                  </Badge>
                )}
              </div>
              {isError && (
                <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                  <AlertTriangle className="w-3 h-3" />
                  Invalid JSON
                </span>
              )}
            </div>
            <textarea
              className="w-full flex-1 p-4 font-mono text-sm bg-card text-foreground focus:outline-none resize-none border-0 selection:bg-primary/20"
              value={rawJson}
              onChange={(e) => {
                handleChange(e.target.value);
                if (isCloned) setIsCloned(false);
              }}
              spellCheck={false}
              data-testid="textarea-json-editor"
            />
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 border-t border-destructive/20 font-mono shrink-0">
                <span className="font-semibold">Parse Error: </span>{error}
              </div>
            )}
            {!error && !validation.valid && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 border-t border-destructive/20 font-mono shrink-0">
                <div className="font-semibold mb-1">Validation Errors:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div className="w-full lg:w-1/2 border rounded-lg bg-background shadow-sm overflow-hidden flex flex-col">
            <div className="bg-muted/50 p-3 border-b flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Play className="w-4 h-4" />
              Preview Output
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {!isError ? (
                <DynamicRenderer configs={parsed as ComponentConfig[]} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Fix errors in the JSON configuration to see preview.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <SaveConfigDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />

      <ConfigLibrarySheet
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        library={library}
        onLoad={handleLoad}
        onDelete={deleteConfig}
        onRename={renameConfig}
      />

      <ExportCodeDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        code={generateReactComponent(parsed as unknown[])}
      />
    </>
  );
}
