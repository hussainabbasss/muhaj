# UI Context: Personalized DIY Budget Ziyarat Planner

## View Hierarchy & Layout Plan
The user interface is designed as a single-page, responsive dashboard optimized heavily for mobile viewports. The viewport layout follows a rigid hierarchy to keep critical calculation metrics anchored at all times:

```
+-------------------------------------------------------------+
|                     1. Sticky Global Header                 |
|  [App Title]                                    [Reset]     |
+-------------------------------------------------------------+
|                                                             |
|                     2. Master Cost Toggle Deck              |
|  [X] Flight   [X] Visa   [X] Hotels   [X] Food   [X] Transit|
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|                     3. Component Detail Workspace           |
|                                                             |
|  * Dynamic Route & Multi-Day Sequencer                      |
|  * Flight Date Selection & Current Lowest Fares             |
|  * Accommodation Selectors (Husseiniya / Inn Toggles)       |
|  * Local Budget Eatery Map / Mawkib Checkboxes              |
|  * Custom Miscellaneous Expenses Ledger                     |
|                                                             |
+-------------------------------------------------------------+
|                     4. Sticky Global Footer                 |
|  Total Budget: $440 USD | [Export Itinerary PDF]            |
+-------------------------------------------------------------+
```

---

## Component States & Global Toggles

The primary objective of this UI is giving the user **absolute granularity** over expense inputs. Every single core spending pillar can be completely bypassed or activated via a master checkbox interface. Toggling a pillar off completely renders its configuration panel inactive and drops its respective value to `0` inside the calculator engine.

### 1. Flight Pillar State
* **Active State:** Displays the top cached flight options pulled from the scraping engine, highlighting the cheapest 2-way routing options.
* **Bypassed State (`Checkbox = unchecked`):** Grayed out. Total flight cost displays as `$0.00`. Useful if a ticket has already been booked externally or purchased with airline miles.

### 2. Visa Pillar State
* **Active State:** Displays direct official E-Visa URLs, standard processing fees, and document check-lists.
* **Bypassed State (`Checkbox = unchecked`):** Sets visa cost calculation to `$0.00`. Useful for itineraries relying on dual passports, pre-arranged group entries, or special visa-on-arrival waivers.

### 3. Accommodation / Hotel Pillar State
* **Active State:** Exposes an internal selection toggle between:
  * *Economy Inns/Hotels:* Renders a simple daily slider to adjust expected night rates.
  * *Husseiniyas/Mawkibs:* Instantly overrides the day rate to `$0.00`, revealing the telephone and address directory.
* **Bypassed State (`Checkbox = unchecked`):** Removes accommodation from the calculation entirely.

### 4. Food Pillar State
* **Active State:** Exposes a toggle between *Mawkib Free Catering* (`$0.00`) and *Local Eatery Map* (activates a daily budget slider to account for purchasing shawarma, falafel, or local markets).
* **Bypassed State (`Checkbox = unchecked`):** Sets food overhead to zero.

### 5. Inter-City Transit Pillar State
* **Active State:** Displays selectable transit routes (e.g., `Najaf -> Karbala`, `Karbala -> Samarra`) and calculates total coaster/shared taxi fares.
* **Bypassed State (`Checkbox = unchecked`):** Sets transit overhead to `$0.00` (e.g., if hitching a ride or walking the entire Arbaeen Najaf-to-Karbala Pole route).

---

## Miscellaneous Expenses Ledger
To prevent hidden or unexpected costs from breaking the budget, a dedicated **Miscellaneous Expenses Ledger** is positioned right above the footer calculations. 

* **Dynamic Row Entry:** The user can click an `[+ Add Custom Expense]` button to instantly append a custom cost line.
* **Input Fields:** Each row provides a text input field for the label (e.g., "Zain Zain SIM Card Data Pack", "Emergency Souvenirs") and a numeric input field for the absolute cost in USD or Iraqi Dinar (IQD).
* **Real-time Summation:** As characters or numbers are written inside these fields, the global state engine recalculates the total budget calculation seamlessly without requiring a save button.

---

## Interactive Workflow & Micro-interactions
* **The Bottom Sheet Calculation Stick:** The absolute total cost is permanently anchored to the bottom screen edge on mobile layout configurations. When values change in the workspace above, the total value shifts with a subtle color flash (Green for savings drop, Amber for cost increase).
* **Single-Action Export:** Clicking the primary floating action button (`Export Itinerary PDF`) flashes an execution loader, generates a standalone layout file containing all active configuration notes and pinned addresses, and initiates an immediate client-side browser download.
