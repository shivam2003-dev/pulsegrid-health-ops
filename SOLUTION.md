# Kisan Alert - Smart Water, Crop & Advisory System

## What Every Team Will Build

1. A crop recommendation model using random forest on soil NPK, rainfall, and temperature.
2. A plant disease CNN app with a chatbot.
3. Weather API alerts that say "rain tomorrow" or "irrigate today."
4. A multilingual mobile app with a microphone button.
5. A generic officer dashboard with farmers, crops, mandi prices, and tickets.

Kisan Alert is designed against these defaults on four axes:

- Voice-first access instead of app-first access.
- Plot-stage advice instead of district-level generic advice.
- Crop risk portfolio and economics instead of one "best crop."
- RSK/KVK human validation instead of black-box AI.

## Why This Is Not Just Kisan Suvidha, mKisan, or KCC

Kisan Suvidha already provides weather, market prices, plant protection, agro advisories, Soil Health Card links, and related services. mKisan already sends text and voice advisories. Kisan Call Centres already answer farmer questions in local languages. Soil Health Card already gives nutrient status and fertilizer recommendations.

So Kisan Alert should not be pitched as another agriculture information app. It is the missing personalization and triage layer on top of these systems:

- KCC tells a farmer what is generally right.
- Kisan Alert tells the farmer what is right for this plot, this crop stage, this week.
- RSK experts validate uncertain or high-risk cases and close the loop by voice.

## Novel Concepts

### 1. Kisan Risk Portfolio Advisor

Instead of recommending one crop, recommend a crop mix:

- Safe crop.
- Balanced crop.
- High-return crop.
- Optional fallback crop if sowing is delayed.

The model uses soil, rainfall reliability, groundwater depth, price volatility, MSP protection, crop duration, and farmer risk preference.

Unfair advantage: judges will remember "crop choice like a financial portfolio," especially because small farmers cannot afford a single failed bet.

### 2. Monsoon Radar Dry-Spell Sentinel

Use Sentinel-1 SAR because it can see through monsoon clouds, Sentinel-2 NDVI/NDWI when clear, CHIRPS/IMD rainfall history, and forecast rainfall probability to detect sowing failure, crop stress, and dry spells before damage is visible.

Unfair advantage: most teams will use only weather APIs; Kisan Alert shows satellite evidence.

### 3. RSK Triage Network

Farmers send voice/photo logs by missed call, WhatsApp voice, or RSK kiosk. AI handles high-confidence routine cases. Low-confidence or high-risk cases become RSK tickets with crop, location, weather, soil, satellite trend, and transcript attached.

Unfair advantage: the byproduct is a district pest/disease early-warning map generated from real farmer complaints.

## Chosen Blueprint

Kisan Alert combines the crop risk portfolio, monsoon sentinel, and RSK loop into one voice-first system.

One-line product:

> Kisan Alert turns government data, satellites, and RSK experts into a 30-second dialect voice decision for each farmer's plot.

## Crop Recommendation Engine

### Inputs

- Farmer profile: village, plot location, land size, irrigation source, phone type, risk preference.
- Soil: Soil Health Card N/P/K, pH, EC, organic carbon; fallback to SoilGrids if no card exists.
- Remote sensing: Sentinel-2 NDVI/NDWI time series for crop vigor and fallow history; Sentinel-1 SAR for wetness/stress under clouds.
- Rainfall: CHIRPS climatology and IMD block-level forecast.
- Water: CGWB groundwater depth trend, local borewell reports, optional soil-moisture sensor.
- Economics: Agmarknet mandi modal prices, MSP list, input cost assumptions, distance to mandi.
- Crop rules: sowing windows, crop duration, soil suitability, water demand, pest risk.

### Model Choice

For the 48-hour build, use a rules-plus-scoring engine rather than pretending to train a reliable model.

Score:

```text
crop_score =
  soil_suitability
  * rainfall_reliability
  * water_feasibility
  * expected_margin
  * market_protection
  - risk_penalty
```

Risk penalty includes groundwater stress, rainfall variance, price volatility, crop duration risk, and forecast dry-spell probability.

The output is a ranked crop portfolio:

- Safe option.
- Balanced option.
- High-return option.
- Crop to avoid.

### Farmer-Facing Output

Do not show a probability table. Give one voice sentence with decision, reason, and action:

> Raju garu, your red soil has low nitrogen and groundwater is deep. For your 2 acres, sow 1.5 acres red gram and 0.5 acre maize after the next rain. Do not sow paddy now; water risk is high and seed loss risk is about Rs 3,800.

## Advisory And Dry-Spell Alerts

### Forecast Sources

- IMD agromet and block-level forecast where available.
- GFS as open fallback.
- ECMWF-open if accessible.
- CHIRPS or IMD rainfall history for anomaly checks.
- Optional local rain gauge or soil-moisture sensor from RSK/FPO.

### Agronomic Dry-Spell Definition

Do not define dry spell generically. Define it by crop stage:

- Sowing/germination: no effective rain above 10 mm for 5-7 days after sowing.
- Vegetative: forecast ET deficit above 50 percent of crop-stage water need for 7 days.
- Flowering: stricter threshold because yield loss is high.

Crop-stage water need is simplified from FAO-56:

```text
ETc = ETo * Kc
```

For the demo, hardcode Kc curves for paddy and red gram.

### Alert Logic

Avoid crying wolf:

- Alert only if at least two signals agree: forecast deficit, recent rainfall anomaly, satellite/sensor stress.
- Suppress repeated alerts for 72 hours unless severity changes.
- Include rupee impact, not only weather probability.
- Send only actionable alerts: delay sowing, protective irrigation, delay urea split, scout pest, call RSK.

Example:

> Rain chance is low for 7 days. If you sow maize today, seed failure risk is high. Wait until July 12; expected saving is about Rs 3,500 per acre.

## Photo And Voice Crop Diagnosis

Be honest: plant disease models often fail on real field photos because of lighting, mixed symptoms, overlapping nutrient/water/pest stress, local varieties, and poor focus.

### Confidence-Gated Pipeline

1. Farmer calls IVR or sends WhatsApp voice/photo.
2. ASR transcript extracts crop, symptom, crop stage, location, and urgency.
3. Image model classifies broad bucket: pest, fungal disease, nutrient deficiency, water stress, or unknown.
4. High confidence and low risk: instant voice advice.
5. Medium confidence: ask one voice follow-up.
6. Low confidence or high-risk crop stage: create RSK ticket.
7. RSK correction becomes labeled training data.

## RSK Integration

### Expert Dashboard

Each ticket includes:

- Farmer phone and village.
- Crop and sowing date.
- Soil card summary.
- Last 14-day rainfall.
- Satellite NDVI/SAR trend.
- Photo and voice transcript.
- AI hypothesis and confidence.

Priority order:

1. Flowering-stage crop.
2. Multiple nearby reports.
3. Low-confidence AI.
4. Larger affected acreage.

### Loop Closure

The RSK expert closes the ticket with a diagnosis and action. The system sends the answer back by IVR callback and SMS. If similar cases cluster in a 5 km radius, nearby farmers receive a preventive alert. This creates a district pest/disease early-warning map as a byproduct.

## Language Layer

Demo languages: Telugu and Hindi.

Use:

- Bhashini for ASR, TTS, and translation where API access works.
- AI4Bharat IndicWhisper and IndicTrans2 as fallback.
- Dialect phrase dictionaries for key rural terms.

Do not model everything. Hardcode approved advisory templates and use AI only for intent extraction and slot filling:

- Crop.
- Symptom.
- Village.
- Stage.
- Urgency.

Example Telugu phrases:

- "neellu levu" -> water shortage.
- "varsham ledu" -> no rain.
- "aaku pasupu" -> yellow leaves.
- "mandhu emi?" -> what medicine/input?

## Access Constraints

Primary channel:

- Missed call -> IVR callback.

Secondary channels:

- SMS summary.
- WhatsApp voice/photo for smartphone users.
- RSK kiosk or neighbor phone for farmers without phones.

The farmer does not need to install an app or own a smartphone.

## 48-Hour Hackathon Build Plan

### Build For Real

- Static demo website with IVR simulator, plot recommendation, satellite evidence, dry-spell alert, and RSK dashboard.
- Spring Boot API for farmer, plot, recommendation, alert, and ticket endpoints.
- Python/FastAPI agronomy engine for crop scoring and dry-spell calculation.
- PostgreSQL/PostGIS for farmer plots and village data.
- Twilio or Exotel webhook for IVR/SMS.
- Bhashini or prerecorded Telugu/Hindi voice for demo reliability.
- React or static JS dashboard for RSK queue.

### Mock Honestly

- One district.
- Three villages.
- Two crops: paddy and red gram.
- Synthetic but realistic Soil Health Card data.
- Precomputed Sentinel-1/Sentinel-2 style values.
- Precomputed rainfall anomaly and mandi prices.
- Disease classifier simulated with confidence gating.

### Suggested Demo Data

- District: Anantapuramu-style dryland setting.
- Villages: Kothapalli, Ramapuram, Chennapuram.
- Crops: Paddy, red gram.
- Farmer: Raju, 2 acres, red soil, low nitrogen, deep groundwater.
- Current risk: 7-day dry spell forecast and low plot wetness.

## 3-Minute Demo Script

1. Show farmer profile: Raju, Village A, 2 acres, low nitrogen, deep groundwater.
2. Live wow moment: trigger IVR and ask in Telugu, "Ee varsham lo ye pantalu veyali?"
3. System replies in Telugu with a plot-specific crop portfolio and satellite-backed reason.
4. Dashboard shows rainfall deficit, Sentinel-1 wetness low, paddy risk high.
5. Send crop photo/voice. The model marks low confidence and creates an RSK ticket.
6. RSK expert closes the ticket and the farmer receives voice/SMS advice.
7. District map shows emerging pest/disease cluster.

## Judge Questions

### Why will a farmer trust this over the local input dealer?

Because the advice names the farmer's village, crop stage, soil issue, rainfall risk, and rupee impact, and carries RSK/KVK validation. Dealers sell inputs. Kisan Alert can also say, "do not buy seed this week" or "do not spray pesticide yet."

### How is this different from Kisan Suvidha or KCC?

Kisan Suvidha is an information app and KCC is a human helpline. Kisan Alert is a personalization and triage layer that uses Soil Health Card, IMD, satellite, mandi, and crop-stage data to generate plot-specific advice, then escalates hard cases to RSK experts.

### Is this feasible in 48 hours?

The full agronomy platform is not. A credible hackathon prototype is feasible: one district, two crops, synthetic data, IVR voice flow, ranked recommendation engine, dry-spell alert logic, RSK ticket dashboard, and one satellite-evidence screen.

## Sustainability Path

- State agriculture department pilot through RSKs.
- FPO partnerships for onboarding and trust.
- NABARD and state innovation grants for public-good deployment.
- Crop insurance risk alerts.
- FPO advisory subscriptions.
- Agri-input partnerships only with a strict rule: sponsored products cannot override RSK-validated agronomic advice.

## Reference Sources

- Kisan Suvidha: https://kisansuvidha.gov.in/
- mKisan: https://mkisan.gov.in/
- Kisan Call Centre: https://www.manage.gov.in/kcc/aboutkcc.asp
- Soil Health Card: https://www.soilhealth.dac.gov.in/
- IMD Agromet: https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php
- Bhashini: https://bhashini.gov.in/
- AI4Bharat IndicTrans2: https://github.com/AI4Bharat/IndicTrans2
- Agmarknet: https://agmarknet.gov.in/
- Sentinel-1: https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-1
- Sentinel-2: https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
- CHIRPS: https://www.chc.ucsb.edu/data/chirps
- FAO-56: https://www.fao.org/4/x0490e/x0490e00.htm
