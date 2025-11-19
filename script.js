// ---------- IMAGE LIST (images folder er file name gulo) ----------
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

// ----------------- GAME START -----------------
function startGame() {
  const levelSelect = document.getElementById("level");
  const level = levelSelect.value; // easy / medium / hard
  const cardContainer = document.querySelector(".card-container");

  // grid columns level onujayi
  if (level === "easy") {
    cardContainer.style.gridTemplateColumns = "repeat(2, 80px)";
  } else {
    cardContainer.style.gridTemplateColumns = "repeat(4, 80px)";
  }

  // reset UI
  cardContainer.innerHTML = "";
  clearInterval(timer);
  moves = 0;
  time = 0;
  document.getElementById("moves").innerText = `Moves: ${moves}`;
  document.getElementById("time").innerText = `Time: ${time}s`;

  // timer start
  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerText = `Time: ${time}s`;
  }, 1000);

  // level onujayi koy pair
  let pairs = 2; // default easy
  if (level === "medium") pairs = 4;
  if (level === "hard") pairs = 6;

  const selectedImages = imageList.slice(0, pairs);

  // pair bananor jonno duibar kore add
  cards = [...selectedImages, ...selectedImages];

  // shuffle
  cards.sort(() => Math.random() - 0.5);

  // card create
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
}

// ----------------- CARD CLICK -----------------
function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

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

  // sob card flip hole win
  const allCards = document.querySelectorAll(".card");
  const allFlipped = Array.from(allCards).every(card =>
    card.classList.contains("flip")
  );

  if (allFlipped) {
    clearInterval(timer);
    setTimeout(() => {
      alert(`🎉 You Won!\nTime: ${time}s\nMoves: ${moves}`);
    }, 300);
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
