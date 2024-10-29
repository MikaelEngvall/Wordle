const board = document.getElementById("board");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
let targetWord;
let attempts = 0;
let letterStatus = {}; // Object to track letter statuses

async function fetchRandomWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1&length=5');
    const data = await response.json();
    console.log(data[0])
    return data[0].toUpperCase(); // Convert to uppercase
}

async function initializeGame() {
    targetWord = await fetchRandomWord(); // Fetch the random word
    createBoard(); // Create the game board
    createKeyboard(); // Create the keyboard
}

function createBoard() {
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.contentEditable = "true"; // Make the cell editable
            cell.maxLength = 1; // Limit to one character
            cell.setAttribute("data-row", i);
            cell.setAttribute("data-col", j);
            cell.addEventListener("input", handleInput);
            cell.addEventListener("keypress", handleKeyPress);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let letter of alphabet) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = letter;
        key.setAttribute("data-letter", letter);
        keyboard.appendChild(key);
        letterStatus[letter] = ''; // Initialize letter status
    }
}

function handleInput(e) {
    const cell = e.target;
    const value = cell.textContent.toUpperCase();

    if (value.length > 1) {
        cell.textContent = value.charAt(0); // Limit to one character
    }

    // Move focus to the next cell
    const nextCell = cell.nextElementSibling;
    if (nextCell) {
        nextCell.focus();
    } else {
        checkGuess(); // Check guess when the last cell is filled
    }
}

function handleKeyPress(e) {
    if (e.key === 'Backspace') {
        const cell = e.target;
        const previousCell = cell.previousElementSibling;
        if (previousCell) {
            previousCell.focus();
        }
    }
}

function checkGuess() {
    const guess = Array.from(document.querySelectorAll(`.row:nth-child(${attempts + 1}) .cell`))
        .map(cell => cell.textContent.toUpperCase()).join("");

    if (guess.length !== 5) {
        alert("Guess must be 5 letters long.");
        return;
    }
    
    const cells = document.querySelectorAll(".cell");
    const targetWordLetters = targetWord.split('');
    
    // First pass: Check for correct letters
    for (let i = 0; i < 5; i++) {
        const cell = cells[attempts * 5 + i];
        if (guess[i] === targetWord[i]) {
            cell.classList.add("correct");
            letterStatus[guess[i]] = 'correct'; // Update letter status
        }
    }

    // Second pass: Check for present letters
    for (let i = 0; i < 5; i++) {
        const cell = cells[attempts * 5 + i];
        if (guess[i] !== targetWord[i] && targetWordLetters.includes(guess[i])) {
            cell.classList.add("present");
            letterStatus[guess[i]] = 'present'; // Update letter status
        } else if (guess[i] !== targetWord[i]) {
            letterStatus[guess[i]] = 'absent'; // Update letter status
        }
    }

    // Update the keyboard
    updateKeyboard();

    attempts++;
    
    if (guess === targetWord) {
        message.textContent = "Congratulations! You've guessed the word!";
    } else if (attempts >= 6) {
        message.textContent = "Game Over! The word was " + targetWord;
    }
}

function updateKeyboard() {
    const keys = keyboard.querySelectorAll(".key");
    keys.forEach(key => {
        const letter = key.getAttribute("data-letter");
        if (letterStatus[letter] === 'correct') {
            key.classList.add("correct");
        } else if (letterStatus[letter] === 'present') {
            key.classList.add("present");
        } else if (letterStatus[letter] === 'absent') {
            key.classList.add("absent");
        }
    });
}

// Initialize the game
initializeGame();