import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export default function Card({
  glass = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const base = "rounded-2xl overflow-hidden";
  const style = glass
    ? "bg-brand-dark/80 backdrop-blur-md border border-brand-gold/20"
    : "bg-brand-dark border border-white/5";

  return (
    <div className={`${base} ${style} ${className}`} {...props}>
      {children}
    </div>
  );
}
