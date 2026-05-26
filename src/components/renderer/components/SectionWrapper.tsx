import { SectionConfig } from "@/types/config";
import { DynamicRenderer } from "../DynamicRenderer";

export function SectionWrapper({ id, title, children, className }: SectionConfig) {
  return (
    <section id={id} className={`p-6 border rounded-lg bg-card text-card-foreground shadow-sm ${className || ""}`} data-testid={`section-${id}`}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <DynamicRenderer configs={children} />
    </section>
  );
}
