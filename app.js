const samples = {
  hi: "PHC Bhairavpur mein ORS 18 packet bache hain, paracetamol 500 ki 10 strip hain, malaria RDT khatam hai. Aaj OPD 118 tha aur bukhar ke 31 patient aaye.",
  mr: "PHC Bhairavpur madhe ORS 18 packet urle aahet, paracetamol 500 chi 10 strip aahet, malaria RDT sampale aahe. Aaj OPD 118 hota ani tapache 31 patient aale.",
};

const state = {
  processed: false,
};

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => {
  const element = $(selector);
  if (element) element.textContent = value;
};

const setHtml = (selector, value) => {
  const element = $(selector);
  if (element) element.innerHTML = value;
};

const on = (selector, event, handler) => {
  const element = $(selector);
  if (element) element.addEventListener(event, handler);
};

const data = window.PULSEGRID || {};
const tourSteps = {
  "index.html": [
    { target: ".hero", title: "Start with the district problem", body: "This first screen frames PulseGrid as a live PHC/CHC operations layer: stock, footfall, beds, attendance, tests and district action in one system." },
    { target: ".hero-actions", title: "Run the demo path", body: "Use AI Intake for the Hindi or Marathi voice-note flow, or open the dashboard to see the CMO view of risks and transfers." },
    { target: ".prototype-grid", title: "Follow the operating loop", body: "These cards show the end-to-end workflow judges should remember: passive capture, lead-time warning, redistribution recommendation and intervention brief." },
    { target: "#webform", title: "Everything stays on this site", body: "The submission content is embedded as a webform-style page, so the project write-up, prototype and architecture are visible without redirecting to GitHub." },
  ],
  "dashboard.html": [
    { target: ".ops-grid", title: "Read district health in four signals", body: "The top row gives a CMO a quick answer: how many centres are monitored, where stock risk is rising, whether beds are tight and whether data is fresh." },
    { target: ".large-map", title: "See the district as a transfer network", body: "The map is a graph view: donor facilities, risk facilities and routes that can move medicines before emergency indents are needed." },
    { target: ".warning-list", title: "Act from the intervention queue", body: "This list is sorted for operations, not reporting. It shows what to approve, who owns it and what failure it prevents." },
    { target: ".copilot-panel", title: "Use the CMO-ready brief", body: "The copilot summarizes the evidence and separates local execution issues from upstream shortages so centres are not unfairly blamed." },
  ],
  "intake.html": [
    { target: ".voice-panel", title: "Capture without new form filling", body: "This is the adoption-critical flow: a PHC worker sends a Hindi or Marathi update as voice/text, and PulseGrid extracts operational signals." },
    { target: "#processVoice", title: "Turn speech into facility data", body: "Click Process to simulate LLM extraction of stock, footfall, bed, attendance and test availability updates from one low-friction message." },
    { target: "#aiTrace", title: "Inspect the AI trace", body: "The trace shows what was extracted, what was flagged as anomalous and why no patient-level PII is needed for this use case." },
    { target: "#transferCard", title: "End with a human-approved action", body: "The flow produces a draft transfer recommendation and escalation path; the system recommends, but district staff approve." },
  ],
  "inventory.html": [
    { target: ".toolbar", title: "Find risk and prepare approval", body: "Search by item or facility, then generate an indent pack for the Medical Officer and district store rather than making staff re-enter a form." },
    { target: ".table-wrap", title: "Lead-time-aware stock view", body: "Each row compares stock on hand with forecast demand, procurement lead time, buffer need, expiry and storage constraints." },
  ],
  "orders.html": [
    { target: ".order-board", title: "Move from recommendation to order", body: "Each card is an actionable transfer order with source, destination, item, route, vehicle, owner and expected stock-out days avoided." },
    { target: ".approve-inline", title: "Simulate the approval chain", body: "Click the approval control to show how a recommendation moves through MO, store and CMO review without becoming an automatic black box." },
  ],
  "forecasts.html": [
    { target: ".forecast-main", title: "Forecast what procurement must cover", body: "The forecast is built around government lead times, stock-out censoring and seasonal disease signals, not only last week's consumption." },
    { target: ".forecast-layout", title: "Use simple models where data is weak", body: "PulseGrid chooses quantile boosting, seasonal baselines or Croston/TSB depending on data quality, so cold-start PHCs still get usable warnings." },
  ],
  "facilities.html": [
    { target: ".score-panel", title: "Score centres without hiding causes", body: "The score breaks down stock, service continuity, beds, tests and signal freshness so the district sees the exact weak point." },
    { target: ".copilot-panel", title: "Do not punish upstream failures", body: "Attribution tags separate facility action gaps from vacancies, supply failures and district-store shortages before a centre is marked underperforming." },
  ],
  "enterprise.html": [
    { target: ".ops-grid", title: "Roll out district-first, then state-wide", body: "The deployment model starts with one district's PHCs and CHCs, then scales through adapters, role scopes and common health-facility masters." },
    { target: ".role-table", title: "Match government operating roles", body: "PHC staff, MOs, district stores, CMOs and State NHM teams get different views and permissions aligned to their real responsibilities." },
    { target: ".audit-log", title: "Keep every AI action auditable", body: "Production use needs traceable recommendations, approvals, overrides and data sources so officials can trust the system." },
  ],
  "research.html": [
    { target: ".research-grid", title: "Connect research to build decisions", body: "Each research card explains why the product favors passive capture, lead-time warnings, redistribution and transparent attribution." },
    { target: ".source-list", title: "Show the evidence base", body: "The source list ties the prototype to LMIC stock-out studies, Indian government rails, IPHS norms and DPDP privacy requirements." },
  ],
  "admin.html": [
    { target: "#roleMatrix", title: "Review access by role", body: "The RBAC matrix shows who can view, approve, override or administer operational decisions in a district deployment." },
    { target: "#integrationList", title: "Track real integration readiness", body: "This table keeps e-Aushadhi, HMIS, ABDM/HFR, eSanjeevani and WhatsApp/IVR adapters visible with owner and risk." },
    { target: "#auditRows", title: "Prove governance after every action", body: "The audit log records AI extraction, warning generation, recommendation and human approval events for administrative review." },
  ],
  "architecture.html": [
    { target: ".architecture-grid", title: "Map the prototype to production services", body: "The architecture shows how the static demo becomes a Cloud Run or Kubernetes service layer with APIs, queues, storage and analytics." },
    { target: ".code-block", title: "Keep secrets out of the repository", body: "API keys and provider credentials belong in environment variables or secret managers; the repository only documents the contract." },
  ],
  "submission.html": [
    { target: ".submission-form", title: "Submit from inside the app", body: "The project write-up is presented as a webform-style hand-in page with prototype, repository, pitch and architecture details in one place." },
    { target: "#validateSubmission", title: "Validate the hand-in package", body: "Click this to confirm the required prototype, repo, pitch, write-up, architecture and CI/CD evidence are included." },
  ],
};

function statusClass(status) {
  if (/critical/i.test(status)) return "status-critical";
  if (/watch|review|verification|allocation/i.test(status)) return "status-watch";
  return "status-stable";
}

function renderInventory(filter = "") {
  const rows = $("#inventoryRows");
  if (!rows || !data.inventory) return;
  const normalized = filter.trim().toLowerCase();
  const filtered = data.inventory.filter((row) =>
    [row.item, row.facility, row.program, row.status].join(" ").toLowerCase().includes(normalized)
  );
  rows.innerHTML = filtered.map((row) => {
    const daysCover = row.dailyDemand ? Math.floor(row.stock / row.dailyDemand) : 0;
    const bufferGap = Math.max(row.buffer - row.stock, 0);
    return `<tr>
      <td><strong>${row.item}</strong><small>${row.program}</small></td>
      <td>${row.facility}</td>
      <td>${row.stock}</td>
      <td>${daysCover} days</td>
      <td>${row.leadTime} days</td>
      <td>${bufferGap}</td>
      <td>${row.expiry}</td>
      <td><span class="status-chip ${statusClass(row.status)}">${row.status}</span></td>
    </tr>`;
  }).join("");
}

function renderOrders() {
  const board = $("#orderBoard");
  if (!board || !data.transfers) return;
  board.innerHTML = data.transfers.map((order) => `
    <article class="order-card">
      <div class="panel-head"><div><p class="eyebrow">${order.id}</p><h2>${order.from} → ${order.to}</h2></div><span class="status-chip ${statusClass(order.status)}">${order.status}</span></div>
      <div class="transfer-line"><span>Items</span><strong>${order.items}</strong><span>Route</span><strong>${order.route}</strong></div>
      <div class="transfer-line"><span>Vehicle</span><strong>${order.vehicle}</strong><span>Created</span><strong>${order.created}</strong></div>
      <p>${order.impact}</p>
      <button type="button" class="approve-inline">Advance workflow</button>
    </article>
  `).join("");
  document.querySelectorAll(".approve-inline").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "Workflow advanced";
      button.classList.add("ready");
    });
  });
}

function renderAdmin() {
  setHtml("#roleMatrix", (data.roles || []).map((role) => `<div><b>${role.name}</b><span>${role.scope}</span></div>`).join(""));
  setHtml("#integrationList", (data.integrations || []).map((item) => `
    <div class="integration-row">
      <b>${item.name}</b>
      <span>${item.status} · ${item.cadence}</span>
      <small>${item.owner}: ${item.risk}</small>
    </div>
  `).join(""));
  setHtml("#auditRows", (data.audits || []).map((item) => `
    <div><span>${item.time}</span><b>${item.event}</b><small>${item.actor}: ${item.detail}</small></div>
  `).join(""));
}

function processVoiceNote() {
  state.processed = true;
  setText("#voiceConfidence", "LLM confidence 94%");
  setText("#heroConfidence", "91%");
  setText("#heroRisk", "6d");
  setText("#urgentCount", "5");
  setText("#queueCount", "5 open");
  setText("#healthScore", "58");

  setHtml("#extractGrid", `
    <div><span>Facility</span><strong>PHC Bhairavpur</strong></div>
    <div><span>Stock</span><strong>ORS 18 · PCM 10 · RDT 0</strong></div>
    <div><span>Footfall</span><strong>OPD 118 · fever 31</strong></div>
    <div><span>Tests</span><strong>Malaria RDT stock-out</strong></div>
  `);

  setHtml("#aiTrace", `
    <p><b>Input:</b> Hindi/Marathi PHC voice note, converted into structured operational data.</p>
    <p><b>Extraction:</b> ORS 18 packets, paracetamol 10 strips, malaria RDT 0, OPD 118, fever 31.</p>
    <p><b>Anomaly:</b> Fever footfall is 2.4x baseline while malaria RDT is unavailable; escalate to district store.</p>
    <p><b>Guardrail:</b> No patient names, ABHA IDs or prescription-level PII are stored.</p>
  `);

  const warningList = $("#warningList");
  if (warningList && !document.querySelector("[data-generated-warning]")) {
    warningList.insertAdjacentHTML(
      "afterbegin",
      `<article class="warning critical-border" data-generated-warning="true">
        <div>
          <strong>Malaria RDT · PHC Bhairavpur</strong>
          <span>0 stock · fever cases 31 today · district store action needed</span>
        </div>
        <b>Critical</b>
      </article>`
    );
  }

  setHtml("#transferCard", `
    <div class="transfer-line">
      <span>From</span><strong>PHC Ashta Road</strong>
      <span>To</span><strong>PHC Bhairavpur</strong>
    </div>
    <div class="transfer-line">
      <span>Move</span><strong>80 ORS packets + 25 RDT kits</strong>
      <span>Vehicle</span><strong>Block van</strong>
    </div>
    <p>Sender remains above buffer. Receiver avoids ORS stock-out for 18 days and restores fever testing today. Route cost is lower than district warehouse dispatch.</p>
    <button id="approveOrder" type="button">Mark ready for CMO review</button>
  `);
  on("#approveOrder", "click", approveOrder);
}

function approveOrder() {
  const transferCard = $("#transferCard");
  if (!transferCard) return;
  transferCard.classList.add("ready");
  transferCard.innerHTML = `
    <div class="transfer-line">
      <span>Status</span><strong>Ready for CMO review</strong>
      <span>Order ID</span><strong>TO-24-071</strong>
    </div>
    <p>Draft transfer order created with item, quantity, source, destination, expiry priority and transport route. Human approval is still required before dispatch.</p>
  `;
}

function askCopilot() {
  const answer = state.processed
    ? "Priority one: approve TO-24-071 from PHC Ashta Road to PHC Bhairavpur today. ORS is solvable inside the district; malaria RDT stock-out needs district store release because fever footfall is 2.4x the 14-day baseline. Do not penalize the facility score because upstream stock was unavailable for 9 days."
    : "Top intervention: PHC Bhairavpur needs ORS and malaria RDT action before Monday. The stock issue is district-solvable through redistribution; the test issue requires district store confirmation.";
  setText("#copilotAnswer", answer);
}

function loadMarathi() {
  const language = $("#language");
  const voiceText = $("#voiceText");
  if (language) language.value = "mr";
  if (voiceText) voiceText.value = samples.mr;
}

function validateSubmission() {
  const checked = document.querySelectorAll(".check-grid input:checked").length;
  const total = document.querySelectorAll(".check-grid input").length;
  setText("#submissionStatus", `${checked}/${total} hand-in items validated. The full prototype, pitch, write-up, architecture and CI/CD summary are embedded on this page.`);
}

function generateIndentPack() {
  const critical = (data.inventory || []).filter((row) => row.status === "Critical");
  const totalGap = critical.reduce((sum, row) => sum + Math.max(row.buffer - row.stock, 0), 0);
  setText("#indentOutput", `${critical.length} critical lines prepared for MO/store approval. Total buffer gap: ${totalGap} units.`);
}

function currentPageName() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function buildTour() {
  const steps = tourSteps[currentPageName()] || tourSteps["index.html"];
  if (!steps.length) return;
  let index = 0;
  const start = document.createElement("button");
  start.type = "button";
  start.className = "tour-start";
  start.textContent = "Guide";
  start.setAttribute("aria-label", "Open guided tour");
  document.body.appendChild(start);

  const overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  overlay.innerHTML = `
    <div class="tour-panel" role="dialog" aria-live="polite" aria-label="Guided tour">
      <div class="tour-copy">
        <p class="eyebrow">Guided tour</p>
        <h2 id="tourTitle"></h2>
        <p id="tourBody"></p>
      </div>
      <div class="tour-side">
        <div class="tour-progress" id="tourProgress"></div>
        <div class="tour-dots" id="tourDots"></div>
        <div class="tour-hint">Use Next step to continue.</div>
      </div>
      <div class="tour-actions">
        <button type="button" class="secondary" id="tourBack">Back</button>
        <button type="button" class="secondary" id="tourSkip">Skip</button>
        <button type="button" class="tour-primary" id="tourNext">Next step</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const nextButton = overlay.querySelector("#tourNext");
  const backButton = overlay.querySelector("#tourBack");
  const skipButton = overlay.querySelector("#tourSkip");
  let lastFocusedElement = null;

  function clearHighlights() {
    document.querySelectorAll(".tour-target").forEach((node) => node.classList.remove("tour-target"));
  }

  function showStep(nextIndex) {
    index = Math.max(0, Math.min(nextIndex, steps.length - 1));
    clearHighlights();
    const step = steps[index];
    const target = document.querySelector(step.target) || document.querySelector("main");
    target.classList.add("tour-target");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setText("#tourTitle", step.title);
    setText("#tourBody", step.body);
    setText("#tourProgress", `Step ${index + 1} of ${steps.length}`);
    setText("#tourNext", index === steps.length - 1 ? "Finish tour" : "Next step");
    setHtml("#tourDots", steps.map((_, stepIndex) => `<span class="${stepIndex === index ? "active" : ""}"></span>`).join(""));
    backButton.disabled = index === 0;
  }

  function openTour() {
    lastFocusedElement = document.activeElement;
    start.hidden = true;
    overlay.classList.add("open");
    showStep(0);
    window.setTimeout(() => nextButton.focus(), 100);
  }

  function closeTour() {
    overlay.classList.remove("open");
    start.hidden = false;
    clearHighlights();
    window.localStorage.setItem("pulsegridTourSeen", "true");
    if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
  }

  start.addEventListener("click", openTour);
  backButton.addEventListener("click", () => {
    showStep(index - 1);
    nextButton.focus();
  });
  nextButton.addEventListener("click", () => {
    if (index === steps.length - 1) closeTour();
    else {
      showStep(index + 1);
      nextButton.focus();
    }
  });
  skipButton.addEventListener("click", closeTour);
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTour();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
    }
    if (event.key === "ArrowLeft" && !backButton.disabled) {
      event.preventDefault();
      backButton.click();
    }
  });
}

on("#processVoice", "click", processVoiceNote);
on("#loadMarathi", "click", loadMarathi);
on("#askCopilot", "click", askCopilot);
on("#validateSubmission", "click", validateSubmission);
on("#simulateIndent", "click", generateIndentPack);
on("#inventorySearch", "input", (event) => renderInventory(event.target.value));
on("#language", "change", (event) => {
  const voiceText = $("#voiceText");
  if (voiceText) voiceText.value = samples[event.target.value];
});

renderInventory();
renderOrders();
renderAdmin();
buildTour();
