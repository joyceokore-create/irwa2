"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import EcosystemGlobe from "../components/EcosystemGlobe";

const grad = "linear-gradient(90deg, #D42B27 0%, #7B4B9E 50%, #4E83B8 100%)";

// ── Token data for floating edge pills ───────────────────────────────────────
const FLOAT_TOKENS = [
  { name: "BYT",   color: "#4E83B8", side: "left"  as const, top: "19%", delay: 0.0, dur: 3.8 },
  { name: "DALI",  color: "#7B4B9E", side: "right" as const, top: "27%", delay: 1.2, dur: 4.2 },
  { name: "MCR",   color: "#4E83B8", side: "left"  as const, top: "41%", delay: 0.6, dur: 3.5 },
  { name: "ZUT",   color: "#7B4B9E", side: "right" as const, top: "54%", delay: 1.9, dur: 4.6 },
  { name: "EVM",   color: "#4E83B8", side: "left"  as const, top: "67%", delay: 0.3, dur: 4.0 },
  { name: "S·E",   color: "#D42B27", side: "right" as const, top: "75%", delay: 1.5, dur: 3.6 },
  { name: "iRWA",  color: "#D42B27", side: "left"  as const, top: "85%", delay: 0.9, dur: 4.3 },
];

const IMPACT_COUNTERS = [
  { value: 4,  label: "Projects Live",     suffix: "+", color: "#D42B27" },
  { value: 17, label: "Sectors Covered",   suffix: "",  color: "#7B4B9E" },
  { value: 8,  label: "Countries w/ SER",  suffix: "+", color: "#4E83B8" },
  { value: 15, label: "Years of Research", suffix: "",  color: "#D42B27" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Tag({ label, color = "#ffffff" }: { label: string; color?: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em]"
      style={{ borderColor: `${color}25`, background: `${color}08`, color: `${color}80` }}>
      <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: grad }} />
      {label}
    </p>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="mt-[5px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />;
}

// ── Floating token pills ──────────────────────────────────────────────────────
function FloatingTokens() {
  return (
    <>
      {FLOAT_TOKENS.map((t, i) => (
        <motion.div
          key={t.name}
          className="fixed hidden xl:block pointer-events-none select-none"
          style={{
            left:  t.side === "left"  ? 14 : undefined,
            right: t.side === "right" ? 14 : undefined,
            top: t.top,
            zIndex: 20,
            transform: "translateY(-50%)",
          }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: t.dur, repeat: Infinity, ease: "easeInOut", delay: t.delay }}
        >
          {/* outer glow ring */}
          <motion.div
            className="absolute inset-[-6px] rounded-full opacity-40"
            style={{ background: `radial-gradient(circle, ${t.color}50, transparent 70%)` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: t.dur, repeat: Infinity, ease: "easeInOut", delay: t.delay }}
          />
          <div
            className="relative rounded-full border px-3.5 py-1.5 text-[11px] font-black tracking-widest backdrop-blur-sm"
            style={{
              color: t.color,
              borderColor: `${t.color}60`,
              background: "rgba(5,9,20,0.80)",
              boxShadow: `0 0 20px ${t.color}35, 0 0 0 1px ${t.color}28`,
            }}
          >
            {t.name}
          </div>
        </motion.div>
      ))}
    </>
  );
}

// ── Scroll-in + scroll-out glass card ─────────────────────────────────────────
function GlassSection({
  children,
  glowColor,
  rm,
  inner = "p-8 md:p-12 space-y-12",
  maxW = "max-w-6xl",
}: {
  children: React.ReactNode;
  glowColor: string;
  rm: boolean;
  inner?: string;
  maxW?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.12 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={
        rm
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: inView ? 1 : 0, y: inView ? 0 : 60, scale: inView ? 1 : 0.96 }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`${maxW} mx-auto rounded-3xl border border-white/[0.10] backdrop-blur-2xl ${inner}`}
      style={{
        background: "rgba(4,8,18,0.50)",
        boxShadow: `0 0 100px ${glowColor}14, 0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px ${glowColor}20`,
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EcosystemPage() {
  const rm = useReducedMotion();

  return (
    <div className="relative overflow-x-hidden" style={{ background: "#070b14", minHeight: "100vh" }}>
      {/* Fixed full-screen globe */}
      <EcosystemGlobe />

      <div className="relative" style={{ zIndex: 1 }}>
        <SiteHeader currentPath="/ecosystem" />

        {/* Floating token pills at screen edges */}
        <FloatingTokens />

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl mx-auto text-center rounded-3xl border border-white/[0.10] backdrop-blur-2xl p-12 md:p-16 space-y-9"
            style={{
              background: "rgba(4,8,18,0.50)",
              boxShadow:
                "0 0 140px rgba(212,43,39,0.14), 0 0 80px rgba(78,131,184,0.10), 0 4px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10)",
            }}
          >
            <Tag label="Ecosystem" />

            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight leading-[1.0]">
              <span className="text-white">The iRWA</span>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: grad }}>
                Ecosystem
              </span>
            </h1>

            <p className="text-white/50 text-xl leading-relaxed max-w-sm mx-auto">
              One participation layer. Many causes. Measurable impact.
            </p>

            {/* Mini counter tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {IMPACT_COUNTERS.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: rm ? 0 : 0.5, delay: rm ? 0 : 0.6 + i * 0.1 }}
                  className="rounded-2xl border border-white/[0.08] p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-2xl font-black bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${s.color}, #4E83B8)` }}>
                    {s.value}{s.suffix}
                  </p>
                  <p className="text-white/35 text-[10px] uppercase tracking-wide mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Live pulse */}
            <div className="flex items-center justify-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: "#D42B27" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#D42B27" }} />
              </span>
              <span className="text-white/38 text-sm">7 global nodes connected live</span>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#4E83B8" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="How It Works" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Simple on the surface.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#D42B27,#4E83B8)" }}>
                  Powerful underneath.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Create one account",   desc: "Top up — $10, $20, or $100.", color: "#D42B27" },
                { step: "02", title: "Receive tokens",       desc: "Balance converts to ecosystem tokens.", color: "#7B4B9E" },
                { step: "03", title: "Allocate to causes",   desc: "Coffee, EV, Dalí, Pilgrimage, and more.", color: "#4E83B8" },
                { step: "04", title: "Move freely, anytime", desc: "Switch causes whenever you like.", color: "#D42B27" },
              ].map((s, i) => (
                <motion.div key={s.step}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: rm ? 0 : 0.5, delay: rm ? 0 : i * 0.1 }}
                  whileHover={{ y: -7, scale: 1.02, transition: { type: "spring", stiffness: 320, damping: 20 } }}
                  className="relative rounded-2xl border border-white/[0.09] p-6 overflow-hidden cursor-default"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${s.color},#4E83B8)` }} />
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-xs font-black text-white"
                    style={{ background: `linear-gradient(135deg,${s.color},#4E83B8)` }}>
                    {s.step}
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{s.title}</p>
                  <p className="text-white/45 text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="relative rounded-2xl border border-white/[0.08] px-7 py-5 flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden"
              style={{ background: "rgba(78,131,184,0.08)" }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                style={{ background: "linear-gradient(90deg,#4E83B8,#7B4B9E)" }} />
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold flex-shrink-0"
                style={{ color: "#4E83B8", borderColor: "#4E83B840", background: "#4E83B818" }}>
                Retail entry
              </span>
              <p className="text-white/50 text-sm">
                Partner café checkouts offer a voluntary $0.05–$1 at point of sale.
                You get ecosystem tokens instantly —{" "}
                <span className="text-white font-medium">no account required.</span>
              </p>
            </div>
          </GlassSection>
        </section>

        {/* ── TOKEN STRUCTURE ───────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#D42B27" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="Token Structure" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                One ecosystem.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#7B4B9E,#4E83B8)" }}>
                  Many projects.
                </span>
              </h2>
            </div>

            {/* Hub diagram */}
            <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden p-8 md:p-10"
              style={{ background: "rgba(212,43,39,0.05)" }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl" style={{ background: grad }} />
              <div className="flex flex-col items-center gap-5">
                <div className="relative flex items-center justify-center">
                  {!rm && (
                    <motion.div className="absolute rounded-full"
                      style={{ background: "radial-gradient(circle,#D42B2730,transparent 70%)", width: 300, height: 84 }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.12, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                  )}
                  <div className="relative rounded-full border-2 px-9 py-3 font-bold text-base text-white"
                    style={{ borderColor: "#D42B27", background: "#D42B2718" }}>
                    Main Ecosystem Token
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/25 text-[11px] uppercase tracking-widest">
                  <div className="h-px w-16" style={{ background: "linear-gradient(90deg,transparent,#7B4B9E)" }} />
                  <span>swappable</span>
                  <div className="h-px w-16" style={{ background: "linear-gradient(90deg,#7B4B9E,transparent)" }} />
                </div>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {["Bean You", "Zut Island", "Salvador Dalí", "EV Minerals", "Pilgrimage", "Rewilding", "Healthcare", "+ more"].map((name, i) => (
                    <motion.div key={name}
                      whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400 } }}
                      className="rounded-full border px-4 py-1.5 text-sm font-medium text-white/65 cursor-default"
                      style={{
                        borderColor: i % 3 === 0 ? "#D42B2748" : i % 3 === 1 ? "#7B4B9E48" : "#4E83B848",
                        background:  i % 3 === 0 ? "#D42B2710" : i % 3 === 1 ? "#7B4B9E10" : "#4E83B810",
                      }}>
                      {name}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Main Ecosystem Token", line: "Base layer. Move value freely across every project.", color: "#D42B27" },
                { title: "Project Tokens",        line: "Each cause has its own token. Support what resonates.", color: "#7B4B9E" },
                { title: "MCR Token",             line: "Non-financial. Rewards good behaviour. Governs iRWA.", color: "#4E83B8" },
              ].map((card, i) => (
                <motion.div key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: rm ? 0 : 0.5, delay: rm ? 0 : i * 0.11 }}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 320 } }}
                  className="relative rounded-2xl border border-white/[0.09] p-6 overflow-hidden cursor-default"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${card.color},${card.color}20)` }} />
                  <div className="w-3 h-3 rounded-full mb-4"
                    style={{ background: card.color, boxShadow: `0 0 12px ${card.color}` }} />
                  <p className="font-semibold text-white mb-1">{card.title}</p>
                  <p className="text-white/48 text-sm leading-relaxed">{card.line}</p>
                </motion.div>
              ))}
            </div>
          </GlassSection>
        </section>

        {/* ── MCR & GENOME ──────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#7B4B9E" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="MCR & Values" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Your values{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#D42B27,#7B4B9E)" }}>
                  have currency.
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* MCR card */}
              <div className="relative rounded-2xl border border-white/[0.09] p-7 overflow-hidden"
                style={{ background: "rgba(78,131,184,0.08)" }}>
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg,#4E83B8,#7B4B9E)" }} />
                <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold mb-5"
                  style={{ color: "#4E83B8", borderColor: "#4E83B845", background: "#4E83B818" }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#4E83B8" }} />
                  MCR Token
                </span>
                <h3 className="text-xl font-semibold text-white mb-5">Non-Financial Participation</h3>
                <div className="space-y-3">
                  {[
                    { label: "Points System",   desc: "Good actions earn points — redeemable with aligned partners." },
                    { label: "Governance",       desc: "More good you do, more say you have in iRWA." },
                    { label: "Community bridge", desc: "Brings aligned communities into the ecosystem." },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Dot color="#4E83B8" />
                      <p className="text-sm text-white/55">
                        <span className="font-semibold text-white">{r.label}</span> — {r.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genome card */}
              <div className="relative rounded-2xl border border-white/[0.09] p-7 overflow-hidden"
                style={{ background: "rgba(212,43,39,0.07)" }}>
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg,#D42B27,#7B4B9E)" }} />
                <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold mb-5"
                  style={{ color: "#D42B27", borderColor: "#D42B2740", background: "#D42B2710" }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#D42B27" }} />
                  Genome of Values
                </span>
                <h3 className="text-xl font-semibold text-white mb-2">Belief as the Next Currency</h3>
                <p className="text-white/48 text-sm mb-5">Ideology, faith, and values are the next currency — just as sentiment became the currency of retail.</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { stat: "8B",  label: "People" },
                    { stat: "4+",  label: "Value sets each" },
                    { stat: "NFP", label: "Structure" },
                  ].map((s) => (
                    <div key={s.stat} className="rounded-xl border border-white/[0.08] p-3 text-center"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      <p className="text-lg font-black bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(135deg,#D42B27,#7B4B9E)" }}>{s.stat}</p>
                      <p className="text-[11px] text-white/38 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3">
                  <Dot color="#D42B27" />
                  <p className="text-sm text-white/50">AI learns from this values layer — more participants, richer intelligence.</p>
                </div>
              </div>
            </div>
          </GlassSection>
        </section>

        {/* ── REWARDS ───────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#D42B27" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="Rewards" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Participation{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: grad }}>
                  that gives back.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { tier: "Entry",    color: "#4E83B8", items: ["Brand discounts", "Ecosystem reward points", "Digital rewards card"] },
                { tier: "Mid-Tier", color: "#7B4B9E", items: ["Partner experiences", "Periodic prize draws", "Cause-specific benefits"] },
                { tier: "VIP",      color: "#D42B27", items: ["Quarterly impact trips", "Sponsored travel & stays", "On-site project visits"] },
              ].map((t, i) => (
                <motion.div key={t.tier}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: rm ? 0 : 0.5, delay: rm ? 0 : i * 0.12 }}
                  whileHover={{ y: -7, scale: 1.02, transition: { type: "spring", stiffness: 320 } }}
                  className="relative rounded-2xl border border-white/[0.09] p-6 overflow-hidden cursor-default"
                  style={{ background: `rgba(${t.color === "#D42B27" ? "212,43,39" : t.color === "#7B4B9E" ? "123,75,158" : "78,131,184"},0.09)` }}>
                  <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${t.color},${t.color}20)` }} />
                  <span className="inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-bold mb-5"
                    style={{ color: t.color, borderColor: `${t.color}45`, background: `${t.color}18` }}>
                    {t.tier}
                  </span>
                  <ul className="space-y-2.5">
                    {t.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <Dot color={t.color} />
                        <span className="text-white/62 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassSection>
        </section>

        {/* ── IMPACT ────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#4E83B8" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="Impact" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Good behaviour, rewarded.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#4E83B8,#7B4B9E)" }}>
                  Impact, measured.
                </span>
              </h2>
              <p className="text-white/42 text-base max-w-xl mx-auto">
                Every project establishes a Foundation — measured by the Social Earnings Ratio&#174;.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {IMPACT_COUNTERS.map((s, i) => (
                <CounterCard key={s.label} stat={s} index={i} reduceMotion={!!rm} />
              ))}
            </div>

            <div className="relative rounded-2xl border border-white/[0.08] p-8 overflow-hidden"
              style={{ background: "rgba(78,131,184,0.07)" }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl" style={{ background: grad }} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
                {[
                  { n: "01", title: "Foundation",  body: "Each project sets up a Foundation for social or environmental intervention." },
                  { n: "02", title: "S/E Ratio",   body: "Foundation impact measured by the Social Earnings Ratio&#174;." },
                  { n: "03", title: "MCR Rewards", body: "Good individual actions earn MCR tokens in real time — no delay." },
                ].map((step, i) => (
                  <div key={step.n} className="relative flex flex-col gap-2 md:px-6">
                    {i < 2 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
                    )}
                    <span className="text-3xl font-black bg-clip-text text-transparent" style={{ backgroundImage: grad }}>{step.n}</span>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="text-white/45 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step.body }} />
                  </div>
                ))}
              </div>
            </div>
          </GlassSection>
        </section>

        {/* ── STAKEHOLDERS ──────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#7B4B9E" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="Who It's For" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Built for everyone{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#7B4B9E,#4E83B8)" }}>
                  with a stake in a better world.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Public Participants",    line: "Rewards, recognition, and belonging to something bigger than commerce.", color: "#4E83B8" },
                { title: "Corporates & Brands",    line: "ESG dashboards, values-aligned engagement, verifiable impact reporting.", color: "#D42B27" },
                { title: "SMEs & Retail Partners", line: "Checkout micro-contributions, community traction, soft-benefit programmes.", color: "#7B4B9E" },
                { title: "Governments & Policy",   line: "Transparent outcomes across employment, environment, and cross-sector goals.", color: "#4E83B8" },
              ].map((s, i) => (
                <motion.div key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: rm ? 0 : 0.5, delay: rm ? 0 : i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 320 } }}
                  className="relative rounded-2xl border border-white/[0.09] px-6 py-5 overflow-hidden cursor-default"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${s.color}85,${s.color}15)` }} />
                  <div className="w-3 h-3 rounded-full mb-3"
                    style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
                  <p className="font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-white/48 text-sm">{s.line}</p>
                </motion.div>
              ))}
            </div>
          </GlassSection>
        </section>

        {/* ── DATA & TRANSPARENCY ───────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <GlassSection glowColor="#4E83B8" rm={!!rm}>
            <div className="text-center space-y-3">
              <Tag label="Data & Transparency" />
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Your data. Your choice.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#4E83B8,#7B4B9E)" }}>
                  Your reward.
                </span>
              </h2>
            </div>

            <div className="relative rounded-2xl border border-white/[0.08] p-8 overflow-hidden"
              style={{ background: "rgba(78,131,184,0.07)" }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                style={{ background: "linear-gradient(90deg,#4E83B8,#7B4B9E)" }} />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/32 font-semibold mb-4">Principles</p>
                  <div className="space-y-3">
                    {[
                      "Fully opt-in — you control what is shared",
                      "Blockchain-recorded consent — transparent and revocable",
                      "Every contribution earns additional ecosystem points",
                      "You know exactly what is collected and why",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Dot color="#4E83B8" />
                        <span className="text-white/52 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/32 font-semibold mb-4">Revenue streams</p>
                  <div className="space-y-3">
                    {[
                      "Platform participation fees",
                      "Token issuance margins",
                      "Corporate partnership packages",
                      "Data sharing — with participant rev-share",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Dot color="#D42B27" />
                        <span className="text-white/52 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassSection>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-24 pb-28 md:pb-36">
          <GlassSection glowColor="#D42B27" rm={!!rm} maxW="max-w-3xl" inner="p-12 md:p-16">
            <div className="text-center space-y-8">
              <Tag label="Join the Ecosystem" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Build your project
                <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: grad }}>
                  inside the ecosystem.
                </span>
              </h2>
              <p className="text-white/48 text-lg">Drop your details — we will respond within 24 hours.</p>
              <div className="relative inline-flex">
                {!rm && (
                  <motion.div className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg,#D42B27,#4E83B8)" }}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
                )}
                <a href="/#participation"
                  className="relative inline-flex items-center justify-center rounded-full px-9 py-4 font-bold text-white hover:opacity-90 hover:scale-[1.04] transition-all"
                  style={{ background: "linear-gradient(135deg,#D42B27,#4E83B8)", boxShadow: "0 10px 32px rgba(212,43,39,0.45)" }}>
                  Get in Touch &rarr;
                </a>
              </div>
            </div>
          </GlassSection>
        </section>

        <SiteFooter currentPath="/ecosystem" />
      </div>
    </div>
  );
}

// ── Animated counter card ─────────────────────────────────────────────────────
function CounterCard({
  stat,
  index,
  reduceMotion,
}: {
  stat: (typeof IMPACT_COUNTERS)[0];
  index: number;
  reduceMotion: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (reduceMotion) { setCount(stat.value); return; }
    if (!inView) return;
    const steps = 60;
    const inc = stat.value / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= stat.value) { setCount(stat.value); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [inView, reduceMotion, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.1 }}
      whileHover={{ y: -5, scale: 1.05, transition: { type: "spring", stiffness: 340 } }}
      className="relative rounded-2xl border border-white/[0.09] overflow-hidden text-center cursor-default p-6"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl" style={{ background: grad }} />
      <p className="text-4xl font-black mb-1 bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(135deg,${stat.color},#4E83B8)` }}>
        {count}{stat.suffix}
      </p>
      <p className="text-white/42 text-xs uppercase tracking-wide">{stat.label}</p>
    </motion.div>
  );
}
