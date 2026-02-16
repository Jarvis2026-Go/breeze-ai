import { cn } from "@/lib/utils";
import { Insight } from "@/lib/types";
import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    titleColor: "text-amber-800",
  },
  positive: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-500",
    titleColor: "text-green-800",
  },
  critical: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    titleColor: "text-red-800",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
  },
};

interface InsightPanelProps {
  insights: Insight[];
  title?: string;
}

export function InsightPanel({ insights, title = "AI Insights" }: InsightPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal to-teal-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold text-white">AI</span>
        </span>
        <h3 className="font-bold bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={cn(
                "p-4 rounded-xl border-2 transition-shadow hover:shadow-lg",
                config.bg,
                config.border
              )}
            >
              <div className="flex gap-3">
                <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconColor)} />
                <div>
                  <p className={cn("font-medium text-sm", config.titleColor)}>
                    {insight.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
