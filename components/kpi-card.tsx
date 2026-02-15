import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  BarChart3,
  Building2,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dollar: DollarSign,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  percent: Percent,
  bar: BarChart3,
  building: Building2,
  users: Users,
};

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
}

export function KPICard({ label, value, change, changeType, icon }: KPICardProps) {
  const Icon = iconMap[icon] || DollarSign;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-positive",
                changeType === "negative" && "text-negative",
                changeType === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            changeType === "positive" && "bg-green-50",
            changeType === "negative" && "bg-red-50",
            (!changeType || changeType === "neutral") && "bg-teal/10"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              changeType === "positive" && "text-positive",
              changeType === "negative" && "text-negative",
              (!changeType || changeType === "neutral") && "text-teal"
            )}
          />
        </div>
      </div>
    </div>
  );
}
