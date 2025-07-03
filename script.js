let gameMode = "";
let currentPlayer = "X";
let humanPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let difficulty = "medium";
let botPlayer = "";

const easyTrolls = [
  "Imagine playing in easy mode with a literal BOT... HAHAHA certified NOOB 😂",
  "HAHAHA certified NOOB 😂",
  "Easy mode? Bro even my grandma could beat this 💀",
  "You're basically farming ego boosts here 😆",
  "Did your brain just go on vacation?",
  "You vs a sleeping AI... who wins? 😴",
  "Legends say chickens fear this mode more than players 🐔",
  "Easy? You mean tutorial mode? 🍼",
  "Even the bot yawns in this mode 🥱",
  "Taking candy from a bot-baby huh?",
  "Pressing buttons doesn’t make you a pro 😂",
  "Go ahead champ, AI is literally drunk in this mode 🍺",
  "Not even trying huh? Respect 🤝 for honesty",
  "You're the reason easy mode exists 😭"
];

const hardTrolls = [
  "Hard mode? Let's see how fast you rage quit 😈",
  "You chose hard mode... your funeral 💀",
  "The bot is now sentient. Good luck, peasant.",
  "Better hope the AI is feeling generous today.",
  "Prepare to cry in a corner after 3 moves 🧠",
  "You just signed up for digital humiliation.",
  "Your downfall is about to be algorithmic.",
  "We'll notify NASA when the bot finishes you 🚀",
  "Hard mode: Where dreams go to die ☠️",
  "No mercy. No regrets. Only pain.",
  "Now loading your defeat in 3... 2... 1...",
  "Enjoy the suffering. You've earned it 🔥",
  "Good luck winning with this bot 😂",
  "This bot is UNDEFEATABLE 🔥🔥"
];

function showGlitchAndToast(message, callback) {
  const glitch = document.getElementById("glitchOverlay");
  const toast = document.getElementById("toast");

  // Start glitch effect
  glitch.classList.add("glitch-active");
    glitchSound.currentTime = 0;  // Rewind to start
  glitchSound.play();

  setTimeout(() => {
    // Show toast
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      glitch.classList.remove("glitch-active");
      if (callback) callback(); // Go to next screen
    }, 3300); // How long toast is visible

  }, 500); // Delay before toast after glitch
}
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); 
}

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function selectMode(mode) {
  gameMode = mode;
  if (mode === "bot") {
    showScreen("difficultyScreen");
  } else {
    showScreen("pvpFirstScreen");
  }
}

function selectDifficulty(level) {
  difficulty = level;

  let roast = "";
  if (level === "easy") {
    roast = getRandom(easyTrolls);
  } else if (level === "hard") {
    roast = getRandom(hardTrolls);
  }

  showGlitchAndToast(roast, () => {
    showScreen("botPlayerScreen");
  });
}

function disableCells() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.style.pointerEvents = 'none';
    cell.style.opacity = '0.6'; // Optional: visual feedback
  });
}

function enableCells() {
  document.querySelectorAll('.cell').forEach(cell => {
    if (!cell.classList.contains('filled')) { 
      cell.style.pointerEvents = 'auto';
      cell.style.opacity = '1'; // This only applies to empty cells
    } else {
      // ADDED: Reset opacity for filled cells too, but keep them disabled
      cell.style.opacity = '1'; 
      cell.style.pointerEvents = 'none'; // Keep filled cells non-clickable
    }
  });
}
function selectBotPlayer(player) {
  humanPlayer = player;
  currentPlayer = "X";
  showScreen("gameScreen");
  updateTurnDisplay();
  if (humanPlayer === "O"){
    disableCells();
    setTimeout(() => {
        makeBotMove();
        enableCells();
    }, 1000);
  };
}

function selectPvpFirst(player) {
  currentPlayer = player;
  showScreen("gameScreen");
  updateTurnDisplay();
}

function makeMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  updateCell(index, currentPlayer);

  if (checkWinner()) {
    endGame(`${currentPlayer} Wins! 🎉`);
    return;
  }

  if (board.every(cell => cell !== "")) {
    endGame("It's a Draw! 🤝");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();

  if (gameMode === "bot" && currentPlayer !== humanPlayer && gameActive) {
    disableCells();
    setTimeout(() => {
        makeBotMove();
        enableCells();
    }, 1000);
  }
}

function makeBotMove() {
  if (!gameActive) return;

  botPlayer = humanPlayer === "X" ? "O" : "X";
  let bestMove;

  if (difficulty === "easy") {
    const available = board.map((c, i) => (c === "" ? i : null)).filter(i => i !== null);
    bestMove = available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === "medium") {
    bestMove = getBestMove(botPlayer);
  } else if (difficulty === "hard") {
    bestMove = minimax(board, botPlayer).index;
  }

  if (bestMove !== -1 && bestMove !== undefined) {
    makeMove(bestMove);
  }
}

function getBestMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = player;
      if (checkWinnerForPlayer(player)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  const opponent = player === "X" ? "O" : "X";
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = opponent;
      if (checkWinnerForPlayer(opponent)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  if (board[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter(i => board[i] === "");
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const available = board.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);
  return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : -1;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((c, i) => (c === "" ? i : null)).filter(i => i !== null);

  if (checkWinnerOnBoard(newBoard, humanPlayer)) return { score: -1 };
  if (checkWinnerOnBoard(newBoard, botPlayer)) return { score: 1 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];

    newBoard[availSpots[i]] = player;

    if (player === botPlayer) {
      const result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, botPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === botPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinnerOnBoard(tempBoard, player) {
  return winPatterns.some(pattern => pattern.every(i => tempBoard[i] === player));
}

function checkWinner() {
  const winner = checkWinnerForPlayer("X") || checkWinnerForPlayer("O");
  if (winner) {
    highlightWinningCells(winner);
    return winner;
  }
  return null;
}

function checkWinnerForPlayer(player) {
  for (let pattern of winPatterns) {
    if (pattern.every(i => board[i] === player)) {
      return { player, pattern };
    }
  }
  return null;
}

function highlightWinningCells(winner) {
  winner.pattern.forEach(i => {
    document.querySelector(`[data-index="${i}"]`).classList.add("winner");
  });
}

function updateCell(index, player) {
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add("filled", player);
}

function updateTurnDisplay() {
  const turnDisplay = document.getElementById("turnDisplay");
  turnDisplay.textContent =
    gameMode === "bot"
      ? currentPlayer === humanPlayer
        ? `Your Turn (${currentPlayer})`
        : `Bot's Turn (${currentPlayer})`
      : `${currentPlayer}'s Turn`;
}

function endGame(message) {
  gameActive = false;
  document.getElementById("gameResult").innerHTML =
    `<div class="result-message ${message.includes("Draw") ? "draw" : "win"}">${message}</div>`;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";

  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
    cell.style.pointerEvents='auto';
    cell.style.opacity='1';
  });

  document.getElementById("gameResult").innerHTML = "";
  updateTurnDisplay();

  if (gameMode === "bot" && humanPlayer === "O") {
    disableCells();
    setTimeout(() => {
        makeBotMove();
        enableCells();
    }, 1000);
  }
}

function goHome() {
  resetGame();
  showScreen("modeScreen");
}

document.addEventListener("DOMContentLoaded", () => showScreen("modeScreen"));
