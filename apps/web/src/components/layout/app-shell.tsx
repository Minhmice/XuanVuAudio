"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

import { AppButton } from "@/components/wrapper/button";
import { AppInput } from "@/components/wrapper/input";

import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

function HeaderSearchForm() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  return (
    <form
      action="/search"
      method="get"
      className="flex min-w-0 max-w-md flex-1 items-center gap-2"
      data-testid="storefront-search-form"
    >
      <AppInput
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Tìm sản phẩm…"
        aria-label="Tìm kiếm sản phẩm"
        className="h-9 bg-[var(--surface-high)] text-[var(--text-primary)]"
      />
      <AppButton
        type="submit"
        size="sm"
        className="h-9 shrink-0 px-3 font-medium normal-case tracking-normal"
      >
        Tìm
      </AppButton>
    </form>
  );
}

function SearchFormFallback() {
  return <div className="h-9 max-w-md flex-1 animate-pulse rounded-md bg-[var(--surface-high)]" aria-hidden />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-base)] font-body text-[var(--text-primary)]">
      <header className="fixed top-0 z-50 w-full border-b border-[var(--surface-high)] bg-[var(--surface-base)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-8">
          <Link
            href="/"
            className="shrink-0 font-headline text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--primary)]"
          >
            Xuan Vu Audio
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
            <Suspense fallback={<SearchFormFallback />}>
              <HeaderSearchForm />
            </Suspense>
          </div>

          <MainNav />

          <div className="flex items-center space-x-6">
            <div className="mr-2 hidden items-center space-x-4 border-r border-[var(--surface-high)] pr-6 lg:flex">
              <button
                type="button"
                className="cursor-pointer text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-5">
              {mounted ? (
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              ) : null}

              <Link
                href="/cart"
                className="relative text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-black text-primary-foreground">
                  0
                </span>
                <span className="sr-only">Cart</span>
              </Link>

              <button
                type="button"
                className="cursor-pointer text-[var(--text-secondary)] md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="relative z-10 flex-grow pt-20">{children}</div>

      <footer className="mt-24 border-t border-[var(--surface-high)] bg-[var(--surface-low)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-24 md:grid-cols-3">
          <div className="space-y-4">
            <div className="font-headline text-xl font-bold uppercase tracking-tighter text-[var(--text-primary)]">
              Xuan Vu Audio
            </div>
            <p className="max-w-[300px] text-sm text-[var(--text-secondary)]">
              Engineering uncompromising audio experiences through precision materials and psychoacoustic research.
            </p>
            <div className="pt-4 text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              © 2024 XUAN VU AUDIO. PRECISION ENGINEERED SOUND.
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-headline mb-2 text-[14px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Systems
            </h4>
            <Link href="/engine" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              The Engine
            </Link>
            <Link href="/guides" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              Buying Guides
            </Link>
            <Link href="/showrooms" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              Experience Centers
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-headline mb-2 text-[14px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Support
            </h4>
            <Link href="/returns" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              Returns
            </Link>
            <Link href="/warranty" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              Warranty
            </Link>
            <Link href="/contact" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]">
              Contact Experts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
