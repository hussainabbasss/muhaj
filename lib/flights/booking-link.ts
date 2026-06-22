import { unstable_cache } from "next/cache";
import { resolveRouteGoogleFlightsUrl } from "@/lib/flights/google-url";
import type { ApiFlight, SerpApiFlightsResponse } from "@/lib/flights/types";

const SERPAPI_BASE = "https://serpapi.com/search.json";

export interface BookingLinkParams {
  departureToken: string;
  arrivalId: "NJF" | "BGW";
  outboundDate: string;
  returnDate: string;
}

async function fetchDepartureFlightLinkUncached(
  params: BookingLinkParams,
): Promise<string> {
  const apiKey = process.env.SERPAPI_KEY?.trim();
  if (!apiKey) {
    throw new Error("SERPAPI_KEY is not configured.");
  }

  const query = new URLSearchParams({
    engine: "google_flights",
    api_key: apiKey,
    departure_id: "KHI",
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate,
    departure_token: params.departureToken,
    currency: "PKR",
    type: "1",
    travel_class: "1",
    hl: "en",
    gl: "pk",
  });

  const response = await fetch(`${SERPAPI_BASE}?${query.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`SerpApi booking link failed (${response.status})`);
  }

  const data = (await response.json()) as SerpApiFlightsResponse;
  if (data.error) {
    throw new Error(data.error);
  }

  return resolveRouteGoogleFlightsUrl(
    data.search_metadata?.google_flights_url,
    "KHI",
    params.arrivalId,
    params.outboundDate,
    params.returnDate,
  );
}

export function fetchDepartureFlightLink(params: BookingLinkParams): Promise<string> {
  const { departureToken, arrivalId, outboundDate, returnDate } = params;

  return unstable_cache(
    () => fetchDepartureFlightLinkUncached(params),
    ["flight-booking-link", departureToken, arrivalId, outboundDate, returnDate],
    { revalidate: 3600 },
  )();
}

export async function enrichFlightGoogleUrls(
  flights: ApiFlight[],
  outboundDate: string,
  returnDate: string,
): Promise<ApiFlight[]> {
  const tokenGroups = new Map<string, ApiFlight>();

  for (const flight of flights) {
    if (!flight.departureToken) continue;
    const key = `${flight.destination}:${flight.departureToken}`;
    if (!tokenGroups.has(key)) {
      tokenGroups.set(key, flight);
    }
  }

  if (tokenGroups.size === 0) {
    return flights;
  }

  const resolvedUrls = new Map<string, string>();

  await Promise.all(
    [...tokenGroups.entries()].map(async ([key, flight]) => {
      try {
        const url = await fetchDepartureFlightLink({
          departureToken: flight.departureToken!,
          arrivalId: flight.destination,
          outboundDate,
          returnDate,
        });
        resolvedUrls.set(key, url);
      } catch {
        resolvedUrls.set(key, flight.googleFlightsUrl);
      }
    }),
  );

  return flights.map((flight) => {
    if (!flight.departureToken) return flight;

    const key = `${flight.destination}:${flight.departureToken}`;
    const url = resolvedUrls.get(key);
    return url ? { ...flight, googleFlightsUrl: url } : flight;
  });
}
