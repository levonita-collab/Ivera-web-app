"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionCard({ children, className, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, ease: "easeOut", delay }}
      whileHover={reduced ? {} : { y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
      whileTap={reduced ? {} : { scale: 0.985, transition: { duration: 0.1 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
