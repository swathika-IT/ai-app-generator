import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TextareaConfig } from "@/types/config";
import { useFormContext } from "react-hook-form";

export function TextareaField({ id, label, placeholder, rows = 3, className }: TextareaConfig) {
  const form = useFormContext();

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {form ? (
        <div>
          <Textarea id={id} placeholder={placeholder} rows={rows} {...form.register(id)} data-testid={`textarea-${id}`} />
          {form.formState.errors[id] && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors[id]?.message as string}</p>
          )}
        </div>
      ) : (
        <Textarea id={id} placeholder={placeholder} rows={rows} data-testid={`textarea-${id}`} />
      )}
    </div>
  );
}
