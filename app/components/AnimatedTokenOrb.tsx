"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AnimatedTokenOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const smoothX = useSpring(rawX, { stiffness: 30, damping: 22 });
  const smoothY = useSpring(rawY, { stiffness: 30, damping: 22 });

  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rawX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
      rawY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: 200, height: 200 }}
    >
      {/* Soft pulse rings — subtle, slow */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,39,42,0.2)",
          }}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: i * 1.6,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 140,
          height: 140,
          background:
            "radial-gradient(circle, rgba(255,39,42,0.3) 0%, rgba(255,79,139,0.1) 55%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />

      {/* Orbit ring — single, clean */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 180,
          height: 180,
          border: "1px solid rgba(255,39,42,0.18)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {/* Glowing particle on orbit */}
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            top: -4,
            left: "50%",
            marginLeft: -4,
            background: "radial-gradient(circle, #ff7a45 0%, #ff272a 100%)",
            boxShadow:
              "0 0 6px 2px rgba(255,39,42,0.7), 0 0 12px rgba(255,100,50,0.4)",
          }}
        />
      </motion.div>

      {/* The sphere — float + cursor tilt */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 600,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Floating shadow underneath */}
        <motion.div
          animate={{ scaleX: [1, 0.82, 1], opacity: [0.4, 0.18, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 16,
            borderRadius: "50%",
            background: "rgba(200,31,52,0.4)",
            filter: "blur(10px)",
          }}
        />

        {/* Sphere base */}
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: "50%",
            position: "relative",
            /* Sphere lighting: light source top-left */
            background:
              "radial-gradient(circle at 36% 30%, #ff8c7a 0%, #ff272a 32%, #bf1020 62%, #7a0810 84%, #420308 100%)",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.1), 0 0 32px rgba(255,39,42,0.6), 0 0 64px rgba(255,39,42,0.25), 0 16px 32px rgba(0,0,0,0.35)",
          }}
        >
          {/* Top-left specular highlight */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 25%, transparent 48%)",
            }}
          />

          {/* Warm rim light bottom-right */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 70% 74%, rgba(255,120,50,0.32) 0%, transparent 48%)",
            }}
          />

          {/* "i" lettermark */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.92)",
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 0 16px rgba(255,255,255,0.5)",
                userSelect: "none",
              }}
            >
              i
            </span>
          </div>
        </div>
      </motion.div>

      {/* "Belief Token" label */}
      <motion.p
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 2,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(200,31,52,0.65)",
        }}
      >
        Belief Token
      </motion.p>
    </div>
  );
}
