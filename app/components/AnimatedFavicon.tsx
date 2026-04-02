"use client";

import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    let frame = 0;
    let tick = 0;
    let animId: number;

    // Create a dedicated favicon link so we don't clash with the .ico
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);

    function rr(x: number, y: number, w: number, h: number, r: number) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    }

    function draw() {
      animId = requestAnimationFrame(draw);
      tick++;
      if (tick % 2 !== 0) return; // throttle to ~30fps

      c.clearRect(0, 0, 32, 32);

      // Rotating gradient angle — full rotation every ~6 seconds
      const angle = (frame / 180) * Math.PI * 2;
      const cx = 16, cy = 16, rd = 22;

      const grad = c.createLinearGradient(
        cx + Math.cos(angle) * rd,
        cy + Math.sin(angle) * rd,
        cx - Math.cos(angle) * rd,
        cy - Math.sin(angle) * rd,
      );
      grad.addColorStop(0, "#D42B27");
      grad.addColorStop(0.5, "#7B4B9E");
      grad.addColorStop(1, "#4E83B8");

      // Dark rounded background
      rr(0, 0, 32, 32, 7);
      c.fillStyle = "#070b14";
      c.fill();

      // Gradient glow layer
      rr(1, 1, 30, 30, 6);
      c.fillStyle = grad;
      c.fill();

      // Subtle dark overlay so it doesn't look flat
      rr(1, 1, 30, 30, 6);
      c.fillStyle = "rgba(7,11,20,0.35)";
      c.fill();

      // "i" dot
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(16, 8.5, 3.2, 0, Math.PI * 2);
      c.fill();

      // "i" stem
      c.fillStyle = "#ffffff";
      rr(12.5, 14, 7, 12, 2.5);
      c.fill();

      link.href = canvas.toDataURL("image/png");
      frame = (frame + 1) % 180;
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
