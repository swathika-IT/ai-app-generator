import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePageConfig } from "@/hooks/usePageConfig";
import { DynamicRenderer } from "@/components/renderer/DynamicRenderer";
import { InlineConfigEditor } from "@/components/editor/InlineConfigEditor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ComponentConfig } from "@/types/config";
import defaultDashboardConfig from "@/configs/sampleDashboard.json";

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const pageState = usePageConfig("dashboard", defaultDashboardConfig as ComponentConfig[]);
  const { config, parseError, validationErrors } = pageState;
  const hasConfigError = !!parseError || validationErrors.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">
              Dashboard rendered entirely from JSON config. Edit the config to change what appears here.
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
              data-testid="button-edit-dashboard-config"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Edit Config
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : hasConfigError ? (
          <div className="p-6 border border-destructive/40 rounded-xl bg-destructive/5 text-sm text-destructive space-y-1">
            <p className="font-semibold">Invalid config — fix errors in the editor to render the dashboard.</p>
            {parseError && <p className="font-mono text-xs">{parseError}</p>}
            {validationErrors.map((e, i) => <p key={i} className="font-mono text-xs">{e}</p>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 [&>div]:col-span-1">
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
              <Button variant="ghost" size="sm" data-testid="button-toggle-source">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showConfig ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="p-4 border-t bg-muted/40 font-mono text-xs overflow-x-auto">
              <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>

      <InlineConfigEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Dashboard"
        state={pageState}
      />
    </>
  );
}
