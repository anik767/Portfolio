'use client';

import { ReactNode } from 'react';
import Badge from './Badge';
import Button from './Button';
import Text from './Text';

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  badgeVariant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  className?: string;
  children?: ReactNode;
  variant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
}

const ProductCard = ({
  title,
  description,
  price,
  image,
  badge,
  badgeVariant = 'emerald',
  onAddToCart,
  onViewDetails,
  className = '',
  children,
  variant = 'emerald'
}: ProductCardProps) => {
  const getCardClasses = () => {
    const baseClasses = 'rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group';
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} bg-white border-2 border-gray-200 border-b-4 border-b-blue-500`;
      case 'cyanblue':
        return `${baseClasses} bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-500/30`;
      case 'lime':
        return `${baseClasses} bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-400/50 shadow-lime-400/20`;
      case 'sunset':
        return `${baseClasses} bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 border-2 border-purple-500/30`;
      case 'dark':
        return `${baseClasses} bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 text-white`;
      case 'elegant':
        return `${baseClasses} bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-500/30`;
      case 'rose':
        return `${baseClasses} bg-white border-2 border-rose-200 hover:border-rose-300`;
      case 'fuchsia':
        return `${baseClasses} bg-gradient-to-br from-fuchsia-50 to-pink-50 border-2 border-fuchsia-500/30`;
      case 'sky':
        return `${baseClasses} bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-400/40`;
      case 'ocean':
        return `${baseClasses} bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-500/30 rounded-3xl`;
      case 'amethyst':
        return `${baseClasses} bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-500/30`;
      case 'arctic':
        return `${baseClasses} bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-500/30`;
      case 'skyblue':
        return `${baseClasses} bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-400/30`;
      case 'turquoise':
        return `${baseClasses} bg-gradient-to-br from-teal-50 to-cyan-100 border-2 border-teal-400/40`;
      case 'neoncyan':
        return `${baseClasses} bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-500/50 shadow-cyan-400/20`;
      case 'neonorange':
        return `${baseClasses} bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-500/50 shadow-orange-500/20`;
      case 'electriclime':
        return `${baseClasses} bg-gradient-to-br from-lime-100 to-green-100 border-2 border-lime-500/50 shadow-lime-400/20`;
      case 'seafoam':
        return `${baseClasses} bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-300/30`;
      case 'mintice':
        return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300/30`;
      case 'watermelon':
        return `${baseClasses} bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-400/40`;
      case 'plum':
        return `${baseClasses} bg-gradient-to-br from-purple-100 to-fuchsia-100 border-2 border-purple-700/30`;
      case 'magenta':
        return `${baseClasses} bg-gradient-to-br from-fuchsia-50 to-purple-100 border-2 border-fuchsia-600/40`;
      case 'lavender':
        return `${baseClasses} bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200/50`;
      case 'violet':
        return `${baseClasses} bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-500/30`;
      case 'emerald':
      default:
        return `${baseClasses} bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500/30`;
    }
  };

  const getTitleColor = () => {
    if (variant === 'dark') {
      return 'white';
    }
    return 'black';
  };

  const getDescriptionColor = () => {
    if (variant === 'dark') {
      return 'white';
    }
    return 'gray';
  };

  const getPriceClasses = () => {
    switch (variant) {
      case 'outline':
        return 'text-blue-600';
      case 'cyanblue':
        return 'text-cyan-600';
      case 'lime':
        return 'text-lime-600';
      case 'sunset':
        return 'text-purple-600';
      case 'dark':
        return 'text-blue-400';
      case 'elegant':
        return 'text-amber-600';
      case 'rose':
        return 'text-rose-600';
      case 'fuchsia':
        return 'text-fuchsia-600';
      case 'sky':
        return 'text-sky-600';
      case 'ocean':
        return 'text-teal-600';
      case 'amethyst':
        return 'text-purple-600';
      case 'arctic':
        return 'text-cyan-600';
      case 'skyblue':
        return 'text-sky-600';
      case 'turquoise':
        return 'text-teal-600';
      case 'neoncyan':
        return 'text-cyan-700';
      case 'neonorange':
        return 'text-orange-600';
      case 'electriclime':
        return 'text-lime-700';
      case 'seafoam':
        return 'text-teal-600';
      case 'mintice':
        return 'text-green-600';
      case 'watermelon':
        return 'text-rose-600';
      case 'plum':
        return 'text-purple-700';
      case 'magenta':
        return 'text-fuchsia-600';
      case 'lavender':
        return 'text-purple-600';
      case 'violet':
        return 'text-violet-600';
      case 'emerald':
      default:
        return 'text-emerald-600';
    }
  };

  return (
    <div className={`${getCardClasses()} ${className}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <Text 
          variant="h3" 
          size="lg" 
          fontFamily="rajdhani" 
          color={getTitleColor()} 
          weight="bold"
          className="mb-2"
        >
          {title}
        </Text>
        
        <Text 
          variant="body" 
          fontFamily="poppins" 
          color={getDescriptionColor()} 
          className="mb-4 line-clamp-2"
        >
          {description}
        </Text>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <Text 
            variant="h3" 
            size="xl" 
            fontFamily="rajdhani" 
            weight="bold"
            className={getPriceClasses()}
          >
            {price}
          </Text>
        </div>

        {/* Custom Content */}
        {children}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="emerald"
            size="sm"
            onClick={onAddToCart}
            className="flex-1"
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
