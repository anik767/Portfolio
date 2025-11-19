"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  createdAt?: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  async function loadProjects() {
    try {
      const res = await fetch("/api/project", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.project)) {
        setProjects(data.project);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }

  useEffect(() => {
    async function checkAuthAndLoadData() {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/admin");
          return;
        }
        loadProjects();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin");
      }
    }
    checkAuthAndLoadData();
  }, [router]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2">Welcome Back! 👋</h2>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Manage your content and projects from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-gray-600 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">Total Projects</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {projects.length}
              </h3>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl ml-4">
              📝
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-gray-600 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">Active Projects</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {projects.length}
              </h3>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl ml-4">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Quick Actions</span>
        </h3>
        <Link
          href="/dashboard/project/create"
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
        >
          <span className="text-lg sm:text-xl">➕</span>
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span>
            <span>Recent Projects</span>
          </h3>
          <Link 
            href="/dashboard/project" 
            className="text-gray-700 font-semibold text-xs sm:text-sm hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 space-y-3 sm:space-y-4">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
            <p className="text-gray-600 font-semibold text-base sm:text-lg">No projects yet</p>
            <p className="text-gray-400 text-sm sm:text-base">Create your first project to get started!</p>
            <Link
              href="/dashboard/project/create"
              className="inline-block mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-3 sm:p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">{project.title}</h4>
                  <p className="text-gray-400 text-xs">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <Link 
                  href={`/dashboard/project/${project._id}`} 
                  className="text-gray-700 font-semibold text-xs sm:text-sm hover:text-gray-900 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  View
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
