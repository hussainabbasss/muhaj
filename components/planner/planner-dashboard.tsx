"use client";

import { useBudgetStore } from "@/hooks/use-budget-store";
import { AccommodationPanel } from "./accommodation-panel";
import { BudgetFooter } from "./budget-footer";
import { BudgetSidebar } from "./budget-sidebar";
import { FlightPanel } from "./flight-panel";
import { ItinerarySidebar } from "./itinerary-sidebar";
import { FoodPanel } from "./food-panel";
import { GlobalHeader } from "./global-header";
import { HeroBanner } from "./hero-banner";
import { MiscLedger } from "./misc-ledger";
import { TransitPanel } from "./transit-panel";
import { VisaPanel } from "./visa-panel";

export function PlannerDashboard() {
  const {
    state,
    totals,
    costFlash,
    flightResults,
    flightInsights,
    flightSource,
    flightLoading,
    flightError,
    searchFlights,
    generatePlan,
    plan,
    planLoading,
    planError,
    planSource,
    updateState,
    togglePillar,
    resetAll,
  } = useBudgetStore();

  return (
    <div className="ambient-shell flex h-dvh flex-col overflow-hidden">
      <div className="ambient-blob-emerald" aria-hidden />
      <div className="ambient-blob-gold" aria-hidden />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col md:flex-row">
        <BudgetSidebar
          pillars={state.pillars}
          onToggle={togglePillar}
          onReset={resetAll}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:min-h-full">
          <HeroBanner />
          <GlobalHeader />

          <main className="main-workspace min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-5 md:py-7">
            <div className="w-full space-y-5">
              <FlightPanel
                state={state}
                flightResults={flightResults}
                flightInsights={flightInsights}
                flightSource={flightSource}
                flightLoading={flightLoading}
                flightError={flightError}
                onUpdate={updateState}
                onSearch={searchFlights}
              />
              <VisaPanel state={state} />
              <AccommodationPanel state={state} onUpdate={updateState} />
              <FoodPanel state={state} onUpdate={updateState} />
              <TransitPanel state={state} onUpdate={updateState} />
              <MiscLedger state={state} onUpdate={updateState} />
            </div>
          </main>

          <BudgetFooter totals={totals} costFlash={costFlash} />
        </div>

        <ItinerarySidebar
          state={state}
          flightResults={flightResults}
          plan={plan}
          planLoading={planLoading}
          planError={planError}
          planSource={planSource}
          onGeneratePlan={generatePlan}
        />
      </div>
    </div>
  );
}
