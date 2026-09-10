/**
 * Pure canvas engine for the /experience route hero — no React/framer-motion
 * imports, so it can't accidentally re-render React on scroll or pointer
 * move. Draws (back to front): procedural Caucasus ridgelines, a dotted
 * "full route" ghost line, the "drawn" glowing route (length = scroll
 * progress), and waypoint markers that light up once the route reaches them.
 *
 * Performance: draws on demand, not on a permanent rAF loop — `set()` marks
 * state dirty and starts a short lerp loop that stops once it settles. DPR
 * capped at 2. No shadowBlur (glow is a wide, low-alpha stroke instead).
 */

export interface StagePoint {
  x: number;
  y: number;
}

export interface StageColors {
  ink: string;
  ink2: string;
  bone: string;
  route: string;
  xp: string;
}

export interface StageOptions {
  /** Normalized 0..1 waypoint coordinates, in draw order. */
  waypoints: StagePoint[];
  colors: StageColors;
  /** If true: no smoothing, no parallax, route drawn fully. */
  reducedMotion: boolean;
  smoothing?: number;
  parallaxPx?: number;
  ridgeCount?: number;
}

export interface StageState {
  /** 0..1 scroll progress through the hero. */
  progress: number;
  /** Pointer position normalized to -1..1 (0,0 = centre). */
  px: number;
  py: number;
}

export interface HeroRouteStageEngine {
  resize(): void;
  set(partial: Partial<StageState>): void;
  /** Route-length fraction (0..1) at which each waypoint is reached. */
  waypointProgress(): number[];
  destroy(): void;
}

const SEGMENTS_PER_SPAN = 40;

// Deterministic PRNG so the ridges look identical on every load.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Ridge {
  depth: number;
  baseY: number;
  ampY: number;
  freqs: number[];
  phases: number[];
  weights: number[];
}

function buildRidges(count: number): Ridge[] {
  const rnd = mulberry32(1976);
  const ridges: Ridge[] = [];
  for (let i = 0; i < count; i++) {
    const d = i / (count - 1);
    const octaves = 4;
    ridges.push({
      depth: i,
      baseY: 0.56 + d * 0.3,
      ampY: 0.035 + d * 0.045,
      freqs: Array.from({ length: octaves }, (_, k) => (0.0025 + rnd() * 0.002) * (k + 1)),
      phases: Array.from({ length: octaves }, () => rnd() * Math.PI * 2),
      weights: Array.from({ length: octaves }, (_, k) => 1 / (k + 1)),
    });
  }
  return ridges;
}

// Catmull-Rom spline -> dense polyline so lineDash can "draw on" the route.
function catmullRom(pts: StagePoint[], segments: number): StagePoint[] {
  if (pts.length < 2) return pts;
  const out: StagePoint[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function hexToRgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function createHeroRouteStage(canvas: HTMLCanvasElement, opts: StageOptions): HeroRouteStageEngine {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("2D canvas unavailable");

  const SMOOTH = opts.smoothing ?? 0.14;
  const PARALLAX = opts.parallaxPx ?? 14;
  const ridges = buildRidges(opts.ridgeCount ?? 5);

  let W = 0;
  let H = 0;
  let routePts: StagePoint[] = [];
  let routeLen = 1;
  let cumLen: number[] = [];
  let wpT: number[] = [];

  const target: StageState = { progress: opts.reducedMotion ? 1 : 0, px: 0, py: 0 };
  const cur: StageState = { ...target };
  let raf = 0;
  let running = false;
  let destroyed = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const px = opts.waypoints.map((p) => ({ x: p.x * W, y: p.y * H }));
    routePts = catmullRom(px, SEGMENTS_PER_SPAN);
    cumLen = [0];
    for (let i = 1; i < routePts.length; i++) {
      const a = routePts[i - 1];
      const b = routePts[i];
      cumLen.push(cumLen[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
    routeLen = cumLen[cumLen.length - 1] || 1;
    wpT = px.map((_, k) => (cumLen[Math.min(k * SEGMENTS_PER_SPAN, cumLen.length - 1)] ?? routeLen) / routeLen);
    draw();
  }

  function ridgeY(r: Ridge, x: number, shiftX: number): number {
    let y = 0;
    for (let k = 0; k < r.freqs.length; k++) {
      y += Math.sin((x + shiftX) * r.freqs[k] + r.phases[k]) * r.weights[k];
    }
    return y / 1.8;
  }

  function drawRidges() {
    const n = ridges.length;
    for (const r of ridges) {
      const d = r.depth / (n - 1);
      const shiftX = cur.px * PARALLAX * (0.3 + d);
      const shiftY = cur.py * PARALLAX * 0.4 * d + cur.progress * H * 0.1 * d;
      const base = r.baseY * H + shiftY;
      const amp = r.ampY * H;

      ctx!.beginPath();
      ctx!.moveTo(0, H + 2);
      for (let x = 0; x <= W + 6; x += 6) {
        ctx!.lineTo(x, base + ridgeY(r, x, shiftX) * amp);
      }
      ctx!.lineTo(W + 6, H + 2);
      ctx!.closePath();

      // Atmospheric perspective: far ridges lighter/hazier, near ones deep ink.
      ctx!.fillStyle = d < 0.5 ? hexToRgba(opts.colors.ink2, 0.55 + d * 0.5) : hexToRgba(opts.colors.ink, 0.85 + d * 0.15);
      ctx!.fill();

      ctx!.strokeStyle = hexToRgba(opts.colors.bone, 0.035 + d * 0.06);
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }
  }

  function drawRoute() {
    if (routePts.length < 2) return;
    const p = Math.max(0, Math.min(1, cur.progress));

    // Ghost path — the full mission, quiet dotted line.
    ctx!.beginPath();
    ctx!.moveTo(routePts[0].x, routePts[0].y);
    for (let i = 1; i < routePts.length; i++) ctx!.lineTo(routePts[i].x, routePts[i].y);
    ctx!.setLineDash([2, 7]);
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = hexToRgba(opts.colors.bone, 0.28);
    ctx!.lineCap = "round";
    ctx!.stroke();

    // Drawn path — wide faint glow stroke, then the crisp core line.
    if (p > 0) {
      ctx!.setLineDash([routeLen * p, routeLen]);
      ctx!.lineWidth = 12;
      ctx!.strokeStyle = hexToRgba(opts.colors.route, 0.18);
      ctx!.stroke();
      ctx!.lineWidth = 2.5;
      ctx!.strokeStyle = opts.colors.route;
      ctx!.stroke();
    }
    ctx!.setLineDash([]);

    for (let k = 0; k < opts.waypoints.length; k++) {
      const idx = Math.min(k * SEGMENTS_PER_SPAN, routePts.length - 1);
      const { x, y } = routePts[idx];
      const reached = p >= wpT[k] - 0.002;
      ctx!.beginPath();
      if (reached) {
        ctx!.fillStyle = opts.colors.route;
        ctx!.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.strokeStyle = hexToRgba(opts.colors.bone, 0.9);
        ctx!.lineWidth = 1.5;
        ctx!.arc(x, y, 8, 0, Math.PI * 2);
        ctx!.stroke();
      } else {
        ctx!.strokeStyle = hexToRgba(opts.colors.bone, 0.45);
        ctx!.lineWidth = 1.2;
        ctx!.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx!.stroke();
      }
    }

    // Route head — the "you are here" marker, in the XP/reward colour.
    if (p > 0 && p < 1) {
      const dist = routeLen * p;
      let i = 1;
      while (i < cumLen.length && cumLen[i] < dist) i++;
      const a = routePts[i - 1];
      const b = routePts[Math.min(i, routePts.length - 1)];
      const segLen = (cumLen[i] ?? routeLen) - cumLen[i - 1] || 1;
      const t = (dist - cumLen[i - 1]) / segLen;
      const hx = a.x + (b.x - a.x) * t;
      const hy = a.y + (b.y - a.y) * t;
      ctx!.beginPath();
      ctx!.fillStyle = opts.colors.xp;
      ctx!.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.strokeStyle = hexToRgba(opts.colors.xp, 0.35);
      ctx!.lineWidth = 6;
      ctx!.arc(hx, hy, 9, 0, Math.PI * 2);
      ctx!.stroke();
    }
  }

  function draw() {
    ctx!.clearRect(0, 0, W, H);
    drawRidges();
    drawRoute();
  }

  function settled() {
    return (
      Math.abs(target.progress - cur.progress) < 0.0005 &&
      Math.abs(target.px - cur.px) < 0.001 &&
      Math.abs(target.py - cur.py) < 0.001
    );
  }

  function tick() {
    if (destroyed) return;
    cur.progress += (target.progress - cur.progress) * SMOOTH;
    cur.px += (target.px - cur.px) * SMOOTH;
    cur.py += (target.py - cur.py) * SMOOTH;
    draw();
    if (settled()) {
      Object.assign(cur, target);
      draw();
      running = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function set(partial: Partial<StageState>) {
    if (opts.reducedMotion) return;
    Object.assign(target, partial);
    if (!running) {
      running = true;
      raf = requestAnimationFrame(tick);
    }
  }

  resize();

  return {
    resize,
    set,
    waypointProgress: () => wpT.slice(),
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
    },
  };
}
