document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const highScoreDisplay = document.getElementById('high-score');
    const menuHighScoreDisplay = document.getElementById('menu-high-score');
    const finalScoreGameOverDisplay = document.getElementById('final-score-gameover');
    const highScoreGameOverDisplay = document.getElementById('high-score-gameover');
    const finalScoreWinDisplay = document.getElementById('final-score-win');
    const highScoreWinDisplay = document.getElementById('high-score-win');
    const transitionLevelDisplay = document.getElementById('transition-level');
    const soundToggle = document.getElementById('soundToggle'); // Sound Toggle Checkbox

    // Overlays
    const menuOverlay = document.getElementById('menu');
    const gameOverOverlay = document.getElementById('gameOver');
    const levelTransitionOverlay = document.getElementById('levelTransition');
    const winScreenOverlay = document.getElementById('winScreen');

    // Buttons
    const startButton = document.getElementById('startButton');
    const restartButtonGameOver = document.getElementById('restartButtonGameOver');
    const playAgainButton = document.getElementById('playAgainButton');
    const exitButton = document.getElementById('exitButton');

    // --- Sound State ---
    let isSoundEnabled = localStorage.getItem('catVsDogsSoundEnabled') !== 'false'; // Default to true
    let audioCtx = null;
    soundToggle.checked = isSoundEnabled; // Set checkbox state on load

    // --- Web Audio API Setup ---
    function playSound(frequency, type = 'sine', duration = 0.1) {
        // *** CHECK SOUND ENABLED ***
        if (!isSoundEnabled || !audioCtx) return;
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (error) {
            console.error("Error playing sound:", error);
            audioCtx = null; // Possibly disable audio if context broken
        }
    }

    // --- Game Constants ---
    const TILE_SIZE = 24; const FONT_SIZE = TILE_SIZE * 0.8;
    const PATH = 0; const WALL = 1; const CAT_FOOD = 2; const POWER_UP = 3; const CAT_START = 4; const DOG_SPAWN = 5; const EMPTY_POUND = 6;
    const WALL_EMOJI = '🧱'; const POWER_UP_EMOJI = '🐟'; const CAT_EMOJI = '🐈';
    // *** DIFFERENT DOG EMOJIS ***
    const DOG_EMOJIS = ['🐕', '🐩', '🦮', '🐕‍🦺']; // Array of dog emojis
    const VULNERABLE_DOG_EMOJI = '🦴'; const RETURNING_DOG_EMOJI = '💨';
    const LIFE_EMOJI = '💖';
    const STARTING_LIVES = 5; const MAX_LEVELS = 5; const CAT_BASE_SPEED = (TILE_SIZE / 7) * 0.7; const DOG_FAST_RETURN_SPEED = (TILE_SIZE / 7) * 1.5; const DOG_RETURN_SPEED = DOG_FAST_RETURN_SPEED * 0.7; const POWER_UP_DURATION = 7000; const DOG_RESPAWN_DELAY = 3000; const LEVEL_TRANSITION_DELAY = 2000;
    const POINTS_FOOD = 10; const POINTS_POWERUP = 50; const POINTS_DOG_BASE = 200;

   const mazes = [
        
        [   
            // 1
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1],
            [1,1,1,1,2,1,1,1,6,0,6,1,1,1,2,1,1,1,1],
            [2,2,2,2,2,1,6,5,0,0,0,5,6,1,2,2,2,2,2],
            [1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,1,2,2,2,2,2,4,2,2,2,2,2,1,2,2,1],
            [1,2,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,2,1],
            [1,2,1,1,1,1,2,2,2,1,2,2,2,1,1,1,1,2,1],
            [1,3,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        
        [ 
            // 2
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,3,2,2,2,2,1,2,2,4,2,2,1,2,2,2,2,3,1],
            [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,5,5,6,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,6,5,6,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,0,0,0,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,2,1,1,2,2,2,1,1,2,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
            [1,2,2,2,1,2,1,2,2,2,2,2,1,2,1,2,2,2,1],
            [1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1],
            [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        
         [ 
            // 3
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,1,2,2,3,2,2,1,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,2,2,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,6,5,6,1,2,2,2,2,2,2,1],
            [1,3,1,1,1,1,2,1,5,5,5,1,2,1,1,1,1,3,1],
            [1,2,2,2,2,2,2,1,1,1,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
            [1,2,2,2,1,2,1,2,2,2,2,2,1,2,1,2,2,2,1],
            [1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1],
            [1,3,2,2,2,2,2,2,2,4,2,2,2,2,2,2,2,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        [ 
            // 4
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,4,2,2,2,1,1,2,2,2,2,2,1,1,1,2,2,3,1],
            [1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,2,2,1],
            [1,2,1,3,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,2,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,2,6,5,6,1,2,2,2,2,2,2,1],
            [2,2,2,1,1,1,2,2,6,5,6,1,3,1,1,1,1,2,2],
            [1,2,2,2,2,2,2,1,2,1,2,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
         [ // 5
            [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1],
            [1,2,1,2,2,2,2,2,2,2,1,2,1,2,1,2,2,2,1],
            [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1],
            [1,2,2,2,1,2,2,2,1,2,2,2,1,2,1,2,2,2,1],
            [1,2,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,2,1],
            [1,2,1,2,1,2,2,6,5,5,0,6,2,2,1,2,1,2,1],
            [2,2,1,2,1,2,2,6,5,5,0,6,2,2,1,2,1,2,2],
            [1,2,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,2,1],
            [1,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
            [1,2,1,1,1,1,1,3,1,1,1,3,1,1,1,1,1,2,1],
            [1,2,2,2,1,2,1,1,1,2,1,1,1,2,1,2,2,2,1],
            [1,2,1,2,1,2,2,2,2,2,2,2,2,2,1,2,1,2,1],
            [1,2,1,2,1,2,2,2,1,4,1,2,2,2,1,2,1,2,1],
            [1,2,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1]
        ]
    ];


    // --- A* Pathfinding Implementation ---
    class PathNode { /* ... unchanged ... */ constructor(x, y, g = 0, h = 0, parent = null) { this.x = x; this.y = y; this.g = g; this.h = h; this.f = g + h; this.parent = parent; }}
    function findPath(startX, startY, endX, endY, currentMaze) { /* ... unchanged ... */ const openSet = []; const closedSet = new Set(); const startNode = new PathNode(startX, startY, 0, heuristic(startX, startY, endX, endY)); openSet.push(startNode); const MAX_ITERATIONS = 1000; let iterations = 0; while (openSet.length > 0 && iterations < MAX_ITERATIONS) { iterations++; let lowestFIndex = 0; for (let i = 1; i < openSet.length; i++) { if (openSet[i].f < openSet[lowestFIndex].f) { lowestFIndex = i; } } const currentNode = openSet[lowestFIndex]; if (currentNode.x === endX && currentNode.y === endY) { const path = []; let temp = currentNode; while (temp !== null) { path.push({ x: temp.x, y: temp.y }); temp = temp.parent; } return path.reverse(); } openSet.splice(lowestFIndex, 1); closedSet.add(`${currentNode.x},${currentNode.y}`); const neighbors = getValidNeighbors(currentNode, currentMaze); for (const neighborCoords of neighbors) { const neighborKey = `${neighborCoords.x},${neighborCoords.y}`; if (closedSet.has(neighborKey)) continue; const gScore = currentNode.g + 1; let existingNode = openSet.find(node => node.x === neighborCoords.x && node.y === neighborCoords.y); if (!existingNode) { const hScore = heuristic(neighborCoords.x, neighborCoords.y, endX, endY); const newNode = new PathNode(neighborCoords.x, neighborCoords.y, gScore, hScore, currentNode); openSet.push(newNode); } else if (gScore < existingNode.g) { existingNode.g = gScore; existingNode.f = gScore + existingNode.h; existingNode.parent = currentNode; } } } return null; }
    function heuristic(x1, y1, x2, y2) { /* ... unchanged ... */ return Math.abs(x1 - x2) + Math.abs(y1 - y2); }
    function getValidNeighbors(node, currentMaze) { /* ... unchanged ... */ const neighbors = []; const dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }]; const numRows = currentMaze.length; const numCols = currentMaze[0].length; for (const dir of dirs) { const nextX = node.x + dir.dx; const nextY = node.y + dir.dy; let isWall = true; if (nextY >= 0 && nextY < numRows && nextX >= 0 && nextX < numCols) { const tile = currentMaze[nextY]?.[nextX]; if (tile === PATH || tile === CAT_FOOD || tile === POWER_UP || tile === DOG_SPAWN || tile === EMPTY_POUND) { isWall = false; } } else { if (currentMaze[node.y]?.[nextX] === PATH && (nextX < 0 || nextX >= numCols) ){ isWall = false; } } if (!isWall) { neighbors.push({ x: nextX, y: nextY }); } } return neighbors; }
    // --- End A* Pathfinding ---

    // --- Game State Variables ---
    let currentLevelIndex = 0; let maze = []; let cat = {}; let dogs = []; let score = 0; let lives = STARTING_LIVES;
    let highScore = parseInt(localStorage.getItem('catVsDogsHighScore') || '0');
    let foodRemaining = 0; let currentDogPoints = POINTS_DOG_BASE;
    let gameState = 'MENU'; let powerUpActive = false; let powerUpTimer = null; let vulnerableEndTime = 0;
    let catSpeed = CAT_BASE_SPEED; let dogBaseSpeed = (CAT_BASE_SPEED / 0.7) * 0.25; let dogSpeed = dogBaseSpeed;
    let lastTime = 0; let gameLoopId = null;

    // --- Entity Class ---
    class Entity {
        // *** Added baseEmoji property ***
         constructor(gridX, gridY, speed, emoji) {
            this.initialGridX = gridX; this.initialGridY = gridY; this.x = gridX * TILE_SIZE; this.y = gridY * TILE_SIZE; this.gridX = gridX; this.gridY = gridY;
            this.speed = speed;
            this.baseEmoji = emoji; // Store the default emoji
            this.emoji = emoji;     // Current emoji being displayed
            this.dx = 0; this.dy = 0; this.state = 'normal'; this.respawnTimer = null;
        }
        isAligned() { /* ... unchanged ... */ const tolerance = this.speed * 0.1; const iXA = Math.abs(this.x % TILE_SIZE) < tolerance || Math.abs(this.x % TILE_SIZE - TILE_SIZE) < tolerance; const iYA = Math.abs(this.y % TILE_SIZE) < tolerance || Math.abs(this.y % TILE_SIZE - TILE_SIZE) < tolerance; if (iXA && iYA) { this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE; this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE; this.gridX = Math.round(this.x / TILE_SIZE); this.gridY = Math.round(this.y / TILE_SIZE); return true; } return false; }
        checkWallCollision(checkGridX, checkGridY) { /* ... unchanged ... */ if (checkGridY < 0 || checkGridY >= maze.length || checkGridX < 0 || checkGridX >= maze[0].length) { const cGY = Math.round(this.y / TILE_SIZE); if (maze[cGY]?.[checkGridX] === PATH && ((checkGridX < 0 && this.dx === -1) || (checkGridX >= maze[0].length && this.dx === 1))) return false; return true; } return maze[checkGridY]?.[checkGridX] === WALL; }
        
         // *** UPDATED move method for 4-way wrapping ***
         move(deltaTime) {
            // Don't move if waiting to respawn or currently in the respawn timer delay
            if ((this.state === 'returning' && this.respawnTimer) || this.state === 'respawning') return;

            const moveAmount = this.speed * (deltaTime / 16.67); // Normalize speed
            let potentialX = this.x; // Start with current position
            let potentialY = this.y;

            // --- Calculate Potential Movement ---
            if (this.isAligned()) {
                // Check wall in the intended direction
                const nextGridX = this.gridX + this.dx;
                const nextGridY = this.gridY + this.dy;

                // Check if the immediate next cell *within bounds* is a wall
                let wallHit = false;
                if (nextGridY >= 0 && nextGridY < maze.length && nextGridX >= 0 && nextGridX < maze[0].length) {
                   if(maze[nextGridY]?.[nextGridX] === WALL) {
                       wallHit = true;
                   }
                }
                // Note: We don't check walls outside bounds here, wrap logic handles that

                if (wallHit) {
                    // Hit an internal wall, stop movement
                    this.dx = 0;
                    this.dy = 0;
                    // potentialX and potentialY remain unchanged (current position)
                } else {
                    // No immediate wall hit, calculate potential new position
                    potentialX += this.dx * moveAmount;
                    potentialY += this.dy * moveAmount;
                }
            } else {
                // --- Not Aligned: Move towards grid alignment ---
                let targetX = this.gridX * TILE_SIZE; let targetY = this.gridY * TILE_SIZE;
                if (this.dx > 0) targetX = Math.ceil(this.x / TILE_SIZE) * TILE_SIZE; else if (this.dx < 0) targetX = Math.floor(this.x / TILE_SIZE) * TILE_SIZE; else targetX = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
                if (this.dy > 0) targetY = Math.ceil(this.y / TILE_SIZE) * TILE_SIZE; else if (this.dy < 0) targetY = Math.floor(this.y / TILE_SIZE) * TILE_SIZE; else targetY = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
                let movedX = this.x; let movedY = this.y;
                if (this.dx !== 0) { const rX = targetX - this.x; const sX = this.dx * moveAmount; if (Math.abs(sX) >= Math.abs(rX)) movedX = targetX; else movedX += sX; }
                if (this.dy !== 0) { const rY = targetY - this.y; const sY = this.dy * moveAmount; if (Math.abs(sY) >= Math.abs(rY)) movedY = targetY; else movedY += sY; }
                potentialX = movedX; // Update potential positions
                potentialY = movedY;
            }

            // --- Screen Wrap Logic ---
            const rows = maze.length;
            const cols = maze[0].length;
            const wrapThreshold = TILE_SIZE * 0.5; // How far off screen before wrapping

            // Get current grid coords for destination checks
            const currentGridY = Math.round(this.y / TILE_SIZE);
            const currentGridX = Math.round(this.x / TILE_SIZE);

            let finalX = potentialX;
            let finalY = potentialY;

            // Left Wrap Check
            if (this.dx === -1 && potentialX < -wrapThreshold) {
                const destGridX = cols - 1;
                // Ensure currentGridY is valid before checking maze
                 if (currentGridY >= 0 && currentGridY < rows && maze[currentGridY]?.[destGridX] !== WALL) {
                    finalX = (cols * TILE_SIZE) + potentialX; // Wrap position
                } else {
                    finalX = this.x; // Reset potential X to current X if wrap blocked
                    this.dx = 0; // Stop horizontal movement
                }
            }
            // Right Wrap Check
            else if (this.dx === 1 && potentialX > (cols * TILE_SIZE) - wrapThreshold) {
                 const destGridX = 0;
                 if (currentGridY >= 0 && currentGridY < rows && maze[currentGridY]?.[destGridX] !== WALL) {
                    finalX = potentialX - (cols * TILE_SIZE); // Wrap position
                 } else {
                    finalX = this.x; // Reset potential X
                    this.dx = 0; // Stop horizontal movement
                 }
            }

            // Top Wrap Check
            if (this.dy === -1 && potentialY < -wrapThreshold) {
                 const destGridY = rows - 1;
                 // Ensure currentGridX is valid before checking maze
                 if (currentGridX >= 0 && currentGridX < cols && maze[destGridY]?.[currentGridX] !== WALL) {
                    finalY = (rows * TILE_SIZE) + potentialY; // Wrap position
                 } else {
                    finalY = this.y; // Reset potential Y
                    this.dy = 0; // Stop vertical movement
                 }
            }
            // Bottom Wrap Check
            else if (this.dy === 1 && potentialY > (rows * TILE_SIZE) - wrapThreshold) {
                 const destGridY = 0;
                 if (currentGridX >= 0 && currentGridX < cols && maze[destGridY]?.[currentGridX] !== WALL) {
                    finalY = potentialY - (rows * TILE_SIZE); // Wrap position
                 } else {
                    finalY = this.y; // Reset potential Y
                    this.dy = 0; // Stop vertical movement
                 }
            }
            // --- End Screen Wrap Logic ---


            // Final assignment
            this.x = finalX;
            this.y = finalY;

            // Update grid position (important for A* and interactions)
            // Use floor to be consistent with array indexing
            this.gridX = Math.floor((this.x + TILE_SIZE / 2) / TILE_SIZE);
            this.gridY = Math.floor((this.y + TILE_SIZE / 2) / TILE_SIZE);
            // Clamp grid positions just in case of edge floating point issues after wrapping
            this.gridX = Math.max(0, Math.min(cols - 1, this.gridX));
            this.gridY = Math.max(0, Math.min(rows - 1, this.gridY));
        }

        // *** UPDATED draw to use this.emoji ***
        draw(context) {
            context.font = `${FONT_SIZE}px Arial`; context.textAlign = 'center'; context.textBaseline = 'middle';
            let displayEmoji = this.emoji; // Use the current emoji by default
            if (this.state === 'vulnerable') {
                const tR = vulnerableEndTime - Date.now();
                if (tR < 2000 && Math.floor(Date.now() / 200) % 2 === 0) {
                    displayEmoji = this.baseEmoji; // Flash back to base dog emoji
                } else {
                    displayEmoji = VULNERABLE_DOG_EMOJI; // Show vulnerable
                }
            } else if (this.state === 'returning') {
                displayEmoji = RETURNING_DOG_EMOJI; // Show returning
            }
            // Only draw if not in the 'respawning' state (completely hidden)
            if (this.state !== 'respawning') {
                 context.fillText(displayEmoji, this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2);
            }
        }
        reset() {
             this.x = this.initialGridX * TILE_SIZE; this.y = this.initialGridY * TILE_SIZE; this.gridX = this.initialGridX; this.gridY = this.initialGridY;
             this.dx = 0; this.dy = 0; this.state = 'normal';
             this.emoji = this.baseEmoji; // Reset to base emoji
             if (this.respawnTimer) clearTimeout(this.respawnTimer); this.respawnTimer = null;
        }
    }

    // --- Cat Class ---
    class Cat extends Entity { /* ... unchanged ... */ constructor(gridX, gridY) { super(gridX, gridY, catSpeed, CAT_EMOJI); this.requestedDx = 0; this.requestedDy = 0; } move(deltaTime) { if (this.isAligned()) { let nX = this.gridX + this.requestedDx; let nY = this.gridY + this.requestedDy; if ((this.requestedDx !== 0 || this.requestedDy !== 0) && !this.checkWallCollision(nX, nY)) { this.dx = this.requestedDx; this.dy = this.requestedDy; } } super.move(deltaTime); } handleInput(key) { switch (key) { case 'ArrowUp': this.requestedDx = 0; this.requestedDy = -1; break; case 'ArrowDown': this.requestedDx = 0; this.requestedDy = 1; break; case 'ArrowLeft': this.requestedDx = -1; this.requestedDy = 0; break; case 'ArrowRight': this.requestedDx = 1; this.requestedDy = 0; break; } } reset() { super.reset(); this.requestedDx = 0; this.requestedDy = 0; } }

    // --- Dog Class ---
    class Dog extends Entity {
        // *** Pass specific dog emoji from array ***
        constructor(gridX, gridY, speed, dogIndex) {
            super(gridX, gridY, speed, DOG_EMOJIS[dogIndex % DOG_EMOJIS.length]); // Use unique emoji
            this.spawnPoint = { gridX, gridY }; this.targetTile = null; this.aiMode = 'scatter'; this.scatterTarget = this.getRandomCorner(); this.aiTimer = null;
            this.path = []; this.pathTargetCoords = null; this.pathRecalculateInterval = 10000; this.pathRecalculateTimer = null; this.isStuck = false;
        }
        move(deltaTime) { /* ... unchanged ... */ if (this.isAligned()) { this.decideNextMove(); } super.move(deltaTime); }
        
        // *** UPDATED decideNextMove ***
        decideNextMove() {
            // Don't move if waiting to respawn or currently in the respawn timer delay
            if ((this.state === 'returning' && this.respawnTimer) || this.state === 'respawning') return;

            // --- Follow the calculated path ---
            if (this.path && this.path.length > 0) {
                const nextStep = this.path[0];
                const targetX = nextStep.x; const targetY = nextStep.y;

                // Set direction towards next step in the path
                if (targetX > this.gridX) this.dx = 1; else if (targetX < this.gridX) this.dx = -1; else this.dx = 0;
                if (targetY > this.gridY) this.dy = 1; else if (targetY < this.gridY) this.dy = -1; else this.dy = 0;

                // Check if we've reached the coordinates of the next step (after Entity.move aligns us)
                if (this.isAligned() && this.gridX === targetX && this.gridY === targetY) {
                    this.path.shift(); // Remove the step we just reached

                    // *** CHANGE: Check for arrival ONLY after path step is removed ***
                    if (this.path.length === 0) {
                        // Path is now empty, check why
                        if (this.state === 'returning') {
                                // Finished returning path - ARRIVED HOME!
                                this.handleRespawnLogic(); // Trigger the respawn timer and state change
                                this.dx = 0; this.dy = 0; // Stop moving immediately
                                return; // Exit, respawn logic takes over
                        } else if (this.state === 'normal' && this.aiMode === 'chase') {
                                // Finished chase path - recalculate immediately
                                this.clearPathRecalculateTimer();
                                this.recalculatePath();
                                this.startPathRecalculateTimer();
                        }
                        // If path ended during scatter or vulnerable, the timer will handle the next recalc.
                    }
                    // *** END CHANGE ***
                }
                this.isStuck = false; // Moved successfully
            } else {
                // No path exists or path ended unexpectedly (and not returning state handled above)
                this.dx = 0; this.dy = 0; // Stop moving
                if (!this.isStuck && !this.pathRecalculateTimer && this.state !== 'returning' && this.state !== 'respawning') {
                    // If path empty and timer not running (and not returning/respawning), start one to get a new path
                    this.startPathRecalculateTimer();
                }
            }
        }

        
        // *** UPDATED recalculatePath (Removed redundant handleRespawnLogic call) ***
        recalculatePath() {
            let targetX = -1, targetY = -1;

            // 1. Determine Target Coordinates based on state
            if (this.state === 'returning') {
                const entrance = this.findPoundEntrance();
                targetX = entrance.gridX;
                targetY = entrance.gridY;
                // *** REMOVED: Respawn logic moved to decideNextMove upon arrival ***
                // if (this.gridX === targetX && this.gridY === targetY) {
                //     this.handleRespawnLogic(); // THIS WAS REMOVED
                //     return; // THIS WAS REMOVED
                // }
                // *** END REMOVED ***
            }
            else if (this.state === 'vulnerable') {
                // Fleeing: Find a target away from the cat
                const fleeTarget = this.calculateFleeTarget();
                targetX = fleeTarget.x;
                targetY = fleeTarget.y;
            }
            else { // Normal state (chase or scatter)
                if (this.aiMode === 'chase') {
                    targetX = cat.gridX;
                    targetY = cat.gridY;
                } else { // scatter
                    let tX = this.scatterTarget.gridX; // Use temp vars for clarity
                    let tY = this.scatterTarget.gridY;
                        // If arrived at scatter target, get new one
                        if (this.gridX === tX && this.gridY === tY) {
                            this.scatterTarget = this.getRandomCorner();
                            tX = this.scatterTarget.gridX;
                            tY = this.scatterTarget.gridY;
                        }
                        targetX = tX; // Assign final target
                        targetY = tY;
                }
            }

            // Ensure target is valid before pathfinding
            if (targetX === -1 || targetY === -1) {
                console.warn("Dog AI: Invalid target determined.");
                this.path = []; // Clear path if target invalid
                return;
            }

            // Store the target these coords represent for later checks
            this.pathTargetCoords = { x: targetX, y: targetY };

            // 2. Find Path using A*
            const newPath = findPath(this.gridX, this.gridY, targetX, targetY, maze);

            if (newPath && newPath.length > 0) {
                this.path = newPath.slice(1); // Store path, excluding the current node
                this.isStuck = false;
            } else {
                // No Path Found - Find random nearby target
                console.log(`Dog @ ${this.gridX},${this.gridY} failed path to ${targetX},${targetY}. Trying random.`);
                this.path = []; // Clear existing path

                const randomTarget = this.findRandomNearbyTarget();
                if (randomTarget) {
                    const randomPath = findPath(this.gridX, this.gridY, randomTarget.x, randomTarget.y, maze);
                    if (randomPath && randomPath.length > 0) {
                        this.path = randomPath.slice(1);
                        this.isStuck = false;
                        console.log(` -> Random path to ${randomTarget.x},${randomTarget.y} OK`);
                    } else {
                        console.log(` -> Random path failed.`);
                        this.isStuck = true; // Still couldn't find even a random path
                    }
                } else {
                        this.isStuck = true; // Couldn't find a valid random non-wall target
                }

                if (this.isStuck) {
                    this.dx = 0; // Stop if truly stuck
                    this.dy = 0;
                }
            }
        }

        findRandomNearbyTarget() { /* ... unchanged ... */ const range = 5; const maxTries = 10; for (let i = 0; i < maxTries; i++) { const rdx = Math.floor(Math.random() * (range * 2 + 1)) - range; const rdy = Math.floor(Math.random() * (range * 2 + 1)) - range; if (rdx === 0 && rdy === 0) continue; const tX = this.gridX + rdx; const tY = this.gridY + rdy; if (tY < 0 || tY >= maze.length || tX < 0 || tX >= maze[0].length) continue; const tile = maze[tY]?.[tX]; if (tile !== WALL) return { x: tX, y: tY }; } return null; }
        calculateFleeTarget() { /* ... unchanged ... */ const dx = this.gridX - cat.gridX; const dy = this.gridY - cat.gridY; const fD = 6; let tX = this.gridX + Math.sign(dx) * fD; let tY = this.gridY + Math.sign(dy) * fD; tX = Math.max(0, Math.min(maze[0].length - 1, Math.round(tX))); tY = Math.max(0, Math.min(maze.length - 1, Math.round(tY))); if (maze[tY]?.[tX] === WALL) { const corner = this.getRandomCorner(); return { x: corner.gridX, y: corner.gridY }; } return { x: tX, y: tY }; }
        // *** UPDATED: Add slight randomness to timer interval ***
        startPathRecalculateTimer() { this.clearPathRecalculateTimer(); const interval = this.pathRecalculateInterval + (Math.random() - 0.5) * 500; // +/- 250ms randomness
            this.pathRecalculateTimer = setTimeout(() => { if(this.state !== 'returning' && this.state !== 'respawning') this.recalculatePath(); this.startPathRecalculateTimer(); }, Math.max(500, interval)); // Ensure interval isn't too small
        }
        clearPathRecalculateTimer() { /* ... unchanged ... */ if (this.pathRecalculateTimer) { clearTimeout(this.pathRecalculateTimer); this.pathRecalculateTimer = null; } }
        handleRespawnLogic() { /* ... unchanged ... */ this.dx = 0; this.dy = 0; this.x = this.spawnPoint.gridX * TILE_SIZE; this.y = this.spawnPoint.gridY * TILE_SIZE; this.state = 'respawning'; this.clearPathRecalculateTimer(); this.respawnTimer = setTimeout(() => { this.state = 'normal'; this.emoji = this.baseEmoji; /* USE BASE EMOJI*/ this.speed = dogSpeed; this.respawnTimer = null; this.path = []; this.aiMode = 'scatter'; this.findPathOutOfPound(); this.recalculatePath(); this.startPathRecalculateTimer(); this.switchAiMode(); }, DOG_RESPAWN_DELAY); }
        switchAiMode() { /* ... unchanged ... */ if (this.aiTimer) clearTimeout(this.aiTimer); if (this.state === 'normal') { if (this.aiMode === 'chase') { this.aiMode = 'scatter'; this.scatterTarget = this.getRandomCorner(); this.aiTimer = setTimeout(() => this.switchAiMode(), 5000 + Math.random() * 2000); } else { this.aiMode = 'chase'; this.aiTimer = setTimeout(() => this.switchAiMode(), 15000 + Math.random() * 5000); } } else { this.aiTimer = setTimeout(() => this.switchAiMode(), 3000); } }
        findPoundEntrance() { /* ... unchanged ... */ const sY = this.spawnPoint.gridY; for (let y = sY - 1; y >= 0; y--) { const tile = maze[y]?.[this.spawnPoint.gridX]; if (tile !== WALL && tile !== DOG_SPAWN && tile !== EMPTY_POUND) return { gridX: this.spawnPoint.gridX, gridY: y }; } return this.spawnPoint; }
        findPathOutOfPound() { /* ... unchanged ... */ const entrance = this.findPoundEntrance(); if (entrance && entrance.gridY < this.gridY) { this.dx = 0; this.dy = -1; } else { this.dx = (Math.random() < 0.5 ? -1 : 1); this.dy = 0;} }
        getRandomCorner() { /* ... unchanged ... */ const corners = [ { gridX: 1, gridY: 1 }, { gridX: maze[0].length - 2, gridY: 1 }, { gridX: 1, gridY: maze.length - 2 }, { gridX: maze[0].length - 2, gridY: maze.length - 2 } ]; return corners[Math.floor(Math.random() * corners.length)]; }
        sendToPound() { /* ... unchanged ... */ this.state = 'returning'; this.speed = DOG_RETURN_SPEED; this.emoji = RETURNING_DOG_EMOJI; this.path = []; this.clearPathRecalculateTimer(); this.recalculatePath(); if (this.aiTimer) clearTimeout(this.aiTimer); this.aiTimer = null; if (this.respawnTimer) clearTimeout(this.respawnTimer); this.respawnTimer = null; playSound(300, 'square', 0.2); }
        reset(isLevelStart = false) { /* ... unchanged ... */ super.reset(); this.speed = dogSpeed; /* emoji set by super.reset() */ this.state = 'normal'; this.aiMode = 'scatter'; this.scatterTarget = this.getRandomCorner(); this.path = []; this.isStuck = false; this.clearPathRecalculateTimer(); if (this.aiTimer) clearTimeout(this.aiTimer); this.aiTimer = null; this.pathRecalculateInterval = Math.max(2000, 10000 * Math.pow(0.9, currentLevelIndex)); if (isLevelStart) { setTimeout(() => { if (this.state === 'normal') { this.recalculatePath(); this.startPathRecalculateTimer(); this.switchAiMode(); } }, 500 + Math.random() * 500); } else { this.recalculatePath(); this.startPathRecalculateTimer(); this.switchAiMode(); } }
    }

    // --- Game Initialization ---
    function initGame() { /* ... unchanged ... */ currentLevelIndex = 0; score = 0; lives = STARTING_LIVES; highScore = parseInt(localStorage.getItem('catVsDogsHighScore') || '0'); updateUI(); gameState = 'MENU'; showMenu(); }

    // --- Level Loading ---
    function loadLevel(levelIndex) {
        maze = mazes[levelIndex].map(row => [...row]); canvas.width = maze[0].length * TILE_SIZE; canvas.height = maze.length * TILE_SIZE; ctx.imageSmoothingEnabled = false;
        foodRemaining = 0; dogs = []; let catStartX = 0, catStartY = 0; const dogSpawnPoints = [];
        for (let y = 0; y < maze.length; y++) { for (let x = 0; x < maze[y].length; x++) { if (maze[y][x] === CAT_START) { catStartX = x; catStartY = y; maze[y][x] = PATH; } else if (maze[y][x] === DOG_SPAWN) { dogSpawnPoints.push({ gridX: x, gridY: y }); } else if (maze[y][x] === CAT_FOOD) { foodRemaining++; } } }
        const speedPercentage = 0.25 + (levelIndex * 0.05); dogBaseSpeed = (CAT_BASE_SPEED / 0.7) * speedPercentage; dogSpeed = dogBaseSpeed;
        cat = new Cat(catStartX, catStartY); cat.speed = catSpeed;
        // *** Create dogs with unique indices for emojis ***
        dogs = dogSpawnPoints.map((pos, i) => new Dog(pos.gridX, pos.gridY, dogSpeed, i));
        cat.reset(); dogs.forEach(dog => dog.reset(true));
        powerUpActive = false; if (powerUpTimer) clearTimeout(powerUpTimer); powerUpTimer = null; vulnerableEndTime = 0; currentDogPoints = POINTS_DOG_BASE; updateUI();
    }

    function resetPositionsAfterLifeLost() { /* ... unchanged ... */ cat.reset(); dogs.forEach(dog => dog.reset(false)); if (powerUpActive) { deactivatePowerUp(); } }
    function gameLoop(timestamp) { /* ... unchanged ... */ const delta = timestamp - lastTime; lastTime = timestamp; const dt = Math.min(delta, 50); if (gameState === 'PLAYING' || gameState === 'POWERUP') { update(dt); } if (gameState !== 'MENU') { draw(); } if (gameState !== 'GAME_OVER' && gameState !== 'WIN' && gameState !== 'MENU') { gameLoopId = requestAnimationFrame(gameLoop); } else { if (gameLoopId) cancelAnimationFrame(gameLoopId); gameLoopId = null; if (gameState === 'GAME_OVER' || gameState === 'WIN') { draw(); } } }
    function update(deltaTime) { /* ... unchanged ... */ cat.move(deltaTime); dogs.forEach(dog => dog.move(deltaTime)); checkCollisions(); checkFoodEaten(); checkPowerUpTimer(); if (foodRemaining <= 0) { goToNextLevel(); } }
    
        // --- Drawing Function ---
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000'; // Ensure background is black
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            // Set default font style for the frame (used for most elements)
            const standardFont = `${FONT_SIZE}px Arial`;
            ctx.font = standardFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
    
            // Assume WALL_EMOJI and POWER_UP_EMOJI are defined globally/in scope
            // const WALL_EMOJI = '🧱';
            // const POWER_UP_EMOJI = '🐟';
    
            for (let y = 0; y < maze.length; y++) {
                for (let x = 0; x < maze[y].length; x++) {
                    const tile = maze[y][x];
                    const dX = x * TILE_SIZE + TILE_SIZE / 2; // Center X for text/emoji rendering
                    const dY = y * TILE_SIZE + TILE_SIZE / 2; // Center Y for text/emoji rendering
    
                    if (tile === WALL) {
                        // --- Start Inlined Change ---
                        const originalFont = ctx.font; // Store the current font setting
                        // Attempt to set a font stack prioritizing known emoji fonts
                        ctx.font = `${FONT_SIZE}px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif`;
    
                        // Draw the wall emoji using the (hopefully) overridden font
                        ctx.fillText(WALL_EMOJI, dX, dY);
    
                        // Restore the original font setting for other elements
                        ctx.font = originalFont;
                        // --- End Inlined Change ---
    
                    } else if (tile === CAT_FOOD) {
                        // Draw food as a dot
                        ctx.beginPath();
                        ctx.arc(dX, dY, TILE_SIZE * 0.15, 0, Math.PI * 2);
                        ctx.fillStyle = 'orange';
                        ctx.fill();
                    } else if (tile === POWER_UP) {
                        // Draw power-up emoji (will use the standardFont set before loop)
                        ctx.fillText(POWER_UP_EMOJI, dX, dY);
                    }
                    // Other tile types (PATH, SPAWN, etc.) are not drawn visually here
                }
            }
    
            // Ensure font is standard before drawing entities (might be redundant if reset correctly, but safe)
             ctx.font = standardFont;
    
            // Draw Entities
            dogs.forEach(dog => dog.draw(ctx));
            cat.draw(ctx);
        }

    // --- Collision & Interaction Logic ---
    function checkCollisions() { /* ... unchanged - HS check already moved */ const cX=cat.x+TILE_SIZE/2; const cY=cat.y+TILE_SIZE/2; dogs.forEach(dog=>{ if(dog.state==='returning'||dog.state==='respawning')return; const dX=dog.x+TILE_SIZE/2; const dY=dog.y+TILE_SIZE/2; const dx=cX-dX; const dy=cY-dY; const dist=Math.sqrt(dx*dx+dy*dy); const th=TILE_SIZE*0.65; if(dist<th){ if(dog.state==='vulnerable'){ score+=currentDogPoints; if(score>highScore)updateHighScore(); dog.sendToPound(); currentDogPoints*=2; updateUI();} else if(dog.state==='normal'){ if(gameState!=='CAUGHT'){ gameState='CAUGHT'; handleCaught();}} } }); }
    function checkFoodEaten() { /* ... unchanged - HS check already moved */ const gX=Math.floor((cat.x+TILE_SIZE/2)/TILE_SIZE); const gY=Math.floor((cat.y+TILE_SIZE/2)/TILE_SIZE); if(gX<0||gX>=maze[0].length||gY<0||gY>=maze.length)return; const tile=maze[gY][gX]; if(tile===CAT_FOOD){ maze[gY][gX]=PATH; foodRemaining--; score+=POINTS_FOOD; if(score>highScore)updateHighScore(); playSound(880+(foodRemaining%5)*50,'square',0.05); updateUI();} else if(tile===POWER_UP){ maze[gY][gX]=PATH; score+=POINTS_POWERUP; if(score>highScore)updateHighScore(); activatePowerUp(); updateUI();} }
    function activatePowerUp() { /* ... unchanged ... */ playSound(1200,'triangle',0.2); powerUpActive=true; if(gameState==='PLAYING')gameState='POWERUP'; currentDogPoints=POINTS_DOG_BASE; vulnerableEndTime=Date.now()+POWER_UP_DURATION; dogs.forEach(dog=>{ if(dog.state==='normal'){ dog.state='vulnerable'; dog.speed=dogBaseSpeed*0.6; if(dog.dx!==0||dog.dy!==0){ dog.dx=-dog.dx; dog.dy=-dog.dy; } if(dog.aiTimer)clearTimeout(dog.aiTimer); dog.aiTimer=null; dog.path=[]; dog.clearPathRecalculateTimer(); dog.recalculatePath(); dog.startPathRecalculateTimer(); } }); if(powerUpTimer)clearTimeout(powerUpTimer); powerUpTimer=setTimeout(deactivatePowerUp,POWER_UP_DURATION); }
    function deactivatePowerUp() { /* ... unchanged ... */ powerUpActive=false; if(gameState==='POWERUP')gameState='PLAYING'; vulnerableEndTime=0; if(powerUpTimer)clearTimeout(powerUpTimer); powerUpTimer=null; dogs.forEach(dog=>{ if(dog.state==='vulnerable'){ dog.state='normal'; dog.emoji=dog.baseEmoji; /* USE BASE EMOJI */ dog.speed=dogSpeed; dog.path=[]; dog.clearPathRecalculateTimer(); dog.recalculatePath(); dog.startPathRecalculateTimer(); dog.switchAiMode(); } }); }
    function checkPowerUpTimer() { /* ... unchanged ... */ if(powerUpActive&&Date.now()>=vulnerableEndTime){ deactivatePowerUp(); }}
    function handleCaught() { /* ... unchanged ... */ playSound(220,'sawtooth',0.3); lives--; updateUI(); if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=null; if(lives<=0){ gameOver();} else { setTimeout(()=>{ resetPositionsAfterLifeLost(); gameState='PLAYING'; lastTime=performance.now(); gameLoopId=requestAnimationFrame(gameLoop); },1000);} }
    function goToNextLevel() { /* ... unchanged ... */ playSound(1000,'sine',0.1); setTimeout(()=>playSound(1300,'sine',0.15),120); currentLevelIndex++; if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=null; if(currentLevelIndex>=MAX_LEVELS){ winGame();} else { gameState='LEVEL_TRANSITION'; transitionLevelDisplay.textContent=currentLevelIndex+1; levelTransitionOverlay.style.display='flex'; draw(); setTimeout(()=>{ levelTransitionOverlay.style.display='none'; loadLevel(currentLevelIndex); gameState='PLAYING'; lastTime=performance.now(); gameLoopId=requestAnimationFrame(gameLoop); },LEVEL_TRANSITION_DELAY);} }

    // --- UI Updates & State Management ---
    function updateHighScore() { /* ... unchanged ... */ highScore=score; localStorage.setItem('catVsDogsHighScore',highScore.toString()); highScoreDisplay.textContent=highScore; menuHighScoreDisplay.textContent=highScore; highScoreGameOverDisplay.textContent=highScore; highScoreWinDisplay.textContent=highScore; playSound(1600,'sine',0.15); }
    function gameOver() { /* ... unchanged ... */ playSound(200,'sawtooth',0.5); gameState='GAME_OVER'; if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=null; exitButton.style.display='none'; /* Already called updateHighScore if needed */ finalScoreGameOverDisplay.textContent=score; gameOverOverlay.style.display='flex'; draw(); }
    function winGame() { /* ... unchanged ... */ playSound(1400,'triangle',0.2); setTimeout(()=>playSound(1800,'triangle',0.3),250); gameState='WIN'; if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=null; exitButton.style.display='none'; /* Already called updateHighScore if needed */ finalScoreWinDisplay.textContent=score; winScreenOverlay.style.display='flex'; draw(); }
    function updateUI() { /* ... unchanged ... */ levelDisplay.textContent=currentLevelIndex+1; scoreDisplay.textContent=score; highScoreDisplay.textContent=highScore; livesDisplay.textContent=LIFE_EMOJI.repeat(Math.max(0,lives)); }
    function showMenu() { /* ... unchanged ... */ gameState='MENU'; if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=null; exitButton.style.display='none'; highScore=parseInt(localStorage.getItem('catVsDogsHighScore')||'0'); menuHighScoreDisplay.textContent=highScore; soundToggle.checked=isSoundEnabled; /* Update checkbox */ menuOverlay.style.display='flex'; gameOverOverlay.style.display='none'; winScreenOverlay.style.display='none'; levelTransitionOverlay.style.display='none'; const tW=19*TILE_SIZE; const tH=17*TILE_SIZE; canvas.width=tW; canvas.height=tH; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='black'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.font=`${Math.floor(TILE_SIZE*1.5)}px 'Courier New', Courier, monospace`; ctx.fillStyle='orange'; ctx.textAlign='center'; ctx.fillText('Cat vs Dogs!',canvas.width/2,canvas.height/3); ctx.font=`${Math.floor(TILE_SIZE*0.8)}px 'Courier New', Courier, monospace`; ctx.fillStyle='white'; ctx.fillText('Press Start or Enter',canvas.width/2,canvas.height/2); ctx.fillText(`High Score: ${highScore}`,canvas.width/2,canvas.height*0.65); }
    function startGame() { /* ... unchanged ... */ if(!audioCtx){ try{ audioCtx=new(window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended')audioCtx.resume(); } catch(e){ console.error("Web Audio API not supported",e); }} else if(audioCtx.state==='suspended')audioCtx.resume(); playSound(660,'sine',0.1); menuOverlay.style.display='none'; gameOverOverlay.style.display='none'; winScreenOverlay.style.display='none'; exitButton.style.display='inline-block'; currentLevelIndex=0; score=0; lives=STARTING_LIVES; loadLevel(currentLevelIndex); /* highScore updated on load/score */ updateUI(); gameState='PLAYING'; setTimeout(()=>{ lastTime=performance.now(); if(gameLoopId)cancelAnimationFrame(gameLoopId); gameLoopId=requestAnimationFrame(gameLoop); },100); }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButtonGameOver.addEventListener('click', showMenu);
    playAgainButton.addEventListener('click', showMenu);
    exitButton.addEventListener('click', () => { playSound(440, 'sine', 0.08); showMenu(); });
    // *** Sound Toggle Listener ***
    soundToggle.addEventListener('change', () => {
        isSoundEnabled = soundToggle.checked;
        localStorage.setItem('catVsDogsSoundEnabled', isSoundEnabled);
        // Optional: Play a small sound to confirm change
        playSound(isSoundEnabled ? 880 : 440, 'sine', 0.05);
    });
    window.addEventListener('keydown', (e) => { /* ... unchanged ... */ if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault(); if(gameState==='PLAYING'||gameState==='POWERUP'){ cat.handleInput(e.key); } else if(gameState==='MENU'&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); startGame(); } else if((gameState==='GAME_OVER'||gameState==='WIN')&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); showMenu(); } });

    // --- Initial Call ---
    initGame();
});