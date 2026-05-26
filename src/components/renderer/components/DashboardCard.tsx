import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardConfig } from "@/types/config";
import * as Icons from "lucide-react";

export function DashboardCard({ id, title, value, description, trend, icon, className }: CardConfig) {
  // @ts-ignore - dynamic icon loading
  const Icon = icon && Icons[icon as keyof typeof Icons] ? Icons[icon as keyof typeof Icons] : null;
  
  return (
    <Card className={className} data-testid={`card-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* @ts-ignore */}
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {trend !== undefined && (
              <span className={trend >= 0 ? "text-emerald-500" : "text-red-500"}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
            )}
            <span>{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
