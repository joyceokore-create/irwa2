"use client";

import { useEffect, useRef } from "react";

type V3 = [number, number, number];

// ── Brand ────────────────────────────────────────────────────────────────────
const RED    = "#D42B27";
const PURPLE = "#7B4B9E";
const BLUE   = "#4E83B8";

// ── iRWA Project nodes ───────────────────────────────────────────────────────
const NODES = [
  { lat:  51.5, lng:  -0.1, color: RED,    city: "London",    project: "iRWA Hub",      token: "Main Token", status: "Live"   },
  { lat:  -1.3, lng:  36.8, color: BLUE,   city: "Nairobi",   project: "Bean You",      token: "BYT",        status: "Live"   },
  { lat:  41.4, lng:   2.2, color: PURPLE, city: "Barcelona", project: "Salvador Dalí", token: "DALI",       status: "Live"   },
  { lat:  59.3, lng:  18.1, color: BLUE,   city: "Stockholm", project: "SER Adoption",  token: "MCR",        status: "Active" },
  { lat:  41.9, lng:  12.5, color: RED,    city: "Vatican",   project: "God Metric",    token: "S/E Ratio",  status: "2014"   },
  { lat:  25.2, lng:  55.3, color: PURPLE, city: "Dubai",     project: "Zut Island",    token: "ZUT",        status: "Live"   },
  { lat:  40.7, lng: -74.0, color: BLUE,   city: "New York",  project: "EV Minerals",   token: "EVM",        status: "Soon"   },
];

const ARCS: [number, number][] = [[0,1],[1,2],[2,3],[0,4],[3,5],[5,6],[6,0],[1,6],[2,4]];

// ── Sphere math ──────────────────────────────────────────────────────────────
function ll(lat: number, lng: number): V3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [-(Math.sin(phi) * Math.cos(theta)), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}

function rotY([x, y, z]: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotX([x, y, z]: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function slerp(a: V3, b: V3, t: number): V3 {
  const d = Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + a[2]*b[2]));
  const o = Math.acos(d);
  if (Math.abs(o) < 1e-4) return a;
  const so = Math.sin(o);
  const s0 = Math.sin((1 - t) * o) / so;
  const s1 = Math.sin(t * o) / so;
  return [a[0]*s0 + b[0]*s1, a[1]*s0 + b[1]*s1, a[2]*s0 + b[2]*s1];
}

function hexRgb(h: string) {
  return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function EcosystemGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;
    const cv = canvas;

    let raf = 0, rot = 0, arcT = 0;
    const TILT = 0.28;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width  = window.innerWidth  * dpr;
      cv.height = window.innerHeight * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Stars
    const STARS = Array.from({ length: 240 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.45 + 0.08,
    }));

    // Fibonacci lattice dots
    const N = 300, φ = (1 + Math.sqrt(5)) / 2;
    const DOTS: V3[] = Array.from({ length: N }, (_, i) => {
      const t = Math.acos(1 - 2 * (i + .5) / N);
      const p = 2 * Math.PI * i / φ;
      return [Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t)];
    });

    const NP = NODES.map(n => ll(n.lat, n.lng));

    function xf(p: V3): V3 { return rotX(rotY(p, rot), TILT); }

    // ── Draw project card ────────────────────────────────────────────────────
    function drawCard(px: number, py: number, node: typeof NODES[0], faceAlpha: number, W: number) {
      const CW = 155, CH = 66;
      const rightSide = px < W / 2;
      const ox = rightSide ? 24 : -(CW + 24);
      const oy = -CH / 2;
      const cx = px + ox, cy = py + oy;
      const a  = Math.min(1, faceAlpha);

      // Connector line
      const lineX = rightSide ? cx : cx + CW;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(lineX, cy + CH / 2);
      c.setLineDash([3, 4]);
      c.strokeStyle = `rgba(255,255,255,${(a * 0.2).toFixed(2)})`;
      c.lineWidth = 0.8;
      c.stroke();
      c.setLineDash([]);

      // Card shadow / glow
      c.shadowColor = node.color;
      c.shadowBlur  = 16;
      rr(c, cx, cy, CW, CH, 10);
      c.fillStyle = `rgba(5,9,20,${(a * 0.88).toFixed(2)})`;
      c.fill();
      c.shadowBlur = 0;

      // Border
      rr(c, cx, cy, CW, CH, 10);
      c.strokeStyle = `rgba(${hexRgb(node.color)},${(a * 0.45).toFixed(2)})`;
      c.lineWidth = 1;
      c.stroke();

      // Top accent bar
      rr(c, cx, cy, CW, 2.5, 2);
      c.fillStyle = `rgba(${hexRgb(node.color)},${(a * 0.9).toFixed(2)})`;
      c.fill();

      // City name
      c.fillStyle = `rgba(255,255,255,${(a * 0.95).toFixed(2)})`;
      c.font = `bold 11.5px -apple-system, BlinkMacSystemFont, sans-serif`;
      c.fillText(node.city, cx + 11, cy + 20);

      // Project
      c.fillStyle = `rgba(255,255,255,${(a * 0.58).toFixed(2)})`;
      c.font = `10px -apple-system, BlinkMacSystemFont, sans-serif`;
      c.fillText(node.project, cx + 11, cy + 34);

      // Token pill
      rr(c, cx + 9, cy + 42, 76, 17, 5);
      c.fillStyle = `rgba(${hexRgb(node.color)},${(a * 0.18).toFixed(2)})`;
      c.fill();
      rr(c, cx + 9, cy + 42, 76, 17, 5);
      c.strokeStyle = `rgba(${hexRgb(node.color)},${(a * 0.5).toFixed(2)})`;
      c.lineWidth = 0.8;
      c.stroke();
      c.fillStyle = `rgba(${hexRgb(node.color)},${(a * 1).toFixed(2)})`;
      c.font = `bold 9px -apple-system, BlinkMacSystemFont, sans-serif`;
      c.fillText(node.token, cx + 16, cy + 53.5);

      // Status dot
      const sc = node.status === "Live" || node.status === "Active" ? "#22c55e"
               : node.status === "Soon" ? "#f59e0b"
               : BLUE;
      c.beginPath();
      c.arc(cx + CW - 14, cy + 51, 3.5, 0, Math.PI * 2);
      c.fillStyle = `rgba(${parseInt(sc.slice(1,3),16)},${parseInt(sc.slice(3,5),16)},${parseInt(sc.slice(5,7),16)},${(a * 0.9).toFixed(2)})`;
      c.fill();
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    function draw() {
      const W = window.innerWidth, H = window.innerHeight;
      const R = Math.min(W, H) * 0.36;
      const cx = W / 2, cy = H / 2;

      c.clearRect(0, 0, W, H);
      rot  += 0.0020;
      arcT  = (arcT + 0.0028) % 1;

      // ── Space background ─────────────────────────────────────────────────
      const bg = c.createRadialGradient(cx, cy * 0.6, 0, cx, cy, Math.max(W, H));
      bg.addColorStop(0, "#0d1529");
      bg.addColorStop(0.5, "#090e1b");
      bg.addColorStop(1, "#070b14");
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);

      // Stars
      for (const s of STARS) {
        c.beginPath();
        c.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${s.a})`;
        c.fill();
      }

      // ── Globe atmosphere ─────────────────────────────────────────────────
      const atmos = c.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.55);
      atmos.addColorStop(0,   "rgba(78,131,184,0.09)");
      atmos.addColorStop(0.4, "rgba(123,75,158,0.05)");
      atmos.addColorStop(1,   "rgba(0,0,0,0)");
      c.beginPath(); c.arc(cx, cy, R * 1.55, 0, Math.PI * 2);
      c.fillStyle = atmos; c.fill();

      // Rim glow
      const rim = c.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.02);
      rim.addColorStop(0, "rgba(78,131,184,0)");
      rim.addColorStop(0.8, "rgba(78,131,184,0.03)");
      rim.addColorStop(1, "rgba(78,131,184,0.18)");
      c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2);
      c.fillStyle = rim; c.fill();
      c.strokeStyle = "rgba(78,131,184,0.22)";
      c.lineWidth = 1.5; c.stroke();

      // ── Latitude / longitude grid ────────────────────────────────────────
      const project = (p: V3): [number, number] => [cx + p[0] * R, cy - p[1] * R];

      for (let lat = -60; lat <= 60; lat += 30) {
        c.beginPath(); let go = false;
        for (let lng = -180; lng <= 185; lng += 3) {
          const p = xf(ll(lat, lng));
          if (p[2] < 0) { go = false; continue; }
          const [px, py] = project(p);
          go ? c.lineTo(px, py) : (c.moveTo(px, py), (go = true));
        }
        c.strokeStyle = "rgba(255,255,255,0.06)"; c.lineWidth = 0.5; c.stroke();
      }
      for (let lng = 0; lng < 360; lng += 30) {
        c.beginPath(); let go = false;
        for (let lat = -90; lat <= 92; lat += 3) {
          const p = xf(ll(lat, lng));
          if (p[2] < 0) { go = false; continue; }
          const [px, py] = project(p);
          go ? c.lineTo(px, py) : (c.moveTo(px, py), (go = true));
        }
        c.strokeStyle = "rgba(255,255,255,0.06)"; c.lineWidth = 0.5; c.stroke();
      }

      // ── Surface dots ─────────────────────────────────────────────────────
      for (const d of DOTS) {
        const p = xf(d);
        if (p[2] < 0) continue;
        const [px, py] = project(p);
        const alpha = ((p[2] + 1) / 2) * 0.6;
        c.beginPath(); c.arc(px, py, 1.3, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`; c.fill();
      }

      // ── Arcs ─────────────────────────────────────────────────────────────
      const HEAD = 0.3;
      for (let ai = 0; ai < ARCS.length; ai++) {
        const [ni, nj] = ARCS[ai];
        const a = NP[ni], b = NP[nj];
        const phase  = (arcT + ai / ARCS.length) % 1;
        const aColor = NODES[ni].color;
        const STEPS  = 72;

        let prevV = false, prevX = 0, prevY = 0;
        for (let k = 0; k <= STEPS; k++) {
          const t = k / STEPS;
          const pt = xf(slerp(a, b, t));
          if (pt[2] < -0.05) { prevV = false; continue; }
          const [px, py] = project(pt);
          if (prevV) {
            // Base arc
            c.beginPath(); c.moveTo(prevX, prevY); c.lineTo(px, py);
            c.strokeStyle = "rgba(255,255,255,0.06)"; c.lineWidth = 0.6; c.stroke();
            // Comet head
            const d2 = ((phase - t + 1.5) % 1);
            if (d2 < HEAD) {
              const al = (1 - d2 / HEAD) * 0.95;
              c.beginPath(); c.moveTo(prevX, prevY); c.lineTo(px, py);
              c.strokeStyle = `rgba(${hexRgb(aColor)},${al.toFixed(2)})`;
              c.lineWidth = 2.8; c.stroke();
            }
          }
          prevX = px; prevY = py; prevV = true;
        }
      }

      // ── Project nodes + cards ────────────────────────────────────────────
      const now = Date.now();
      for (let i = 0; i < NODES.length; i++) {
        const p   = xf(NP[i]);
        if (p[2] < 0.04) continue;
        const [px, py] = project(p);
        const node  = NODES[i];
        const alpha = Math.min(1, (p[2] - 0.04) * 5);

        // Outer glow
        const grd = c.createRadialGradient(px, py, 0, px, py, 32);
        grd.addColorStop(0, `rgba(${hexRgb(node.color)},${(alpha * 0.45).toFixed(2)})`);
        grd.addColorStop(1, `rgba(${hexRgb(node.color)},0)`);
        c.beginPath(); c.arc(px, py, 32, 0, Math.PI * 2);
        c.fillStyle = grd; c.fill();

        // Pulsing ring
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.0025 + i * 1.15);
        c.beginPath(); c.arc(px, py, 7 + pulse * 8, 0, Math.PI * 2);
        c.strokeStyle = `rgba(${hexRgb(node.color)},${(alpha * 0.35).toFixed(2)})`;
        c.lineWidth = 1.5; c.stroke();

        // Core dot
        c.beginPath(); c.arc(px, py, 5.5, 0, Math.PI * 2);
        c.fillStyle = node.color; c.fill();
        c.beginPath(); c.arc(px, py, 2.5, 0, Math.PI * 2);
        c.fillStyle = "#fff"; c.fill();

        // Project card — only when node faces camera enough
        if (p[2] > 0.18) {
          drawCard(px, py, node, Math.min(1, (p[2] - 0.18) * 4.5), W);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-screen h-screen"
      style={{ zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
