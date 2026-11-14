# Project Specification: MotoVault — Skeuomorphic Motorcycle Companion & Touring Log

## 1. Executive Summary & Design Philosophy
**MotoVault** is a tactile, skeuomorphic web application designed for motorcyclists, tourers, and daily riders. Moving away from flat, sterile interfaces, MotoVault mimics the physical feel of a weathered leather touring logbook, brushed aluminum instrument clusters, analog gauges, tactile toggle switches, and laminated emergency cards. 

The application serves as a single source of truth for a rider's machine, maintenance history, active trip itineraries, roadside assistance (RSA), packing/toolkit inventory, and an integrated AI Mechanic & Touring Co-Pilot.

### Visual & UI Language (Skeuomorphism)
* **Color Palette:** 
  * *Primary Surfaces:* Saddle brown leather (`#3E2723`, `#4E342E`), brushed gunmetal steel (`#263238`, `#37474F`), and warm parchment/cream paper (`#F5F0E6`) for logbook entries.
  * *Accents:* Gauge needle orange (`#FF5722`), brass/gold hardware (`#D4AF37`), high-visibility emergency red (`#D32F2F`), and phosphor green (`#00E676`) for digital trip computer readouts.
* **Textures & Depth:** Subtle leather grain noise, stitched border overlays (`border-dashed` with inner drop shadows), beveled metallic buttons with active `:pressed` states, inner shadows for recessed gauge dials, and realistic drop shadows for stacked physical cards (insurance, RSA).
* **Typography:** 
  * *Headers/Gauges:* Condensed industrial sans-serif or stencil (`Oswald` / `Chakra Petch`).
  * *Logbook/Notes:* Typewriter or clean serif (`Courier Prime` / `Merriweather`).
  * *Digital Readouts:* Monospace (`JetBrains Mono`).

---

## 2. Core Modules & Functional Requirements

### Module A: Garage & Vehicle Profile ("The Spec Plate")
* **Bike Details:** Make, model, year, VIN/Chassis number, Engine number, registration plate (styled like an embossed physical license plate), tire pressure specs (front/rear), and oil grade specs.
* **Digital Owner's Manual:** Quick-access drawer/viewer for uploaded PDF manuals or quick-reference torque specs, fuse box diagrams, and warning light meanings.
* **Insurance Vault:** Styled as a laminated glovebox card. Displays provider, policy number, expiry countdown gauge, IDV, coverage type, and a one-tap claim helpline button.

### Module B: Service, Maintenance & Fuel Log ("The Workshop Ledger")
* **Vehicle Service History:** Chronological logbook styled like lined workshop paper.
  * Tracks: Date, Odometer reading, Service Center/Mechanic, Total Cost.
  * **Itemized Breakdown:** Distinguishes between *Consumables/Products used* (e.g., Motul 7100 10W40, chain lube) and *Parts Replaced* (e.g., brake pads, air filter) with individual part numbers and costs.
* **Maintenance Health Gauges:** Analog-style radial gauges or progress bars showing remaining life for key components (Engine Oil, Chain & Sprocket, Front/Rear Tires, Brake Pads) calculated automatically from current odometer vs. last replacement odometer.
* **Fuel Details & Summary:** 
  * Quick-entry "Fuel Pump" modal to log liters, price/liter, total cost, fuel station, and odometer.
  * **Analytics Summary:** Calculates real-time mileage ($\text{km/L}$ or $\text{MPG}$), cost per kilometer, total fuel spend, and range estimation.

### Module C: Active Trip & Itinerary ("The Touring Map")
* **Current Destination & Route:** Displays current active trip name, origin, destination, current leg progress bar, and total distance covered vs. remaining.
* **Day-by-Day Itinerary:** Interactive timeline/accordion showing daily waypoints, planned stops, stay details, fuel stops, and road condition notes.

### Module D: Emergency, RSA & State-Wise Helplines ("The Red Box")
* **Multi-RSA Wallet:** Ability to store multiple Roadside Assistance memberships (e.g., Manufacturer RSA, Insurance Add-on RSA, Third-party club like Allianz/TVS Auto Assist). Styled as physical membership cards with policy IDs, validity, and direct `tel:` dial triggers.
* **State-Wise Emergency Directory:** Filterable/searchable directory organized by State/Region (e.g., Karnataka, Maharashtra, Himachal Pradesh, Ladakh, etc.) containing:
  * State Highway Patrol / Police (`112` / regional numbers)
  * Ambulance & Trauma Centers
  * State-specific RTO/Transport helplines & local towing contacts.
* **Personal Emergency Contacts (ICE):** Blood group badge, medical allergies, and primary/secondary family emergency contacts.

### Module E: Gear, Luggage & Toolkit Inventory ("The Saddlebag")
* **Tool Kit Details (What & Where):** 
  * Tracks every tool carried (e.g., 10mm/12mm spanners, tire plug kit, portable inflator, master link, zip ties).
  * **Exact Location Mapping:** Tags *where* each tool is stored on the bike (e.g., *Under-seat tray*, *Left pannier inner pocket*, *Tail bag front pouch*, *Tank bag*) so the rider isn't digging through luggage on the side of a highway.
* **Things / Stuff I Am Carrying (Packing Checklist):** Categorized checklist (Riding Gear, Electronics/GoPro, Clothing, Documents, First Aid) with weight/bag assignment and packed/unpacked physical toggle switches.

### Module F: AI Mechanic & Touring Co-Pilot ("MotoBot")
* **Context-Aware AI Chatbot:** Powered by Gemini, with full read-access to the user's current app state (bike specs, last service date, current odometer, tools currently packed, and active trip itinerary).
* **Key Capabilities:**
  * *Troubleshooting:* "My chain is making a clicking noise near Manali—what tools in my kit do I need to adjust it?" (AI checks the user's actual toolkit list and bike manual specs).
  * *Cost & Service Queries:* "How much have I spent on brake pads and engine oil this year?"
  * *Trip & Emergency Assist:* "Give me the emergency numbers for the state I am entering tomorrow based on my itinerary."

---

## 3. Data Architecture (JSON Schema Overview)
To seamlessly transition from prototype to a working app in Google AI Studio, state should be structured cleanly in `localStorage` / React Context:
* `bikeProfile`: `{ make, model, year, regNumber, vin, engineNo, odoCurrent, specs: { oil, frontPsi, rearPsi } }`
* `insurance`: `{ provider, policyNo, expiryDate, helpline, notes }`
* `serviceLogs`: `Array<{ id, date, odo, workshop, totalCost, productsUsed: [], partsReplaced: [] }>`
* `fuelLogs`: `Array<{ id, date, odo, liters, cost, station, fullTank: boolean }>`
* `trips`: `{ activeTripId, list: Array<{ id, title, destination, status, itinerary: Array<{ day, route, stays, notes }> }> }`
* `emergency`: `{ bloodGroup, personalContacts: [], rsaProviders: [], stateHelplines: Record<StateName, Contacts[]> }`
* `inventory`: `{ tools: Array<{ id, name, location, status }>, luggage: Array<{ id, item, category, bagLocation, packed }> }`