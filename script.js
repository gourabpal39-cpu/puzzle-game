// basic references
const gameContainer = document.getElementById("game");
const moveSpan = document.getElementById("moveCount");
const timeSpan = document.getElementById("timeCount");
const restartBtn = document.getElementById("restartBtn");
const levelSelect = document.getElementById("levelSelect");
const splash = document.getElementById("splash");
const app = document.getElementById("app");
const startGameBtn = document.getElementById("startGameBtn");

// level config: koyta pair & koyta column
const LEVELS = {
  easy: { pairs: 2, columns: 2 },
  medium: { pairs: 8, columns: 4 },
  hard: { pairs: 18, columns: 6 },
};

// colourful emoji (cartoon feel)
const EMOJIS = [
  "🍎",
  "🍌",
  "🍇",
  "🍒",
  "🍉",
  "🍍",
  "🥝",
  "🍓",
  "🥕",
  "🍆",
  "🌽",
  "🥦",
  "🧀",
  "🍔",
  "🍕",
  "🍩",
  "🍪",
  "🍭",
];

let currentLevel = "medium";
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerId = null;
let timerStarted = false;

// (sound porer jonno rakhchi – file na thakleo kono problem nei)
let flipSound, matchSound, winSound;
try {
  flipSound = new Audio("flip.mp3");
  matchSound = new Audio("match.mp3");
  winSound = new Audio("win.mp3");
} catch (e) {}

function playSound(sound) {
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play();
  } catch (e) {}
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  timerId = setInterval(() => {
    seconds++;
    timeSpan.textContent = seconds;
  }, 1000);
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  timerStarted = false;
  seconds = 0;
  timeSpan.textContent = "0";
}

function shuffleArray(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function setupLevel(levelKey) {
  currentLevel = levelKey;
  const config = LEVELS[levelKey];

  // reset stats
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  moves = 0;
  moveSpan.textContent = "0";
  resetTimer();

  // clear old cards
  gameContainer.innerHTML = "";

  // choose emojis
  const needed = config.pairs;
  const symbols = EMOJIS.slice(0, needed);
  const cardsData = shuffleArray([...symbols, ...symbols]);

  // grid columns
  gameContainer.style.gridTemplateColumns = `repeat(${config.columns}, minmax(50px, 1fr))`;

  // create cards
  cardsData.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-symbol", symbol);
    card.addEventListener("click", onCardClick);
    gameContainer.appendChild(card);
  });
}

function updateMoves() {
  moves++;
  moveSpan.textContent = moves;
}

function onCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!timerStarted) {
    startTimer();
  }

  this.textContent = this.getAttribute("data-symbol");
  this.classList.add("flipped");
  playSound(flipSound);

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

function checkMatch() {
  updateMoves();

  const symbol1 = firstCard.getAttribute("data-symbol");
  const symbol2 = secondCard.getAttribute("data-symbol");

  if (symbol1 === symbol2) {
    matchedPairs++;
    playSound(matchSound);
    firstCard = null;
    secondCard = null;

    if (matchedPairs === LEVELS[currentLevel].pairs) {
      clearInterval(timerId);
      playSound(winSound);
      setTimeout(() => {
        alert(
          `Great! Level: ${currentLevel.toUpperCase()}\nMoves: ${moves}\nTime: ${seconds}s 🎉`
        );
      }, 200);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 700);
  }
}

// level change dropdown
levelSelect.addEventListener("change", () => {
  setupLevel(levelSelect.value);
});

// restart button
restartBtn.addEventListener("click", () => {
  setupLevel(currentLevel);
});

// splash theke start
startGameBtn.addEventListener("click", () => {
  splash.classList.add("hidden");
  app.classList.remove("hidden");
  setupLevel(currentLevel);
});
