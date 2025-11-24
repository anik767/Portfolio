'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'small' | 'stock';

interface TextProps {
  children: ReactNode;
  variant?: Variant;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'accent' | 'pink' | 'muted' | 'white' | 'black' | 'gray';
  gradient?: 'pink' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan' | 'yellow' | 'custom' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  fontFamily?: 'sans' | 'poppins' | 'playfair' | 'rajdhani' | 'mono' | 'helvetica';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: ElementType;
  id?: string;
  style?: CSSProperties;
  stroke?: boolean;
  strokeWidth?: string; // e.g. '.8px'
  strokeColor?: string; // e.g. 'gray'
}

const Text = ({ 
  children, 
  variant = 'body',
  size,
  weight,
  color = 'primary',
  gradient,
  gradientDirection = 'to-r',
  fontFamily = 'sans',
  align = 'left',
  className = '',
  as,
  id,
  style,
  stroke = false,
  strokeWidth = '.8px',
  strokeColor = 'gray'
}: TextProps) => {
  // Default size mapping based on variant
  const defaultSizes: Record<Variant, 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'> = {
    h1: '6xl',
    h2: '5xl', 
    h3: '4xl',
    h4: '3xl',
    h5: '2xl',
    h6: 'xl',
    body: 'base',
    caption: 'sm',
    small: 'xs',
    stock: 'base'
  };

  // Default weight mapping based on variant
  const defaultWeights: Record<Variant, 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'> = {
    h1: 'black',
    h2: 'extrabold',
    h3: 'bold',
    h4: 'bold',
    h5: 'semibold',
    h6: 'semibold',
    body: 'normal',
    caption: 'medium',
    small: 'normal',
    stock: 'normal'
  };

  const finalSize = size || defaultSizes[variant];
  const finalWeight = weight || defaultWeights[variant];
  const headingTag = (variant && variant.startsWith('h')) ? (variant as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6') : 'p';
  const Component: ElementType = as || headingTag;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  } as const;

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  } as const;

  const colorClasses = {
    primary: 'text-gray-300',
    secondary: 'text-gray-300',
    pink: 'text-pink-400',
    accent: 'text-[#59C378]',
    muted: 'text-gray-400',
    white: 'text-white',
    black: 'text-black',
    gray: 'text-gray-500'
  } as const;

  const gradientClasses = {
    pink: 'bg-linear-to-r from-pink-400 via-pink-500 to-pink-600',     // Fresh Green theme - will use inline style
    blue: 'bg-linear-to-r from-blue-400 via-blue-500 to-blue-600',     // Warm Sunset (Yellow) theme - will use inline style  
    purple: 'bg-linear-to-r from-purple-400 via-purple-500 to-purple-600',
    green: 'bg-linear-to-r from-green-400 via-green-500 to-green-600',
    orange: 'bg-linear-to-r from-orange-400 via-orange-500 to-orange-600',
    red: 'bg-linear-to-r from-red-400 via-red-500 to-red-600',
    cyan: 'bg-linear-to-r from-cyan-400 via-cyan-500 to-cyan-600',
    yellow: 'bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600',
    custom: '',
    amethyst: 'bg-linear-to-r from-purple-500 via-purple-600 to-violet-600',
    arctic: 'bg-linear-to-r from-cyan-500 via-cyan-600 to-blue-500',
    skyblue: 'bg-linear-to-r from-sky-300 via-sky-400 to-blue-400',
    turquoise: 'bg-linear-to-r from-teal-300 via-teal-400 to-cyan-500',
    neoncyan: 'bg-linear-to-r from-cyan-400 via-cyan-500 to-blue-400',
    neonorange: 'bg-linear-to-r from-orange-400 via-orange-500 to-red-500',
    electriclime: 'bg-linear-to-r from-lime-300 via-lime-400 to-green-500',
    seafoam: 'bg-linear-to-r from-teal-200 via-teal-300 to-green-300',
    mintice: 'bg-linear-to-r from-green-300 via-green-400 to-green-500',
    watermelon: 'bg-linear-to-r from-rose-400 via-rose-500 to-pink-500',
    plum: 'bg-linear-to-r from-purple-700 via-purple-800 to-fuchsia-700',
    magenta: 'bg-linear-to-r from-fuchsia-600 via-fuchsia-700 to-purple-700',
    lavender: 'bg-linear-to-r from-purple-200 via-purple-300 to-violet-300',
    violet: 'bg-linear-to-r from-violet-500 via-violet-600 to-purple-600'
  } as const;

  const gradientDirectionClasses = {
    'to-r': 'bg-linear-to-r',
    'to-l': 'bg-linear-to-l',
    'to-t': 'bg-linear-to-t',
    'to-b': 'bg-linear-to-b',
    'to-tr': 'bg-linear-to-tr',
    'to-tl': 'bg-linear-to-tl',
    'to-br': 'bg-linear-to-br',
    'to-bl': 'bg-linear-to-bl'
  } as const;

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  } as const;

  const fontFamilyClasses = {
    sans: 'font-sans',
    poppins: 'font-poppins',
    playfair: 'font-playfair',
    rajdhani: 'rajdhani',
    mono: 'font-mono',
    helvetica: 'font-helvetica'
  } as const;

  const baseClasses = "transition-colors duration-200 text-black";
  
  // Get theme gradient style
  const getThemeGradientStyle = () => {
    if (gradient === 'pink') return { 
      background: 'linear-gradient(to right, #c4ffb2, #164c3b)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };
    
    if (gradient === 'blue') return { 
      background: 'linear-gradient(to right, #fff58c, #9c4e23)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };
    return {};
  };
  
  // Determine if we should use gradient or solid color
  const isGradient = gradient && gradient !== 'custom';
  const gradientClass = isGradient ? gradientClasses[gradient as keyof typeof gradientClasses] : '';
  const directionClass = isGradient ? gradientDirectionClasses[gradientDirection] : '';
  const colorClass = isGradient ? '' : colorClasses[color];
  
  const finalClassName = `${baseClasses} ${sizeClasses[finalSize as keyof typeof sizeClasses]} ${weightClasses[finalWeight as keyof typeof weightClasses]} ${colorClass} ${alignClasses[align]} ${fontFamilyClasses[fontFamily]} ${className}`;
  
  const gradientClassName = isGradient ? `${directionClass} ${gradientClass} bg-clip-text text-transparent` : '';
  
  const themeGradientStyle = getThemeGradientStyle();
  const strokeStyle = stroke
    ? {
        WebkitTextFillColor: 'transparent',
        WebkitTextStroke: `${strokeWidth} ${strokeColor}`
      }
    : {};
  const combinedStyle = { ...style, ...strokeStyle, ...themeGradientStyle };

  return (
    <Component id={id} className={`${finalClassName} ${gradientClassName}`} style={combinedStyle}>
      {children}
    </Component>
  );
};

export default Text;
