# Project Overview: Personalized DIY Budget Ziyarat Planner

## Product Definition
The **DIY Budget Ziyarat Planner** is a highly streamlined, personalized web application designed to eliminate the commercial markup of traditional *kafilas* (caravans). Built specifically as a personal utility tool for an independent pilgrimage to Karbala and other holy cities in Iraq, it aggregates real-time budget flight options, direct visa procedures, public transit documentation, hyper-local budget eateries, and low-cost/free communal accommodations (Husseiniyas). The platform acts as a decentralized, unbundled travel dashboard that provides a dollar-accurate itinerary blueprint.

## Goals
* **Cost Minimization:** Reduce the overall financial barrier of the spiritual journey by up to 50% compared to luxury packaged tours.
* **Operational Simplicity:** Automate price tracking and link aggregation to bypass third-party agents and brokers.
* **Resource Centralization:** Consolidate fragmented regional travel mechanics (shared taxis, local street food hubs, e-visa steps) into a single, cohesive dashboard.

## Target Users
* **The Individual Builder (Primary):** A tech-savvy, budget-conscious independent pilgrim looking for a hyper-efficient, spiritually focused, and fluff-free journey to Iraq without the overhead of 10-dish buffet packages or luxury hotel bundles.

## Features
* **Targeted Route Flight Monitor:** Automated scraping scripts that track specific budget airline routes (e.g., Air Arabia via Sharjah, Flydubai, Gulf Air) from the user's nearest hub (e.g., Karachi) directly to Najaf or Baghdad with real-time price alerts.
* **Direct Visa Portal Roadmap:** A curated dashboard tracking requirements, direct links, and step-by-step instructions for the official Iraqi MoI E-Visa platform (`evisa.iq`) or Visa-on-Arrival paths.
* **Inter-City Public Transit Router:** An operational log mapping public *coaster* (mini-bus) hubs and *Gara* (shared taxi) terminals connecting Najaf, Karbala, Kazmain, and Samarra with transparent fare benchmarks.
* **Mawkib & Husseiniya Vault:** A hardcoded registry containing locations, contact numbers, and operational hours of free or ultra-low-cost communal lodging spaces/tents.
* **"1-Dish" Local Food Map:** A location-tagged GPS interface featuring verified, clean, and highly economical street food vendors (falafel, shawarma, Kahi) around the vicinity of the Harams to limit daily food costs to under $5–$10.
* **Single-Click Itinerary Exporter:** A master budget utility tracking real-time choices that compiles flights, transport legs, accommodation, and food targets into a lightweight PDF summary equipped with absolute coordinates and direct links.

## Technical Stack
* **Frontend:** Next.js (App Router), styled with Tailwind CSS, optimized for mobile viewports.
* **Data Scrapers:** Python (Playwright / BeautifulSoup) executing via GitHub Actions to systematically scan regional budget carriers.
* **Database & Backend:** Supabase (Free Tier) for lightweight PostgreSQL storage of pinned coordinates, contact numbers, and active budget profiles.
* **Deployment:** Vercel for instant serverless hosting.

## Data Model
```
+--------------------+            +-------------------+
|    UserBudget      |            |    FlightRoute    |
+--------------------+            +-------------------+
| id (UUID, PK)      |            | id (UUID, PK)     |
| target_days (INT)  |            | airline (TEXT)    |
| visa_cost (NUM)    |            | price (NUM)       |
| total_est (NUM)    |            | departure (DATE)  |
+---------+----------+            +-------------------+
          |
          | 1
          |
          | M
+---------v----------+            +-------------------+
|    SavedLocation   |            |   TransitRoute    |
+--------------------+            +-------------------+
| id (UUID, PK)      |            | id (UUID, PK)     |
| name (TEXT)        |            | origin (TEXT)     |
| type (ENUM)        |            | destination (TEXT)|
| lat (NUMERIC)      |            | transport_type    |
| lng (NUMERIC)      |            | est_fare (NUM)    |
| contact (TEXT)     |            +-------------------+
+--------------------+
```
* `type` Enum constraints: `[ 'Husseiniya', 'BudgetHotel', 'StreetFood' ]`

## Project Scope
* **In-Scope:**
    * Automating flight price tracking for specific regional budget airlines.
    * Mapping core walking paths, budget food stands, and public transit nodes.
    * Storing addresses, phone numbers, and emergency resources for reference.
    * Building the reactive web-based budget totalizer.

## Out of Scope
* **Out-of-Scope:**
    * Multi-user authentication, monetization, or commercial payment gateways.
    * Live GPS tracking inside the web application (will delegate to native Google Maps protocol links).
    * Direct deep-link API booking engines for local Iraqi transport.
    * Offline/PWA mode, service workers, or network status indicators.

## Success Criteria
* **Cost Efficiency:** The app successfully maps out an end-to-end, realistic 7-to-10 day itinerary that stays securely under the target budget threshold.
* **System Reliability:** The web app loads quickly and budget calculations remain accurate across page refreshes via browser localStorage.
* **Execution Speed:** Automated price scrapers successfully deliver daily alerts when budget airline seats drop to designated target prices.
