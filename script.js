<script>
// Phish-or-Real Game Logic (SharePoint Safe)

// ================= QUESTIONS =================
var QUESTIONS = [
  {
    text: "URGENT: Your Microsoft 365 password expires today. Click here to reset now: http://secure-login365.co",
    answer: "Phish",
    explanation: "Fake domain + urgency. Official notices use your company domain and secure links (https://)."
  },
  {
    text: "Your HR team uploaded your annual review to OneDrive. Click the link to view (internal.onedrive.company.com).",
    answer: "Real",
    explanation: "Looks like an internal link and a normal HR announcement."
  },
  {
    text: "New crypto opportunity! Elon just announced SharkCoin — invest early here!",
    answer: "Phish",
    explanation: "Celebrity endorsements and 'too-good-to-be-true' promises are common crypto lures."
  },
  {
    text: "You received an MFA code: 281937. If you didn't request this, change your password immediately.",
    answer: "Real",
    explanation: "MFA codes are common legitimate messages."
  },
  {
    text: "We noticed unusual activity on your wallet. Verify your seed phrase below to restore access.",
    answer: "Phish",
    explanation: "Legitimate services NEVER ask for your seed phrase."
  },
  {
    text: "Hi Bob, I forwarded an important doc about the Q4 budget. Can you review and comment?",
    answer: "Real",
    explanation: "Personalized messages from colleagues are usually real."
  },
  {
    text: "Text: 'Your delivery is delayed. Reschedule here: tinyurl.com/deliver123'.",
    answer: "Phish",
    explanation: "Shortened URLs and unknown numbers are red flags."
  },
  {
    text: "Email: 'We updated our privacy policy. Please review the changes at https://company.com/privacy'.",
    answer: "Real",
    explanation: "Official communications use verified domains."
  },
  {
    text: "DM: 'I can get you early access to TokenX — send me your wallet seed.'",
    answer: "Phish",
    explanation: "Anyone asking for seed phrases is scamming you."
  },
  {
    text: "Audio: 'This is your bank. Press 1 now to confirm a suspicious transaction.'",
    answer: "Phish",
    explanation: "Unsolicited calls requesting immediate action are scams."
  }
];

// ================= GAME STATE =================
var questions = [];
var current = 0;
var score = 0;
var total = 10;
var playerName = "Anonymous";
var FLOW_URL = "YOUR_FLOW_URL_HERE";

// ================= HELPERS =================
function shuffle(arr) {
  var i, j, temp;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// ================= INIT =================
function init() {
  document.getElementById("startBtn").onclick = startGame;
  document.getElementById("btnPhish").onclick = function () { answer("Phish"); };
  document.getElementById("btnReal").onclick = function () { answer("Real"); };
  document.getElementById("nextBtn").onclick = nextQ;
  document.getElementById("playAgainBtn").onclick = startGame;
}

// ================= START GAME =================
function startGame() {
  questions = shuffle(QUESTIONS.slice(0));
  current = 0;
  score = 0;

  document.getElementById("qTotal").innerText = total;
  document.getElementById("startScreen").className = "hidden";
  document.getElementById("endScreen").className = "hidden";
  document.getElementById("questionScreen").className = "";

  showQ();
}

// ================= SHOW QUESTION =================
function showQ() {
  var q = questions[current];
  document.getElementById("qNum").innerText = current + 1;
  document.getElementById("messageBox").innerText = q.text;

  document.getElementById("explanation").className = "hidden";
  document.getElementById("nextBtn").disabled = true;

  enableButtons(true);
}

// ================= ANSWER =================
function answer(choice) {
  enableButtons(false);

  var q = questions[current];
  var correct = (choice === q.answer);
  if (correct) score++;

  var explanation = document.getElementById("explanation");
  explanation.innerHTML =
    "<strong>" + (correct ? "Correct!" : "Not quite.") + "</strong> " + q.explanation;
  explanation.className = "";

  document.getElementById("nextBtn").disabled = false;
}

// ================= NEXT QUESTION =================
function nextQ() {
  current++;
  if (current >= total) {
    endGame();
  } else {
    showQ();
  }
}

// ================= END GAME =================
function endGame() {
  document.getElementById("questionScreen").className = "hidden";

  var end = document.getElementById("endScreen");
  document.getElementById("scoreTitle").innerText =
    "You scored " + score + "/" + total;

  var msg = "Nice work!";
  if (score === total) msg = "Perfect! Cyber Shark!";
  else if (score >= Math.ceil(total * 0.8)) msg = "Great job — Cyber Sharp!";
  else if (score >= Math.ceil(total * 0.5)) msg = "Not bad — keep practicing!";
  else msg = "Watch out — more training recommended.";

  document.getElementById("scoreMsg").innerText = msg;
  end.className = "";

  if (FLOW_URL && FLOW_URL !== "YOUR_FLOW_URL_HERE") {
    fetch(FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: playerName,
        score: score,
        timestamp: new Date().toISOString()
      })
    });
  }

  setTimeout(showBingoCall, 1000);
}

// ================= BINGO CALL =================
function showBingoCall() {
  var end = document.getElementById("endScreen");

  var old = document.getElementById("bingoCall");
  if (old) end.removeChild(old);

  var bingo = document.createElement("div");
  bingo.id = "bingoCall";
  bingo.style.fontSize = "2em";
  bingo.style.fontWeight = "bold";
  bingo.style.textAlign = "center";
  bingo.style.marginTop = "20px";
  bingo.innerText = "BINGO CALL";

  end.appendChild(bingo);
}

// ================= BUTTON ENABLE =================
function enableButtons(ok) {
  document.getElementById("btnPhish").disabled = !ok;
  document.getElementById("btnReal").disabled = !ok;
}

// ================= LOAD =================
document.addEventListener("DOMContentLoaded", init);
</script>
