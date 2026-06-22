const API_NAME_PATTERN =
  /serpapi|gemini|openai|anthropic|claude|serp_api|google generative|SERPAPI_KEY|GEMINI_API_KEY/gi;

export function sanitizeUserMessage(message: string): string {
  if (API_NAME_PATTERN.test(message)) {
    if (/flight|fare|route|NJF|BGW/i.test(message)) {
      return "Flight search is temporarily unavailable. Please try again later.";
    }
    return "This feature is temporarily unavailable. Please try again later.";
  }
  return message.replace(API_NAME_PATTERN, "service");
}

export function sanitizePlanSummary(summary: string): string {
  return summary
    .replace(/\.\s*Configure GEMINI_API_KEY for AI-generated routing\.?/gi, ".")
    .replace(/^Offline fallback itinerary/i, "Itinerary")
    .replace(API_NAME_PATTERN, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
