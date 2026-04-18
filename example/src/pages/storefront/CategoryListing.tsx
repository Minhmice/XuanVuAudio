import React from 'react';
import { StorefrontShell } from '../../components/layout/Shells';
import { PRODUCTS, CATEGORIES } from '../../mockData';
import { ProductCard } from '../../components/ui/ProductCard';
import { AppButton } from '../../components/ui/AppButton';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export function CategoryListing() {
  const { slug } = useParams();
  const category = CATEGORIES.find(c => c.slug === slug);

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="space-y-6 mb-16">
          <nav className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-primary">
            Architecture / {category?.name?.toUpperCase() || 'SYNTHESIZED_COLLECTION'}
          </nav>
          <h1 className="text-5xl font-headline font-bold text-text-primary tracking-tighter leading-none">{category?.name || 'Full Ecosystem'}</h1>
          <p className="text-text-secondary text-[14px] max-w-2xl leading-relaxed font-body">
            {category?.description || "Curated reference-grade components. Every entry in this collection has been verified against our standard for tonal accuracy and material integrity."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 space-y-12 shrink-0">
             <div className="space-y-6">
                <h3 className="text-[11px] font-headline font-bold uppercase tracking-[0.2em] text-text-primary mb-6">Transducer Labs</h3>
                <div className="space-y-4">
                  {['Audeze', 'Hifiman', 'Sennheiser', 'Meze Audio'].map(brand => (
                    <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-4 h-4 bg-surface-base border border-surface-highest group-hover:border-primary transition-colors rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary scale-0 group-hover:scale-100 transition-transform"></div>
                      </div>
                      <span className="text-[12px] font-body text-text-secondary group-hover:text-text-primary transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
             </div>

             <div className="space-y-6 pt-12 border-t border-surface-high">
                <h3 className="text-[11px] font-headline font-bold uppercase tracking-[0.2em] text-text-primary mb-6">Price Calibration</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-10 bg-surface-low border border-surface-highest px-3 flex items-center text-[11px] font-body text-text-primary rounded-sm focus-within:border-primary transition-colors">
                      <span className="text-[9px] text-text-secondary mr-2">$</span>
                      <input type="text" placeholder="Min" className="bg-transparent outline-none w-full" />
                    </div>
                    <span className="text-text-secondary">-</span>
                    <div className="flex-grow h-10 bg-surface-low border border-surface-highest px-3 flex items-center text-[11px] font-body text-text-primary rounded-sm focus-within:border-primary transition-colors">
                      <span className="text-[9px] text-text-secondary mr-2">$</span>
                      <input type="text" placeholder="Max" className="bg-transparent outline-none w-full" />
                    </div>
                  </div>
                  <AppButton size="md" className="w-full" variant="secondary">Recalibrate List</AppButton>
                </div>
             </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-12">
            <div className="flex items-center justify-between py-6 border-b border-surface-high">
               <span className="text-[11px] font-headline font-bold text-text-secondary uppercase tracking-widest">Displaying {PRODUCTS.length} Units</span>
               <div className="flex items-center gap-6">
                  <div className="text-[11px] font-headline font-bold text-text-primary uppercase tracking-widest cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
                    Sort: Priority <ChevronDown className="w-3 h-3" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="pt-16 flex justify-center border-t border-surface-high">
              <div className="flex items-center gap-8 text-[11px] font-headline font-bold uppercase tracking-[0.3em]">
                 <button className="text-text-secondary hover:text-text-primary transition-colors">Previous</button>
                 <div className="flex gap-4">
                    <span className="text-primary border-b-2 border-primary pb-1">01</span>
                    <span className="text-text-secondary hover:text-text-primary transition-colors pb-1">02</span>
                    <span className="text-text-secondary hover:text-text-primary transition-colors pb-1">03</span>
                 </div>
                 <button className="text-text-secondary hover:text-text-primary transition-colors text-primary underline underline-offset-4 decoration-2">Next Page</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontShell>
  );
}
