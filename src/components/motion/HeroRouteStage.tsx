"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { createHeroRouteStage, type HeroRouteStageEngine, type StageColors, type StagePoint } from "./heroRoute.engine";

export interface RouteWaypoint {
  id: string;
  label: string;
  /** Shown under the label — real XP or "start"/"finish" copy. */
  meta: string;
  /** If set, the label links through to the real tour page. */
  href?: string;
  x: number;
  y: number;
  mobile?: { x: number; y: number };
}

interface Props {
  progress: MotionValue<number>;
  waypoints: RouteWaypoint[];
  colors: StageColors;
  isMobile: boolean;
  reduced: boolean;
  /** Waypoint indices to keep labelled on phones (dots always show). */
  labelOnMobile: number[];
}

export default function HeroRouteStage({ progress, waypoints, colors, isMobile, reduced, labelOnMobile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HeroRouteStageEngine | null>(null);
  const [thresholds, setThresholds] = useState<number[]>(() => waypoints.map((_, i) => i / (waypoints.length - 1)));

  const points: StagePoint[] = waypoints.map((w) => (isMobile && w.mobile ? w.mobile : { x: w.x, y: w.y }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createHeroRouteStage(canvas, {
      waypoints: points,
      colors,
      reducedMotion: reduced,
    });
    engineRef.current = engine;
    setThresholds(engine.waypointProgress());

    engine.set({ progress: progress.get() });
    const unsub = progress.on("change", (v) => engine.set({ progress: v }));

    const ro = new ResizeObserver(() => {
      engine.resize();
      setThresholds(engine.waypointProgress());
    });
    ro.observe(canvas);

    let onMove: ((e: PointerEvent) => void) | null = null;
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        engine.set({
          px: ((e.clientX - r.left) / r.width) * 2 - 1,
          py: ((e.clientY - r.top) / r.height) * 2 - 1,
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      unsub();
      ro.disconnect();
      if (onMove) window.removeEventListener("pointermove", onMove);
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, reduced, progress]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {waypoints.map((w, i) => (
        <WaypointLabel
          key={w.id}
          waypoint={w}
          point={points[i]}
          progress={progress}
          threshold={thresholds[i] ?? 1}
          reduced={reduced}
          colors={colors}
          side={i % 2 === 0 ? "below" : "above"}
          hideOnMobile={isMobile && !labelOnMobile.includes(i)}
        />
      ))}
    </div>
  );
}

function WaypointLabel({
  waypoint,
  point,
  progress,
  threshold,
  reduced,
  colors,
  side,
  hideOnMobile,
}: {
  waypoint: RouteWaypoint;
  point: StagePoint;
  progress: MotionValue<number>;
  threshold: number;
  reduced: boolean;
  colors: StageColors;
  side: "above" | "below";
  hideOnMobile: boolean;
}) {
  // Framer Motion binds a `useTransform(scrollYProgress, ...)` value to a
  // native WAAPI ScrollTimeline where possible, which requires its keyframe
  // offsets to stay within [0, 1] — `progress` itself never leaves that
  // range. threshold ± the reveal window can, for the first/last waypoint,
  // so clamp it or the browser throws "offsets must be monotonically
  // non-decreasing" the moment this mounts.
  const revealStart = Math.max(0, threshold - 0.02);
  const revealEnd = Math.min(1, threshold + 0.05);
  const opacity = useTransform(progress, [revealStart, revealEnd], [0, 1]);
  const rise = useTransform(progress, [revealStart, revealEnd], [6, 0]);

  if (hideOnMobile) return null;

  // Three layers on purpose: framer-motion takes over the `transform` CSS
  // property on any element where it manages `x`/`y` as motion values, so a
  // manual `transform: translate(...)` string on that same element fights
  // it and can produce invalid animation keyframes. Static position (left/
  // top) and static centering (the translate string) each get their own
  // plain element; only the innermost motion.div animates.
  const posStyle: CSSProperties = { left: `${point.x * 100}%`, top: `${point.y * 100}%` };
  const centerStyle: CSSProperties = {
    transform: side === "above" ? "translate(-50%, calc(-100% - 16px))" : "translate(-50%, 16px)",
  };

  const labelBody = (
    <>
      <div className="text-[13px] font-semibold leading-tight" style={{ color: colors.bone }}>
        {waypoint.label}
      </div>
      <div className="text-[10px] uppercase tracking-wider leading-tight mt-0.5" style={{ color: colors.xp }}>
        {waypoint.meta}
      </div>
    </>
  );

  return (
    <div className="pointer-events-none absolute whitespace-nowrap text-center" style={posStyle}>
    <div style={centerStyle}>
    <motion.div style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : rise }}>
      {waypoint.href ? (
        <Link href={waypoint.href} className="pointer-events-auto block">
          {labelBody}
        </Link>
      ) : (
        labelBody
      )}
    </motion.div>
    </div>
    </div>
  );
}
