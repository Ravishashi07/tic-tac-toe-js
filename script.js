/*
╔═══════════════════════════════════════════════════════════╗
║ 🎮 TIC TAC TOE - ULTIMATE VERSION ║
║ 🤖 Built with Bots, Trolls, Glitches & Vibes ║
║ 🔥 Modes: PvP | Bot (Easy, Medium, MINIMAX Monster) ║
║ 🧠 Intelligence Level: Bot so smart it dreams in 1s & 0s ║
║ 💀 Warning: If you're playing on hard... Good luck 😂 ║
╚═══════════════════════════════════════════════════════════╝

Author: Not a bot... probably. 🤖
Built in: Pure JavaScript with spice
Purpose: Make humans cry after losing to AI
Tip: Don’t reset too often. It exposes your weakness.
*/

let gameMode = "";                    //Either it will be 'bot' or 'pvp'.Currently set to empty until user selects a mode.
let currentPlayer = "X";              //This tracks whose turn it is.Set default to X(will change later).
let humanPlayer = "X";                //It stores humanPlayer's symbol.Human player is set to X by default(will change later).
let board = ["", "", "", "", "", "", "", "", ""];         //This corresponds to 9 grids of the game board.(Empty=unassigned)
let gameActive = true;              //It monitors whether game is active or not i.e. if the round is still in progress or not(true means game is ongoing/players can move while false means game has ended in either win or draw).
let difficulty = "medium";          //This controls the difficulty level i.e easy, medium, hard(set to medium by default).
let botPlayer = "";                 //It stores Bot's symbol.Bot player is opposite of human player(set to empty by default).
let botHasMoved = false;            //This monitors whether bot has made his move(Prevents bot from moving multiple times).
let gameInitialized = false;        //This monitors if game is initialized i.e. the gameScreen is loaded and players are set to make their moves.This prevents premature moves before screen loading.
let botTimeout = null;              //This is a number value.Time out between bot moves to prevent multiple bot moves.Used to control/delay Bot's moves.
let moveCooldown = false;           //This monitors the cooldown time after every move.Prevents multiple clicks by setting a delay.

const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

const clickSound = document.getElementById("clickSound");       //Grabs the HTML audio element with id="clickSound".
const glitchSound = document.getElementById("glitchSound");     //Grabs the HTML audio element with id="glitchSound".
const goHomeSound = document.getElementById("goHomeSound");     //Grabs the HTML audio element with id="goHomeSound".
const goHomeBtn = document.getElementById("goHomeBtn");         //Grabs the HTML element with id="goHomeBtn".

const winPatterns = [         //All possible winning patterns(horizontal, vertical, diagonal)
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const easyTrolls = [
  "Imagine playing in easy mode with a literal BOT... HAHAHA certified NOOB 😂",
  "HAHAHA certified NOOB 😂",
  "Imagine picking EASY... scared much? 🐥",
   "Certified NOOB detected ✅",
  "Easy mode? Bro even my grandma could beat this 💀",
  "You vs a sleeping AI... who wins? 😴",
  "Easy? You mean tutorial mode? 🍼",
  "You're the reason easy mode exists 😭",
];

const hardTrolls = [
  "Hard mode? Let's see how fast you rage quit 😈",
  "You picked hard? Ok... time to cook you 🍳",
  "Prepare to cry in a corner after 3 moves 🧠",
  "You just signed up for digital humiliation.",
  "Your downfall is about to be algorithmic.",
  "We'll notify NASA when the bot finishes you 🚀",
  "No mercy. No regrets. Only pain.",
  "Hard mode? More like regret mode 💢",
  "You’ve unlocked the final boss... and it hates mercy 👹",
  "Now loading your defeat in 3... 2... 1...",
  "Enjoy the suffering. You've earned it 🔥",
  "Good luck winning with this bot 😂",
  "This bot is UNDEFEATABLE 🔥🔥",
];

document.addEventListener("DOMContentLoaded", () => {                 //Triggers when DOM content is loaded.
  showScreen("modeScreen");                                           //This loads the modeScreen i.e. the first screen.
});

document.querySelectorAll("button, .cell").forEach((el) => {          // Adds a click sound effect whenever a button or cell is clicked.
  el.addEventListener("click", () => {                                //Listens for click on any button or cell.
    if (clickSound) {
      clickSound.currentTime = 0;  
      clickSound.volume=0.5;                                   //Restarts the sound everytime a button/cell is clicked.
      clickSound.play();                                              //Play the sound.
    }
  });
});
document.querySelectorAll("button, .cell").forEach((el) => {          // Adds a lighter version of click sound effect whenever a button or cell is clicked.
  el.addEventListener("mouseenter", () => {                           //Listens for mouseenter on any button or cell.
  const softClick = clickSound.cloneNode();                           //Clone the original audio, decrease the volume to 10% and replay everytime.
  softClick.volume = 0.1;
  softClick.currentTime=0;
  softClick.play();
  });
});


function showLoadingThenGame(nextScreenId, callback) {                //Used to display a loading screen before going to gameScreen.nextScreenId is the id of the next screen to be displayed.Callback is passed to do extra functionality after moving to nextScreen.
  const loadingSound = document.getElementById("loadingSound");       //Get the loading sound.
  showScreen("loadingScreen");                                        //Show the loading screen.
  if (loadingSound) {
    loadingSound.currentTime = 0;
    loadingSound.volume=0.25;                                     //Replay the loading sound everytime this function is invoked.
    loadingSound.play();                                              //Play the sound.
  }

  setTimeout(() => {                                                  //This does the below tasks after delay of 5s.
    showScreen(nextScreenId);                                         //Show nextScreen via its id.
    gameInitialized = true;                                           //Set gameInitialized to true.Because now gameScreen is loaded and everything is set to play.
    updateTurnDisplay();                                              //Update the turn display i.e. who plays now.(X or O)
    if (typeof callback === "function") callback();                   //If any callback is passed, execute that function.
  }, 5000);
}

function showGlitchAndToast(message, callback) {                      //Used to show glitching effect and a simple Toast with some message.
  const glitch = document.getElementById("glitchOverlay");            //Get the element with id="glitchOverlay".Used to show glitching effect.
  const toast = document.getElementById("toast");                     //Get the element with id="toast".Used to show toast.

  if (glitch) glitch.classList.add("glitch-active");                  //If glitch is fetched, add a "glitch-active" class via classList.
  if (glitchSound) {                                                  //If glitchSound is fetched,
    glitchSound.currentTime = 0;     
    glitchSound.volume=0.3;                                 //Replay the glitch sound everytime.
    glitchSound.play();                                               //Play the glitch sound.
  }

  setTimeout(() => {                                                  //Executes the below if loop after delay of 500ms i.e. toast is shown after delay of 500ms after showing the glitch.
    if (toast) {                                                      // If toast is fetched
      toast.textContent = message;                                    //Set the text content of toast to the message(message here is given via arguments).
      toast.classList.add("show");                                    //Add a class of "show" to the toast via classList.
    }
    setTimeout(() => {                                                
      if (toast) toast.classList.remove("show");                      //Removes the class of "show". 
      if (glitch) glitch.classList.remove("glitch-active");           //Removes the class of "glitch-active".
      if (callback) callback();                                       //If callback is passed, it is executed.
    }, 3300);                                                         //The overall glitch stays visible for 3300ms
  }, 500);                                                            //The toast shows up after 500ms after glitch.
}

function getRandom(arr) {                                             //This is used to get a random array element of the passed array.Used to get a random troll.
  return arr[Math.floor(Math.random() * arr.length)];                 //returns a random element of the array.Ex:arr=[1,2,3,4,5], this line might return arr[2] which is 3.
}

function showScreen(screenId) {                                       //This is the main function which hides all the screens and shows only ONE screen at a time.
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));    //THis line selects all elements with class="screen", then iterates over every element, and removes the active class.Basically it is removing active class from all elements.
  const targetScreen = document.getElementById(screenId);             //This variable selects the screen which should only be displayed.The id of the screen to be displayed is passed via argument.
  if (targetScreen) targetScreen.classList.add("active");             //This line selects the target screen and adds a class of "active" to it hence making only that particular screen visible.

  if (screenId !== "gameScreen") {                                    //If the current screen id is not gameScreen
    gameInitialized = false;                                          //gameInitialized is set to false because game will be initialized only in game screen.
  }
}

function selectMode(mode) {                                           //This function isn’t called anywhere in this JS file directly, but it’s triggered via the onclick attribute in the HTML file when the user selects a mode.
  gameMode = mode;                                                    //Sets the value of mode into the global variable gameMode.
  botHasMoved = false;                                                //Ensure that bot has not moved yet
  resetGame();                                                        //resets the entire game and board state.
  if (mode === "bot") showScreen("difficultyScreen");                 //If user selects 'bot' mode show difficultyScreen(easy, medium, hard).
  else showScreen("pvpFirstScreen");                                  //Else show the pvpFirstScreen(The screen where user selects who moves forst X or O).
}

function selectDifficulty(level) {                                    //This function also isn't called anywhere in this JS file directly, but it's triggered via the onclick attribute in the HTML file when the user selects the difficulty level. 
  difficulty = level;                                                 //Store the level passed by the onclick attrinute in the global variable 'difficulty'.
  let roast;                                                          //Declare a empty variable.
  if(level==='easy'){                                                 //If user selects easy mode, get a random troll from easyTroll array (The user is definitely somebody who fears to lose).
    roast=getRandom(easyTrolls);
  }
  else if(level==='medium'){                                          //If user selects medium mode, show this roast(not a roast tho).
    roast="A Balanced one!Only one way to trap this bot";             
  }
  else{                                                               //Else get a random troll from hardTrolls array (I know user will get cooked my minimax).
    roast=getRandom(hardTrolls);
  }
  showGlitchAndToast(roast, () => showScreen("botPlayerScreen"));     //Show the glitchy screen + a random troll based on user select.After executing the glitch screen redirect to botPlayerScreen where user chooses if they want X or O.
}

function disableCells() {                                             //This function is used to disable all the cells.(prevent interaction)
  document.querySelectorAll(".cell").forEach((cell) => {              //Select all the elements with class of "cell" and iterate through each element using forEach method.
    cell.style.pointerEvents = "none";                                //Make the pointer events of the cells to none.Used to prevent any user clicks.
    cell.style.opacity = "0.6";                                       //This is just a visual feedback which shows that the cell is disabled(by lowering the opacity).
  });
}

function enableCells() {                                              //This function is used to enable all the unfilled cells.
  if (!gameInitialized || !gameActive) return;                        //This function only executes if game is initialized and game is active.If either is false, it returns nothing.
  document.querySelectorAll(".cell").forEach((cell) => {              //Select all elements with class of 'cell' and iterate over every element using forEach method.
    if (!cell.classList.contains("filled")) {                         //If cell is not filled i.e. empty then enable the pointer events and set opacity to 1.
      cell.style.pointerEvents = "auto";
      cell.style.opacity = "1";
    } else {
      cell.style.pointerEvents = "none";                              //If cell is filled, then set pointer events to none and keep opacity to 1.
      cell.style.opacity = "1";
    }
  });
}

function selectBotPlayer(player) {                                   //This function is triggered when user selects their symbol i.e. either X or O.This function is triggered in HTML file and is not directly used in this JS file.
  if (botHasMoved) return;                                           //If the bot has moved, it returns nothing i.e. prevents bot from being selected multiple times.
  botHasMoved = true;                                                //If the bot has not moved then set it to true.
  humanPlayer = player;                                              //Set the argument obtained into a global variable called 'humanPlayer'.
  currentPlayer = "X";                                               //Set current player to X because the game always starts with X.
  botPlayer = humanPlayer === "X" ? "O" : "X";                       //This line assigns bot its symbol.If human chooses X bot will get O and vice-versa.
  gameMode = "bot";                                                  //Set the game mode to 'bot'

  showLoadingThenGame("gameScreen", () => updateTurnDisplay());      //Show the animated loading screen and then move to gameScreen after loading screen has completed.Here updateTurnDisplay() is passed as the callback which means the dispplay will be updated as soon as the gameScreen is loaded.

  setTimeout(() => {                                                 //Waits 5500ms to align with the loading screen + buffer.
    if (botPlayer === "X") {                                         //If the bot player is assigned the symbol X,
      disableCells();                                                //Then disable all the cells.This is to prevent human clicking while the bot plays.
      botTimeout = setTimeout(() => {                                //Adds another 1 second delay before the bot makes its actual move.
        if (gameActive && gameInitialized) {                         //Condition check:If the game is active and game is initialized,
          makeBotMove();                                             //Make the bot move(function declared later).
          if (gameActive) {                                          //After making bot's move, check if the game is still active
            enableCells();                                           //If it is active then enable all the cells for the user action.
          }
        }
      }, 1000);
    } else {                                                         //If bot player is not X i.e. human player is X which means its the humans time to make a move.Enable the cells immediately.
      enableCells();
    }
  }, 5500);
}

function selectPvpFirst(player) {                                   //THis function gets triggered when two players play against each other.(This function is also not used directly inside JS but triggered via onclick attribute in HTML).
  resetGame();                                                      //Reset the game(board, symbols, variables etc...).
  currentPlayer = player;                                           //Set the value of player into global variable currentPlayer.
  gameMode = "pvp";                                                 //Set the game mode to 'pvp'.
  showLoadingThenGame("gameScreen", () => {                         //Invoke the showLoadingThenGame function.Whenever a user selects who goes first(X or O), the loading screen is showed and then it is redirected to gameScreen.
    updateTurnDisplay();                                            //THis is the callback passed to it.It updates turn display i.e. whose turn it is to play.
    enableCells();                                                  //It also enables the cells because the player has to make a move.
  });
}

function makeMove(index) {                                          //This is the heart of this program.This function is triggered from the HTML file.(If you're reading this, I can tell that you are single).
  if (moveCooldown || !gameActive || board[index] !== "" || !gameInitialized) //moveCooldown->prevents multiple fast clicks within 200ms. !gameActive->If the game is over(either win or draw), reject any further moves.  board[index]!==''->ignore already filled cells.  !gameInitialized->If the game has not started yet, ignore the clicks.
    return;                                                         

  moveCooldown = true;                                              //Set moveCooldown to true
  setTimeout(() => (moveCooldown = false), 200);                    //Activates a 200ms cooldown to prevent rapid double-clicks.

  board[index] = currentPlayer;                                     //The argument recieved is stored in the board's internal array.The symbol(X or O) is stored in the board array of corresponding index(This does not change anything visually).
  updateCell(index, currentPlayer);                                 //Visually change the board using updateCell function(function defined later).

  if (gameMode === "bot") disableCells();                           //If game mode is 'bot' disable the cells until the bot moves(to prevent interaction during bot's turn).

  if (checkWinner()) {                                              //After every single move, check if the currentPlayer just won.
    endGame(`${currentPlayer} Wins! 🎉`);
    return;
  }

  if (board.every((cell) => cell !== "")) {                         //If all the cells are filled and there is no winnner, it's a draw.
    endGame("It's a Draw! 🤝");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";                //This swaps turns after each move.
  updateTurnDisplay();                                              //Update the turn display each time telling whose time it is to play.

  if (gameMode === "bot" && currentPlayer === botPlayer && gameActive) {  //if gameMode is 'bot' and current player is also 'bot' and game is active, disable all cells to let the bot make its move.
    disableCells();
    clearTimeout(botTimeout);                                       //Clear any existing timeout.
    botTimeout = setTimeout(() => {                                 //Set a new Timeout of 1s to botTimeOut variable.
      if (gameActive && gameInitialized) {                          //If game is active and initialized, makeBotMove is triggered which makes the bot's move.
        makeBotMove();
        if (gameActive) enableCells();                              //Re-enable the cells when bot completes its move.
      } 
    }, 1000);
  } else if (gameMode === "pvp") {                                  //Ensure cells are enabled in PvP mode
    enableCells();
  }
}

function makeBotMove() {                                            //This is the core functionality behind the bot's moves.
  if (!gameActive || !gameInitialized) return;                      //If either game is not active or game is not initialized, exit early.

  let bestMove = -1;                                                //bestMove is set to -1(which is invalid).It will be replaced by a real move depending on difficulty.
  if (difficulty === "easy") {                                      //If user selects easy mode,
    const available = board.map((c, i) => (c === "" ? i : null)).filter((i) => i !== null); // Filter the empty cells on the board and store it in 'available' array.
    if (available.length > 0) {                                     //Check if the length of 'available' array is greater than zero.
      bestMove = available[Math.floor(Math.random() * available.length)]; //Randomly place move in any cell(this is literally a dumb bot).
    }
  } else if (difficulty === "medium") {                             //If user selects medium difficulty,
    bestMove = getBestMove(botPlayer);                              //Invoke getBestMove function.
  } else if (difficulty === "hard") {                               //If difficulty is hard,
    const result = minimax(board, botPlayer);                       //Invoke the ultimate BOSS, the MINIMAX.
    bestMove = result ? result.index : -1;                          //safety check! prevents unexpected behaviour of minimax(rare).
  }

  if (bestMove >= 0 && bestMove < 9 && board[bestMove] === "" && gameActive) {  //Checks that:The move is between 0–8.That cell is still empty.The game is still active.
    makeMove(bestMove);                                             //If valid, then proceed making move by calling the makeMove function.This will also trigger winner checks and swap turns, as defined in makeMove.
  } else {                                                          //Fallback if no valid move is found - find the first available cell and make the move(rare).
    const available = board.map((c, i) => (c === "" ? i : null)).filter((i) => i !== null); 
    if (available.length > 0) {
      makeMove(available[0]);
    }
  }
}

function getBestMove(player) {                                      //If the user chooses medium mode, this gets invoked.
//Try to win:
  for (let i = 0; i < 9; i++) {                                     //Iterates over all the cells.
    if (board[i] === "") {                                          //It checks all empty cells.
      board[i] = player;                                            //Temporarily places the bot's symbol in it.
      if (checkWinnerForPlayer(player)) {                           //Checks if the move would win.
        board[i] = "";                                              //Undo the move(board restoration).
        return i;                                                   //If yes then return that move(index).
      }
      board[i] = "";                                                //Undo the move before checking for next index
    }
  }

  // Block opponent's win
  const opponent = player === "X" ? "O" : "X";                      //The opponent will be opposite of player.
  for (let i = 0; i < 9; i++) {                                     //Iterate through all the cells.
    if (board[i] === "") {                                          //Check for empty cells.
      board[i] = opponent;                                          //Temporarily place the opponents move in the board.
      if (checkWinnerForPlayer(opponent)) {                         //Check if opponent will win by that move.  
        board[i] = "";                                              //If yes, undo the move placed and return the index of the move.
        return i;
      }
      board[i] = "";                                                //If the if condition returns false, undo the board anyway.
    }
  }

  //Take center if available
  if (board[4] === "") return 4;                                    //Even the bot knows center is the best move when u cant win/lose inn the next move.

  // Take corners                                                   //If center is not available, take a random corner.
  const corners = [0, 2, 6, 8].filter((i) => board[i] === "");      //Filter the corners which are unfilled.
  if (corners.length > 0)                                           //If any corner is unfilled,
    return corners[Math.floor(Math.random() * corners.length)];     //Place the move in a any random corner.

  //Take any available spot
  const available = board.map((c, i) => (c === "" ? i : null)).filter((i) => i !== null);  //If nothing of the above found, place anywhere on the board.
  return available.length > 0? available[Math.floor(Math.random() * available.length)]: -1;   //Return the random index.
  //So getBestMove works in this order : Try to win -> Block opponent's win -> Take center if available -> Take a random corner -> Take any random spot
  //This bot has some thinking ability, it thinks one step ahead before making a move
}


//Here comes the destroyer, THE MINIMAX. You can try as hard as you can but you can never DEFEAT this bot(unless there's some bug in the code).
//Of course you can come to a draw, but can never win against this thing.
//Minimax is a recursive algorithm that stimulates ALL POSSIBLE MOVES/GAME STATES to determine the best possible move.
//The medium-level bot thinks one move ahead but this thing stimulates the entire gameplay(gametree) and then decides which is the best move.(Amazing isn't it?).
function minimax(tempBoard, player) {                               
  const availSpots = tempBoard.map((c, i) => (c === "" ? i : null)).filter((i) => i !== null); //Extract all possible empty cells in the current tempBoard.

  if (checkWinnerOnBoard(tempBoard, humanPlayer)) return { score: -1 };   //Check the winner.If it is human, it is bad for the bot, return score :-1
  if (checkWinnerOnBoard(tempBoard, botPlayer)) return { score: 1 };       //Check the winner.If it is bot, it is good for the bot, return score :+1
  if (availSpots.length === 0) return { score: 0 };                        //If there are no moves, it's a draw.These 3 if statements are the base case of the recursion algorithm.

  const moves = [];                                                 //Create empty array which stores all possible moves.
  for (let i = 0; i < availSpots.length; i++) {                     //Loop through every possible move.
    const move = {};                                                //Temporarily store the move in this object.
    move.index = availSpots[i];                                     //Temporarily store the index(internally).
    tempBoard[availSpots[i]] = player;                              //Simulate the move(internally).

    const result =player === botPlayer? minimax(tempBoard, humanPlayer): minimax(tempBoard, botPlayer);  //Recursive call(simulates opponents turn also).// If it's bot's turn now, next call is for human. If it's human's turn, next call is for bot.


    move.score = result.score;                                      //Store the returned score in the score object.
    tempBoard[availSpots[i]] = "";                                  //Undo the simulated move to keep board clean for next simulation.
    moves.push(move);                                               //save the move object{index:score} into the moves array.
  }

  let bestMove;                                                     //This will store index of the move with the best score.

  if (player === botPlayer) {                                       //If it is the bot's turn,  
    let bestScore = -Infinity;                                      //Bot wants to make the highest score possible, so we start from -Infinity
    moves.forEach((move, i) => {                                    //Find the move with the best score.
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;                                               //Store that move index in bestMove.
      }
    });
  } else {
    let bestScore = Infinity;                                       //If it is human's turn, bot wants human to make least score, so we start out at +Infinity.
    moves.forEach((move, i) => {                                    //Find the move which leads to lowest score of human.
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = i;                                               //Store that move index in bestMove.
      }
    });
  }

  return moves[bestMove] || { index: availSpots[0] || 0, score: 0 }; //Return the bestMove.If something goes wrong(rare), as a fallback return the first available spot.
}


function checkWinnerOnBoard(tempBoard, player) {                    //THis is a helper function for minimax.
  return winPatterns.some((pattern) =>                              //Checks whether a specific player has won on a simulated tempBoard.
    pattern.every((i) => tempBoard[i] === player)                   //Used only inside minimax, doesn't affect the real game board.
  );
}


function checkWinner() {                                            //This function checks if the player won.                
  const winnerX = checkWinnerForPlayer("X");                        //Yeah another function call.I know there are overwhelming number of function calls.Anyways, this line checks if X has won.If yes, store the winner and winning index in winnerX.
  const winnerO = checkWinnerForPlayer("O");                        //If O has won, store the winner and its winning index in winnerO.
  const winner = winnerX || winnerO;                                //If either X or O has won, store them in 'winner' variable
  if (winner) {
    highlightWinningCells(winner);                                  //Oh yes another function call.This highlights the cells via which the player has won.
    return winner;                                                  //return the winner(X or O).
  }
  return null;                                                      //If there is no winner, return null.
}

function checkWinnerForPlayer(player) {                             //This id the main brain behind checking winners.
  for (let pattern of winPatterns) {                                //winPatterns is an array containing all of the winning patterns(defined at the global scope at the top). So here we iterate through every single pattern.
    if (pattern.every((i) => board[i] === player)) {                //This checks:“Do all 3 cells in this pattern belong to the same player?”.
      return { player, pattern };                                   //If yes, return an object containing player and pattern. Ex:{ player: "X", pattern: [0, 1, 2] }.
    }
  }
  return null;                                                      //If none of the patterns match, return null.
}

function highlightWinningCells(winner) {                            //This is just used to give visual feedback that the player has won.
  winner.pattern.forEach((i) => {                                   //'winner' is a object provided by the checkWinner function.Here we loop through every element in the 'winner' object.
    const cell = document.querySelector(`[data-index="${i}"]`);     //Then selects the cell on the board with that index using a custom data-index attribute.
    if (cell) cell.classList.add("winner");                         //Then add a css class called 'winner'.
  });
}

function updateCell(index, player) {                                //This function visually updates a specific cell on the board when a move is made.Here index means any index from 0-8. Player means 'X' or 'O'.
  const cell = document.querySelector(`[data-index="${index}"]`);   //First, it fetches the cell from the DOM.
  if (cell) {
    cell.textContent = player;                                      //Then, it updates the visible text in the cell to either "X" or "O".
    cell.classList.add("filled", player);                           //Then add a class of 'filled' for that player.
  }
}

function updateTurnDisplay() {                                      //This is used to update the turn display i.e This function updates the status display that tells the player whose turn it is.
  const turnDisplay = document.getElementById("turnDisplay");       //First, it selects the DOM element that shows the current turn.

  //If the game mode is bot, and its humans turn, show 'Your Turn(X)' or 'Your Turn(O)'. If its bors turn show 'Bot's Turn(X)' or 'Bot's Turn(X)'
  //If game mode is not bot, just dispplay whose turn it is i.e. either "X's Turn" or "O's Turn".
  if (turnDisplay) {  
    turnDisplay.textContent =gameMode === "bot"? currentPlayer === humanPlayer? `Your Turn (${currentPlayer})`: `Bot's Turn (${currentPlayer})`: `${currentPlayer}'s Turn`;  //
  }
}


function endGame(message) {                                         //This function is called either when someone wins or game ends in a draw.Ex:"X Wins!", "O Wins!", "It's a Draw!"
  gameActive = false;                                               //Stop the game immediately. gameActive = false -> The game officially ends. No more moves allowed.
  clearTimeout(botTimeout);                                         //clearTimeout(botTimeout) -> If the bot was about to make a move (scheduled with setTimeout()), cancel it.
  disableCells();                                                   //disableCells() -> Prevent user from clicking cells again. This is visual and logical.

  let finalMessage = message;                                       //finalMessage is what will be shown on the result screen.
  const gameResult = document.getElementById("gameResult");         //gameResult is the HTML element that displays the win/draw message.

  if (gameMode === "bot") {                                         //If game mode is bot,
    if (message.includes("Draw")) {                                 //If you end up with draw against a bot, show "It's a Draw! 🤝" and play drawSound.
      finalMessage = "It's a Draw! 🤝";
      const drawSound = document.getElementById("drawSound");
      if (drawSound) drawSound.play();

    } else if (message.includes(humanPlayer)) {                     //If human wins against a bot show "You Win! 🎉" and play win audio.
      finalMessage = "You Win! 🎉";
      winSound.currentTime=0;
      winSound.volume=0.05;
      winSound.play();

    } else {                                                        //If bot wins against the human, show  "You Lose! 😭" and play lose audio.
      finalMessage = "You Lose! 😭";
      loseSound.currentTime=0;
      loseSound.play();    }
  } else {                                                          //This else case is for the case whenit is 'pvp' mode.
    if (message.includes("Draw")) {                                 //If ends up in a draw, play the drawSound. Same as bot mode.
      finalMessage = "It's a Draw! 🤝";
      const drawSound = document.getElementById("drawSound");
      if (drawSound) drawSound.play();
    } else {
      winSound.currentTime=0;
      winSound.play();                                  //Else play win audio(Because i dont want to humiliate the player who lost).
    }
  }

  if (gameResult) {                                                 //Dynamically inserts HTML inside the #gameResult box.
    gameResult.innerHTML = `<div class="result-message ${finalMessage.includes("Draw") ? "draw" : "win"}">${finalMessage}</div>  
    `;                                                              //"draw" if it's a draw. "win" otherwise (could be a win or loss, just a styling class)
  }
}

function resetGame() {                                              //This resets the entire game so you can start fresh without refreshing the page.
  clearTimeout(botTimeout);                                         //If the bot was about to move, cancel that pending setTimeout.
  botTimeout = null;                                                //Set botTimeout to null to fully clear the reference.
  board = ["", "", "", "", "", "", "", "", ""];                     //Clear the board entirely.
  gameActive = true;                                                //Game can now be played.
  currentPlayer = "X";                                              //X starts first.
  gameInitialized = true;                                           // Set to true.
  botHasMoved = false;                                              // Needed for proper bot player selection
  moveCooldown = false;                                             //// Remove anti-double-click cooldown

  document.querySelectorAll(".cell").forEach((cell) => {            //For every cell on the grid:
    cell.textContent = "";                                          //Remove the 'X' or 'O' mark.
    cell.className = "cell";                                        //Reset all class names to just "cell" (removes winner, filled, etc.)
    cell.style.pointerEvents = "auto";                              //Enable clicking again
    cell.style.opacity = "1";                                       //Reset opacity to default
  });

  const gameResult = document.getElementById("gameResult");         //Remove any existing win/draw message from the UI.
  if (gameResult) gameResult.innerHTML = "";
  updateTurnDisplay();                                              //Refresh the top display with current turn (e.g. "Your Turn (X)")
    if (gameMode === "bot" && currentPlayer === botPlayer) {        //If game mode is 'bot' and current player is also bot,
    disableCells();                                                 //disable all cells to prevent user action,
    botTimeout = setTimeout(() => {                                 //set 1s timeout before bot makes it's move.
      if (gameActive && gameInitialized) {
        makeBotMove();
        if (gameActive) enableCells();                              //Allow the user to click after bot made it's move.
      }
    }, 1000);
  } else {
    enableCells(); // allow user clicks in PvP or if human starts
  }
}
  


function goHome() {                                                 //Go Back to Main Menu
  clearTimeout(botTimeout);                                         //Clear any bot timeout if pending
  botTimeout = null;                                                //Set timeout to null
  resetGame();                                                      //Fully reset game state via resetGame().
  showScreen("modeScreen");                                         //Then display the "modeScreen" where user can select either PvP or Bot mode.
}

if (goHomeBtn) {                                                    //If the Go Home button exists(Yes it exists, I used if condition just as a fallback)
  goHomeBtn.addEventListener("click", () => {                       //Add a click eventListener.
    if (goHomeSound) {
      goHomeSound.currentTime = 0;                                  //On click, play the goHome sound (if available)
      goHomeSound.play();
    }
    goHome();                                                       //Call the goHome function.
  });
}

/*
────────────── THE END ──────────────
✅ You’ve reached the bottom of this madness.
💡 Pro Tip: If you lost on easy mode, you might wanna uninstall life.
🎉 If you beat the hard bot... No, you didn’t.

// Credits to your sanity for making it through
// And yes... this script has more logic than your ex’s excuses 💀
*/