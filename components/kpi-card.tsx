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

const colorSchemes = {
  teal: {
    topBar: "bg-gradient-to-r from-teal to-teal-dark",
    iconBg: "bg-gradient-to-br from-teal/20 to-teal/5",
    iconColor: "text-teal-dark",
    glow: "hover:shadow-glow-teal",
  },
  coral: {
    topBar: "bg-gradient-to-r from-coral to-coral-dark",
    iconBg: "bg-gradient-to-br from-coral/20 to-coral/5",
    iconColor: "text-coral-dark",
    glow: "hover:shadow-glow-coral",
  },
  purple: {
    topBar: "bg-gradient-to-r from-indigo-500 to-purple-500",
    iconBg: "bg-gradient-to-br from-indigo-100 to-purple-50",
    iconColor: "text-indigo-600",
    glow: "hover:shadow-glow-purple",
  },
  emerald: {
    topBar: "bg-gradient-to-r from-emerald-500 to-green-500",
    iconBg: "bg-gradient-to-br from-emerald-100 to-green-50",
    iconColor: "text-emerald-600",
    glow: "hover:shadow-glow-emerald",
  },
};

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  colorScheme?: keyof typeof colorSchemes;
}

export function KPICard({ label, value, change, changeType, icon, colorScheme = "teal" }: KPICardProps) {
  const Icon = iconMap[icon] || DollarSign;
  const scheme = colorSchemes[colorScheme];

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300",
      scheme.glow
    )}>
      <div className={cn("h-1.5", scheme.topBar)} />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-3xl font-black text-slate-900">{value}</p>
            {change && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  changeType === "positive" && "bg-green-50 text-positive",
                  changeType === "negative" && "bg-red-50 text-negative",
                  changeType === "neutral" && "bg-slate-50 text-slate-500"
                )}
              >
                {change}
              </span>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl transition-transform duration-300 hover:scale-110",
              scheme.iconBg
            )}
          >
            <Icon className={cn("w-5 h-5", scheme.iconColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}
