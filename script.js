// Game Elements
const userScoreElement = document.getElementById("user");
const compScoreElement = document.getElementById("comp");
const choices = document.querySelectorAll(".choice");
const gameArena = document.getElementById("gameArena");
const userChoiceDisplay = document.getElementById("userChoiceDisplay");
const compChoiceDisplay = document.getElementById("compChoiceDisplay");
const userChoiceImg = document.getElementById("userChoiceImg");
const compChoiceImg = document.getElementById("compChoiceImg");
const countdown = document.getElementById("countdown");
const msgElement = document.getElementById("msg");
const resetBtn = document.getElementById("resetBtn");

// Game State
let userScore = 0;
let compScore = 0;
let isGameActive = true;

// Initialize scores
userScoreElement.textContent = userScore;
compScoreElement.textContent = compScore;

// Choice options
const options = ["rock", "paper", "scissors"];

// Generate computer choice
const generateCompChoice = () => {
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
};

// Get image source for choice
const getChoiceImage = (choice) => {
  return `images/${choice}.svg`;
};

// Show countdown animation
const showCountdown = () => {
  return new Promise((resolve) => {
    let count = 3;
    countdown.textContent = count;
    countdown.style.display = "block";
    
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdown.textContent = count;
        countdown.style.animation = "none";
        setTimeout(() => {
          countdown.style.animation = "countdownPulse 1s ease-in-out";
        }, 10);
      } else {
        countdown.textContent = "GO!";
        setTimeout(() => {
          countdown.style.display = "none";
          resolve();
        }, 500);
        clearInterval(countInterval);
      }
    }, 1000);
  });
};

// Show choices with animation
const showChoices = (userChoice, compChoice) => {
  // Set user choice
  userChoiceImg.src = getChoiceImage(userChoice);
  userChoiceImg.alt = userChoice;
  
  // Set computer choice
  compChoiceImg.src = getChoiceImage(compChoice);
  compChoiceImg.alt = compChoice;
  
  // Add entrance animation
  userChoiceDisplay.style.animation = "slideIn 0.5s ease-out";
  compChoiceDisplay.style.animation = "slideIn 0.5s ease-out";
};

// Determine winner
const determineWinner = (userChoice, compChoice) => {
  if (userChoice === compChoice) {
    return "draw";
  } else if (
    (userChoice === "rock" && compChoice === "scissors") ||
    (userChoice === "scissors" && compChoice === "paper") ||
    (userChoice === "paper" && compChoice === "rock")
  ) {
    return "user";
  } else {
    return "computer";
  }
};

// Update score with animation
const updateScore = (winner) => {
  if (winner === "user") {
    userScore++;
    userScoreElement.textContent = userScore;
    userScoreElement.classList.add("score-update");
    setTimeout(() => userScoreElement.classList.remove("score-update"), 600);
  } else if (winner === "computer") {
    compScore++;
    compScoreElement.textContent = compScore;
    compScoreElement.classList.add("score-update");
    setTimeout(() => compScoreElement.classList.remove("score-update"), 600);
  }
};

// Show result with animations
const showResult = (winner, userChoice, compChoice) => {
  // Remove previous result classes
  msgElement.classList.remove("win", "lose", "draw");
  userChoiceDisplay.classList.remove("winner", "loser");
  compChoiceDisplay.classList.remove("winner", "loser");
  
  setTimeout(() => {
    if (winner === "user") {
      msgElement.textContent = "🎉 You Win! 🎉";
      msgElement.classList.add("win");
      userChoiceDisplay.classList.add("winner");
      compChoiceDisplay.classList.add("loser");
    } else if (winner === "computer") {
      msgElement.textContent = "💻 Computer Wins! 💻";
      msgElement.classList.add("lose");
      compChoiceDisplay.classList.add("winner");
      userChoiceDisplay.classList.add("loser");
    } else {
      msgElement.textContent = "🤝 It's a Draw! 🤝";
      msgElement.classList.add("draw");
    }
    
    // Show reset button after game
    setTimeout(() => {
      resetBtn.style.display = "inline-block";
      isGameActive = true;
    }, 1500);
  }, 1000);
};

// Main game function
const playGame = async (userChoice) => {
  if (!isGameActive) return;
  
  isGameActive = false;
  resetBtn.style.display = "none";
  
  // Disable all choices and show selection
  choices.forEach(choice => {
    choice.classList.add("disabled");
    if (choice.id === userChoice) {
      choice.classList.add("selected");
    }
  });
  
  // Generate computer choice
  const compChoice = generateCompChoice();
  
  // Show game arena
  gameArena.style.display = "flex";
  msgElement.textContent = "Get Ready!";
  msgElement.classList.remove("win", "lose", "draw");
  
  // Show countdown
  await showCountdown();
  
  // Show choices
  showChoices(userChoice, compChoice);
  
  // Determine winner
  const winner = determineWinner(userChoice, compChoice);
  
  // Update score
  updateScore(winner);
  
  // Show result
  showResult(winner, userChoice, compChoice);
  
  // Reset choice selections
  setTimeout(() => {
    choices.forEach(choice => {
      choice.classList.remove("disabled", "selected");
    });
  }, 2000);
};

// Reset game
const resetGame = () => {
  gameArena.style.display = "none";
  msgElement.textContent = "Choose your move!";
  msgElement.classList.remove("win", "lose", "draw");
  resetBtn.style.display = "none";
  isGameActive = true;
  
  // Clear choice displays
  userChoiceDisplay.classList.remove("winner", "loser");
  compChoiceDisplay.classList.remove("winner", "loser");
};

// Event listeners
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

resetBtn.addEventListener("click", resetGame);

// Add keyboard support
document.addEventListener("keydown", (e) => {
  if (!isGameActive) return;
  
  switch(e.key.toLowerCase()) {
    case "r":
      playGame("rock");
      break;
    case "p":
      playGame("paper");
      break;
    case "s":
      playGame("scissors");
      break;
  }
});

// Initialize message
msgElement.textContent = "Choose your move! (R-Rock, P-Paper, S-Scissors)";


