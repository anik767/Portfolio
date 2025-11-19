'use client';

import { useEffect, useRef, useState } from 'react';

const GSAPScrollWrapper = ({ children }: { children: React.ReactNode }) => {
  const smootherRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);
    
    const initScrollSmoother = async () => {
      if (typeof window !== 'undefined') {
        // Check device type
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isDesktop = window.innerWidth > 1024;
        
        if (isMobile || isTablet) {
          // Use native browser scroll for mobile and tablet
          return;
        }
        
        if (isDesktop) {
          // Desktop only - use GSAP ScrollSmoother

          try {
          const { gsap } = await import('gsap');
          const { ScrollTrigger } = await import('gsap/ScrollTrigger');
          
          // Register ScrollTrigger
          gsap.registerPlugin(ScrollTrigger);

          // Wait for DOM to be ready
          await new Promise(resolve => requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          }));

          // Try to import ScrollSmoother (premium plugin)
          try {
            const { ScrollSmoother } = await import('gsap/ScrollSmoother');
            gsap.registerPlugin(ScrollSmoother);

            // Check if ScrollSmoother wrapper elements exist
            const wrapper = document.querySelector("#smooth-wrapper");
            const content = document.querySelector("#smooth-content");
            
            if (!wrapper || !content) {
              throw new Error('ScrollSmoother wrapper elements not found');
            }

            // Kill existing instance if any
            const existing = ScrollSmoother.get();
            if (existing) {
              existing.kill();
            }

            // Create ScrollSmoother with all features
            const smoother = ScrollSmoother.create({
              wrapper: "#smooth-wrapper",    // Outer wrapper, usually has overflow: hidden
              content: "#smooth-content",    // Inner content container
              smooth: 1.5,                   // Smooth mouse wheel scrolling
              effects: true,                 // Enables [data-speed] & [data-lag] parallax
              smoothTouch: 0.2,              // Lower value = more responsive touch feel
              normalizeScroll: true,         // Prevents jumps from mobile browser UI
              ignoreMobileResize: true      // Prevents reflow when keyboard or resize triggers
            });

            smootherRef.current = smoother;

          } catch (smootherError) {
            // Fallback to native smooth scroll
            document.documentElement.style.scrollBehavior = 'smooth';
            document.body.style.scrollBehavior = 'smooth';
            
            // Store reference for cleanup
            smootherRef.current = { 
              kill: () => {
                document.documentElement.style.scrollBehavior = 'auto';
                document.body.style.scrollBehavior = 'auto';
              }
            };
          }

        } catch (error) {
          // Fallback to native smooth scroll
          document.documentElement.style.scrollBehavior = 'smooth';
          document.body.style.scrollBehavior = 'smooth';
        }
        }
      }
    };

    const timeout = setTimeout(initScrollSmoother, 100);

    return () => {
      clearTimeout(timeout);
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  // Always render the same structure to prevent hydration mismatch
  // Use CSS to conditionally apply styles based on device type
  const getWrapperStyle = () => {
    if (!mounted || typeof window === 'undefined') {
      // Initial render - use desktop styles to prevent hydration mismatch
      return { overflow: 'hidden', height: '100vh' };
    }
    
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    if (isMobile || isTablet) {
      // Mobile/Tablet: normal browser scroll
      return { overflow: 'visible', height: 'auto' };
    }
    
    // Desktop: ScrollSmoother
    return { overflow: 'hidden', height: '100vh' };
  };

  return (
    <div id="smooth-wrapper" style={getWrapperStyle()}>
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default GSAPScrollWrapper;
