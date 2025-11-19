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
      <div className="bg-gray-900 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-4xl font-extrabold mb-2">Welcome Back! 👋</h2>
        <p className="text-gray-300 text-lg">Manage your content and projects from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">Total Projects</p>
              <h3 className="text-4xl font-extrabold text-gray-900">
                {projects.length}
              </h3>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
              📝
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">Active Projects</p>
              <h3 className="text-4xl font-extrabold text-gray-900">
                {projects.length}
              </h3>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Quick Actions</span>
        </h3>
        <Link
          href="/dashboard/project/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span className="text-xl">➕</span>
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span>
            <span>Recent Projects</span>
          </h3>
          <Link 
            href="/dashboard/project" 
            className="text-gray-700 font-semibold text-sm hover:text-gray-900 transition-colors flex items-center gap-1"
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
              className="inline-block mt-4 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="flex justify-between items-center p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{project.title}</h4>
                  <p className="text-gray-400 text-xs">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <Link 
                  href={`/dashboard/project/${project._id}`} 
                  className="text-gray-700 font-semibold text-sm hover:text-gray-900 transition-colors flex items-center gap-1"
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
