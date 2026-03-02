"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const items = [
  { label: "National Treasures", img: "/assets/dali.jpg" },
  { label: "Our Love with Coffee", img: "/assets/coffee.jpg" },
  { label: "Island Culture", img: "/assets/zut-island.jpg" },
  { label: "Future of Transport", img: "/assets/ev-car.jpg" },
  { label: "Petroleum Fields", img: "/assets/oil-field.jpg" },
  { label: "Natural Ecosystem", img: "/assets/jungle.jpg" },
  { label: "Spiritual Journeys", img: "/assets/camino.jpg" },
  { label: "Aged Assets", img: "/assets/whiskey.jpg" },
];
type MousePosition = { x: number; y: number };

export default function Hero3DCarousel({
  mouse = { x: 0, y: 0 },
}: {
  mouse?: MousePosition;
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => r + 360 / items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center perspective-[1400px]">
      <motion.div
  animate={{
    rotateY: rotation + mouse.x * 0.5,
    rotateX: -mouse.y * 0.4,
  }}
  transition={{ type: "spring", stiffness: 30 }}
  className="relative w-[320px] h-[320px] transform-style-preserve-3d"
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
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  className="object-cover opacity-90"
                />

                {/* AI shimmer label */}
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="relative text-sm font-semibold shimmer-text">
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