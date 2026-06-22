"use client";

import { useState } from "react";
import { exportItineraryPdf } from "@/lib/pdf-export";
import type { GeneratedPlan } from "@/lib/plan/types";
import type { ApiFlight } from "@/lib/flights/types";
import type { BudgetState } from "@/lib/types";

interface ItinerarySidebarProps {
  state: BudgetState;
  flightResults: ApiFlight[];
  plan: GeneratedPlan | null;
  planLoading: boolean;
  planError: string | null;
  planSource: string | null;
  onGeneratePlan: () => Promise<void>;
}

export function ItinerarySidebar({
  state,
  flightResults,
  plan,
  planLoading,
  planError,
  planSource,
  onGeneratePlan,
}: ItinerarySidebarProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportItineraryPdf(state, flightResults, plan);
    } finally {
      window.setTimeout(() => setExporting(false), 800);
    }
  };

  const accommodationLabel =
    state.accommodation.mode === "free" ? "Free Track (Husseiniya/Mawkib)" : "3-Star Hotel Grid";
  const destinationLabel =
    state.flight.destination === "NJF"
      ? "Najaf Only"
      : state.flight.destination === "BGW"
        ? "Baghdad Only"
        : "Both Najaf & Karbala";

  return (
    <aside className="relative flex w-full shrink-0 flex-col border-t border-white/[0.06] bg-black/20 backdrop-blur-xl md:sticky md:top-0 md:h-full md:min-h-0 md:w-72 md:border-t-0 md:border-l lg:w-80 xl:w-[22rem]">
      <div className="px-4 py-4 md:py-5">
        <p className="font-display text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Itinerary
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 md:overflow-y-auto md:pb-6">
        <div className="mb-4 space-y-3 rounded-xl border border-white/[0.06] bg-black/20 p-4">
          <SidebarMeta label="Outbound" value={state.flight.outboundDate} />
          <SidebarMeta label="Return" value={state.flight.returnDate} />
          <SidebarMeta label="Lodging" value={accommodationLabel} />
          <SidebarMeta label="Destination" value={destinationLabel} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => void onGeneratePlan()}
            disabled={planLoading}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {planLoading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0B0F12] border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.784.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.784l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.784l-.238-1.192zM11.12 6.112a1 1 0 00-1.96 0l-.211 1.055a1 1 0 01-.784.785l-1.055.211a1 1 0 000 1.962l1.055.211a1 1 0 01.784.785l.211 1.055a1 1 0 001.962 0l.211-1.055a1 1 0 01.785-.784l1.055-.211a1 1 0 000-1.962l-1.055-.211a1 1 0 01-.784-.785L11.12 6.112z" />
                </svg>
                <span className="truncate">Generate Itinerary</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold disabled:opacity-50"
            title="Download itinerary PDF"
          >
            {exporting ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0B0F12] border-t-transparent" />
                Exporting…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                <span className="truncate">Download PDF</span>
              </>
            )}
          </button>
        </div>
        {planError && <p className="mt-2 text-xs text-red-400">{planError}</p>}
        {plan && !planLoading && (
          <p className="mt-2 text-[10px] text-zinc-500">
            {plan.days.length} days ready · {planSource === "gemini" ? "Gemini" : "Fallback"}
          </p>
        )}
      </div>
    </aside>
  );
}

function SidebarMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-xs font-medium leading-snug text-zinc-200">{value}</p>
    </div>
  );
}
