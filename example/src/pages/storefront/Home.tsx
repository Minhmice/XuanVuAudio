import React from 'react';
import { StorefrontShell } from '../../components/layout/Shells';
import { PRODUCTS, CATEGORIES, BRANDS, ARTICLES } from '../../mockData';
import { ProductCard } from '../../components/ui/ProductCard';
import { AppButton } from '../../components/ui/AppButton';
import { ArrowRight, Headphones, Router, Cable, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Home() {
  const [activeTab, setActiveTab] = React.useState('Just Dropped');

  const tabs = ['Just Dropped', 'Best Sellers', 'Staff Picks'];
  const filteredProducts = PRODUCTS.slice(0, 4); // Simulating tab logic

  return (
    <StorefrontShell>
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
        <div className="lg:col-span-5 flex flex-col space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-surface-high px-4 py-1 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label text-[11px] uppercase tracking-widest text-text-secondary">Limited Batch Available</span>
          </div>
          <h1 className="font-headline text-[64px] lg:text-[72px] leading-[0.9] font-bold text-text-primary tracking-tighter">
            The Obsidian <br/><span className="text-primary italic">One.</span>
          </h1>
          <p className="font-body text-[15px] leading-relaxed text-text-secondary max-w-[480px]">
            The apex of planar magnetic engineering. Precision tuned for a soundstage that defies physical boundaries. 100mm ultra-thin diaphragm. Uncompromising transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <AppButton size="lg" variant="accent" className="w-full sm:w-auto shadow-glow">Explore Obsidian One</AppButton>
            <button className="h-[48px] px-6 text-text-primary font-label font-bold uppercase tracking-widest text-[12px] hover:text-primary transition-all duration-300 flex items-center space-x-2 group">
              <span>View Technical Specs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] bg-surface-low rounded-lg overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-transparent to-transparent z-10"></div>
          <img 
            alt="Obsidian One Headphone" 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out opacity-80" 
            src="https://picsum.photos/seed/obsidian-p1/1200/800?grayscale"
            referrerPolicy="no-referrer"
          />
          {/* Floating Spec Token */}
          <div className="absolute top-12 right-12 z-20 bg-surface-highest/60 backdrop-blur-xl p-5 rounded-sm border-l-2 border-primary transform hover:-translate-y-1 transition-transform duration-300 shadow-xl">
             <div className="space-y-1">
                <p className="font-label text-[10px] uppercase text-text-secondary tracking-[0.2em]">Transducer</p>
                <p className="font-headline text-[18px] font-bold text-text-primary">Planar Magnetic</p>
                <div className="w-12 h-0.5 bg-primary/30 mt-2"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO STRIP */}
      <section className="bg-surface-low/50 backdrop-blur-sm border-y border-surface-high">
        <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Authorized Dealer', icon: ShieldCheck },
            { label: 'Free Express Shipping', icon: Truck },
            { label: 'Expert Audio Support', icon: Headphones },
            { label: 'Extended Warranty', icon: Sparkles }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
              <item.icon className="w-5 h-5 text-primary opacity-80" />
              <span className="text-[11px] font-headline font-bold uppercase tracking-widest text-text-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Open-Back', desc: 'Critical Listening Labs', img: 'head', slug: 'headphones' },
            { title: 'Closed-Back', desc: 'Isolation Engineering', img: 'xm5', slug: 'headphones' },
            { title: 'DAC / AMP', desc: 'Precision Conversion', img: 'dac', slug: 'dac-amp' },
            { title: 'Accessories', desc: 'System Optimization', img: 'fiio', slug: 'dac-amp' }
          ].map((cat, i) => (
            <Link 
              key={i}
              to={`/categories/${cat.slug}`}
              className="group relative aspect-[4/5] bg-surface-low rounded-lg overflow-hidden flex items-end p-8 shadow-lg hover:shadow-primary/10 transition-all duration-500"
            >
              <img 
                src={`https://picsum.photos/seed/${cat.img}/600/800?grayscale`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-transparent to-transparent opacity-80" />
              <div className="relative z-10 space-y-2">
                <h3 className="font-headline text-[22px] font-bold text-text-primary uppercase tracking-tight transform group-hover:-translate-y-2 transition-transform duration-500">{cat.title}</h3>
                <p className="font-body text-[11px] text-text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.desc}</p>
                <div className="pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-[10px] font-black uppercase tracking-widest">Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-8 py-24 bg-surface-base">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-primary font-headline font-bold text-[11px] uppercase tracking-[0.3em] mb-3">Reference Laboratory</div>
            <h2 className="font-headline text-[32px] font-bold text-text-primary uppercase tracking-tighter">Precision Instruments</h2>
          </div>
          <Link to="/categories" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-3 pb-2 border-b border-surface-high">
            <span className="font-label font-bold text-[11px] uppercase tracking-widest">Explore All Components</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {PRODUCTS.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. TABBED PRODUCT SHELF */}
      <section className="py-24 bg-surface-low/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-headline text-[28px] font-bold text-text-primary uppercase tracking-tight">Explore Inventory</h2>
            <div className="flex justify-center items-center gap-8 border-b border-surface-high w-fit mx-auto pb-4">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "text-[12px] font-headline font-bold uppercase tracking-widest transition-all duration-300 relative pb-1",
                    activeTab === tab ? "text-primary" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-underline" className="absolute -bottom-4 left-0 w-full h-1 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="contents" // Grid wrapper workaround
                >
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
             </AnimatePresence>
          </div>
          
          <div className="mt-16 text-center">
            <AppButton variant="outline" size="lg">Shop the Collection</AppButton>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON SECTION */}
      <section className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-headline text-[32px] font-bold text-text-primary uppercase tracking-tighter leading-tight">Decide with <br/><span className="text-primary italic">Precision.</span></h2>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed">
            Every listener requires a unique frequency profile. Compare our flagship tiers to find your absolute reference point.
          </p>
          <button className="text-primary font-label font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 group underline underline-offset-8">
            Compare All Models <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { name: 'Obsidian One', use: 'Studio Reference', price: '$2,499', driver: 'Planar Magnetic', label: 'Best for Studio' },
             { name: 'Onyx Air', use: 'Daily Listening', price: '$899', driver: 'Bio-Cellulose', label: 'Best for Daily' }
           ].map((item, i) => (
             <div key={i} className="bg-surface-high p-8 rounded-lg border-l-4 border-primary/20 hover:border-primary transition-all duration-300 shadow-xl group">
                <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary mb-4">{item.label}</div>
                <h3 className="font-headline text-[24px] font-bold text-text-primary mb-1">{item.name}</h3>
                <p className="text-[13px] text-text-secondary mb-6">{item.use}</p>
                <div className="space-y-4 pt-6 border-t border-surface-base">
                   <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary uppercase">Driver</span>
                      <span className="text-text-primary font-bold">{item.driver}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary uppercase">MSRP</span>
                      <span className="text-primary font-bold italic">{item.price}</span>
                   </div>
                </div>
                <AppButton variant="ghost" className="w-full mt-8 opacity-0 group-hover:opacity-100 transition-opacity">Technical Comparison</AppButton>
             </div>
           ))}
        </div>
      </section>

      {/* 7. ECOSYSTEM ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="font-headline text-[22px] font-bold text-text-primary mb-12 tracking-tight uppercase">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Transducers', desc: 'Closed & Open acoustics for critical analysis.', icon: Headphones, slug: 'open-back' },
            { title: 'Amplification', desc: 'Current-source drive with bit-perfect conversion.', icon: Router, slug: 'dac-amp' },
            { title: 'Interconnects', desc: 'OCC Copper signal paths and high-purity solder.', icon: Cable, slug: 'accessories' }
          ].map((cat, idx) => (
            <Link 
              key={idx}
              to={`/categories/${cat.slug}`}
              className="group block bg-surface-low p-10 rounded-lg hover:bg-surface-high hover:-translate-y-2 transition-all duration-500 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-10 text-primary opacity-5 transform group-hover:opacity-20 group-hover:scale-125 transition-all duration-500">
                <cat.icon className="w-24 h-24 stroke-[1]" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-headline text-[20px] font-bold text-text-primary uppercase tracking-wide">{cat.title}</h3>
                <p className="font-body text-[13px] text-text-secondary max-w-[90%] leading-relaxed">{cat.desc}</p>
                <div className="pt-4 flex items-center gap-2 text-primary group-hover:translate-x-2 transition-transform duration-300">
                  <span className="font-label text-[10px] uppercase tracking-widest font-black">Analyze Category</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. SPOTLIGHT / EDITORIAL */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: "Planar vs Dynamic: The Physics of Sound", img: "tech", label: "Technology" },
          { title: "Choosing Your Signal Chain: A Masterclass", img: "dac", label: "Guide" }
        ].map((item, i) => (
          <div key={i} className="group relative h-[450px] rounded-lg overflow-hidden flex items-end p-10 shadow-2xl">
            <img 
              src={`https://picsum.photos/seed/${item.img}/800/600?grayscale`} 
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-[3s]"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/20 to-transparent" />
            <div className="relative z-10 space-y-4">
               <div className="w-fit bg-primary text-[#0a0a20] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">{item.label}</div>
               <h3 className="font-headline text-[32px] md:text-[36px] font-bold text-text-primary leading-[1.1] max-w-sm">{item.title}</h3>
               <button className="text-text-primary font-label font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 hover:text-primary transition-colors py-2 group">
                 Read Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        ))}
      </section>

      {/* 9. SOCIAL PROOF */}
      <section className="border-y border-surface-high py-24 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center space-y-12">
           <div className="space-y-2">
              <div className="flex justify-center gap-1">
                 {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-primary text-primary shadow-glow" />)}
              </div>
              <div className="font-headline text-[24px] font-bold text-text-primary">4.9 / 5.0</div>
              <p className="text-[11px] font-label font-bold uppercase tracking-widest text-text-secondary">Recognized by Global Audiophiles</p>
           </div>
           <div className="flex flex-col md:flex-row gap-8 max-w-4xl italic text-text-primary font-body text-[18px] lg:text-[22px] leading-relaxed">
             "Obsidian isn't just selling audio gear; they're delivering an engineered sensory experience. The transparency is unparalleled."
           </div>
           <p className="text-text-secondary font-headline font-bold text-[13px] uppercase tracking-widest">— Sound Masters Review</p>
        </div>
      </section>
    </StorefrontShell>
  );
}
