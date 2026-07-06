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
    { target: ".hero", title: "PulseGrid overview", body: "Start here: this is the national/district health ops story and the entry point into the product." },
    { target: ".hero-actions", title: "Choose a workflow", body: "Open AI Intake to run the voice-note demo, or jump to the district dashboard." },
    { target: ".prototype-grid", title: "Working prototype", body: "This embedded flow shows voice capture, warnings, redistribution and CMO briefing in one place." },
    { target: "#webform", title: "Submission webform", body: "The full hand-in content is embedded here, so judges do not need to leave the website." },
  ],
  "dashboard.html": [
    { target: ".ops-grid", title: "District KPIs", body: "Track monitored centres, stock risks, bed pressure and signal freshness at district level." },
    { target: ".large-map", title: "Transfer graph", body: "The route graph shows which facilities can donate stock and which are at risk." },
    { target: ".warning-list", title: "Intervention queue", body: "CMO and district store teams act from this queue before stock-outs happen." },
    { target: ".copilot-panel", title: "CMO briefing", body: "The copilot explains what needs action and whether the root cause is local or upstream." },
  ],
  "intake.html": [
    { target: ".voice-panel", title: "Passive AI capture", body: "Paste or use the sample Hindi/Marathi PHC update. No new MIS data entry is required." },
    { target: "#processVoice", title: "Process voice note", body: "Click this to convert voice text into stock, footfall and test signals." },
    { target: "#aiTrace", title: "AI trace", body: "After processing, the system explains extraction, anomaly and privacy guardrails." },
    { target: "#transferCard", title: "Generated action", body: "The AI flow ends with a draft action that still requires human approval." },
  ],
  "inventory.html": [
    { target: ".toolbar", title: "Inventory controls", body: "Search items and generate a critical indent pack for MO/store approval." },
    { target: ".table-wrap", title: "Lead-time ledger", body: "Each row shows stock, demand, lead time, buffer gap, expiry and status." },
  ],
  "orders.html": [
    { target: ".order-board", title: "Transfer workflow", body: "Each card is a transfer order with source, destination, item, route, vehicle and impact." },
    { target: ".approve-inline", title: "Advance workflow", body: "Click to simulate an approval step moving forward." },
  ],
  "forecasts.html": [
    { target: ".forecast-main", title: "Demand forecast", body: "The forecast combines medicine demand, lead time and censored stock-out history." },
    { target: ".forecast-layout", title: "Model selection", body: "Different data quality gets different models: quantile GBM, seasonal baseline or Croston/TSB." },
  ],
  "facilities.html": [
    { target: ".score-panel", title: "Fair scoring", body: "The centre score separates stock, service continuity, tests and upstream dependency." },
    { target: ".copilot-panel", title: "Attribution", body: "PulseGrid flags centres for support without punishing them for upstream failures." },
  ],
  "enterprise.html": [
    { target: ".ops-grid", title: "Enterprise rollout", body: "This is the district-to-state operating model for India-scale deployment." },
    { target: ".role-table", title: "Role-based workflows", body: "PHC, MO, store, CMO and State NHM users each get their own operating scope." },
    { target: ".audit-log", title: "Audit trail", body: "Every AI recommendation and human approval must be traceable in production." },
  ],
  "research.html": [
    { target: ".research-grid", title: "Research findings", body: "This board converts survey and official-source findings into product decisions." },
    { target: ".source-list", title: "Evidence base", body: "The source set covers LMIC stock-outs, supply-chain integration, forecasting, Indian rails and privacy." },
  ],
  "admin.html": [
    { target: "#roleMatrix", title: "RBAC matrix", body: "Enterprise deployment needs clear roles and access boundaries." },
    { target: "#integrationList", title: "Integration status", body: "Track e-Aushadhi, HMIS, ABDM/HFR, eSanjeevani and WhatsApp/IVR readiness." },
    { target: "#auditRows", title: "Governance log", body: "Auditable operations make AI recommendations acceptable for government workflows." },
  ],
  "architecture.html": [
    { target: ".architecture-grid", title: "Backend path", body: "This shows how the static demo becomes Cloud Run, FastAPI, PostGIS and Pub/Sub services." },
    { target: ".code-block", title: "Secret handling", body: "API keys are environment-only and never committed to the repository." },
  ],
  "submission.html": [
    { target: ".submission-form", title: "Embedded hand-in", body: "The full submission is a webform inside the app." },
    { target: "#validateSubmission", title: "Validate package", body: "Click this to show the hand-in checklist is complete." },
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
  start.textContent = "Start tour";
  document.body.appendChild(start);

  const overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  overlay.innerHTML = `
    <div class="tour-scrim"></div>
    <div class="tour-popover" role="dialog" aria-live="polite">
      <p class="eyebrow">Guided tour</p>
      <h2 id="tourTitle"></h2>
      <p id="tourBody"></p>
      <div class="tour-progress" id="tourProgress"></div>
      <div class="tour-actions">
        <button type="button" class="secondary" id="tourBack">Back</button>
        <button type="button" id="tourNext">Next</button>
        <button type="button" class="secondary" id="tourSkip">Skip</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const popover = overlay.querySelector(".tour-popover");

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
    const rect = target.getBoundingClientRect();
    popover.style.top = `${Math.max(80, rect.bottom + window.scrollY + 14)}px`;
    popover.style.left = `${Math.min(window.innerWidth - 380, Math.max(16, rect.left + window.scrollX))}px`;
    setText("#tourTitle", step.title);
    setText("#tourBody", step.body);
    setText("#tourProgress", `${index + 1} of ${steps.length}`);
    setText("#tourNext", index === steps.length - 1 ? "Finish" : "Next");
    $("#tourBack").disabled = index === 0;
  }

  function openTour() {
    overlay.classList.add("open");
    showStep(0);
  }

  function closeTour() {
    overlay.classList.remove("open");
    clearHighlights();
    window.localStorage.setItem("pulsegridTourSeen", "true");
  }

  start.addEventListener("click", openTour);
  overlay.querySelector("#tourBack").addEventListener("click", () => showStep(index - 1));
  overlay.querySelector("#tourNext").addEventListener("click", () => {
    if (index === steps.length - 1) closeTour();
    else showStep(index + 1);
  });
  overlay.querySelector("#tourSkip").addEventListener("click", closeTour);

  if (!window.localStorage.getItem("pulsegridTourSeen")) {
    window.setTimeout(openTour, 700);
  }
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
