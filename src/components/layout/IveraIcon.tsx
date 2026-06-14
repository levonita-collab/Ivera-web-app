interface IveraIconProps {
  size?: number;
  className?: string;
  darkBg?: boolean;
  ariaLabel?: string;
}

export default function IveraIcon({ size = 32, className = "", darkBg = false, ariaLabel = "Ivera logo mark" }: IveraIconProps) {
  const letterColor = darkBg ? "#FFFFFF" : "#0F0C07";
  const goldColor = "#C4923A";

  return (
    <svg
      width={size}
      height={Math.round(size * 1.4)}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
    >
      {/* Gold dot — the dotted İ */}
      <circle cx="20" cy="5" r="4" fill={goldColor} />
      {/* Top serif bar */}
      <rect x="9" y="12" width="22" height="3.5" rx="1" fill={letterColor} />
      {/* Main vertical stroke */}
      <rect x="17" y="15.5" width="6" height="24" fill={letterColor} />
      {/* Bottom serif bar */}
      <rect x="9" y="39.5" width="22" height="3.5" rx="1" fill={letterColor} />
      {/* Gold arch — gateway symbol */}
      <path
        d="M15 43 C15 37.5 25 37.5 25 43"
        stroke={goldColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
