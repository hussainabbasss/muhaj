"use client";

import { formatUsd } from "@/lib/budget";
import { TRANSIT_ROUTES } from "@/lib/constants";
import type { BudgetState } from "@/lib/types";
import { PanelShell } from "./panel-shell";
import { PillarIcon } from "./pillar-icons";

interface TransitPanelProps {
  state: BudgetState;
  onUpdate: (updater: (prev: BudgetState) => BudgetState) => void;
}

export function TransitPanel({ state, onUpdate }: TransitPanelProps) {
  if (!state.pillars.transit) {
    return (
      <PanelShell title="Public Transit Router" icon={<PillarIcon pillar="transit" />} inactive>
        <p className="text-sm text-zinc-500">Transit bypassed — $0.00</p>
      </PanelShell>
    );
  }

  const toggleRoute = (routeId: string) => {
    onUpdate((prev) => {
      const selected = prev.transit.selectedRouteIds;
      const next = selected.includes(routeId)
        ? selected.filter((id) => id !== routeId)
        : [...selected, routeId];
      return { ...prev, transit: { selectedRouteIds: next } };
    });
  };

  const subtotal = TRANSIT_ROUTES.filter((r) =>
    state.transit.selectedRouteIds.includes(r.id),
  ).reduce((sum, r) => sum + r.fareUsd, 0);

  return (
    <PanelShell
      title="Public Transit Router"
      subtitle="Coasters & Gara shared taxis between holy cities"
      icon={<PillarIcon pillar="transit" />}
    >
      <ul className="space-y-3">
        {TRANSIT_ROUTES.map((route) => {
          const selected = state.transit.selectedRouteIds.includes(route.id);
          return (
            <li key={route.id}>
              <button
                type="button"
                onClick={() => toggleRoute(route.id)}
                className={`w-full rounded-2xl p-4 text-left transition-all ${
                  selected ? "card-active" : "sub-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{route.label}</p>
                    <p className="text-xs capitalize text-zinc-500">
                      {route.transportType === "coaster"
                        ? "Coaster (mini-bus)"
                        : "Gara (shared taxi)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="price-focal text-base">{formatUsd(route.fareUsd)}</p>
                    <p className="text-xs text-zinc-500">{route.fareIqd.toLocaleString()} IQD</p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-display text-sm font-semibold text-[#D4AF37]">
        Transit subtotal: {formatUsd(subtotal)}
      </p>
    </PanelShell>
  );
}
