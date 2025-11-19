// IMAGE + LEVEL + TIMER VERSION

window.addEventListener("load", function () {
  const gameContainer = document.getElementById("game");
  const moveSpan = document.getElementById("moveCount");
  const timeSpan = document.getElementById("timeCount");
  const restartBtn = document.getElementById("restartBtn");
  const levelSelect = document.getElementById("levelSelect");

  // LEVELS
  const LEVELS = {
    easy: { pairs: 2, columns: 2 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 18, columns: 6 },
  };

  // USE IMAGE FILES (from /images folder)
  const IMAGES = [
    "apple.png",
    "banana.png",
    "cat.png",
    "dog.png",
    "lion.png",
    "grapes.png",
  ];

  let currentLevel = "medium";
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  let timerId = null;
  let seconds = 0;
  let timerStarted = false;

  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerId = setInterval(() => {
      seconds++;
      timeSpan.textContent = String(seconds);
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timerStarted = false;
    seconds = 0;
    timeSpan.textContent = "0";
  }

  function resetGame() {
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    matchedPairs = 0;
    moveSpan.textContent = moves;
    resetTimer();
    renderGameBoard();
  }

  function renderGameBoard() {
    gameContainer.innerHTML = "";
    const { pairs, columns } = LEVELS[currentLevel];
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, 75px)`;

    let cards = [];
    for (let i = 0; i < pairs; i++) {
      const img = IMAGES[i % IMAGES.length];
      cards.push(img, img);
    }
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((image) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.image = image;

      const front = document.createElement("div");
      front.className = "front";

      const back = document.createElement("div");
      back.className = "back";
      back.style.backgroundImage = `url('images/${image}')`;

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener("click", handleCardClick);
      gameContainer.appendChild(card);
    });
  }

  function handleCardClick() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");
    startTimer();

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    moves++;
    moveSpan.textContent = moves;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    matchedPairs++;
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);
    resetSelection();

    const { pairs } = LEVELS[currentLevel];
    if (matchedPairs === pairs) {
      setTimeout(() => {
        alert(`🎉 Srija Pal WON! Time: ${seconds}s | Moves: ${moves}`);
      }, 500);
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelection();
    }, 1000);
  }

  function resetSelection() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  restartBtn.addEventListener("click", resetGame);
  levelSelect.addEventListener("change", function () {
    currentLevel = this.value;
    resetGame();
  });

  renderGameBoard();
});
