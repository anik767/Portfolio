'use client';

import { useState, useEffect, useRef } from 'react';

type TimelineInstance = {
  play: () => void;
  reverse: () => void;
  kill: () => void;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<TimelineInstance | null>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100;
      
      window.scrollTo({
        top: offsetPosition
      });

      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // GSAP Mobile Menu Animation
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (typeof window === 'undefined') return;
      const { gsap } = await import('gsap');

      if (!isMounted) return;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.inOut' }
      });

      if (isMenuOpen) {
        tl.to(overlayRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.2,
        })
        .to(menuContainerRef.current, {
          x: 0,
          duration: 0.3,
        }, '<')
        .fromTo(
          menuItemsRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.03 },
          '-=0.1'
        );
      } else {
        tl.to(menuItemsRef.current, { opacity: 0, x: 20, duration: 0.2, stagger: 0.02 })
          .to(menuContainerRef.current, { x: '100%', duration: 0.3 }, '-=0.1')
          .to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2 }, '<');
      }

      timelineRef.current = tl;
      tl.play();
    };

    run();
    return () => {
      isMounted = false;
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Header - Centered rounded pill */}
      <header className="hidden md:block fixed top-4 left-[50%] transform -translate-x-1/2 z-50">
        <nav className="bg-white/60 backdrop-blur-md shadow-sm rounded-full px-3 py-2">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeSection === item.id
                  ? 'text-white bg-blue-600 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden">
        {/* Hamburger Button - Fixed Position */}
        <button
          onClick={toggleMenu}
          className="fixed top-6 right-6 z-100 bg-white/80 backdrop-blur-md shadow-lg rounded-full p-3 hover:bg-white transition-all duration-300"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 opacity-0 pointer-events-none"
          onClick={toggleMenu}
        />

        {/* Mobile Menu - Slide from Right */}
        <nav
          ref={menuContainerRef}
          className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-linear-to-br from-white via-blue-50 to-purple-50 shadow-2xl z-95 translate-x-full"
        >
          <div className="flex flex-col h-full pt-24 pb-8 px-8">
            {/* Menu Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Navigation
              </h2>
              <div className="w-16 h-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mt-2" />
            </div>

            {/* Menu Items */}
            <div className="flex-1 space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    menuItemsRef.current[index] = el;
                  }}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium text-lg transition-all duration-300 cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:translate-x-2'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {item.label}
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeSection === item.id ? 'rotate-0' : '-rotate-45'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
