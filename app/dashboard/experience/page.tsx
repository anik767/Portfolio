"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "../components/ModernInput";

type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  logo: string;
  description: string;
  technologies: string[];
  achievements: string[];
};

const emptyItem = (): ExperienceItem => ({
  company: "",
  position: "",
  duration: "",
  location: "",
  logo: "",
  description: "",
  technologies: [],
  achievements: [],
});

export default function ExperienceAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState("Work Experience");
  const [subheading, setSubheading] = useState("");
  const [items, setItems] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  async function checkAuthAndLoadData() {
    try {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      await loadExperience();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadExperience() {
    try {
      const res = await fetch("/api/content/experience", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setHeading(data.heading ?? "Work Experience");
        setSubheading(data.subheading ?? "");
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(
            data.items.map((item: ExperienceItem) => ({
              company: item.company ?? "",
              position: item.position ?? "",
              duration: item.duration ?? "",
              location: item.location ?? "",
              logo: item.logo ?? "",
              description: item.description ?? "",
              technologies: Array.isArray(item.technologies) ? item.technologies : [],
              achievements: Array.isArray(item.achievements) ? item.achievements : [],
            }))
          );
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error("Failed to load experience data:", error);
      setError("Failed to load experience data");
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ heading, subheading, items }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update experience data");
      }
      await loadExperience();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to update experience data");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const updateItem = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateListFromText = (
    index: number,
    field: "technologies" | "achievements",
    value: string
  ) => {
    const parsed = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    updateItem(index, field, parsed);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-flex items-center gap-3 p-6 rounded-2xl bg-white shadow-xl border border-gray-200">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-gray-700 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pt-12 lg:pt-0">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <span>🧑‍💼</span>
          <span>Work Experience</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm">Manage your professional journey</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-2">
            <span className="text-lg sm:text-xl">⚠️</span>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ModernInput
              label="Section Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Work Experience"
            />
            <ModernInput
              label="Section Subtitle"
              type="textarea"
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Describe this section"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addItem}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>➕</span>
              <span>Add Experience</span>
            </button>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">🧑‍💼</div>
              <p className="font-semibold text-gray-700 mb-1">No experience entries yet</p>
              <p className="text-gray-500 text-sm">Click &quot;Add Experience&quot; to begin</p>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Experience {index + 1}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ModernInput
                    label="Company"
                    value={item.company}
                    onChange={(e) => updateItem(index, "company", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Position"
                    value={item.position}
                    onChange={(e) => updateItem(index, "position", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Duration"
                    value={item.duration}
                    onChange={(e) => updateItem(index, "duration", e.target.value)}
                    placeholder="e.g., 2020 - Present"
                  />
                  <ModernInput
                    label="Location"
                    value={item.location}
                    onChange={(e) => updateItem(index, "location", e.target.value)}
                  />
                  <ModernInput
                    label="Logo URL"
                    value={item.logo}
                    onChange={(e) => updateItem(index, "logo", e.target.value)}
                    placeholder="https://..."
                  />
                  <ModernInput
                    label="Description"
                    type="textarea"
                    rows={4}
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700 text-sm uppercase">Technologies (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={item.technologies.join(", ")}
                    onChange={(e) => updateListFromText(index, "technologies", e.target.value)}
                    placeholder="Next.js, React, Node.js"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700 text-sm uppercase">Achievements (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={item.achievements.join(", ")}
                    onChange={(e) => updateListFromText(index, "achievements", e.target.value)}
                    placeholder="Reduced load time by 40%, Led team of 5 developers"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Experience"}
          </button>
        </form>
      </div>
    </div>
  );
}


