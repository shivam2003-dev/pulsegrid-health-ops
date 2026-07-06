window.PULSEGRID = {
  roles: [
    { id: "cmo", name: "CMO / DPM", scope: "District command, SLA escalation, intervention approval" },
    { id: "store", name: "District Store", scope: "Batch allocation, transfer approval, expiry management" },
    { id: "mo", name: "Medical Officer", scope: "Facility verification, indent approval, local action" },
    { id: "phc", name: "PHC Staff", scope: "Voice note, register photo, IVR confirmation" },
    { id: "state", name: "State NHM", scope: "District benchmarking, procurement bottlenecks, IPHS readiness" },
  ],
  facilities: [
    { id: "PHC-07", name: "PHC Bhairavpur", type: "PHC", block: "Ashta", score: 58, risk: "Critical", stock: 38, service: 78, tests: 22, beds: 2, occupancy: 1, freshness: 94, attribution: "Upstream RDT shortage; ORS solvable by transfer" },
    { id: "PHC-12", name: "PHC Ashta Road", type: "PHC", block: "Ashta", score: 84, risk: "Donor", stock: 91, service: 88, tests: 76, beds: 2, occupancy: 0, freshness: 89, attribution: "Surplus ORS batch expiring in 78 days" },
    { id: "CHC-01", name: "CHC Ichhawar", type: "CHC", block: "Ichhawar", score: 71, risk: "Watch", stock: 62, service: 81, tests: 54, beds: 30, occupancy: 24, freshness: 87, attribution: "ANC load rising; Hb strips need replenishment" },
    { id: "PHC-18", name: "PHC Bilkisganj", type: "PHC", block: "Sehore", score: 66, risk: "Watch", stock: 52, service: 74, tests: 61, beds: 2, occupancy: 1, freshness: 76, attribution: "Antibiotic demand rising during dengue season" },
    { id: "CHC-02", name: "CHC Nasrullaganj", type: "CHC", block: "Nasrullaganj", score: 79, risk: "Stable", stock: 82, service: 86, tests: 73, beds: 30, occupancy: 19, freshness: 91, attribution: "Stable, monitor maternity ward" },
    { id: "PHC-21", name: "PHC Rehti", type: "PHC", block: "Rehti", score: 73, risk: "Stable", stock: 77, service: 82, tests: 69, beds: 2, occupancy: 0, freshness: 88, attribution: "Stable" },
  ],
  inventory: [
    { item: "ORS packet", program: "Essential Drugs", facility: "PHC Bhairavpur", stock: 18, dailyDemand: 3.1, leadTime: 21, buffer: 45, expiry: "2026-09-23", storage: "Ambient", status: "Critical" },
    { item: "Paracetamol 500", program: "Essential Drugs", facility: "PHC Bhairavpur", stock: 100, dailyDemand: 21, leadTime: 21, buffer: 500, expiry: "2027-01-14", storage: "Ambient", status: "Critical" },
    { item: "Malaria RDT", program: "NVBDCP", facility: "PHC Bhairavpur", stock: 0, dailyDemand: 6.2, leadTime: 14, buffer: 80, expiry: "2026-11-30", storage: "Ambient", status: "Critical" },
    { item: "ORS packet", program: "Essential Drugs", facility: "PHC Ashta Road", stock: 380, dailyDemand: 4.2, leadTime: 21, buffer: 60, expiry: "2026-09-01", storage: "Ambient", status: "Surplus" },
    { item: "Hb strips", program: "Maternal Health", facility: "CHC Ichhawar", stock: 84, dailyDemand: 7.5, leadTime: 21, buffer: 160, expiry: "2026-10-15", storage: "Ambient", status: "Watch" },
    { item: "Amoxicillin", program: "Essential Drugs", facility: "PHC Bilkisganj", stock: 220, dailyDemand: 16.7, leadTime: 30, buffer: 420, expiry: "2027-03-18", storage: "Ambient", status: "Watch" },
  ],
  transfers: [
    { id: "TO-24-071", from: "PHC Ashta Road", to: "PHC Bhairavpur", items: "80 ORS + 25 malaria RDT", route: "21 km", vehicle: "Block van", status: "CMO Review", impact: "Avoids 18 stock-out days", created: "09:15" },
    { id: "TO-24-072", from: "District Store", to: "CHC Ichhawar", items: "200 Hb strips", route: "34 km", vehicle: "Store vehicle", status: "Store Allocation", impact: "ANC testing cover +19 days", created: "10:05" },
    { id: "TO-24-073", from: "District Store", to: "PHC Bilkisganj", items: "600 Amoxicillin", route: "28 km", vehicle: "Block van", status: "MO Verification", impact: "Dengue season antibiotic buffer", created: "10:42" },
  ],
  audits: [
    { time: "09:10", actor: "AI Intake", event: "PHC Bhairavpur voice note processed", detail: "Confidence 94%, no PII stored" },
    { time: "09:12", actor: "Warning Engine", event: "Stock-out warning generated", detail: "ORS 6 days cover vs 21 day lead time" },
    { time: "09:15", actor: "Optimizer", event: "Transfer order drafted", detail: "PHC Ashta Road remains above buffer" },
    { time: "09:28", actor: "CMO Copilot", event: "Escalation prepared", detail: "RDT shortage tagged as upstream/systemic" },
  ],
  integrations: [
    { name: "e-Aushadhi / DVDMS", status: "Adapter Ready", cadence: "Daily import", owner: "District Store", risk: "CSV/API availability differs by state" },
    { name: "HMIS", status: "Reconciliation Ready", cadence: "Monthly", owner: "DPM", risk: "Not real-time; used for official cross-check" },
    { name: "ABDM / HFR", status: "Facility Mapping", cadence: "Onboarding", owner: "State NHM", risk: "Facility master cleanup needed" },
    { name: "eSanjeevani", status: "Signal Mapping", cadence: "Daily where available", owner: "MO", risk: "Coverage varies by facility" },
    { name: "WhatsApp / IVR", status: "Pilot Mock", cadence: "Real time", owner: "Implementation partner", risk: "Provider approval required" },
  ],
};
