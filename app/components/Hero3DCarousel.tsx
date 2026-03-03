"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Mouse = { x: number; y: number };

const items = [
  { label: "National Treasures", img: "/assets/Persistence.jpeg" },
  { label: "Our Love with Coffee", img: "/assets/bean-you.jpg" },
  { label: "Island Culture", img: "/assets/4bc9574431d9787ae40236108382b161a5adf868.png" },
  { label: "Future of Transport", img: "/assets/ev-mineral.jpg" },
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

                <Image src={item.img} alt={item.label} fill className="object-cover opacity-90" />

                {/* Gloss reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${50 + mouse.x}% ${50 + mouse.y}%, rgba(255,255,255,0.3), transparent 60%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-sm font-semibold shimmer-text">
                    {item.label}
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