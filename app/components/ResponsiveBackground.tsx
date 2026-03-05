"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import Hero3DCarousel from "./Hero3DCarousel";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const imgZutIsland = "/assets/4bc9574431d9787ae40236108382b161a5adf868.png";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
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

// Count-up animation component (only for numeric stats)
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const steps = 40;
          const interval = 1200 / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setVal(Math.round((step / steps) * to));
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function ResponsiveBackground() {
  const reduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mobile projects carousel state
  const projectsScrollerRef = useRef<HTMLDivElement | null>(null);
  const projectCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeProject, setActiveProject] = useState(0);
  const scrollEndTimer = useRef<number | null>(null);
  const programmaticScroll = useRef(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setHeroInView(entry?.isIntersecting ?? true);
      },
      { root: null, threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToProject = useCallback(
    (idx: number) => {
      const scroller = projectsScrollerRef.current;
      const card = projectCardRefs.current[idx];
      if (!scroller || !card) return;
      programmaticScroll.current = true;
      setActiveProject(idx);
      const left =
        card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;
      scroller.scrollTo({
        left,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      window.setTimeout(
        () => {
          programmaticScroll.current = false;
        },
        reduceMotion ? 0 : 380
      );
    },
    [reduceMotion]
  );

  const updateActiveFromScroll = useCallback(() => {
    const scroller = projectsScrollerRef.current;
    if (!scroller) return;
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
    updateActiveFromScroll();
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(() => {
      updateActiveFromScroll();
      scrollToProject(activeProject);
    }, 110);
  }, [activeProject, scrollToProject, updateActiveFromScroll]);

  useEffect(() => {
    const onResize = () => {
      updateActiveFromScroll();
      scrollToProject(activeProject);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeProject, scrollToProject, updateActiveFromScroll]);

  // Per-economy accent colours for project cards
  const PROJECTS = [
    {
      tag: "ESG",
      topColor: "#6ee7b7",
      badgeGradient: "from-emerald-500 to-teal-600",
      img: "/assets/bean-you.jpg",
      title: "Bean You",
      desc: "Connecting coffee drinkers to Kenyan farmers. 15,000 acres of emotional connection.",
      impact: "Health, education, tech centres",
      href: "https://beanyou.com",
    },
    {
      tag: "Peace",
      topColor: "#7dd3fc",
      badgeGradient: "from-sky-500 to-indigo-600",
      img: imgZutIsland,
      title: "Zut Island",
      desc: "Olive trees on a Croatian island. Meditation and wellbeing through nature.",
      impact: "Meditation & wellbeing centres",
      href: "https://zut.digital",
    },
    {
      tag: "Coming soon",
      topColor: "#94a3b8",
      badgeGradient: "from-slate-400 to-slate-500",
      img: "/assets/ev-mineral.jpg",
      title: "EV Minerals",
      desc: "Connecting EV drivers to ethical mineral sourcing across 770,400 km².",
      impact: "Child education & health centres",
      href: "",
    },
  ];

  const cards = [
    {
      icon: "⚡",
      title: "Instant Rewards",
      desc: "Brand discounts, partner perks, and prize draws activate the moment you participate. Your conviction pays off immediately.",
    },
    {
      icon: "🌍",
      title: "Impact Experiences",
      desc: "On-site farm visits, island retreats, and immersive brand encounters. Participation earns access, not just points.",
    },
    {
      icon: "🏆",
      title: "Tier Progression",
      desc: "Entry, Mid, and VIP tiers unlock deeper access and recognition. The more you believe, the more the ecosystem gives back.",
    },
  ];

  const faqs = [
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
  ];

  const stickyLabel = heroInView ? "Explore Projects" : "Request a demo";
  const stickyHref = heroInView ? "#projects" : "mailto:hello@irwa.io";

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

      {/* ─── HERO — dark atmospheric ─────────────────────────────────────── */}
      <motion.section
        id="hero"
        ref={heroRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0b0f19] text-white"
      >
        {/* Atmospheric blobs */}
        <div className="absolute -top-44 -left-40 w-[520px] h-[520px] bg-[#ff272a]/12 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-16 right-[-90px] w-[420px] h-[420px] bg-indigo-900/50 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-[-140px] left-1/3 w-[480px] h-[480px] bg-rose-900/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-[-180px] right-[-120px] w-[460px] h-[460px] bg-amber-900/15 blur-3xl rounded-full pointer-events-none" />

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-24 py-20 md:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT SIDE */}
          <div className="relative z-20 space-y-6 sm:space-y-8 lg:order-1">

            {/* Opening provocation */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white/45 text-base md:text-lg max-w-lg leading-relaxed"
            >
              Your favourite coffee. Your sacred mountain. Your football club.
              <br />
              <span className="text-white/80 font-semibold">
                What if your belief in them was worth something?
              </span>
            </motion.p>

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white/70 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff272a] to-[#ff7a45] animate-pulse" />
              <span className="text-xs tracking-[0.14em] uppercase font-semibold">
                Intangible Real World Assets
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-white">
              Tokenize the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45]">
                connection
              </span>
              , not the assets.
            </h1>

            <p className="text-lg md:text-xl text-white/55 max-w-xl leading-relaxed">
              Turn emotional connection into a tradeable, rewarding asset —
              without the complexity of traditional finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#cta"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] text-white font-semibold shadow-[0_12px_30px_rgba(255,39,42,0.35)] hover:shadow-[0_14px_36px_rgba(255,79,139,0.45)] transition text-center"
              >
                Build with us
              </a>
              <a
                href="#projects"
                className="px-7 py-4 rounded-2xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition text-center backdrop-blur-sm"
              >
                Explore Projects
              </a>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                What we tokenize
              </p>
              <div className="flex flex-wrap gap-2">
                {["Belief", "Culture", "Faith", "Community", "Sport", "Identity"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/8 text-white/60 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — carousel on dark */}
          <div className="relative z-10 flex justify-center lg:justify-end w-full lg:order-2">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-[36px] p-5 sm:p-7 bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-[#ff272a]/20 shadow-[0_30px_80px_rgba(255,39,42,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff272a]/8 via-transparent to-indigo-900/20 pointer-events-none" />
              <div className="relative">
                <Hero3DCarousel />
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* ─── BREAKOUT QUOTE — position 2, maximum early impact ──────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9 }}
        className="bg-[#ff272a] px-6 lg:px-24 py-16 md:py-20 overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
          >
            "You can't tax love."
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.3,
            }}
            className="text-white/75 text-lg md:text-xl max-w-xl mx-auto"
          >
            Intangible assets already shape the world. We make them measurable,
            transactable, and rewarding.
          </motion.p>
        </div>
      </motion.section>

      {/* ─── STATS — count-up numbers + named project pills ─────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-10 md:py-14"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { numeric: 3, suffix: "+", label: "Live token projects" },
              { numeric: 16, suffix: "+", label: "Impact initiatives" },
              { numeric: null, text: "IRL", label: "Real-world benefits" },
              { numeric: null, text: "Open", label: "Public exchange tokens" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/5 bg-white p-4 md:p-5 shadow-sm"
              >
                <div className="text-2xl md:text-3xl font-bold">
                  {s.numeric !== null ? (
                    <CountUp to={s.numeric} suffix={s.suffix ?? ""} />
                  ) : (
                    s.text
                  )}
                </div>
                <div className="text-sm text-black/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Named project pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mr-1">
              Live now:
            </span>
            {[
              {
                name: "BeanYou",
                href: "https://beanyou.com",
                cls: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
              },
              {
                name: "Zut Island",
                href: "https://zut.digital",
                cls: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
              },
              {
                name: "EV Minerals",
                href: "#projects",
                cls: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
              },
            ].map((p) => (
              <a
                key={p.name}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  p.href.startsWith("http") ? "noreferrer" : undefined
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${p.cls}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── PROJECTS ────────────────────────────────────────────────────── */}
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
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              Live on Exchange
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Public Exchange Projects
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto italic">
              Each of these started as a belief. Now it's an exchange-traded
              token.
            </p>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each project has its own token — participation, not speculation.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                className="group rounded-[32px] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl hover:shadow-2xl transition overflow-hidden"
                style={{ borderTopWidth: "4px", borderTopColor: p.topColor }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <span
                    className={`absolute top-5 left-5 z-10 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r ${p.badgeGradient} text-white shadow`}
                  >
                    {p.tag === "Coming soon"
                      ? "Coming Soon"
                      : "Public Exchange Token"}
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
                  <h3 className="text-2xl font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {p.desc}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 text-sm text-slate-600">
                    {[
                      "Brand discounts",
                      "Partner experiences",
                      "Prize draws",
                      "Tier-based access",
                    ].map((b) => (
                      <div key={b} className="flex gap-2 items-start">
                        <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Impact signal */}
                  <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                    Impact focus:{" "}
                    <span className="font-medium text-[#c81f34]">
                      {p.impact}
                    </span>
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

      {/* ─── CONCEPT ─────────────────────────────────────────────────────── */}
      <motion.section
        id="concept"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] relative px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              The philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Redefining Value
            </h2>
            <p className="text-black/70 text-base md:text-lg max-w-3xl mx-auto">
              For 5,000 years, markets measured value in ownership. We measure
              value in belief. Financial assets capture capital. iRWA captures
              conviction.
            </p>
            <div className="mt-10 text-center max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-black/70">
                Intangible assets already shape economies — brands, movements,
                ideologies, communities. We simply make them measurable and
                transactable.
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
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-[#f8fafc] to-white pointer-events-none" />
      </motion.section>

      {/* ─── THE SYSTEM ──────────────────────────────────────────────────── */}
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
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              The System
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Four steps from emotional connection to rewarded participation.
            </p>
          </div>

          {/* Before / After contrast */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-slate-100 border border-slate-200 p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Before iRWA
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                You love what a brand stands for. You buy their products.{" "}
                <strong className="text-slate-800">You get nothing back.</strong>
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff272a]">
                With iRWA
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                You hold an iRWA token. You earn access, rewards, and
                recognition.{" "}
                <strong className="text-[#c81f34]">
                  Your conviction pays off.
                </strong>
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Animated connector line */}
            <svg
              className="hidden md:block absolute top-1/2 left-0 w-full h-2 -translate-y-1/2"
              viewBox="0 0 1000 10"
              fill="none"
            >
              <motion.path
                d="M50 5 H950"
                stroke="#ff4f8b"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Define Connection",
                  desc: "Name what you stand for — your community, cause, or culture. That becomes your token's identity.",
                },
                {
                  step: "02",
                  title: "Mint Token",
                  desc: "Connection rights are issued on-chain. Tradeable, verifiable, and interoperable across the ecosystem.",
                },
                {
                  step: "03",
                  title: "Participate",
                  desc: "Supporters hold tokens to signal alignment. Their conviction is measured and rewarded — not just held.",
                },
                {
                  step: "04",
                  title: "Benefits Flow",
                  desc: "Discounts, experiences, and access activate for token holders. The more you participate, the more you earn.",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative z-10 bg-white rounded-3xl border border-black/5 p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff272a] to-[#ff7a45] mb-4 leading-none">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why it works */}
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

      {/* ─── USE CASES ───────────────────────────────────────────────────── */}
      <motion.section
        id="usecases"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-3"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              Where iRWA fits
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built for real-world missions
            </h2>
            <p className="text-black/65 text-base md:text-lg max-w-2xl mx-auto">
              Any project where value comes from belief, community, or story —
              not just capital.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌍",
                title: "ESG & Impact",
                desc: "Reward communities for environmental and social outcomes. Turn purpose into participation.",
              },
              {
                icon: "🎭",
                title: "Culture & Community",
                desc: "Tokenize fandom, loyalty, and belonging. Give communities real stakes in what they love.",
              },
              {
                icon: "🔗",
                title: "Ethical Supply Chains",
                desc: "Connect consumers to provenance. Let belief in sourcing become a tradeable signal.",
              },
            ].map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl">
                  {u.icon}
                </div>
                <h3 className="text-xl font-bold">{u.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {u.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── PARTICIPATION ENGINE ─────────────────────────────────────────── */}
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
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              What you get
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Participation Engine
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Belief earns real benefits. Not just tokens — access, experiences,
              and status.
            </p>
          </div>

          <div className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain touch-pan-x pb-2">
            <div className="flex gap-4 md:gap-6 pr-4 md:pr-0">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="min-w-[88%] md:min-w-[48%] lg:min-w-[32%] snap-center rounded-3xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/40 p-8 md:p-10 shadow-sm space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff272a] to-[#ff7a45] flex items-center justify-center text-2xl shadow-sm">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── FAQ — accordion ─────────────────────────────────────────────── */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              Common questions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Frequently Asked
            </h2>
            <p className="text-black/65 text-base md:text-lg">
              Clear answers on what iRWA is, how it works, and why it matters.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === idx ? null : idx)
                  }
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <h3 className="text-lg md:text-xl font-bold pr-4">
                    {faq.q}
                  </h3>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-[#ff272a] flex-shrink-0 font-light leading-none select-none"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-6 md:pb-8 text-black/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CTA — dark with ticker + dot texture ────────────────────────── */}
      <motion.section
        id="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#0b0f19] px-4 md:px-8 lg:px-24 py-16 md:py-24 lg:py-28 relative overflow-hidden"
      >
        {/* Network dot texture */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ff272a]/8 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-indigo-900/30 blur-3xl rounded-full pointer-events-none" />

        {/* Mock token ticker */}
        <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
            <span>
              BYOU{" "}
              <span className="text-emerald-400">▲ 2.4%</span>
            </span>
            <span className="text-white/20">·</span>
            <span>
              ZUTT{" "}
              <span className="text-emerald-400">▲ 1.1%</span>
            </span>
            <span className="text-white/20">·</span>
            <span>
              EVMN <span className="text-slate-400">— TBA</span>
            </span>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUpVariants}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10 pt-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Build your iRWA project with us.
          </h2>
          <p className="text-white/70 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Launch a tokenized connection economy that rewards communities and
            creates measurable impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:hello@irwa.io?subject=Demo request"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#ff272a] px-7 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition"
            >
              Request a demo
            </a>
            <a
              href="/evolution"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 font-semibold text-black hover:opacity-90 transition"
            >
              Read our story
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
