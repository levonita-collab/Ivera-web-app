interface BadgeProps {
  label: string;
  variant?: "gold" | "green" | "dim";
  className?: string;
}

export default function Badge({ label, variant = "gold", className = "" }: BadgeProps) {
  const variants: Record<string, string> = {
    gold: "bg-brand-gold/15 text-brand-gold border border-brand-gold/30",
    green: "bg-green-500/15 text-green-400 border border-green-500/30",
    dim: "bg-white/5 text-brand-muted border border-white/10",
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
