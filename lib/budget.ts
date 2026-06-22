import {
  BAGGAGE_FEE_USD,
  CACHED_FLIGHTS,
  DEFAULT_TRIP_DAYS,
  PKR_PER_USD,
  TRANSIT_ROUTES,
  VISA_FEE_USD,
} from "./constants";
import { defaultOutboundDate, defaultReturnDate } from "./flights/dates";
import type { ApiFlight } from "./flights/types";
import type { BudgetState, BudgetTotals, PillarKey } from "./types";

export interface BudgetCalculationContext {
  flightResults?: ApiFlight[];
}

export function getDefaultBudgetState(): BudgetState {
  const outboundDate = defaultOutboundDate();
  return {
    pillars: {
      flight: true,
      visa: true,
      accommodation: true,
      food: true,
      transit: true,
    },
    flight: {
      selectedFlightId: null,
      liteFare: true,
      destination: "both",
      outboundDate,
      returnDate: defaultReturnDate(outboundDate),
    },
    accommodation: {
      mode: "paid",
      dailyRate: 15,
      nights: DEFAULT_TRIP_DAYS,
    },
    food: {
      mode: "eatery",
      dailyAllowance: 8,
      days: DEFAULT_TRIP_DAYS,
    },
    transit: {
      selectedRouteIds: ["najaf-karbala"],
    },
    miscExpenses: [],
  };
}

function getFlightCostUsd(
  state: BudgetState,
  flightResults?: ApiFlight[],
): number {
  if (!state.pillars.flight) return 0;

  const live = flightResults?.find((f) => f.id === state.flight.selectedFlightId);
  if (live) {
    return live.price_pkr / PKR_PER_USD;
  }

  const seed = CACHED_FLIGHTS.find((f) => f.id === state.flight.selectedFlightId);
  if (!seed) return 0;

  let price = seed.priceUsd;
  if (state.flight.liteFare) {
    price = Math.max(0, price - BAGGAGE_FEE_USD);
  }
  return price;
}

function getVisaCostUsd(state: BudgetState): number {
  return state.pillars.visa ? VISA_FEE_USD : 0;
}

function getAccommodationCostUsd(state: BudgetState): number {
  if (!state.pillars.accommodation) return 0;
  if (state.accommodation.mode === "free") return 0;
  return state.accommodation.dailyRate * state.accommodation.nights;
}

function getFoodCostUsd(state: BudgetState): number {
  if (!state.pillars.food) return 0;
  if (state.food.mode === "mawkib") return 0;
  return state.food.dailyAllowance * state.food.days;
}

function getTransitCostUsd(state: BudgetState): number {
  if (!state.pillars.transit) return 0;

  return state.transit.selectedRouteIds.reduce((sum, routeId) => {
    const route = TRANSIT_ROUTES.find((r) => r.id === routeId);
    return sum + (route?.fareUsd ?? 0);
  }, 0);
}

function getMiscCostPkr(state: BudgetState): number {
  return state.miscExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
}

export function calculateBudgetTotals(
  state: BudgetState,
  context: BudgetCalculationContext = {},
): BudgetTotals {
  const flightUsd = getFlightCostUsd(state, context.flightResults);
  const visaUsd = getVisaCostUsd(state);
  const accommodationUsd = getAccommodationCostUsd(state);
  const foodUsd = getFoodCostUsd(state);
  const transitUsd = getTransitCostUsd(state);
  const miscPkr = getMiscCostPkr(state);

  const pillarsUsd = flightUsd + visaUsd + accommodationUsd + foodUsd + transitUsd;
  const miscUsd = miscPkr / PKR_PER_USD;
  const totalUsd = pillarsUsd + miscUsd;
  const totalPkr = Math.round(pillarsUsd * PKR_PER_USD + miscPkr);

  return {
    flightUsd,
    visaUsd,
    accommodationUsd,
    foodUsd,
    transitUsd,
    miscPkr,
    totalUsd,
    totalPkr,
  };
}

export function isPillarActive(state: BudgetState, pillar: PillarKey): boolean {
  return state.pillars[pillar];
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPkr(amount: number): string {
  return `${amount.toLocaleString("en-PK")} PKR`;
}

export function getSelectedFlight(
  state: BudgetState,
  flightResults?: ApiFlight[],
): ApiFlight | undefined {
  return flightResults?.find((f) => f.id === state.flight.selectedFlightId);
}
