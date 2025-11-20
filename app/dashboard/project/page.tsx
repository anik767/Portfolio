'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectCard {
  _id: string;
  title: string;
  category: string;
  status: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  updatedAt?: string;
}

const statusStyles: Record<string, string> = {
  Live: "bg-green-100 text-green-700",
  Development: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600",
};

const ProjectsDashboardPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/project', { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          setProjects(data.project);
        } else {
          setError(data.error || 'Failed to load projects');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch('/api/project', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setProjects(projects.filter(p => p._id !== id));
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const categories = useMemo(() => {
    const unique = new Set(projects.map((project) => project.category));
    return Array.from(unique).filter(Boolean);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies.join(",").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      live: projects.filter((project) => project.status === "Live").length,
      development: projects.filter((project) => project.status === "Development").length,
      categories: categories.length,
    };
  }, [projects, categories]);

  if (loading) return <p className="text-center mt-10 text-black">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Product Workbench</p>
          <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
          <p className="text-gray-500 text-sm">Curate case studies, internal tools, and experiments.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/project/create')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow hover:bg-gray-800 transition"
        >
          <span className="text-lg">＋</span>
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400">Active case studies in rotation</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Live</p>
          <p className="text-3xl font-bold text-green-600">{stats.live}</p>
          <p className="text-xs text-gray-400">Linked to production URLs</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">In Build</p>
          <p className="text-3xl font-bold text-amber-500">{stats.development}</p>
          <p className="text-xs text-gray-400">Currently shipping features</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Categories</p>
          <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
          <p className="text-xs text-gray-400">Service areas represented</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, technology, or status..."
          className="flex-1 text-gray-900 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 text-gray-900 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Statuses</option>
            <option value="Live">Live</option>
            <option value="Development">Development</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 text-gray-900 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-4xl mb-4">🛠️</p>
          <p className="font-semibold text-gray-700 mb-1">No projects match your filters</p>
          <p className="text-gray-500 text-sm">Reset filters or create a new project to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-gray-400 tracking-wide">{project.category}</p>
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[project.status] || "bg-gray-100 text-gray-600"}`}>
                  {project.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    +{project.technologies.length - 5} more
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Live Preview ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 font-semibold hover:underline"
                  >
                    Github Repo ↗
                  </a>
                )}
                {project.updatedAt && (
                  <span className="text-xs text-gray-400">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/dashboard/project/${project._id}`)}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
                >
                  Edit project
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
              </div>
            </div>
            ))}
      </div>
      )}
    </div>
  );
};

export default ProjectsDashboardPage;
