// SIMPLE LEVEL + TIMER VERSION

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

  const EMOJIS = [
    "🍎","🍌","🍇","🍒","🍉","🍍","🥝","🍓",
    "🥕","🍆","🌽","🥦","🧀","🍔","🍕","🍩",
    "🍪","🍭"
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

  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerId = setInterval(function () {
      seconds += 1;
      timeSpan.textContent = String(seconds);
    }, 1000);
  }

  function resetTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
    }
    timerId = null;
    timerStarted = false;
    seconds = 0;
    timeSpan.textContent = "0";
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
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
    const cardsData = shuffleArray(symbols.concat(symbols));

    // grid columns
    gameContainer.style.gridTemplateColumns =
      "repeat(" + config.columns + ", minmax(50px, 1fr))";

    // create cards
    cardsData.forEach(function (symbol) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-symbol", symbol);
      card.addEventListener("click", onCardClick);
      gameContainer.appendChild(card);
    });
  }

  function updateMoves() {
    moves += 1;
    moveSpan.textContent = String(moves);
  }

  function onCardClick() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (!timerStarted) {
      startTimer();
    }

    this.textContent = this.getAttribute("data-symbol");
    this.classList.add("flipped");

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
      matchedPairs += 1;
      firstCard = null;
      secondCard = null;

      if (matchedPairs === LEVELS[currentLevel].pairs) {
        if (timerId !== null) clearInterval(timerId);
        setTimeout(function () {
          alert(
            "Great! Level: " +
              currentLevel.toUpperCase() +
              "\nMoves: " +
              moves +
              "\nTime: " +
              seconds +
              "s 🎉"
          );
        }, 200);
      }
    } else {
      lockBoard = true;
      setTimeout(function () {
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
  levelSelect.addEventListener("change", function () {
    setupLevel(levelSelect.value);
  });

  // restart button
  restartBtn.addEventListener("click", function () {
    setupLevel(currentLevel);
  });

  // page load holei medium level theke start
  setupLevel(currentLevel);
});
