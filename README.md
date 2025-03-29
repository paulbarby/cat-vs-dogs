<<<<<<< HEAD
# cat-vs-dogs
=======
# Cat vs. Dogs! - A JavaScript Pac-Man Style Game

This repository contains the source code for "Cat vs. Dogs!", a browser-based game built entirely with HTML, CSS, and vanilla JavaScript using the HTML5 Canvas API.

## Game Concept

The game is a fun twist on the classic Pac-Man formula:

- You control the Cat (`🐈`).
- Your goal is to eat all the cat food (`🐾` - drawn as dots) in the maze.
- Avoid the patrolling Dogs (`🐕`, `🐩`, `🦮`, `🐕‍🦺`)!
- Eating a fish power-up (`🐟`) makes the dogs vulnerable (`🦴`), allowing you to catch them and send them back to the central pound for bonus points.
- The game features 5 levels with increasing dog speed and progressively complex mazes (though you might need to define unique maze layouts for levels 3-5 in `game.js`!).
- It keeps track of your score, lives, and saves the high score locally.

## The Development Process: A Collaboration with Gemini

This game wasn't built entirely by hand in the traditional sense. It was developed through a collaborative and iterative process between **myself** and **Google's Gemini 2.5 Pro model** (via studio.google.com). Here's how it unfolded:

1.  **The Blueprint:** I started by providing Gemini with a highly detailed prompt. This wasn't just a simple request; it was a comprehensive specification outlining everything from the core game mechanics, required technologies, specific emojis, UI elements, level structure, AI behavior guidelines, scoring rules, and even code structure preferences.

2.  **Initial Generation:** The LLM took this detailed prompt and generated the first complete draft of the HTML, CSS, and JavaScript code. This initial version aimed to implement all requested features but, as expected with complex generation, had some fundamental issues.

3.  **Debugging the Core:** Upon testing, I immediately identified critical bugs:

    - **Wall Collision Failure:** Neither the cat nor the dogs respected the maze walls.
    - **Incorrect Icons:** The dogs were incorrectly displayed using the cat emoji.
      I reported these issues back to the LLM.

4.  **Refactoring & Correction:** The LLM acknowledged the errors and performed a significant refactoring, particularly focusing on:

    - Fixing the simple icon bug in the `Dog` constructor.
    - Completely rewriting the core movement and collision detection logic (`Entity.move`, `isAligned`, `checkWallCollision`) to ensure entities correctly stopped at walls and moved reliably within the grid system.

5.  **Iterative Feature Refinement:** Once the core movement was functional, I requested further enhancements and adjustments:

    - Fine-tuning cat and dog speeds.
    - Adding an "Exit to Menu" button.
    - Implementing basic sound effects using the Web Audio API and adding a sound toggle option to the menu.
    - Ensuring dogs correctly reset their state after returning to the pound.
      The LLM implemented these changes by modifying constants, adjusting specific methods, and integrating the necessary event listeners and UI updates.

6.  **Advanced AI - A\* Pathfinding:** To make the dogs more challenging, I requested a more sophisticated AI using the A\* pathfinding algorithm. This included requirements for:

    - Periodic path recalculation.
    - Specific target logic (cat, home, flee point).
    - Decreasing recalculation time per level.
    - Fallback behavior (random movement) if no path was found.
    - Path diversity to prevent dogs clumping together.
      The LLM implemented the A\* algorithm and integrated it into the `Dog` class, replacing the simpler AI logic. This required careful management of paths, targets, and timers.

7.  **Further Debugging:** We encountered a subtle bug where dogs wouldn't properly transition to the respawning state upon reaching the pound. I provided feedback, and the LLM corrected the logic within the `Dog.decideNextMove` method to ensure the state change happened precisely upon arrival.

8.  **Final Feature - Screen Wrapping:** I requested the classic Pac-Man screen wrapping feature (top-to-bottom, left-to-right). The LLM modified the `Entity.move` method again to check boundaries and potential destination walls before allowing wrapping.

**Conclusion:**

Throughout this project, **I acted as the designer, director, and primary tester**, providing the initial vision, detailed specifications, and crucial feedback on bugs and desired features. **Gemini 2.5 Pro served as the primary coder**, translating my requests into functional JavaScript, refactoring code based on feedback, and implementing complex algorithms like A\*. This iterative cycle of **prompt -> code -> test -> feedback -> refinement** was essential in building the game.

Feel free to explore the code, play the game, and maybe even design your own mazes using the array format in `game.js`!
>>>>>>> 87a208c (Updated readmes)
