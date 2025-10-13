import Image from "next/image";

export function Logo({ 
  variant = "wordmark", 
  colored = false, 
  width, 
  height, 
  className = "", 
  priority = false 
}) {
  const getLogoPath = () => {
    if (variant === "symbol") {
      return colored ? "/logo/techterview_symbol_colored.png" : "/logo/techterview_symbol.png";
    }
    return colored ? "/logo/techterview_wordmark_colored.png" : "/logo/techterview_wordmark.png";
  };

  const getDefaultDimensions = () => {
    if (variant === "symbol") {
      return { width: 60, height: 60 };
    }
    return { width: 283, height: 53 };
  };

  const dimensions = getDefaultDimensions();

  return (
    <Image
      src={getLogoPath()}
      alt="TechTerview"
      width={width || dimensions.width}
      height={height || dimensions.height}
      priority={priority}
      className={className}
    />
  );
}

export default Logo;