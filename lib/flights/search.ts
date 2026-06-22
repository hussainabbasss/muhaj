import { unstable_cache } from "next/cache";
import { enrichFlightGoogleUrls } from "./booking-link";
import { mapSerpApiResponses } from "./map-serpapi";
import type {
  FlightSearchParams,
  FlightsApiResponse,
  SerpApiFlightsResponse,
} from "./types";

const MISSING_KEY_MESSAGE =
  "SERPAPI_KEY is not configured. Copy .env.example to .env.local and add your SerpApi key.";

const SERPAPI_BASE = "https://serpapi.com/search.json";

const EMPTY_RESPONSE: SerpApiFlightsResponse = {
  best_flights: [],
  other_flights: [],
};

function buildSerpApiUrl(
  arrivalId: "NJF" | "BGW",
  outboundDate: string,
  returnDate: string,
  apiKey: string,
): string {
  const params = new URLSearchParams({
    engine: "google_flights",
    api_key: apiKey,
    departure_id: "KHI",
    arrival_id: arrivalId,
    outbound_date: outboundDate,
    return_date: returnDate,
    currency: "PKR",
    type: "1",
    travel_class: "1",
    sort_by: "2",
    hl: "en",
    gl: "pk",
  });

  return `${SERPAPI_BASE}?${params.toString()}`;
}

async function fetchSerpApiRoute(
  arrivalId: "NJF" | "BGW",
  outboundDate: string,
  returnDate: string,
  apiKey: string,
): Promise<SerpApiFlightsResponse> {
  const url = buildSerpApiUrl(arrivalId, outboundDate, returnDate, apiKey);
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`SerpApi request failed (${response.status}) for ${arrivalId}`);
  }

  const data = (await response.json()) as SerpApiFlightsResponse;
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

function routesForDestination(
  destination: FlightSearchParams["destination"],
): ("NJF" | "BGW")[] {
  if (destination === "NJF") return ["NJF"];
  if (destination === "BGW") return ["BGW"];
  return ["NJF", "BGW"];
}

async function searchFlightsUncached(
  params: FlightSearchParams,
): Promise<FlightsApiResponse> {
  const apiKey = process.env.SERPAPI_KEY?.trim();

  if (!apiKey) {
    throw new Error(MISSING_KEY_MESSAGE);
  }

  const routes = routesForDestination(params.destination);
  const responses = await Promise.all(
    routes.map((arrivalId) =>
      fetchSerpApiRoute(arrivalId, params.outboundDate, params.returnDate, apiKey),
    ),
  );

  const njf =
    routes.includes("NJF") ? responses[routes.indexOf("NJF")] : EMPTY_RESPONSE;
  const bgw =
    routes.includes("BGW") ? responses[routes.indexOf("BGW")] : EMPTY_RESPONSE;

  const mapped = mapSerpApiResponses(njf, bgw, "live", params.liteFare, {
    outboundDate: params.outboundDate,
    returnDate: params.returnDate,
  });

  const flights = await enrichFlightGoogleUrls(
    mapped.flights,
    params.outboundDate,
    params.returnDate,
  );

  return { ...mapped, flights };
}

export function searchFlights(params: FlightSearchParams): Promise<FlightsApiResponse> {
  const { outboundDate, returnDate, destination, liteFare } = params;

  return unstable_cache(
    () => searchFlightsUncached(params),
    ["flights", "v4", outboundDate, returnDate, destination, liteFare ? "lite" : "all"],
    { revalidate: 3600 },
  )();
}

export function validateFlightDates(
  outboundDate: string,
  returnDate: string,
): string | null {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(outboundDate) || !datePattern.test(returnDate)) {
    return "Dates must be in YYYY-MM-DD format.";
  }

  const outbound = new Date(`${outboundDate}T00:00:00`);
  const ret = new Date(`${returnDate}T00:00:00`);

  if (Number.isNaN(outbound.getTime()) || Number.isNaN(ret.getTime())) {
    return "Invalid date values.";
  }

  if (ret <= outbound) {
    return "Return date must be after outbound date.";
  }

  return null;
}

export function parseFlightDestination(value: string | null): FlightSearchParams["destination"] | null {
  if (value === "both" || value === "NJF" || value === "BGW") {
    return value;
  }
  return null;
}
