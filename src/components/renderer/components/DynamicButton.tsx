import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/types/config";

export function DynamicButton({ id, text, variant = "primary", isSubmit, className }: ButtonConfig) {
  const btnVariant = variant === "primary" ? "default" : variant === "danger" ? "destructive" : "secondary";
  const btnType = isSubmit || variant === "primary" ? "submit" : "button";

  return (
    <Button
      id={id}
      type={btnType}
      variant={btnVariant}
      className={className}
      data-testid={`button-${id}`}
    >
      {text}
    </Button>
  );
}
