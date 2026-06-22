## PROGRESS TRACKER

## In progress

_(none)_

## Finished

- **01-Design — UI Architecture & Interactive States** (`context/feature-spec/01-design.md`)
  - Mobile-first single-page planner dashboard with hero banner, sticky header, master cost toggle deck, pillar detail panels, misc ledger, and sticky footer totalizer
  - Client-side budget state machine with real-time USD/PKR dual-currency totals and cost-shift flash indicators
  - LocalStorage persistence for toggles, sliders, route selections, and custom expense rows
  - Client-side PDF export of active itinerary configuration with coordinates and links
  - Seed reference data for Husseiniyas, food spots, and transit routes
  - Karbala-inspired visual theme (shrine silhouette, gold/green palette, Playfair Display headings)
  - Sidebar layout: pillar toggles in left nav, detail cards in scrollable main area, fixed sticky footer with total + export
  - Three-column desktop layout: wider Budget Pillars left sidebar, full-width center workspace, Itinerary card (generate + PDF) in right sidebar

- **02-Web-Scraper — Aviation Integration (SerpApi)** (`context/feature-spec/02-web-scraper.md`)
  - `GET /api/flights?outboundDate=&returnDate=` serverless route with SerpApi Google Flights engine
  - KHI → NJF and KHI → BGW round-trip queries, PKR currency, Economy (lite-fare) class
  - Response mapping: `best_flights` / `other_flights`, split-hub detection, price insights
  - Edge cache: `revalidate: 3600` via `unstable_cache` + `Cache-Control` headers
  - Client duplicate-request guard when date pair unchanged
  - Flight panel: date pickers, destination filter (Both / Najaf / Baghdad), carry-on-only toggle, search button, live results with flight numbers
  - Requires `SERPAPI_KEY` in `.env.local` (Next.js does not load `.env.example`)
  - Fixed SerpApi `travel_class=1` (Economy); removed silent mock fallback

- **03-Plan — AI Itinerary Generator & Compliance Blueprint** (`context/feature-spec/03-plan.md`)
  - `POST /api/plan` serverless route calling Gemini `gemini-2.5-flash` with engineered system prompt
  - Runtime inputs: `outboundDate`, `returnDate`, `accommodationType` (`FREE_TRACK` | `HOTEL_3_STAR`), `destinationFilter` (`BOTH` | `NAJAF_ONLY` | `BAGHDAD_ONLY`)
  - 2026 religious calendar matrix: Ashura (Jul 24–26) and Arbaeen (Aug 3–5) peak-crowd detection injects `isPeakCrowd` into prompt
  - Accommodation-bound routing rules (Sardab/Husseiniya/Mawakib vs hotel grid) encoded in `lib/plan/prompt.ts`
  - Hardcoded emergency directory appended to every plan payload (533, 122, Red Crescent, Pakistan Embassy)
  - Hardcoded visa compliance address + $50 Mandoob cash-gate protocol for PDF Security Flap
  - AI Itinerary Engine panel in dashboard: generate button, daily schedule display, peak-crowd warnings, emergency block
  - PDF export uses `@react-pdf/renderer` with dark Muhaj theme (`#0B0F12` canvas, gold/emerald accents), logo header, Arabic dua on cover page, Security Flap, alternating daily blocks, budget summary, and emergency directory
  - Offline fallback itinerary when `GEMINI_API_KEY` is missing or Gemini call fails
  - Requires `GEMINI_API_KEY` in `.env.local` for live AI generation

## Session Notes

- Removed offline/PWA mode: deleted service worker, manifest, sync indicators, and online/offline status UI (was causing refresh loops)
- Restructured dashboard to 3-column desktop layout: Budget Pillars (left), detail panels (center), Itinerary actions (right); removed center `max-w-4xl` cap
- PDF export restyled to dark theme with Muhaj logo, Arabic dua header, and Scheherazade New font for Arabic glyphs
- Implemented with Next.js 16 App Router, React 19, Tailwind CSS 4
- Misc expense amounts are entered in PKR and summed directly into the PKR total (per verification criteria)
- Requires `SERPAPI_KEY` in `.env.local` for live Google Flights
- Requires `GEMINI_API_KEY` in `.env.local` for live AI itinerary generation (free-tier Gemini API)
- `context/code-standards.md` still referenced in AGENTS.md but not yet authored

## Session Questions

- Confirm PKR/USD conversion constant (`278`) against live rate before trip planning
- Add real `GEMINI_API_KEY` to `.env.local` when ready to test live Gemini output (fallback works without it)
