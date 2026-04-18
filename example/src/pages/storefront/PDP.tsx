import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorefrontShell } from '../../components/layout/Shells';
import { PRODUCTS } from '../../mockData';
import { AppButton } from '../../components/ui/AppButton';
import { ProductCard } from '../../components/ui/ProductCard';
import { ShoppingCart, Share2, Heart, Scale, MapPin } from 'lucide-react';

export function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return (
      <StorefrontShell>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
          <h2 className="text-3xl font-bold uppercase underline">Product Not Found</h2>
          <Link to="/">
            <AppButton>Back to Home_Page</AppButton>
          </Link>
        </div>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Obsidian</Link>
          <span className="opacity-30">/</span>
          <Link to="/categories" className="hover:text-primary transition-colors">Systems</Link>
          <span className="opacity-30">/</span>
          <span className="text-text-primary">Architecture</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square bg-surface-low relative overflow-hidden rounded-sm group">
               <img src={product.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
               <div className="absolute bottom-6 left-6 inline-flex items-center space-x-2 bg-surface-highest/80 backdrop-blur-sm px-3 py-1 border-l border-primary">
                 <span className="text-[10px] font-headline font-bold text-text-primary tracking-widest uppercase">Master Reference</span>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-surface-low hover:bg-surface-high transition-colors cursor-pointer rounded-sm overflow-hidden border border-transparent hover:border-primary/30">
                  <img src={product.image} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
               <div className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-primary">System Type: {product.brand}</div>
               <h1 className="text-4xl font-headline font-bold text-text-primary tracking-tighter leading-tight">{product.name}</h1>
               <div className="flex items-baseline gap-4 py-6 border-b border-surface-highest">
                 <span className="text-4xl font-headline font-bold text-text-primary">${product.price}</span>
                 {product.compareAtPrice && <span className="text-text-secondary line-through text-xl">${product.compareAtPrice}</span>}
               </div>
            </div>

            <p className="text-text-secondary text-[14px] leading-relaxed font-body">
              {product.description || "Uncompromising architectural precision. Designed for the most demanding audiophiles who require absolute transparency and a soundstage that defies physical boundaries."}
            </p>

            <div className="flex flex-col space-y-4">
               <AppButton size="lg" variant="accent" className="w-full">Initialize Acquisition</AppButton>
               <AppButton size="lg" variant="outline" className="w-full">Technical Consultation</AppButton>
            </div>

            <div className="flex gap-6 pt-6 border-t border-surface-high text-[11px] font-headline font-bold uppercase tracking-widest text-text-secondary">
               <button className="hover:text-primary transition-colors flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> Save Configuration</button>
               <button className="hover:text-primary transition-colors flex items-center gap-2"><Scale className="w-3.5 h-3.5" /> Bench Comparisons</button>
            </div>

            {/* Availability */}
            <div className="p-8 bg-surface-low rounded-sm space-y-6">
               <div className="flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-primary" />
                 <h4 className="font-headline font-bold uppercase tracking-widest text-[12px] text-text-primary">Architecture Availability</h4>
               </div>
               <div className="space-y-4">
                 <div className="flex items-center justify-between text-[11px] font-body font-bold border-b border-surface-highest pb-3">
                   <span className="text-text-secondary uppercase tracking-wider">Hanoi Engineering Hub</span>
                   <span className="text-primary tracking-widest uppercase">Verified: Active</span>
                 </div>
                 <div className="flex items-center justify-between text-[11px] font-body font-bold border-b border-surface-highest pb-3">
                   <span className="text-text-secondary uppercase tracking-wider">HCM Processing Center</span>
                   <span className="text-primary tracking-widest uppercase">Verified: Active</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="mt-32 space-y-12">
          <div className="border-b border-surface-highest flex gap-16 overflow-x-auto">
            <button className="text-[14px] font-headline font-bold border-b-2 border-primary pb-4 uppercase tracking-widest text-text-primary">System Specifications</button>
            <button className="text-[14px] font-headline font-bold text-text-secondary hover:text-text-primary pb-4 uppercase tracking-widest transition-colors">Acoustic Reviews</button>
          </div>
          
          <div className="max-w-4xl bg-surface-low rounded-sm overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-surface-highest">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 md:grid-cols-2 py-5 px-8 hover:bg-surface-high transition-colors group">
                  <span className="text-[11px] font-headline font-bold uppercase tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">{key}</span>
                  <span className="text-[13px] font-body text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-32 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-headline font-bold uppercase tracking-tight text-text-primary">Synthesized Architecture</h2>
            <Link to="/categories" className="text-text-secondary hover:text-primary font-headline font-bold text-[11px] uppercase tracking-widest">Full Ecosystem</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
