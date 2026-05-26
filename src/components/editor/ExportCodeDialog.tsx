import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Download, FileCode2 } from "lucide-react";
import { toast } from "sonner";

interface ExportCodeDialogProps {
  open: boolean;
  onClose: () => void;
  code: string;
  defaultName?: string;
}

export function ExportCodeDialog({ open, onClose, code, defaultName = "GeneratedComponent" }: ExportCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [componentName, setComponentName] = useState(defaultName);

  // Swap the function name in the generated code whenever the user types
  const displayCode = componentName.trim()
    ? code.replace(/export function GeneratedComponent/, `export function ${componentName.trim()}`)
    : code;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy — try selecting the text manually");
    }
  }, [displayCode]);

  const handleDownload = useCallback(() => {
    const name = (componentName.trim() || "GeneratedComponent") + ".tsx";
    const blob = new Blob([displayCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${name}`);
  }, [displayCode, componentName]);

  const lineCount = displayCode.split("\n").length;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-primary" />
            Export as React Component
          </DialogTitle>
          <DialogDescription>
            Self-contained TSX — paste into any React + Tailwind project. No extra dependencies needed.
          </DialogDescription>
        </DialogHeader>

        {/* Name field */}
        <div className="px-6 py-4 border-b shrink-0 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Label htmlFor="component-name" className="shrink-0 text-sm">
              Component name
            </Label>
            <Input
              id="component-name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="h-8 text-sm font-mono max-w-56"
              placeholder="GeneratedComponent"
              spellCheck={false}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {lineCount} lines
          </span>
        </div>

        {/* Code block */}
        <div className="flex-1 overflow-auto bg-muted/20 min-h-0">
          <pre className="p-5 font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto">
            <code>{displayCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex items-center justify-between gap-3 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Requires{" "}
            <code className="font-mono bg-muted px-1 rounded">react</code>
            {" "}and{" "}
            <code className="font-mono bg-muted px-1 rounded">tailwindcss</code>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              Download .tsx
            </Button>
            <Button size="sm" className="gap-1.5 h-8" onClick={handleCopy}>
              {copied
                ? <><Check className="h-3.5 w-3.5" /> Copied</>
                : <><Copy className="h-3.5 w-3.5" /> Copy Code</>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
