# ArogyaGrid: Voice-First District Health Operations Platform

## Obvious Solutions To Avoid

1. Inventory dashboard + LSTM demand forecast + SMS stock-out alerts.
2. PHC mobile app where pharmacist/nurse fills daily stock, beds, doctor attendance, lab status.
3. IoT smart shelves/RFID/barcodes for every medicine.
4. Patient queue/token system + bed availability dashboard.
5. Admin chatbot over monthly HMIS reports.

ArogyaGrid is designed against these on four axes: passive capture instead of forms, district-level optimization instead of dashboards, explainable risk attribution instead of ranking/shaming, and integration with existing government rails instead of a parallel MIS.

## Novel Solution Concepts

### 1. Passive District Health Ops Twin

A WhatsApp/IVR/photo-first system that builds a live operational twin of all PHCs/CHCs, then solves stock redistribution as a graph optimization problem.

Unfair advantage: it treats dusty registers, voice notes, e-Aushadhi exports, and OPD sheets as first-class data sources, so adoption does not depend on new data entry.

### 2. Disease-Season Demand Radar

Forecast medicine, test, and bed demand using seasonal disease calendars, rainfall/weather, school exams, market days, melas, harvest migration, and local outbreak signals.

Unfair advantage: it predicts demand before consumption appears in stock registers.

### 3. Non-Surveillance Facility Reliability Engine

Detect likely doctor absence, test downtime, and service collapse from indirect service fingerprints: OPD volume, prescription cadence, eSanjeevani sessions, lab test mix, and patient diversions.

Unfair advantage: it flags operational gaps without installing attendance surveillance, making it easier to adopt politically and socially.

Strongest concept: ArogyaGrid, with concepts 2 and 3 embedded.

## Full Blueprint

### Data Capture Layer

Hard constraint: everything must work through WhatsApp/IVR/PWA on a Rs 6,000 Android phone, compressed images, store-and-forward sync, and SMS fallback. Demo languages: Hindi and Marathi.

| Stream | Near-zero-effort capture | Fallback | Notes |
| --- | --- | --- | --- |
| Stock | Pharmacist sends voice note such as "ORS 18 packet, paracetamol 10 strip, malaria RDT khatam." LLM extracts item, quantity, unit, confidence. | Photo of stock register with OCR. | Import e-Aushadhi/DVDMS stock, indents, issues, and batches where available. |
| Footfall | Daily OPD register photo, eSanjeevani session count, or 20-second IVR summary. | HMIS monthly aggregate import. | Store aggregate counts only: OPD, fever, ANC, diarrhoea, NCD, referrals. |
| Beds | CHC bed board photo or IVR: "male ward full, female ward 2 khali, delivery room 1." | Manual district-call-center update. | PHCs should be treated as observation capacity, not full inpatient bed systems. |
| Attendance | Use existing attendance systems where present. Otherwise infer service continuity from prescription cadence, OPD patterns, eSanjeevani sessions, and signed register activity. | MO verification for suspicious gaps. | Avoid camera/biometric surveillance in the hackathon pitch. |
| Test availability | Weekly lab shelf photo plus voice note for Hb strips, malaria/dengue RDT, pregnancy kits, reagents. | Lab register photo OCR. | Link test stock to syndrome footfall, especially fever and ANC. |

### Forecasting

| Problem | Recommended model | Why |
| --- | --- | --- |
| Medicine demand | LightGBM/CatBoost quantile model where history exists; Croston/TSB for intermittent demand; seasonal naive for sparse items. | Government facility data is sparse, censored by stock-outs, and uneven across items. |
| Footfall | Seasonal baseline + gradient boosting with weather/event features. | Captures weekly market-day and seasonal disease patterns without overfitting. |
| Bed occupancy | Queue/occupancy model using arrivals, average length of stay, delivery load, and referral pressure. | More explainable than black-box sequence models. |
| Test demand | Tied forecast from syndrome footfall. Fever drives malaria/dengue/RDT demand; ANC drives Hb/pregnancy/urine tests. | Tests are service-linked, not independent retail demand. |
| Cold-start facilities | Borrow from matched facilities by type, catchment, rural/tribal profile, IPHS norm, and district HMIS average. | Handles PHCs with little digital history. |

The LLM is used for parsing messy language and explaining anomalies. It should not be the primary numerical forecaster.

### Stock-Out Early Warning

Core logic:

```text
days_on_hand = usable_stock / forecast_daily_demand_p75
reorder_point = demand_during_lead_time + safety_stock
```

Lead times must reflect government procurement:

- PHC to district store issue: 2-7 days if stock is available.
- Indent approval and block movement: 7-21 days.
- State procurement or replenishment: 30-90 days.

Escalation:

1. Pharmacist: verify stock/photo.
2. Medical Officer: approve indent or transfer request.
3. District store: allocate stock.
4. CMO/DPM: intervene if unresolved beyond SLA.

### Redistribution Engine

Model the district as a graph.

- Nodes: PHCs, CHCs, district warehouse.
- Edges: road distance/time, transport cost, cold-chain availability.
- Lots: item, quantity, batch, expiry, storage condition.

Objective:

```text
minimize stockout_penalty
       + transport_cost
       + expiry_waste
       + cold_chain_violation_penalty
       + equity_penalty
```

Constraints:

- Sender cannot fall below buffer stock.
- Receiver cannot exceed storage capacity.
- FEFO: earliest-expiry-first movement.
- Cold-chain items only on valid routes.
- Emergency reserve at CHCs.
- Same program/accounting pool unless district override is recorded.

Output: a draft transfer order with item, quantity, source, destination, batch/expiry, route, vehicle, and human approval status.

### Facility Scoring

ArogyaGrid uses a transparent Health Centre Health Score:

- Stock resilience.
- Service continuity.
- Footfall pressure.
- Bed pressure.
- Test readiness.
- Data freshness/confidence.
- Referral burden.
- Upstream dependency.

To avoid unfair punishment, every risk is tagged:

- Controllable: no stock update, unverified closure, local stock mismanagement.
- Shared/systemic: district warehouse stock-out, sanctioned staff vacancy, road/flood disruption, epidemic surge.
- Uncontrollable: procurement failure, official doctor vacancy, cold-chain breakdown outside facility.

Gaming resistance comes from cross-signals: voice note vs register photo vs e-Aushadhi issue vs OPD prescription demand.

### Integration And Compliance

- ABDM: use Health Facility Registry IDs and ABDM-aligned facility metadata. ABHA is not needed because this is aggregate operations, not patient records.
- e-Aushadhi/DVDMS: read stock, indents, issues, and batches; write draft indents only after human approval.
- HMIS: reconcile monthly aggregate service data.
- eSanjeevani: import assisted teleconsult counts where available.
- IPHS 2022: use PHC/CHC norms for service readiness.
- Essential medicines: seed item master from NHSRC/NHM essential medicine lists.
- DPDP Act 2023: store aggregate operational data only; redact names from register images; delete raw images after extraction; log purpose, retention, and access.

## 48-Hour Hackathon Build Plan

### Build

- Synthetic district: 30 PHCs, 2 CHCs, 1 district store, 40 medicines/tests, 180 days history.
- Web dashboard: map, facility score, stock-out queue, redistribution recommendations, copilot.
- Spring Boot API + PostgreSQL/PostGIS if building full-stack.
- Python FastAPI ML service for OCR/parser, forecasts, anomaly scoring, and OR-Tools min-cost flow.
- WhatsApp-like demo panel: upload Hindi/Marathi audio or type simulated voice transcript.
- OCR with Tesseract/EasyOCR.
- LLM extraction from noisy voice/OCR text into structured stock events.
- Forecast demo using LightGBM or quantile baseline.
- OR-Tools redistribution engine.

### Mock

- Real e-Aushadhi/HMIS/ABDM APIs.
- Official WhatsApp Business approval.
- Real procurement order dispatch.
- Biometric attendance.

### Suggested Stack

- Frontend: Next.js or static HTML/CSS/JS for fastest demo.
- Backend: Java Spring Boot for APIs, Python FastAPI for forecasting/optimization.
- Data: PostgreSQL + PostGIS.
- Optimization: Google OR-Tools.
- OCR: Tesseract/EasyOCR.
- Deployment: Docker Compose locally; Cloud Run/EC2 only if a public demo URL is required.

### Open Data Seeds

- HMIS public reports: https://hmis.mohfw.gov.in/
- NHM MIS and Free Drugs material: https://nhm.gov.in/
- IPHS 2022: https://nhsrcindia.org/IPHS2022/iphs-2022-guidelines
- Essential medicines lists: https://qps.nhsrcindia.org/free-drugs-service-initiatives/essential-medicines-list
- OpenStreetMap distances.
- Synthetic weather/event calendar.

### 3-Minute Demo Script

0:00: "This district has 32 facilities. Red means stock-out risk before procurement can catch up."

0:30: Upload Hindi voice note: "PHC Bhairavpur mein ORS 18 packet, paracetamol 10 strip, malaria RDT khatam."

0:50: System extracts stock, confidence, item mapping, and updates facility twin.

1:10: Wow moment: alert appears: "ORS stock-out in 6 days; procurement lead time 21 days."

1:25: Redistribution engine recommends transfer from nearby PHC with 46 days cover and near-expiry stock.

1:50: One-click draft transfer order generated for district store.

2:10: Ask copilot: "CMO ko batao kaunse centres Monday se pehle intervene karne hain."

2:35: Copilot answers with 3 facilities, reasons, confidence, and whether the issue is local or upstream.

## One-Line Pitch

ArogyaGrid is a voice-first district health operating system that turns PHC registers and WhatsApp updates into live forecasts, fair facility scores, and actionable medicine redistribution orders.

## Likely Judge Questions

### How is this different from e-Aushadhi or HMIS?

e-Aushadhi/DVDMS is mainly the transaction backbone for drug inventory and warehouses; HMIS is aggregate reporting. ArogyaGrid is the intelligence and action layer: passive capture, dirty-data reconciliation, early warnings, demand forecasting, and district-wide redistribution optimization.

### How do you get PHC staff to use it?

Do not ask them to use a new MIS. Let them send what they already have: voice note, register photo, IVR response, or existing exports. The immediate benefit goes back to them: fewer angry patients, faster replenishment, and less blame because the system shows whether the failure is local or upstream.

### Is AI reliable enough for government stock decisions?

AI should recommend, not auto-transfer. Every prediction has confidence, source evidence, and a human approval step. The optimizer creates draft orders; the district store or MO approves. For low-confidence OCR or voice extraction, the system asks for one-tap verification.

## Post-Hackathon Sustainability

Start with an NHM district pilot as a decision-support layer over e-Aushadhi/HMIS, not a replacement. Sign a district administration/CMO MoU for 30-50 facilities, prove reduction in stock-out days and emergency indents, then package it for state health department procurement as AI decision support for Free Drugs Service Initiative and IPHS readiness monitoring.
