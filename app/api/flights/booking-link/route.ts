import {
  fetchDepartureFlightLink,
  type BookingLinkParams,
} from "@/lib/flights/booking-link";
import { validateFlightDates } from "@/lib/flights/search";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600;

function parseArrivalId(value: string | null): BookingLinkParams["arrivalId"] | null {
  if (value === "NJF" || value === "BGW") return value;
  return null;
}

export async function GET(request: NextRequest) {
  const departureToken = request.nextUrl.searchParams.get("departureToken");
  const arrivalId = parseArrivalId(request.nextUrl.searchParams.get("arrivalId"));
  const outboundDate = request.nextUrl.searchParams.get("outboundDate");
  const returnDate = request.nextUrl.searchParams.get("returnDate");

  if (!departureToken || !arrivalId || !outboundDate || !returnDate) {
    return NextResponse.json(
      {
        error:
          "departureToken, arrivalId (NJF|BGW), outboundDate, and returnDate are required.",
      },
      { status: 400 },
    );
  }

  const validationError = validateFlightDates(outboundDate, returnDate);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const url = await fetchDepartureFlightLink({
      departureToken,
      arrivalId,
      outboundDate,
      returnDate,
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking link failed.";
    const status = message.includes("SERPAPI_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
