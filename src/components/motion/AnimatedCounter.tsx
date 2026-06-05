"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

interface Props {
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ to, duration = 1.2, className }: Props) {
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(reduced ? to : 0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (reduced) return;
    const controls = animate(motionValue, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [to, duration, reduced, motionValue]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
