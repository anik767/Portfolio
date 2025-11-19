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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  async function loadProjects() {
    try {
      const res = await fetch("/api/project", {
        credentials: "include",
      });
      const data = await res.json();
      // Ensure API returns { success: true, project: Project[] }
      if (data.success && Array.isArray(data.project)) {
        setProjects(data.project);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-flex items-center gap-3 p-6 rounded-2xl bg-white shadow-xl border border-gray-200">
          <div className="relative">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
          <span className="text-gray-700 font-medium">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <h2 className="text-4xl font-extrabold mb-2">Welcome Back! 👋</h2>
        <p className="text-white/90 text-lg">Manage your content and projects from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">Total Projects</p>
              <h3 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {projects.length}
              </h3>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📝
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">Active Projects</p>
              <h3 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {projects.length}
              </h3>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Quick Actions</span>
        </h3>
        <Link
          href="/dashboard/project/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <span className="text-xl">➕</span>
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span>
            <span>Recent Projects</span>
          </h3>
          <Link 
            href="/dashboard/project" 
            className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 font-semibold text-lg">No projects yet</p>
            <p className="text-gray-400">Create your first project to get started!</p>
            <Link
              href="/dashboard/project/create"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{project.title}</h4>
                  <p className="text-gray-400 text-xs">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <Link 
                  href={`/dashboard/project/${project._id}`} 
                  className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1"
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
