const GOOGLE_FLIGHTS_BASE = "https://www.google.com/travel/flights";

export function isUsefulGoogleFlightsUrl(url: string | undefined): boolean {
  if (!url?.startsWith("https://www.google.com/travel/flights")) {
    return false;
  }

  try {
    const { searchParams } = new URL(url);
    return searchParams.has("tfs") || searchParams.has("q");
  } catch {
    return false;
  }
}

export function buildGoogleFlightsSearchUrl(
  departureId: string,
  arrivalId: string,
  outboundDate: string,
  returnDate: string,
): string {
  const q = `Flights to ${arrivalId} from ${departureId} on ${outboundDate} through ${returnDate}`;
  const params = new URLSearchParams({
    q,
    curr: "PKR",
    hl: "en",
    gl: "pk",
  });

  return `${GOOGLE_FLIGHTS_BASE}?${params.toString()}`;
}

export function resolveRouteGoogleFlightsUrl(
  metadataUrl: string | undefined,
  departureId: string,
  arrivalId: "NJF" | "BGW",
  outboundDate: string,
  returnDate: string,
): string {
  if (isUsefulGoogleFlightsUrl(metadataUrl)) {
    return metadataUrl!;
  }

  return buildGoogleFlightsSearchUrl(departureId, arrivalId, outboundDate, returnDate);
}
