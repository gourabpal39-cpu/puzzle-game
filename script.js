// IMAGE + SOUND VERSION

window.addEventListener("load", function () {
  const gameContainer = document.getElementById("game");
  const moveSpan = document.getElementById("moveCount");
  const timeSpan = document.getElementById("timeCount");
  const restartBtn = document.getElementById("restartBtn");
  const levelSelect = document.getElementById("levelSelect");

  const LEVELS = {
    easy: { pairs: 2, columns: 2 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 18, columns: 6 },
  };

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

  function playSound(filename) {
    const audio = new Audio(filename);
    audio.play();
  }

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
    seconds = 0;
    timerStarted = false;
    timeSpan.textContent = "0";
  }

  function resetGame() {
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    matchedPairs = 0;
    moves = 0;
    moveSpan.textContent = moves;
    resetTimer();
    renderGameBoard();
  }

  function renderGameBoard() {
    gameContainer.innerHTML = "";
    const { pairs, columns } = LEVELS[currentLevel];
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, 75px)`;

    const selectedImages = IMAGES.slice(0, pairs);
    const cardImages = [...selectedImages, ...selectedImages];
    shuffle(cardImages);

    cardImages.forEach((image) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.image = image;

      const front = document.createElement("img");
      front.classList.add("front-face");
      front.src = "images/" + image;

      const back = document.createElement("div");
      back.classList.add("back-face");
      back.textContent = "❓";

      card.appendChild(front);
      card.appendChild(back);
      gameContainer.appendChild(card);

      card.addEventListener("click", () => flipCard(card));
    });
  }

  function flipCard(card) {
    if (lockBoard || card === firstCard) return;
    startTimer();
    card.classList.add("flip");
    playSound("flip.mp3");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    moveSpan.textContent = moves;

    checkMatch();
  }

  function checkMatch() {
    lockBoard = true;
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
      matchedPairs++;
      playSound("match.mp3");
      resetCards();
      if (isGameOver()) handleWin();
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetCards();
      }, 1000);
    }
  }

  function resetCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function isGameOver() {
    return matchedPairs === LEVELS[currentLevel].pairs;
  }

  function handleWin() {
    clearInterval(timerId);
    playSound("win.mp3");
    alert(`🎉 SRIJA PAL WON! Time: ${seconds}s | Moves: ${moves}`);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  restartBtn.addEventListener("click", resetGame);
  levelSelect.addEventListener("change", (e) => {
    currentLevel = e.target.value;
    resetGame();
  });

  renderGameBoard();
});
