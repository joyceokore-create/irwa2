"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

type TimelineItem = {
  year: string;
  title: string;
  desc: string;
  isMedia?: boolean;
  link?: string;
};

const TIMELINE: TimelineItem[] = [
  {
    year: "2011",
    title: "Research",
    desc: "Academic research at University of Northampton, UK.",
  },
  {
    year: "2012",
    title: "Measurement",
    desc: "Launch of Social Earnings Ratio\u00ae to measure intangible value.",
  },
  {
    year: "2013",
    title: "Focus",
    desc: "University spin-out: Centre for Citizenship, Enterprise and Governance.",
  },
  {
    year: "2014",
    title: "\u201cGod Metric\u201d Speech",
    desc: "Vatican speech where the Social Earnings Ratio\u00ae was described as the \u201cGod Metric\u201d.",
    isMedia: true,
    link: "https://www.youtube.com/watch?v=nWgCCbOnYLY",
  },
  {
    year: "2015",
    title: "Socialchefsdagarna",
    desc: "Keynote at Socialchefsdagarna, Sweden \u2014 adopted across public procurement in 9 countries.",
    isMedia: true,
    link: "https://www.youtube.com/watch?v=0Mpe9bBvoII",
  },
  {
    year: "2017",
    title: "Finance",
    desc: "ICO compliant with FCA.",
  },
  {
    year: "2018",
    title: "World\u2019s First Professor in Blockchain",
    desc: "Appointed World\u2019s First Professor in Blockchain at Birmingham City University, UK.",
    isMedia: true,
    link: "https://www.verdict.co.uk/professor-of-blockchain-cryptocurrency-social-change/",
  },
  {
    year: "2019\u20132023",
    title: "Applications",
    desc: "16 sectors with 16 whitepapers.",
  },
  {
    year: "2021",
    title: "Tokenizing Love",
    desc: "International media coverage: \u201cThis Professor is Tokenizing Love\u201d across blockchain, Web3, and impact investing publications.",
    isMedia: true,
    link: "https://decrypt.co/57609/this-professor-is-tokenizing-love-is-he-nuts",
  },
  {
    year: "2024",
    title: "Retail",
    desc: "Launch of Beanyou.com.",
  },
  {
    year: "2025",
    title: "iRWA",
    desc: "Intangible Real World Assets formally launched.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function EvolutionPage() {
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLElement | null>(null);

  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.75", "end 0.2"],
  });

  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.35,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setTimelineProgress(Math.max(0, Math.min(100, Math.round(value * 100))));
  });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setHasFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const cursorEnabled = hasFinePointer && !reduceMotion;

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white pt-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 0% 0%, #D42B2718 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 100% 10%, #4E83B820 0%, transparent 60%), #070b14",
      }}
      onPointerMove={(e) => {
        if (!cursorEnabled) return;
        setCursor({ x: e.clientX, y: e.clientY, show: true });
      }}
      onPointerLeave={() => {
        if (!cursorEnabled) return;
        setCursor((prev) => ({ ...prev, show: false }));
      }}
    >
      {/* Custom cursor glow */}
      {cursorEnabled && (
        <motion.div
          animate={{
            x: cursor.x - 80,
            y: cursor.y - 80,
            opacity: cursor.show ? 0.85 : 0,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-40 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, #D42B2760 0%, #4E83B830 55%, transparent 75%)",
          }}
        />
      )}

      <SiteHeader currentPath="/evolution" />

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
          bottom: "30%",
          left: "30%",
          width: 500,
          height: 400,
          background: "radial-gradient(circle, #7B4B9E 0%, transparent 65%)",
          opacity: 0.08,
          filter: "blur(100px)",
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* HERO */}
      <section className="relative min-h-[72vh] flex items-center justify-center px-6 lg:px-24 py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.85 }}
          className="relative max-w-5xl mx-auto text-center space-y-7"
        >
          <p
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70"
            style={{
              borderColor: "#D42B2740",
              background: "#D42B270d",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "linear-gradient(90deg, #D42B27, #4E83B8)",
              }}
            />
            Evolution Timeline
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08]">
            15 Years of Measuring the
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #D42B27 0%, #7B4B9E 50%, #4E83B8 100%)",
              }}
            >
              Intangible
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From academic research to tokenized connection economies, the iRWA
            journey has moved from theory to public instruments.
          </p>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section
        ref={timelineRef}
        className="relative px-5 md:px-12 lg:px-24 py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto relative">
          {/* Progress pill */}
          <div className="sticky top-20 z-20 mb-8 flex justify-end md:mb-0">
            <div
              className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/70 backdrop-blur-md"
              style={{
                borderColor: "#D42B2740",
                background: "#D42B270d",
              }}
            >
              Timeline: {timelineProgress}%
            </div>
          </div>

          {/* Desktop center rail */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
          <motion.div
            style={{ scaleY: progressSpring }}
            className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 origin-top"
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(to bottom, #D42B27, #7B4B9E, #4E83B8)",
              }}
            />
          </motion.div>

          {/* Mobile rail */}
          <div className="md:hidden absolute left-5 top-0 h-full w-px bg-white/10" />
          <motion.div
            style={{ scaleY: progressSpring }}
            className="md:hidden absolute left-5 top-0 h-full w-[2px] origin-top"
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(to bottom, #D42B27, #7B4B9E, #4E83B8)",
              }}
            />
          </motion.div>

          <div className="space-y-10 md:space-y-16 lg:space-y-20">
            {TIMELINE.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={`${item.year}-${item.title}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  variants={fadeUp}
                  transition={{
                    duration: reduceMotion ? 0 : 0.65,
                    delay: reduceMotion ? 0 : index * 0.04,
                  }}
                  className="relative"
                >
                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-x-10">
                    <div className={isLeft ? "justify-self-end w-full max-w-md" : "w-full max-w-md"} />
                    <div className="relative z-10">
                      <div
                        className="h-5 w-5 rounded-full ring-8 ring-[#070b14]"
                        style={{
                          background: "#D42B27",
                          boxShadow: "0 0 0 4px #D42B2730",
                        }}
                      />
                    </div>
                    <div className={!isLeft ? "justify-self-start w-full max-w-md" : "w-full max-w-md"} />
                  </div>

                  <div className="hidden md:grid grid-cols-2 gap-x-20 -mt-3">
                    <div className={isLeft ? "pr-10" : "pr-10 invisible"}>
                      {isLeft && (
                        <TimelineCard item={item} align="right" index={index} />
                      )}
                    </div>
                    <div className={!isLeft ? "pl-10" : "pl-10 invisible"}>
                      {!isLeft && (
                        <TimelineCard item={item} align="left" index={index} />
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden pl-12">
                    <div
                      className="absolute left-3 top-6 z-10 h-4 w-4 rounded-full ring-4 ring-[#070b14]"
                      style={{
                        background: "#D42B27",
                        boxShadow: "0 0 0 3px #D42B2730",
                      }}
                    />
                    <TimelineCard item={item} align="left" index={index} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 lg:px-24 py-24 border-t border-white/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.75 }}
          className="max-w-4xl mx-auto text-center space-y-7"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            From Measurement to Instruments
          </h2>

          <p className="text-white/65 text-lg md:text-xl">
            The evolution continues through tools, metrics, tokens, and digital
            infrastructure that make belief measurable.
          </p>

          <a
            href="/instruments"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-white hover:opacity-90 hover:scale-[1.02] transition-all"
            style={{
              background: "linear-gradient(135deg, #D42B27, #4E83B8)",
              boxShadow: "0 8px 28px rgba(212,43,39,0.35)",
            }}
          >
            Explore Our Instruments &rarr;
          </a>
        </motion.div>
      </section>

      <SiteFooter currentPath="/evolution" />
    </div>
  );
}

function TimelineCard({
  item,
  align,
  index,
}: {
  item: TimelineItem;
  align: "left" | "right";
  index: number;
}) {
  return (
    <div
      className={`relative rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 md:p-7 shadow-xl overflow-hidden ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {/* Top gradient bar */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl"
        style={{
          background: "linear-gradient(90deg, #D42B27, #7B4B9E, #4E83B8)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

      <div
        className={`mb-3 flex items-center gap-2 flex-wrap ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/70"
          style={{ borderColor: "#D42B2740", background: "#D42B270d" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D42B27" }} />
          {item.year}
        </span>
        {item.isMedia && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.12em] font-semibold"
            style={{
              color: "#4E83B8",
              background: "#4E83B81a",
              borderColor: "#4E83B840",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#4E83B8" }} />
            Media
          </span>
        )}
      </div>

      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
        {item.title}
      </h3>

      <p className="mt-3 text-white/65 leading-relaxed">{item.desc}</p>

      <div
        className={`mt-5 flex items-center gap-4 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span className="text-[11px] uppercase tracking-[0.14em] text-white/30">
          Milestone {(index + 1).toString().padStart(2, "0")}
        </span>
        {item.link && (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] overflow-hidden"
            style={{
              color: "#fff",
              background: "linear-gradient(135deg, #D42B2720, #4E83B830)",
              border: "1px solid #4E83B850",
              boxShadow: "0 0 12px #4E83B825",
            }}
          >
            {/* Animated shimmer sweep */}
            <motion.span
              className="absolute inset-0 -skew-x-12"
              style={{ background: "linear-gradient(90deg, transparent 0%, #ffffff18 50%, transparent 100%)", backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
            {/* Pulsing dot */}
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: "#4E83B8" }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#4E83B8" }} />
            </span>
            <span className="relative">View</span>
            <motion.span
              className="relative"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              &rarr;
            </motion.span>
          </motion.a>
        )}
      </div>
    </div>
  );
}
