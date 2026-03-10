"use client";

import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Concept", href: "#concept" },
  { label: "Projects", href: "#projects" },
  { label: "Impact", href: "#impact" },
  { label: "Leadership", href: "#team" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#concept");
  const [dark, setDark] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });

  const sectionIds = useMemo(() => ["hero", "concept", "projects", "impact", "team"], []);

  // scroll shadow + active section + dark mode (CTA)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      // active section detection
      let bestId = "concept";
      let bestScore = Number.POSITIVE_INFINITY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const score = Math.abs(top - 120);
        if (score < bestScore) {
          bestScore = score;
          bestId = id;
        }
      }
      setActive(`#${bestId}`);

      // dark header near CTA
      const cta = document.getElementById("cta");
      if (cta) {
        const rect = cta.getBoundingClientRect();
        const shouldDark = rect.top < window.innerHeight * 0.35 && rect.bottom > 120;
        setDark(shouldDark);
      } else {
        setDark(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds]);

  // click outside + ESC to close mobile menu
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!headerRef.current) return;
      if (!headerRef.current.contains(target)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // measure pill position
  const measurePill = () => {
    const navEl = navRef.current;
    const linkEl = linkRefs.current[active];
    if (!navEl || !linkEl) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    setPill({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      visible: true,
    });
  };

  useLayoutEffect(() => {
    measurePill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, dark, scrolled]);

  useEffect(() => {
    const onResize = () => measurePill();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);

    if (el) {
      e.preventDefault();
      setOpen(false);
      setActive(href);

      const headerOffset = 88;
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", href);
      return;
    }

    setOpen(false);
  };

  const surface = dark
    ? "bg-[#0b1224]/75 border-white/10 text-white"
    : scrolled
      ? "bg-white/85 border-black/10 text-black"
      : "bg-white/65 border-transparent text-black";

  const pillBg = dark ? "bg-white/10" : "bg-black/5";
  const linkBase = dark ? "text-white/75 hover:text-white" : "text-black/75 hover:text-black";
  const activeText = dark ? "text-white" : "text-black";

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={["backdrop-blur-xl border-b transition-colors", surface].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-24 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" onClick={handleNav("#hero")} className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image src="/assets/logo.png" alt="iRWA" width={110} height={62} className="object-contain" style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)" }} />
            </motion.div>
          </a>

          {/* Desktop nav (sliding pill) */}
          <div className="hidden md:block">
            <div ref={navRef} className="relative flex items-center gap-1">
              {/* sliding pill (no AnimatePresence needed) */}
              {pill.visible && (
                <motion.div
                  animate={{
                    x: clamp(pill.left, 0, 9999),
                    width: clamp(pill.width, 40, 9999),
                    opacity: 1,
                  }}
                  transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  className={`absolute inset-y-0 rounded-full ${pillBg}`}
                  style={{ left: 0 }}
                />
              )}

              {navItems.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleNav(item.href)}
                    ref={(el) => {
                      linkRefs.current[item.href] = el;
                    }}
                    className={[
                      "relative px-4 py-2 rounded-full text-sm font-medium transition",
                      linkBase,
                      isActive ? activeText : "",
                    ].join(" ")}
                    style={{ zIndex: 1 }}
                  >
                    {item.label}

                    {isActive && (
                      <motion.span
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className={`absolute left-4 right-4 -bottom-0.5 h-[2px] origin-left ${
                          dark ? "bg-white/70" : "bg-black/40"
                        }`}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* CTA + Mobile button */}
          <div className="flex items-center gap-2">
            <motion.a
              href="#projects"
              onClick={handleNav("#projects")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "hidden sm:inline-flex px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-colors",
                dark ? "bg-white text-black" : "bg-gradient-to-r from-[#D42B27] to-[#4E83B8] text-white",
              ].join(" ")}
            >
              Explore
            </motion.a>

            <button
              className={[
                "md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors",
                dark ? "border-white/15 bg-white/10" : "border-black/10 bg-white/70",
              ].join(" ")}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <div className="w-5 h-5 relative">
                <span
                  className={`absolute left-0 top-1 w-5 h-0.5 transition ${dark ? "bg-white" : "bg-black"} ${
                    open ? "rotate-45 top-2.5" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 w-5 h-0.5 transition ${dark ? "bg-white" : "bg-black"} ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 w-5 h-0.5 transition ${dark ? "bg-white" : "bg-black"} ${
                    open ? "-rotate-45 top-2.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={[
              "md:hidden overflow-hidden border-t backdrop-blur-xl",
              dark ? "border-white/10 bg-[#0b1224]/80" : "border-black/10 bg-white/90",
            ].join(" ")}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleNav(item.href)}
                    className={[
                      "block px-3 py-3 rounded-xl text-sm font-medium transition",
                      dark
                        ? isActive
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                        : isActive
                          ? "bg-black/5 text-black"
                          : "text-black/80 hover:text-black hover:bg-black/5",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                );
              })}

              <a
                href="#projects"
                onClick={handleNav("#projects")}
                className={[
                  "block text-center px-4 py-3 rounded-xl text-sm font-semibold shadow-md mt-2 transition-colors",
                  dark ? "bg-white text-black" : "bg-gradient-to-r from-[#D42B27] to-[#4E83B8] text-white",
                ].join(" ")}
              >
                Explore Projects
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>
    </div>
  );
}
