import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputConfig } from "@/types/config";
import { useFormContext } from "react-hook-form";

export function InputField({ id, label, placeholder, inputType = "text", className }: InputConfig) {
  const form = useFormContext();

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {form ? (
        <div>
          <Input id={id} type={inputType} placeholder={placeholder} {...form.register(id)} data-testid={`input-${id}`} />
          {form.formState.errors[id] && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors[id]?.message as string}</p>
          )}
        </div>
      ) : (
        <Input id={id} type={inputType} placeholder={placeholder} data-testid={`input-${id}`} />
      )}
    </div>
  );
}
