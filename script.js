// SIMPLE & SAFE VERSION

window.addEventListener("load", function () {
  const gameContainer = document.getElementById("game");
  const moveSpan = document.getElementById("moveCount");
  const timeSpan = document.getElementById("timeCount");
  const restartBtn = document.getElementById("restartBtn");
  const levelSelect = document.getElementById("levelSelect");
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startGameBtn = document.getElementById("startGameBtn");

  // level config: koyta pair & koyta column
  const LEVELS = {
    easy: { pairs: 2, columns: 2 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 18, columns: 6 }
  };

  // colourful emoji
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
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function setupLevel(levelKey) {
    currentLevel = levelKey;
    var config = LEVELS[levelKey];

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
    var needed = config.pairs;
    var symbols = EMOJIS.slice(0, needed);
    var cardsData = shuffleArray(symbols.concat(symbols));

    // grid columns
    gameContainer.style.gridTemplateColumns =
      "repeat(" + config.columns + ", minmax(50px, 1fr))";

    // create cards
    cardsData.forEach(function (symbol) {
      var card = document.createElement("div");
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

    var symbol1 = firstCard.getAttribute("data-symbol");
    var symbol2 = secondCard.getAttribute("data-symbol");

    if (symbol1 === symbol2) {
      matchedPairs += 1;
      firstCard = null;
      secondCard = null;

      if (matchedPairs === LEVELS[currentLevel].pairs) {
        if (timerId !== null) {
          clearInterval(timerId);
        }
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

  // splash theke start
  startGameBtn.addEventListener("click", function () {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
    setupLevel(currentLevel);
  });
});
