"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const instruments = [
  {
    title: "16 Whitepapers",
    desc: "Sector-based applications across 16 industries.",
  },
  {
    title: "Social Earnings Ratio®",
    desc: "Measurement framework for intangible value.",
  },
  {
    title: "Financial Token",
    desc: "Exchange-compatible public participation layer.",
  },
  {
    title: "Non-Financial Token",
    desc: "Soft asset, benefit-based participation layer.",
  },
  {
    title: "iPhone & Android App",
    desc: "Unified ecosystem participation interface.",
  },
  {
    title: "Genealogy of Values",
    desc: "Mapping belief systems into measurable participation.",
  },
];

export default function InstrumentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20">
      <SiteHeader currentPath="/instruments" />

      <div className="px-6 lg:px-24 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Instruments
            </h1>
            <p className="text-slate-600 text-lg">
              The architecture behind Intangible Real World Assets.
            </p>

            <Link
              href="/"
              className="inline-block mt-4 text-indigo-600 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {instruments.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-slate-600 mt-3">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </div>
      <SiteFooter currentPath="/instruments" />
    </main>
  );
}
