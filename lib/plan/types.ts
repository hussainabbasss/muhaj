export type AccommodationType = "FREE_TRACK" | "HOTEL_3_STAR";

export type DestinationFilter = "BOTH" | "NAJAF_ONLY" | "BAGHDAD_ONLY";

export interface PlanRequest {
  outboundDate: string;
  returnDate: string;
  accommodationType: AccommodationType;
  destinationFilter: DestinationFilter;
}

export interface PlanActivity {
  time: string;
  description: string;
  location?: string;
  costNote?: string;
}

export interface PlanDay {
  date: string;
  dayNumber: number;
  title: string;
  activities: PlanActivity[];
  overnight: string;
  meals: string;
  warnings?: string[];
}

export interface EmergencyContact {
  institution: string;
  contact: string;
  focus: string;
}

export interface GeneratedPlan {
  summary: string;
  isPeakCrowd: boolean;
  peakWindows: string[];
  days: PlanDay[];
  emergencyDirectory: EmergencyContact[];
  generatedAt: string;
}

export interface PlanApiResponse {
  plan: GeneratedPlan;
  source: "gemini" | "fallback";
}
