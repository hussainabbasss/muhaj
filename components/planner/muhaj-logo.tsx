import Image from "next/image";

interface MuhajLogoProps {
  size?: "compact" | "sidebar";
}

export function MuhajLogo({ size = "sidebar" }: MuhajLogoProps) {
  const height = size === "compact" ? 36 : 56;

  return (
    <Image
      src="/logo.png"
      alt="Muhaj — The heart's last blood"
      width={height * 4}
      height={height}
      className="h-auto w-auto object-contain"
      style={{ height, width: "auto" }}
      priority
    />
  );
}
