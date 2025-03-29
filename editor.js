document.addEventListener('DOMContentLoaded', () => {
    // --- Preloaded Maze Data ---
    const PRELOADED_MAZES = [
        // Level 1
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1],
            [1,1,1,1,2,1,1,1,6,0,6,1,1,1,2,1,1,1,1],
            [0,0,0,1,2,1,6,5,0,0,0,5,6,1,2,1,0,0,0],
            [1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,1,2,2,2,2,2,4,2,2,2,2,2,1,2,2,1],
            [1,2,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,2,1],
            [1,2,1,1,1,1,2,2,2,1,2,2,2,1,1,1,1,2,1],
            [1,3,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
         // Level 2 - Add more mazes here... copy/paste/modify the structure
        [ // Slightly more complex
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
         // Level 3, 4, 5 - DEFINE MORE UNIQUE MAZES HERE! Using copies for now.
         [ // Level 3 - Copy of 2
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
        [ // Level 4 - Copy of 2
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,4,2,2,2,1,1,2,2,2,2,2,1,1,1,2,2,3,1],
            [1,2,1,1,2,1,1,2,1,1,1,2,1,1,1,2,2,2,1],
            [1,2,1,3,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,2,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,6,5,5,5,1,2,2,2,2,2,2,1],
            [2,2,2,1,1,1,2,6,5,5,6,1,3,1,1,1,1,2,2],
            [1,2,2,2,2,2,2,1,2,1,2,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
         [ // Level 5 - Copy of 2
            [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1],
            [1,2,1,2,2,2,2,2,2,2,1,2,1,2,1,2,2,2,1],
            [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1],
            [1,2,2,2,1,2,2,2,1,2,2,2,1,2,1,2,2,2,1],
            [1,2,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1,2,1],
            [1,2,1,2,1,2,2,6,5,5,5,6,2,2,1,2,1,2,1],
            [2,2,1,2,1,2,2,6,5,5,5,6,2,2,1,2,1,2,2],
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

    // --- Configuration ---
    const TILE_TYPES = {
        0: { name: 'Path', emoji: '', cssClass: 'path' }, // Maybe '·'
        1: { name: 'Wall', emoji: '🧱', cssClass: 'wall' },
        2: { name: 'Food', emoji: '🐾', cssClass: 'food' },
        3: { name: 'Power', emoji: '🐟', cssClass: 'powerup' },
        4: { name: 'Cat', emoji: '🐈', cssClass: 'cat-start' },
        5: { name: 'Dog', emoji: '🐕', cssClass: 'dog-spawn' },
        6: { name: 'Pound', emoji: '🦴', cssClass: 'pound-area' }
    };
    // Default dimensions are now less critical, determined by loaded map
    // const DEFAULT_ROWS = 17;
    // const DEFAULT_COLS = 19;

    // --- State ---
    let gridData = []; // 2D array holding the map data
    let selectedTileType = 0; // Default to Path
    let currentRows = 0;
    let currentCol = 0;

    // --- DOM Elements ---
    const paletteContainer = document.getElementById('palette');
    const gridContainer = document.getElementById('grid-container');
    const mapSelect = document.getElementById('map-select'); // New selector
    const exportBtn = document.getElementById('export-btn');
    const clearBtn = document.getElementById('clear-btn');
    const dataIoTextarea = document.getElementById('data-io');

    // --- Functions ---

    /**
     * Populates the map selection dropdown.
     */
    function populateMapSelector() {
        mapSelect.innerHTML = ''; // Clear existing options
        PRELOADED_MAZES.forEach((maze, index) => {
            const option = document.createElement('option');
            option.value = index; // Store the index
            option.textContent = `Level ${index + 1}`;
            mapSelect.appendChild(option);
        });
    }

    /**
     * Handles the selection change in the map dropdown.
     * @param {Event} event - The change event.
     */
    function handleMapSelect(event) {
        const selectedIndex = parseInt(event.target.value, 10);
        if (selectedIndex >= 0 && selectedIndex < PRELOADED_MAZES.length) {
            const selectedMazeData = PRELOADED_MAZES[selectedIndex];
            // Deep copy the array to prevent modifying the original preload data
            const mazeCopy = JSON.parse(JSON.stringify(selectedMazeData));
            loadMapData(mazeCopy);
             dataIoTextarea.value = ''; // Clear output area when loading new map
             dataIoTextarea.readOnly = true; // Ensure it's readonly after loading
        } else {
             console.error("Invalid map index selected:", selectedIndex);
             // Optionally clear grid or show an error
             clearGrid();
        }
    }

     /**
      * Loads the provided map data into the editor.
      * @param {Array<Array<number>>} mapData - The 2D array representing the map.
      */
    function loadMapData(mapData) {
        if (!mapData || !Array.isArray(mapData) || mapData.length === 0 || !Array.isArray(mapData[0])) {
            console.error("Invalid map data provided to loadMapData.");
            alert("Failed to load map data. Structure is invalid.");
            clearGrid(); // Reset to empty state
            return;
        }

        const newRows = mapData.length;
        const newCols = mapData[0].length; // Assume consistent columns based on first row

        // Optional: Basic validation of content (can be more thorough)
        let isValid = true;
        for(let r=0; r<newRows; ++r) {
            if (!Array.isArray(mapData[r]) || mapData[r].length !== newCols) {
                console.error(`Map data row ${r} has incorrect length.`);
                isValid = false; break;
            }
             for (let c = 0; c < newCols; c++) {
                 if (typeof mapData[r][c] !== 'number' || !TILE_TYPES.hasOwnProperty(mapData[r][c])) {
                     console.error(`Invalid tile code at [${r},${c}]: ${mapData[r][c]}`);
                     isValid = false; break;
                 }
             }
             if (!isValid) break;
        }

        if (isValid) {
            createGrid(newRows, newCols, mapData); // Create grid using the loaded data
             console.log(`Loaded map with ${newRows} rows and ${newCols} columns.`);
        } else {
            alert("Loaded map data contains invalid structure or tile codes. Please check the preloaded data.");
            clearGrid(); // Reset on error
        }
    }


    /**
     * Creates the palette items dynamically. (No changes needed)
     */
    function createPalette() {
        paletteContainer.innerHTML = '';
        Object.entries(TILE_TYPES).forEach(([typeCode, typeInfo]) => {
            const item = document.createElement('div');
            item.classList.add('palette-item');
            item.dataset.tileType = typeCode;
            item.innerHTML = `${typeInfo.emoji || typeInfo.name} <span>${typeInfo.name}</span>`;
            item.title = `${typeInfo.name} (${typeCode})`;
            if (parseInt(typeCode) === selectedTileType) {
                item.classList.add('selected');
            }
            item.addEventListener('click', handlePaletteClick);
            paletteContainer.appendChild(item);
        });
    }

    /**
     * Handles clicks on palette items to select the tile type. (No changes needed)
     */
    function handlePaletteClick(event) {
        const targetItem = event.currentTarget;
        selectedTileType = parseInt(targetItem.dataset.tileType);
        document.querySelectorAll('.palette-item').forEach(item => {
            item.classList.remove('selected');
        });
        targetItem.classList.add('selected');
    }

    /**
     * Creates the grid cells in the DOM based on dimensions and optional initial data.
     * Stores the data in the global `gridData`.
     * @param {number} rows - Number of rows.
     * @param {number} cols - Number of columns.
     * @param {Array<Array<number>>} [initialData=null] - Data to populate the grid.
     */
    function createGrid(rows, cols, initialData = null) {
        currentRows = rows;
        currentCol = cols;
        gridContainer.innerHTML = ''; // Clear existing grid
        gridData = []; // Reset internal data representation

        if (rows === 0 || cols === 0) {
             gridContainer.style.gridTemplateColumns = '';
             gridContainer.style.gridTemplateRows = '';
             console.log("Grid cleared or dimensions are zero.");
             return; // Don't create cells if dimensions are zero
        }


        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;

        for (let r = 0; r < rows; r++) {
            const rowData = [];
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const initialType = (initialData && initialData[r] && initialData[r][c] !== undefined)
                                    ? initialData[r][c]
                                    : 0; // Default to Path if no initial data for this cell

                rowData.push(initialType);
                cell.textContent = TILE_TYPES[initialType]?.emoji || '';
                cell.dataset.tile = initialType;

                cell.addEventListener('click', handleGridClick);
                gridContainer.appendChild(cell);
            }
            gridData.push(rowData); // Add the created row data to the main gridData
        }
    }

    /**
     * Handles clicks on grid cells to "paint" the selected tile. (No changes needed)
     */
    function handleGridClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Ensure row/col are valid before updating
        if (gridData[row] && gridData[row][col] !== undefined) {
            gridData[row][col] = selectedTileType;
            cell.textContent = TILE_TYPES[selectedTileType]?.emoji || '';
            cell.dataset.tile = selectedTileType;
        } else {
            console.warn(`Invalid cell click target: row ${row}, col ${col}`);
        }
    }

    /**
     * Exports the current gridData to the textarea in the required format. (No changes needed from last working version)
     */
    function exportData() {
        if (!gridData || gridData.length === 0 || gridData[0].length === 0) {
            alert("Grid is empty or invalid. Cannot export.");
            dataIoTextarea.value = ''; // Clear textarea
            dataIoTextarea.readOnly = true;
            return;
        }

        const rowsStr = gridData.map(row => {
            return `            [${row.join(',')}]`; // 12 spaces indent
        });

        const outputString = rowsStr.join(',\n');

        dataIoTextarea.value = outputString; // Set value
        dataIoTextarea.readOnly = false; // Make it selectable/copyable
        // dataIoTextarea.select(); // Optional: auto-select the text
        alert("Grid data formatted for game.js exported to the text area. Ready to copy!");
    }

    /**
     * Clears the grid back to an empty state (0 rows, 0 cols).
     */
    function clearGrid() {
        // Recreate the grid with 0 dimensions, effectively clearing it
        createGrid(0, 0); // createGrid handles setting gridData to []
        dataIoTextarea.value = ''; // Clear output area
        dataIoTextarea.readOnly = true;
        // Optionally reset map selector? Or leave it as is? Leaving it for now.
        alert("Grid cleared.");
    }

    // --- Initialization ---
    function init() {
        createPalette();
        populateMapSelector();

        // Load the first map by default
        if (PRELOADED_MAZES.length > 0) {
            const firstMazeCopy = JSON.parse(JSON.stringify(PRELOADED_MAZES[0]));
            loadMapData(firstMazeCopy); // Load the first map's data
        } else {
            createGrid(0, 0); // Start with empty grid if no preloads
        }


        // Attach event listeners
        mapSelect.addEventListener('change', handleMapSelect);
        exportBtn.addEventListener('click', exportData);
        clearBtn.addEventListener('click', clearGrid);

        // Select Path (0) by default visually
        const defaultPaletteItem = paletteContainer.querySelector('[data-tile-type="0"]');
        if (defaultPaletteItem) defaultPaletteItem.classList.add('selected');

         // Ensure textarea is readonly initially
         dataIoTextarea.readOnly = true;
    }

    init(); // Run initialization
});