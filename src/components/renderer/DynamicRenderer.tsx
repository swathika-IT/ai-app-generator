import { ComponentConfig } from "@/types/config";
import { componentMap } from "./componentMap";
import { ErrorBoundary } from "./ErrorBoundary";

export function DynamicRenderer({ configs }: { configs: ComponentConfig[] }) {
  return (
    <div className="w-full space-y-4">
      {configs.map((config) => {
        const Component = componentMap[config.type];
        
        if (!Component) {
          return (
            <div key={config.id} className="p-4 border border-dashed rounded-md bg-muted text-muted-foreground text-sm">
              Unsupported component: <code className="font-mono text-primary">{config.type}</code>
            </div>
          );
        }

        return (
          <ErrorBoundary key={config.id}>
            <Component {...config} />
          </ErrorBoundary>
        );
      })}
    </div>
  );
}
