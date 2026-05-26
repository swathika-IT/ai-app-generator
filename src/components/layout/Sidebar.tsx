import { Link, useLocation } from "wouter";
import { LayoutDashboard, Code, FormInput, TableProperties, Bot, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/",          label: "Dashboard",       icon: LayoutDashboard },
    { href: "/renderer",  label: "JSON Live Preview", icon: Code },
    { href: "/forms",     label: "Dynamic Forms",   icon: FormInput },
    { href: "/table",     label: "Dynamic Table",   icon: TableProperties },
    { href: "/configs",   label: "Config Registry", icon: Settings2 },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r bg-background transition-transform duration-300 sm:flex",
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center border-b px-6 lg:h-[60px] shrink-0">
          <Link href="/" className="flex items-center gap-2 font-semibold" onClick={onClose}>
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight">AppForge</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground"
                  )}
                  onClick={onClose}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t px-4 py-3 shrink-0">
          <p className="text-xs text-muted-foreground px-3">
            Metadata-driven UI runtime
          </p>
        </div>
      </aside>
    </>
  );
}
