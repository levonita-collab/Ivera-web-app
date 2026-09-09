"use client";

import { useEffect, useRef } from "react";

export interface BackdropPalette {
  a: string;
  b: string;
  c: string;
}

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgba([r, g, b]: Rgb, alpha: number) {
  return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
}

// Abstract, cursor-reactive backdrop: three slow-drifting colour fields and a
// thin gold wireframe torus, drawn on a 2D canvas. Reads as a shader/3D scene
// without a WebGL dependency; palette and torus pose cross-fade per slide.
export default function AbstractBackdrop({
  palette,
  seed,
  reduced,
}: {
  palette: BackdropPalette;
  seed: number;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef({ palette, seed });

  useEffect(() => {
    target.current = { palette, seed };
  }, [palette, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let cur: [Rgb, Rgb, Rgb] = [
      hexToRgb(target.current.palette.a),
      hexToRgb(target.current.palette.b),
      hexToRgb(target.current.palette.c),
    ];
    let curSeed = target.current.seed;

    const drawTorus = (time: number, px: number, py: number) => {
      const R = Math.min(w, h) * 0.3;
      const r = R * 0.42;
      const f = 900;
      const rotX = 1.15 + py * 0.22 + Math.sin(time * 0.1) * 0.05;
      const rotY = time * 0.12 + px * 0.35 + curSeed * 0.9;
      const cx = w / 2 + px * 14;
      const cy = h * 0.5 + py * 10;

      const U = 28;
      const V = 40;
      const project = (u: number, v: number) => {
        const x0 = (R + r * Math.cos(v)) * Math.cos(u);
        const y0 = (R + r * Math.cos(v)) * Math.sin(u);
        const z0 = r * Math.sin(v);
        // rotate around Y then X
        const x1 = x0 * Math.cos(rotY) + z0 * Math.sin(rotY);
        const z1 = -x0 * Math.sin(rotY) + z0 * Math.cos(rotY);
        const y2 = y0 * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y0 * Math.sin(rotX) + z1 * Math.cos(rotX);
        const s = f / (f + z2);
        return { x: cx + x1 * s, y: cy + y2 * s, z: z2 };
      };

      ctx.lineWidth = 1;
      // rings around the tube
      for (let i = 0; i < U; i++) {
        const u = (i / U) * Math.PI * 2;
        let depth = 0;
        ctx.beginPath();
        for (let j = 0; j <= V; j++) {
          const p = project(u, (j / V) * Math.PI * 2);
          depth += p.z;
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const d = depth / (V + 1) / r; // roughly -1..1
        ctx.strokeStyle = `rgba(228,200,120,${0.08 + (1 - (d + 1) / 2) * 0.22})`;
        ctx.stroke();
      }
      // lines along the tube
      for (let j = 0; j < V; j += 2) {
        const v = (j / V) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i <= U; i++) {
          const p = project((i / U) * Math.PI * 2, v);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(228,200,120,0.07)";
        ctx.stroke();
      }
    };

    const draw = (t: number) => {
      const time = t / 1000;
      eased.x += (pointer.x - eased.x) * 0.04;
      eased.y += (pointer.y - eased.y) * 0.04;

      const tp = target.current;
      const goal: [Rgb, Rgb, Rgb] = [hexToRgb(tp.palette.a), hexToRgb(tp.palette.b), hexToRgb(tp.palette.c)];
      cur = [lerpRgb(cur[0], goal[0], 0.03), lerpRgb(cur[1], goal[1], 0.03), lerpRgb(cur[2], goal[2], 0.03)];
      curSeed += (tp.seed - curSeed) * 0.03;

      ctx.fillStyle = "#0A0805";
      ctx.fillRect(0, 0, w, h);

      const fields = [
        { x: 0.22, y: 0.32, r: 0.62, c: cur[0], ph: 0.0, a: 0.75 },
        { x: 0.78, y: 0.58, r: 0.66, c: cur[1], ph: 2.1, a: 0.5 },
        { x: 0.5, y: 0.92, r: 0.58, c: cur[2], ph: 4.2, a: 0.65 },
      ];
      for (const b of fields) {
        const cx = (b.x + Math.sin(time * 0.13 + b.ph) * 0.07 + eased.x * 0.05) * w;
        const cy = (b.y + Math.cos(time * 0.11 + b.ph) * 0.06 + eased.y * 0.04) * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, rgba(b.c, b.a));
        g.addColorStop(0.55, rgba(b.c, b.a * 0.25));
        g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      drawTorus(time, eased.x, eased.y);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" />;
}
