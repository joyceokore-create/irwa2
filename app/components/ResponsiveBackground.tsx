"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import Hero3DCarousel from "./Hero3DCarousel";
import ParticleNetwork from "./ParticleNetwork";

import MagneticButton from "./MagneticButton";
import svgPaths from "../imports/svg-fo73us6i1o";


<motion.div
  initial={{ opacity: 0, scale: 1.05 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
>
  <Hero3DCarousel />
</motion.div>
import { imgTransition } from "../imports/svg-psl46";

const imgZutIsland =
  "/assets/4bc9574431d9787ae40236108382b161a5adf868.png";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

const viewportOnce = { once: true, amount: 0.25 } as const;
const viewportCards = { once: true, amount: 0.35 } as const;

const NAV = [
  { label: "Concept", href: "#concept" },
  { label: "Instruments", href: "#instruments" },
  { label: "Projects", href: "#projects" },
  { label: "How it works", href: "#how" },
  { label: "Impact", href: "#impact" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function ResponsiveBackground() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Contextual sticky CTA (changes label while hero is in view)
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroInView, setHeroInView] = useState(true);

  // Mobile projects carousel: active index + refs for auto-centering + dots
  const projectsScrollerRef = useRef<HTMLDivElement | null>(null);
  const projectCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeProject, setActiveProject] = useState(0);
  const scrollEndTimer = useRef<number | null>(null);
  const programmaticScroll = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock body scroll when bottom-sheet is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // IntersectionObserver: track hero in view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setHeroInView(entry?.isIntersecting ?? true);
      },
      {
        root: null,
        threshold: 0.25,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const heroTransition = useMemo(
    () => ({ duration: reduceMotion ? 0 : 0.6 }),
    [reduceMotion]
  );

  const scrollToProject = useCallback(
    (idx: number) => {
      const scroller = projectsScrollerRef.current;
      const card = projectCardRefs.current[idx];
      if (!scroller || !card) return;

      programmaticScroll.current = true;
      setActiveProject(idx);

      // center card in the scroller
      const left =
        card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;

      scroller.scrollTo({
        left,
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // release programmatic lock shortly after
      window.setTimeout(() => {
        programmaticScroll.current = false;
      }, reduceMotion ? 0 : 380);
    },
    [reduceMotion]
  );

  const updateActiveFromScroll = useCallback(() => {
    const scroller = projectsScrollerRef.current;
    if (!scroller) return;

    // find nearest card center to viewport center
    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    projectCardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    setActiveProject(bestIdx);
  }, []);

  const onProjectsScroll = useCallback(() => {
    if (programmaticScroll.current) return;

    // track dots during scroll
    updateActiveFromScroll();

    // auto-center when scroll ends (debounced)
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(() => {
      updateActiveFromScroll();
      scrollToProject(activeProject);
    }, 110);
  }, [activeProject, scrollToProject, updateActiveFromScroll]);

  // keep active dot correct on resize/orientation change
  useEffect(() => {
    const onResize = () => {
      updateActiveFromScroll();
      scrollToProject(activeProject);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeProject, scrollToProject, updateActiveFromScroll]);

  const PROJECTS = [
    {
      tag: "ESG",
      img: "/assets/bean-you.jpg",
      title: "Bean You",
      desc: "Connecting coffee drinkers to Kenyan farmers. 15,000 acres of emotional connection.",
      impact: "Health, education, tech centres",
      href: "https://beanyou.com",
    },
    {
      tag: "Peace",
      img: imgZutIsland,
      title: "Zut Island",
      desc: "Olive trees on a Croatian island. Meditation and wellbeing through nature.",
      impact: "Meditation & wellbeing centres",
      href: "https://zut.digital",
    },
    {
      tag: "Coming soon",
      img: "/assets/ev-mineral.jpg",
      title: "EV Minerals",
      desc: "Connecting EV drivers to ethical mineral sourcing across 770,400 km².",
      impact: "Child education & health centres",
      href: "",
    },
  ];

  const stickyLabel = heroInView ? "View Projects" : "Get Started";
  const stickyHref = heroInView ? "#projects" : "#cta";

  return (
    <div className="bg-white relative w-full min-h-screen text-[#0b0f19]">
      {/* Sticky Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-24">
          <div className="mt-3 rounded-2xl border border-black/5 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              {/* Brand */}
              <a href="#hero" className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-xl bg-[#ff272a] shadow-sm" />
                <span className="font-bold text-lg tracking-tight">iRWA</span>
              </a>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6">
                {NAV.slice(0, 5).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="h-6 w-px bg-black/10" />
                <a
                  href="#faq"
                  className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                >
                  FAQ
                </a>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                <a
                  href="#projects"
                  className="hidden sm:inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02] transition"
                >
                  View projects
                </a>
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#ff272a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
                >
                  Get Started
                </a>

                {/* Mobile menu button */}
                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="md:hidden inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white p-2 hover:bg-black/[0.02] transition"
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

        {/* Mobile bottom-sheet menu */}
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
                className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Close
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-2">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-black/5 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/[0.03]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-4 grid grid-cols-2 gap-2">
                <a
                  href="#projects"
                  onClick={() => setMenuOpen(false)}
                  className="text-center rounded-2xl border border-black/10 bg-white px-4 py-3 font-semibold"
                >
                  View projects
                </a>
                <a
                  href="#cta"
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

      {/* Contextual sticky CTA (mobile) */}
      <div
        className="md:hidden fixed left-0 right-0 z-40 px-4"
        style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <div className="mx-auto max-w-md">
          <a
            href={stickyHref}
            className="group flex items-center justify-between rounded-2xl bg-[#0b0f19] text-white px-5 py-4 shadow-xl shadow-black/15 ring-1 ring-white/10"
          >
            <span className="font-semibold">{stickyLabel}</span>
            <span className="text-white/70 group-hover:text-white transition">
              →
            </span>
          </a>
        </div>
      </div>
{/* PREMIUM HERO */}
<section
  id="hero"
  className="relative min-h-screen flex items-center overflow-hidden bg-[#070b14] text-white"
>
  {/* Animated mesh gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e293b,transparent_40%),radial-gradient(circle_at_80%_70%,#4f46e5,transparent_35%)] opacity-40" />

  {/* Subtle grid */}
  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-16 sm:py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

    {/* LEFT SIDE */}
    <div className="space-y-6 sm:space-y-8 lg:order-1">

      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="w-2 h-2 bg-[#ff272a] rounded-full animate-pulse" />
        <span className="text-xs tracking-wide uppercase text-white/70">
          Intangible Real World Assets
        </span>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
        Tokenize the{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-red-400 animate-gradient">
          connection
        </span>
        , not the asset.
      </h1>

<p className="text-white/70 text-lg max-w-xl leading-relaxed">
  We measure, transact, and reward your connection to assets:
</p>

<div className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-red-400">
  Values • Ideology • Opinion • Faith • Belief
</div>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#cta"
          className="px-7 py-4 rounded-2xl bg-[#ff272a] font-semibold shadow-lg hover:shadow-red-500/30 transition text-center sm:text-left"
        >
          Build with us
        </a>
        <a
          href="/evolution"
          className="px-7 py-4 rounded-2xl border border-white/20 text-white/80 hover:bg-white/5 transition text-center sm:text-left"
        >
          Our Evolution
        </a>
      </div>
    </div>

    {/* RIGHT SIDE — 3D CURVED CAROUSEL */}
    <div className="flex justify-center lg:justify-end w-full lg:order-2">
      <Hero3DCarousel />
    </div>

  </div>
</section>

      {/* Stats / trust strip */}
      <section className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "3+", v: "Live pilot themes" },
              { k: "Public", v: "Exchange-ready tokens" },
              { k: "IRL", v: "Benefits & experiences" },
              { k: "Global", v: "Cross-community support" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-black/5 bg-white p-4 md:p-5 shadow-sm"
              >
                <div className="text-2xl md:text-3xl font-bold">{s.k}</div>
                <div className="text-sm text-black/60 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept */}
      <section
        id="concept"
        className="scroll-mt-24 bg-[#f8fafc] relative px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        {/* ... your Concept section unchanged ... */}
        {/* (kept exactly as your latest) */}
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Redefining Value
            </h2>
           <p className="text-black/70 text-base md:text-lg max-w-3xl mx-auto">
  For 5,000 years, markets measured value in ownership.
  We measure value in belief.

  Financial assets capture capital.
  iRWA captures conviction.
</p>
 <div className="mt-10 text-center max-w-3xl mx-auto">
  <p className="text-lg md:text-xl text-black/70">
    Intangible assets already shape economies —
    brands, movements, ideologies, communities.
    We simply make them measurable and transactable.
  </p>
</div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scaleInVariants}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.05,
            }}
            className="bg-gradient-to-r from-[#eef2ff] to-[#fdf2f8] rounded-2xl p-6 md:p-10 border border-black/5 shadow-sm"
          >
            <p className="text-[#ff272a] text-base md:text-xl lg:text-2xl font-bold text-center leading-relaxed">
              Total Value = Financial Assets (RWA) + Non-Financial Assets (iRWA)
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-black/5 shadow-sm space-y-6"
            >
              <h3 className="text-black/70 text-2xl md:text-3xl font-bold">
                Tangible RWA
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "📦", text: "Physical ownership" },
                  { icon: "📈", text: "Financial returns focus" },
                  { icon: "📋", text: "Heavily regulated / Taxable" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportCards}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      delay: reduceMotion ? 0 : 0.08 + idx * 0.06,
                    }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-base md:text-lg text-black/80">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: reduceMotion ? 0 : 0.02,
              }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="bg-[#eef2ff] rounded-2xl p-6 md:p-8 border border-[#ff272a]/30 shadow-sm space-y-6"
            >
              <h3 className="text-[#ff272a] text-2xl md:text-3xl font-bold">
                Intangible iRWA
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "❤️", text: "Emotional connection" },
                  { icon: "🎁", text: "Benefits are gifted" },
                  { icon: "🌟", text: "Unregulated soft assets" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportCards}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      delay: reduceMotion ? 0 : 0.1 + idx * 0.06,
                    }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-[#ff272a] text-base md:text-lg">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scaleInVariants}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.1,
            }}
            className="text-center py-4"
          >
            <p className="text-2xl md:text-4xl font-bold bg-clip-text bg-gradient-to-r from-[#0f172a] to-[#64748b] text-transparent">
              "You can't tax love."
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-[#f8fafc] to-white" />

      </section>

{/* Ecosystem Section */}
<section id="ecosystem" className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
  <div className="max-w-6xl mx-auto space-y-10">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeInUpVariants}
      transition={{ duration: 0.6 }}
      className="text-center space-y-3"
    >
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">The iRWA Ecosystem</h2>
      <p className="text-[#949494] text-base md:text-lg max-w-3xl mx-auto">
        One account. One balance. Allocate across projects seamlessly — coffee, islands, infrastructure, culture — while the token mechanics stay in the background.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
      {[
        {
          title: "1) Simple Participation",
          badge: "Front-End",
          points: ["One unified account", "Top up $10 / $20 / $100", "Receive ecosystem points", "Allocate across projects anytime"],
        },
        {
          title: "2) Unified Token Layer",
          badge: "Back-End",
          points: ["Main ecosystem token", "Project-specific tokens", "Swappable compatibility", "No fragmentation — one system"],
        },
        {
          title: "3) Retail Entry Layer",
          badge: "Everyday",
          points: ["Micro-contributions at checkout", "Optional $0.05 / $0.5 / $1 prompts", "Earn rewards as soft entry", "Discover projects through redemption options"],
        },
      ].map((card, idx) => (
        <motion.div
          key={card.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={scaleInVariants}
          transition={{ duration: 0.55, delay: idx * 0.08 }}
          className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm p-6 md:p-7"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg md:text-xl font-bold">{card.title}</h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fff1f2] text-[#ff272a] border border-[#fecdd3]">
              {card.badge}
            </span>
          </div>
          <ul className="space-y-2 text-sm md:text-base text-[#64748b]">
            {card.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[#ff272a]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </div>
</section>

   

      {/* Benefits */}
      <section id="benefits" className="bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
        {/* unchanged */}
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Why it works
            </h2>
            <p className="text-black/65 text-base md:text-lg max-w-2xl mx-auto">
              Make meaning tradable without commoditizing the underlying asset.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Align incentives",
                desc: "Supporters buy connection rights, not extraction rights.",
              },
              {
                title: "Unlock real benefits",
                desc: "Access, experiences, loyalty rewards, community utility.",
              },
              {
                title: "Interoperable by design",
                desc: "Project tokens can move, swap, and compose in open markets.",
              },
            ].map((b, idx) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={fadeInUpVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="rounded-2xl border border-black/5 bg-[#f8fafc] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="text-black/60 mt-2 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-white font-semibold hover:opacity-90 transition"
            >
              Talk to us about your project
            </a>
          </div>
        </div>
      </section>

      {/* Projects (mobile = swipe carousel + snap + dots + auto-centering) */}
      <section
        id="projects"
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Current Projects
            </h2>
            <p className="text-black/65 text-base md:text-lg max-w-2xl mx-auto">
              Each project has its own branded token — all interoperable and
              swappable on public exchanges.
            </p>
          </motion.div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8 items-stretch">
            {PROJECTS.map((p, idx) => (
              <motion.article
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={scaleInVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                whileHover={reduceMotion ? undefined : { y: -8 }}
                className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm"
              >
                <div className="relative h-52 bg-gray-100">
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-[#ff272a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
                    {p.tag}
                  </span>
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1024px) 33vw, 360px"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-black">{p.title}</h3>
                  <p className="text-black/60 leading-relaxed">{p.desc}</p>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm text-[#ff272a]">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ff272a]" />
                      <span className="font-medium">{p.impact}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    {p.title === "EV Minerals" ? (
                      <span className="text-sm text-black/30 italic">Coming soon</span>
                    ) : (
                      <>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-black/60 hover:text-black underline underline-offset-4"
                        >
                          Visit project website
                        </a>
                        <a
                          href="#cta"
                          className="text-sm font-semibold text-[#ff272a] hover:opacity-80"
                        >
                          Tokenize →
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Mobile swipe carousel */}
          <div className="md:hidden">
            <div className="relative">
              <div
                ref={projectsScrollerRef}
                onScroll={onProjectsScroll}
                className={cx(
                  "flex gap-4 overflow-x-auto",
                  "scroll-smooth",
                  "snap-x snap-mandatory",
                  "px-2 -mx-2",
                  "pb-3",
                  "[scrollbar-width:none] [-ms-overflow-style:none]",
                  "touch-pan-x"
                )}
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* hide webkit scrollbar */}
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {PROJECTS.map((p, idx) => (
                  <motion.article
                    key={p.title}
                    ref={(el) => {
                      projectCardRefs.current[idx] = el as HTMLDivElement | null;
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={scaleInVariants}
                    transition={{ duration: reduceMotion ? 0 : 0.45 }}
                    className={cx(
                      "snap-center",
                      "min-w-[86%] sm:min-w-[78%]",
                      "rounded-3xl overflow-hidden",
                      "border border-black/5 bg-white shadow-sm",
                      "ring-1 ring-black/[0.03]"
                    )}
                  >
                    <div className="relative h-52 bg-gray-100">
                      <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-[#ff272a] px-4 py-2 text-xs font-semibold text-white shadow-sm">
                        {p.tag}
                      </span>
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 90vw, 360px"
                        className="object-cover"
                      />
                      {/* premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-black">{p.title}</h3>
                      <p className="text-black/60 leading-relaxed">{p.desc}</p>

                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-sm text-[#ff272a]">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#ff272a]" />
                          <span className="font-medium">{p.impact}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                        {p.title === "EV Minerals" ? (
                          <span className="text-sm text-black/30 italic">Coming soon</span>
                        ) : (
                          <>
                            <a
                              href={p.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-black/60 hover:text-black underline underline-offset-4"
                            >
                              Visit project website
                            </a>
                            <a
                              href="#cta"
                              className="text-sm font-semibold text-[#ff272a] hover:opacity-80"
                            >
                              Tokenize →
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Dots (tap to jump + tracked while scrolling) */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {PROJECTS.map((_, idx) => {
                  const active = idx === activeProject;
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to project ${idx + 1}`}
                      onClick={() => scrollToProject(idx)}
                      className={cx(
                        "h-2.5 rounded-full transition-all",
                        active ? "w-8 bg-[#0b0f19]" : "w-2.5 bg-black/20"
                      )}
                    />
                  );
                })}
              </div>

              {/* small hint */}
              <p className="mt-3 text-center text-xs text-black/45">
                Swipe to explore • Tap dots to jump
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
        {/* unchanged */}
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="text-black/65 text-base md:text-lg max-w-2xl mx-auto">
              A simple flow from relationship → token → benefits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Define the connection",
                desc: "What supporters get: access, perks, stories, community.",
              },
              {
                title: "Mint iRWA",
                desc: "Token represents connection rights and benefit eligibility.",
              },
              {
                title: "Supporters participate",
                desc: "Buy, hold, swap — aligned with the project mission.",
              },
              {
                title: "Benefits flow",
                desc: "Automatic distribution of rewards and experiences.",
              },
            ].map((step, idx) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={fadeInUpVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-lg md:text-xl font-bold mt-4">
                  {step.title}
                </h3>
                <p className="text-black/60 mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 font-semibold hover:bg-black/[0.02]"
            >
              Request a demo
            </a>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="usecases" className="bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
        {/* unchanged */}
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built for real-world missions
            </h2>
            <p className="text-black/65 text-base md:text-lg max-w-2xl mx-auto">
              iRWA fits projects where value comes from community, story, access,
              and outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "ESG & impact",
                desc: "Fund and reward outcomes: education, health, climate, livelihoods.",
              },
              {
                title: "Culture & community",
                desc: "Membership, patronage, events, experiences, fandom.",
              },
              {
                title: "Ethical supply chains",
                desc: "Transparent incentives that reward good behavior at scale.",
              },
            ].map((u, idx) => (
              <motion.div
                key={u.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={scaleInVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                className="rounded-2xl border border-black/5 bg-[#f8fafc] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold">{u.title}</h3>
                <p className="text-black/60 mt-2 leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section
        id="impact"
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        {/* unchanged */}
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block bg-[#ffd4d4] px-4 py-2 rounded-full border border-black/10">
              <p className="text-[#ff272a] text-xs md:text-sm font-semibold">
                The Mechanism
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              The Connection Flow
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: "Asset Owner", desc: "Lists connection rights" },
              { title: "iRWA Token", desc: "Minted on blockchain" },
              { title: "Supporter Buys", desc: "Emotional investment" },
              { title: "Benefits Flow", desc: "Access & experiences" },
            ].map((step, idx) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={fadeInUpVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.6,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm relative"
              >
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-black">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-black/60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  

{/* Rewards & Experiences */}
<section id="rewards" className="scroll-mt-24 bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
  <div className="max-w-6xl mx-auto space-y-10">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeInUpVariants}
      transition={{ duration: 0.6 }}
      className="text-center space-y-3"
    >
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">Rewards, Recognition & Experiences</h2>
      <p className="text-[#949494] text-base md:text-lg max-w-3xl mx-auto">
        Participation shouldn’t feel like passive donation. Earn real benefits: discounts, experiences, draws, and tier-based access — with visible impact over time.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      {[
        {
          title: "Instant Rewards",
          items: ["Brand discounts", "Partner experiences", "Periodic prize draws", "Cause-specific benefits (e.g., coffee bags, access)"],
        },
        {
          title: "Quarterly Impact Experiences",
          items: ["Project visits", "Community immersion", "On-ground engagement", "Document real-world outcomes"],
        },
        {
          title: "Tier Progression",
          items: ["Entry-level benefits", "Mid-tier rewards", "VIP / premium experiences", "Recurring connection options"],
        },
      ].map((b, idx) => (
        <motion.div
          key={b.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={scaleInVariants}
          transition={{ duration: 0.55, delay: idx * 0.08 }}
          className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm p-6 md:p-7"
        >
          <h3 className="text-lg md:text-xl font-bold mb-3">{b.title}</h3>
          <ul className="space-y-2 text-sm md:text-base text-[#64748b]">
            {b.items.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* FAQ */}
      <section id="faq" className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28">
        {/* unchanged */}
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-black/65 text-base md:text-lg">
              Clear answers to common questions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "What is an iRWA?",
                a: "iRWA stands for Intangible Real World Assets. These are tokenized emotional connections and soft benefits that don't involve physical ownership.",
              },
              {
                q: "How is iRWA different from traditional RWA?",
                a: "Unlike traditional RWAs which represent physical ownership and financial returns, iRWAs tokenize emotional value, access rights, and intangible benefits.",
              },
              {
                q: "Is iRWA regulated?",
                a: "iRWAs represent soft assets and emotional connections, making them generally unregulated compared to traditional financial instruments.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={faq.q}
                initial="hidden"
                whileInView="visible"
                viewport={viewportCards}
                variants={fadeInUpVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.5,
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-black/5 shadow-sm"
              >
                <h3 className="text-lg md:text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-black/60 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
{/* Unified Dashboard Concept */}
<section id="dashboard" className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-24">
  <div className="max-w-6xl mx-auto space-y-10">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeInUpVariants}
      transition={{ duration: 0.6 }}
      className="text-center space-y-3"
    >
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">Your Unified Dashboard</h2>
      <p className="text-[#949494] text-base md:text-lg max-w-3xl mx-auto">
        A single place to view your total participation footprint, project allocations, tier status, and measurable impact indicators.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={scaleInVariants}
        transition={{ duration: 0.55 }}
        className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-r from-[#eef2ff] to-[#fdf2f8] p-6 md:p-8"
      >
        <h3 className="text-xl md:text-2xl font-bold mb-2">Level 1: Ecosystem Overview</h3>
        <p className="text-[#64748b] mb-4">
          Minimal snapshot: total participation volume, active projects, and aggregate impact indicators.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {["Total Volume", "Active Projects", "Impact Indicators"].map((k) => (
            <div key={k} className="rounded-xl bg-white/70 border border-black/5 p-4">
              <p className="text-xs text-black/50">{k}</p>
              <p className="text-lg font-bold mt-1">—</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={scaleInVariants}
        transition={{ duration: 0.55, delay: 0.06 }}
        className="rounded-2xl border border-[#e8e8e8] bg-white p-6 md:p-8 shadow-sm"
      >
        <h3 className="text-xl md:text-2xl font-bold mb-2">Level 2: Project Dashboards</h3>
        <p className="text-[#64748b] mb-4">
          Per project: funds raised, allocation history, beneficiary metrics, real-world equivalents, tier progress, and links.
        </p>
        <div className="space-y-2 text-sm md:text-base text-[#64748b]">
          {[
            "Funds raised + allocation history",
            "Beneficiary metrics + equivalents",
            "Tier status + rewards",
            "Project media + socials",
          ].map((t) => (
            <div key={t} className="flex gap-2">
              <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[#ff272a]" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* CTA */}
      <section id="cta" className="bg-[#0b0f19] px-4 md:px-8 lg:px-24 py-16 md:py-24 lg:py-28">
        {/* unchanged */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUpVariants}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Build your iRWA project with us.
          </h2>
          <p className="text-white/70 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Launch a tokenized connection economy that rewards communities and creates measurable impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 font-semibold text-black hover:opacity-90 transition"
            >
              See current projects
            </a>
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#ff272a] px-7 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition"
            >
              Request a demo
            </a>
          </div>

          <p className="text-white/50 text-sm">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-4 md:px-8 lg:px-24 py-10 border-t border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#ff272a]" />
            <div>
              <div className="font-bold">iRWA</div>
              <div className="text-sm text-black/60">
                Tokenize connection, not the asset.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-black/60">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-black transition">
                {n.label}
              </a>
            ))}
          </div>
        </div>

        {/* spacer so the mobile sticky CTA doesn’t overlap footer */}
        <div className="md:hidden h-24" />
      </footer>
    </div>
  );
}
