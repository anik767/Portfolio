'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernInput } from '../components/ModernInput';

export default function AboutAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [badges, setBadges] = useState("");
  const [existingImage, setExistingImage] = useState("");

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
      loadAboutData();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadAboutData() {
    try {
      const res = await fetch("/api/content/about", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.about) {
        setTitle(data.about.title || "");
        setSlogan(data.about.slogan || "");
        setHeading(data.about.heading || "");
        setDescription(Array.isArray(data.about.description) ? data.about.description.join("\n") : "");
        // Convert badges array to comma-separated format: "text:variant, text:variant"
        if (data.about.badges && Array.isArray(data.about.badges)) {
          const badgesStr = data.about.badges.map((b: { text: string; variant: string }) => `${b.text}:${b.variant}`).join(", ");
          setBadges(badgesStr);
        } else {
          setBadges("");
        }
        setExistingImage(data.about.image || "");
      }
    } catch (err) {
      console.error("Failed to load about data:", err);
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slogan", slogan);
      formData.append("heading", heading);
      formData.append("description", JSON.stringify(description.split("\n").filter(Boolean)));
      if (image) formData.append("image", image);
      formData.append("badges", badges);

      const res = await fetch("/api/content/about", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update about data");

      alert("About section updated successfully!");
      loadAboutData();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <span>👤</span>
          <span>Manage About Section</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm">Update your about section content and image</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-lg sm:text-xl">⚠️</span>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}
        
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <ModernInput label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <ModernInput label="Slogan" value={slogan} onChange={e => setSlogan(e.target.value)} required />
          <ModernInput label="Heading" value={heading} onChange={e => setHeading(e.target.value)} required />
          <ModernInput label="Description (one paragraph per line)" type="textarea" value={description} onChange={e => setDescription(e.target.value)} required rows={6} />

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <span>🖼️</span>
              <span>About Image</span>
            </h3>
            {existingImage && (
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 font-semibold">Current Image:</p>
                <img src={existingImage} alt="About" className="w-32 sm:w-48 h-auto rounded-lg sm:rounded-xl shadow-lg border-2 border-gray-200" />
              </div>
            )}
            <label className="block">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImage(e.target.files?.[0] || null)} 
                className="block w-full text-xs sm:text-sm text-gray-600 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" 
              />
            </label>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <span>🏷️</span>
              <span>Badges (comma separated)</span>
            </h3>
            <ModernInput 
              label="" 
              value={badges} 
              onChange={e => setBadges(e.target.value)} 
              placeholder="2+ Years Experience:emerald, 20+ Projects:cyanblue, Remote Work:elegant"
            />
            <p className="text-xs sm:text-sm text-gray-600 mt-2 bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
              <span className="font-semibold">Format:</span> "text:variant, text:variant" (e.g., "2+ Years Experience:emerald, 20+ Projects:cyanblue")
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
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
                <span>Update About Section</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

