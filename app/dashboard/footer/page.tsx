"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "../components/ModernInput";
import { ImageUploadField } from "../components/ImageUploadField";
import { UploadedImage } from "../utils/uploadImage";

type BrandInfo = {
  logoUrl: string;
  logoPublicId?: string;
  name: string;
  tagline: string;
};

type QuickLink = {
  label: string;
  target: string;
};

type SocialLink = {
  platform: string;
  url: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  location: string;
};

const quickLinkOptions = [
  { label: "Home", value: "#home" },
  { label: "About", value: "#about" },
  { label: "Services", value: "#services" },
  { label: "Experience", value: "#experience" },
  { label: "Education", value: "#education" },
  { label: "Projects", value: "#projects" },
  { label: "Contact", value: "#contact" },
] as const;

const socialPlatformOptions = [
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "github",
  "youtube",
  "custom",
] as const;

export default function FooterAdminPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<BrandInfo>({ logoUrl: "", logoPublicId: "", name: "", tagline: "" });
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "", location: "" });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const loadFooter = useCallback(async () => {
    try {
      const res = await fetch("/api/content/footer", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setBrand({
          logoUrl: data.brand?.logoUrl ?? "",
          logoPublicId: data.brand?.logoPublicId ?? "",
          name: data.brand?.name ?? "",
          tagline: data.brand?.tagline ?? "",
        });
        setQuickLinks(Array.isArray(data.quickLinks) ? data.quickLinks : []);
        setSocialLinks(Array.isArray(data.socialLinks) ? data.socialLinks : []);
        setContact({
          email: data.contact?.email ?? "",
          phone: data.contact?.phone ?? "",
          location: data.contact?.location ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to load footer content:", err);
      setError("Failed to load footer content");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/admin");
          return;
        }
        await loadFooter();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin");
      }
    };
    checkAuthAndLoad();
  }, [router, loadFooter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brand, quickLinks, socialLinks, contact }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update footer");
      }
      await loadFooter();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update footer");
    } finally {
      setLoading(false);
    }
  };

  const addQuickLink = () => setQuickLinks((prev) => [...prev, { label: "", target: "" }]);
  const updateQuickLink = (index: number, field: keyof QuickLink, value: string) => {
    setQuickLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const removeQuickLink = (index: number) =>
    setQuickLinks((prev) => prev.filter((_, i) => i !== index));

  const addSocialLink = () => setSocialLinks((prev) => [...prev, { platform: "", url: "" }]);
  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const removeSocialLink = (index: number) =>
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));

  const handleLogoUpload = (image: UploadedImage | null) => {
    setBrand((prev) => ({
      ...prev,
      logoUrl: image?.url ?? "",
      logoPublicId: image?.publicId ?? "",
    }));
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
    <div className="mx-auto pt-12 lg:pt-0 space-y-6">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:ps-6 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 flex items-center gap-3">
          <span>⚙️</span>
          <span>Footer Content</span>
        </h1>
        <p className="text-gray-300 text-sm">Control the logo, quick links, socials, and contact info.</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ImageUploadField
              label="Brand Logo"
              folder="footer/branding"
              helperText="Upload a transparent SVG/PNG · Recommended 240x80"
              value={brand.logoUrl ? { url: brand.logoUrl, publicId: brand.logoPublicId } : null}
              onChange={handleLogoUpload}
            />
            <ModernInput
              label="Brand Name"
              value={brand.name}
              onChange={(e) => setBrand((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Murn Studio"
            />
            <ModernInput
              label="Tagline"
              type="textarea"
              rows={3}
              value={brand.tagline}
              onChange={(e) => setBrand((prev) => ({ ...prev, tagline: e.target.value }))}
              placeholder="Share a short positioning statement or CTA"
              className="lg:col-span-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Quick Links</h2>
              <button
                type="button"
                onClick={addQuickLink}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow"
              >
                Add Link
              </button>
            </div>
            {quickLinks.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-500">
                No quick links yet
              </div>
            )}
            {quickLinks.map((link, index) => (
              <div
                key={`quick-link-${index}`}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <ModernInput
                  label="Label"
                  value={link.label}
                  onChange={(e) => updateQuickLink(index, "label", e.target.value)}
                  placeholder="e.g., Services"
                />
                <div className="lg:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Target (section id or URL)
                  </label>
                  <select
                    value={link.target}
                    onChange={(e) => updateQuickLink(index, "target", e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-800"
                  >
                    <option value="">Select a section</option>
                    {quickLinkOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuickLink(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg font-semibold lg:col-span-3"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Social Links</h2>
              <button
                type="button"
                onClick={addSocialLink}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow"
              >
                Add Social
              </button>
            </div>
            {socialLinks.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-500">
                No social links yet
              </div>
            )}
            {socialLinks.map((link, index) => (
              <div
                key={`social-link-${index}`}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Platform
                  </label>
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-800"
                  >
                    <option value="">Select platform</option>
                    {socialPlatformOptions.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <ModernInput
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  placeholder="https://instagram.com/murnstudio"
                  className="lg:col-span-2"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg font-semibold lg:col-span-3"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ModernInput
              label="Contact Email"
              value={contact.email}
              onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
              placeholder="you@example.com"
            />
            <ModernInput
              label="Contact Phone"
              value={contact.phone}
              onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+123456789"
            />
            <ModernInput
              label="Location"
              value={contact.location}
              onChange={(e) => setContact((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Footer"}
          </button>
        </form>
      </div>
    </div>
  );
}


