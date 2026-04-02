"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

interface Instrument {
  title: string;
  desc: string;
  link: string;
  tag: string;
}

const instruments: Instrument[] = [
  {
    title: "17 Whitepapers",
    desc: "Sector-based applications across 17 industries, each with a dedicated whitepaper exploring intangible value at scale.",
    link: "https://ccegblockchain.com/white-papers/",
    tag: "Research",
  },
  {
    title: "Social Earnings Ratio\u00ae",
    desc: "A unique measurement framework for quantifying intangible and social value across any organisation, community, or asset.",
    link: "https://en.wikipedia.org/wiki/Social_earnings_ratio",
    tag: "Measurement",
  },
  {
    title: "Financial and Non-Financial Tokens",
    desc: "Exchange-compatible and soft-benefit participation tokens underpinned by the SER and MCR frameworks, bridging financial and non-financial value.",
    link: "https://seratio-coins.world/",
    tag: "Tokenisation",
  },
  {
    title: "Genome of Values",
    desc: "Mapping 8 billion people\u2019s belief systems into measurable participation values \u2014 the complete genome of what humanity holds sacred.",
    link: "https://www.mivalues.today/",
    tag: "Values",
  },
  {
    title: "Digital Twin",
    desc: "A digital mirror of real-world intangible assets, bridging physical presence and cultural identity with on-chain representation.",
    link: "https://www.mimeta.life/",
    tag: "Technology",
  },
  {
    title: "Social Value Reporting",
    desc: "Standardised frameworks for transparent social value measurement, enabling auditable and comparable impact reporting.",
    link: "",
    tag: "Reporting",
  },
  {
    title: "Frontiers in Blockchain",
    desc: "Peer-reviewed research at the frontier of blockchain applications for social and intangible value.",
    link: "https://www.frontiersin.org/journals/blockchain",
    tag: "Academic",
  },
  {
    title: "UK Digital University",
    desc: "Knowledge-exchange infrastructure enabling digital participation and academic efficiency in higher education.",
    link: "http://www.efficiencyexchange.ac.uk/",
    tag: "Education",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function InstrumentsPage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePointer = () => setHasFinePointer(mq.matches);
    const updateMotion = () => setReducedMotion(mqMotion.matches);
    updatePointer();
    updateMotion();
    mq.addEventListener("change", updatePointer);
    mqMotion.addEventListener("change", updateMotion);
    return () => {
      mq.removeEventListener("change", updatePointer);
      mqMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white pt-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 0% 0%, #D42B2718 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 100% 10%, #4E83B820 0%, transparent 60%), #070b14",
      }}
      onPointerMove={(e) => {
        if (!hasFinePointer || reducedMotion) return;
        setCursor({ x: e.clientX, y: e.clientY, show: true });
      }}
      onPointerLeave={() => {
        if (!hasFinePointer || reducedMotion) return;
        setCursor((prev) => ({ ...prev, show: false }));
      }}
    >
      {/* Custom cursor glow */}
      {hasFinePointer && !reducedMotion && (
        <motion.div
          animate={{
            x: cursor.x - 80,
            y: cursor.y - 80,
            opacity: cursor.show ? 0.7 : 0,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-40 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, #4E83B860 0%, #D42B2730 55%, transparent 75%)",
          }}
        />
      )}

      <SiteHeader currentPath="/instruments" />

      {/* Bold background blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: -120,
          width: 600,
          height: 500,
          background: "radial-gradient(circle, #D42B27 0%, transparent 65%)",
          opacity: 0.14,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 60,
          right: -120,
          width: 640,
          height: 520,
          background: "radial-gradient(circle, #4E83B8 0%, transparent 65%)",
          opacity: 0.12,
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "20%",
          left: "20%",
          width: 480,
          height: 380,
          background: "radial-gradient(circle, #7B4B9E 0%, transparent 65%)",
          opacity: 0.09,
          filter: "blur(100px)",
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Hero */}
      <section className="relative px-6 lg:px-24 pt-20 pb-16 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <p
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70"
            style={{ borderColor: "#D42B2740", background: "#D42B270d" }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "linear-gradient(90deg, #D42B27, #4E83B8)",
              }}
            />
            The Architecture
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08]">
            Instruments of
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #D42B27 0%, #7B4B9E 50%, #4E83B8 100%)",
              }}
            >
              Intangible Value
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The tools, frameworks, and research that make the intangible
            measurable, tokenisable, and tradeable.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="relative px-6 lg:px-24 pb-24">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {instruments.map((item, index) => {
            const hasLink = !!item.link;

            const inner = (
              <>
                {/* Top gradient bar */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl"
                  style={{
                    background:
                      "linear-gradient(90deg, #D42B27, #7B4B9E, #4E83B8)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

                <div className="flex items-start justify-between mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/70"
                    style={{ borderColor: "#D42B2740", background: "#D42B270d" }}
                  >
                    {item.tag}
                  </span>
                  <span
                    className="text-3xl font-black leading-none bg-clip-text text-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #D42B27, #4E83B8)",
                    }}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold tracking-tight mb-2.5 leading-snug text-white">
                  {item.title}
                </h3>

                <p className="text-white/60 leading-relaxed text-sm flex-1">
                  {item.desc}
                </p>

                {hasLink ? (
                  <div
                    className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300"
                    style={{ color: "#4E83B8" }}
                  >
                    <span>Explore</span>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-white/25">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/25" />
                    Link pending
                  </div>
                )}
              </>
            );

            return (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                transition={{ duration: 0.55, delay: index * 0.07 }}
              >
                {hasLink ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col h-full rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-7 shadow-xl overflow-hidden hover:border-white/25 hover:bg-white/[0.08] transition-all duration-300"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group relative flex flex-col h-full rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-7 shadow-xl overflow-hidden opacity-70 cursor-default">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="pb-14 text-center">
        <Link href="/" className="text-white/35 hover:text-white/80 transition text-sm">
          &#8592; Back to Home
        </Link>
      </div>

      <SiteFooter currentPath="/instruments" />
    </div>
  );
}
