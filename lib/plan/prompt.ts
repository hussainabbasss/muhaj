import { HUSSEINIYA_LOCATIONS, FOOD_SPOTS, TRANSIT_ROUTES } from "@/lib/constants";
import type { AccommodationType, DestinationFilter } from "./types";

export interface PromptContext {
  outboundDate: string;
  returnDate: string;
  accommodationType: AccommodationType;
  destinationFilter: DestinationFilter;
  isPeakCrowd: boolean;
  peakWindows: string[];
}

function accommodationRules(type: AccommodationType): string {
  if (type === "FREE_TRACK") {
    return `
ACCOMMODATION MODE: FREE_TRACK
- Route overnight stays exclusively to communal Haram Basements (Sardabs) or permanent Husseiniyas along the Najaf-to-Karbala pole walk (Masha).
- Schedule daily luggage drop-offs at official Amanat lockers at outer security perimeters.
- Meal plans must default strictly to distributed Mawakib (free pilgrim hospitality tables) for $0 daily sustenance.
- Reference these Husseiniya locations: ${HUSSEINIYA_LOCATIONS.map((l) => `${l.name} (${l.address})`).join("; ")}.`;
  }

  return `
ACCOMMODATION MODE: HOTEL_3_STAR
- Route night slots back to commercial town-center grids (Al-Rasool Street in Najaf, Bab Al-Baghdad in Karbala).
- Optimize geographic proximity to minimize local taxi costs.
- Schedule morning/evening walking windows to avoid peak high-temperature hours (before 10:00 and after 17:00 local).`;
}

function destinationRules(filter: DestinationFilter): string {
  switch (filter) {
    case "NAJAF_ONLY":
      return "DESTINATION SCOPE: Najaf only — Imam Ali Shrine, Wadi al-Salam, and Najaf old city.";
    case "BAGHDAD_ONLY":
      return "DESTINATION SCOPE: Baghdad only — Kazmain, Kadhimiya district, and central Baghdad transit hubs.";
    default:
      return "DESTINATION SCOPE: Both Najaf and Karbala — include Imam Ali Shrine (Najaf), Imam Husayn & Abbas shrines (Karbala), and Najaf-Karbala transit.";
  }
}

function peakCrowdRules(isPeakCrowd: boolean, peakWindows: string[]): string {
  if (!isPeakCrowd) {
    return "CROWD DENSITY: Normal — standard walking times between shrines apply.";
  }

  return `
CROWD DENSITY: PEAK — isPeakCrowd=true
Overlapping religious windows: ${peakWindows.join(", ")}
- Scale down transit speed expectations (walking 2-3× slower in shrine courtyards).
- Add 30-60 min buffer between scheduled activities.
- Surface critical congestion warnings at shrine gates and security checkpoints.
- Warn about heatstroke risk and water/Mawkib station locations.`;
}

export function buildPlanSystemPrompt(ctx: PromptContext): string {
  return `You are the AI Itinerary Engine for a DIY Budget Ziyarat (pilgrimage) planner in Iraq.
Generate a highly structured, cost-aware daily itinerary as valid JSON only — no markdown fences.

TRIP DATES: ${ctx.outboundDate} to ${ctx.returnDate}
${destinationRules(ctx.destinationFilter)}
${accommodationRules(ctx.accommodationType)}
${peakCrowdRules(ctx.isPeakCrowd, ctx.peakWindows)}

TRANSIT REFERENCE FARES: ${TRANSIT_ROUTES.map((r) => `${r.label}: $${r.fareUsd}`).join("; ")}
FOOD REFERENCE (if not Mawkib-only): ${FOOD_SPOTS.map((f) => `${f.name} near ${f.near}`).join("; ")}

OUTPUT SCHEMA (strict JSON):
{
  "summary": "2-3 sentence trip overview",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayNumber": 1,
      "title": "Day theme",
      "activities": [
        { "time": "HH:MM", "description": "...", "location": "optional", "costNote": "optional $0 or fare" }
      ],
      "overnight": "where to sleep",
      "meals": "meal plan",
      "warnings": ["optional congestion/heat warnings"]
    }
  ]
}

Rules:
- Cover every calendar day from outbound to return (inclusive).
- Keep costs minimal; flag free Mawkib/Husseiniya options when FREE_TRACK.
- Use realistic Iraqi pilgrimage logistics (security perimeters, Amanat lockers, coaster fares).
- Return ONLY the JSON object.`;
}

export function buildPlanUserPrompt(ctx: PromptContext): string {
  return `Generate the complete daily itinerary for ${ctx.outboundDate} through ${ctx.returnDate}.`;
}
