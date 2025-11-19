'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-black font-semibold mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
      )}
    </div>
  );
};

export default function EditProjectPage() {
  const router = useRouter();
  const { id: projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
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

  if (!projectId) return <p className="text-center mt-10 text-black">Invalid Project ID</p>;
  if (fetching) return <p className="text-center mt-10 text-black">Loading project...</p>;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto rounded shadow-lg p-8 bg-white">
        <h1 className="text-3xl font-bold text-black mb-6">Edit Project</h1>
        {error && <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <InputField label="Description" type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />

          {existingImageUrl && (
            <div>
              <label className="block text-black font-semibold mb-1">Existing Image</label>
              <img src={existingImageUrl} alt="Project Image" className="mb-2 w-48 h-auto" />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-black font-semibold mb-1">Replace Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-black"
            />
          </div>

          <InputField label="Technologies (comma separated)" value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
          <InputField label="Features (comma separated)" value={features} onChange={(e) => setFeatures(e.target.value)} />
          <InputField label="Live URL" type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
          <InputField label="GitHub URL" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />

          <div className="mb-4">
            <label className="block text-black font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            >
              <option value="Live">Live</option>
              <option value="Development">Development</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-black font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            >
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 text-white font-semibold rounded shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
