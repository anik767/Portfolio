'use client';

import { useEffect, useRef } from 'react';
import SocialLink from './theam/SocialLink';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLDivElement>(null);

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100;
      
      window.scrollTo({
        top: offsetPosition
      });
    }
  };

  // Footer animation is handled by ScrollAnimations component

  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div ref={footerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 footer-content">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 ">

                <img src="/images/avator/avator.png" alt="logo" className=" object-contain" />
              </div>
              
              <span className="text-xl font-bold">Azmain Iqtidar Anik</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Full Stack Developer creating beautiful, functional, 
              and user-centered digital experiences.
            </p>
            <div className="flex space-x-3">
              <SocialLink href="https://www.facebook.com/azmainiqtidaranik" target="_blank" platform="facebook" />
              <SocialLink href="https://github.com/anik767" target="_blank" platform="github" />
              <SocialLink href="https://www.linkedin.com/in/anik-azmain" target="_blank" platform="linkedin" />
              <SocialLink href="https://twitter.com" target="_blank" platform="twitter" />
              <SocialLink href="https://www.instagram.com/anikazmain535" target="_blank" platform="instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href.replace('#', ''))}
                    className="text-gray-300 transition-colors text-left cursor-pointer hover:text-blue-200 hover:underline underline-offset-5">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">azminanik@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">+8801795382975</span>
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
