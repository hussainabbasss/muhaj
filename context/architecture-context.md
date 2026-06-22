# Architecture Context: Personalized DIY Budget Ziyarat Planner

## System Overview
The **DIY Budget Ziyarat Planner** is designed as a lightweight, single-user, decentralized travel optimization utility. The architecture prioritizes low operational overhead and rapid data access. Routing and budgeting compilation run in a client-side Next.js application. Data collection is asynchronous, utilizing isolated automated scraping scripts managed via GitHub Actions that seed a cloud storage engine (Supabase), which the client app pulls reference data from.

## System Structure
The system is divided into three distinct operational layers:
1. **Asynchronous Scraping Engine (Data Collection Layer):** Decoupled Python-based scripts that execute via scheduled tasks to capture external flight updates.
2. **Cloud Storage & API Mirror (Data Persistance Layer):** A managed backend providing static reference data and flight metrics via RESTful endpoints.
3. **Client Dashboard (Presentation & Execution Layer):** A Next.js application that runs in the browser, handling localStorage persistence, calculation states, and route layout visualization.

```
+---------------------------------------------------------------------------------+
|                          Data Collection Layer                                  |
|  [Python Scraper (Playwright)] ---> (Executes on GitHub Actions Cron Schedule)   |
+---------------------------------------------------------------------------------+
                                         |
                                         v (Secure REST HTTPS)
+---------------------------------------------------------------------------------+
|                          Data Persistence Layer                                 |
|  [Supabase Managed PostgreSQL Instance] <--- (Reference Locations / Cached Fares)|
+---------------------------------------------------------------------------------+
                                         |
                                         v (REST Pull)
+---------------------------------------------------------------------------------+
|                          Presentation & Execution Layer                         |
|  [Next.js Client] <---> [Local Storage]                                         |
+---------------------------------------------------------------------------------+
```

## Component Responsibilities

### 1. Asynchronous Scraping Engine
* **Target Extraction:** Launches automated headless browser instances to check flight price matrix tables for budget regional carriers (e.g., Air Arabia, Flydubai).
* **Payload Sanitation:** Strips promotional bloat, parses raw response bodies into structured JSON, and filters out flights exceeding the strict budget ceiling.
* **Database Pipeline:** Upserts the freshest price points into the cloud persistence tier, overwriting stale data.

### 2. Client Dashboard
* **Client-Side State Management:** Manages UI reactivity for sliders and choices dynamically without making server roundtrips.
* **Local Persistence:** Saves user toggle and budget configuration to browser localStorage for continuity across page refreshes.
* **Export Assembly:** Generates standalone, portable PDF itineraries utilizing client-side document generation.

### 3. Database Layer (Supabase)
* **Data Hosting:** Serves as a tabular datastore holding fixed geographical points (coordinates of Mawkibs, Husseiniyas, local falafel stands) and transit hub metadata.
* **Connection Multiplexing:** Exposes instantaneous PostgREST APIs so the client can fetch reference data in a single payload pull.

## System Boundaries
* **External Flight Interfaces:** The scraping engine hooks directly into public-facing web elements of flight providers. No official business APIs or private endpoints are integrated.
* **External Navigation Mapping:** The client stores precise GPS float pairs (`latitude`, `longitude`). When execution requires directional navigation, the app offloads processing by initiating deep links into native system maps (`https://www.google.com/maps/search/?api=1&query=...`).
* **Identity & Authentication Boundary:** Completely boundaryless. Since it is constructed for personal, single-device deployment, authorization checks and user account verification systems are removed from the execution tree.

## Data Flow

### A. Flight Updates (Asynchronous Write Path)
1. GitHub Actions triggers the scraper script daily.
2. The script scrapes airfares from the target budget carrier.
3. Structured results are pushed directly to Supabase via standard SQL Upsert operations.

### B. Data Load & Calculation Path
1. The user launches the app in a browser.
2. The Next.js client fetches static location configurations and active flight tables from Supabase (when integrated).
3. The user adjusts travel variables (toggling a street food budget vs a $0 free Mawkib option).
4. The local React state engine re-computes totals instantly using stored data tables.

## Storage Model
The database uses a single-user relational design mapping structural parameters:
* **`flights` Table:** Keeps track of tracked airline configurations, current price matrices, and execution timestamps.
* **`locations` Table:** Stores static geographical metadata, classified strictly via an entity enum (`Husseiniya`, `BudgetHotel`, `StreetFood`).
* **`transit_hubs` Table:** Retains fixed pricing references for intra-city *coasters* and *Gara* shared taxis.
* **`LocalStorage`:** Retains client state configurations (e.g., user's current route sequence choice, current toggle configuration) to ensure UI continuity between page refreshes.

## Background Processing
* **GitHub Actions Cron Automation:** Configured to invoke the Python automation stack every 24 hours. The job installs minimal runtime headless binaries, validates network paths to regional carriers, parses parameters, updates rows, and exits cleanly. No continuous long-running background server processes are maintained.

## API Surface

### 1. Inbound Scraping Pipeline (Supabase PostgREST)
* `POST /rest/v1/flights` - Bulk payload insertion containing updated flight options.

### 2. Outbound Data Pipeline (Client Data Consumption)
* `GET /rest/v1/flights?select=*&order=price.asc` - Fetches lowest priced flights.
* `GET /rest/v1/locations?select=*` - Fetches absolute geographic references.
* `GET /rest/v1/transit_hubs?select=*` - Fetches internal fare matrices.

## Architectural Invariants
Architectural invariants represent unbreakable structural laws built into the system design:
* **Zero Real-time Computing Costs:** No component within the pipeline may generate per-minute hosting charges. Scraping runs on free GitHub runners, the frontend deploys to Vercel's hobby tier, and database resources stay strictly within Supabase free limits.
* **No Local State Storage in Cloud:** The cloud infrastructure tracks reference prices and locations only. No personal calculation configurations, toggle flags, or chosen dates are written to the cloud; they exist strictly inside the user's browser runtime environment.
