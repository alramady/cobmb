interface CoBnBLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  tagline?: string;
  variant?: "light" | "dark";
  className?: string;
}

export default function CoBnBLogo({
  size = "md",
  showText = true,
  tagline,
  variant = "light",
  className = "",
}: CoBnBLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-base", tag: "text-[8px]" },
    md: { icon: 36, text: "text-lg", tag: "text-[10px]" },
    lg: { icon: 48, text: "text-2xl", tag: "text-xs" },
  };

  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-[#0B1E2D]";
  const tealColor = "#3ECFC0";
  const darkColor = "#0B1E2D";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Building inside teal-bordered square */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer teal border */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="4"
          stroke={tealColor}
          strokeWidth="2"
          fill={darkColor}
        />
        {/* Building roof / chevron */}
        <path
          d="M24 8L36 18H12L24 8Z"
          fill="white"
          opacity="0.95"
        />
        {/* Building body - horizontal lines representing floors */}
        <rect x="14" y="20" width="20" height="2.5" rx="0.5" fill="white" opacity="0.9" />
        <rect x="14" y="24.5" width="20" height="2.5" rx="0.5" fill="white" opacity="0.8" />
        <rect x="14" y="29" width="20" height="2.5" rx="0.5" fill="white" opacity="0.7" />
        <rect x="14" y="33.5" width="20" height="2.5" rx="0.5" fill="white" opacity="0.6" />
        <rect x="14" y="38" width="20" height="2.5" rx="0.5" fill="white" opacity="0.5" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textColor} font-bold ${s.text} tracking-tight leading-tight`}>
            CoBnB
          </span>
          {tagline && (
            <span className={`text-[${tealColor}] ${s.tag} font-medium leading-tight tracking-wider uppercase`} style={{ color: tealColor }}>
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
