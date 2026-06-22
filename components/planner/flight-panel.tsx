"use client";

import { formatPkr, formatUsd } from "@/lib/budget";
import { PKR_PER_USD } from "@/lib/constants";
import { formatDuration } from "@/lib/flights/dates";
import type { ApiFlight, FlightDataSource, FlightInsights } from "@/lib/flights/types";
import type { BudgetState, FlightDestination } from "@/lib/types";
import { PanelShell } from "./panel-shell";
import { PillarIcon } from "./pillar-icons";

interface FlightPanelProps {
  state: BudgetState;
  flightResults: ApiFlight[];
  flightInsights: FlightInsights | null;
  flightSource: FlightDataSource | null;
  flightLoading: boolean;
  flightError: string | null;
  onUpdate: (updater: (prev: BudgetState) => BudgetState) => void;
  onSearch: (force?: boolean) => void;
}

export function FlightPanel({
  state,
  flightResults,
  flightInsights,
  flightSource,
  flightLoading,
  flightError,
  onUpdate,
  onSearch,
}: FlightPanelProps) {
  const active = state.pillars.flight;

  if (!active) {
    return (
      <PanelShell title="Flight Sniper Terminal" icon={<PillarIcon pillar="flight" />} inactive>
        <p className="text-sm text-zinc-500">Flight cost bypassed — $0.00</p>
      </PanelShell>
    );
  }

  return (
    <PanelShell
      title="Flight Sniper Terminal"
      subtitle="Live routes — KHI → Najaf / Baghdad via SerpApi"
      icon={<PillarIcon pillar="flight" />}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="panel-label mb-1.5 block text-sm tracking-wide">Outbound date</span>
          <input
            type="date"
            value={state.flight.outboundDate}
            onChange={(e) =>
              onUpdate((prev) => ({
                ...prev,
                flight: { ...prev.flight, outboundDate: e.target.value },
              }))
            }
            className="input-surface w-full px-4 py-3 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="panel-label mb-1.5 block text-sm tracking-wide">Return date</span>
          <input
            type="date"
            value={state.flight.returnDate}
            onChange={(e) =>
              onUpdate((prev) => ({
                ...prev,
                flight: { ...prev.flight, returnDate: e.target.value },
              }))
            }
            className="input-surface w-full px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <p className="panel-label mb-2 text-sm tracking-wide">Destination</p>
          <div className="flex gap-2">
            <FilterButton
              active={state.flight.destination === "both"}
              onClick={() => setDestination(onUpdate, "both")}
              label="Both"
            />
            <FilterButton
              active={state.flight.destination === "NJF"}
              onClick={() => setDestination(onUpdate, "NJF")}
              label="Najaf only"
            />
            <FilterButton
              active={state.flight.destination === "BGW"}
              onClick={() => setDestination(onUpdate, "BGW")}
              label="Baghdad only"
            />
          </div>
        </div>

        <label className="input-surface flex cursor-pointer items-center gap-3 px-4 py-3.5 text-sm">
          <input
            type="checkbox"
            checked={state.flight.liteFare}
            onChange={(e) =>
              onUpdate((prev) => ({
                ...prev,
                flight: {
                  ...prev.flight,
                  liteFare: e.target.checked,
                  selectedFlightId: null,
                },
              }))
            }
            className="size-4 rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]/30"
          />
          <span>
            <span className="block font-medium tracking-wide text-zinc-100">
              Carry-on only (no free checked bag)
            </span>
            <span className="text-xs text-zinc-500">
              Filters out fares with a free checked bag included
            </span>
          </span>
        </label>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSearch()}
          disabled={flightLoading}
          className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide disabled:opacity-60"
        >
          {flightLoading ? "Searching…" : "Search Flights"}
        </button>
        <span className="badge-gold">
          {state.flight.liteFare ? "Carry-on only · PKR" : "All fares · PKR"}
        </span>
        {flightSource === "live" && <span className="badge-gold">Live · SerpApi</span>}
      </div>

      {flightInsights && (
        <div className="callout-gold mb-4 px-4 py-3 text-sm">
          <p className="font-semibold capitalize text-[#D4AF37]">
            Market: {flightInsights.price_situation}
          </p>
          {flightInsights.lowest_historical_pkr != null && (
            <p className="mt-0.5 text-zinc-400">
              Historical floor: {formatPkr(flightInsights.lowest_historical_pkr)}
            </p>
          )}
        </div>
      )}

      {flightError && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {flightError}
        </p>
      )}

      {flightLoading && flightResults.length === 0 ? (
        <p className="text-sm text-zinc-500">Fetching live fares…</p>
      ) : flightResults.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {state.flight.liteFare
            ? "No carry-on-only fares found. Try turning off the checked-bag filter, switching destination, or adjusting dates."
            : "No flights found. Adjust destination or dates and search again."}
        </p>
      ) : (
        <ul className="space-y-3">
          {flightResults.map((flight) => {
            const selected = state.flight.selectedFlightId === flight.id;
            const priceUsd = flight.price_pkr / PKR_PER_USD;

            return (
              <li key={flight.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      flight: { ...prev.flight, selectedFlightId: flight.id },
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onUpdate((prev) => ({
                        ...prev,
                        flight: { ...prev.flight, selectedFlightId: flight.id },
                      }));
                    }
                  }}
                  className={`w-full cursor-pointer rounded-2xl p-5 text-left transition-all ${
                    selected ? "card-active" : "sub-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-zinc-100">{flight.airline}</p>
                      <p className="mt-0.5 font-mono text-sm font-medium tracking-wide text-[#D4AF37]">
                        {flight.flightNumber}
                      </p>
                      <p className="text-sm text-zinc-400">{flight.route}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {flight.is_split_hub && <span className="badge-gold">Split-Hub</span>}
                        <span className="badge-dark">
                          {flight.stops === 0
                            ? "Direct"
                            : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </span>
                        {flight.duration_mins > 0 && (
                          <span className="badge-dark">{formatDuration(flight.duration_mins)}</span>
                        )}
                        <span className="badge-dark">
                          → {flight.destination === "NJF" ? "Najaf" : "Baghdad"}
                        </span>
                        {flight.carryOnOnly && <span className="badge-gold">Carry-on only</span>}
                      </div>
                      {flight.extensions.length > 0 && (
                        <p className="mt-2 text-xs text-zinc-500">
                          {flight.extensions.join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="price-focal">{formatPkr(flight.price_pkr)}</p>
                      <p className="text-xs text-zinc-500">{formatUsd(priceUsd)}</p>
                      <a
                        href={flight.googleFlightsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#D4AF37] transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/20"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                          <path d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 16h-8.5A2.25 2.25 0 012 13.75v-8.5A2.25 2.25 0 014.25 3h4a.75.75 0 010 1.5h-4z" />
                          <path d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.56v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00.053 1.06z" />
                        </svg>
                        Google Flights
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PanelShell>
  );
}

function setDestination(
  onUpdate: FlightPanelProps["onUpdate"],
  destination: FlightDestination,
) {
  onUpdate((prev) => ({
    ...prev,
    flight: {
      ...prev.flight,
      destination,
      selectedFlightId: null,
    },
  }));
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`segment-control flex-1 px-2 py-2.5 text-xs font-semibold tracking-wide ${
        active ? "segment-control-active" : ""
      }`}
    >
      {label}
    </button>
  );
}
