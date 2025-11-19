"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "../components/ModernInput";

type EducationEntry = {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  logo: string;
  gpa: string;
  description: string;
  courses: string[];
  achievements: string[];
};

type CertificationEntry = {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  logo: string;
  description: string;
  skills: string[];
};

const emptyEducation = (): EducationEntry => ({
  institution: "",
  degree: "",
  duration: "",
  location: "",
  logo: "",
  gpa: "",
  description: "",
  courses: [],
  achievements: [],
});

const emptyCertification = (): CertificationEntry => ({
  name: "",
  issuer: "",
  date: "",
  credentialId: "",
  logo: "",
  description: "",
  skills: [],
});

export default function EducationAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [heading, setHeading] = useState("Education & Certifications");
  const [subheading, setSubheading] = useState("");
  const [educationHeading, setEducationHeading] = useState("Education");
  const [certHeading, setCertHeading] = useState("Professional Certifications");
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [certifications, setCertifications] = useState<CertificationEntry[]>([]);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    try {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      await loadEducationData();
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin");
    }
  }

  async function loadEducationData() {
    try {
      const res = await fetch("/api/content/education", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setHeading(data.heading ?? "Education & Certifications");
        setSubheading(data.subheading ?? "");
        setEducationHeading(data.educationHeading ?? "Education");
        setCertHeading(data.certificationsHeading ?? "Professional Certifications");
        if (Array.isArray(data.education)) {
          setEducation(
            data.education.map((item: EducationEntry) => ({
              institution: item.institution ?? "",
              degree: item.degree ?? "",
              duration: item.duration ?? "",
              location: item.location ?? "",
              logo: item.logo ?? "",
              gpa: item.gpa ?? "",
              description: item.description ?? "",
              courses: Array.isArray(item.courses) ? item.courses : [],
              achievements: Array.isArray(item.achievements) ? item.achievements : [],
            }))
          );
        } else {
          setEducation([]);
        }
        if (Array.isArray(data.certifications)) {
          setCertifications(
            data.certifications.map((item: CertificationEntry) => ({
              name: item.name ?? "",
              issuer: item.issuer ?? "",
              date: item.date ?? "",
              credentialId: item.credentialId ?? "",
              logo: item.logo ?? "",
              description: item.description ?? "",
              skills: Array.isArray(item.skills) ? item.skills : [],
            }))
          );
        } else {
          setCertifications([]);
        }
      }
    } catch (error) {
      console.error("Failed to load education data:", error);
      setError("Failed to load education data");
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          heading,
          subheading,
          educationHeading,
          certificationsHeading: certHeading,
          education,
          certifications,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update education data");
      }
      await loadEducationData();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to update education data");
    } finally {
      setLoading(false);
    }
  };

  const updateEducationField = (index: number, field: keyof EducationEntry, value: string | string[]) => {
    setEducation((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const updateCertificationField = (index: number, field: keyof CertificationEntry, value: string | string[]) => {
    setCertifications((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEducationEntry = () => setEducation((prev) => [...prev, emptyEducation()]);
  const removeEducationEntry = (index: number) =>
    setEducation((prev) => prev.filter((_, i) => i !== index));

  const addCertificationEntry = () => setCertifications((prev) => [...prev, emptyCertification()]);
  const removeCertificationEntry = (index: number) =>
    setCertifications((prev) => prev.filter((_, i) => i !== index));

  const updateEducationListFromText = (
    index: number,
    field: "courses" | "achievements",
    value: string
  ) => {
    const parsed = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    updateEducationField(index, field, parsed);
  };

  const updateCertificationSkillsFromText = (index: number, value: string) => {
    const parsed = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    updateCertificationField(index, "skills", parsed);
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
          <span>🎓</span>
          <span>Education & Certifications</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm">Manage academic history and credentials</p>
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
            />
            <ModernInput
              label="Section Subtitle"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
            />
            <ModernInput
              label="Education Title"
              value={educationHeading}
              onChange={(e) => setEducationHeading(e.target.value)}
            />
            <ModernInput
              label="Certifications Title"
              value={certHeading}
              onChange={(e) => setCertHeading(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Education Entries</h2>
            <button
              type="button"
              onClick={addEducationEntry}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow-md"
            >
              Add Education
            </button>
          </div>

          {education.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">No education entries added</p>
              <p className="text-gray-500 text-sm">Click &quot;Add Education&quot; to begin</p>
            </div>
          )}

          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-800">Institution {index + 1}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducationEntry(index)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ModernInput
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducationField(index, "institution", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducationField(index, "degree", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Duration"
                    value={edu.duration}
                    onChange={(e) => updateEducationField(index, "duration", e.target.value)}
                  />
                  <ModernInput
                    label="Location"
                    value={edu.location}
                    onChange={(e) => updateEducationField(index, "location", e.target.value)}
                  />
                  <ModernInput
                    label="Logo URL"
                    value={edu.logo}
                    onChange={(e) => updateEducationField(index, "logo", e.target.value)}
                    placeholder="https://..."
                  />
                  <ModernInput
                    label="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => updateEducationField(index, "gpa", e.target.value)}
                    placeholder="e.g., 3.9/4.0"
                  />
                  <ModernInput
                    label="Description"
                    type="textarea"
                    rows={4}
                    value={edu.description}
                    onChange={(e) => updateEducationField(index, "description", e.target.value)}
                    className="lg:col-span-2"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700">Key Courses (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={edu.courses.join(", ")}
                    onChange={(e) => updateEducationListFromText(index, "courses", e.target.value)}
                    placeholder="Data Structures, Algorithms, Database Systems"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700">Achievements (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={edu.achievements.join(", ")}
                    onChange={(e) => updateEducationListFromText(index, "achievements", e.target.value)}
                    placeholder="Dean's List, Science Club Lead"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Certifications</h2>
            <button
              type="button"
              onClick={addCertificationEntry}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow-md"
            >
              Add Certification
            </button>
          </div>

          {certifications.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">No certifications added</p>
              <p className="text-gray-500 text-sm">Click &quot;Add Certification&quot; to begin</p>
            </div>
          )}

          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-800">Certification {index + 1}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertificationEntry(index)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ModernInput
                    label="Certification Name"
                    value={cert.name}
                    onChange={(e) => updateCertificationField(index, "name", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Issuer"
                    value={cert.issuer}
                    onChange={(e) => updateCertificationField(index, "issuer", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Date"
                    value={cert.date}
                    onChange={(e) => updateCertificationField(index, "date", e.target.value)}
                  />
                  <ModernInput
                    label="Credential ID"
                    value={cert.credentialId}
                    onChange={(e) => updateCertificationField(index, "credentialId", e.target.value)}
                  />
                  <ModernInput
                    label="Logo URL"
                    value={cert.logo}
                    onChange={(e) => updateCertificationField(index, "logo", e.target.value)}
                    placeholder="https://..."
                  />
                  <ModernInput
                    label="Description"
                    type="textarea"
                    rows={3}
                    value={cert.description}
                    onChange={(e) => updateCertificationField(index, "description", e.target.value)}
                    className="lg:col-span-2"
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="font-semibold text-gray-700">Skills Validated (comma separated)</p>
                  <ModernInput
                    label=""
                    type="textarea"
                    rows={3}
                    value={cert.skills.join(", ")}
                    onChange={(e) => updateCertificationSkillsFromText(index, e.target.value)}
                    placeholder="AWS, GCP, Kubernetes"
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
            {loading ? "Saving..." : "Save Education & Certifications"}
          </button>
        </form>
      </div>
    </div>
  );
}


