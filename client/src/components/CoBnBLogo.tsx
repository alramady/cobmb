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
    sm: { iconH: 32, nameSize: "text-lg", tagSize: "text-[7px]", gap: "gap-2", borderW: 2 },
    md: { iconH: 40, nameSize: "text-xl", tagSize: "text-[8px]", gap: "gap-2.5", borderW: 2.5 },
    lg: { iconH: 56, nameSize: "text-3xl", tagSize: "text-[10px]", gap: "gap-3", borderW: 3 },
  };
  const s = sizes[size];
  const isLight = variant === "light";
  const tealColor = "#3ECFC0";
  const tagColor = isLight ? "text-white/70" : "text-[#0B1E2D]/60";

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Logo Icon - Building with teal border */}
      <div
        className="shrink-0 relative rounded-[3px] overflow-hidden"
        style={{
          width: s.iconH * 0.78,
          height: s.iconH,
          background: "#0B1E2D",
          border: `${s.borderW}px solid ${tealColor}`,
        }}
      >
        {/* Building SVG - C-shaped building with horizontal slats and chevron roof */}
        <svg
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ padding: "8% 10% 4% 10%" }}
        >
          {/* Chevron Roof */}
          <path
            d="M10 42 L50 8 L90 42"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Horizontal slats - forming the building body */}
          {/* The slats are slightly angled/perspective to create the C shape */}
          <rect x="12" y="50" width="76" height="6" rx="1" fill="white" />
          <rect x="12" y="62" width="76" height="6" rx="1" fill="white" />
          <rect x="12" y="74" width="76" height="6" rx="1" fill="white" />
          <rect x="12" y="86" width="76" height="6" rx="1" fill="white" />
          <rect x="12" y="98" width="76" height="6" rx="1" fill="white" />
          <rect x="12" y="110" width="76" height="6" rx="1" fill="white" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${s.nameSize} font-bold`}
            style={{
              color: tealColor,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.15em",
            }}
          >
            COBNB
          </span>
          <span
            className={`${s.tagSize} font-semibold tracking-[0.18em] uppercase mt-0.5 ${tagColor}`}
          >
            {tagline || "THE BNB EXPERT"}
          </span>
        </div>
      )}
    </div>
  );
}
