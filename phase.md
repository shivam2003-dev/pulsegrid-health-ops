# PulseGrid Selected-Round Build Plan

## Goal

Turn the hackathon prototype into a fuller end-to-end, multi-page public-health operations product that can be shown to judges, district administrators and potential NHM pilot partners.

## Secret Handling

An API token was shared in chat. It must not be committed, logged or embedded in the website. Rotate/revoke that exposed key. For future AI integration, use:

```text
OPENROUTER_API_KEY=replace_with_rotated_key
AI_MODEL=openai/gpt-4.1-mini
```

Local secrets are ignored by `.gitignore` through `.env` and `.env.*`.

## Phase 1: Multi-Page Product Foundation

Status: completed in this iteration.

Deliverables:

- `index.html`: product overview and selected-round entry page.
- `dashboard.html`: district command centre.
- `intake.html`: AI voice/OCR intake workbench.
- `forecasts.html`: AI demand forecasting page.
- `redistribution.html`: min-cost flow transfer-order page.
- `facilities.html`: facility scoring and intervention page.
- `architecture.html`: system architecture, cloud path and AI configuration.
- `submission.html`: embedded hand-in webform with no external document redirects.
- Shared `styles.css` and `app.js`.

Success criteria:

- Every page works as static GitHub Pages.
- Navigation stays inside the website.
- Theme matches public-health operations, not a generic dark landing page.
- No API key is stored in code.

## Phase 2: AI Workflow Simulation And Testing

Status: completed in this iteration.

Deliverables:

- Simulated multilingual AI extraction from Hindi/Marathi PHC voice notes.
- AI anomaly explanation for fever/test stock mismatch.
- Forecast cards for medicines, footfall, beds and tests.
- Redistribution recommendation using graph/min-cost-flow logic.
- Facility scoring with controllable vs upstream/systemic attribution.
- Embedded webform validation.
- Static automated checks in `scripts/test-site.mjs`.
- GitHub Actions validation and GitHub Pages deployment.

Success criteria:

- `npm run check` passes.
- `npm run test:site` passes.
- Playwright screenshot render succeeds.
- GitHub Pages deploys through CI/CD.

## Phase 3: Enterprise India Readiness

Status: frontend enterprise layer completed in this iteration; backend pilot remains planned.

Completed:

- Enterprise India page for district/state rollout story.
- Role-based workflow model for PHC, MO, district store, CMO/DPM and state NHM users.
- India public-health integration map: ABDM/HFR-style facility identity, e-Aushadhi/DVDMS, HMIS, eSanjeevani and IPHS 2022.
- SLA governance model and audit log surface.
- Procurement-ready state rollout framing.

Next backend build:

- Implement real role-based auth and audit persistence.
- Integrate stock import adapters and district master data.
- Add state-level benchmark dashboards.

## Phase 4: Real Backend Pilot

Status: planned.

Build:

- Spring Boot API for facilities, stock, transfers and alerts.
- Python FastAPI service for OCR, forecasting and optimization.
- PostgreSQL/PostGIS schema for facilities, lots, routes and daily signals.
- OpenRouter/OpenAI-compatible AI gateway using `OPENROUTER_API_KEY`.
- WhatsApp/IVR adapter mock, then production provider integration.
- Role-based views for PHC, MO, district store and CMO.

## Phase 5: District Pilot Readiness

Status: planned.

Build:

- e-Aushadhi/DVDMS import adapter.
- HMIS monthly reconciliation adapter.
- CMO escalation SLA reports.
- Data retention policy and DPDP-aligned privacy controls.
- NHM pilot KPI sheet: stock-out days, transfer turnaround, test downtime and avoidable referrals.
