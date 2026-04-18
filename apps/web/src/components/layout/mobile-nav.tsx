"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Search, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/config/navigation";

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [openCategoryIndex, setOpenCategoryIndex] = React.useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenCategoryIndex(current => (current === index ? null : index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-40 flex h-full flex-col bg-[var(--surface-base)] md:hidden"
        >
          {/* Header */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--surface-high)] px-8">
            <span className="font-headline text-xl font-black uppercase tracking-tighter text-[var(--text-primary)]">
              Menu
            </span>
            <button
              onClick={onClose}
              className="cursor-pointer text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="space-y-6">
              {NAVIGATION.map((category, index) => {
                const isExpanded = openCategoryIndex === index;
                return (
                  <div key={category.title} className="border-b border-[var(--surface-high)] pb-6">
                    <button
                      onClick={() => toggleCategory(index)}
                      className="flex w-full items-center justify-between font-headline text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)] outline-none"
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-[var(--primary)] transition-transform duration-300",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 space-y-8">
                            {/* Option to just visit the top-level collection */}
                            <Link
                              href={category.href}
                              onClick={onClose}
                              className="inline-block font-headline text-[13px] font-black uppercase tracking-widest text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1"
                            >
                              Shop All {category.title}
                            </Link>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                              {category.groups.map(group => (
                                <div key={group.title} className="space-y-4">
                                  <h4 className="font-headline text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                    {group.title}
                                  </h4>
                                  <ul className="space-y-3">
                                    {group.items.map(item => (
                                      <li key={item.name}>
                                        <Link
                                          href={item.href}
                                          onClick={onClose}
                                          className="block font-body text-[15px] font-medium text-[var(--text-primary)]"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-2 gap-4 pt-4">
              <button className="flex cursor-pointer items-center justify-center space-x-2 rounded-sm bg-[var(--surface-high)] p-4 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-highest)]">
                <Search className="h-5 w-5" />
                <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Search</span>
              </button>
              <button className="flex cursor-pointer items-center justify-center space-x-2 rounded-sm bg-[var(--surface-high)] p-4 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-highest)]">
                <User className="h-5 w-5" />
                <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Sign In</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
