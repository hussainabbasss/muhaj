const FREE_CHECKED_BAG =
  /free checked|checked bag(?:gage)? included|included checked|1st checked bag: free|1 free checked/i;

const CHECKED_BAG_FOR_FEE = /checked bag(?:gage)? for a fee|baggage for a fee/i;

const CARRY_ON_HINT = /carry-on|7\s*kg|hand baggage|hand bag/i;

export type BaggageClass = "carry_on_only" | "checked_included" | "unknown";

export function classifyBaggage(extensions: string[]): BaggageClass {
  const text = extensions.join(" ").toLowerCase();

  if (FREE_CHECKED_BAG.test(text)) {
    return "checked_included";
  }

  if (CHECKED_BAG_FOR_FEE.test(text) || CARRY_ON_HINT.test(text)) {
    return "carry_on_only";
  }

  if (/checked/.test(text)) {
    return "checked_included";
  }

  return "unknown";
}

/** Keep fares without a free checked bag — carry-on / paid-baggage lite options. */
export function isCarryOnOnlyFare(extensions: string[]): boolean {
  const baggage = classifyBaggage(extensions);
  return baggage === "carry_on_only" || baggage === "unknown";
}
