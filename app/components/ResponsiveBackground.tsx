"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import Hero3DCarousel from "./Hero3DCarousel";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, amount: 0.25 } as const;
const viewportCards = { once: true, amount: 0.35 } as const;

export default function ResponsiveBackground() {
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

  const cards = [
    {
      title: "Instant Rewards",
      desc: "Discounts, partner perks, prize draws.",
    },
    {
      title: "Impact Experiences",
      desc: "On-site visits & immersive engagement.",
    },
    {
      title: "Tier Progression",
      desc: "Entry → Mid → VIP ecosystem recognition.",
    },
  ];

  const stickyLabel = heroInView ? "View Projects" : "Get Started";
  const stickyHref = heroInView ? "#projects" : "#cta";

  return (
    <div className="bg-white relative w-full min-h-screen text-[#0b0f19]">
      <SiteHeader currentPath="/" />

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
<motion.section
  id="hero"
  ref={heroRef}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={sectionVariants}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="relative min-h-screen flex items-center overflow-hidden 
  bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900"
>
  {/* Soft colour-therapy field */}
  <div className="absolute -top-44 -left-40 w-[520px] h-[520px] bg-indigo-200/50 blur-3xl rounded-full" />
  <div className="absolute top-16 right-[-90px] w-[420px] h-[420px] bg-sky-200/40 blur-3xl rounded-full" />
  <div className="absolute bottom-[-140px] left-1/3 w-[480px] h-[480px] bg-rose-200/35 blur-3xl rounded-full" />
  <div className="absolute bottom-[-180px] right-[-120px] w-[460px] h-[460px] bg-amber-200/35 blur-3xl rounded-full" />

  {/* Ambient texture */}
  <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:64px_64px]" />
  <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_50%),radial-gradient(circle_at_80%_10%,#f0f9ff,transparent_40%),radial-gradient(circle_at_60%_90%,#fdf2f8,transparent_45%)]" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-24 py-20 md:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

    {/* LEFT SIDE */}
    <div className="relative z-20 space-y-6 sm:space-y-8 lg:order-1">

      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border border-rose-100 text-slate-700 backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff272a] to-[#ff7a45] animate-pulse" />
        <span className="text-xs tracking-[0.14em] uppercase font-semibold">
          Intangible Real World Assets
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-slate-900">
        Tokenize the{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45]">
          connection
        </span>
        , not the assets.
      </h1>

      <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
        We measure, transact, and reward connection to culture, belief, faith, energy, sport, and community.
      </p>

      <div className="text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45]">
        Values • Ideology • Opinion • Faith • Belief
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <a
          href="#cta"
          className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] text-white font-semibold shadow-[0_12px_30px_rgba(255,39,42,0.28)] hover:shadow-[0_14px_36px_rgba(255,79,139,0.34)] transition text-center sm:text-left"
        >
          Build with us
        </a>
        <a
          href="/evolution"
          className="px-7 py-4 rounded-2xl border border-rose-200 bg-white/90 text-[#b42336] font-semibold hover:bg-rose-50 hover:border-rose-300 hover:text-[#8f1d2c] transition text-center sm:text-left"
        >
          Our Evolution
        </a>
        <a
          href="/instruments"
          className="px-7 py-4 rounded-2xl border border-rose-200 bg-white/90 text-[#b42336] font-semibold hover:bg-rose-50 hover:border-rose-300 hover:text-[#8f1d2c] transition text-center sm:text-left"
        >
          Instruments
        </a>
      </div>
    </div>

    {/* RIGHT SIDE — 3D CURVED CAROUSEL */}
    <div className="relative z-10 flex justify-center lg:justify-end w-full lg:order-2">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[36px] p-5 sm:p-7 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-rose-100 shadow-[0_30px_80px_rgba(255,39,42,0.16)]">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-transparent to-amber-100/40 pointer-events-none" />
        <div className="relative">
          <Hero3DCarousel />
        </div>
      </div>
    </div>

  </div>
</motion.section>

      {/* Stats / trust strip */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-10 md:py-14"
      >
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
      </motion.section>

      {/* Concept */}
      <motion.section
        id="concept"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
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

      </motion.section>

{/* iRWA Ecosystem – Animated */}
<section
  id="ecosystem"
  className="relative bg-white px-6 lg:px-24 py-24 overflow-hidden"
>
  <div className="max-w-6xl mx-auto text-center space-y-12">
    <div className="space-y-4">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        The iRWA Ecosystem
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        One account. One balance. Infinite allocation.
      </p>
    </div>

    <div className="relative flex items-center justify-center h-[420px]">
      {/* Center Token */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute z-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#ff272a] to-[#ff7a45] text-white flex items-center justify-center font-bold shadow-xl"
      >
        Ecosystem
      </motion.div>

      {/* User */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute left-0 text-center"
      >
        <div className="w-28 h-28 rounded-2xl bg-[#f8fafc] border border-black/5 flex items-center justify-center shadow-sm">
          👤
        </div>
        <p className="mt-3 text-sm font-medium">User</p>
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute right-0 text-center"
      >
        <div className="w-28 h-28 rounded-2xl bg-[#f8fafc] border border-black/5 flex items-center justify-center shadow-sm">
          🏝️
        </div>
        <p className="mt-3 text-sm font-medium">Projects</p>
      </motion.div>

      {/* Rewards */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-0 text-center"
      >
        <div className="w-28 h-28 rounded-2xl bg-[#f8fafc] border border-black/5 flex items-center justify-center shadow-sm">
          🎁
        </div>
        <p className="mt-3 text-sm font-medium">Rewards</p>
      </motion.div>

      {/* Animated Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute w-[70%] h-[2px] bg-gradient-to-r from-[#ff272a] to-[#ff7a45] origin-left"
      />
    </div>

    {/* Minimal bullets */}
    <div className="grid md:grid-cols-3 gap-6 pt-12 text-sm text-slate-600">
      <div className="bg-[#f8fafc] p-6 rounded-2xl border border-black/5">
        Top up & receive ecosystem tokens
      </div>
      <div className="bg-[#f8fafc] p-6 rounded-2xl border border-black/5">
        Allocate across project tokens
      </div>
      <div className="bg-[#f8fafc] p-6 rounded-2xl border border-black/5">
        Earn benefits & track impact
      </div>
    </div>
  </div>
</section>
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-gradient-to-br from-rose-50 via-white to-orange-50 px-6 lg:px-24 py-20"
      >
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Public Exchange Projects
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each project operates with its own token — interoperable within the iRWA ecosystem.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

            {PROJECTS.map((p, idx) => (
              <div
                key={p.title}
                className="
                  group
                  rounded-[32px]
                  bg-white/70
                  backdrop-blur-xl
                  border border-slate-200
                  shadow-xl
                  hover:shadow-2xl
                  transition
                  overflow-hidden
                "
              >

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <span className="absolute top-5 left-5 z-10 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-[#ff272a] to-[#ff4f8b] text-white shadow">
                    Public Exchange Token
                  </span>

                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">

                  <h3 className="text-2xl font-semibold">
                    {p.title}
                  </h3>

                  {/* Benefits Block */}
                  <div className="space-y-3 text-sm text-slate-600">

                    <div className="flex gap-2 items-start">
                      <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full" />
                      <span>Brand discounts</span>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full" />
                      <span>Partner experiences</span>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full" />
                      <span>Prize draws</span>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full" />
                      <span>Tier-based access</span>
                    </div>

                  </div>

                  {/* Impact Signal */}
                  <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                    Impact focus: <span className="font-medium text-[#c81f34]">{p.impact}</span>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 flex items-center justify-between">

                    {p.href ? (
                      <>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4"
                        >
                          Visit project →
                        </a>

                        <a
                          href="#cta"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] text-white text-sm font-semibold shadow-[0_8px_18px_rgba(255,39,42,0.24)] hover:shadow-[0_10px_24px_rgba(255,79,139,0.32)] transition"
                        >
                          Participate
                        </a>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400 italic">
                        Coming soon
                      </span>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      </motion.section>

      {/* The System */}
      <motion.section
        id="system"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] px-6 lg:px-24 py-20"
      >
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              The System
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A structured flow from connection to measurable impact.
            </p>
          </div>

          <div className="relative">
            <motion.svg
              className="hidden md:block absolute top-1/2 left-0 w-full h-2 -translate-y-1/2"
              viewBox="0 0 1000 10"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <motion.path
                d="M50 5 H950"
                stroke="#ff4f8b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.svg>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Define Connection", desc: "Access, perks, meaning." },
                { step: "02", title: "Mint Token", desc: "Connection rights issued." },
                { step: "03", title: "Participate", desc: "Supporters align with mission." },
                { step: "04", title: "Benefits Flow", desc: "Rewards & experiences activated." },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative z-10 bg-white rounded-3xl border border-black/5 p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-xs font-semibold text-[#ff272a] mb-2">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why it works – compact visual */}
          <div className="grid md:grid-cols-3 gap-6 pt-10">
            {[
              "Align incentives without extraction.",
              "Unlock real benefits instead of speculation.",
              "Interoperable across projects.",
            ].map((t) => (
              <div
                key={t}
                className="bg-gradient-to-br from-white to-rose-50 border border-rose-100 rounded-2xl p-6 text-center font-medium"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Use cases */}
      <motion.section
        id="usecases"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🌍", title: "ESG & Impact" },
              { icon: "🎭", title: "Culture & Community" },
              { icon: "🔗", title: "Ethical Supply Chains" },
            ].map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
              >
                <div className="text-3xl mb-4">{u.icon}</div>
                <h3 className="text-xl font-bold">{u.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

{/* Participation Engine */}
<motion.section
  id="participation"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={sectionVariants}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-16 md:py-20 lg:py-24"
>
  <div className="max-w-6xl mx-auto space-y-8">
    <div className="text-center space-y-3">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        Participation Engine
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        Rewards, impact experiences, and tier progression without broken scroll space.
      </p>
    </div>

    <div className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain touch-pan-x pb-2">
      <div className="flex gap-4 md:gap-6 pr-4 md:pr-0">
        {cards.map((card) => (
          <div
            key={card.title}
            className="min-w-[88%] md:min-w-[48%] lg:min-w-[32%] snap-center rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 shadow-sm"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              {card.title}
            </h3>
            <p className="text-slate-600 text-base md:text-lg mt-3">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
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
      </motion.section>
{/* Unified Dashboard Concept */}
<motion.section
  id="dashboard"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={sectionVariants}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-24"
>
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

    <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-8 shadow-2xl">
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Total Allocation", value: "$ 0.00" },
          { label: "Active Projects", value: "3" },
          { label: "Tier Status", value: "Entry" },
          { label: "Impact Score", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-2xl p-6">
            <p className="text-xs text-white/50">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</motion.section>

      {/* CTA */}
      <motion.section
        id="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#0b0f19] px-4 md:px-8 lg:px-24 py-16 md:py-24 lg:py-28"
      >
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
      </motion.section>

      <SiteFooter currentPath="/" withMobileSpacer />
    </div>
  );
}
