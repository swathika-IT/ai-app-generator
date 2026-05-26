import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SelectConfig } from "@/types/config";
import { useFormContext, Controller } from "react-hook-form";

export function SelectField({ id, label, options, className }: SelectConfig) {
  const form = useFormContext();

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {form ? (
        <Controller
          control={form.control}
          name={id}
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger id={id} data-testid={`select-${id}`}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} data-testid={`select-item-${opt.value}`}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors[id] && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors[id]?.message as string}</p>
              )}
            </div>
          )}
        />
      ) : (
        <Select>
          <SelectTrigger id={id} data-testid={`select-${id}`}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} data-testid={`select-item-${opt.value}`}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
