import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HeroCarousel,
  HeroVideoBackground,
  HeroContent,
  HeroSlide,
  HeroControls,
} from "@/components/ui/hero-video-carousel";
import { cn } from "@/lib/utils";

// Mocking some fallback videos that will show the mechanics
// Replace these with high-quality MP4 URLs on your CDN/S3
const HERO_SLIDES = [
  {
    subtitle: "Precision Engineering",
    title: "SOUND\nRE-ENGINEERED.",
    description: "The next generation of high-fidelity listening has arrived.",
    videoSrc: "https://videos.pexels.com/video-files/5699479/5699479-uhd_2732_1440_30fps.mp4",
    poster: "/posters/slide-1-poster.jpg",
    primaryCta: { label: "Shop Headphones", href: "/headphones" },
    secondaryCta: { label: "Learn More", href: "/headphones/in-ear" },
  },
  {
    subtitle: "Room-Filling Power",
    title: "FEEL\nEVERY BEAT.",
    description: "Immersive acoustics designed to transform your space.",
    videoSrc: "https://videos.pexels.com/video-files/8099884/8099884-hd_1920_1080_25fps.mp4",
    poster: "/posters/slide-2-poster.jpg",
    primaryCta: { label: "Shop Speakers", href: "/speakers" },
    secondaryCta: { label: "Learn More", href: "/speakers/hi-fi-speakers" },
  },
  {
    subtitle: "Seamless Connectivity",
    title: "YOUR SETUP,\nELEVATED.",
    description: "Premium accessories to perfect your audio experience.",
    videoSrc: "https://videos.pexels.com/video-files/5082563/5082563-uhd_2732_1440_24fps.mp4",
    poster: "/posters/slide-3-poster.jpg",
    primaryCta: { label: "Shop Accessories", href: "/accessories" },
    secondaryCta: { label: "View Guide", href: "/accessories/dac-amp" },
  },
];

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black">
      <HeroCarousel className="h-full w-full">
        {/* Background Layer: Handled exclusively by HTML5 Video + Framer Motion Fades */}
        <HeroVideoBackground
          videos={HERO_SLIDES.map((slide) => ({
            src: slide.videoSrc,
            poster: slide.poster,
          }))}
        />

        {/* Foreground Layer: Content aligned to the main navigation grid */}
        <HeroContent>
          {HERO_SLIDES.map((slide, index) => (
            <HeroSlide
              key={index}
              index={index}
              // Positioning: Vertically centered, left-aligned, matching nav padding
              className="top-1/2 w-full max-w-2xl -translate-y-1/2"
            >
              {/* Eyebrow Label */}
              <span className="font-headline text-[13px] font-black uppercase tracking-[0.2em] text-[var(--primary)] drop-shadow-sm">
                {slide.subtitle}
              </span>

              {/* Large Headline */}
              <h1 className="whitespace-pre-line font-headline text-5xl font-black uppercase tracking-tighter text-white drop-shadow-md sm:text-7xl lg:text-8xl">
                {slide.title}
              </h1>

              {/* Supporting Subtext */}
              <p className="max-w-lg font-body text-lg font-medium text-white/90 drop-shadow-sm sm:text-xl">
                {slide.description}
              </p>

              {/* CTA Group */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.primaryCta.href}
                  className="group flex items-center justify-center space-x-2 rounded-full bg-white px-8 py-4 font-headline text-[14px] font-bold uppercase tracking-widest text-black transition-all hover:scale-105 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {slide.secondaryCta && (
                  <Link
                    href={slide.secondaryCta.href}
                    className="flex items-center justify-center rounded-full bg-black/40 px-8 py-4 font-headline text-[14px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                )}
              </div>
            </HeroSlide>
          ))}
        </HeroContent>

        {/* Global Controls Layer */}
        <HeroControls />
      </HeroCarousel>
    </section>
  );
}
