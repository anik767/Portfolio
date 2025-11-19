'use client';

import { useState, useEffect, useRef } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / height) * 100;
      
      setScrollProgress(progress);
      
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // GSAP animation on mount/unmount
  useEffect(() => {
    if (buttonRef.current) {
      const animateButton = async () => {
        const { gsap } = await import('gsap');
        
        if (isVisible) {
          gsap.fromTo(
            buttonRef.current,
            { scale: 0, opacity: 0, rotation: -180 },
            { 
              scale: 1, 
              opacity: 1, 
              rotation: 0, 
              duration: 0.5, 
              ease: 'back.out(1.7)' 
            }
          );
        } else {
          gsap.to(buttonRef.current, {
            scale: 0,
            opacity: 0,
            rotation: 180,
            duration: 0.3,
            ease: 'back.in(1.7)'
          });
        }
      };
      
      animateButton();
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group"
      style={{ opacity: 0, transform: 'scale(0)' }}
      aria-label="Back to top"
    >
      {/* Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 46}`}
          strokeDashoffset={`${2 * Math.PI * 46 * (1 - scrollProgress / 100)}`}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      
      {/* Arrow Icon */}
      <svg
        className="w-6 h-6 relative z-10 group-hover:-translate-y-1 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default BackToTopButton;
