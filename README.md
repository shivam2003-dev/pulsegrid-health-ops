# PulseGrid District Ops

Voice-first district health centre and supply chain management prototype for Code for Communities Smart Health.

## Run

Open `index.html` in a browser, or serve the folder:

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
2. Watch the PHC stock extraction update the risk queue.
3. Review the generated redistribution recommendation.
4. Click `Mark ready for CMO review`.
5. Click `Ask` in the copilot panel.

The full product blueprint is in `SOLUTION.md`.
