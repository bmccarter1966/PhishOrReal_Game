<script>
// ================= QUESTIONS =================
const QUESTIONS = [
  {text: "URGENT: Your Microsoft 365 password expires today. Click here to reset now: http://secure-login365.co", answer: "Phish", explanation: "Fake domain + urgency. Official notices use your company domain and secure links (https://)."},
  {text: "Your HR team uploaded your annual review to OneDrive. Click the link to view (internal.onedrive.company.com).", answer: "Real", explanation: "Looks like an internal link and a normal HR announcement."},
  {text: "New crypto opportunity! Elon just announced SharkCoin — invest early here!", answer: "Phish", explanation: "Celebrity endorsements and 'too-good-to-be-true' promises are common crypto lures."},
  {text: "You received an MFA code: 281937. If you didn't request this, change your password immediately.", answer: "Real", explanation: "MFA codes are common legitimate messages."},
  {text: "We noticed unusual activity on your wallet. Verify your seed phrase below to restore access.", answer: "Phish", explanation: "Legitimate services NEVER ask for your seed phrase."},
  {text: "Hi Bob, I forwarded an important doc about the Q4 budget. Can you review and comment?", answer: "Real", explanation: "Personalized messages from colleagues are usually real."},
  {text: "Text: 'Your delivery is delayed. Reschedule here: tinyurl.com/deliver123'.", answer: "Phish", explanation: "Shortened URLs and unknown numbers are red flags."},
  {text: "Email: 'We updated our privacy policy. Please review the changes at https://company.com/privacy'.", answer: "Real", explanation: "Official communications use verified domains."},
  {text: "DM: 'I can get you early access to TokenX — send me your wallet seed.'", answer: "Phish", explanation: "Anyone asking for seed phrases is scamming you."},
  {text: "Audio: 'This is your bank. Press 1 now to confirm a suspicious transaction.'", answer: "Phish", explanation: "Unsolicited calls requesting immediate action are scams."}
];

// ================= GAME STATE =================
let questions = [];
let current = 0;
let score = 0;
let total = QUESTIONS.length;
const playerName = "Anonymous";
const FLOW_URL = ""; // Optional Power Automate URL

// ================= HELPERS =================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ================= INIT =================
function init() {
  // Safety: check elements exist
  if (!document.getElementById("startBtn")) return;

  document.getElementById("startBtn").onclick = startGame;
  document.getElementById("btnPhish").onclick = () => answer("Phish");
  document.getElementById("btnReal").onclick = () => answer("Real");
  document.getElementById("nextBtn").onclick = nextQ;
  document.getElementById("playAgainBtn").onclick = startGame;
}

// ================= START GAME =================
function startGame() {
  questions = shuffle([...QUESTIONS]);
  current = 0;
  score = 0;

  total = questions.length;

  document.getElementById("qTotal").innerText = total;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("questionScreen").classList.remove("hidden");

  showQ();
}

// ================= SHOW QUESTION =================
function showQ() {
  const q = questions[current];
  if (!q) return;

  document.getElementById("qNum").innerText = current + 1;
  document.getElementById("messageBox").innerText = q.text;

  const explanation = document.getElementById("explanation");
  explanation.classList.add("hidden");
  explanation.textContent = "";

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;
  nextBtn.style.display = "none";

  enableButtons(true);
}

// ================= ANSWER =================
function answer(choice) {
  enableButtons(false);

  const q = questions[current];
  const correct = choice === q.answer;
  if (correct) score++;

  const explanation = document.getElementById("explanation");
  explanation.innerHTML = `<strong>${correct ? "Correct!" : "Not quite."}</strong> ${q.explanation}`;
  explanation.classList.remove("hidden");

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = false;
  nextBtn.style.display = "inline-block";
}

// ================= NEXT QUESTION =================
function nextQ() {
  current++;
  if (current >= total) endGame();
  else showQ();
}

// ================= END GAME =================
function endGame() {
  document.getElementById("questionScreen").classList.add("hidden");

  const end = document.getElementById("endScreen");
  document.getElementById("scoreTitle").innerText = `You scored ${score}/${total}`;

  let msg = "Nice work!";
  if (score === total) msg = "Perfect! Cyber Shark!";
  else if (score >= Math.ceil(total * 0.8)) msg = "Great job — Cyber Sharp!";
  else if (score >= Math.ceil(total * 0.5)) msg = "Not bad — keep practicing!";
  else msg = "Watch out — more training recommended.";

  document.getElementById("scoreMsg").innerText = msg;
  end.classList.remove("hidden");

  if (FLOW_URL && FLOW_URL !== "YOUR_FLOW_URL_HERE") {
    fetch(FLOW_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playerName, score, timestamp: new Date().toISOString()})
    }).catch(err => console.warn("Flow error:", err));
  }

  setTimeout(showBingoCall, 1000);
}

// ================= BINGO CALL =================
function showBingoCall() {
  const end = document.getElementById("endScreen");
  const old = document.getElementById("bingoCall");
  if (old) end.removeChild(old);

  const bingo = document.createElement("div");
  bingo.id = "bingoCall";
  bingo.style.fontSize = "2em";
  bingo.style.fontWeight = "bold";
  bingo.style.textAlign = "center";
  bingo.style.marginTop = "20px";
  bingo.innerText = "BINGO CALL";

  end.appendChild(bingo);
}

// ================= ENABLE / DISABLE BUTTONS =================
function enableButtons(ok) {
  document.getElementById("btnPhish").disabled = !ok;
  document.getElementById("btnReal").disabled = !ok;
}

// ================= LOAD =================
// Attach init safely even if script is in <head>
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
</script>

