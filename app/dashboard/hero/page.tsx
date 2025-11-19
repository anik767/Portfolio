'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernInput } from '../components/ModernInput';

export default function HeroAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerBackgroundImage, setBannerBackgroundImage] = useState<File | null>(null);
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [experience, setExperience] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [existingBannerImage, setExistingBannerImage] = useState("");
  const [existingPersonImage, setExistingPersonImage] = useState("");

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
      loadHeroData();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadHeroData() {
    try {
      const res = await fetch("/api/content/hero", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.hero) {
        setGreeting(data.hero.greeting || "");
        setName(data.hero.name || "");
        setTitle(data.hero.title || "");
        setDescription(Array.isArray(data.hero.description) ? data.hero.description.join("\n") : "");
        setExperience(data.hero.experience || "");
        setResumeUrl(data.hero.resumeUrl || "");
        setFacebook(data.hero.socialLinks?.facebook || "");
        setInstagram(data.hero.socialLinks?.instagram || "");
        setLinkedin(data.hero.socialLinks?.linkedin || "");
        setTwitter(data.hero.socialLinks?.twitter || "");
        setGithub(data.hero.socialLinks?.github || "");
        setExistingBannerImage(data.hero.bannerBackgroundImage || "");
        setExistingPersonImage(data.hero.personImage || "");
      }
    } catch (err) {
      console.error("Failed to load hero data:", err);
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
      formData.append("greeting", greeting);
      formData.append("name", name);
      formData.append("title", title);
      formData.append("description", JSON.stringify(description.split("\n").filter(Boolean)));
      if (bannerBackgroundImage) formData.append("bannerBackgroundImage", bannerBackgroundImage);
      if (personImage) formData.append("personImage", personImage);
      formData.append("experience", experience);
      formData.append("resumeUrl", resumeUrl);
      formData.append("facebook", facebook);
      formData.append("instagram", instagram);
      formData.append("linkedin", linkedin);
      formData.append("twitter", twitter);
      formData.append("github", github);

      const res = await fetch("/api/content/hero", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update hero data");

      alert("Hero section updated successfully!");
      loadHeroData();
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
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl mb-6">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
          <span>🎯</span>
          <span>Manage Hero Section</span>
        </h1>
        <p className="text-white/90">Update your hero section content and images</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput label="Greeting" value={greeting} onChange={e => setGreeting(e.target.value)} required />
            <ModernInput label="Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <ModernInput label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <ModernInput label="Description (one per line)" type="textarea" value={description} onChange={e => setDescription(e.target.value)} required rows={6} />

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🖼️</span>
              <span>Banner Background Image</span>
            </h3>
            {existingBannerImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Current Image:</p>
                <img src={existingBannerImage} alt="Banner" className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-gray-200" />
              </div>
            )}
            <label className="block">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setBannerBackgroundImage(e.target.files?.[0] || null)} 
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
              />
            </label>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>👤</span>
              <span>Person Image</span>
            </h3>
            {existingPersonImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Current Image:</p>
                <img src={existingPersonImage} alt="Person" className="w-48 h-auto rounded-xl shadow-lg border-2 border-gray-200" />
              </div>
            )}
            <label className="block">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setPersonImage(e.target.files?.[0] || null)} 
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" 
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput label="Experience Badge" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g., 2+ Years Experience" />
            <ModernInput label="Resume URL" type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} />
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔗</span>
              <span>Social Links</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput label="Facebook URL" type="url" value={facebook} onChange={e => setFacebook(e.target.value)} />
              <ModernInput label="Instagram URL" type="url" value={instagram} onChange={e => setInstagram(e.target.value)} />
              <ModernInput label="LinkedIn URL" type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              <ModernInput label="Twitter URL" type="url" value={twitter} onChange={e => setTwitter(e.target.value)} />
              <ModernInput label="GitHub URL" type="url" value={github} onChange={e => setGithub(e.target.value)} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Update Hero Section</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

