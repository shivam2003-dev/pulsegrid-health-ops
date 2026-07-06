# PulseGrid Pitch Deck

## Slide 1: Title

PulseGrid: Voice-first AI command centre for district PHC/CHC operations.

One-line pitch: PulseGrid turns PHC registers and WhatsApp updates into live forecasts, fair facility scores and actionable medicine redistribution orders.

## Slide 2: Problem

PHCs and CHCs face recurring stock-outs, unmanaged footfall, bed pressure, unpredictable doctor availability and test unavailability. Most tracking is manual, delayed and fragmented across registers, HMIS, e-Aushadhi/DVDMS and local calls.

## Slide 3: Adoption Killer

The real failure mode is not model accuracy. It is data entry. PHC staff will not maintain one more app.

PulseGrid avoids that by using:

- WhatsApp voice notes in Hindi and regional languages.
- Photos of existing stock, OPD, bed and lab registers.
- IVR calls for low-connectivity blocks.
- Imports from e-Aushadhi/DVDMS, HMIS, ABDM facility registries and eSanjeevani where available.

## Slide 4: Solution

PulseGrid creates a live district health operations twin:

- Stock monitoring.
- Patient footfall.
- Bed availability.
- Doctor service continuity.
- Test availability.
- Early stock-out warnings.
- Demand forecasts.
- District redistribution recommendations.
- Under-resourced centre flags.

## Slide 5: Live Demo Flow

1. A pharmacist sends a Hindi voice note.
2. The system extracts ORS, paracetamol, malaria RDT and OPD fever counts.
3. The stock-out queue updates immediately.
4. The redistribution engine recommends a transfer from a nearby PHC.
5. A draft transfer order is created for CMO review.
6. The district copilot explains what to do before Monday.

## Slide 6: Technical Architecture

Capture layer:

- WhatsApp/IVR/PWA.
- OCR for register photos.
- e-Aushadhi/DVDMS/HMIS/eSanjeevani adapters.

AI layer:

- Speech-to-text.
- Translation.
- OCR.
- LLM extraction and anomaly explanation.
- Forecasting and optimization services.

Ops layer:

- Cloud Run APIs.
- Cloud SQL/PostGIS.
- Pub/Sub ingestion.
- Cloud Scheduler jobs.
- BigQuery/Looker analytics.

## Slide 7: AI Execution

- LLM extracts structured events from multilingual voice/OCR text.
- Gradient boosting forecasts medicine demand where data exists.
- Seasonal baselines handle sparse facilities.
- Croston/TSB handles intermittent demand items.
- Anomaly detection flags suspicious service gaps.
- Min-cost flow generates redistribution recommendations.

## Slide 8: Why It Is Different

Generic teams will submit dashboards and SMS alerts. PulseGrid is different because:

- It is passive capture first, not app-data-entry first.
- It optimizes across a district graph, not one facility at a time.
- It separates local failure from upstream supply and staff-vacancy issues.
- It generates draft transfer orders, not just warnings.

## Slide 9: Inclusivity

- Hindi plus Marathi demo.
- Voice-first for low-literacy staff.
- IVR fallback for feature phones and weak internet.
- Works on a Rs 6,000 Android phone.
- Store-and-forward design for 2G/rural blocks.

## Slide 10: Impact

District administrators can reduce:

- Stock-out days.
- Emergency indents.
- Avoidable referrals.
- Hidden test downtime.
- Unfair blame on facilities affected by upstream failures.

## Slide 11: Deployment

Hackathon deployment:

- Static prototype on GitHub Pages.
- CI/CD through GitHub Actions.

Pilot deployment:

- District NHM pilot with 30-50 facilities.
- Integrate with e-Aushadhi/DVDMS exports and HMIS reconciliation.
- Measure stock-out days, transfer-order closure time and service readiness.

## Slide 12: Ask

Approve a district pilot with the CMO office, district store and 30 PHCs/CHCs for 8-12 weeks.
