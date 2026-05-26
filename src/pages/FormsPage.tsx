import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePageConfig } from "@/hooks/usePageConfig";
import { buildFormSchema, getFormDefaultValues } from "@/utils/buildFormSchema";
import { DynamicRenderer } from "@/components/renderer/DynamicRenderer";
import { InlineConfigEditor } from "@/components/editor/InlineConfigEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, SlidersHorizontal } from "lucide-react";
import { ComponentConfig } from "@/types/config";
import defaultFormConfig from "@/configs/sampleForm.json";

export function FormsPage() {
  const [editorOpen, setEditorOpen] = useState(false);

  const pageState = usePageConfig("forms", defaultFormConfig as ComponentConfig[]);
  const { config, parseError, validationErrors } = pageState;

  const hasConfigError = !!parseError || validationErrors.length > 0;

  const schema = hasConfigError ? undefined : buildFormSchema(config);
  const defaultValues = getFormDefaultValues(config);

  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const onSubmit = (data: Record<string, string>) => {
    toast.success("Form submitted successfully!", {
      description: `${Object.keys(data).length} field(s) received.`,
    });
    methods.reset(getFormDefaultValues(config));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dynamic Forms</h1>
            <p className="text-muted-foreground mt-2">
              Form fields, layout, and validation rules are all derived from JSON config.
              No hardcoded schema.
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
              data-testid="button-edit-form-config"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Edit Config
            </Button>
          </div>
        </div>

        {hasConfigError ? (
          <div className="p-6 border border-destructive/40 rounded-xl bg-destructive/5 text-sm text-destructive space-y-1">
            <p className="font-semibold">Invalid config — fix errors to render the form.</p>
            {parseError && <p className="font-mono text-xs">{parseError}</p>}
            {validationErrors.map((e, i) => <p key={i} className="font-mono text-xs">{e}</p>)}
          </div>
        ) : (
          <div className="p-8 border rounded-xl bg-card shadow-sm">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit as any)} className="space-y-6">
                <DynamicRenderer configs={config} />
              </form>
            </FormProvider>
          </div>
        )}

        <div>
          <h3 className="flex items-center gap-2 font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">
            <Code className="h-4 w-4" />
            Active JSON Configuration
          </h3>
          <div className="p-4 border rounded-lg bg-muted/40 font-mono text-xs overflow-x-auto max-h-80">
            <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
          </div>
        </div>
      </motion.div>

      <InlineConfigEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Dynamic Forms"
        state={pageState}
      />
    </>
  );
}
