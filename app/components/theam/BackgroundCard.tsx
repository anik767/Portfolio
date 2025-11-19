'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  id?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'colored';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BackgroundCard = ({
  children,
  id,
  variant = 'default',
  size = 'md',
  className = '',
}: CardProps) => {
  const baseClasses = "bg-white rounded-xl border border-gray-100 transition-all duration-300 ";

  const variantClasses = {
    default: "shadow-sm",
    elevated: "shadow-md",
    outlined: "shadow-none border-2",
    colored: "shadow-blue-500/25"
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-5",
    lg: "p-6"
  };

  return (
    <div id={id} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export default BackgroundCard;
