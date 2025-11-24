"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "../components/ModernInput";
import { ImageUploadField } from "../components/ImageUploadField";
import { UploadedImage } from "../utils/uploadImage";

type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  logo: string;
  logoPublicId?: string;
  description: string;
  technologies: string[];
  achievements: string[];
  technologiesInput: string;
  achievementsInput: string;
};

const emptyItem = (): ExperienceItem => ({
  company: "",
  position: "",
  duration: "",
  location: "",
  logo: "",
  logoPublicId: "",
  description: "",
  technologies: [],
  achievements: [],
  technologiesInput: "",
  achievementsInput: "",
});

export default function ExperienceAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState("Work Experience");
  const [subheading, setSubheading] = useState("");
  const [items, setItems] = useState<ExperienceItem[]>([]);

  const loadExperience = useCallback(async () => {
    try {
      const res = await fetch("/api/content/experience", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setHeading(data.heading ?? "Work Experience");
        setSubheading(data.subheading ?? "");
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(
            data.items.map((item: ExperienceItem) => {
              const technologies = Array.isArray(item.technologies) ? item.technologies : [];
              const achievements = Array.isArray(item.achievements) ? item.achievements : [];
              return {
                company: item.company ?? "",
                position: item.position ?? "",
                duration: item.duration ?? "",
                location: item.location ?? "",
                logo: item.logo ?? "",
                logoPublicId: item.logoPublicId ?? "",
                description: item.description ?? "",
                technologies,
                achievements,
                technologiesInput: technologies.join(", "),
                achievementsInput: achievements.join(", "),
              };
            })
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
  }, []);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
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
    };
    checkAuthAndLoadData();
  }, [router, loadExperience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          heading,
          subheading,
          items: items.map((item: ExperienceItem) => {
            const { technologiesInput, achievementsInput, ...rest } = item;
            void technologiesInput;
            void achievementsInput;
            return {
              ...rest,
              technologies: rest.technologies.map((tech) => tech.trim()).filter(Boolean),
              achievements: rest.achievements.map((ach) => ach.trim()).filter(Boolean),
            };
          }),
        }),
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

  const listInputFieldMap = {
    technologies: "technologiesInput",
    achievements: "achievementsInput",
  } as const;

  const parseListInput = (value: string) =>
    value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);

  const updateListFromText = (
    index: number,
    field: "technologies" | "achievements",
    value: string
  ) => {
    const parsed = parseListInput(value);
    const inputField = listInputFieldMap[field];
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: parsed,
        [inputField]: value,
      };
      return copy;
    });
  };

  const handleLogoUpload = (index: number, image: UploadedImage | null) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        logo: image?.url ?? "",
        logoPublicId: image?.publicId ?? "",
      };
      return copy;
    });
  };

  const stats = useMemo(() => {
    const totalTechnologies = items.reduce(
      (sum, item) => sum + item.technologies.filter(Boolean).length,
      0
    );
    const totalAchievements = items.reduce(
      (sum, item) => sum + item.achievements.filter(Boolean).length,
      0
    );
    return {
      roles: items.length,
      techCount: totalTechnologies,
      achievementCount: totalAchievements,
    };
  }, [items]);

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Roles Logged</p>
          <p className="text-3xl font-bold text-gray-900">{stats.roles}</p>
          <p className="text-xs text-gray-400">Aim for 3+ notable roles</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Technologies Highlighted</p>
          <p className="text-3xl font-bold text-gray-900">{stats.techCount}</p>
          <p className="text-xs text-gray-400">Stack keywords per role</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Impact Statements</p>
          <p className="text-3xl font-bold text-gray-900">{stats.achievementCount}</p>
          <p className="text-xs text-gray-400">Use metrics when possible</p>
        </div>
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
              placeholder="e.g., Work Experience"
            />
            <ModernInput
              label="Section Subtitle"
              type="textarea"
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="e.g., Highlights of my most recent engineering roles"
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
                    placeholder="e.g., Vercel"
                  />
                  <ModernInput
                    label="Position"
                    value={item.position}
                    onChange={(e) => updateItem(index, "position", e.target.value)}
                    required
                    placeholder="e.g., Senior Frontend Engineer"
                  />
                  <ModernInput
                    label="Duration"
                    value={item.duration}
                    onChange={(e) => updateItem(index, "duration", e.target.value)}
                    placeholder="e.g., Jan 2022 – Present"
                  />
                  <ModernInput
                    label="Location"
                    value={item.location}
                    onChange={(e) => updateItem(index, "location", e.target.value)}
                    placeholder="e.g., Remote · Berlin, Germany"
                  />
                  <ImageUploadField
                    label="Company Logo"
                    folder="experience/logos"
                    helperText="Square SVG/PNG works best on timeline cards"
                    example="Upload the official employer mark"
                    value={item.logo ? { url: item.logo, publicId: item.logoPublicId } : null}
                    onChange={(image) => handleLogoUpload(index, image)}
                    className="lg:col-span-2"
                  />
                  <ModernInput
                    label="Description"
                    type="textarea"
                    rows={4}
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Summarize responsibilities in 2-3 sentences"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700 text-sm uppercase">Technologies (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={item.technologiesInput ?? item.technologies.join(", ")}
                    onChange={(e) => updateListFromText(index, "technologies", e.target.value)}
                    placeholder="Next.js, React, GraphQL, Storybook"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700 text-sm uppercase">Achievements (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={item.achievementsInput ?? item.achievements.join(", ")}
                    onChange={(e) => updateListFromText(index, "achievements", e.target.value)}
                    placeholder="Shipped redesign increasing signups 38%, Led team of 5 engineers"
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


