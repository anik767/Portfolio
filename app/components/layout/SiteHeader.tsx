'use client';

import Link from "next/link";
import { Button, Badge } from "@/app/components/theam";

const navLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#categories", label: "Categories" },
  { href: "#posts", label: "Posts" },
];

const SiteHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-black tracking-tight text-slate-900">
          Murn Admin
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Badge variant="sky" className="hidden text-xs font-semibold text-slate-800 md:flex">
            Crafted with Theam Kit
          </Badge>
          <Button size="sm" variant="sky" scrollTo="posts" className="hidden md:flex">
            Explore Posts
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

