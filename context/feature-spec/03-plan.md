# 03-Plan: AI Itinerary Generator & Compliance Blueprint

## Overview

The **AI Itinerary Engine** handles the core scheduling layer of the DIY Budget Ziyarat Planner. To strictly respect the **Zero Real-time Computing Costs** mandate, this system utilizes the free tier of the **Gemini API** (`gemini-2.5-flash`) via an internal serverless edge route (`app/api/plan/route.js`).

By feeding the LLM raw user inputs paired with hardcoded geopolitical and religious calendar contexts, the module generates a highly structured, cost-aware daily itinerary. This output maps directly to the client-side UI and is bundled seamlessly into the final high-fidelity PDF export.

---

## Engine Inputs & Contextual Variables

The engine constructs a heavily engineered system prompt by combining runtime state inputs with localized environmental constants before hitting the Gemini API endpoint.

### A. Runtime State Vectors

* `outboundDate` / `returnDate` (Strings, format: `YYYY-MM-DD`)
* `accommodationType` (Enum: `"FREE_TRACK"` or `"HOTEL_3_STAR"`)
* `destinationFilter` (Enum: `"BOTH"` | `"NAJAF_ONLY"` | `"BAGHDAD_ONLY"`)

### B. Hardcoded Religious Calendar Matrix (2026 Baseline)

Because the Islamic calendar is lunar, the engine references an internal epoch mapping table to check if the user's dates intersect with peak high-density spikes:

* **Arbaeen Window (2026):** Approx. **August 3rd – August 5th, 2026** (20 Safar 1447 AH).
* **Ashura Window (2026):** Approx. **July 24th – July 26th, 2026** (10 Muharram 1447 AH).

> **AI Logic Constraint:** If the runtime dates overlap with these windows, the Gemini prompt automatically injects an `isPeakCrowd: true` flag. This forces the model to scale down transit speed expectations, adjust walking times between shrines, and surface critical logistical congestion warnings.

---

## Detailed Daily Routing Prompt Structure

When generating the daily plan, the model is strictly bound to the user's accommodation choice:

### If `FREE_TRACK` is selected:

* The itinerary routes overnight stays exclusively to the communal **Haram Basements (Sardabs)** or permanent brick-and-mortar **Husseiniyas** along the Najaf-to-Karbala pole walk (Masha).
* The model schedules daily drop-offs at the official *Amanat* (luggage storage) lockers at the outer security perimeters.
* Meal plans default strictly to the distributed **Mawakib** (free pilgrim hospitality tables) to maintain a true $0 daily sustenance overhead.

### If `HOTEL_3_STAR` is selected:

* The itinerary routes night slots back to standard commercial town-center grids (e.g., Al-Rasool Street in Najaf or Bab Al-Baghdad in Karbala).
* It optimizes geographic proximity to minimize local taxi costs, routing morning/evening walking windows to avoid peak high-temperature hours.

---

## Mandatory Emergency Metadata

To ensure safety and self-reliance, the bottom of every generated plan append-injects a static, highly visible **Emergency & Liaison Directory**. This directory does not require LLM processing and is hardcoded into the final payload:

| Institution / Helpline | Contact / Shortcode | Operational Focus |
| --- | --- | --- |
| **Iraqi Tourist Security Police** | `533` | Emergency security incidents & missing persons |
| **Ambulance & Medical Emergency** | `122` | First-aid routing & local hospital dispatch |
| **Red Crescent Society (Najaf)** | `+964 780 199 9231` | Heatstroke management & missing pilgrims |
| **Pakistan Embassy (Baghdad)** | `+964 770 484 2111` | Emergency passport/documentation loss |

---

## PDF Export Architecture & Styling Tokens

The component leverages `react-pdf` on the client side to generate a clean, professional, presentation-grade document that echoes your refined interface styling from **image_cef360.jpg**.

### Visual Presentation Rules for the PDF Compiler:

* **The Palette:** Built entirely using three consolidated styling tokens to ensure premium visual looks.
* *Primary Container:* Deep Emerald/Charcoal borders (`#062E03` or `#1A1A1A`) for header blocks.
* *Canvas Accent:* Crisp, soft cream background highlights (`#FDFBF7`) for content boxes.
* *Callouts:* Metallic Gold headers (`#D4AF37`) for critical action alerts.


* **Layout Blocks:** Daily schedules are rendered in clear, independent chronological blocks with alternating grid rows.
* **The Security Flap:** The PDF layout places a prominent, isolated top-row alert section containing the **Visa Compliance Address** (derived from your free-cancellation dummy hotel voucher) and your step-by-step **$50 Arrival Mandoob Cash Gate Protocol Checkpoint**. This ensures all critical immigration survival metrics are instantly scannable at a glance by the traveler.