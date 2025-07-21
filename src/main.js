/**
 * Main application entry point
 * Coordinates all modules and initializes the falling sand simulation
 */

import { GameState } from './state/GameState.js';
import { CanvasManager } from './core/Canvas.js';
import { Renderer } from './rendering/Renderer.js';
import { Physics } from './physics/Physics.js';
import { InputHandler } from './input/InputHandler.js';
import { GameLoop } from './core/GameLoop.js';

/**
 * Application class - main coordinator
 */
class FallingSandApp {
    constructor() {
        this.gameState = null;
        this.canvasManager = null;
        this.renderer = null;
        this.physics = null;
        this.inputHandler = null;
        this.gameLoop = null;
    }
    
    async init() {
        try {
            // Get canvas element
            const canvas = document.getElementById('canvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }
            
            // Initialize game state with initial dimensions
            this.gameState = new GameState(100, 100); // Will be updated by canvas setup
            
            // Initialize canvas manager
            this.canvasManager = new CanvasManager(canvas, this.gameState);
            
            // Initialize renderer
            this.renderer = new Renderer(this.gameState);
            
            // Initialize physics
            this.physics = new Physics(this.gameState);
            
            // Initialize input handler
            this.inputHandler = new InputHandler(this.gameState, this.canvasManager);
            
            // Initialize game loop
            this.gameLoop = new GameLoop(this.gameState, this.physics, this.renderer);
            
            // Set initial color
            const colorInput = document.getElementById('color');
            if (colorInput && colorInput.value) {
                this.gameState.updateOption('color', colorInput.value);
            }
            
            // Start the game loop
            this.gameLoop.start();
            
            console.log('Falling Sand App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Falling Sand App:', error);
        }
    }
    
    destroy() {
        if (this.gameLoop) {
            this.gameLoop.stop();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FallingSandApp();
    app.init();
    
    // Store app instance globally for debugging
    window.fallingSandApp = app;
});