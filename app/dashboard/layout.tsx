'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin");
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊", exact: true },
    { href: "/dashboard/project", label: "Projects", icon: "📝" },
    { href: "/dashboard/hero", label: "Hero Section", icon: "🎯" },
    { href: "/dashboard/about", label: "About Section", icon: "👤" },
    { href: "/dashboard/skills", label: "Technical Skills", icon: "🛠️" },
    { href: "/dashboard/services", label: "Services", icon: "💼" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-white/80">Content Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/20 backdrop-blur-sm shadow-lg scale-105 font-semibold"
                    : "bg-white/5 hover:bg-white/10 hover:scale-[1.02]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-72 p-8">{children}</main>
    </div>
  );
}
