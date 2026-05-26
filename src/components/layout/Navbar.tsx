import { useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  const routeMap: Record<string, string> = {
    "/":          "Dashboard",
    "/renderer":  "JSON Live Preview",
    "/forms":     "Dynamic Forms",
    "/table":     "Dynamic Table",
    "/configs":   "Config Registry",
  };

  const title = routeMap[location] || "AppForge";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4 sm:px-6 lg:h-[60px]">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">Pages</span>
          <span>/</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle} title="Toggle theme" data-testid="button-theme-toggle">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
