# PulseGrid District Ops

PulseGrid is a multilingual AI platform for real-time PHC/CHC operations: stock monitoring, patient footfall, bed availability, doctor attendance, test availability, stock-out warnings, demand forecasting, redistribution recommendations and district intervention flags.

Live site:

```text
https://shivam2003-dev.github.io/pulsegrid-health-ops/
```

## Submission Package

- Working prototype: `index.html`, `dashboard.html`, `intake.html`, `forecasts.html`, `redistribution.html`, `facilities.html`, `enterprise.html`, `architecture.html`, `submission.html`, `styles.css`, `app.js`
- Code repository: public GitHub repo with setup and CI/CD
- Pitch deck: `PITCH_DECK.md`
- Project write-up: `PROJECT_WRITEUP.md`
- Full blueprint: `SOLUTION.md`
- Selected-round roadmap: `phase.md`

## Run Locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 4174
```

Then visit:

```text
http://localhost:4174
```

If that port is occupied, use any free port, for example `python3 -m http.server 4184`.

## Demo Flow

1. Open `dashboard.html` for the district command centre.
2. Open `intake.html` and click `Process voice note`.
3. Watch the Hindi voice update become structured stock, footfall and test signals.
4. Review the generated redistribution order in `redistribution.html`.
5. Review forecasting logic in `forecasts.html`.
6. Review facility attribution in `facilities.html`.
7. Review state/district enterprise readiness in `enterprise.html`.
8. Validate the embedded hand-in form in `submission.html`.

## CI/CD

GitHub Actions validates the static prototype and deploys it to GitHub Pages on every push to `main`.

Workflow:

```text
.github/workflows/pages.yml
```

Local checks:

```bash
npm run check
npm run test:site
```
