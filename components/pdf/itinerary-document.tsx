import { Document, Page, Text, View } from "@react-pdf/renderer";
import { calculateBudgetTotals, formatPkr, formatUsd, getSelectedFlight } from "@/lib/budget";
import {
  FOOD_SPOTS,
  HUSSEINIYA_LOCATIONS,
  mapsLink,
  PILLAR_LABELS,
  PKR_PER_USD,
  TRANSIT_ROUTES,
  VISA_DOCUMENTS,
  VISA_FEE_USD,
} from "@/lib/constants";
import { MANDOOB_CASH_GATE_PROTOCOL, VISA_COMPLIANCE_ADDRESS } from "@/lib/plan/compliance";
import { EMERGENCY_DIRECTORY } from "@/lib/plan/emergency";
import { sanitizePlanSummary } from "@/lib/ui/sanitize-user-message";
import type { GeneratedPlan } from "@/lib/plan/types";
import type { ApiFlight } from "@/lib/flights/types";
import type { BudgetState, PillarKey } from "@/lib/types";
import { PdfArabicDua, PdfLogoHeader } from "./pdf-branding";
import { registerPdfFonts } from "./pdf-fonts";
import { PDF_COLORS, pdfStyles } from "./pdf-theme";

registerPdfFonts();

export { PDF_COLORS };

interface ItineraryDocumentProps {
  state: BudgetState;
  flightResults: ApiFlight[];
  plan: GeneratedPlan | null;
}

export function ItineraryDocument({ state, flightResults, plan }: ItineraryDocumentProps) {
  const totals = calculateBudgetTotals(state, { flightResults });
  const activePillars = (Object.keys(state.pillars) as PillarKey[]).filter(
    (key) => state.pillars[key],
  );

  return (
    <Document title="Muhaj — Ziyarat Itinerary">
      <Page size="A4" style={pdfStyles.page}>
        <PdfLogoHeader />
        <PdfArabicDua />

        <Text style={pdfStyles.docTitle}>Ziyarat Itinerary</Text>
        <Text style={pdfStyles.subtitle}>
          Generated: {new Date().toLocaleString()} · Rate: {PKR_PER_USD} PKR/USD
        </Text>

        <View style={pdfStyles.securityFlap}>
          <Text style={pdfStyles.securityTitle}>Security Flap — Visa Compliance</Text>
          <Text style={pdfStyles.securityText}>{VISA_COMPLIANCE_ADDRESS.hotelName}</Text>
          <Text style={pdfStyles.securityText}>{VISA_COMPLIANCE_ADDRESS.address}</Text>
          <Text style={pdfStyles.securityText}>Tel: {VISA_COMPLIANCE_ADDRESS.phone}</Text>
          <Text style={pdfStyles.securityText}>{VISA_COMPLIANCE_ADDRESS.checkIn}</Text>
          <Text style={[pdfStyles.securityTitle, { marginTop: 8 }]}>
            $50 Arrival Mandoob Cash Gate Protocol
          </Text>
          {MANDOOB_CASH_GATE_PROTOCOL.map((step, i) => (
            <Text key={i} style={pdfStyles.securityText}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>

        <Text style={pdfStyles.sectionHeader}>Budget Summary</Text>
        <Text style={pdfStyles.line}>
          Total: {formatUsd(totals.totalUsd)} / {formatPkr(totals.totalPkr)}
        </Text>

        {activePillars.map((pillar) => (
          <PillarSection
            key={pillar}
            pillar={pillar}
            state={state}
            totals={totals}
            flightResults={flightResults}
          />
        ))}

        {state.miscExpenses.length > 0 && (
          <>
            <Text style={pdfStyles.sectionHeader}>Miscellaneous Expenses</Text>
            {state.miscExpenses.map((expense) => (
              <Text key={expense.id} style={pdfStyles.line}>
                {expense.label || "Unlabeled"}: {expense.amount.toLocaleString()} PKR
              </Text>
            ))}
          </>
        )}

        {plan && (
          <>
            <Text style={pdfStyles.sectionHeader}>Daily Itinerary</Text>
            {plan.isPeakCrowd && (
              <Text style={[pdfStyles.line, { color: PDF_COLORS.amber }]}>
                Peak crowd window — {plan.peakWindows.join("; ")}
              </Text>
            )}
            <Text style={pdfStyles.line}>{sanitizePlanSummary(plan.summary)}</Text>
            {plan.days.map((day, index) => (
              <View
                key={day.date}
                style={index % 2 === 0 ? pdfStyles.dayBlockEven : pdfStyles.dayBlockOdd}
              >
                <Text style={pdfStyles.dayTitle}>
                  Day {day.dayNumber}: {day.title} ({day.date})
                </Text>
                {day.activities.map((activity, i) => (
                  <Text key={i} style={pdfStyles.line}>
                    {activity.time} — {activity.description}
                    {activity.location ? ` (${activity.location})` : ""}
                    {activity.costNote ? ` · ${activity.costNote}` : ""}
                  </Text>
                ))}
                <Text style={pdfStyles.line}>Overnight: {day.overnight}</Text>
                <Text style={pdfStyles.line}>Meals: {day.meals}</Text>
              </View>
            ))}
          </>
        )}

        <View style={pdfStyles.emergencyBox}>
          <Text style={pdfStyles.emergencyTitle}>Emergency & Liaison Directory</Text>
          {(plan?.emergencyDirectory ?? EMERGENCY_DIRECTORY).map((entry) => (
            <Text key={entry.institution} style={pdfStyles.emergencyLine}>
              {entry.institution} — {entry.contact} — {entry.focus}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}

function PillarSection({
  pillar,
  state,
  totals,
  flightResults,
}: {
  pillar: PillarKey;
  state: BudgetState;
  totals: ReturnType<typeof calculateBudgetTotals>;
  flightResults: ApiFlight[];
}) {
  return (
    <>
      <Text style={pdfStyles.sectionHeader}>{PILLAR_LABELS[pillar]}</Text>
      {pillar === "flight" && (() => {
        const flight = getSelectedFlight(state, flightResults);
        if (!flight) return <Text style={pdfStyles.line}>No flight selected.</Text>;
        return (
          <Text style={pdfStyles.line}>
            {flight.airline} {flight.flightNumber}: {flight.route} —{" "}
            {formatPkr(flight.price_pkr)} / {formatUsd(totals.flightUsd)}
          </Text>
        );
      })()}
      {pillar === "visa" && (
        <>
          <Text style={pdfStyles.line}>
            Official e-visa fee: {formatUsd(VISA_FEE_USD)} — https://evisa.iq
          </Text>
          {VISA_DOCUMENTS.map((doc) => (
            <Text key={doc} style={pdfStyles.line}>
              • {doc}
            </Text>
          ))}
        </>
      )}
      {pillar === "accommodation" && (
        <>
          {state.accommodation.mode === "free" ? (
            <>
              <Text style={pdfStyles.line}>Lodging: Free Husseiniya / Mawkib ($0)</Text>
              {HUSSEINIYA_LOCATIONS.map((loc) => (
                <Text key={loc.id} style={pdfStyles.line}>
                  {loc.name} — {loc.address} — {mapsLink(loc.lat, loc.lng)}
                </Text>
              ))}
            </>
          ) : (
            <Text style={pdfStyles.line}>
              Paid inn: {formatUsd(state.accommodation.dailyRate)}/night ×{" "}
              {state.accommodation.nights} nights = {formatUsd(totals.accommodationUsd)}
            </Text>
          )}
        </>
      )}
      {pillar === "food" && (
        <>
          {state.food.mode === "mawkib" ? (
            <Text style={pdfStyles.line}>Mawkib free catering ($0)</Text>
          ) : (
            <>
              <Text style={pdfStyles.line}>
                Local eateries: {formatUsd(state.food.dailyAllowance)}/day × {state.food.days}{" "}
                days = {formatUsd(totals.foodUsd)}
              </Text>
              {FOOD_SPOTS.map((spot) => (
                <Text key={spot.id} style={pdfStyles.line}>
                  {spot.name} ({spot.specialty}) — {mapsLink(spot.lat, spot.lng)}
                </Text>
              ))}
            </>
          )}
        </>
      )}
      {pillar === "transit" && (
        <>
          {TRANSIT_ROUTES.filter((r) => state.transit.selectedRouteIds.includes(r.id)).map(
            (route) => (
              <Text key={route.id} style={pdfStyles.line}>
                {route.label} — {formatUsd(route.fareUsd)} / {route.fareIqd.toLocaleString()} IQD
              </Text>
            ),
          )}
          <Text style={pdfStyles.line}>Transit subtotal: {formatUsd(totals.transitUsd)}</Text>
        </>
      )}
    </>
  );
}
