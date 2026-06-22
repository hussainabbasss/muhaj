"use client";

import { ArabicDuaHeader } from "./arabic-dua-header";
import { HeaderBackdrop } from "./header-backdrop";

export function GlobalHeader() {
  return (
    <header className="relative sticky top-0 z-30 overflow-hidden border-b border-white/[0.06] md:hidden">
      <HeaderBackdrop variant="compact" />
      <div className="relative z-10 px-3 py-3">
        <ArabicDuaHeader size="compact" />
      </div>
    </header>
  );
}
