import { GoogleGenerativeAI } from "@google/generative-ai";
import { detectPeakCrowd } from "./calendar";
import { EMERGENCY_DIRECTORY } from "./emergency";
import { buildPlanSystemPrompt, buildPlanUserPrompt } from "./prompt";
import type { GeneratedPlan, PlanDay, PlanRequest } from "./types";

const MODEL = "gemini-2.5-flash";

interface RawPlanPayload {
  summary?: string;
  days?: PlanDay[];
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1].trim() : trimmed;
}

function parsePlanJson(text: string): RawPlanPayload {
  const cleaned = stripJsonFences(text);
  return JSON.parse(cleaned) as RawPlanPayload;
}

function enumerateTripDays(outboundDate: string, returnDate: string): string[] {
  const days: string[] = [];
  const current = new Date(outboundDate + "T12:00:00");
  const end = new Date(returnDate + "T12:00:00");

  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function buildFallbackPlan(request: PlanRequest): GeneratedPlan {
  const { isPeakCrowd, peakWindows } = detectPeakCrowd(
    request.outboundDate,
    request.returnDate,
  );
  const tripDays = enumerateTripDays(request.outboundDate, request.returnDate);
  const isFree = request.accommodationType === "FREE_TRACK";

  const days: PlanDay[] = tripDays.map((date, index) => {
    const dayNumber = index + 1;
    const isFirst = index === 0;
    const isLast = index === tripDays.length - 1;

    const activities = isFirst
      ? [
          { time: "14:00", description: "Arrive at airport, complete visa/Mandoob checkpoint", location: request.destinationFilter === "BAGHDAD_ONLY" ? "BGW" : "NJF" },
          { time: "16:00", description: "Coaster/taxi to city center", costNote: "$8-12" },
          { time: "18:00", description: "Evening ziyarat at main shrine", location: request.destinationFilter === "BAGHDAD_ONLY" ? "Kazmain" : "Imam Ali Shrine, Najaf" },
        ]
      : isLast
        ? [
            { time: "08:00", description: "Final shrine visit and farewell ziyarat" },
            { time: "12:00", description: "Return to airport for departure flight" },
          ]
        : [
            { time: "06:00", description: "Fajr ziyarat — shrine courtyard", location: "Main Haram" },
            { time: "09:00", description: isFree ? "Drop bags at Amanat lockers" : "Return to hotel, rest during peak heat", location: "Security perimeter" },
            { time: "17:00", description: "Evening procession / local transit leg", costNote: "$8 coaster" },
          ];

    return {
      date,
      dayNumber,
      title: isFirst ? "Arrival & First Ziyarat" : isLast ? "Departure Day" : `Pilgrimage Day ${dayNumber}`,
      activities,
      overnight: isFree
        ? "Haram basement (Sardab) or Husseiniya along Masha route"
        : "Al-Rasool Street inn (Najaf) or Bab Al-Baghdad area (Karbala)",
      meals: isFree ? "Mawakib free catering ($0)" : "Local falafel/shawarma under $8/day",
      warnings: isPeakCrowd
        ? ["Peak crowd window — allow extra time at shrine gates"]
        : undefined,
    };
  });

  return {
    summary: `Offline fallback itinerary for ${tripDays.length} days (${request.outboundDate} → ${request.returnDate}). Configure GEMINI_API_KEY for AI-generated routing.`,
    isPeakCrowd,
    peakWindows,
    days,
    emergencyDirectory: EMERGENCY_DIRECTORY,
    generatedAt: new Date().toISOString(),
  };
}

function finalizePlan(
  raw: RawPlanPayload,
  request: PlanRequest,
): GeneratedPlan {
  const { isPeakCrowd, peakWindows } = detectPeakCrowd(
    request.outboundDate,
    request.returnDate,
  );

  return {
    summary: raw.summary ?? "AI-generated Ziyarat itinerary",
    isPeakCrowd,
    peakWindows,
    days: raw.days ?? [],
    emergencyDirectory: EMERGENCY_DIRECTORY,
    generatedAt: new Date().toISOString(),
  };
}

export async function generatePlan(request: PlanRequest): Promise<{
  plan: GeneratedPlan;
  source: "gemini" | "fallback";
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { plan: buildFallbackPlan(request), source: "fallback" };
  }

  const { isPeakCrowd, peakWindows } = detectPeakCrowd(
    request.outboundDate,
    request.returnDate,
  );

  const promptContext = {
    ...request,
    isPeakCrowd,
    peakWindows,
  };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: buildPlanSystemPrompt(promptContext),
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(buildPlanUserPrompt(promptContext));
    const text = result.response.text();
    const raw = parsePlanJson(text);
    return { plan: finalizePlan(raw, request), source: "gemini" };
  } catch {
    return { plan: buildFallbackPlan(request), source: "fallback" };
  }
}

export function mapBudgetToPlanRequest(
  outboundDate: string,
  returnDate: string,
  accommodationMode: "paid" | "free",
  destination: "both" | "NJF" | "BGW",
): PlanRequest {
  const accommodationType =
    accommodationMode === "free" ? "FREE_TRACK" : "HOTEL_3_STAR";

  const destinationFilter =
    destination === "NJF"
      ? "NAJAF_ONLY"
      : destination === "BGW"
        ? "BAGHDAD_ONLY"
        : "BOTH";

  return {
    outboundDate,
    returnDate,
    accommodationType,
    destinationFilter,
  };
}
