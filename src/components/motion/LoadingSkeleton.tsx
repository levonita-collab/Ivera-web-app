interface Props {
  className?: string;
}

export function LoadingSkeleton({ className }: Props) {
  return (
    <div
      className={`animate-shimmer rounded-xl${className ? ` ${className}` : ""}`}
      style={{ background: "rgba(255,255,255,0.04)" }}
    />
  );
}
