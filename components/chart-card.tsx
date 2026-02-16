import { cn } from "@/lib/utils";

const headerColors: Record<string, { border: string; bg: string }> = {
  teal: { border: "border-l-teal", bg: "bg-gradient-to-r from-teal/5 to-transparent" },
  coral: { border: "border-l-coral", bg: "bg-gradient-to-r from-coral/5 to-transparent" },
  purple: { border: "border-l-indigo-500", bg: "bg-gradient-to-r from-indigo-50/50 to-transparent" },
  emerald: { border: "border-l-emerald-500", bg: "bg-gradient-to-r from-emerald-50/50 to-transparent" },
  amber: { border: "border-l-amber-500", bg: "bg-gradient-to-r from-amber-50/50 to-transparent" },
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerColor?: string;
}

export function ChartCard({ title, subtitle, children, className, headerColor }: ChartCardProps) {
  const color = headerColor ? headerColors[headerColor] : null;

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden",
      color && `border-l-4 ${color.border}`,
      className
    )}>
      <div className={cn("px-6 pt-6 pb-2", color?.bg)}>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
}
