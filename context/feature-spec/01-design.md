# 01-Design: UI Architecture & Interactive States

## Overview
The interface for the **DIY Budget Ziyarat Planner** is engineered as a lean, single-page, data-dense web application. Optimized strictly for a "mobile-first" layout, it operates as an interactive local ledger and travel checklist for a single user navigating on the ground in Iraq. 

The design emphasizes total granular control over financial variables. By providing visual component isolation, a master cost-activation deck, and fluid client-side summation, the app enables immediate budget reconfiguration. This architecture eliminates layout clutter and focuses on immediate utility.

---

## Detailed Interface Blueprint

### 1. Sticky Global Header
A low-profile persistent top bar providing operational context.
* **App Title:** Displays the planner name with Karbala-themed styling.
* **Global Reset:** A discrete icon button to flush local budget state and restore defaults.

### 2. Master Cost Toggle Deck
The core budget orchestration component. Positioned at the top of the scroll container, it consists of a responsive checkbox cluster mapping each independent travel pillar:
* `[X] Flight Cost Monitor`
* `[X] Official E-Visa Fee`
* `[X] Accommodations & Lodging`
* `[X] Food & Chai Budget`
* `[X] Inter-City Public Transit`

Toggling any checkbox triggers an immediate transition state:
* **Checked (Active):** The corresponding details card below expands with full data controls (sliders, flight lists, maps) and injects its values into the master cost accumulator.
* **Unchecked (Bypassed/Zeroed):** The details card collapses or grays out completely. The state engine immediately sets that pillar’s cost to `$0.00 / 0 PKR`, reflecting scenarios where the user is using frequent flyer miles, a pre-arranged visa, or sleeping/eating entirely for free at the *Mawkibs*.

### 3. Component Details Workspace
A scrollable vertical stack of context-specific panels that dynamically respond to the Master Toggle Deck.

#### A. Flight Sniper Terminal
* Visible when "Flight Cost Monitor" is active.
* Displays a list of the lowest scraped 2-way itineraries matching budget carrier routing rules (e.g., Karachi to Najaf, or Karachi to Sharjah/Dubai multi-city split legs).
* **Lite-Fare Filter Toggle:** A nested control to strip out checked-baggage fees, dropping the calculated cost to basic 7kg hand-luggage-only parameters to slice fares to the absolute minimum.

#### B. Visa Roadmap Card
* Visible when "Official E-Visa Fee" is active.
* Displays the fixed official government fee benchmark and a clear, un-styled check-list of required documents. Includes a direct launcher link to the official `evisa.iq` portal, bypassing agency processing markups.

#### C. Accommodation Hub
* Visible when "Accommodations & Lodging" is active.
* Features a prominent sub-toggle:
  * **[Paid Economy Inn]:** Reveals a daily rate slider (defaulting to low-tier local hotel baselines) multiplied by a "Number of Nights" counter.
  * **[Free Husseiniya / Haram Base]:** Instantly zeroes out the cost. It exposes a pre-seeded directory of permanent communal halls and the Ataba Pilgrim Cities (*Madinat al-Zairin*), including exact address strings and localized contact numbers.

#### D. Sustenance Log
* Visible when "Food & Chai Budget" is active.
* Features a sub-toggle:
  * **[Mawkib Free Catering]:** Hardcodes the food overhead to `$0.00 / 0 PKR` and renders a short text-card guide regarding off-season courtyard resting guidelines and basement (*Sardab*) protocols.
  * **[Local Eatery Map]:** Activates a daily allowance slider (allowing a tight budget of under $5-$10/day) and renders a minimalist list of coordinates for high-value, safe street food spots (falafel, shawarma) near the Haram gates.

#### E. Public Transit Router
* Visible when "Inter-City Public Transit" is active.
* Displays a selectable route sequencing matrix (e.g., `Najaf -> Karbala`, `Karbala -> Kazmain -> Samarra`). 
* Shows fixed local currency cost metrics for public shared *coasters* (mini-buses) and *Gara* shared taxi terminals, automatically updating transit costs based on selected legs.

#### F. Miscellaneous Expenses Ledger
* Continuously visible to capture unstructured spending.
* Provides a dynamic row injection table. Clicking `[+ Add Custom Expense]` appends a new row containing a string field for the label (e.g., "Zain SIM Card Data Pack") and a numeric field for the absolute cost.
* Each row features a quick-delete `[X]` icon button to instantly drop the custom liability from the calculation engine.

### 4. Floating Operational Footer
A high-contrast bottom bar anchored permanently to the viewport edge.
* **Dual-Currency Totalizer:** Displays the absolute aggregated financial layout concurrently in United States Dollars (USD) and Pakistani Rupees (PKR) based on local conversion constants.
* **Visual Cost-Shift Indicators:** When variables are manipulated above, the total amount flashes color momentarily—fading to green for a cost reduction or amber for an expense increase.
* **Primary Action Launcher:** A large, prominent button labeled `[Export Itinerary PDF]`. Triggering this converts the current configuration matrix, pinned addresses, emergency phone lines, and chosen routes into a highly structured, single-sheet portable document downloaded straight to local storage.

---

## Scope Layout

### In Scope
* Fully responsive, mobile-first single page UI wrapper.
* React/Next.js client-side state machine recalculating total expenditures across all toggles and miscellaneous input strings in real time.
* Local storage persistence mechanisms that save the user's checked options, custom ledger inputs, and layout preferences across page refreshes.
* Local document rendering pipeline translating active screen variables into a clean, downloadable PDF file.

### Out of Scope
* Multi-user configuration management, credential authentication portals, or cloud-synchronized profile accounts.
* Interactive real-time mapping modules or integrated map rendering frameworks (all maps delegate to static text-wrapped coordinates and external deep-linking map protocols).
* Direct transactional integrations, embedded checkout workflows, or live flight booking engines.
* Offline/PWA mode, service workers, network status badges, or sync indicators.

---

## Verification Criteria

| Test Scenario | Action Sequence | Expected System Outcome | Pass / Fail |
| :--- | :--- | :--- | :--- |
| **Global Cost Deactivation** | Uncheck every option in the Master Cost Toggle Deck and clear the Miscellaneous Ledger. | Global Footer totalizer drops instantly to exactly `0 USD / 0 PKR` and all corresponding workspace sections collapse. | |
| **Instant Ledger Recalculation** | Click `[+ Add Custom Expense]`, input label "Test Item", and enter cost value `5000`. | The bottom sheet totalizer increments by exactly `5,000` units immediately on keypress without UI lag or refresh. | |
| **Dynamic Document Assembly** | Configure an custom mix of toggles, input two miscellaneous items, and click `[Export Itinerary PDF]`. | A clean, properly structured PDF is compiled and downloaded to the local device containing only the active, configured steps and coordinates. | |
