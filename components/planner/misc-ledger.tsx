"use client";

import type { BudgetState, MiscExpense } from "@/lib/types";
import { PanelShell } from "./panel-shell";

interface MiscLedgerProps {
  state: BudgetState;
  onUpdate: (updater: (prev: BudgetState) => BudgetState) => void;
}

export function MiscLedger({ state, onUpdate }: MiscLedgerProps) {
  const addExpense = () => {
    const expense: MiscExpense = {
      id: crypto.randomUUID(),
      label: "",
      amount: 0,
    };
    onUpdate((prev) => ({
      ...prev,
      miscExpenses: [...prev.miscExpenses, expense],
    }));
  };

  const updateExpense = (id: string, patch: Partial<MiscExpense>) => {
    onUpdate((prev) => ({
      ...prev,
      miscExpenses: prev.miscExpenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const removeExpense = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      miscExpenses: prev.miscExpenses.filter((e) => e.id !== id),
    }));
  };

  return (
    <PanelShell title="Miscellaneous Expenses" subtitle="SIM cards, souvenirs, emergency items (PKR)">
      <button
        type="button"
        onClick={addExpense}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D4AF37]/30 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
      >
        <span className="text-lg leading-none text-[#D4AF37]">+</span>
        Add Custom Expense
      </button>

      {state.miscExpenses.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">No custom expenses yet</p>
      ) : (
        <ul className="space-y-2">
          {state.miscExpenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-2"
            >
              <input
                type="text"
                placeholder="Label (e.g. Zain SIM Card)"
                value={expense.label}
                onChange={(e) => updateExpense(expense.id, { label: e.target.value })}
                className="input-surface min-w-0 flex-1 px-2.5 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                placeholder="PKR"
                value={expense.amount || ""}
                onChange={(e) =>
                  updateExpense(expense.id, { amount: Number(e.target.value) || 0 })
                }
                className="input-surface w-24 px-2.5 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeExpense(expense.id)}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Remove expense"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
