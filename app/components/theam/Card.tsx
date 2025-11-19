'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  id?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean | 'lift' | 'scale' | 'glow' | 'slide' | 'rotate' | 'fade' | 'pulse';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'outline' | 'colored';
}

const Card = ({ 
  children, 
  id,
  variant = 'default',
  size = 'md',
  className = '',
  hover = false,
  padding = 'md',
  shadow
}: CardProps) => {
  const baseClasses = "bg-white rounded-xl border border-gray-100 transition-all duration-300 shadow-md";
  
  const getShadowClasses = () => {
    if (shadow) {
      const shadowClasses = {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        '2xl': "shadow-2xl",
        inner: "shadow-inner",
        outline: "shadow-outline",
        colored: "shadow-lg shadow-blue-500/25"
      };
      return shadowClasses[shadow] || "";
    }
    
    // Default shadow based on variant - smaller shadows
    const variantClasses = {
      default: "shadow-sm",
      elevated: "shadow-md",
      outlined: "shadow-none border-2",
      filled: "bg-gray-50 shadow-sm"
    };
    
    return variantClasses[variant] || "";
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-5", 
    lg: "p-6"
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8"
  };

  const getHoverClasses = () => {
    if (!hover) return "";
    
    if (hover === true) {
      return "hover:shadow-2xl hover:-translate-y-1";
    }
    
    const hoverTypeClasses = {
      lift: "hover:shadow-2xl hover:-translate-y-2",
      scale: "hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25",
      glow: "hover:shadow-2xl hover:shadow-blue-500/25",
      slide: "hover:translate-x-2 hover:shadow-2xl",
      rotate: "hover:rotate-1 hover:shadow-2xl",
      fade: "hover:opacity-90 hover:shadow-2xl",
      pulse: "hover:shadow-2xl"
    };
    
    return hoverTypeClasses[hover] || "";
  };

  const finalPadding = padding !== 'md' ? paddingClasses[padding] : sizeClasses[size];

  return (
    <div id={id} className={`${baseClasses} ${getShadowClasses()} ${finalPadding} ${getHoverClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
