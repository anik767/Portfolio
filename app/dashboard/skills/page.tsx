'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Skill = {
  name: string;
  level: number;
  order?: number;
};

export default function SkillsAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);

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
      loadSkills();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadSkills() {
    try {
      const res = await fetch("/api/content/skills", { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/content/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update skills");

      alert("Skills updated successfully!");
      loadSkills();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", level: 0, order: skills.length }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
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
    <div className=" mx-auto pt-12 lg:pt-0">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 ">
          <span>🛠️</span>
          <span>Manage Technical Skills</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm">Add and manage your technical skills with proficiency levels</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-lg sm:text-xl">⚠️</span>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}
        
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addSkill}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">➕</span>
              <span>Add Skill</span>
            </button>
          </div>

          {skills.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛠️</div>
              <p className="text-gray-600 font-semibold text-base sm:text-lg mb-1 sm:mb-2">No skills added yet</p>
              <p className="text-gray-400 text-sm sm:text-base">Click &quot;Add Skill&quot; to get started</p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {index + 1}
                    </span>
                    <span>Skill {index + 1}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <span>🗑️</span>
                    <span>Remove</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => updateSkill(index, "name", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                      required
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      Level (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={e => updateSkill(index, "level", parseInt(e.target.value) || 0)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                      required
                    />
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading || skills.length === 0} 
            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Update Skills</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

