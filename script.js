const emojis = ["🍎", "🍌", "🍇", "🍒", "🍎", "🍌", "🍇", "🍒"]; // pairs
const gameContainer = document.getElementById("game");
let shuffleEmojis = emojis.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;

const moveSpan = document.getElementById("moveCount");

// Create cards
shuffleEmojis.forEach((emoji) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-emoji", emoji);
  card.addEventListener("click", flipCard);
  gameContainer.appendChild(card);
});

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

function updateMoves() {
  moves++;
  moveSpan.textContent = moves;
}

function checkMatch() {
  updateMoves();

  if (
    firstCard.getAttribute("data-emoji") ===
    secondCard.getAttribute("data-emoji")
  ) {
    matchedPairs++;
    firstCard = null;
    secondCard = null;

    if (matchedPairs === emojis.length / 2) {
      setTimeout(() => {
        alert(`Great! You finished in ${moves} moves 🎉`);
      }, 200);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard.classList.remove("flipped");
      secondCard.textContent = "";
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 700);
  }
}

document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});
