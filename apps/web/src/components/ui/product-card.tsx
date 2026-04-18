"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonWithIcon } from "@/components/wrapper/button";
import { Badge } from "./badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 4.5,
  isNew,
  isSale,
  className,
}: ProductCardProps) {
  const formatPrice = (p: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex flex-col overflow-hidden bg-[var(--surface-base)] border border-[var(--surface-high)] selection:bg-[var(--primary)] selection:text-white",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isNew && (
          <Badge className="border-none bg-[var(--primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
            New
          </Badge>
        )}
        {isSale && <Badge className="bg-red-500 text-white border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">Sale</Badge>}
      </div>

      {/* Image Container */}
      <Link href={`/products/${id}`} className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-low)]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        
        {/* Quick Action Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/20 to-transparent">
          <ButtonWithIcon
            icon={<ShoppingBag className="h-4 w-4" />}
            className="h-10 w-full bg-white text-black hover:bg-[var(--primary)] hover:text-primary-foreground"
            size="sm"
          >
            Add to Tray
          </ButtonWithIcon>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col p-5 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {category}
          </span>
          <div className="flex items-center text-[10px] font-bold text-[var(--primary)]">
            <Star className="w-3 h-3 fill-current mr-1" />
            {rating}
          </div>
        </div>

        <Link href={`/products/${id}`} className="block group/title">
          <h3 className="font-headline text-[15px] font-black uppercase tracking-tight text-[var(--text-primary)] transition-colors group-hover/title:text-[var(--primary)] line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline space-x-2 pt-1 font-headline">
          <span className="text-[16px] font-black text-[var(--primary)]">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-[12px] font-bold text-[var(--text-secondary)] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
