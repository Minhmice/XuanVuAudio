'use client';

import React from 'react';
import {
  ArrowRight,
  Headphones,
  Sparkles,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';

import type { CategoryNavItem, HomepageData } from "@xuanvu/shared/storefront/homepage";
import { AppButton } from "@/components/wrapper/button";
import { SectionHeader } from "@/components/wrapper/section-header";
import { cn } from "@/lib/utils";
import { StorefrontProductCard } from "@/components/storefront/StorefrontProductCard";

export function HomePageView({
  data,
  categoryNav = [],
}: {
  data: HomepageData;
  categoryNav?: CategoryNavItem[];
}) {
  const [activeTab, setActiveTab] = React.useState('Just Dropped');

  const tabs = ['Just Dropped', 'Best Sellers', 'Staff Picks'];

  const filteredProducts = React.useMemo(() => {
    switch (activeTab) {
      case 'Just Dropped':
        return (data.newProducts || []).slice(0, 4);
      case 'Best Sellers':
        return (data.featuredProducts || []).slice(0, 4);
      case 'Staff Picks':
        return (data.recommendedProducts || []).slice(0, 4);
      default:
        return [];
    }
  }, [activeTab, data.featuredProducts, data.newProducts, data.recommendedProducts]);

  const heroProduct = data.featuredProducts?.[0];

  return (
    <>
      <section data-testid="home-hero" className="mx-auto grid min-h-[85vh] max-w-7xl grid-cols-1 items-center gap-12 px-8 pb-16 pt-24 lg:grid-cols-12">
        <div className="z-10 flex flex-col space-y-8 lg:col-span-5">
          <div className="inline-flex w-fit items-center space-x-2 rounded-full bg-[var(--surface-high)] px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
            <span className="font-label text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Limited Batch Available</span>
          </div>
          <h1 className="font-headline text-[56px] leading-[0.9] font-bold tracking-tighter text-[var(--text-primary)] lg:text-[72px]">
            {heroProduct ? heroProduct.name.split(' ').slice(0, -1).join(' ') : 'The Obsidian'} <br />
            <span className="italic text-[var(--primary)]">{heroProduct ? heroProduct.name.split(' ').slice(-1) : 'One.'}</span>
          </h1>
          <p className="max-w-[480px] font-body text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {heroProduct?.description ||
              'The apex of planar magnetic engineering. Precision tuned for a soundstage that defies physical boundaries. Uncompromising transparency.'}
          </p>
          <div className="flex flex-col items-center gap-6 pt-4 sm:flex-row">
            <Link href={heroProduct ? `/products/${heroProduct.slug}` : '/categories'}>
              <AppButton size="lg" className="w-full sm:w-auto shadow-glow">
                Explore Now
              </AppButton>
            </Link>
            <Link
              href={heroProduct ? `/products/${heroProduct.slug}#specs` : '/search'}
              className="group flex h-[48px] cursor-pointer items-center space-x-2 px-6 font-label text-[12px] font-bold uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              <span>View Technical Specs</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="group relative h-[400px] overflow-hidden rounded-lg border border-[var(--surface-high)] bg-[var(--surface-low)] shadow-2xl lg:col-span-7 lg:h-[600px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--surface-base)] via-transparent to-transparent"></div>
          <img
            alt={heroProduct?.name || 'Featured Product'}
            className="pointer-events-none h-full w-full object-cover object-center opacity-80 transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            src={heroProduct?.imageUrl || 'https://picsum.photos/seed/obsidian-p1/1200/800?grayscale'}
            referrerPolicy="no-referrer"
          />
          <div className="absolute right-12 top-12 z-20 hidden border-l-2 border-[var(--primary)] bg-[var(--surface-highest)]/60 p-5 shadow-xl backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 md:block">
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Reference</p>
              <p className="font-headline text-[18px] font-bold uppercase text-[var(--text-primary)]">PRO SERIES</p>
              <div className="mt-2 h-0.5 w-12 bg-[var(--primary)]/30"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--surface-high)] bg-[var(--surface-low)]/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-8 py-6 lg:grid-cols-4">
          {[
            { label: 'Authorized Dealer', icon: ShieldCheck },
            { label: 'Free Express Shipping', icon: Truck },
            { label: 'Expert Audio Support', icon: Headphones },
            { label: 'Extended Warranty', icon: Sparkles },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-3 lg:justify-start">
              <item.icon className="h-5 w-5 text-[var(--primary)] opacity-80" />
              <span className="font-headline text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categoryNav.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative flex aspect-[4/5] cursor-pointer items-end overflow-hidden rounded-lg border border-[var(--surface-high)] bg-[var(--surface-low)] p-8 shadow-lg transition-all duration-300 hover:shadow-[var(--primary)]/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-base)] via-transparent to-transparent opacity-80" />
              <div className="relative z-10 w-full space-y-2">
                <h3 className="font-headline text-[22px] font-bold uppercase tracking-tight text-[var(--text-primary)] transition-transform duration-300 group-hover:-translate-y-2">
                  {cat.name}
                </h3>
                <p className="font-body text-[11px] uppercase tracking-widest text-[var(--text-secondary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Analyze Collection
                </p>
                <div className="flex translate-y-4 items-center gap-2 pt-4 text-[var(--primary)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] font-black uppercase tracking-widest">Shop Now</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24">
        <SectionHeader
          eyebrow="Reference Laboratory"
          title="Precision Instruments"
          action={
            <Link
              href="/categories"
              className="flex cursor-pointer items-center gap-3 border-b border-[var(--surface-high)] pb-2 text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              <span className="font-label text-[11px] font-bold uppercase tracking-widest">Explore All Components</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {(data.featuredProducts || []).slice(0, 4).map((product) => (
            <StorefrontProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--surface-high)] bg-[var(--surface-low)]/30 py-24">
        <div className="mx-auto max-w-7xl px-8">
          <SectionHeader title="Explore Inventory" className="mb-12 text-center" />
          <div className="mx-auto flex w-fit items-center gap-8 border-b border-[var(--surface-high)] pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative cursor-pointer pb-1 font-headline text-[12px] font-bold uppercase tracking-widest transition-colors duration-200',
                  activeTab === tab ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute -bottom-4 left-0 h-1 w-full bg-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 grid min-h-[400px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              >
                {filteredProducts.map((product) => (
                  <StorefrontProductCard key={product.id} product={product} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex items-center justify-center p-20 font-headline uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    No instruments found in this sector
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-16 text-center">
            <Link href="/categories">
              <AppButton variant="outline" size="lg">Shop the Collection</AppButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 py-32 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <h2 className="font-headline text-[32px] font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
            Decide with <br />
            <span className="italic text-[var(--primary)]">Precision.</span>
          </h2>
          <p className="font-body text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Every listener requires a unique frequency profile. Compare our flagship tiers to find your absolute reference point.
          </p>
          <Link
            href="/search"
            className="group flex cursor-pointer items-center gap-2 font-label text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] underline underline-offset-8"
          >
            Compare All Models
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-8">
          {[
            { name: 'Obsidian One', use: 'Studio Reference', price: '$2,499', driver: 'Planar Magnetic', label: 'Best for Studio' },
            { name: 'Onyx Air', use: 'Daily Listening', price: '$899', driver: 'Bio-Cellulose', label: 'Best for Daily' },
          ].map((item) => (
            <div
              key={item.name}
              className="group rounded-lg border-l-4 border-[var(--primary)]/20 bg-[var(--surface-high)] p-8 shadow-xl transition-colors duration-200 hover:border-[var(--primary)]"
            >
              <div className="mb-4 font-headline text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">{item.label}</div>
              <h3 className="mb-1 font-headline text-[24px] font-bold text-[var(--text-primary)]">{item.name}</h3>
              <p className="mb-6 text-[13px] text-[var(--text-secondary)]">{item.use}</p>
              <div className="space-y-4 border-t border-[var(--surface-base)] pt-6">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="uppercase text-[var(--text-secondary)]">Driver</span>
                  <span className="font-bold text-[var(--text-primary)]">{item.driver}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="uppercase text-[var(--text-secondary)]">MSRP</span>
                  <span className="font-bold italic text-[var(--primary)]">{item.price}</span>
                </div>
              </div>
              <AppButton variant="ghost" className="mt-8 w-full transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
                Technical Comparison
              </AppButton>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 py-24 md:grid-cols-2">
        {(data.articles || []).slice(0, 2).map((item) => (
          <div key={item.slug} className="group relative flex h-[450px] items-end overflow-hidden rounded-lg border border-[var(--surface-high)] p-10 shadow-2xl">
            <img
              src={item.coverImageUrl || `https://picsum.photos/seed/${item.slug}/800/600?grayscale`}
              className="absolute inset-0 h-full w-full object-cover brightness-50 grayscale transition-transform duration-[3000ms] group-hover:scale-105"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-base)] via-[var(--surface-base)]/20 to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="w-fit rounded-sm bg-[var(--primary)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                Journal
              </div>
              <h3 className="max-w-sm font-headline text-[32px] font-bold leading-[1.1] text-[var(--text-primary)] md:text-[36px]">
                {item.title}
              </h3>
              <Link
                href={`/articles/${item.slug}`}
                className="group flex cursor-pointer items-center gap-2 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--primary)]"
              >
                Read Analysis
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="relative mb-24 overflow-hidden border-y border-[var(--surface-high)] py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-12 px-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-6 w-6 fill-[var(--primary)] text-[var(--primary)] shadow-glow" />
              ))}
            </div>
            <div className="font-headline text-[24px] font-bold text-[var(--text-primary)]">4.9 / 5.0</div>
            <p className="font-label text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Recognized by Global Audiophiles
            </p>
          </div>
          <div className="max-w-4xl font-body text-[18px] italic leading-relaxed text-[var(--text-primary)] lg:text-[22px]">
            "Xuan Vu Audio isn't just selling audio gear; they're delivering an engineered sensory experience. The transparency is unparalleled."
          </div>
          <p className="font-headline text-[13px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            — Sound Masters Review
          </p>
        </div>
      </section>
    </>
  );
}
