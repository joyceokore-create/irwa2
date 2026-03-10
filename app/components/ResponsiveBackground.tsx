"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

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
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setHeroInView(entries[0]?.isIntersecting ?? true),
      { root: null, threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const CYCLING_WORDS = ["love", "belief", "culture", "passion", "belonging", "identity"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setWordIndex((i) => (i + 1) % CYCLING_WORDS.length),
      3000
    );
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // fail silently — still show confirmation to user
      }
      setEmailSent(true);
    },
    [email]
  );

  const PROJECTS = [
    {
      tag: "ESG",
      topColor: "#6ee7b7",
      badgeGradient: "from-emerald-500 to-teal-600",
      img: "/assets/bean-you.jpg",
      title: "Bean You",
      desc: "Connecting coffee drinkers to Kenyan farmers. 15,000 acres of emotional connection.",
      impact: "Health, education, tech centres",
      holders: "847",
      href: "https://beanyou.com",
      benefits: [
        "Farm visit experience in Kenya",
        "Coffee subscription discounts",
        "Direct farmer impact updates",
        "Tier-based brand partner perks",
      ],
    },
    {
      tag: "Peace",
      topColor: "#7dd3fc",
      badgeGradient: "from-sky-500 to-indigo-600",
      img: imgZutIsland,
      title: "Zut Island",
      desc: "Olive trees on a Croatian island. Meditation and wellbeing through nature.",
      impact: "Meditation & wellbeing centres",
      holders: "212",
      href: "https://zut.digital",
      benefits: [
        "Island meditation retreat access",
        "Wellbeing centre membership",
        "Olive oil harvest participation",
        "Tier-based island experiences",
      ],
    },
    {
      tag: "Coming soon",
      topColor: "#94a3b8",
      badgeGradient: "from-slate-400 to-slate-500",
      img: "/assets/ev-mineral.jpg",
      title: "EV Minerals",
      desc: "Connecting EV drivers to ethical mineral sourcing across 770,400 km².",
      impact: "Child education & health centres",
      holders: null,
      href: "",
      benefits: [
        "Ethical sourcing certificates",
        "EV partner charging discounts",
        "Community governance voting",
        "Education centre access",
      ],
    },
    {
      tag: "Coming soon",
      topColor: "#D97706",
      badgeGradient: "from-amber-500 to-yellow-600",
      img: "/assets/Persistence.jpeg",
      title: "Dalí",
      desc: "A painting bought for €150 from a Spanish antique shop, later authenticated as Salvador Dalí's earliest surrealist work — painted in 1921 at age 17.",
      impact: "Cultural heritage & art access",
      holders: null,
      href: "",
      benefits: [
        "Co-ownership of authenticated art provenance",
        "Private exhibition & gallery access",
        "Surrealist cultural event invitations",
        "Tier-based art loan programme access",
      ],
    },
  ];

  const rewards = [
    {
      icon: "⚡",
      title: "Instant Rewards",
      desc: "Brand discounts, partner perks, and prize draws activate the moment you participate. Your conviction pays off immediately.",
    },
    {
      icon: "🌍",
      title: "Real Experiences",
      desc: "On-site farm visits, island retreats, and immersive brand encounters. Participation earns access, not just points.",
    },
    {
      icon: "🏆",
      title: "Tier Recognition",
      desc: "Entry, Mid, and VIP tiers unlock deeper access and status. The more you believe, the more the ecosystem gives back.",
    },
  ];

  const faqs = [
    {
      q: "What is an iRWA token?",
      a: "An iRWA token represents your emotional connection to a project — a coffee farm, an island, a cause. It's not equity or debt. It's a tokenized belief that earns you real benefits.",
    },
    {
      q: "How is this different from a loyalty programme?",
      a: "Loyalty points expire, stay locked in one brand, and can't be traded. iRWA tokens are on-chain, transferable, and work across multiple projects in the ecosystem.",
    },
    {
      q: "How is iRWA different from traditional RWA?",
      a: "Traditional RWAs represent physical ownership and financial returns — property, bonds, commodities. iRWAs tokenize emotional value and access rights. No ownership, no speculation, just rewarded participation.",
    },
    {
      q: "Is iRWA regulated?",
      a: "iRWA tokens represent soft assets and emotional connections — not financial instruments. This makes them generally outside the scope of traditional financial regulation.",
    },
    {
      q: "How do I participate in a project?",
      a: "Connect a wallet, choose a project you believe in, and hold its token. Benefits activate automatically based on your tier. No trading required.",
    },
    {
      q: "Can I build my own iRWA project?",
      a: "Yes. If you have a community, cause, or brand with genuine belief behind it, we can help you define and mint your token. Reach out via the demo request below.",
    },
  ];

  const stickyLabel = heroInView ? "Explore Projects" : "Request a demo";
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
            className="group flex items-center justify-between rounded-2xl bg-white border border-gray-200 shadow-lg px-5 py-4"
          >
            <span className="font-semibold text-gray-900">{stickyLabel}</span>
            <span className="text-gray-400 group-hover:text-gray-700 transition">→</span>
          </a>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative flex flex-col overflow-hidden bg-[#fafafa]"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Soft warm orb — top left */}
        <div className="absolute pointer-events-none"
          style={{ top: -60, left: -80, width: 480, height: 380,
            background: "radial-gradient(circle, #FF6030 0%, transparent 68%)",
            opacity: 0.11, filter: "blur(80px)" }} />
        {/* Soft cool orb — right */}
        <div className="absolute pointer-events-none"
          style={{ top: -20, right: -80, width: 520, height: 440,
            background: "radial-gradient(circle, #3B5BFF 0%, transparent 68%)",
            opacity: 0.09, filter: "blur(100px)" }} />

        {/* ── Two-column grid ── */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full">

          {/* LEFT — text, below carousel on mobile */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-10 lg:pl-12 lg:pr-6 pt-4 pb-12 lg:py-0 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-200 bg-white text-rose-500 text-[11px] font-semibold tracking-widest uppercase mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              iRWA · Intangible Real World Assets
            </motion.div>

            {/* Cycling word */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="overflow-hidden mb-3 w-full"
              style={{ height: "clamp(56px, 12vw, 88px)" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={CYCLING_WORDS[wordIndex]}
                  className="block font-black tracking-tighter select-none"
                  style={{
                    fontSize: "clamp(56px, 12vw, 88px)",
                    lineHeight: 1,
                    paddingRight: "0.08em",
                    background: "linear-gradient(90deg, #FF6035 0%, #F43F5E 38%, #8B5CF6 72%, #2563EB 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                >
                  {CYCLING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Supporting line */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="text-gray-400 text-lg leading-snug mb-8 max-w-[300px] lg:max-w-xs"
            >
              has value. We put it on&#8209;chain.
            </motion.p>

            {/* CTA */}
            <motion.a
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              href="#cta"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:scale-[1.02] transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg, #FF6035 0%, #F43F5E 50%, #8B5CF6 100%)",
                boxShadow: "0 6px 20px rgba(244,63,94,0.28)",
              }}
            >
              Get Started →
            </motion.a>
          </motion.div>

          {/* RIGHT — carousel, top on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center px-6 sm:px-10 lg:px-8 pt-16 sm:pt-12 lg:pt-0 pb-10 lg:pb-0 order-1 lg:order-2"
          >
            <div
              className="relative w-full max-w-[520px] overflow-hidden rounded-[36px] p-5 sm:p-7"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 30px 80px rgba(255,96,53,0.14), 0 8px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-[36px]"
                style={{
                  background: "linear-gradient(135deg, rgba(255,96,53,0.07) 0%, transparent 50%, rgba(37,99,235,0.05) 100%)",
                }}
              />
              <div className="relative">
                <Hero3DCarousel />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Tagline divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="relative z-10 border-t border-gray-100 bg-white px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full"
        >
          <p className="text-base sm:text-lg font-semibold text-gray-900 text-center sm:text-left">
            Tokenize the{" "}
            <span style={{
              background: "linear-gradient(90deg, #FF6035 0%, #F43F5E 45%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>connection</span>
            {" "}— not the asset.
          </p>
          <a
            href="#cta"
            className="shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg, #FF6035 0%, #F43F5E 50%, #8B5CF6 100%)" }}
          >
            Build with us
          </a>
        </motion.div>
      </section>

      {/* ─── BREAKOUT QUOTE ──────────────────────────────────────────────── */}
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
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.3 }}
            className="text-white/75 text-lg md:text-xl max-w-xl mx-auto"
          >
            Intangible assets already shape the world. We make them measurable,
            transactable, and rewarding.
          </motion.p>
        </div>
      </motion.section>

      {/* ─── LIVE PROJECTS STRIP ─────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-8 md:py-10 border-b border-black/5"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Live on exchange
          </span>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "BeanYou", holders: "847", tag: "ESG", href: "https://beanyou.com", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { name: "Zut Island", holders: "212", tag: "Peace", href: "https://zut.digital", cls: "bg-sky-50 text-sky-700 border-sky-200" },
              { name: "EV Minerals", holders: null, tag: "Coming Q3", href: "#projects", cls: "bg-slate-50 text-slate-500 border-slate-200" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={p.href.startsWith("http") ? "noreferrer" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition hover:opacity-80 ${p.cls}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {p.name}
                {p.holders && (
                  <span className="opacity-60 font-normal">
                    · <CountUp to={parseInt(p.holders)} /> holders
                  </span>
                )}
                {!p.holders && <span className="opacity-50 font-normal text-xs">{p.tag}</span>}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <span><span className="font-bold text-[#0b0f19]">16+</span> impact initiatives</span>
            <span><span className="font-bold text-[#0b0f19]">IRL</span> real-world benefits</span>
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
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              Our Projects
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Projects people believe in
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto italic">
              Each of these started as a belief. Now it's an exchange-traded token.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                className="group rounded-[32px] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl hover:shadow-2xl transition overflow-hidden"
                style={{ borderTopWidth: "4px", borderTopColor: p.topColor }}
              >
                <div className="relative h-56 overflow-hidden">
                  <span className={`absolute top-5 left-5 z-10 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r ${p.badgeGradient} text-white shadow`}>
                    {p.tag === "Coming soon" ? "Coming Soon" : "Public Exchange Token"}
                  </span>
                  {p.holders && (
                    <span className="absolute top-5 right-5 z-10 px-3 py-1.5 text-xs font-semibold rounded-full bg-black/40 text-white backdrop-blur-sm">
                      <CountUp to={parseInt(p.holders)} /> holders
                    </span>
                  )}
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>

                  <div className="space-y-3 text-sm text-slate-600">
                    {p.benefits.map((b) => (
                      <div key={b} className="flex gap-2 items-start">
                        <span className="w-2 h-2 mt-2 bg-[#ff4f8b] rounded-full flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                    Impact focus:{" "}
                    <span className="font-medium text-[#c81f34]">{p.impact}</span>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    {p.href ? (
                      <>
                        <a href={p.href} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4">
                          Visit project →
                        </a>
                        <a href="#cta" className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] text-white text-sm font-semibold shadow-[0_8px_18px_rgba(255,39,42,0.24)] hover:shadow-[0_10px_24px_rgba(255,79,139,0.32)] transition">
                          Get involved
                        </a>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── WHAT BELIEF EARNS YOU (was Participation Engine) ───────────── */}
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
              What belief earns you
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hold a token. Earn real access, real rewards, and real recognition — not just points.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/40 p-8 shadow-sm space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff272a] to-[#ff7a45] flex items-center justify-center text-2xl shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── TESTIMONIAL ─────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-6 lg:px-24 py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a] text-center">
            From the community
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Holding BeanYou tokens changed how I think about my morning coffee. I know exactly where it came from — and I earned my way to an on-site visit in Kenya.",
                name: "Sarah M.",
                role: "BeanYou token holder",
                color: "linear-gradient(135deg, #6ee7b7, #059669)",
              },
              {
                quote: "I thought blockchain was just for speculation. iRWA showed me it can mean something real — my Zut Island token gets me access to a meditation retreat I genuinely care about.",
                name: "James T.",
                role: "Zut Island token holder",
                color: "linear-gradient(135deg, #7dd3fc, #2563eb)",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6"
              >
                <p className="text-slate-700 text-lg leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: t.color }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CONCEPT — human rewrite, no formula ─────────────────────────── */}
      <motion.section
        id="concept"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#ff272a]">
              The philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Markets forgot something
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              For thousands of years, people have built movements around belief — religions, football clubs, cultural icons. Markets never found a way to reward the people who believed first. iRWA does.
            </p>
          </motion.div>

          {/* Old way / New way — human contrast */}
          <div className="relative grid md:grid-cols-2 gap-6">
            {/* VS connector — desktop only */}
            <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-10 pointer-events-none">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-12 bg-gradient-to-b from-transparent to-slate-300" />
                <span className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">
                  VS
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-slate-300 to-transparent" />
              </div>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The old way</p>
              <div className="space-y-4">
                {[
                  { icon: "📦", text: "You love a brand. You buy their products. You get nothing back." },
                  { icon: "💸", text: "Value flows to shareholders and executives, not believers." },
                  { icon: "🔒", text: "Your loyalty is invisible — unmeasured, unrecognised, unrewarded." },
                ].map((item) => (
                  <div key={item.text} className="flex gap-3 items-start">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.1 }}
              className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 border border-rose-200 space-y-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff272a]">The iRWA way</p>
              <div className="space-y-4">
                {[
                  { icon: "❤️", text: "You love a project. You hold a token. Your belief earns you real benefits." },
                  { icon: "🎁", text: "Rewards flow to participants — discounts, experiences, and access." },
                  { icon: "🌟", text: "Your conviction is on-chain, transferable, and permanently yours." },
                ].map((item) => (
                  <div key={item.text} className="flex gap-3 items-start">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
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
              From belief to benefit
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Four steps from emotional connection to rewarded participation.
            </p>
          </div>

          <div className="relative">
            <svg className="hidden md:block absolute top-1/2 left-0 w-full h-2 -translate-y-1/2" viewBox="0 0 1000 10" fill="none">
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
                { step: "01", title: "Define Connection", desc: "Name what you stand for — your community, cause, or culture. That becomes your token's identity." },
                { step: "02", title: "Mint Token", desc: "Connection rights are issued on-chain. Tradeable, verifiable, and interoperable across the ecosystem." },
                { step: "03", title: "Participate", desc: "Supporters hold tokens to signal alignment. Their conviction is measured and rewarded — not just held." },
                { step: "04", title: "Benefits Flow", desc: "Discounts, experiences, and access activate for token holders. The more you participate, the more you earn." },
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
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
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
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-[#f8fafc] rounded-2xl border border-black/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <h3 className="text-lg md:text-xl font-bold pr-4">{faq.q}</h3>
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
                      <p className="px-6 md:px-8 pb-6 md:pb-8 text-slate-600 leading-relaxed">
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

      {/* ─── CTA — email input, no legal line ────────────────────────────── */}
      <motion.section
        id="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#0b0f19] px-4 md:px-8 lg:px-24 py-16 md:py-24 lg:py-28 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ff272a]/8 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-indigo-900/30 blur-3xl rounded-full pointer-events-none" />

        {/* Scrolling token ticker */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden border-b border-white/10 pointer-events-none">
          <motion.div
            className="flex gap-10 py-2.5 text-xs font-mono text-white/40 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, rep) => (
              <span key={rep} className="flex gap-10">
                <span>BYOU <span className="text-emerald-400 font-semibold">▲ 2.4%</span></span>
                <span className="text-white/20">·</span>
                <span>ZUTT <span className="text-emerald-400 font-semibold">▲ 1.1%</span></span>
                <span className="text-white/20">·</span>
                <span>EVMN <span className="text-white/30">— TBA</span></span>
                <span className="text-white/20">·</span>
                <span>iRWA Exchange <span className="text-white/25">live</span></span>
                <span className="text-white/20">·</span>
                <span>1,059 holders <span className="text-rose-400 font-semibold">↑</span></span>
                <span className="text-white/20">·</span>
                <span>3 projects <span className="text-white/25">on-chain</span></span>
                <span className="text-white/20">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUpVariants}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-8 relative z-10 pt-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Build your iRWA project.
          </h2>
          <p className="text-white/65 text-base md:text-xl leading-relaxed">
            Drop your email and we'll reach out within 24 hours to explore what your belief economy could look like.
          </p>

          {emailSent ? (
            <div className="rounded-2xl bg-white/10 border border-white/20 px-8 py-6 text-white font-semibold text-lg">
              Thanks — we'll be in touch soon.
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-white placeholder-white/40 outline-none focus:border-[#ff272a] focus:bg-white/15 transition"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#ff272a] px-7 py-4 font-semibold text-white hover:bg-[#e02020] transition whitespace-nowrap"
              >
                Get in touch
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/evolution"
              className="text-white/50 hover:text-white/80 text-sm transition underline underline-offset-4"
            >
              Read our story →
            </a>
          </div>
        </motion.div>
      </motion.section>

      <SiteFooter currentPath="/" withMobileSpacer />
    </div>
  );
}
