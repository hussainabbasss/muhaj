# 02-Web-Scraper: Dynamic Aviation Integration Blueprint

## Overview
The **Aviation Integration Layer** for the DIY Budget Ziyarat Planner is engineered to solve the project's most significant cost barrier: international airfare. Because flight costs from Karachi (KHI) to Iraq comprise over 80% of the absolute bare-minimum budget baseline, tracking pricing volatility is highly critical.

To adhere strictly to the **Zero Real-time Computing Costs** architectural invariant, this system replaces long-running, continuous crawling infrastructure with a lightweight serverless handler utilizing **SerpApi's Google Flights API engine**. This engine executes programmatic queries, automatically handles complex downstream IP rotation and anti-bot obstacles, and standardizes data streams into clean JSON. The output directly fuels the client-side budget dashboard for pre-trip optimization.

---

## Targeted Scraper Constraints & Strategy

### 1. The Anti-Bot Problem & The SerpApi Wrapper
Direct scraping of flight aggregation platforms (e.g., Google Flights, Air Arabia, Flydubai) via traditional headless automation (like custom Playwright or Puppeteer routines) triggers immediate security protections, including Cloudflare JavaScript challenges and DataDome CAPTCHAs. 

By offloading the rendering pipeline to SerpApi, the application shifts the responsibility of proxy handling, session simulation, and CAPTCHA decoding to a managed execution context. The application accesses structured search engine results pages (SERPs) using optimized, stateless REST requests.

### 2. Strategic Parameter Tuning
To capture the absolute lowest pricing configurations, the outbound API query string bypasses default parameters to enforce tight structural filters:
* **Lite-Fare Enforcement (`type=2`):** Forces the engine to query basic economy seats, explicitly stripping out checked baggage allowances. This isolates 7kg carry-on configurations, slicing ticket base rates immediately.
* **Currency Standardization (`currency=PKR`):** Forces direct estimation in local currency, avoiding volatile external foreign exchange math discrepancies during pre-trip calculations.
* **Route Target Matrix:** Queries direct code-shares or low-cost regional multi-hop combinations (e.g., Karachi to Najaf [NJF] or Baghdad [BGW] via budget carriers like Air Arabia or FlyJinnah).

---

## Endpoint Configuration & Mapping Logic

The integration layer surfaces an internal serverless edge route within the Next.js framework at `app/api/flights/route.js`. 

### Query Parameters Received
* `outboundDate` (String, format: `YYYY-MM-DD`) - Targeted departure day from Karachi.
* `returnDate` (String, format: `YYYY-MM-DD`) - Targeted departure day from Iraq.

### Data Extraction Fields (SerpApi Schema Mapping)
The JSON string received from the engine is processed using specific extraction patterns:
* **`best_flights` / `other_flights` (Array):** Iterated over to pull individual travel options.
* **`price` (Numeric):** Read directly to calculate total travel liability.
* **`flights` (Array Length):** Evaluated to detect multi-city connections or split-hub stopovers (e.g., length > 1 flags a `Split-Hub` itinerary).
* **`price_insights` (Object):** Evaluated to capture market analytics, including historical pricing floors and the current price level categorization (`low`, `typical`, `high`).

---

## API Surface Specification

### Request Template
```http
GET /api/flights?outboundDate=2026-08-12&returnDate=2026-08-19 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

### Response Schema Structure
```json
{
  "flights": [
    {
      "id": "flight_result_alpha_123",
      "airline": "Air Arabia",
      "flightNumber": "G9 543",
      "price_pkr": 92500.00,
      "is_split_hub": true,
      "stops": 1,
      "duration_mins": 390,
      "extensions": ["7 kg carry-on included"]
    }
  ],
  "insights": {
    "lowest_historical_pkr": 88000.00,
    "price_situation": "low"
  }
}
```

---

## Operational Guardrails & Caching

To prevent over-consuming SerpApi's free token allocation (250 successful programmatic executions monthly) during casual adjustments on the interface, two explicit protection layers are enforced:

1. **Client-Side Parameter Validation:** The Next.js state manager blocks duplicate outbound requests if the targeted date range has not been altered on the user input workspace.
2. **Edge-Level Revalidation Caching:** The Next.js fetch layer implements a strict cache revalidation constraint (`revalidate: 3600`). If the app is reloaded or the same date pair is queried within a 60-minute window, the system bypasses an outbound network hit to SerpApi and instantly serves the locally stored JSON array.
