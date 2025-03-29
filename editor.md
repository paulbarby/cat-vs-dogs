# Cat vs. Dogs - Web-Based Maze Editor

A simple, browser-based level editor designed specifically for creating and modifying maze layouts for the "Cat vs. Dogs" game. This tool allows for visual editing of the maze grid and exports the map data directly into the 2D JavaScript array format required by the game logic (`game.js`).

The editor runs entirely in the browser using vanilla HTML, CSS, and JavaScript.

**(Optional: Add a screenshot of the editor here)**

<!-- ![Editor Screenshot](link/to/your/screenshot.png) -->

## Features

- **Visual Grid Editing:** Paint maze elements directly onto a grid representing the game map.
- **Tile Palette:** Select from available game elements:
  - 🧱 Wall (1)
  - 🐾 Cat Food (2)
  - 🐟 Power-up (3)
  - 🐈 Cat Start (4)
  - 🐕 Dog Spawn (5)
  - 🦴 Pound Area (6)
  - (Empty/Path) (0)
- **Preloaded Maps:** Comes with the five default game maps to use as starting points or modify.
- **Map Selection:** Easily switch between different maps using a dropdown menu.
- **Export Functionality:** Generates the maze data as a correctly formatted JavaScript 2D array string, ready to be copied and pasted directly into the `mazes` array in your `game.js` file.
- **Clear Grid:** Quickly reset the current map grid to empty paths.
- **Simple Interface:** Easy-to-understand layout and controls.

## Technology Stack

- **HTML:** (`editor.html`) Structure of the editor page.
- **CSS:** (`editor.style.css`) Basic styling for layout and appearance.
- **Vanilla JavaScript:** (`editor.js`) All client-side logic, grid manipulation, and data handling.

## How to Use

1.  **Clone or Download:** Get the project files (`editor.html`, `editor.style.css`, `editor.js`).
2.  **Open:** Launch the `editor.html` file in a modern web browser.
3.  **Select Map:** Choose a base map to edit from the "Load Map" dropdown.
4.  **Select Tile:** Click on a tile in the "Palette" section to select your brush.
5.  **Paint:** Click on the cells in the "Grid" section to place the selected tile.
6.  **Export:** Once you are satisfied with your map, click the "Export Data" button.
7.  **Copy:** The formatted JavaScript array data will appear in the "Exported Data" text area. Select and copy the entire content.
8.  **Paste:** Open your `game.js` file, locate the `mazes` array variable, and paste the copied data to replace an existing map or add a new one. Ensure the commas between map arrays are correct.

## AI Assistance

This web-based editor application was created with the assistance of AI. The core structure, functionality, and code implementation for `editor.html`, `editor.style.css`, and `editor.js` were generated using prompts provided to **Google AI Studio** ([aistudio.google.com](https://aistudio.google.com/)), leveraging the capabilities of the **Gemini 1.5 Pro** model to translate the detailed requirements into functional code. The process involved iterative prompting for feature implementation, formatting, and debugging.

**(Optional: Add License section if desired)**

<!--
## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
-->
