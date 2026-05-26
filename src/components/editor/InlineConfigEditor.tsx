import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw, Code } from "lucide-react";
import { PageConfigState } from "@/hooks/usePageConfig";

interface InlineConfigEditorProps {
  open: boolean;
  onClose: () => void;
  title: string;
  state: PageConfigState;
}

export function InlineConfigEditor({ open, onClose, title, state }: InlineConfigEditorProps) {
  const { rawJson, parseError, validationErrors, isModified, handleJsonChange, resetToDefault } = state;
  const hasError = !!parseError || validationErrors.length > 0;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Code className="h-4 w-4 text-primary" />
              Edit Config — {title}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {isModified && (
                <Badge variant="secondary" className="text-xs font-normal">
                  Modified
                </Badge>
              )}
              {hasError && (
                <Badge variant="destructive" className="text-xs font-normal gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Error
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Changes apply instantly and persist across reloads.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <textarea
            className="w-full flex-1 p-4 font-mono text-xs bg-muted/20 text-foreground focus:outline-none resize-none border-0 min-h-0"
            value={rawJson}
            onChange={(e) => handleJsonChange(e.target.value)}
            spellCheck={false}
            data-testid={`editor-${title.toLowerCase().replace(/\s+/g, "-")}`}
          />

          {parseError && (
            <div className="shrink-0 border-t border-destructive/20 bg-destructive/10 p-3 font-mono text-xs text-destructive">
              <span className="font-semibold">Parse Error: </span>{parseError}
            </div>
          )}

          {!parseError && validationErrors.length > 0 && (
            <div className="shrink-0 border-t border-destructive/20 bg-destructive/10 p-3 font-mono text-xs text-destructive space-y-1">
              <div className="font-semibold">Validation Errors:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t px-4 py-3 flex items-center justify-between gap-2 bg-background">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={resetToDefault}
            disabled={!isModified}
            data-testid="button-reset-config"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </Button>
          <div className="text-xs text-muted-foreground">
            {Array.isArray(JSON.parse(rawJson.trim() || "[]")) ? "" : ""}
            Auto-saved to localStorage
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
