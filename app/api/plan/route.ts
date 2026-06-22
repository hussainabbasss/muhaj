import { generatePlan } from "@/lib/plan/generate";
import type { AccommodationType, DestinationFilter } from "@/lib/plan/types";
import { NextRequest, NextResponse } from "next/server";

function parseAccommodationType(value: unknown): AccommodationType | null {
  if (value === "FREE_TRACK" || value === "HOTEL_3_STAR") return value;
  return null;
}

function parseDestinationFilter(value: unknown): DestinationFilter | null {
  if (value === "BOTH" || value === "NAJAF_ONLY" || value === "BAGHDAD_ONLY") return value;
  return null;
}

function validateDates(outboundDate: string, returnDate: string): string | null {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(outboundDate) || !datePattern.test(returnDate)) {
    return "Dates must be in YYYY-MM-DD format.";
  }
  if (returnDate < outboundDate) {
    return "returnDate must be on or after outboundDate.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const outboundDate = typeof body.outboundDate === "string" ? body.outboundDate : null;
  const returnDate = typeof body.returnDate === "string" ? body.returnDate : null;
  const accommodationType = parseAccommodationType(body.accommodationType);
  const destinationFilter = parseDestinationFilter(body.destinationFilter);

  if (!outboundDate || !returnDate) {
    return NextResponse.json(
      { error: "outboundDate and returnDate are required." },
      { status: 400 },
    );
  }

  if (!accommodationType) {
    return NextResponse.json(
      { error: "accommodationType must be FREE_TRACK or HOTEL_3_STAR." },
      { status: 400 },
    );
  }

  if (!destinationFilter) {
    return NextResponse.json(
      { error: "destinationFilter must be BOTH, NAJAF_ONLY, or BAGHDAD_ONLY." },
      { status: 400 },
    );
  }

  const dateError = validateDates(outboundDate, returnDate);
  if (dateError) {
    return NextResponse.json({ error: dateError }, { status: 400 });
  }

  try {
    const result = await generatePlan({
      outboundDate,
      returnDate,
      accommodationType,
      destinationFilter,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Plan generation failed.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
