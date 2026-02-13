interface CoBnBLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  tagline?: string;
  variant?: "light" | "dark";
  className?: string;
}

// Full official CoBnB logos (building icon + COBNB text + THE BNB EXPERT tagline)
// Light variant = white text on transparent bg (for dark backgrounds like navbar/footer)
// Dark variant = navy text on transparent bg (for light backgrounds)
const LOGOS = {
  light: {
    sm: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/wqyNCAMWYsXAXRhM.png",
    md: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/YiTkFBdhjilbytGQ.png",
    lg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/XchoLUDzCNuhOQpz.png",
  },
  dark: {
    sm: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/CAlKkZcKrfMyQVLe.png",
    md: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/phkoLHevGstNHEzY.png",
    lg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/pfGdpPobbMQjLleW.png",
  },
};

const HEIGHTS = {
  sm: 44,
  md: 56,
  lg: 80,
};

export default function CoBnBLogo({
  size = "md",
  variant = "light",
  className = "",
}: CoBnBLogoProps) {
  const src = LOGOS[variant][size];
  const h = HEIGHTS[size];

  return (
    <img
      src={src}
      alt="CoBnB - The BNB Expert"
      className={`shrink-0 object-contain ${className}`}
      style={{ height: h }}
      draggable={false}
    />
  );
}
