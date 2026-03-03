"use client";

import { motion, useReducedMotion } from "framer-motion";

const TIMELINE = [
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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function EvolutionPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-[#070b14] text-white min-h-screen overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 lg:px-24 py-24">

        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e293b,transparent_40%),radial-gradient(circle_at_80%_70%,#4f46e5,transparent_35%)] opacity-40" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.9 }}
          className="relative max-w-4xl mx-auto text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            15 Years of Measuring the
            <span className="block bg-gradient-to-r from-indigo-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Intangible
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            From academic research to tokenized connection economies —
            the evolution of measurable belief.
          </p>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="relative px-6 md:px-12 lg:px-24 py-20">

        <div className="max-w-6xl mx-auto relative">

          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-white/30 to-transparent h-full hidden md:block" />

          <div className="space-y-20 md:space-y-28">

            {TIMELINE.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{
                    duration: reduceMotion ? 0 : 0.8,
                    delay: reduceMotion ? 0 : index * 0.05,
                  }}
                  className="relative flex flex-col md:flex-row items-center md:items-start"
                >

                  {/* Desktop Left */}
                  <div
                    className={`hidden md:block w-1/2 ${
                      isLeft ? "pr-16 text-right" : "order-2 pl-16 text-left"
                    }`}
                  >
                    {isLeft && (
                      <TimelineCard item={item} />
                    )}
                  </div>

                  {/* Center Dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#ff272a] shadow-lg shadow-red-500/40 ring-4 ring-white/10" />
                  </div>

                  {/* Desktop Right */}
                  <div
                    className={`hidden md:block w-1/2 ${
                      isLeft ? "order-2 pl-16 text-left" : "pr-16 text-right"
                    }`}
                  >
                    {!isLeft && (
                      <TimelineCard item={item} />
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden mt-8 w-full">
                    <TimelineCard item={item} />
                  </div>

                </motion.div>
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
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            From Measurement to Instruments
          </h2>

          <p className="text-white/60 text-lg">
            The evolution continues through our tools, metrics, tokens, and
            digital infrastructure.
          </p>

          <a
            href="/instruments"
            className="inline-flex items-center justify-center rounded-2xl bg-[#ff272a] px-8 py-4 font-semibold text-white shadow-lg hover:shadow-red-500/30 transition"
          >
            Explore Our Instruments →
          </a>
        </motion.div>
      </section>
    </div>
  );
}

function TimelineCard({ item }: { item: any }) {
  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 shadow-xl hover:shadow-2xl transition">

      <div className="text-sm uppercase tracking-widest text-white/40 mb-2">
        {item.year}
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-3">
        {item.title}
      </h3>

      <p className="text-white/70 leading-relaxed">
        {item.desc}
      </p>

      {/* Subtle glow accent */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-pink-500/0 to-red-500/0 hover:from-indigo-500/10 hover:via-pink-500/10 hover:to-red-500/10 transition pointer-events-none" />
    </div>
  );
}