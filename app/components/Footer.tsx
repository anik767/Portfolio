'use client';

import { useEffect, useState } from 'react';
import SocialLink from './theam/SocialLink';

const allowedPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'custom'] as const;
type SocialPlatform = (typeof allowedPlatforms)[number];

type FooterContent = {
  brand: {
    logoUrl: string;
    name: string;
    tagline: string;
  };
  quickLinks: Array<{ label: string; target: string }>;
  socialLinks: Array<{ platform: string; url: string }>;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch('/api/content/footer', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setData({
            brand: json.brand ?? { logoUrl: '', name: '', tagline: '' },
            quickLinks: Array.isArray(json.quickLinks) ? json.quickLinks : [],
            socialLinks: Array.isArray(json.socialLinks) ? json.socialLinks : [],
            contact: json.contact ?? { email: '', phone: '', location: '' },
          });
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('Failed to load footer content:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100;
      window.scrollTo({
        top: offsetPosition,
      });
    }
  };

  const handleQuickLinkClick = (target: string) => {
    if (!target) return;
    if (target.startsWith("http")) {
      window.open(target, "_blank");
      return;
    }
    if (target.startsWith("/")) {
      window.location.href = target;
      return;
    }
    if (target.startsWith("#")) {
      scrollToSection(target.replace("#", ""));
      return;
    }
    scrollToSection(target);
  };

  const renderSkeleton = () => (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-6 w-1/4 bg-gray-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-800 rounded"></div>
          <div className="h-40 bg-gray-800 rounded"></div>
          <div className="h-40 bg-gray-800 rounded"></div>
        </div>
      </div>
    </footer>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!data) {
    return null;
  }

  const { brand, quickLinks, socialLinks, contact } = data;
  const hasBrandInfo = brand.logoUrl || brand.name || brand.tagline;
  const hasLinks = quickLinks.length > 0;
  const hasSocial = socialLinks.length > 0;
  const hasContact = contact.email || contact.phone || contact.location;

  if (!hasBrandInfo && !hasLinks && !hasSocial && !hasContact) {
    return null;
  }

  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {hasBrandInfo && (
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 gap-3">
                {brand.logoUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                    <img src={brand.logoUrl} alt={brand.name || 'Logo'} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold">
                    {brand.name ? brand.name.charAt(0) : ''}
                  </div>
                )}
                {brand.name && <span className="text-xl font-bold">{brand.name}</span>}
              </div>
              {brand.tagline && (
                <p className="text-gray-300 mb-6 max-w-md leading-relaxed">{brand.tagline}</p>
              )}
              {hasSocial && (
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => {
                    const normalizedPlatform = allowedPlatforms.includes(link.platform as SocialPlatform)
                      ? (link.platform as SocialPlatform)
                      : 'custom';
                    return (
                      <SocialLink
                        key={`${link.platform}-${index}`}
                        href={link.url}
                        target="_blank"
                        platform={normalizedPlatform}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {hasLinks && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <button
                      onClick={() => handleQuickLinkClick(link.target)}
                      className="text-gray-300 transition-colors text-left cursor-pointer hover:text-blue-200 hover:underline underline-offset-4"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasContact && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.location && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contact.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
          © {currentYear} {brand.name || ''}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
