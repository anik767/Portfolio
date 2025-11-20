'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModernInput } from "../../components/ModernInput";

export default function EditProjectPage() {
  const router = useRouter();
  const { id: projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [features, setFeatures] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [status, setStatus] = useState("Live");
  const [category, setCategory] = useState("Full Stack");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!projectId || dataLoaded) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/project?id=${projectId}`);
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Project not found");

        const project = data.project;
        setTitle(project.title || "");
        setDescription(project.description || "");
        setTechnologies(
          Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || ""
        );
        setFeatures(
          Array.isArray(project.features) ? project.features.join(", ") : project.features || ""
        );
        setLiveUrl(project.liveUrl || "");
        setGithubUrl(project.githubUrl || "");
        setStatus(project.status || "Live");
        setCategory(project.category || "Full Stack");
        setExistingImageUrl(project.image || "");
        setImagePreview("");

        setDataLoaded(true);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setFetching(false);
      }
    };

    fetchProject();
  }, [projectId, dataLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!projectId) return setError("Invalid project ID");

    try {
      const formData = new FormData();
      formData.append("id", Array.isArray(projectId) ? projectId[0] : projectId);
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);
      formData.append("technologies", technologies);
      formData.append("features", features);
      formData.append("liveUrl", liveUrl);
      formData.append("githubUrl", githubUrl);
      formData.append("status", status);
      formData.append("category", category);

      const res = await fetch("/api/project", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update project");

      router.push("/dashboard/project");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
  };

  if (!projectId) return <p className="text-center mt-10 text-black">Invalid Project ID</p>;
  if (fetching) return <p className="text-center mt-10 text-black">Loading project...</p>;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className=" mx-auto space-y-6">
        <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-wide text-gray-300">Projects</p>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-gray-300 text-sm mt-2">Refresh visuals, update outcomes, or add new metrics.</p>
        </div>

        {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ModernInput
                label="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Commerce Dashboard Revamp"
                required
              />
              <ModernInput
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Full Stack, Frontend, Product Experiment"
              />
            </div>
            <ModernInput
              label="Short Narrative"
              type="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summarize the challenge, your approach, and the measurable impact."
              required
            />
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Project Image</p>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col gap-4 text-center">
                {(imagePreview || existingImageUrl) ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview || existingImageUrl}
                      alt="Project visual"
                      className="w-full h-48 object-cover rounded-xl shadow"
                    />
                  </>
                ) : (
                  <span className="text-4xl">🖼️</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500"
                />
                <p className="text-xs text-gray-400">Uploading a new image replaces the existing visual.</p>
              </div>
            </div>
            <div className="space-y-4">
              <ModernInput
                label="Technologies (comma separated)"
                type="textarea"
                rows={3}
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="Next.js, Tailwind, Prisma, Stripe"
              />
              <ModernInput
                label="Features (comma separated)"
                type="textarea"
                rows={3}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Realtime analytics, Role-based dashboards, Theme builder"
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ModernInput
              label="Live URL"
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://product.com"
            />
            <ModernInput
              label="GitHub Repo"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/murn/project"
            />
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Live">Live</option>
                <option value="Development">Development</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
