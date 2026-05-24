import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary: "bg-brand-gold text-brand-black hover:bg-brand-gold-light active:scale-95",
    secondary: "bg-brand-dark text-brand-cream border border-brand-gold/30 hover:border-brand-gold active:scale-95",
    ghost: "text-brand-gold border border-brand-gold/40 hover:bg-brand-gold/10 active:scale-95",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BA5A] active:scale-95",
  };

  const sizes: Record<string, string> = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
