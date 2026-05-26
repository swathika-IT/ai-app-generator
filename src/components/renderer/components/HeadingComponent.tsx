import { HeadingConfig } from "@/types/config";

export function HeadingComponent({ id, text, level = 2, className }: HeadingConfig) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  
  const sizes = {
    1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
    2: "text-3xl font-semibold tracking-tight first:mt-0",
    3: "text-2xl font-semibold tracking-tight",
    4: "text-xl font-semibold tracking-tight",
  };
  
  return (
    <Tag id={id} className={`${sizes[level]} ${className || ""}`} data-testid={`heading-${id}`}>
      {text}
    </Tag>
  );
}
