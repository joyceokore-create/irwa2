"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CarouselItem {
  title: string;
  subtitle: string;
  metric: string;
  img: string | null;
  fallback?: string;
}

const items: CarouselItem[] = [
  { title: "BeanYou", subtitle: "Coffee participation economy", metric: "ESG · Retail", img: "/assets/bean-you.jpg" },
  { title: "Dalí", subtitle: "Art & cultural heritage", metric: "Belief Economy", img: "/assets/Persistence.jpeg" },
  { title: "Zut Island", subtitle: "Mediterranean olive & wellbeing", metric: "Peace Economy", img: "/assets/Zut.webp" },
  { title: "EV Minerals", subtitle: "Ethical mineral sourcing", metric: "Energy Transition", img: "/assets/ev-mineral.jpg" },
  { title: "Rewilding", subtitle: "Biodiversity & natural capital", metric: "Environmental", img: "/assets/a66a47c36d7207e9df02414e897290bdf14b3310.png" },
  { title: "Pilgrimage Routes", subtitle: "Sacred journeys & community", metric: "Faith Economy", img: "/assets/3e0a9eba5cdbf6d1876eea47493c5b5cd61c5c83.png" },
  { title: "Healthcare Impact", subtitle: "Community health outcomes", metric: "Social Capital", img: null, fallback: "linear-gradient(135deg, #6ee7b7 0%, #10b981 60%, #059669 100%)" },
  { title: "Education Equity", subtitle: "Knowledge as community capital", metric: "Social Impact", img: "/assets/d359ba6ab683bc4be7edb87e78636e29103ae855.png" },
];

const VISIBLE_SIDE_CARDS = 2;

function getSignedDistance(index: number, activeIndex: number, total: number) {
  const wrapped = (index - activeIndex + total) % total;
  return wrapped > total / 2 ? wrapped - total : wrapped;
}

export default function Hero3DCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    const onLeave = () => setMouse({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] h-[280px] sm:h-[320px] md:h-[340px] lg:h-[380px] mx-auto [perspective:1600px]"
    >
      <motion.div
        animate={{
          rotateY: mouse.x * 0.08,
          rotateX: -mouse.y * 0.08,
        }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => {
          const distance = getSignedDistance(i, activeIndex, items.length);
          const absDistance = Math.abs(distance);

          if (absDistance > VISIBLE_SIDE_CARDS) return null;

          const translateX = distance * 46;
          const translateZ = 220 - absDistance * 95;
          const rotateY = -distance * 26;
          const scale = 1 - absDistance * 0.1;
          const opacity = absDistance === 0 ? 1 : absDistance === 1 ? 0.82 : 0.52;

          return (
            <div
              key={i}
              className="absolute inset-0 transition-[transform,opacity] duration-700 ease-out"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 30 - absDistance,
                transformStyle: "preserve-3d",
                pointerEvents: absDistance === 0 ? "auto" : "none",
              }}
            >
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {item.img ? (
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 340px, 380px"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: item.fallback ?? "#e2e8f0" }}
                  >
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%)] bg-[size:20px_20px]" />
                    <div className="absolute bottom-16 left-0 right-0 flex justify-center">
                      <span className="text-white/50 text-xs font-medium tracking-wide uppercase">Image placeholder</span>
                    </div>
                  </div>
                )}

                {/* Gloss reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${50 + mouse.x}% ${50 + mouse.y}%, rgba(255,255,255,0.3), transparent 60%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

                <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold shimmer-text">
                      {item.title}
                    </div>
                    <div className="text-xs text-white/70">
                      {item.subtitle}
                    </div>
                    <div className="text-xs text-indigo-300 font-medium">
                      {item.metric}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
