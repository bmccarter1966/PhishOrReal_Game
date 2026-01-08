// phish-or-real game logic with Power Automate integration

const QUESTIONS = [
  {
    text: "URGENT: Your Microsoft 365 password expires today. Click here to reset now: http://secure-login365.co",
    answer: "Phish",
    explanation: "Fake domain + urgency. Official notices use your company domain and secure links (https://)."
  },
  {
    text: "Your HR team uploaded your annual review to OneDrive. Click the link to view (internal.onedrive.company.com).",
    answer: "Real",
    explanation: "Looks like an internal link and a normal HR announcement. If in doubt, open OneDrive directly rather than clicking links."
  },
  {
    text: "New crypto opportunity! Elon just announced SharkCoin — invest early here!",
    answer: "Phish",
    explanation: "Celebrity endorsements and 'too-good-to-be-true' promises are common crypto lures. Verify on official channels."
  },
  {
    text: "You received an MFA code: 281937. If you didn't request this, change your password immediately.",
    answer: "Real",
    explanation: "MFA codes are common legitimate messages. Treat unexpected codes as a possible sign someone is trying to access your account."
  },
  {
    text: "We noticed unusual activity on your wallet. Verify your seed phrase below to restore access.",
    answer: "Phish",
    explanation: "Legitimate services NEVER ask for your seed phrase. Never share private keys or seed phrases."
  },
  {
    text: "Hi Bob, I forwarded an important doc about the Q4 budget. Can you review and comment?",
    answer: "Real",
    explanation: "Personalized messages from colleagues are usually real. If request seems odd, verify by contacting the sender directly."
  },
  {
    text: "Text: 'Your delivery is delayed. Reschedule here: tinyurl.com/deliver123' (from a number you don't recognize).",
    answer: "Phish",
    explanation: "Shortened URLs and unknown numbers are red flags. Check tracking via the carrier's official site."
  },
  {
    text: "Email: 'We updated our privacy policy. Please review the changes at https://company.com/privacy'.",
    answer: "Real",
    explanation: "Official communications use verified company domains and don't pressure you for credentials."
  },
  {
    text: "DM: 'I can get you early access to TokenX — send me your wallet seed and I'll transfer tokens.'",
    answer: "Phish",
    explanation: "Anyone asking for seed phrases or private keys is scamming you. Never share wallet credentials."
  },
  {
    text: "Audio message: 'This is your bank. Press 1 now to confirm a suspicious transaction.'",
    answer: "Phish",
    explanation: "Unsolicited calls requesting immediate action are scams. Hang up and call your bank using a verified number."
  }
];

let questions = [];
let current = 0;
let score = 0;
const total = 10;
let playerName = "";

const FLOW_URL = "YOUR_FLOW_URL_HERE"; // <-- Paste your Power Automate HTTP trigger URL here

// Shuffle array helper
function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Initialize event listeners
function init(){
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('btnPhish').addEventListener('click', ()=>answer('Phish'));
  document.getElementById('btnReal').addEventListener('click', ()=>answer('Real'));
  document.getElementById('nextBtn').addEventListener('click', nextQ);
  document.getElementById('playAgainBtn').addEventListener('click', startGame);
}

// Start game
function startGame(){
  playerName = prompt("Enter your name for the leaderboard:", "");
  if(!playerName) playerName = "Anonymous";

  questions = shuffle([...QUESTIONS]).slice(0, total);
  current = 0;
  score = 0;

  document.getElementById('qTotal').textContent = total;
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('questionScreen').classList.remove('hidden');

  showQ();
}

// Show current question
function showQ(){
  const q = questions[current];
  document.getElementById('qNum').textContent = current + 1;
  document.getElementById('messageBox').textContent = q.text;
  document.getElementById('explanation').classList.add('hidden');
  document.getElementById('nextBtn').disabled = true;
  enableButtons(true);
}

// Handle answer selection
function answer(choice){
  enableButtons(false);
  const q = questions[current];
  const correct = (choice === q.answer);
  if(correct) score++;

  const explanation = document.getElementById('explanation');
  explanation.innerHTML = `<strong>${correct ? 'Correct!' : 'Not quite.'}</strong> ${q.explanation}`;
  explanation.classList.remove('hidden');

  document.getElementById('nextBtn').disabled = false;
}

// Move to next question
function nextQ(){
  current++;
  if(current >= total){
    endGame();
  } else {
    showQ();
  }
}

// End game and show score + Bingo Call
function endGame(){
  document.getElementById('questionScreen').classList.add('hidden');
  const end = document.getElementById('endScreen');

  // Score display
  document.getElementById('scoreTitle').textContent = `You scored ${score}/${total}`;
  let msg = "Nice work!";
  if(score === total) msg = "Perfect! Cyber Shark!";
  else if(score >= Math.ceil(total*0.8)) msg = "Great job — Cyber Sharp!";
  else if(score >= Math.ceil(total*0.5)) msg = "Not bad — keep practicing!";
  else msg = "Watch out — more training recommended.";
  document.getElementById('scoreMsg').textContent = msg;
  end.classList.remove('hidden');

  // Send results to Power Automate
  if(FLOW_URL && FLOW_URL !== "YOUR_FLOW_URL_HERE"){
    fetch(FLOW_URL,{
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        playerName: playerName,
        score: score,
        timestamp: new Date().toISOString()
      })
    }).then(res=>{
      console.log("Score sent to Power Automate.");
      document.getElementById('scoreMsg').textContent += " Your score has been submitted to the leaderboard!";
    }).catch(err=>{
      console.warn("Could not send score:", err);
    });
  }

  // Show Bingo Call after 1 second
  setTimeout(showBingoCall, 1000);
}

// Display Bingo Call
function showBingoCall(){
  const end = document.getElementById('endScreen');

  // Remove old bingo call if exists
  const old = document.getElementById('bingoCall');
  if(old) old.remove();

  const bingo = document.createElement('div');
  bingo.id = "bingoCall";
  bingo.style.fontSize = "2em";
  bingo.style.fontWeight = "bold";
  bingo.style.textAlign = "center";
  bingo.style.marginTop = "20px";
  bingo.textContent = "BINGO CALL"; // Placeholder text
  end.appendChild(bingo);
}

// Enable/disable answer buttons
function enableButtons(ok){
  document.getElementById('btnPhish').disabled = !ok;
  document.getElementById('btnReal').disabled = !ok;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
