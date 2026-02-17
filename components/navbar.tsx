"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Wallet,
  LineChart,
  Rocket,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/pnl", label: "P&L Analysis", icon: FileText },
  { href: "/revenue", label: "Revenue & COGS", icon: TrendingUp },
  { href: "/expenses", label: "Expenses & Wages", icon: Wallet },
  { href: "/forecast", label: "Forecast", icon: LineChart },
  { href: "/next-steps", label: "Unlock Profit", icon: Rocket },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Left: Logo + client name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center font-bold text-white text-sm shadow-md">
              B
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">
                CHOG
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Financial Dashboard
              </p>
            </div>
          </div>

          {/* Center: Tab nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-teal/10 text-teal border-b-2 border-teal"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Powered by badge + mobile hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] text-slate-400">Powered by</span>
              <span className="text-[11px] font-bold bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
                Breeze AI
              </span>
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute top-16 right-0 w-64 bg-white shadow-xl border-l border-slate-200 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-teal/10 text-teal"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
