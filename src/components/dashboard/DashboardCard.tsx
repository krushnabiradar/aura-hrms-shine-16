
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: number;
  trendLabel?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
  trendLabel,
}: DashboardCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2 text-xs">
            <span
              className={cn(
                "mr-1",
                isPositiveTrend && "text-green-500",
                isNegativeTrend && "text-red-500"
              )}
            >
              {isPositiveTrend ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
