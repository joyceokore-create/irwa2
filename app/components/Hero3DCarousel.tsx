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
  { title: "BeanYou", subtitle: "Coffee participation economy", metric: "ESG · Retail", img: "/assets/beanyou.jpg" },
  { title: "Dalí", subtitle: "Art & cultural heritage", metric: "Belief Economy", img: "/assets/meltingclocks.png" },
  { title: "Zut Island", subtitle: "Mediterranean olive & wellbeing", metric: "Peace Economy", img: "/assets/Zut.webp", fallback: "linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 60%, #0369a1 100%)" },
  { title: "EV Minerals", subtitle: "Children mining so we can drive clean", metric: "Modern Slavery", img: "/assets/ev modern slavery.png" },
  { title: "Rewilding", subtitle: "Biodiversity & natural capital", metric: "Environmental", img: "/assets/Rewilding.png" },
  { title: "Pilgrimage Routes", subtitle: "Sacred journeys & community", metric: "Faith Economy", img: "/assets/Pilgrimage.jpg" },
  { title: "Healthcare Impact", subtitle: "Community health outcomes", metric: "Social Capital", img: "/assets/healthcare.png" },
  { title: "Education Equity", subtitle: "Knowledge as community capital", metric: "Social Impact", img: "/assets/Education.png" },
  { title: "Ancient Forests", subtitle: "The lungs of civilisation", metric: "Carbon Capital", img: "/assets/Ancient forest.jpeg" },
  { title: "Bees", subtitle: "Nature's most critical workforce", metric: "Pollination Economy", img: "/assets/bees.jpg" },
  { title: "Petroleum", subtitle: "Black gold beneath our feet", metric: "Energy Heritage", img: "/assets/petroleum.jpg" },
  { title: "Formula 1", subtitle: "Speed, passion & global fandom", metric: "Motorsport Culture", img: "/assets/F1.jpg" },
  { title: "Carnival", subtitle: "The world's greatest collective joy", metric: "Cultural Expression", img: "/assets/Carnival.png" },
  { title: "Kaaba · Mecca", subtitle: "The most visited place on earth", metric: "Faith Economy", img: "/assets/Kaaba.jpeg" },
  { title: "The Beautiful Game", subtitle: "Where nations hold their breath", metric: "Sports Passion", img: "/assets/Football.jpg" },
  { title: "Music Venues", subtitle: "Where sound becomes memory", metric: "Live Experience", img: "/assets/Music Venue.jpg" },
  { title: "Gold Mines", subtitle: "Ancient wealth hidden in plain sight", metric: "Mineral Heritage", img: "/assets/Gold.jpg" },
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
          const isVisible = absDistance <= VISIBLE_SIDE_CARDS;

          const translateX = isVisible ? distance * 46 : 0;
          const translateZ = isVisible ? 220 - absDistance * 95 : -300;
          const rotateY = isVisible ? -distance * 26 : 0;
          const scale = isVisible ? 1 - absDistance * 0.1 : 0.7;
          const opacity = !isVisible ? 0 : absDistance === 0 ? 1 : absDistance === 1 ? 0.82 : 0.52;

          return (
            <div
              key={i}
              className="absolute inset-0 transition-[transform,opacity] duration-700 ease-out"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: isVisible ? 30 - absDistance : 0,
                transformStyle: "preserve-3d",
                pointerEvents: absDistance === 0 ? "auto" : "none",
                visibility: isVisible ? "visible" : "hidden",
              }}
            >
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
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
                  <div className="absolute inset-0" style={{ background: item.fallback ?? "#e2e8f0" }}>
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%)] bg-[size:20px_20px]" />
                  </div>
                )}

                {/* Gloss reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${50 + mouse.x}% ${50 + mouse.y}%, rgba(255,255,255,0.18), transparent 60%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                {/* Strong bottom overlay for text legibility */}
                <div className="absolute bottom-0 w-full pt-16 pb-5 px-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <p className="text-sm font-bold text-white leading-tight drop-shadow-md">{item.title}</p>
                  <p className="text-[11px] text-white/85 mt-0.5 leading-snug drop-shadow">{item.subtitle}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                    {item.metric}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
