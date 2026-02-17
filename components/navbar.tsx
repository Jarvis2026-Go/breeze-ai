"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Scale,
  ArrowDownUp,
  TrendingUp,
  Wallet,
  LineChart,
  Rocket,
  Target,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Financials",
    items: [
      { href: "/pnl", label: "P&L", icon: FileText },
      { href: "/balance-sheet", label: "Balance Sheet", icon: Scale },
      { href: "/cash-flow", label: "Cash Flow", icon: ArrowDownUp },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/revenue", label: "Revenue & COGS", icon: TrendingUp },
      { href: "/expenses", label: "Expenses & Wages", icon: Wallet },
    ],
  },
  {
    label: "Strategy",
    items: [
      { href: "/break-even", label: "Break-Even Analysis", icon: Target },
      { href: "/forecast", label: "Forecast", icon: LineChart },
      { href: "/next-steps", label: "Unlock Profit", icon: Rocket },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  function isGroupActive(group: NavGroup): boolean {
    if (group.href) return pathname === group.href;
    return group.items?.some((item) => pathname === item.href) ?? false;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6">
          {/* Top row: Logo + badge + hamburger */}
          <div className="h-14 flex items-center justify-between">
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

          {/* Desktop nav row */}
          <div
            ref={navRef}
            className="hidden md:flex items-center gap-1 h-10 -mb-px"
          >
            {navGroups.map((group) => {
              const active = isGroupActive(group);

              // Direct link (Overview)
              if (group.href) {
                return (
                  <Link
                    key={group.label}
                    href={group.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all border-b-2",
                      active
                        ? "text-teal border-teal"
                        : "text-slate-500 border-transparent hover:text-slate-900"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {group.label}
                  </Link>
                );
              }

              // Dropdown group
              const isOpen = openGroup === group.label;
              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() =>
                      setOpenGroup(isOpen ? null : group.label)
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all border-b-2",
                      active
                        ? "text-teal border-teal"
                        : "text-slate-500 border-transparent hover:text-slate-900"
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 py-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                      {group.items!.map((item) => {
                        const itemActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                              itemActive
                                ? "bg-teal/10 text-teal"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
          <nav className="absolute top-14 right-0 w-64 bg-white shadow-xl border-l border-slate-200 p-4 space-y-4">
            {navGroups.map((group) => {
              if (group.href) {
                const active = pathname === group.href;
                return (
                  <Link
                    key={group.label}
                    href={group.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-teal/10 text-teal"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {group.icon && <group.icon className="w-5 h-5" />}
                    {group.label}
                  </Link>
                );
              }

              return (
                <div key={group.label}>
                  <p className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider px-4 mb-1">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items!.map((item) => {
                      const itemActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                            itemActive
                              ? "bg-teal/10 text-teal"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
