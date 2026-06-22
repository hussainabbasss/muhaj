"use client";

import { formatUsd } from "@/lib/budget";
import { HUSSEINIYA_LOCATIONS, mapsLink } from "@/lib/constants";
import type { BudgetState } from "@/lib/types";
import { PanelShell } from "./panel-shell";
import { PillarIcon } from "./pillar-icons";

interface AccommodationPanelProps {
  state: BudgetState;
  onUpdate: (updater: (prev: BudgetState) => BudgetState) => void;
}

export function AccommodationPanel({ state, onUpdate }: AccommodationPanelProps) {
  if (!state.pillars.accommodation) {
    return (
      <PanelShell
        title="Accommodation Hub"
        icon={<PillarIcon pillar="accommodation" />}
        inactive
      >
        <p className="text-sm text-zinc-500">Accommodation bypassed — $0.00</p>
      </PanelShell>
    );
  }

  const { mode, dailyRate, nights } = state.accommodation;

  return (
    <PanelShell
      title="Accommodation Hub"
      subtitle="Economy inn or free Husseiniya lodging"
      icon={<PillarIcon pillar="accommodation" />}
    >
      <div className="mb-4 flex gap-2">
        <ModeButton
          active={mode === "paid"}
          onClick={() =>
            onUpdate((prev) => ({
              ...prev,
              accommodation: { ...prev.accommodation, mode: "paid" },
            }))
          }
          label="Paid Economy Inn"
        />
        <ModeButton
          active={mode === "free"}
          onClick={() =>
            onUpdate((prev) => ({
              ...prev,
              accommodation: { ...prev.accommodation, mode: "free" },
            }))
          }
          label="Free Husseiniya"
        />
      </div>

      {mode === "paid" ? (
        <div className="space-y-4">
          <SliderField
            label={`Daily rate: ${formatUsd(dailyRate)}`}
            min={5}
            max={50}
            step={1}
            value={dailyRate}
            onChange={(value) =>
              onUpdate((prev) => ({
                ...prev,
                accommodation: { ...prev.accommodation, dailyRate: value },
              }))
            }
          />
          <NumberField
            label="Number of nights"
            min={1}
            max={30}
            value={nights}
            onChange={(value) =>
              onUpdate((prev) => ({
                ...prev,
                accommodation: { ...prev.accommodation, nights: value },
              }))
            }
          />
          <p className="font-display text-sm font-semibold text-[#D4AF37]">
            Subtotal: {formatUsd(dailyRate * nights)}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="callout-emerald px-3 py-2.5 text-sm text-zinc-300">
            Lodging: <strong className="text-[#D4AF37]">$0.00</strong> — Husseiniya directory
          </div>
          <ul className="space-y-2">
            {HUSSEINIYA_LOCATIONS.map((loc) => (
              <li key={loc.id} className="sub-card p-3 text-sm">
                <p className="font-semibold text-zinc-100">{loc.name}</p>
                <p className="text-zinc-400">{loc.address}</p>
                <p className="text-zinc-500">{loc.contact}</p>
                <a
                  href={mapsLink(loc.lat, loc.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#D4AF37] underline-offset-2 hover:underline"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                    <path d="M8 0a5.5 5.5 0 00-5.5 5.5c0 3.5 5.5 10.5 5.5 10.5S13.5 9 13.5 5.5A5.5 5.5 0 008 0zm0 7.5A2 2 0 108 3.5a2 2 0 000 4z" />
                  </svg>
                  {loc.lat}, {loc.lng}
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

function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block font-medium text-zinc-300">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}

function NumberField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-300">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="w-full rounded-xl border border-white/[0.05] bg-black/30 px-3 py-2.5 text-zinc-100 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20"
      />
    </label>
  );
}
