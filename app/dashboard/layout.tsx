// app/dashboard/layout.tsx
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/reviews", label: "PR Reviews", icon: "🔍" },
  { href: "/dashboard/health", label: "Repo Health", icon: "❤️" },
  { href: "/dashboard/analyze", label: "Analyze PR", icon: "⚡" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-screen">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-lg tracking-tight">CodeSentry</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
          Phase 1 · v0.1.0
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
