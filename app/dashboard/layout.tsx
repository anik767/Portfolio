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
    <div className="min-h-screen flex bg-gray-50">
      <aside className="fixed left-0 top-0 h-screen w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400">Content Management</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? "bg-gray-800 shadow-md font-semibold text-white"
                    : "bg-transparent hover:bg-gray-800/50 text-gray-300"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 text-white"
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
