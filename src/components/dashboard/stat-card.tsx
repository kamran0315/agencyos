import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, trend, hint }: StatCardProps) {
  const positive = trend !== undefined && trend >= 0;
  return (
    <Card className="gap-2 py-5">
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {(trend !== undefined || hint) && (
            <div className="flex items-center gap-1.5 text-xs">
              {trend !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {positive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                  {Math.abs(trend)}%
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
