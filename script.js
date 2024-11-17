// Select DOM elements for the board, message display, keyboard, and mode toggler
const board = document.getElementById("board");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
const modeToggler = document.getElementById("mode-toggler"); // Toggler for light/dark mode

// Select DOM elements for the flags and language selector
const languageSelector = document.getElementById("language-selector");
const languageFlags = document.querySelectorAll(".language-flag");

// Default language set to English
let currentLang = "en"; 
// Translation data
const translations = {
    en: {
        title: "Wordle",
        playAgain: "Play Again",
        congratulations: "Congratulations! You've guessed the word!",
        gameOver: "Game Over! The word was",
        guessError: "Guess must be 5 letters long.",
        darkMode: "Switch to Dark Mode",
        lightMode: "Switch to Light Mode",
    },
    it: {
        title: "Parola",
        playAgain: "Gioca di Nuovo",
        congratulations: "Congratulazioni! Hai indovinato la parola!",
        gameOver: "Partita finita! La parola era",
        guessError: "Il tentativo deve essere di 5 lettere.",
        darkMode: "Passa alla Modalità Scura",
        lightMode: "Passa alla Modalità Chiara",
    },
    fr: {
        title: "Motus",
        playAgain: "Rejouer",
        congratulations: "Félicitations! Vous avez deviné le mot!",
        gameOver: "Partie terminée! Le mot était",
        guessError: "Le mot doit contenir 5 lettres.",
        darkMode: "Passer en Mode Sombre",
        lightMode: "Passer en Mode Clair",
    },
    es: {
        title: "Palabra",
        playAgain: "Jugar de Nuevo",
        congratulations: "¡Felicidades! ¡Has adivinado la palabra!",
        gameOver: "Juego terminado. La palabra era",
        guessError: "La palabra debe tener 5 letras.",
        darkMode: "Cambiar a Modo Oscuro",
        lightMode: "Cambiar a Modo Claro",
    },
    de: {
        title: "Wortspiel",
        playAgain: "Nochmal Spielen",
        congratulations: "Herzlichen Glückwunsch! Du hast das Wort erraten!",
        gameOver: "Spiel vorbei! Das Wort war",
        guessError: "Das Wort muss 5 Buchstaben haben.",
        darkMode: "Zum Dunkelmodus Wechseln",
        lightMode: "Zum Lichtmodus Wechseln",
    },
};
// Event listener to handle flag click
languageFlags.forEach((flag) => {
    flag.addEventListener("click", () => {
        currentLang = flag.getAttribute("data-lang");
        console.log(`Language changed to: ${currentLang}`);
        languageFlags.forEach((f) => f.classList.remove("active")); // Remove active class
        flag.classList.add("active"); // Add active class to selected flag
        updateUITranslations(); // Update all texts
        initializeGame(); // Restart the game with the new language
    });
});

// Variables to store the target word, the current attempt count, and the status of each letter
let targetWord;
let attempts = 0;
let letterStatus = {}; // Object to track the status of each letter (correct, present, absent)

// Fetch a random 5-letter word from the API
async function fetchRandomWord() {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?lang=${currentLang}&number=1&length=5`);
    const data = await response.json();
    // console.log(data[0]); // Log the fetched word (for debugging)
    return removeAccents(data[0].toUpperCase()); // Convert to uppercase for consistency
}

// Initialize the game by fetching the target word, creating the board, and keyboard
async function initializeGame() {
    targetWord = await fetchRandomWord(); // Fetch the random word
    board.innerHTML = ""; // Reset the board
    keyboard.innerHTML = ""; // Reset the keyboard
    attempts = 0; // Reset attempts
    letterStatus = {}; // Reset letter statuses
    createBoard(); // Create the game board
    createKeyboard(); // Create the on-screen keyboard
    message.textContent = ""; // Clear any previous message
}

// Create a 6x5 board where players can make up to 6 guesses
function createBoard() {
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div"); // Create a row for each attempt
        row.classList.add("row");

        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div"); // Create a cell for each letter
            cell.classList.add("cell");
            cell.setAttribute("data-row", i); // Add row index as a data attribute
            cell.setAttribute("data-col", j); // Add column index as a data attribute
            row.appendChild(cell); // Append cell to the current row
        }
        board.appendChild(row); // Append the row to the board
    }
}

// Create the on-screen keyboard using the QWERTY layout
function createKeyboard() {
    const qwertyLayout = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    qwertyLayout.forEach((row) => {
        const rowDiv = document.createElement("div"); // Create a row for the keyboard
        rowDiv.classList.add("keyboard-row");

        for (let letter of row) {
            const key = document.createElement("div"); // Create a key for each letter
            key.classList.add("key");
            key.textContent = letter; // Set the letter as the key's text
            key.setAttribute("data-letter", letter); // Add the letter as a data attribute

            // Add a click event listener to handle key presses
            key.addEventListener("click", () => {
                handleKeyClick(letter); // Handle letter input
            });

            rowDiv.appendChild(key); // Append key to the current keyboard row
            letterStatus[letter] = ''; // Initialize the status of each letter
        }
        keyboard.appendChild(rowDiv); // Append the row to the keyboard
    });

    // Add a Delete button
    const deleteRow = document.createElement("div"); // Row for the delete key
    deleteRow.classList.add("keyboard-row");
    const deleteKey = document.createElement("div");
    deleteKey.classList.add("key", "delete-key"); // Add a special class for styling the delete key
    deleteKey.textContent = "DEL";
    deleteKey.addEventListener("click", handleDeleteClick); // Add event listener for delete functionality
    deleteRow.appendChild(deleteKey);
    keyboard.appendChild(deleteRow); // Append the delete row to the keyboard
}

// Handle clicking a key on the on-screen keyboard
function handleKeyClick(letter) {
    // Find the first empty cell in the current row
    const currentRow = document.querySelectorAll(`.row:nth-child(${attempts + 1}) .cell`);
    for (let cell of currentRow) {
        if (!cell.textContent) { // Check if the cell is empty
            cell.textContent = letter; // Set the clicked letter in the cell
            break; // Exit the loop after filling one cell
        }
    }

    // If the row is fully filled, automatically check the guess
    const filledCells = Array.from(currentRow).filter(cell => cell.textContent).length;
    if (filledCells === 5) {
        checkGuess(); // Validate the guess
    }
}

// Handle the delete key press
function handleDeleteClick() {
    const currentRow = document.querySelectorAll(`.row:nth-child(${attempts + 1}) .cell`);
    for (let i = currentRow.length - 1; i >= 0; i--) { // Start from the last cell
        if (currentRow[i].textContent) { // Find the last non-empty cell
            currentRow[i].textContent = ""; // Clear the cell
            break; // Exit the loop after deleting one letter
        }
    }
}

// Check the player's guess against the target word
function checkGuess() {
    const guess = Array.from(document.querySelectorAll(`.row:nth-child(${attempts + 1}) .cell`))
        .map(cell => cell.textContent.toUpperCase()).join("");

    if (guess.length !== 5) {
        alert(translations[currentLang].guessError); // Use translation for the error message
        return;
    }

    const cells = document.querySelectorAll(".cell");
    const targetWordLetters = targetWord.split('');

    // First pass: Check for correct letters in the correct positions
    for (let i = 0; i < 5; i++) {
        const cell = cells[attempts * 5 + i];
        if (guess[i] === targetWord[i]) {
            cell.classList.add("correct");
            letterStatus[guess[i]] = 'correct';
        }
    }

    // Second pass: Check for correct letters in incorrect positions
    for (let i = 0; i < 5; i++) {
        const cell = cells[attempts * 5 + i];
        if (guess[i] !== targetWord[i] && targetWordLetters.includes(guess[i])) {
            cell.classList.add("present");
            letterStatus[guess[i]] = 'present';
        } else if (guess[i] !== targetWord[i]) {
            letterStatus[guess[i]] = 'absent';
        }
    }

    updateKeyboard();
    attempts++;

    if (guess === targetWord) {
        message.textContent = translations[currentLang].congratulations; // Win message
        displayPlayAgainButton();
    } else if (attempts >= 6) {
        message.textContent = `${translations[currentLang].gameOver} ${targetWord}`; // Lose message
        displayPlayAgainButton();
    }
}

// Update the keyboard to reflect the status of each letter
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

// Display a "Play Again" button
function displayPlayAgainButton() {
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = translations[currentLang].playAgain;
    playAgainButton.classList.add("play-again-button");
    playAgainButton.addEventListener("click", initializeGame);
    message.appendChild(playAgainButton);
}

// Update all translatable UI elements
function updateUITranslations() {
    const isDarkMode = document.body.classList.contains("dark-mode");
    modeToggler.textContent = isDarkMode
        ? translations[currentLang].lightMode
        : translations[currentLang].darkMode;

    // Update the game title (H1) based on the current language
    const titleElement = document.getElementById("game-title"); // Assuming the H1 element has an ID of 'game-title'
    titleElement.textContent = translations[currentLang].title;
}


// Toggle between light and dark modes
function toggleMode() {
    document.body.classList.toggle("dark-mode");
    updateUITranslations();
}

// Add event listener for the mode toggler
modeToggler.addEventListener("click", toggleMode);

// Start the game
initializeGame();

function removeAccents(str) {
    const accents = {
        'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a', 'å': 'a',
        'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
        'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
        'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
        'ç': 'c', 'ñ': 'n',
        'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A',
        'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
        'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Õ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
        'Ç': 'C', 'Ñ': 'N'
    };

    return str.split('').map(char => accents[char] || char).join('');
}
