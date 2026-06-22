import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { GeneratedPlan } from "./plan/types";
import type { BudgetState } from "./types";

export async function exportItineraryPdf(
  state: BudgetState,
  flightResults: import("./flights/types").ApiFlight[] = [],
  plan: GeneratedPlan | null = null,
): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const { ItineraryDocument } = await import("@/components/pdf/itinerary-document");

  const element = createElement(ItineraryDocument, {
    state,
    flightResults,
    plan,
  }) as ReactElement<DocumentProps>;

  const blob = await pdf(element).toBlob();

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ziyarat-itinerary.pdf";
  anchor.click();
  URL.revokeObjectURL(url);
}
