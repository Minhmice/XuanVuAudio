"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroCarouselContextType = {
  activeIndex: number;
  totalSlides: number;
  isPlaying: boolean;
  setTotalSlides: (total: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  togglePlay: () => void;
  registerVideo: (index: number, videoNode: HTMLVideoElement | null) => void;
};

const HeroCarouselContext = React.createContext<HeroCarouselContextType | null>(null);

export function useHeroCarousel() {
  const context = React.useContext(HeroCarouselContext);
  if (!context) {
    throw new Error("useHeroCarousel must be used within a HeroCarousel");
  }
  return context;
}

export function HeroCarousel({ children, className }: { children: React.ReactNode; className?: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [totalSlides, setTotalSlides] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videosRef = React.useRef<(HTMLVideoElement | null)[]>([]);

  const registerVideo = React.useCallback((index: number, videoNode: HTMLVideoElement | null) => {
    videosRef.current[index] = videoNode;
  }, []);

  const syncVideoState = React.useCallback(
    (targetIndex: number, playingStart: boolean) => {
      videosRef.current.forEach((video, index) => {
        if (!video) return;
        if (index === targetIndex) {
          video.currentTime = 0;
          if (playingStart) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        } else {
          video.pause();
        }
      });
    },
    []
  );

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % totalSlides;
      syncVideoState(next, isPlaying);
      return next;
    });
  }, [totalSlides, isPlaying, syncVideoState]);

  const prevSlide = React.useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + totalSlides) % totalSlides;
      syncVideoState(next, isPlaying);
      return next;
    });
  }, [totalSlides, isPlaying, syncVideoState]);

  const goToSlide = React.useCallback(
    (index: number) => {
      setActiveIndex(index);
      syncVideoState(index, isPlaying);
    },
    [isPlaying, syncVideoState]
  );

  const togglePlay = React.useCallback(() => {
    setIsPlaying((prev) => {
      const nextState = !prev;
      const currentVideo = videosRef.current[activeIndex];
      if (currentVideo) {
        if (nextState) currentVideo.play().catch(() => {});
        else currentVideo.pause();
      }
      return nextState;
    });
  }, [activeIndex]);

  // Provide auto-advance hook onto the active video
  React.useEffect(() => {
    const currentVideo = videosRef.current[activeIndex];
    if (currentVideo) {
      const handleEnded = () => nextSlide();
      currentVideo.addEventListener("ended", handleEnded);
      return () => {
        currentVideo.removeEventListener("ended", handleEnded);
      };
    }
  }, [activeIndex, nextSlide]);

  return (
    <HeroCarouselContext.Provider
      value={{
        activeIndex,
        totalSlides,
        isPlaying,
        setTotalSlides,
        nextSlide,
        prevSlide,
        goToSlide,
        togglePlay,
        registerVideo,
      }}
    >
      <div className={cn("relative w-full overflow-hidden bg-black", className)}>{children}</div>
    </HeroCarouselContext.Provider>
  );
}

export function HeroVideoBackground({
  videos,
}: {
  videos: { src: string; poster?: string }[];
}) {
  const { activeIndex, setTotalSlides, registerVideo } = useHeroCarousel();

  React.useEffect(() => {
    setTotalSlides(videos.length);
  }, [videos.length, setTotalSlides]);

  return (
    <div className="absolute inset-0 z-0">
      {videos.map((vid, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.div
            key={vid.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 h-full w-full",
              !isActive && "pointer-events-none"
            )}
            style={{ zIndex: isActive ? 10 : 0 }}
          >
            <video
              ref={(el) => registerVideo(index, el)}
              src={vid.src}
              poster={vid.poster}
              autoPlay={isActive}
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}

export function HeroContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative z-10 flex h-full w-full items-center", className)}>
      <div className="mx-auto w-full max-w-7xl px-8">{children}</div>
    </div>
  );
}

export function HeroSlide({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { activeIndex } = useHeroCarousel();
  const isActive = index === activeIndex;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn("absolute flex flex-col space-y-6", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroControls({ className }: { className?: string }) {
  const { activeIndex, totalSlides, isPlaying, togglePlay, prevSlide, nextSlide, goToSlide } = useHeroCarousel();

  return (
    <div className={cn("absolute bottom-8 right-8 z-20 flex items-center space-x-6", className)}>
      {/* Dots Indicator */}
      <div className="flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group relative h-3 w-8 flex-shrink-0 focus-visible:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <motion.div
              className={cn(
                "absolute inset-y-0 left-0 w-full rounded-full bg-white/40 transition-colors group-hover:bg-white/70",
                activeIndex === idx && "bg-white"
              )}
            />
          </button>
        ))}
      </div>

      {/* Control Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
        </button>
        <button
          onClick={prevSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={"Previous Slide"}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={"Next Slide"}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
