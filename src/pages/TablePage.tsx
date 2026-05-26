import { useState } from "react";
import { motion } from "framer-motion";
import { usePageConfig } from "@/hooks/usePageConfig";
import { DynamicRenderer } from "@/components/renderer/DynamicRenderer";
import { InlineConfigEditor } from "@/components/editor/InlineConfigEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Code, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ComponentConfig } from "@/types/config";
import defaultTableConfig from "@/configs/sampleTable.json";

export function TablePage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const pageState = usePageConfig("table", defaultTableConfig as ComponentConfig[]);
  const { config, parseError, validationErrors } = pageState;
  const hasConfigError = !!parseError || validationErrors.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dynamic Table</h1>
            <p className="text-muted-foreground mt-1">
              Columns, rows, sorting, and pagination are all driven by JSON config. Edit the config to reshape the table.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pageState.isModified && (
              <Badge variant="secondary" className="text-xs">Config Modified</Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setEditorOpen(true)}
              data-testid="button-edit-table-config"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Edit Config
            </Button>
          </div>
        </div>

        {hasConfigError ? (
          <div className="p-6 border border-destructive/40 rounded-xl bg-destructive/5 text-sm text-destructive space-y-1">
            <p className="font-semibold">Invalid config — fix errors in the editor to render the table.</p>
            {parseError && <p className="font-mono text-xs">{parseError}</p>}
            {validationErrors.map((e, i) => <p key={i} className="font-mono text-xs">{e}</p>)}
          </div>
        ) : (
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <DynamicRenderer configs={config} />
          </div>
        )}

        <Collapsible
          open={showConfig}
          onOpenChange={setShowConfig}
          className="border rounded-lg bg-card"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Active JSON Configuration</h3>
              {pageState.isModified && (
                <Badge variant="outline" className="text-xs">Modified</Badge>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showConfig ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="p-4 border-t bg-muted/40 font-mono text-xs overflow-x-auto max-h-96">
              <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>

      <InlineConfigEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Dynamic Table"
        state={pageState}
      />
    </>
  );
}
