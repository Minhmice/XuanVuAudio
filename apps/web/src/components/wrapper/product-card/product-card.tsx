"use client";

import React from "react";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getBadge = () => {
    if (product.price > 350) return "Reference";
    if (product.rating > 4.7) return "Flagship";
    if (product.price < 100) return "Best Value";
    return null;
  };

  const badge = getBadge();
  const specLine = product.specs?.Type || Object.values(product.specs || {})[0] || "Premium Audio";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "group relative flex h-full flex-col space-y-4 rounded-lg bg-[var(--surface-low)] p-5 shadow-lg transition-all duration-500 hover:bg-[var(--surface-high)]",
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-[var(--surface-base)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {badge ? (
          <div className="absolute left-3 top-3 rounded-sm bg-[var(--primary)] px-2 py-0.5 text-primary-foreground">
            <span className="font-headline text-[9px] font-black uppercase tracking-widest">{badge}</span>
          </div>
        ) : null}
        <button className="absolute bottom-3 right-2 flex h-10 w-10 translate-y-4 cursor-pointer items-center justify-center rounded-full bg-[var(--primary)] text-primary-foreground opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110">
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-grow flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">{product.brand}</span>
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
            <Star className="h-2.5 w-2.5 fill-[var(--primary)] text-[var(--primary)]" />
            <span className="font-bold">{product.rating}</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`} className="group/link block cursor-pointer">
          <h3 className="font-headline line-clamp-2 text-[15px] font-bold leading-tight text-[var(--text-primary)] transition-colors group-hover/link:text-[var(--primary)]">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-[11px] italic text-[var(--text-secondary)] opacity-80">{specLine}</p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="flex flex-col">
          <span className="font-headline text-[18px] font-bold tracking-tighter text-[var(--text-primary)]">${product.price}</span>
          {product.compareAtPrice ? (
            <span className="text-[11px] text-[var(--text-secondary)] line-through opacity-50">${product.compareAtPrice}</span>
          ) : null}
        </div>
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--surface-highest)] text-[var(--primary)] sm:hidden">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
