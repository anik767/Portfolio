'use client';

import { ReactNode } from 'react';

interface ScrollToSectionProps {
  children: ReactNode;
  sectionId: string;
  className?: string;
}

const ScrollToSection = ({ children, sectionId, className = '' }: ScrollToSectionProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        block: 'start'
      });
    }
  };

  return (
    <div 
      onClick={() => scrollToSection(sectionId)}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollToSection;
