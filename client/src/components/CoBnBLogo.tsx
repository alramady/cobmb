interface CoBnBLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  tagline?: string;
  variant?: "light" | "dark";
  className?: string;
}

// Official CoBnB logo icon - cropped building icon from the official logo (transparent bg)
const ICON_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/WodaVfwJukhsSIyD.png";

export default function CoBnBLogo({
  size = "md",
  showText = true,
  tagline,
  variant = "light",
  className = "",
}: CoBnBLogoProps) {
  const sizes = {
    sm: { iconH: 32, nameSize: "text-lg", tagSize: "text-[7px]", gap: "gap-2" },
    md: { iconH: 40, nameSize: "text-xl", tagSize: "text-[8px]", gap: "gap-2.5" },
    lg: { iconH: 56, nameSize: "text-3xl", tagSize: "text-[10px]", gap: "gap-3" },
  };
  const s = sizes[size];
  const isLight = variant === "light";
  const tealColor = "#3ECFC0";
  const tagColor = isLight ? "text-white/70" : "text-[#0B1E2D]/60";

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Official CoBnB building icon */}
      <img
        src={ICON_URL}
        alt="CoBnB"
        className="shrink-0 object-contain"
        style={{ height: s.iconH }}
        draggable={false}
      />

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
