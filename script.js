document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game");
  const moveSpan = document.getElementById("moveCount");
  const timeSpan = document.getElementById("timeCount");
  const restartBtn = document.getElementById("restartBtn");
  const levelSelect = document.getElementById("levelSelect");
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startGameBtn = document.getElementById("startGameBtn");

  // Level config: koto pair & koto column
  const LEVELS = {
    easy: { pairs: 2, columns: 2 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 18, columns: 6 },
  };

  // Cartoon feel er jonne colorful emojis (pore image dile change korte parba)
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

  // 🔊 Sound (jodi flip.mp3 / match.mp3 / win.mp3 upload na thake tao game cholbe)
  let flipSound, matchSound, winSound;
  try {
    flipSound = new Audio("flip.mp3");
    matchSound = new Audio("match.mp3");
    winSound = new Audio("win.mp3");
  } catch (e) {
    // kono problem hole ignore
  }

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

  function shuffleArray(array) {
    return array
      .slice()
      .sort(() => Math.random() - 0.5);
  }

  function setupLevel(levelKey) {
    currentLevel = levelKey;
    const config = LEVELS[levelKey];

    // Reset stats
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    moves = 0;
    moveSpan.textContent = "0";
    resetTimer();

    // Clear old cards
    gameContainer.innerHTML = "";

    // Choose emojis for this level
    const needed = config.pairs;
    const symbols = EMOJIS.slice(0, needed);

    // Pair creation
    const cardsData = shuffleArray([...symbols, ...symbols]);

    // Grid column set
    gameContainer.style.gridTemplateColumns = `repeat(${config.columns}, minmax(50px, 1fr))`;

    // Create cards
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
          alert(`Great! Level: ${currentLevel.toUpperCase()}\nMoves: ${moves}\nTime: ${seconds}s 🎉`);
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

  // Level change
  levelSelect.addEventListener("change", () => {
    setupLevel(levelSelect.value);
  });

  // Restart button – same level abar
  restartBtn.addEventListener("click", () => {
    setupLevel(currentLevel);
  });

  // Splash theke start
  startGameBtn.addEventListener("click", () => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
    setupLevel(currentLevel);
  });
});
  
