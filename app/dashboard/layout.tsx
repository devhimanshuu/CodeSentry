// app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitPullRequest,
  HeartPulse,
  Zap,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/reviews", label: "PR Reviews", icon: GitPullRequest },
  { href: "/dashboard/health", label: "Repo Health", icon: HeartPulse },
  { href: "/dashboard/analyze", label: "Analyze PR", icon: Zap },
];

function SidebarIcon({ icon: Icon, active }: { icon: React.ElementType; active?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${active
          ? "bg-brand-500/15 text-brand-400 shadow-glow-sm"
          : "text-gray-500 group-hover:text-gray-300"
        }`}
    >
      <Icon className="w-[18px] h-[18px]" />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen">
      {/* ═══════ SIDEBAR ═══════ */}
      <aside
        className={`fixed h-screen flex flex-col z-30 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64"
          }`}
        style={{
          background: "rgba(10, 10, 26, 0.85)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm flex-shrink-0 group-hover:shadow-glow transition-shadow duration-300">
              <Shield className="w-[18px] h-[18px] text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                Code<span className="text-gradient">Sentry</span>
              </span>
            )}
          </Link>
        </div>

        {/* Search (expanded only) */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/30 transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-white/[0.04] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 space-y-1">
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
              Main
            </div>
          )}
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                    ? "text-white bg-brand-500/10 border border-brand-500/15"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
                  } ${collapsed ? "justify-center" : ""}`}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-gradient-to-b from-brand-400 to-brand-600" />
                )}
                <SidebarIcon icon={item.icon} active={active} />
                {!collapsed && <span>{item.label}</span>}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 space-y-1">
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
              System
            </div>
          )}
          <button
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] transition-all duration-200 w-full ${collapsed ? "justify-center" : ""
              }`}
          >
            <SidebarIcon icon={Settings} />
            {!collapsed && <span>Settings</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition-all duration-200 w-full ${collapsed ? "justify-center" : ""
              }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>

          {/* Version tag */}
          {!collapsed && (
            <div className="px-3 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 text-[10px] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                Phase 1 · v1.0.0
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-[72px]" : "ml-64"
          }`}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 h-16 flex items-center justify-between px-8 border-b border-white/[0.04]"
          style={{
            background: "rgba(7, 7, 26, 0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <h2 className="text-sm font-semibold text-white">
              {navItems.find((n) => isActive(n.href))?.label || "Dashboard"}
            </h2>
            <p className="text-[11px] text-gray-600">AI Engineering Intelligence</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-white/10 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-[#07071a]" />
            </button>

            {/* Docs link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-white/10 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-xs font-bold text-white">
              CS
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
