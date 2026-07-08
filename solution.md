# ArogyaGrid Solution

## Summary

ArogyaGrid is a voice-first district health operations platform for PHCs, CHCs, district stores, CMOs, and public-health administrators. It turns 10-second WhatsApp voice notes, register photos, IVR answers, and existing health-system exports into live stock, footfall, bed, staffing, test-availability, forecast, redistribution, and accountability signals.

The core idea is simple: PHC staff should not fill another portal. ArogyaGrid captures operational reality through the channels staff already use, structures it with AI, forecasts shortages before lead-time windows close, and drafts transfer orders for district approval.

## Submission Form Answers

### Explain Your Solution

ArogyaGrid gives district administrators real-time visibility into every health centre. PHC staff send short voice notes, register photos, QR scans, or IVR responses. The platform parses those inputs into structured data for medicine stock, patient footfall, bed availability, doctor/service continuity, and test availability. Forecasting models identify centres that will run out of essential drugs before procurement lead times catch up. A graph optimizer proposes transfers between PHCs and CHCs while respecting expiry, buffer, distance, and cold-chain constraints. The dashboard shows facility health, risk, root causes, transfer orders, and a CMO copilot that answers operational questions in natural language.

### Technologies Used

The prototype is a static front-end demo deployed on GCP/GKE behind Argo CD. The pilot architecture uses FastAPI or Spring services, PostgreSQL/PostGIS, Redis, Bhashini/AI4Bharat or Sarvam-ready Indic speech and translation, OCR/vision models for register photos, LLM parsing for voice and copilot answers, forecasting models for stock-out risk, min-cost-flow optimization for redistribution, and WhatsApp/IVR integrations through Twilio or Exotel. The deployed demo is packaged with Docker/Nginx, Artifact Registry, GKE, Argo CD, Certificate Manager, and Vercel DNS.

### Presentation Upload

Use the ArogyaGrid Track 3 pitch deck. This file provides the written submission copy and technical evaluation mapping.

## Problem

District health systems often run on paper registers, monthly HMIS summaries, warehouse-level logistics, and ad-hoc WhatsApp escalation. By the time a stock-out or staffing gap is visible in an official report, patients have already been turned away.

ArogyaGrid addresses:

- Essential medicine stock-outs at PHC shelves.
- OPD and fever-season footfall surges.
- Invisible bed availability and referral failures.
- Doctor/service continuity gaps.
- Test availability gaps.
- Manual reports that arrive too late to act.

## Core User Flow

1. A PHC pharmacist sends a short Hindi/Telugu voice note or register photo.
2. AI extracts facility, drug, quantity, urgency, timestamp, and confidence.
3. The system updates the district stock and service state.
4. Forecasting checks demand, seasonality, lead time, and safety stock.
5. The graph optimizer proposes a transfer from surplus centres.
6. A district store officer reviews and approves the transfer order.
7. Facility health scores and CMO watchlists update automatically.
8. The CMO asks the copilot which centres need intervention next week.

## Main Features

- **Zero-friction capture**: voice notes, register photos, IVR, and tap-count updates.
- **Stock dashboard**: essential drug availability, reorder windows, and expiry risk.
- **Footfall forecasting**: OPD surge warnings by centre and season.
- **Bed and service visibility**: live capacity and staffing/service continuity signals.
- **Transfer optimizer**: from-centre, to-centre, drug, quantity, and transport recommendation.
- **Facility health score**: transparent, fairness-adjusted operational score.
- **CMO copilot**: natural-language questions over live district operations data.
- **Audit trail**: every input, AI parse, forecast, transfer, and approval remains inspectable.

## AI And Data Pipeline

ArogyaGrid uses AI where it reduces staff effort and improves actionability:

- Indic ASR and translation turn short voice updates into structured events.
- OCR/vision parses stock-register photos.
- LLM extraction normalizes drug names, quantities, urgency, and facility context.
- Forecasting combines consumption, seasonality, disease calendars, weather, and lead times.
- Optimization models the district as a graph with facilities as nodes and roads as edges.
- RAG/copilot answers CMO questions from live stock, forecast, transfer, and score data.

## Tools And Technology Fit

| Area | Tools | How ArogyaGrid uses them |
| --- | --- | --- |
| Voice and language | Bhashini, AI4Bharat, Sarvam, Speech-to-Text | Parses Hindi, Telugu, and dialect voice notes into structured operational data. |
| Vision/OCR | Gemini Vision, OCR models | Reads stock registers and validates photo evidence. |
| Forecasting | Gradient boosting, seasonal priors, intermittent-demand baselines | Predicts drug-centre stock-out risk with lead-time-aware warnings. |
| Optimization | Min-cost flow, graph constraints | Recommends redistribution between PHCs/CHCs. |
| Data | PostgreSQL/PostGIS, Redis | Stores facilities, stock events, forecasts, transfer orders, and audit records. |
| Deployment | Docker, GKE, Argo CD, Artifact Registry, Certificate Manager | Runs the live demo and supports merge-to-deploy automation. |

## Evaluation Criteria Mapping

| Evaluation parameter | ArogyaGrid fit |
| --- | --- |
| Problem-Solution Fit | Solves a real district operations gap: last-mile PHC visibility and actionable redistribution. |
| AI/Technical Execution | AI performs speech/OCR parsing, forecast narration, stock-out risk, and copilot answers. |
| Deployability and Scalability | Runs as a lightweight web prototype now and maps to district/state health-stack integration. |
| Inclusivity and Accessibility | Works through voice, IVR, and local language instead of a new staff data-entry portal. |
| Impact Potential | Reduces avoidable stock-outs, referral confusion, and delayed intervention. |
| Presentation and Clarity | Demo shows one voice note becoming a warning, transfer order, and CMO decision. |

## Deployment

Current live entry point:

- ArogyaGrid: `https://arogyagrid.shivam2003.com/`

Production path:

- GitHub `main` push triggers CI/CD.
- GitHub Actions validates the static app and builds a Docker image.
- The image is pushed to Artifact Registry.
- The workflow commits the image tag into `deploy/k8s/deployment.yaml`.
- Argo CD syncs the `arogyagrid-gcp` app into the shared LokSetu GKE cluster.

## Evaluation Path

1. Open the ArogyaGrid dashboard.
2. Start with the district operations overview.
3. Process the sample voice note/register update.
4. Review stock-out warnings.
5. Inspect the transfer recommendation.
6. Review facility health and root-cause notes.
7. Use the admin/research pages to understand pilot readiness.

## Why It Matters

ArogyaGrid turns the health system's last-mile blind spot into a live, explainable operating layer. The medicine may exist somewhere in the district; the platform helps officials know where it is, where it is needed, and what should move before patients suffer.
