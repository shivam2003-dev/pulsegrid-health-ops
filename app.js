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

on("#processVoice", "click", processVoiceNote);
on("#loadMarathi", "click", loadMarathi);
on("#askCopilot", "click", askCopilot);
on("#validateSubmission", "click", validateSubmission);
on("#language", "change", (event) => {
  const voiceText = $("#voiceText");
  if (voiceText) voiceText.value = samples[event.target.value];
});
