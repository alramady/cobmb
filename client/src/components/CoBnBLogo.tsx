interface CoBnBLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  tagline?: string;
  variant?: "light" | "dark";
  className?: string;
}

const NAVBAR_LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/DfAqekLwSXcXyrEG.png";

export default function CoBnBLogo({
  size = "md",
  showText = true,
  tagline,
  variant = "light",
  className = "",
}: CoBnBLogoProps) {
  const sizes = {
    sm: { height: 28, tagSize: "text-[8px]" },
    md: { height: 36, tagSize: "text-[10px]" },
    lg: { height: 48, tagSize: "text-xs" },
  };
  const s = sizes[size];
  const tealColor = "#3ECFC0";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={NAVBAR_LOGO_URL}
        alt="CoBnB Logo"
        height={s.height}
        style={{ height: s.height, width: "auto" }}
        className="shrink-0 object-contain"
      />
      {tagline && (
        <span
          className={`${s.tagSize} font-medium leading-tight tracking-wider uppercase`}
          style={{ color: tealColor }}
        >
          {tagline}
        </span>
      )}
    </div>
  );
}
