'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  scrollTo?: string;
  variant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  Align?: 'left' | 'center' | 'right';
  color?: 'blue' | 'white' | 'pink' | 'purple' | 'gray' | 'black' | 'green' | 'red' | 'yellow' | 'indigo' | 'cyan';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  scrollTo,
  variant = 'emerald', 
  size = 'md',
  Align = 'center',
  color = 'black',
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const AlignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  };

  const baseClasses = "font-bold rounded-full shadow-lg transition-all duration-300 ease-out flex items-center group transform hover:shadow-xl backdrop-blur-sm cursor-pointer hover:scale-105";
  
  const sizeClasses = {
    sm: "py-2 px-5 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-2 px-8 text-lg"
  };

  const variantClasses = {
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
    outline: "bg-transparent text-white  border-gray-300 border-4",
    cyanblue: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30",
    lime: "bg-gradient-to-r from-lime-400 to-green-500 text-white border-2 border-lime-500 shadow-lime-400/50 hover:shadow-lime-400/70",
    sunset: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-pink-500/40",
    dark: "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-gray-800/40",
    elegant: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/30",
    fuchsia: "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-fuchsia-500/40",
    sky: "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sky-500/40",
    ocean: "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-teal-500/40",
    rose: "bg-rose-500 text-white shadow-rose-500/30 border-2 border-rose-300",
    amethyst: "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-purple-500/40",
    arctic: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/40",
    skyblue: "bg-gradient-to-r from-sky-300 to-blue-400 text-white shadow-sky-400/40",
    turquoise: "bg-gradient-to-r from-teal-300 to-cyan-500 text-white shadow-teal-400/40",
    neoncyan: "bg-gradient-to-r from-cyan-400 to-blue-400 text-white border-2 border-cyan-500 shadow-cyan-400/50 hover:shadow-cyan-400/70",
    neonorange: "bg-gradient-to-r from-orange-400 to-red-500 text-white border-2 border-orange-500 shadow-orange-500/50 hover:shadow-orange-500/70",
    electriclime: "bg-gradient-to-r from-lime-300 to-green-500 text-white border-2 border-lime-500 shadow-lime-400/50 hover:shadow-lime-400/70",
    seafoam: "bg-gradient-to-r from-teal-200 to-green-300 text-gray-900 shadow-teal-300/40",
    mintice: "bg-green-300 text-gray-900 shadow-green-300/40",
    watermelon: "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-rose-500/40",
    plum: "bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-purple-700/40",
    magenta: "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white shadow-fuchsia-600/40",
    lavender: "bg-gradient-to-r from-purple-200 to-violet-300 text-gray-900 shadow-purple-300/40",
    violet: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-violet-500/40"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:-none hover:scale-100" : "";

  const handleClick = () => {
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        // Get element position
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for fixed header
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (onClick) {
      onClick();
    }
  };


  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${AlignClasses[Align as keyof typeof AlignClasses]} ${disabledClasses} ${className}`}
    
    >
      {children}
    </button>
  );
};

export default Button;
