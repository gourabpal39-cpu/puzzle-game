// 🌟 LEVEL SYSTEM + BASIC MEMORY GAME FULL WORKING VERSION

// 1️⃣ LEVEL CONFIG
const LEVELS = {
  easy: 2,    // 2×2 grid = 4 cards (2 pairs)
  medium: 4,  // 4×4 grid = 16 cards (8 pairs)
  hard: 6     // 6×6 grid = 36 cards (18 pairs)
};
let currentLevel = "medium";

// 2️⃣ EMOJIS (18 Symbol)
const emojis = [
  "🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍓",
  "🥕", "🍆", "🌽", "🥦", "🧀", "🍔", "🍕", "🍩",
  "🍪", "🍭"
];

const gameContainer = document.getElementById("game");
const moveSpan = document.getElementById("moveCount");
const levelSelect = document.getElementById("levelSelect");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;

// 3️⃣ CREATE CARDS BASED ON LEVEL
function setupGame() {
  // Clear old cards
  gameContainer.innerHTML = "";
  moves = 0;
  moveSpan.textContent = "0";
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;

  // Set grid size
  gameContainer.style.gridTemplateColumns =
    `repeat(${LEVELS[currentLevel]}, 70px)`;

  // Required pairs
  let neededPairs = (LEVELS[currentLevel] * LEVELS[currentLevel]) / 2;
  let gameEmojis = emojis.slice(0, neededPairs);
  let cardData = gameEmojis.concat(gameEmojis);
  let shuffleEmojis = cardData.sort(() => Math.random() - 0.5);

  // Create the cards
  shuffleEmojis.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-emoji", emoji);
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });
}

// 4️⃣ FLIP CARD
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.textContent = this.getAttribute("data-emoji");
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

// 5️⃣ MATCH CHECK
function checkMatch() {
  updateMoves();

  if (
    firstCard.getAttribute("data-emoji") ===
    secondCard.getAttribute("data-emoji")
  ) {
    matchedPairs++;

    // All pairs found
    let totalPairs = (LEVELS[currentLevel] * LEVELS[currentLevel]) / 2;
    if (matchedPairs === totalPairs) {
      setTimeout(() => {
        alert(`🎉 Level: ${currentLevel.toUpperCase()}\nMoves: ${moves}`);
      }, 200);
    }

    firstCard = null;
    secondCard = null;
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

// 6️⃣ MOVE COUNT
function updateMoves() {
  moves++;
  moveSpan.textContent = moves;
}

// 7️⃣ LEVEL CHANGE (reload game)
levelSelect.addEventListener("change", function () {
  currentLevel = this.value;
  setupGame();
});

// 8️⃣ RESTART BUTTON
document.getElementById("restartBtn").addEventListener("click", () => {
  setupGame();
});

// 🚀 START GAME FIRST TIME
setupGame();
