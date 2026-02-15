"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Wallet,
  LineChart,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/pnl", label: "P&L Analysis", icon: FileText },
  { href: "/revenue", label: "Revenue & COGS", icon: TrendingUp },
  { href: "/expenses", label: "Expenses & Wages", icon: Wallet },
  { href: "/forecast", label: "Forecast", icon: LineChart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-navy text-white flex flex-col">
      <div className="p-6 border-b border-navy-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center font-bold text-navy text-lg">
            C
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">CHOG</h1>
            <p className="text-xs text-slate-400">Financial Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-teal/20 text-teal"
                  : "text-slate-300 hover:bg-navy-light hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-light">
        <div className="px-4 py-3 rounded-lg bg-navy-light">
          <p className="text-xs text-slate-400">Powered by</p>
          <p className="text-sm font-semibold text-teal">Breeze AI</p>
        </div>
      </div>
    </aside>
  );
}
