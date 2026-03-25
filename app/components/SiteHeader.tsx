"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { NAV_ITEMS, resolveNavHref, type SitePath } from "./siteNavigation";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

type SiteHeaderProps = {
  currentPath?: SitePath;
};

export default function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
      setScrolled(window.scrollY > 12);
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
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  const projectsHref = useMemo(() => resolveNavHref("#projects", currentPath), [currentPath]);
  const ctaHref = useMemo(() => resolveNavHref("#cta", currentPath), [currentPath]);
  const brandHref = currentPath === "/" ? "#hero" : "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Scroll progress bar — single brand red */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-[#D42B27] z-50 transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-12">
        <div
          className={cx(
            "mt-3 rounded-2xl border transition-all duration-300",
            scrolled
              ? "bg-white/95 backdrop-blur-md border-black/8 shadow-md shadow-black/[0.06]"
              : "bg-white/80 backdrop-blur-md border-black/5 shadow-sm"
          )}
        >
          <div className="flex items-center justify-between px-4 py-2.5 md:px-5">

            {/* Logo */}
            <a href={brandHref} className="flex items-center flex-shrink-0">
              <Image
                src="/assets/logo2.png"
                alt="iRWA"
                width={90}
                height={50}
                className="object-contain"
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={resolveNavHref(item.href, currentPath)}
                  className="relative px-3 py-2 text-[13px] font-medium text-black/60 hover:text-black transition-colors rounded-lg hover:bg-black/[0.03] group"
                >
                  {item.label}
                  <span className="absolute inset-x-3 bottom-1 h-[2px] bg-[#D42B27] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full origin-left" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <a
                href={projectsHref}
                className="hidden sm:inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[13px] font-semibold text-black/70 hover:border-[#D42B27] hover:text-[#D42B27] transition-colors"
              >
                Projects
              </a>
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}
              >
                Get Started
              </a>

              {/* Animated hamburger */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border border-black/10 hover:bg-black/[0.03] transition"
              >
                <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={cx(
                      "block h-0.5 bg-black/70 rounded-full transition-all duration-300 origin-center",
                      menuOpen ? "rotate-45 translate-y-[7px]" : ""
                    )}
                  />
                  <span
                    className={cx(
                      "block h-0.5 bg-black/70 rounded-full transition-all duration-300",
                      menuOpen ? "opacity-0 scale-x-0" : ""
                    )}
                  />
                  <span
                    className={cx(
                      "block h-0.5 bg-black/70 rounded-full transition-all duration-300 origin-center",
                      menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu — bottom sheet */}
      <div
        className={cx(
          "md:hidden fixed inset-0 z-50 transition",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={cx(
            "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sheet */}
        <div
          role="dialog"
          aria-modal="true"
          className={cx(
            "absolute left-3 right-3 bottom-3 rounded-3xl bg-white shadow-2xl overflow-hidden",
            "transition-all duration-300 ease-out",
            menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
        >
          {/* Sheet header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/[0.06]">
            <Image src="/assets/logo2.png" alt="iRWA" width={70} height={38} className="object-contain" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-black/10 transition text-black/50 text-lg font-light"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Nav links */}
          <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={resolveNavHref(item.href, currentPath)}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-black/75 hover:bg-[#D42B27]/[0.06] hover:text-[#D42B27] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="px-4 pt-1 pb-3 flex gap-2">
            <a
              href={projectsHref}
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center rounded-xl border border-black/12 py-3 text-sm font-semibold text-black/70 hover:border-[#D42B27]/40 transition-colors"
            >
              View projects
            </a>
            <a
              href={ctaHref}
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
