# Word Guessing Game in 5 different languages

A fun and interactive Wordle-like game where players have 6 attempts to guess a 5-letter word. 

The app features a virtual keyboard, delete functionality, and both light and dark modes for a pleasant user experience.

As well as in 5 laguages.

Word Guessing Game Screenshot 

<img src="https://github.com/MikaelEngvall/Wordle/blob/main/wordle_motus_wortspiel.gif" width="600" height="400" />

---

## Table of Contents

- [Features](#features)
- [How to Play](#how-to-play)
- [Light and Dark Mode](#light-and-dark-mode)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **Dynamic Game Board**: A 6x5 grid dynamically created to support up to 6 guesses for a 5-letter word.
- **Play in 5 different languages
- **Virtual Keyboard**: Fully functional on-screen keyboard, including:
  - Letters to input guesses.
  - A **Delete** button to remove incorrect letters.
- **API Integration**: Fetches a random 5-letter word from an external API.
- **Letter Feedback**:
  - Green: Correct letter in the correct position.
  - Yellow: Correct letter in the wrong position.
  - Grey: Incorrect letter.
- **Light/Dark Mode Toggle**: Switch between light and dark modes for better visual accessibility.
- **Play Again Option**: Restart the game after winning or losing.

---

## How to Play

1. Guess the 5-letter word within 6 attempts.
2. Use the virtual keyboard to input your guesses.
3. Feedback will be provided:
   - Green letters are correct and in the right position.
   - Yellow letters are correct but in the wrong position.
   - Grey letters are not part of the target word.
4. You can delete letters using the **DEL** button.
5. Toggle between **Light** and **Dark** modes using the button at the top.

---

## Light and Dark Mode

This app includes a **Light/Dark Mode Toggler** to provide a comfortable gaming experience for different lighting conditions.

- Default mode: Light Mode.
- Toggle mode: Dark Mode, with enhanced visuals and reduced strain on the eyes.

---

## Technologies Used

- **HTML5**: For structuring the web application.
- **CSS3**: For styling and responsive design.
- **JavaScript**: For game logic, keyboard handling, and mode toggling.
- **Random Word API**: To fetch random 5-letter words for the game.

---

## Setup and Installation

### Prerequisites

Ensure you have the following installed:
- A web browser (e.g., Chrome, Firefox).
- (Optional) A local server (e.g., Live Server in VS Code) for better performance.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/word-guessing-game.git
    ```

## Future Improvements

- Add customizable game settings (e.g., word length, difficulty level).
- Implement score tracking and leaderboards.
- Optimize for mobile touch events.
- Improve animations for user feedback.
- Add localization for multiple languages.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! If you'd like to improve the game or report bugs, please:
1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Describe your feature here"
   ```
4. Push the branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a pull request.

---

## Screenshot

![Game Screenshot](https://github.com/user-attachments/assets/60467a2c-3267-4435-a7e8-7d3b06d5b452)


---

## Acknowledgments

- [Random Word API](https://random-word-api.herokuapp.com/) for providing random 5-letter words.
- Inspiration from the classic Wordle game.


