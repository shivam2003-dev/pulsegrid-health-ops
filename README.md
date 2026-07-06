# PulseGrid District Ops

PulseGrid is a multilingual AI platform for real-time PHC/CHC operations: stock monitoring, patient footfall, bed availability, doctor attendance, test availability, stock-out warnings, demand forecasting, redistribution recommendations and district intervention flags.

Live site:

```text
https://shivam2003-dev.github.io/pulsegrid-health-ops/
```

## Submission Package

- Working prototype: `index.html`, `styles.css`, `app.js`
- Code repository: public GitHub repo with setup and CI/CD
- Pitch deck: `PITCH_DECK.md`
- Project write-up: `PROJECT_WRITEUP.md`
- Full blueprint: `SOLUTION.md`

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

1. Click `Process voice note`.
2. Watch the Hindi voice update become structured stock, footfall and test signals.
3. Review the lead-time-aware stock-out queue.
4. Review the generated redistribution order.
5. Click `Mark ready for CMO review`.
6. Click `Ask` in the copilot panel.

## CI/CD

GitHub Actions validates the static prototype and deploys it to GitHub Pages on every push to `main`.

Workflow:

```text
.github/workflows/pages.yml
```
