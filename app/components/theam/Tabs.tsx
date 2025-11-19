'use client';

import { ReactNode, useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  className?: string;
  variant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  fontFamily?: 'sans' | 'poppins' | 'playfair' | 'rajdhani' | 'mono';
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  orientation?: 'horizontal' | 'vertical';
}

const Tabs = ({
  items,
  defaultActiveKey,
  className = '',
  variant = 'emerald',
  size = 'md',
  fullWidth = false,
  fontFamily = 'rajdhani',
  fontWeight = 'semibold',
  orientation = 'horizontal'
}: TabsProps) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key);

  const sizeClasses = {
    sm: 'text-md px-4 py-1.5',
    md: 'text-base px-5 py-2',
    lg: 'text-lg px-6 py-2.5'
  };

  const fontFamilyClasses = {
    sans: 'font-sans',
    poppins: 'font-poppins',
    playfair: 'font-playfair',
    rajdhani: 'font-rajdhani',
    mono: 'font-mono'
  };

  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const getTabClasses = (item: TabItem) => {
    const isActive = activeKey === item.key;
    const widthClass = fullWidth ? 'flex-1' : '';
    const baseClasses = `${sizeClasses[size]} ${widthClass} ${fontFamilyClasses[fontFamily]} ${fontWeightClasses[fontWeight]} transition-all duration-300 ease-in-out ${
      item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    }`;

    switch (variant) {
      case 'outline':
        return `${baseClasses} border-b-4 relative shadow-sm ${
          isActive
            ? 'border-blue-500 text-blue-600 bg-blue-50/40 shadow-md'
            : 'border-transparent text-gray-700 hover:text-blue-500 hover:bg-blue-50/30 hover:border-blue-400/50 hover:shadow-md'
        }`;
      case 'cyanblue':
        return `${baseClasses} rounded-lg transform shadow-md ${
          isActive
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-600 hover:shadow-lg'
        }`;
      case 'lime':
        return `${baseClasses} rounded-md border-2 transform shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-lime-400 to-green-500 border-lime-500 text-white shadow-xl shadow-lime-400/50'
            : 'bg-lime-50 border-lime-300 text-lime-700 hover:border-lime-500 hover:bg-lime-100 hover:shadow-lg'
        }`;
      case 'sunset':
        return `${baseClasses} rounded-xl transform shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/50'
            : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-orange-200 hover:to-purple-200 hover:shadow-lg'
        }`;
      case 'dark':
        return `${baseClasses} rounded-lg border transform shadow-md ${
          isActive
            ? 'bg-gray-800 border-gray-600 text-white shadow-xl shadow-gray-800/50'
            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500 hover:shadow-lg'
        }`;
      case 'elegant':
        return `${baseClasses} rounded-md border-b-4 transform shadow-md ${
          isActive
            ? 'bg-gradient-to-t from-amber-50 to-white border-amber-500 text-amber-700 shadow-lg shadow-amber-500/20'
            : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-lg'
        }`;
      case 'rose':
        return `${baseClasses} border-b-2 shadow-sm ${
          isActive
            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-md shadow-rose-500/20'
            : 'border-transparent text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 hover:shadow-md'
        }`;
      case 'fuchsia':
        return `${baseClasses} rounded-xl shadow-md border-2 ${
          isActive
            ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600 border-fuchsia-400 text-white shadow-xl shadow-fuchsia-500/40'
            : 'bg-white border-gray-200 text-gray-700 hover:border-fuchsia-300 hover:shadow-xl'
        }`;
      case 'sky':
        return `${baseClasses} rounded-2xl shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-500/40'
            : 'bg-sky-50 text-sky-700 hover:bg-sky-100 hover:shadow-lg'
        }`;
      case 'ocean':
        return `${baseClasses} rounded-full border-2 shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-teal-400 to-cyan-500 border-teal-300 text-white shadow-xl shadow-teal-500/30'
            : 'bg-transparent border-teal-300 text-teal-700 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg'
        }`;
      case 'amethyst':
        return `${baseClasses} rounded-lg shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-xl shadow-purple-500/40'
            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 hover:shadow-lg'
        }`;
      case 'arctic':
        return `${baseClasses} rounded-md shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/40'
            : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:shadow-lg'
        }`;
      case 'skyblue':
        return `${baseClasses} rounded-xl shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-sky-300 to-blue-400 text-white shadow-lg shadow-sky-400/40'
            : 'bg-sky-50 text-sky-700 hover:bg-sky-100 hover:shadow-lg'
        }`;
      case 'turquoise':
        return `${baseClasses} rounded-full border shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-teal-300 to-cyan-500 border-teal-400 text-white shadow-lg shadow-teal-400/40'
            : 'bg-transparent border-teal-300 text-teal-700 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg'
        }`;
      case 'neoncyan':
        return `${baseClasses} rounded-md border-2 shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-cyan-400 to-blue-400 border-cyan-500 text-white shadow-xl shadow-cyan-400/50'
            : 'bg-cyan-50 border-cyan-300 text-cyan-700 hover:border-cyan-500 hover:bg-cyan-100 hover:shadow-lg'
        }`;
      case 'neonorange':
        return `${baseClasses} rounded-md border-2 shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-orange-400 to-red-500 border-orange-500 text-white shadow-xl shadow-orange-500/50'
            : 'bg-orange-50 border-orange-300 text-orange-700 hover:border-orange-500 hover:bg-orange-100 hover:shadow-lg'
        }`;
      case 'electriclime':
        return `${baseClasses} rounded-md border-2 shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-lime-300 to-green-500 border-lime-500 text-white shadow-xl shadow-lime-400/50'
            : 'bg-lime-50 border-lime-300 text-lime-700 hover:border-lime-500 hover:bg-lime-100 hover:shadow-lg'
        }`;
      case 'seafoam':
        return `${baseClasses} rounded-lg shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-teal-200 to-green-300 text-gray-900 shadow-lg shadow-teal-300/40'
            : 'bg-teal-50 text-teal-700 hover:bg-teal-100 hover:shadow-lg'
        }`;
      case 'mintice':
        return `${baseClasses} rounded-md shadow-md ${
          isActive
            ? 'bg-green-300 text-gray-900 shadow-lg shadow-green-300/40'
            : 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-lg'
        }`;
      case 'watermelon':
        return `${baseClasses} rounded-xl shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-500/40'
            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 hover:shadow-lg'
        }`;
      case 'plum':
        return `${baseClasses} rounded-lg shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-lg shadow-purple-700/40'
            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 hover:shadow-lg'
        }`;
      case 'magenta':
        return `${baseClasses} rounded-xl border-2 shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-fuchsia-600 to-purple-700 border-fuchsia-500 text-white shadow-xl shadow-fuchsia-600/40'
            : 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700 hover:border-fuchsia-500 hover:bg-fuchsia-100 hover:shadow-lg'
        }`;
      case 'lavender':
        return `${baseClasses} rounded-lg shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-purple-200 to-violet-300 text-gray-900 shadow-lg shadow-purple-300/40'
            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 hover:shadow-lg'
        }`;
      case 'violet':
        return `${baseClasses} rounded-lg shadow-md ${
          isActive
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/40'
            : 'bg-violet-50 text-violet-700 hover:bg-violet-100 hover:shadow-lg'
        }`;
      case 'emerald':
      default:
        return `${baseClasses} rounded-md shadow-md transform ${
          isActive
            ? 'bg-gradient-to-r border-2 border-emerald-500 from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg'
        }`;
    }
  };

  const getTabListClasses = () => {
    const gapClass = 'gap-1';
    const directionClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
    
    if (fullWidth) {
      return `flex ${directionClass} ${gapClass} ${orientation === 'vertical' ? 'h-full' : 'w-full'}`;
    }
    return `inline-flex ${directionClass} ${gapClass}`;
  };

  const activeContent = items.find(item => item.key === activeKey)?.content;

  const getTabContainerClasses = () => {
    switch (variant) {
      case 'outline':
        return orientation === 'vertical' ? 'border-r border-gray-200 pr-4' : 'border-b border-gray-200';
      case 'cyanblue':
        return '';
      case 'lime':
        return 'bg-lime-50 p-2 rounded-lg border border-lime-200';
      case 'sunset':
        return '';
      case 'dark':
        return 'bg-gray-900 p-2 rounded-lg';
      case 'elegant':
        return orientation === 'vertical' ? 'border-r-2 border-amber-200 pr-4' : 'border-b-2 border-amber-200';
      case 'rose':
        return '';
      case 'fuchsia':
        return 'p-2';
      case 'sky':
        return 'bg-gradient-to-br from-sky-50 to-blue-50 p-2 rounded-3xl shadow-md';
      case 'ocean':
        return 'bg-gradient-to-r from-teal-50 to-cyan-50 p-2 rounded-full';
      case 'amethyst':
        return 'bg-purple-50 p-2 rounded-lg';
      case 'arctic':
        return 'bg-cyan-50 p-2 rounded-lg';
      case 'skyblue':
        return 'bg-sky-50 p-2 rounded-xl';
      case 'turquoise':
        return 'bg-teal-50 p-2 rounded-full';
      case 'neoncyan':
        return 'bg-cyan-50 p-2 rounded-lg border border-cyan-200';
      case 'neonorange':
        return 'bg-orange-50 p-2 rounded-lg border border-orange-200';
      case 'electriclime':
        return 'bg-lime-50 p-2 rounded-lg border border-lime-200';
      case 'seafoam':
        return 'bg-teal-50 p-2 rounded-lg';
      case 'mintice':
        return 'bg-green-50 p-2 rounded-md';
      case 'watermelon':
        return 'bg-rose-50 p-2 rounded-xl';
      case 'plum':
        return 'bg-purple-50 p-2 rounded-lg';
      case 'magenta':
        return 'bg-fuchsia-50 p-2 rounded-xl border border-fuchsia-200';
      case 'lavender':
        return 'bg-purple-50 p-2 rounded-lg';
      case 'violet':
        return 'bg-violet-50 p-2 rounded-lg';
      case 'emerald':
      default:
        return '';
    }
  };

  return (
    <div className={`${className} ${orientation === 'vertical' ? 'flex gap-6' : ''}`}>
      {/* Tab List */}
      <div className={`${getTabListClasses()} ${getTabContainerClasses()}`}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => !item.disabled && setActiveKey(item.key)}
            className={getTabClasses(item)}
            disabled={item.disabled}
          >
            
              {item.label}
            
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`${orientation === 'vertical' ? 'flex-1' : 'mt-6'}`}>
        <div 
          key={activeKey}
          className="animate-fadeIn"
        >
          {activeContent}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
