"use client";

import { PILLAR_LABELS } from "@/lib/constants";
import type { PillarKey } from "@/lib/types";
import { KarbalaStar, ShrineLineArt } from "./karbala-graphics";
import { PillarIcon } from "./pillar-icons";

const PILLAR_ORDER: PillarKey[] = [
  "flight",
  "visa",
  "accommodation",
  "food",
  "transit",
];

const SHORT_LABELS: Record<PillarKey, string> = {
  flight: "Flights",
  visa: "Visa",
  accommodation: "Lodging",
  food: "Food",
  transit: "Transit",
};

interface BudgetSidebarProps {
  pillars: Record<PillarKey, boolean>;
  onToggle: (pillar: PillarKey) => void;
  onReset: () => void;
}

export function BudgetSidebar({ pillars, onToggle, onReset }: BudgetSidebarProps) {
  return (
    <aside className="relative flex w-full shrink-0 flex-col border-b border-white/[0.06] bg-black/20 backdrop-blur-xl md:h-full md:min-h-0 md:w-72 md:border-b-0 md:border-r lg:w-80 xl:w-[22rem]">
      <div className="hidden border-b border-white/[0.06] px-4 py-5 md:block">
        <div className="mx-auto flex w-fit items-center gap-1.5">
          <ShrineLineArt className="w-16 shrink-0 opacity-90 lg:w-20" />
          <div className="text-center">
            <p
              className="font-arabic text-4xl font-bold leading-none tracking-wide text-gold-gradient lg:text-5xl"
              dir="rtl"
              lang="ar"
            >
              مُهَج
            </p>
            <p className="mt-1 text-[10px] leading-snug tracking-wide text-zinc-500">
              The heart&apos;s last blood
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3 md:py-4">
        <div className="flex items-center gap-2 md:hidden">
          <KarbalaStar className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Budget Pillars
          </span>
        </div>
        <p className="hidden font-display text-xs font-semibold uppercase tracking-wider text-zinc-500 md:block">
          Budget Pillars
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 md:ml-auto"
          title="Reset budget"
          aria-label="Reset budget"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00-1.449-.39 7 7 0 00-11.712 3.138l-.31-.31h-2.43a.75.75 0 000 1.5h4.243a.75.75 0 00.75-.75V3.989a.75.75 0 00-1.5 0v2.43l-.311-.31a5.5 5.5 0 019.201-2.466.75.75 0 00.39-1.449z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <nav
        className="flex min-h-0 gap-2 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-x-visible md:overflow-y-auto md:px-4 md:pb-4"
        aria-label="Budget pillars"
      >
        {PILLAR_ORDER.map((pillar) => {
          const active = pillars[pillar];
          return (
            <button
              key={pillar}
              type="button"
              onClick={() => onToggle(pillar)}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all md:w-full md:px-4 md:py-4 ${
                active ? "sidebar-pillar-active" : "sidebar-pillar-inactive"
              }`}
              aria-pressed={active}
              title={PILLAR_LABELS[pillar]}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border md:h-11 md:w-11 ${
                  active
                    ? "border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#D4AF37]"
                    : "border-white/5 bg-white/[0.03] text-zinc-500"
                }`}
              >
                <PillarIcon pillar={pillar} />
              </div>
              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-semibold tracking-wide md:text-base ${
                    active ? "text-gold-gradient" : "text-zinc-300"
                  }`}
                >
                  {SHORT_LABELS[pillar]}
                </p>
                <p
                  className={`hidden text-xs tracking-wide md:block ${
                    active ? "text-[#D4AF37]/80" : "text-zinc-500"
                  }`}
                >
                  {active ? "Included" : "Bypassed"}
                </p>
              </div>
              <span
                className={`ml-auto hidden h-2 w-2 shrink-0 rounded-full md:block ${
                  active ? "bg-[#D4AF37]" : "bg-white/15"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
