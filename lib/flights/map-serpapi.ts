import { classifyBaggage, isCarryOnOnlyFare } from "./filters";
import { resolveRouteGoogleFlightsUrl } from "./google-url";
import type {
  ApiFlight,
  FlightInsights,
  FlightsApiResponse,
  FlightDataSource,
  SerpApiFlightLeg,
  SerpApiFlightOption,
  SerpApiFlightsResponse,
} from "./types";

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function flightLegs(legs: SerpApiFlightLeg[]): SerpApiFlightLeg[] {
  return legs.filter((leg) => Boolean(leg.flight_number?.trim()));
}

function formatFlightNumbers(legs: SerpApiFlightLeg[]): string {
  const numbers = flightLegs(legs).map((leg) => leg.flight_number!.trim());
  return numbers.length > 0 ? numbers.join(" · ") : "—";
}

function primaryAirline(legs: SerpApiFlightLeg[]): string {
  const names = flightLegs(legs)
    .map((leg) => leg.airline?.trim())
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) return "Unknown";
  const unique = [...new Set(names)];
  return unique.length === 1 ? unique[0] : `${unique[0]} (+${unique.length - 1})`;
}

function collectExtensions(
  option: SerpApiFlightOption,
  legs: SerpApiFlightLeg[],
): string[] {
  const legExtensions = legs.flatMap((leg) => leg.extensions ?? []);
  return [...new Set([...(option.extensions ?? []), ...legExtensions])];
}

function mapOption(
  option: SerpApiFlightOption,
  destination: "NJF" | "BGW",
  index: number,
  liteFare: boolean,
  googleFlightsUrl: string,
): ApiFlight | null {
  const legs = option.flights ?? [];
  const segments = flightLegs(legs);
  if (segments.length === 0 || option.price == null) return null;

  const extensions = collectExtensions(option, legs);
  const carryOnOnly = classifyBaggage(extensions) !== "checked_included";

  if (liteFare && !isCarryOnOnlyFare(extensions)) {
    return null;
  }

  const first = segments[0];
  const last = segments[segments.length - 1];
  const airline = primaryAirline(legs);
  const flightNumber = formatFlightNumbers(legs);
  const origin = first.departure_airport?.id ?? "KHI";
  const dest = last.arrival_airport?.id ?? destination;
  const stops = Math.max(0, segments.length - 1);

  const id = slugify(`${airline}-${flightNumber}-${option.price}-${destination}-${index}`);

  return {
    id,
    airline,
    flightNumber,
    price_pkr: option.price,
    is_split_hub: segments.length > 1,
    stops,
    duration_mins: option.total_duration ?? 0,
    extensions,
    route: `${origin} → ${dest}${stops > 0 ? ` (${stops} stop${stops > 1 ? "s" : ""})` : ""}`,
    destination,
    carryOnOnly,
    googleFlightsUrl,
    departureToken: option.departure_token,
  };
}

function extractFlights(
  response: SerpApiFlightsResponse,
  destination: "NJF" | "BGW",
  liteFare: boolean,
  outboundDate: string,
  returnDate: string,
): ApiFlight[] {
  const googleFlightsUrl = resolveRouteGoogleFlightsUrl(
    response.search_metadata?.google_flights_url,
    "KHI",
    destination,
    outboundDate,
    returnDate,
  );

  const options = [
    ...(response.best_flights ?? []),
    ...(response.other_flights ?? []),
  ];

  return options
    .map((option, index) =>
      mapOption(option, destination, index, liteFare, googleFlightsUrl),
    )
    .filter((flight): flight is ApiFlight => flight !== null);
}

function mergeInsights(responses: SerpApiFlightsResponse[]): FlightInsights {
  const levels = responses
    .map((r) => r.price_insights?.price_level)
    .filter(Boolean) as string[];

  const lowestPrices = responses
    .map((r) => r.price_insights?.lowest_price)
    .filter((p): p is number => typeof p === "number");

  return {
    lowest_historical_pkr:
      lowestPrices.length > 0 ? Math.min(...lowestPrices) : null,
    price_situation: levels[0] ?? "typical",
  };
}

export function mapSerpApiResponses(
  njf: SerpApiFlightsResponse,
  bgw: SerpApiFlightsResponse,
  source: FlightDataSource = "live",
  liteFare = true,
  dates: { outboundDate: string; returnDate: string },
): FlightsApiResponse {
  const flights = [
    ...extractFlights(njf, "NJF", liteFare, dates.outboundDate, dates.returnDate),
    ...extractFlights(bgw, "BGW", liteFare, dates.outboundDate, dates.returnDate),
  ].sort((a, b) => a.price_pkr - b.price_pkr);

  return {
    flights,
    insights: mergeInsights([njf, bgw]),
    source,
  };
}
