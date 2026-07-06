const samples = {
  hi: "PHC Bhairavpur mein ORS 18 packet bache hain, paracetamol 500 ki 10 strip hain, malaria RDT khatam hai. Aaj OPD 118 tha aur bukhar ke 31 patient aaye.",
  mr: "PHC Bhairavpur madhe ORS 18 packet urle aahet, paracetamol 500 chi 10 strip aahet, malaria RDT sampale aahe. Aaj OPD 118 hota ani tapache 31 patient aale.",
};

const state = {
  processed: false,
};

const $ = (selector) => document.querySelector(selector);

function processVoiceNote() {
  state.processed = true;
  $("#voiceConfidence").textContent = "LLM confidence 94%";
  $("#heroConfidence").textContent = "91%";
  $("#heroRisk").textContent = "6d";
  $("#urgentCount").textContent = "5";
  $("#queueCount").textContent = "5 open";
  $("#healthScore").textContent = "58";

  $("#extractGrid").innerHTML = `
    <div><span>Facility</span><strong>PHC Bhairavpur</strong></div>
    <div><span>Stock</span><strong>ORS 18 · PCM 10 · RDT 0</strong></div>
    <div><span>Footfall</span><strong>OPD 118 · fever 31</strong></div>
    <div><span>Tests</span><strong>Malaria RDT stock-out</strong></div>
  `;

  if (!document.querySelector("[data-generated-warning]")) {
    $("#warningList").insertAdjacentHTML(
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

  $("#transferCard").innerHTML = `
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
  `;
  $("#approveOrder").addEventListener("click", approveOrder);
}

function approveOrder() {
  $("#transferCard").classList.add("ready");
  $("#transferCard").innerHTML = `
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
  $("#copilotAnswer").textContent = answer;
}

function loadMarathi() {
  $("#language").value = "mr";
  $("#voiceText").value = samples.mr;
}

$("#processVoice").addEventListener("click", processVoiceNote);
$("#loadMarathi").addEventListener("click", loadMarathi);
$("#askCopilot").addEventListener("click", askCopilot);
$("#language").addEventListener("change", (event) => {
  $("#voiceText").value = samples[event.target.value];
});
