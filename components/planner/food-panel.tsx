"use client";

import { formatUsd } from "@/lib/budget";
import { FOOD_SPOTS, mapsLink } from "@/lib/constants";
import type { BudgetState } from "@/lib/types";
import { PanelShell } from "./panel-shell";
import { PillarIcon } from "./pillar-icons";

interface FoodPanelProps {
  state: BudgetState;
  onUpdate: (updater: (prev: BudgetState) => BudgetState) => void;
}

export function FoodPanel({ state, onUpdate }: FoodPanelProps) {
  if (!state.pillars.food) {
    return (
      <PanelShell title="Sustenance Log" icon={<PillarIcon pillar="food" />} inactive>
        <p className="text-sm text-zinc-500">Food budget bypassed — $0.00</p>
      </PanelShell>
    );
  }

  const { mode, dailyAllowance, days } = state.food;

  return (
    <PanelShell
      title="Sustenance Log"
      subtitle="Mawkib catering or local street food"
      icon={<PillarIcon pillar="food" />}
    >
      <div className="mb-4 flex gap-2">
        <ModeButton
          active={mode === "mawkib"}
          onClick={() =>
            onUpdate((prev) => ({
              ...prev,
              food: { ...prev.food, mode: "mawkib" },
            }))
          }
          label="Mawkib Free Catering"
        />
        <ModeButton
          active={mode === "eatery"}
          onClick={() =>
            onUpdate((prev) => ({
              ...prev,
              food: { ...prev.food, mode: "eatery" },
            }))
          }
          label="Local Eatery Map"
        />
      </div>

      {mode === "mawkib" ? (
        <div className="callout-emerald p-4 text-sm text-zinc-300">
          <p className="font-display font-semibold text-[#D4AF37]">Food overhead: $0.00</p>
          <p className="mt-2 leading-relaxed text-zinc-400">
            During off-season, rest in courtyard areas following local Mawkib guidelines. For
            basement (<em>Sardab</em>) resting, observe posted protocols and respect communal space
            rotation schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="panel-label mb-2 block">
              Daily allowance: {formatUsd(dailyAllowance)}
            </span>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={dailyAllowance}
              onChange={(e) =>
                onUpdate((prev) => ({
                  ...prev,
                  food: { ...prev.food, dailyAllowance: Number(e.target.value) },
                }))
              }
              className="w-full"
            />
          </label>
          <label className="block text-sm">
            <span className="panel-label mb-1 block">Trip days</span>
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) =>
                onUpdate((prev) => ({
                  ...prev,
                  food: { ...prev.food, days: Number(e.target.value) || 1 },
                }))
              }
              className="input-surface w-full px-3 py-2.5"
            />
          </label>
          <p className="font-display text-sm font-semibold text-[#D4AF37]">
            Subtotal: {formatUsd(dailyAllowance * days)}
          </p>
          <ul className="space-y-2">
            {FOOD_SPOTS.map((spot) => (
              <li key={spot.id} className="sub-card p-3 text-sm">
                <p className="font-semibold text-zinc-100">{spot.name}</p>
                <p className="text-zinc-400">
                  {spot.specialty} — {spot.near}
                </p>
                <a
                  href={mapsLink(spot.lat, spot.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#D4AF37] hover:underline"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                    <path d="M8 0a5.5 5.5 0 00-5.5 5.5c0 3.5 5.5 10.5 5.5 10.5S13.5 9 13.5 5.5A5.5 5.5 0 008 0zm0 7.5A2 2 0 108 3.5a2 2 0 000 4z" />
                  </svg>
                  {spot.lat}, {spot.lng}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PanelShell>
  );
}

function ModeButton({
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
      className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all ${
        active ? "segment-control-active" : "segment-control"
      }`}
    >
      {label}
    </button>
  );
}
