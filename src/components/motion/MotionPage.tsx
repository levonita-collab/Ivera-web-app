"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function MotionPage({ children, className }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={pageVariants}
      initial={reduced ? false : "hidden"}
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}
