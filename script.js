// -------- IMAGE LIST (images folder er file name) --------
const imageList = [
  "apple.png",
  "banana.png",
  "cat.png",
  "dog.png",
  "grapes.png",
  "lion.png"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timer = null;

// -------- SOUND EFFECTS (sounds folder) --------
const flipSound = new Audio("sounds/flip.mp3");
const winSound = new Audio("sounds/win.mp3");
flipSound.volume = 0.6;
winSound.volume = 0.7;

// ----------------- GAME START -----------------
function startGame() {
  const levelSelect = document.getElementById("level");
  const level = levelSelect.value; // easy / medium / hard
  const cardContainer = document.querySelector(".card-container");
  const wrapper = document.querySelector(".game-wrapper");

  wrapper.classList.remove("win");

  // Level onujayi grid size & pair number
  let pairs, cols;
  if (level === "easy") {
    pairs = 2;    // 4 card (2x2)
    cols = 2;
  } else if (level === "medium") {
    pairs = 4;    // 8 card (4x2)
    cols = 4;
  } else {
    pairs = 6;    // 12 card (4x3)
    cols = 4;
  }

  cardContainer.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  // Reset stats & timer
  cardContainer.innerHTML = "";
  clearInterval(timer);
  moves = 0;
  time = 0;
  document.getElementById("moves").innerText = `Moves: ${moves}`;
  document.getElementById("time").innerText = `Time: ${time}s`;

  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerText = `Time: ${time}s`;
  }, 1000);

  // Prepare card list
  const selectedImages = imageList.slice(0, pairs);
  cards = [...selectedImages, ...selectedImages]; // pair banalo

  // Shuffle
  cards.sort(() => Math.random() - 0.5);

  // Create card elements
  cards.forEach((imgName) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgName;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="images/${imgName}" alt="${imgName}">
        </div>
      </div>
    `;

    card.addEventListener("click", handleCardClick);
    cardContainer.appendChild(card);
  });

  // Reset board state
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ----------------- CARD CLICK -----------------
function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");
  try {
    flipSound.currentTime = 0;
    flipSound.play();
  } catch (e) {
    // mobile auto-play restriction ignore
  }

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  document.getElementById("moves").innerText = `Moves: ${moves}`;

  checkForMatch();
}

// ----------------- MATCH CHECK -----------------
function checkForMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);

  resetBoard();

  // All cards matched?
  const allCards = document.querySelectorAll(".card");
  const allFlipped = Array.from(allCards).every(card =>
    card.classList.contains("flip")
  );

  if (allFlipped) {
    clearInterval(timer);
    const wrapper = document.querySelector(".game-wrapper");
    wrapper.classList.add("win");

    try {
      winSound.currentTime = 0;
      winSound.play();
    } catch (e) {}

    setTimeout(() => {
      alert(`🎉 You Won!\nTime: ${time}s\nMoves: ${moves}`);
    }, 500);
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 800);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ----------------- LISTENERS -----------------
document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("level").addEventListener("change", startGame);
window.addEventListener("load", startGame);
