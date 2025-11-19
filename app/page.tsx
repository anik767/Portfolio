"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Services from "@/app/components/Services";
import Experience from "@/app/components/Experience";
import Education from "@/app/components/Education";
import Projects, { ProjectCard } from "@/app/components/Projects";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import BackToTopButton from "@/app/components/BackToTopButton";

type project = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  technologies?: string[] | string;
  features?: string[] | string;
  liveUrl?: string;
  githubUrl?: string;
  status?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Home() {
  const [project, setproject] = useState<project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        setError("");
        const projectRes = await fetch("/api/project", { cache: "no-store" });
        const projectData = await projectRes.json();

        if (projectRes.ok && projectData.success && Array.isArray(projectData.project)) {
          setproject(projectData.project);
        } else {
          throw new Error(projectData.error || "Failed to load project");
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        setproject([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const projectCards = mapprojectToProjects(project);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F1EA] text-slate-900">
      <Header />
      <main className="relative overflow-hidden">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Education />
        {error && (
          <div className="mx-auto my-8 max-w-4xl rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}. Showing default project cards instead.
          </div>
        )}
        <Projects projectsData={projectCards} />
        <Contact />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}


function mapprojectToProjects(project: project[]): ProjectCard[] {
  if (!Array.isArray(project) || project.length === 0) {
    return [];
  }

  return project.map((project) => {
    const normalizedTitle = project.title?.trim() || "Untitled Project";
    const normalizedDescription = project.description?.trim() || "No description available.";

    // Handle technologies - can be array or string
    let technologies: string[] = [];
    if (project.technologies) {
      if (Array.isArray(project.technologies)) {
        technologies = project.technologies.filter(Boolean);
      } else if (typeof project.technologies === 'string') {
        technologies = project.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    // Handle features - can be array or string
    let features: string[] = [];
    if (project.features) {
      if (Array.isArray(project.features)) {
        features = project.features.filter(Boolean);
      } else if (typeof project.features === 'string') {
        features = project.features.split(',').map((f: string) => f.trim()).filter(Boolean);
      }
    }

    return {
      title: normalizedTitle,
      description: normalizedDescription,
      image: project.image || "/images/Image_not_found.jpg",
      technologies: technologies.length > 0 ? technologies : ["No technologies listed"],
      features: features.length > 0 ? features : ["No features listed"],
      liveUrl: project.liveUrl || undefined,
      githubUrl: project.githubUrl || undefined,
      status: project.status || "Draft",
      statusVariant: pickStatusVariant(project.status),
      category: project.category || "Project",
      categoryVariant: pickCategoryVariant(project.category),
    };
  });
}

function pickStatusVariant(status?: string): 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet' {
  if (!status) return "emerald";
  const normalized = status.toLowerCase();
  if (["live", "published", "launched"].some((keyword) => normalized.includes(keyword))) {
    return "emerald";
  }
  if (["in progress", "beta", "development"].some((keyword) => normalized.includes(keyword))) {
    return "sunset";
  }
  if (["coming soon", "preview", "pending"].some((keyword) => normalized.includes(keyword))) {
    return "sky";
  }
  return "emerald";
}

function pickCategoryVariant(category?: string): 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet' {
  if (!category) return "emerald";
  const normalized = category.toLowerCase();
  if (normalized.includes("full") || normalized.includes("stack")) return "emerald";
  if (normalized.includes("frontend") || normalized.includes("ui")) return "sky";
  if (normalized.includes("backend") || normalized.includes("api")) return "ocean";
  if (normalized.includes("mobile")) return "sunset";
  return "emerald";
}

