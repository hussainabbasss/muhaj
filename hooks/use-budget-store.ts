"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { calculateBudgetTotals, getDefaultBudgetState } from "@/lib/budget";
import { flightFetchKey } from "@/lib/flights/dates";
import type { ApiFlight, FlightDataSource, FlightInsights, FlightsApiResponse } from "@/lib/flights/types";
import { mapBudgetToPlanRequest } from "@/lib/plan/generate";
import type { GeneratedPlan, PlanApiResponse } from "@/lib/plan/types";
import { clearBudgetState, loadBudgetState, saveBudgetState } from "@/lib/storage";
import type { BudgetState, CostFlash, PillarKey } from "@/lib/types";

export function useBudgetStore() {
  const [state, setState] = useState<BudgetState>(getDefaultBudgetState);
  const [ready, setReady] = useState(false);
  const [costFlash, setCostFlash] = useState<CostFlash>("none");
  const [flightResults, setFlightResults] = useState<ApiFlight[]>([]);
  const [flightInsights, setFlightInsights] = useState<FlightInsights | null>(null);
  const [flightSource, setFlightSource] = useState<FlightDataSource | null>(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planSource, setPlanSource] = useState<PlanApiResponse["source"] | null>(null);
  const lastFetchKeyRef = useRef<string | null>(null);
  const initialFlightSearchRef = useRef(false);
  const prevTotalRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    setState(loadBudgetState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      saveBudgetState(state);
    } catch {
      // localStorage may be unavailable or full — ignore
    }
  }, [state, ready]);

  const totals = useMemo(
    () => calculateBudgetTotals(state, { flightResults }),
    [state, flightResults],
  );

  useEffect(() => {
    if (!ready) return;

    const prev = prevTotalRef.current;
    if (prev !== null && prev !== totals.totalPkr) {
      setCostFlash(totals.totalPkr < prev ? "decrease" : "increase");
      const timer = window.setTimeout(() => setCostFlash("none"), 600);
      return () => window.clearTimeout(timer);
    }
    prevTotalRef.current = totals.totalPkr;
  }, [totals.totalPkr, ready]);

  const applyFlightResponse = useCallback(
    (data: FlightsApiResponse, fetchKey: string) => {
      setFlightResults(data.flights);
      setFlightInsights(data.insights);
      setFlightSource(data.source);
      lastFetchKeyRef.current = fetchKey;

      setState((prev) => ({
        ...prev,
        flight: {
          ...prev.flight,
          selectedFlightId: data.flights[0]?.id ?? null,
        },
      }));
    },
    [],
  );

  const searchFlights = useCallback(
    async (force = false) => {
      const { outboundDate, returnDate, destination, liteFare } = state.flight;
      const fetchKey = flightFetchKey(outboundDate, returnDate, destination, liteFare);

      if (!force && lastFetchKeyRef.current === fetchKey && flightResults.length > 0) {
        return { skipped: true as const };
      }

      setFlightLoading(true);
      setFlightError(null);

      try {
        const params = new URLSearchParams({
          outboundDate,
          returnDate,
          destination,
          liteFare: String(liteFare),
        });
        const response = await fetch(`/api/flights?${params.toString()}`);

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `Flight search failed (${response.status})`);
        }

        const data = (await response.json()) as FlightsApiResponse;
        applyFlightResponse(data, fetchKey);
        return { skipped: false as const };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Flight search failed.";
        setFlightError(message);
        return { skipped: false as const, error: message };
      } finally {
        setFlightLoading(false);
      }
    },
    [applyFlightResponse, flightResults.length, state.flight],
  );

  useEffect(() => {
    if (!ready || initialFlightSearchRef.current) return;
    initialFlightSearchRef.current = true;
    if (state.pillars.flight) {
      void searchFlights();
    }
  }, [ready, state.pillars.flight, searchFlights]);

  const updateState = useCallback((updater: (prev: BudgetState) => BudgetState) => {
    setState((prev) => updater(prev));
  }, []);

  const togglePillar = useCallback((pillar: PillarKey) => {
    updateState((prev) => ({
      ...prev,
      pillars: { ...prev.pillars, [pillar]: !prev.pillars[pillar] },
    }));
  }, [updateState]);

  const generatePlan = useCallback(async () => {
    const { outboundDate, returnDate, destination } = state.flight;
    const accommodationMode = state.accommodation.mode;
    const request = mapBudgetToPlanRequest(
      outboundDate,
      returnDate,
      accommodationMode,
      destination,
    );

    setPlanLoading(true);
    setPlanError(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Plan generation failed (${response.status})`);
      }

      const data = (await response.json()) as PlanApiResponse;
      setPlan(data.plan);
      setPlanSource(data.source);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Plan generation failed.";
      setPlanError(message);
    } finally {
      setPlanLoading(false);
    }
  }, [state.accommodation.mode, state.flight]);

  const resetAll = useCallback(() => {
    setState(clearBudgetState());
    setFlightResults([]);
    setFlightInsights(null);
    setFlightSource(null);
    setFlightError(null);
    setPlan(null);
    setPlanError(null);
    setPlanSource(null);
    lastFetchKeyRef.current = null;
    initialFlightSearchRef.current = false;
  }, []);

  return {
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
  };
}
