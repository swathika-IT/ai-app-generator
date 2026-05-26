import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Download, Pencil, Check, X, BookOpen } from "lucide-react";
import { SavedConfig } from "@/hooks/useConfigLibrary";
import { cn } from "@/lib/utils";

interface ConfigLibrarySheetProps {
  open: boolean;
  onClose: () => void;
  library: SavedConfig[];
  onLoad: (config: SavedConfig) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function ConfigItem({
  config,
  onLoad,
  onDelete,
  onRename,
}: {
  config: SavedConfig;
  onLoad: (c: SavedConfig) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(config.name);

  const commitRename = () => {
    if (draftName.trim()) onRename(config.id, draftName.trim());
    else setDraftName(config.name);
    setEditing(false);
  };

  const cancelRename = () => {
    setDraftName(config.name);
    setEditing(false);
  };

  let preview = "—";
  try {
    const parsed = JSON.parse(config.json);
    const count = Array.isArray(parsed) ? parsed.length : 1;
    preview = `${count} component${count !== 1 ? "s" : ""}`;
  } catch {
    preview = "Invalid JSON";
  }

  return (
    <div
      className="group flex flex-col gap-1.5 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
      data-testid={`config-item-${config.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        {editing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") cancelRename();
              }}
              className="h-7 text-sm"
              autoFocus
              data-testid={`input-rename-${config.id}`}
            />
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={commitRename}>
              <Check className="h-3.5 w-3.5 text-green-500" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={cancelRename}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        ) : (
          <p className="font-medium text-sm leading-tight truncate flex-1">{config.name}</p>
        )}
        {!editing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              title="Rename"
              onClick={() => setEditing(true)}
              data-testid={`button-rename-${config.id}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              title="Delete"
              onClick={() => onDelete(config.id)}
              data-testid={`button-delete-${config.id}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-normal px-1.5 py-0">
            {preview}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(config.savedAt)}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 shrink-0"
          onClick={() => onLoad(config)}
          data-testid={`button-load-${config.id}`}
        >
          <Download className="h-3 w-3" />
          Load
        </Button>
      </div>
    </div>
  );
}

export function ConfigLibrarySheet({
  open,
  onClose,
  library,
  onLoad,
  onDelete,
  onRename,
}: ConfigLibrarySheetProps) {
  const [search, setSearch] = useState("");

  const filtered = library.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Config Library
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pt-4 pb-2">
          <Input
            placeholder="Search configs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
            data-testid="input-library-search"
          />
        </div>

        <ScrollArea className="flex-1 px-4 pb-4">
          {library.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
              <BookOpen className="h-10 w-10 opacity-30" />
              <div>
                <p className="font-medium text-sm">No saved configs yet</p>
                <p className="text-xs mt-1">
                  Use the "Save to Library" button in the renderer to save your configs here.
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No configs match "{search}"
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {filtered.map((config) => (
                <ConfigItem
                  key={config.id}
                  config={config}
                  onLoad={(c) => { onLoad(c); onClose(); }}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          {library.length} config{library.length !== 1 ? "s" : ""} saved
          {library.length > 0 && " · stored in localStorage"}
        </div>
      </SheetContent>
    </Sheet>
  );
}
