// 🌟 LEVEL SYSTEM + TIMER + MEMORY GAME

const LEVELS = {
  easy: 2,
  medium: 4,
  hard: 6
};
let currentLevel = "medium";

const emojis = [
  "🍎","🍌","🍇","🍒","🍉","🍍","🥝","🍓",
  "🥕","🍆","🌽","🥦","🧀","🍔","🍕","🍩",
  "🍪","🍭"
];

const gameContainer = document.getElementById("game");
const moveSpan = document.getElementById("moveCount");
const timeSpan = document.getElementById("timeCount");
const levelSelect = document.getElementById("levelSelect");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let timerStarted = false;
let seconds = 0;
let timerId = null;

// 🔁 Restart Game
document.getElementById("restartBtn").addEventListener("click", () => {
  setupGame();
});

// 🔀 Setup Cards & Level
function setupGame() {
  gameContainer.innerHTML = "";
  moves = 0;
  moveSpan.textContent = "0";
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  resetTimer();

  gameContainer.style.gridTemplateColumns =
    `repeat(${LEVELS[currentLevel]}, 70px)`;

  let totalCards = LEVELS[currentLevel] * LEVELS[currentLevel];
  let neededPairs = totalCards / 2;
  let gameEmojis = emojis.slice(0, neededPairs);
  let cardData = gameEmojis.concat(gameEmojis).sort(() => Math.random() - 0.5);

  cardData.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-emoji", emoji);
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });
}

// 🃏 Flip Card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!timerStarted) startTimer();

  this.textContent = this.getAttribute("data-emoji");
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

// 💠 Check Match
function checkMatch() {
  updateMoves();

  if (firstCard.getAttribute("data-emoji") === secondCard.getAttribute("data-emoji")) {
    matchedPairs++;
    firstCard = null;
    secondCard = null;

    if (matchedPairs === (LEVELS[currentLevel] * LEVELS[currentLevel]) / 2) {
      clearInterval(timerId);
      setTimeout(() => {
        alert(`🎉 Level: ${currentLevel.toUpperCase()}\nMoves: ${moves}\nTime: ${seconds} sec`);
      }, 300);
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

// 🧠 Moves Count
function updateMoves() {
  moves++;
  moveSpan.textContent = moves;
}

// 🕒 Timer System
function startTimer() {
  timerStarted = true;
  timerId = setInterval(() => {
    seconds++;
    timeSpan.textContent = seconds;
  }, 1000);
}

function resetTimer() {
  clearInterval(timerId);
  timerStarted = false;
  seconds = 0;
  timeSpan.textContent = "0";
}

// 🔃 Level Change
levelSelect.addEventListener("change", () => {
  currentLevel = levelSelect.value;
  setupGame();
});

// 🚀 Start First
setupGame();
