export interface ApiFlight {
  id: string;
  airline: string;
  flightNumber: string;
  price_pkr: number;
  is_split_hub: boolean;
  stops: number;
  duration_mins: number;
  extensions: string[];
  route: string;
  destination: "NJF" | "BGW";
  carryOnOnly: boolean;
  googleFlightsUrl: string;
  departureToken?: string;
}

export type FlightDestination = "both" | "NJF" | "BGW";

export interface FlightSearchParams {
  outboundDate: string;
  returnDate: string;
  destination: FlightDestination;
  liteFare: boolean;
}

export interface FlightInsights {
  lowest_historical_pkr: number | null;
  price_situation: string;
}

export type FlightDataSource = "live" | "demo";

export interface FlightsApiResponse {
  flights: ApiFlight[];
  insights: FlightInsights;
  source: FlightDataSource;
}

export interface SerpApiFlightLeg {
  airline?: string;
  flight_number?: string;
  extensions?: string[];
  departure_airport?: { id?: string; name?: string };
  arrival_airport?: { id?: string; name?: string };
}

export interface SerpApiFlightOption {
  flights?: SerpApiFlightLeg[];
  total_duration?: number;
  price?: number;
  extensions?: string[];
  departure_token?: string;
}

export interface SerpApiFlightsResponse {
  search_metadata?: {
    google_flights_url?: string;
  };
  best_flights?: SerpApiFlightOption[];
  other_flights?: SerpApiFlightOption[];
  price_insights?: {
    lowest_price?: number;
    price_level?: string;
  };
  error?: string;
}
