import { searchFlights, parseFlightDestination, validateFlightDates } from "@/lib/flights/search";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const outboundDate = request.nextUrl.searchParams.get("outboundDate");
  const returnDate = request.nextUrl.searchParams.get("returnDate");
  const destinationParam = request.nextUrl.searchParams.get("destination") ?? "both";
  const liteFareParam = request.nextUrl.searchParams.get("liteFare");

  if (!outboundDate || !returnDate) {
    return NextResponse.json(
      { error: "outboundDate and returnDate query parameters are required." },
      { status: 400 },
    );
  }

  const destination = parseFlightDestination(destinationParam);
  if (!destination) {
    return NextResponse.json(
      { error: "destination must be both, NJF, or BGW." },
      { status: 400 },
    );
  }

  const validationError = validateFlightDates(outboundDate, returnDate);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const liteFare = liteFareParam !== "false";

  try {
    const data = await searchFlights({
      outboundDate,
      returnDate,
      destination,
      liteFare,
    });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Flight search failed.";
    const status = message.includes("SERPAPI_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
