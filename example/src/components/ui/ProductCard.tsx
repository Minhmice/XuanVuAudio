import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Logic for dynamic badge
  const getBadge = () => {
    if (product.price > 350) return 'Reference';
    if (product.rating > 4.7) return 'Flagship';
    if (product.price < 100) return 'Best Value';
    return null;
  };

  const badge = getBadge();
  const specLine = product.specs?.Type || Object.values(product.specs || {})[0] || 'Premium Audio';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-surface-low p-5 space-y-4 rounded-lg transition-all duration-500 hover:bg-surface-high relative flex flex-col h-full shadow-lg"
    >
      <div className="aspect-square bg-surface-base relative overflow-hidden rounded-md">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-primary text-[#0a0a20] px-2 py-0.5 rounded-sm">
            <span className="text-[9px] font-headline font-black tracking-widest uppercase">{badge}</span>
          </div>
        )}
        <button className="absolute bottom-3 right-2 w-10 h-10 bg-primary text-[#0a0a20] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-glow">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-grow flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-text-secondary font-headline font-bold uppercase tracking-[0.2em]">{product.brand}</span>
          <div className="flex items-center gap-1 text-[10px] text-text-secondary">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <span className="font-bold">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/products/${product.slug}`} className="block group/link">
          <h3 className="font-headline font-bold text-[15px] text-text-primary group-hover/link:text-primary transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-text-secondary font-body italic opacity-80">{specLine}</p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-auto">
        <div className="flex flex-col">
          <span className="text-[18px] font-headline font-bold text-text-primary tracking-tighter">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-text-secondary line-through opacity-50">${product.compareAtPrice}</span>
          )}
        </div>
        {/* Mobile-only visible add to cart */}
        <button className="sm:hidden w-8 h-8 bg-surface-highest text-primary rounded-full flex items-center justify-center">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
