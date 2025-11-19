'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { href: "/dashboard/experience", label: "Experience", icon: "🧑‍💼" },
    { href: "/dashboard/education", label: "Education", icon: "🎓" },
    { href: "/dashboard/contact", label: "Contact", icon: "📬" },
    { href: "/dashboard/footer", label: "Footer", icon: "⚙️" },
    { href: "/dashboard/admin-users", label: "Admin Users", icon: "🛡️" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 sm:w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 sm:mb-2 text-white">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">Content Management</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  active
                    ? "bg-gray-800 shadow-md font-semibold text-white"
                    : "bg-transparent hover:bg-gray-800/50 text-gray-300"
                }`}
              >
                <span className="text-lg sm:text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 text-white text-sm sm:text-base"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {children}
      </main>
    </div>
  );
}
