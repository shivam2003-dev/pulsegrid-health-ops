# PulseGrid Research Survey

## Research Question

What is the best practical design for an AI-driven PHC/CHC health-centre and supply-chain management platform in India, given low staff bandwidth, weak connectivity, fragmented government systems and recurring medicine/test stock-outs?

## Evidence Summary

### 1. Stock-outs are a system problem, not only a facility problem

Systematic literature on community-level medicine stock-outs in LMICs points to recurring upstream and last-mile causes: forecasting gaps, delayed replenishment, fragmented logistics, poor visibility and weak accountability loops. The product implication is that PulseGrid must not only alert the PHC; it must identify whether the failure is local, district-store, procurement or demand-surge related.

Design implication:

- Keep facility scoring attribution-based.
- Separate controllable local failures from upstream/systemic failures.
- Add audit logs and SLA escalation rather than simple red/yellow/green ranking.

Sources:

- Stock-outs of essential medicines among community health workers in LMICs: https://pmc.ncbi.nlm.nih.gov/articles/PMC9287964/
- Healthcare supply chains in developing countries, People that Deliver: https://peoplethatdeliver.org/sites/default/files/2022-01/Healthcare%20Supply%20Chains%20-%20Situation%20Analysis%20EN.pdf

### 2. Digital supply-chain tools help only when they fit workflow reality

LMIS and last-mile supply-chain work repeatedly shows that visibility is valuable, but parallel reporting systems fail when they increase workload. PulseGrid therefore treats existing registers, voice notes, IVR and e-Aushadhi/DVDMS exports as primary capture channels rather than demanding another daily form.

Design implication:

- Passive capture is a core product requirement, not a nice-to-have.
- The app should be useful even if only half the facilities send timely updates.
- Confidence scoring and missing-signal detection are required.

Sources:

- VillageReach supply-chain integration whitepaper: https://www.villagereach.org/wp-content/uploads/2024/06/IntegrationWhitepaper_2024Update_FINAL.pdf
- Last-mile public health supply-chain report: https://www.ghsupplychain.org/sites/default/files/2023-06/00140%20Last%20Mile%20Report%208KH.pdf

### 3. Forecasting must be model-by-data-quality, not LSTM-by-default

Health-facility item demand is sparse, stock-out-censored and highly seasonal. Intermittent medicines and test kits need different treatment from high-volume drugs. This supports a hybrid forecasting stack rather than one deep-learning model.

Design implication:

- Use gradient boosting for mature high-volume items.
- Use seasonal baselines for cold-start PHCs.
- Use Croston/TSB-style intermittent-demand methods for slow-moving items.
- Correct forecasts for censored demand during stock-out periods.

Sources:

- Optimizing health supply chains in LMICs with machine learning: https://hamsabastani.github.io/sl_chapter.pdf
- Intermittent demand forecasting research and benchmarks: https://www.tandfonline.com/doi/full/10.1080/00207543.2025.2578701

### 4. Redistribution is an optimization problem, not an alert problem

Alerts alone do not solve stock-outs. District administrators need feasible transfer recommendations that respect donor buffers, route distance, expiry, cold-chain and CHC emergency reserve. That makes the district graph/min-cost-flow design appropriate.

Design implication:

- Represent facilities and warehouses as graph nodes.
- Represent roads and transport as weighted edges.
- Apply FEFO expiry and buffer constraints.
- Generate draft transfer orders with human approval.

Sources:

- Optimizing health supply chains in LMICs with machine learning: https://hamsabastani.github.io/sl_chapter.pdf
- Transforming supply logistics for health commodity security: https://www.ghspjournal.org/content/12/1/e2300218

### 5. Indian deployment must align with existing public-health rails

PulseGrid should be a decision-support layer over existing Indian systems, not a replacement. DVDMS/e-Aushadhi already targets drug stock and warehouse workflows. HMIS is the official health indicator reporting portal. ABDM/HFR provides facility identity context. IPHS 2022 provides service-readiness norms.

Design implication:

- Facility master should map to ABDM/HFR-style identifiers where available.
- Stock and batch movement should import from e-Aushadhi/DVDMS.
- HMIS should be used for official aggregate reconciliation, not real-time burdening.
- IPHS 2022 should anchor facility readiness scoring.

Sources:

- DVDMS/e-Aushadhi official portal: https://dvdmsgen.prd.dcservices.in/
- HMIS official portal: https://hmis.mohfw.gov.in/
- ABDM update through PIB: https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2081482
- IPHS 2022 guidelines: https://nhsrcindia.org/IPHS2022/iphs-2022-guidelines

### 6. Privacy-by-minimization is the right compliance design

For this use case, patient-level identity is unnecessary. The platform can operate on aggregate counts, stock signals and service-readiness data. That reduces DPDP risk and makes district adoption easier.

Design implication:

- Do not require ABHA or patient PII.
- Process register images for aggregate extraction and delete raw images.
- Keep role-based access, audit logs and retention controls.

Sources:

- Digital Personal Data Protection Act, 2023: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf

## Final Product Direction

The best solution is not a dashboard, chatbot or generic forecasting model. The strongest design is an operations layer with:

1. Passive multilingual capture.
2. Data-quality-aware forecasting.
3. Lead-time-aware warnings.
4. Graph-based redistribution.
5. Fair facility scoring.
6. Indian system integration.
7. Privacy-by-minimization.
8. Human approval and auditability.

That is the direction implemented in PulseGrid.
