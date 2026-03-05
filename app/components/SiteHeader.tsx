"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { NAV_ITEMS, resolveNavHref, type SitePath } from "./siteNavigation";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

type SiteHeaderProps = {
  currentPath?: SitePath;
};

export default function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const primaryItems = NAV_ITEMS.slice(0, 5);
  const secondaryItems = NAV_ITEMS.slice(5);

  const projectsHref = useMemo(
    () => resolveNavHref("#projects", currentPath),
    [currentPath]
  );
  const ctaHref = useMemo(
    () => resolveNavHref("#cta", currentPath),
    [currentPath]
  );
  const brandHref = currentPath === "/" ? "#hero" : "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] z-50 transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-24">
        <div className="mt-3 rounded-2xl border border-black/5 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <a href={brandHref} className="flex items-center gap-3 group">
              <span className="w-9 h-9 rounded-xl bg-[#ff272a] shadow-sm" />
              <span className="font-bold text-lg tracking-tight">iRWA</span>
            </a>

            <nav className="hidden md:flex items-center gap-6">
              {primaryItems.map((item) => (
                <a
                  key={item.href}
                  href={resolveNavHref(item.href, currentPath)}
                  className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="h-6 w-px bg-black/10" />
              {secondaryItems.map((item) => (
                <a
                  key={item.href}
                  href={resolveNavHref(item.href, currentPath)}
                  className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={projectsHref}
                className="hidden sm:inline-flex min-h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02] transition"
              >
                View projects
              </a>
              <a
                href={ctaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#ff272a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
              >
                Get Started
              </a>

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-black/10 bg-white p-2 hover:bg-black/[0.02] transition"
              >
                <span className="sr-only">Open menu</span>
                <div className="w-5 space-y-1.5">
                  <div className="h-0.5 w-5 bg-black/70" />
                  <div className="h-0.5 w-5 bg-black/70" />
                  <div className="h-0.5 w-5 bg-black/70" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cx(
          "md:hidden fixed inset-0 z-50 transition",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cx(
            "absolute inset-0 bg-black/35 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />

        <div
          role="dialog"
          aria-modal="true"
          className={cx(
            "absolute left-0 right-0 bottom-0",
            "rounded-t-[28px] bg-white shadow-2xl",
            "transition-transform duration-300",
            menuOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
          }}
        >
          <div className="px-5 pt-3 pb-2">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-black/10" />
          </div>

          <div className="px-5 pb-4 flex items-center justify-between border-b border-black/5">
            <span className="font-bold text-lg">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="min-h-11 rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Close
            </button>
          </div>

          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={resolveNavHref(item.href, currentPath)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-black/5 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/[0.03]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 grid grid-cols-2 gap-2">
              <a
                href={projectsHref}
                onClick={() => setMenuOpen(false)}
                className="text-center rounded-2xl border border-black/10 bg-white px-4 py-3 font-semibold"
              >
                View projects
              </a>
              <a
                href={ctaHref}
                onClick={() => setMenuOpen(false)}
                className="text-center rounded-2xl bg-[#ff272a] px-4 py-3 font-semibold text-white shadow-sm"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
