'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = ({
  children,
  variant = 'emerald',
  size = 'md',
  className = ''
}: BadgeProps) => {
  const baseClasses = "inline-flex items-center font-semibold rounded-full backdrop-blur-sm border shadow-sm";
  
  const sizeClasses = {
    sm: "text-xs px-3 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-2"
  };

  const variantClasses: Record<string, string> = {
    emerald: 'bg-gradient-to-r from-emerald-50/5 to-teal-100/5 text-emerald-700 border-emerald-400/50 shadow-emerald-500/20',
    outline: 'bg-blue-50/5 text-blue-700 border-blue-400/5 border-b-2 shadow-blue-500/20',
    cyanblue: 'bg-gradient-to-r from-cyan-50/5 to-blue-50/5 text-cyan-700 border-cyan-400/50 shadow-cyan-500/20',
    lime: 'bg-lime-50/50 text-lime-700 border-lime-500/60 shadow-lime-400/40',
    sunset: 'bg-gradient-to-r from-purple-50/5 via-pink-50/5 to-orange-50/5 text-purple-700 border-pink-400/50 shadow-pink-500/20',
    dark: 'bg-gray-800/90 text-white border-gray-600/60 shadow-gray-800/40',
    elegant: 'bg-gradient-to-r from-amber-50/5 to-orange-50/5 text-amber-700 border-orange-400 shadow-amber-500/20',
    fuchsia: 'bg-gradient-to-r from-fuchsia-50/5 to-pink-50/5 text-fuchsia-700 border-fuchsia-400/50 shadow-fuchsia-500/20',
    sky: 'bg-gradient-to-r from-sky-50/5 to-blue-50/5 text-sky-700 border-sky-400/50 shadow-sky-500/20',
    ocean: 'bg-gradient-to-r from-teal-50/5 to-cyan-50/5 text-teal-700 border-teal-400/50 shadow-teal-500/20',
    rose: 'bg-rose-50/5 text-rose-700 border-rose-300/50 shadow-rose-500/20',
    amethyst: 'bg-gradient-to-r from-purple-50/5 to-violet-60/5 text-purple-700 border-purple-400/50 shadow-purple-500/20',
    arctic: 'bg-gradient-to-r from-cyan-50/5 to-blue-50/5 text-cyan-700 border-cyan-400/50 shadow-cyan-500/20',
    skyblue: 'bg-gradient-to-r from-sky-30/5 to-blue-40/5 text-sky-700 border-sky-400/50 shadow-sky-500/20',
    turquoise: 'bg-gradient-to-r from-teal-30/5 to-cyan-50/5 text-teal-700 border-teal-400/50 shadow-teal-500/20',
    neoncyan: 'bg-cyan-40/3 text-cyan-80 border-cyan-500/60 shadow-cyan-400/40',
    neonorange: 'bg-orange-50/3 text-orange-80 border-orange-500/60 shadow-orange-500/40',
    electriclime: 'bg-lime-40/3 text-lime-80 border-lime-500/60 shadow-lime-400/40',
    seafoam: 'bg-gradient-to-r from-teal-20/2 to-green-30/2 text-teal-700 border-teal-400/50 shadow-teal-500/20',
    mintice: 'bg-green-30/2 text-green-70 border-green-400/50 shadow-green-500/20',
    watermelon: 'bg-gradient-to-r from-rose-40/2 to-pink-50/2 text-rose-70 border-rose-400/50 shadow-rose-500/20',
    plum: 'bg-gradient-to-r from-purple-70/2 to-fuchsia-70/2 text-purple-70 border-purple-600/50 shadow-purple-700/20',
    magenta: 'bg-gradient-to-r from-fuchsia-60/2 to-purple-70/2 text-fuchsia-70 border-fuchsia-500/50 shadow-fuchsia-600/20',
    lavender: 'bg-gradient-to-r from-purple-20/2 to-violet-30/2 text-purple-70 border-purple-300/50 shadow-purple-300/20',
    violet: 'bg-gradient-to-r from-violet-50/2 to-purple-60/2 text-violet-70 border-violet-400/50 shadow-violet-500/20',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
