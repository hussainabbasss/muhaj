import { getDefaultBudgetState } from "./budget";
import type { BudgetState } from "./types";

const STORAGE_KEY = "karbala-budget-state";

function mergeBudgetState(parsed: Partial<BudgetState>): BudgetState {
  const defaults = getDefaultBudgetState();
  return {
    ...defaults,
    ...parsed,
    pillars: { ...defaults.pillars, ...parsed.pillars },
    flight: { ...defaults.flight, ...parsed.flight },
    accommodation: { ...defaults.accommodation, ...parsed.accommodation },
    food: { ...defaults.food, ...parsed.food },
    transit: { ...defaults.transit, ...parsed.transit },
    miscExpenses: parsed.miscExpenses ?? defaults.miscExpenses,
  };
}

export function loadBudgetState(): BudgetState {
  if (typeof window === "undefined") {
    return getDefaultBudgetState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultBudgetState();
    const parsed = JSON.parse(raw) as Partial<BudgetState>;
    return mergeBudgetState(parsed);
  } catch {
    return getDefaultBudgetState();
  }
}

export function saveBudgetState(state: BudgetState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearBudgetState(): BudgetState {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return getDefaultBudgetState();
}
