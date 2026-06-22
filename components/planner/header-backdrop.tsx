interface HeaderBackdropProps {
  variant?: "hero" | "compact";
}

/** Blurred Karbala scene — keeps dua text prominent via overlay. */
export function HeaderBackdrop({ variant = "hero" }: HeaderBackdropProps) {
  const isHero = variant === "hero";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 scale-110 bg-cover bg-center ${
          isHero ? "blur-[6px] md:blur-md" : "blur-md"
        }`}
        style={{ backgroundImage: "url(/background.png)" }}
      />
      <div className={`absolute inset-0 ${isHero ? "bg-black/50" : "bg-black/60"}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_90%_at_50%_50%,rgba(11,15,18,0.4)_0%,transparent_72%)]" />
    </div>
  );
}
