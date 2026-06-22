"use client";

import { formatPkr, formatUsd } from "@/lib/budget";
import type { BudgetTotals, CostFlash } from "@/lib/types";

interface BudgetFooterProps {
  totals: BudgetTotals;
  costFlash: CostFlash;
}

export function BudgetFooter({ totals, costFlash }: BudgetFooterProps) {
  const flashClass =
    costFlash === "decrease"
      ? "text-[#D4AF37] animate-pulse"
      : costFlash === "increase"
        ? "text-amber-400 animate-pulse"
        : "text-[#D4AF37]";

  const pkrFlashClass = costFlash === "none" ? "text-zinc-500" : flashClass;

  return (
    <footer className="shrink-0 border-t border-white/[0.06] bg-[#0B0F12]/90 text-white shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex w-full items-center px-4 py-3.5 md:px-5">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Total Budget
            </p>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p
                className={`font-display text-3xl font-extrabold leading-none tracking-tight transition-colors sm:text-4xl ${flashClass}`}
              >
                {formatUsd(totals.totalUsd)}
              </p>
              <p className={`text-sm font-medium tracking-wide sm:text-base ${pkrFlashClass}`}>
                {formatPkr(totals.totalPkr)}
              </p>
            </div>
          </div>
      </div>
    </footer>
  );
}
