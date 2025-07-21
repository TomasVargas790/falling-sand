/**
 * Centralized State Manager for the Falling Sand simulation
 * This class manages all application state and provides methods to update it safely
 */
export class GameState {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        
        // Canvas state (the sand grid)
        this.canvasState = this.generateCanvasState(cols, rows);
        
        // UI options state
        this.options = {
            color: undefined,
            gravity: 1,
            isDrawing: false,
            brush: 1,
            actualColor: '#FFF'
        };
        
        // Canvas properties (will be set by canvas module)
        this.canvas = {
            element: null,
            ctx: null,
            cellSize: 0
        };
        
        // Subscribers for state changes
        this.subscribers = {
            optionsChange: [],
            canvasStateChange: []
        };
    }
    
    generateCanvasState(cols, rows) {
        return Array.from({ length: rows }, () => Array(cols).fill(0));
    }
    
    // Options management
    updateOption(key, value) {
        this.options[key] = value;
        this.notifySubscribers('optionsChange', { key, value });
    }
    
    getOption(key) {
        return this.options[key];
    }
    
    // Canvas state management
    updateCanvasState(newState) {
        this.canvasState = newState;
        this.notifySubscribers('canvasStateChange', newState);
    }
    
    getCanvasState() {
        return this.canvasState;
    }
    
    // Set a specific cell in the canvas
    setCell(row, col, value) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.canvasState[row][col] = value;
        }
    }
    
    getCell(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.canvasState[row][col];
        }
        return undefined;
    }
    
    // Canvas properties
    setCanvasProperties(element, ctx, cellSize) {
        this.canvas = { element, ctx, cellSize };
    }
    
    getCanvasProperties() {
        return this.canvas;
    }
    
    // Subscribe to state changes
    subscribe(event, callback) {
        if (this.subscribers[event]) {
            this.subscribers[event].push(callback);
        }
    }
    
    // Notify subscribers of state changes
    notifySubscribers(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => callback(data));
        }
    }
    
    // Reset canvas state
    reset() {
        this.canvasState = this.generateCanvasState(this.cols, this.rows);
        this.notifySubscribers('canvasStateChange', this.canvasState);
    }
}