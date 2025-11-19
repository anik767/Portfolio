'use client';

import { ReactTyped } from 'react-typed';

interface TypingAnimationProps {
  text: string | string[];
  speed?: number;
  className?: string;
  loop?: boolean;
  backSpeed?: number;
  backDelay?: number;
  textColor?: 'primary' | 'secondary' | 'pink' | 'muted' | 'white' | 'black' | 'gray';
  fontFamily?: 'sans' | 'poppins' | 'playfair' | 'rajdhani' | 'mono';
}

const TypingAnimation = ({ 
  text, 
  speed = 50, 
  className = '',
  loop = false,
  backSpeed = 5,
  backDelay = 500,
  textColor = 'primary',
  fontFamily = 'sans'
}: TypingAnimationProps) => {
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    pink: 'text-pink-400',
    muted: 'text-gray-400',
    white: 'text-white',
    black: 'text-black',
    gray: 'text-gray-500'
  } as const;

  const fontFamilyClasses = {
    sans: 'font-sans',
    poppins: 'font-poppins',
    playfair: 'font-playfair',
    rajdhani: 'font-rajdhani',
    mono: 'font-mono'
  } as const;

  return (
    <div className={className}>
      <ReactTyped
        strings={Array.isArray(text) ? text : [text]}
        typeSpeed={speed}
        backSpeed={backSpeed}
        backDelay={backDelay}
        loop={loop}
        showCursor={true}
        cursorChar="|"
        className={`${colorClasses[textColor]} ${fontFamilyClasses[fontFamily]} transition-colors duration-200`}
      />
    </div>
  );
};

export default TypingAnimation;
