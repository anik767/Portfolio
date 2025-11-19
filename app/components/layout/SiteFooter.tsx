'use client';

import Link from "next/link";
import { SocialLink, Badge } from "@/app/components/theam";

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Badge variant="violet" size="sm">
            Murn Content Studio
          </Badge>
          <p className="text-sm text-slate-600">
            Designing stories, categories, and posts with a premium themed experience.
            Managed via the redesigned dashboard and powered by Cloudinary media.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Navigate</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#featured" className="hover:text-slate-900">Featured Banner</a></li>
            <li><a href="#categories" className="hover:text-slate-900">Categories</a></li>
            <li><a href="#posts" className="hover:text-slate-900">Latest Posts</a></li>
            <li><Link href="/admin" className="hover:text-slate-900">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Connect</h4>
          <div className="flex gap-3">
            <SocialLink href="https://instagram.com" platform="instagram" />
            <SocialLink href="https://linkedin.com" platform="linkedin" />
            <SocialLink href="https://twitter.com" platform="twitter" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/70 bg-slate-50 py-4 text-center text-xs text-slate-500">
        © {year} Murn. Built with the Theam component set.
      </div>
    </footer>
  );
};

export default SiteFooter;

