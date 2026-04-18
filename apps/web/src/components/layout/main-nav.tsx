"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/config/navigation";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export function MainNav() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const navRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useOnClickOutside(navRef, () => setOpenIndex(null));

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenIndex(openIndex === index ? null : index);
    } else if (e.key === "Escape") {
      setOpenIndex(null);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, 150);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div ref={navRef} className="hidden lg:flex" onMouseLeave={handleMouseLeave}>
      <nav className="flex items-center space-x-2">
        {NAVIGATION.map((category, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={category.title} 
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isOpen}
                className={cn(
                  "group flex items-center justify-center space-x-1 rounded-sm bg-transparent px-4 py-2 font-headline text-[13px] font-bold uppercase tracking-widest transition-all duration-200 outline-none hover:bg-[var(--surface-high)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                  isOpen
                    ? "bg-[var(--surface-high)] text-[var(--primary)]"
                    : "text-[var(--text-primary)]"
                )}
              >
                <span>{category.title}</span>
                <ChevronDown
                  className={cn(
                    "relative top-[1px] h-3 w-3 transition-transform duration-300",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Shared Mega Menu Dropdown Context */}
      <AnimatePresence>
        {openIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-[80px] z-50 w-full border-b border-[var(--surface-high)] bg-[var(--surface-base)] shadow-2xl"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="mx-auto flex max-w-7xl justify-center px-8 py-12">
                <div
                  className={cn(
                    "grid gap-12",
                    NAVIGATION[openIndex].groups.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-4"
                  )}
                >
                  {NAVIGATION[openIndex].groups.map((group) => (
                    <div key={group.title} className="flex min-w-[200px] flex-col">
                      <h4 className="mb-6 font-headline text-[13px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                        {group.title}
                      </h4>
                      <ul className="space-y-4">
                        {group.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenIndex(null)}
                              className="group/link flex w-fit items-center font-body text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
                            >
                              <span>{item.name}</span>
                              <ArrowRight className="ml-2 h-3 w-3 -translate-x-2 text-[var(--primary)] opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[80px] z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setOpenIndex(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
