"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Mouse = { x: number; y: number };

const items = [
  {
    title: "National Treasures",
    subtitle: "Cultural belief economies",
    metric: "Live pilot",
    img: "/assets/Persistence.jpeg",
  },
  {
    title: "Bean You",
    subtitle: "Coffee-backed emotional value",
    metric: "15,000+ acres",
    img: "/assets/bean-you.jpg",
  },
  {
    title: "Zut Island",
    subtitle: "Meditation & olive ecosystems",
    metric: "Croatia",
    img: "/assets/4bc9574431d9787ae40236108382b161a5adf868.png",
  },
  {
    title: "EV Minerals",
    subtitle: "Ethical sourcing layer",
    metric: "770,400 km²",
    img: "/assets/ev-mineral.jpg",
  },
];

export default function Hero3DCarousel({
  mouse = { x: 0, y: 0 },
}: {
  mouse?: Mouse;
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setRotation((r) => r + 360 / items.length);
    }, 3500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[380px] h-[280px] sm:h-[320px] md:h-[340px] lg:h-[380px] perspective-[1400px] mx-auto lg:mx-0">
      <motion.div
        animate={{
          rotateY: rotation + mouse.x * 0.4,
          rotateX: -mouse.y * 0.3,
        }}
        transition={{ type: "spring", stiffness: 30 }}
        className="relative w-full h-full transform-style-preserve-3d"
      >
        {items.map((item, i) => {
          const angle = (360 / items.length) * i;

          return (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotateY(${angle}deg) translateZ(420px)`,
              }}
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover opacity-90"
                />

                {/* Gloss reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${50 + mouse.x}% ${50 + mouse.y}%, rgba(255,255,255,0.3), transparent 60%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">
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
