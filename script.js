// sob code DOM ready howar por run hobe
document.addEventListener("DOMContentLoaded", () => {
  const emojis = ["🍎", "🍌", "🍇", "🍒", "🍎", "🍌", "🍇", "🍒"]; // pairs
  const gameContainer = document.getElementById("game");
  const moveSpan = document.getElementById("moveCount");
  const restartBtn = document.getElementById("restartBtn");

  let shuffleEmojis = [...emojis].sort(() => Math.random() - 0.5);

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let moves = 0;

  // card banano
  shuffleEmojis.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-emoji", emoji);
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // same card bar bar na

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
    moveSpan.textContent = moves; // screen e update
  }

  function checkMatch() {
    // protibar 2nd card flip hole ekta move dhorbo
    updateMoves();

    if (
      firstCard.getAttribute("data-emoji") ===
      secondCard.getAttribute("data-emoji")
    ) {
      // match
      matchedPairs++;
      firstCard = null;
      secondCard = null;

      // sob pair hoye gele win message
      if (matchedPairs === emojis.length / 2) {
        setTimeout(() => {
          alert(`Great! You finished in ${moves} moves 🎉`);
        }, 200);
      }
    } else {
      // match na hole abar paltao
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

  // restart button: sob kichu notun kore load
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
});
