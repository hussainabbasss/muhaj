"use client";

import { formatUsd } from "@/lib/budget";
import { VISA_DOCUMENTS, VISA_FEE_USD } from "@/lib/constants";
import type { BudgetState } from "@/lib/types";
import { PanelShell } from "./panel-shell";
import { PillarIcon } from "./pillar-icons";

interface VisaPanelProps {
  state: BudgetState;
}

export function VisaPanel({ state }: VisaPanelProps) {
  if (!state.pillars.visa) {
    return (
      <PanelShell title="Visa Roadmap Card" icon={<PillarIcon pillar="visa" />} inactive>
        <p className="text-sm text-zinc-500">Visa fee bypassed — $0.00</p>
      </PanelShell>
    );
  }

  return (
    <PanelShell
      title="Visa Roadmap Card"
      subtitle="Direct e-visa — no agency markup"
      icon={<PillarIcon pillar="visa" />}
    >
      <div className="callout-gold mb-4 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Official fee</p>
        <p className="font-display text-2xl font-bold text-[#D4AF37]">{formatUsd(VISA_FEE_USD)}</p>
      </div>
      <a
        href="https://evisa.iq"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mb-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        Open evisa.iq Portal
      </a>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Required Documents
      </p>
      <ul className="space-y-2">
        {VISA_DOCUMENTS.map((doc) => (
          <li
            key={doc}
            className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-sm text-zinc-300"
          >
            <span className="mt-0.5 text-[#D4AF37]">✦</span>
            {doc}
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
