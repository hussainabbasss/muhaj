import { ArabicDuaHeader } from "./arabic-dua-header";
import { HeaderBackdrop } from "./header-backdrop";

export function HeroBanner() {
  return (
    <div className="relative shrink-0 overflow-hidden border-b border-white/[0.06]">
      <HeaderBackdrop variant="hero" />

      <div className="relative z-10 mx-auto flex w-full items-center justify-center px-4 py-6 md:px-5 md:py-8">
        <ArabicDuaHeader size="hero" />
      </div>
    </div>
  );
}
