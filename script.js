<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Phish-or-Real Game</title>
<style>
.hidden { display: none; }
button { margin: 5px; padding: 10px 20px; font-size: 16px; }
#messageBox { margin: 20px 0; font-size: 18px; }
#explanation { margin-top: 10px; font-style: italic; }
</style>
</head>
<body>

<!-- START SCREEN -->
<div id="startScreen">
  <h1>Phish-or-Real Game</h1>
  <button id="startBtn">Start Game</button>
</div>

<!-- QUESTION SCREEN -->
<div id="questionScreen" class="hidden">
  <div>Question <span id="qNum"></span> / <span id="qTotal"></span></div>
  <div id="messageBox"></div>
  <button id="btnPhish">Phish</button>
  <button id="btnReal">Real</button>
  <button id="nextBtn" class="hidden">Next</button>
  <div id="explanation"></div>
</div>

<!-- END SCREEN -->
<div id="endScreen" class="hidden">
  <h2 id="scoreTitle"></h2>
  <div id="scoreMsg"></div>
  <div id="bingoCall"></div>
  <button id="playAgainBtn">Play Again</button>
</div>

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
const total = QUESTIONS.length;
const playerName = "Anonymous";
const FLOW_URL = ""; // Optional

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
  const startBtn = document.getElementById("startBtn");
  const btnPhish = document.getElementById("btnPhish");
  const btnReal = document.getElementById("btnReal");
  const nextBtn = document.getElementById("nextBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");

  if (!startBtn || !btnPhish || !btnReal || !nextBtn || !playAgainBtn) return;

  startBtn.addEventListener("click", startGame);
  btnPhish.addEventListener("click", () => answer("Phish"));
  btnReal.addEventListener("click", () => answer("Real"));
  nextBtn.addEventListener("click", nextQ);
  playAgainBtn.addEventListener("click", startGame);
}

// ================= START GAME =================
function startGame() {
  questions = shuffle([...QUESTIONS]);
  current = 0;
  score = 0;

  document.getElementById("qTotal").textContent = total;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("questionScreen").classList.remove("hidden");

  showQ();
}

// ================= SHOW QUESTION =================
function showQ() {
  const q = questions[current];
  document.getElementById("qNum").textContent = current + 1;
  document.getElementById("messageBox").textContent = q.text;

  const explanation = document.getElementById("explanation");
  explanation.classList.add("hidden");
  explanation.textContent = "";

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;
  nextBtn.classList.add("hidden");

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
  nextBtn.classList.remove("hidden");
}

// ================= NEXT =================
function nextQ() {
  current++;
  if (current >= total) endGame();
  else showQ();
}

// ================= END GAME =================
function endGame() {
  document.getElementById("questionScreen").classList.add("hidden");

  const end = document.getElementById("endScreen");
  document.getElementById("scoreTitle").textContent = `You scored ${score}/${total}`;

  let msg = "Nice work!";
  if (score === total) msg = "Perfect! Cyber Shark!";
  else if (score >= Math.ceil(total * 0.8)) msg = "Great job — Cyber Sharp!";
  else if (score >= Math.ceil(total * 0.5)) msg = "Not bad — keep practicing!";
  else msg = "Watch out — more training recommended.";

  document.getElementById("scoreMsg").textContent = msg;
  end.classList.remove("hidden");

  if (FLOW_URL) {
    fetch(FLOW_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playerName, score, timestamp: new Date().toISOString()})
    }).catch(err => console.warn("Flow error:", err));
  }

  setTimeout(showBingoCall, 500);
}

// ================= BINGO CALL =================
function showBingoCall() {
  const bingoDiv = document.getElementById("bingoCall");
  bingoDiv.textContent = "BINGO CALL";
  bingoDiv.style.fontSize = "2em";
  bingoDiv.style.fontWeight = "bold";
  bingoDiv.style.textAlign = "center";
  bingoDiv.style.marginTop = "20px";
}

// ================= ENABLE BUTTONS =================
function enableButtons(ok) {
  document.getElementById("btnPhish").disabled = !ok;
  document.getElementById("btnReal").disabled = !ok;
}

// ================= LOAD =================
document.addEventListener("DOMContentLoaded", init);
</script>


