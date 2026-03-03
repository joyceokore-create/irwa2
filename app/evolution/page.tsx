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
    desc: "Launch of Social Earnings Ratio® to measure intangible value.",
  },
  {
    year: "2013",
    title: "Focus",
    desc: "University spin-out: Centre for Citizenship, Enterprise and Governance.",
  },
  {
    year: "2014",
    title: "Publicity",
    desc: "Vatican speech where the metric was described as the “God Metric”.",
  },
  {
    year: "2015",
    title: "Procurement",
    desc: "Adopted across public procurement in 9 countries.",
  },
  {
    year: "2017",
    title: "Finance",
    desc: "ICO compliant with FCA.",
  },
  {
    year: "2018",
    title: "Recognition",
    desc: "Extended to Birmingham City University, UK.",
  },
  {
    year: "2019–2023",
    title: "Applications",
    desc: "16 sectors with 16 whitepapers.",
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
      className="relative min-h-screen overflow-hidden bg-[#070b14] text-white pt-20"
      onPointerMove={(e) => {
        if (!cursorEnabled) return;
        setCursor({ x: e.clientX, y: e.clientY, show: true });
      }}
      onPointerLeave={() => {
        if (!cursorEnabled) return;
        setCursor((prev) => ({ ...prev, show: false }));
      }}
    >
      {cursorEnabled && (
        <motion.div
          animate={{
            x: cursor.x - 80,
            y: cursor.y - 80,
            opacity: cursor.show ? 0.9 : 0,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-40 rounded-full bg-[radial-gradient(circle,#ff4f8b55_0%,#ff272a30_45%,transparent_75%)] blur-2xl"
        />
      )}

      <SiteHeader currentPath="/evolution" />

      {/* HERO */}
      <section className="relative min-h-[76vh] flex items-center justify-center px-6 lg:px-24 py-24">
        <div className="absolute -top-24 -left-16 h-[360px] w-[360px] rounded-full bg-[#ff272a]/20 blur-3xl" />
        <div className="absolute top-1/4 right-[-80px] h-[320px] w-[320px] rounded-full bg-[#ff4f8b]/20 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/3 h-[420px] w-[420px] rounded-full bg-[#ff7a45]/18 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.85 }}
          className="relative max-w-5xl mx-auto text-center space-y-7"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#ff272a] to-[#ff7a45]" />
            Evolution Timeline
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08]">
            15 Years of Measuring the
            <span className="block bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] bg-clip-text text-transparent">
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
      <section ref={timelineRef} className="relative px-5 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ff4f8b20,transparent_30%),radial-gradient(circle_at_20%_80%,#ff272a20,transparent_35%)]" />

        <div className="max-w-6xl mx-auto relative">
          <div className="sticky top-20 z-20 mb-8 flex justify-end md:mb-0">
            <div className="rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/70">
              Timeline Loading: {timelineProgress}%
            </div>
          </div>

          {/* Desktop center rail */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
          <motion.div
            style={{ scaleY: progressSpring }}
            className="hidden md:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-top bg-gradient-to-b from-[#ff272a] via-[#ff4f8b] to-[#ff7a45]"
          />

          {/* Mobile rail */}
          <div className="md:hidden absolute left-5 top-0 h-full w-px bg-white/15" />
          <motion.div
            style={{ scaleY: progressSpring }}
            className="md:hidden absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-[#ff272a] via-[#ff4f8b] to-[#ff7a45]"
          />

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
                      <div className="h-5 w-5 rounded-full bg-[#ff272a] ring-8 ring-[#070b14] shadow-[0_0_0_6px_rgba(255,39,42,0.2)]" />
                    </div>

                    <div className={!isLeft ? "justify-self-start w-full max-w-md" : "w-full max-w-md"} />
                  </div>

                  <div className="hidden md:grid grid-cols-2 gap-x-20 -mt-3">
                    <div className={isLeft ? "pr-10" : "pr-10 invisible"}>
                      {isLeft && <TimelineCard item={item} align="right" index={index} />}
                    </div>
                    <div className={!isLeft ? "pl-10" : "pl-10 invisible"}>
                      {!isLeft && <TimelineCard item={item} align="left" index={index} />}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden pl-12">
                    <div className="absolute left-3 top-6 z-10 h-4 w-4 rounded-full bg-[#ff272a] shadow-[0_0_0_5px_rgba(255,39,42,0.22)]" />
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
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff272a] via-[#ff4f8b] to-[#ff7a45] px-8 py-4 font-semibold text-white shadow-[0_12px_28px_rgba(255,39,42,0.32)] hover:shadow-[0_14px_34px_rgba(255,79,139,0.34)] transition"
          >
            Explore Our Instruments →
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
      className={`relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-5 md:p-7 shadow-xl overflow-hidden ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ff4f8b]/20 blur-2xl pointer-events-none" />

      <div
        className={`mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/65 ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a45]" />
        {item.year}
      </div>

      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
        {item.title}
      </h3>

      <p className="mt-3 text-white/70 leading-relaxed">{item.desc}</p>

      <div
        className={`mt-5 text-[11px] uppercase tracking-[0.14em] text-white/45 ${
          align === "right" ? "text-right" : "text-left"
        }`}
      >
        Milestone {(index + 1).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
