const transcript = document.querySelector("#callTranscript");
const callState = document.querySelector("#callState");
const voiceAnswer = document.querySelector("#voiceAnswer");
const smsText = document.querySelector("#smsText");
const ticketQueue = document.querySelector("#ticketQueue");

const teluguAdvice =
  "రాజు గారు, మీ భూమిలో నత్రజని తక్కువగా ఉంది, బోరు నీరు లోతుగా ఉంది. ఈ వారం వరి వేయకండి. తర్వాత మంచి వాన పడిన తర్వాత ఒకటిన్నర ఎకరాల్లో కంది, అర ఎకరంలో మొక్కజొన్న వేయండి.";

const englishAdvice =
  "Raju garu, nitrogen is low and groundwater is deep. Avoid paddy this week. After the next effective rain, sow 1.5 acres red gram and 0.5 acre maize.";

function setCallState(label, mode) {
  callState.textContent = label;
  callState.className = `status-pill ${mode || ""}`.trim();
}

function speakAdvice() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(teluguAdvice);
  utterance.lang = "te-IN";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

document.querySelector("#startCall").addEventListener("click", () => {
  setCallState("Calling back", "active");
  transcript.innerHTML = `
    <p><strong>IVR:</strong> Namaskaram. Mee bhoomi salahaa kosam oka prashna adugandi.</p>
    <p><strong>Farmer:</strong> Ee varsham lo ye pantalu veyali?</p>
    <p><strong>ASR intent:</strong> Crop choice · Kothapalli · Kharif sowing · Risk low.</p>
  `;

  window.setTimeout(() => {
    setCallState("Answered", "done");
    voiceAnswer.textContent = englishAdvice;
    smsText.textContent = "Avoid paddy this week. Sow red gram 1.5 acre + maize 0.5 acre after 10 mm rain. Est. saving Rs 3,800.";
    transcript.insertAdjacentHTML("beforeend", `<p><strong>Kisan Alert:</strong> ${teluguAdvice}</p>`);
    speakAdvice();
  }, 900);
});

document.querySelector("#raiseTicket").addEventListener("click", () => {
  ticketQueue.insertAdjacentHTML(
    "afterbegin",
    `<div class="ticket urgent">
      <span>New</span>
      <strong>Voice/photo log · Confidence 39%</strong>
      <p>Farmer says "aaku pasupu." AI cannot separate nitrogen stress from early pest damage. Sent to RSK with plot history.</p>
    </div>`,
  );
});

document.querySelector("#closeTicket").addEventListener("click", () => {
  setCallState("RSK follow-up sent", "done");
  voiceAnswer.textContent =
    "RSK expert confirmed nutrient stress, not pest. Apply the recommended nitrogen split after rain; do not spray pesticide today.";
  smsText.textContent = "RSK: Nutrient stress likely. Wait for rain, then apply N split. No pesticide today.";
  ticketQueue.insertAdjacentHTML(
    "afterbegin",
    `<div class="ticket">
      <span>Closed</span>
      <strong>RSK advice delivered by IVR + SMS</strong>
      <p>Correction saved as training label and added to district stress map.</p>
    </div>`,
  );
});

function drawSatellite() {
  const canvas = document.querySelector("#satelliteCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#bfd0b4";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 120; i += 1) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(83, 126, 78, 0.22)" : "rgba(210, 171, 101, 0.2)";
    ctx.beginPath();
    ctx.ellipse(Math.random() * w, Math.random() * h, 16 + Math.random() * 38, 5 + Math.random() * 15, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const fields = [
    { x: 54, y: 60, width: 145, height: 100, color: "#5f995e", label: "healthy" },
    { x: 218, y: 54, width: 168, height: 110, color: "#cc7e55", label: "Raju plot" },
    { x: 410, y: 78, width: 178, height: 90, color: "#7aa96d", label: "standing crop" },
    { x: 72, y: 204, width: 180, height: 124, color: "#c58f55", label: "low wetness" },
    { x: 278, y: 210, width: 145, height: 116, color: "#5b945f", label: "red gram" },
    { x: 455, y: 222, width: 142, height: 105, color: "#d1a96a", label: "fallow" },
  ];

  fields.forEach((field) => {
    ctx.save();
    ctx.translate(field.x + field.width / 2, field.y + field.height / 2);
    ctx.rotate((Math.random() - 0.5) * 0.2);
    ctx.fillStyle = field.color;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = 3;
    ctx.fillRect(-field.width / 2, -field.height / 2, field.width, field.height);
    ctx.strokeRect(-field.width / 2, -field.height / 2, field.width, field.height);
    ctx.restore();
  });

  ctx.fillStyle = "#4d8cb7";
  ctx.beginPath();
  ctx.moveTo(0, 358);
  ctx.bezierCurveTo(100, 324, 180, 392, 300, 354);
  ctx.bezierCurveTo(430, 314, 510, 364, 680, 332);
  ctx.lineTo(680, 420);
  ctx.lineTo(0, 420);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#f7f5ee";
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(10, 190);
  ctx.bezierCurveTo(152, 170, 276, 184, 386, 184);
  ctx.bezierCurveTo(510, 184, 580, 200, 666, 188);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#17201b";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("Sentinel-1 wetness low", 224, 42);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(234, 88, 126, 34);
  ctx.fillStyle = "#17201b";
  ctx.font = "700 14px Inter, sans-serif";
  ctx.fillText("Raju plot", 252, 110);

  ctx.strokeStyle = "#b6403b";
  ctx.lineWidth = 5;
  ctx.strokeRect(216, 52, 172, 114);
}

drawSatellite();
