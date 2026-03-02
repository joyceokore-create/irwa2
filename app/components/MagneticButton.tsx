"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function MagneticButton({ children }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: any) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current!.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const leave = () => {
    ref.current!.style.transform = `translate(0px,0px)`;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      whileTap={{ scale: 0.95 }}
      className="inline-block transition-transform duration-200"
    >
      {children}
    </motion.div>
  );
}