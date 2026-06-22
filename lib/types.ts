export type PillarKey =
  | "flight"
  | "visa"
  | "accommodation"
  | "food"
  | "transit";

export type AccommodationMode = "paid" | "free";
export type FoodMode = "mawkib" | "eatery";

export interface MiscExpense {
  id: string;
  label: string;
  amount: number;
}

export type FlightDestination = "both" | "NJF" | "BGW";

export interface BudgetState {
  pillars: Record<PillarKey, boolean>;
  flight: {
    selectedFlightId: string | null;
    liteFare: boolean;
    destination: FlightDestination;
    outboundDate: string;
    returnDate: string;
  };
  accommodation: {
    mode: AccommodationMode;
    dailyRate: number;
    nights: number;
  };
  food: {
    mode: FoodMode;
    dailyAllowance: number;
    days: number;
  };
  transit: {
    selectedRouteIds: string[];
  };
  miscExpenses: MiscExpense[];
}

export interface BudgetTotals {
  flightUsd: number;
  visaUsd: number;
  accommodationUsd: number;
  foodUsd: number;
  transitUsd: number;
  miscPkr: number;
  totalUsd: number;
  totalPkr: number;
}

export type CostFlash = "none" | "decrease" | "increase";
