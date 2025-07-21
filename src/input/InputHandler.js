import { MAIN_MOUSE_BUTTON } from '../config/constants.js';
import { randomColor } from '../utils/utils.js';

/**
 * InputHandler module - manages all user input interactions
 */
export class InputHandler {
    constructor(gameState, canvasManager) {
        this.gameState = gameState;
        this.canvasManager = canvasManager;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const canvas = this.gameState.getCanvasProperties().element;
        
        // Canvas pointer events
        canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
        canvas.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
        canvas.addEventListener('pointerup', () => this.onPointerUp());
        canvas.addEventListener('pointercancel', () => this.onPointerCancel());
        
        // UI control events
        this.setupUIControls();
    }
    
    setupUIControls() {
        const colorInput = document.getElementById('color');
        const brushInput = document.getElementById('brush');
        const gravityInput = document.getElementById('gravity');
        const buttons = document.querySelectorAll('button');
        
        colorInput?.addEventListener('change', (e) => {
            this.gameState.updateOption('color', e.target.value);
        });
        
        brushInput?.addEventListener('change', (e) => {
            this.gameState.updateOption('brush', +e.target.value);
        });
        
        gravityInput?.addEventListener('change', (e) => {
            this.gameState.updateOption('gravity', +e.target.value);
        });
        
        buttons.forEach(btn => {
            const { type, input } = btn.dataset;
            if (type && input) {
                btn.addEventListener('click', () => this.adjustNumeric(type, input));
            }
        });
    }
    
    onPointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== MAIN_MOUSE_BUTTON) return;
        
        const coordinates = this.canvasManager.getCanvasCoordinates(event);
        if (!this.canvasManager.isWithinCanvas(coordinates.x, coordinates.y)) return;
        
        // Set actual color for drawing
        const color = this.gameState.getOption('color');
        const actualColor = color || randomColor();
        this.gameState.updateOption('actualColor', actualColor);
        
        // Place sand at pointer position
        this.placeSand(coordinates.x, coordinates.y);
        this.gameState.updateOption('isDrawing', true);
        
        // Capture pointer for mobile devices
        const canvas = this.gameState.getCanvasProperties().element;
        if (canvas.setPointerCapture) {
            canvas.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
    }
    
    onPointerMove(event) {
        if (!this.gameState.getOption('isDrawing')) return;
        
        const coordinates = this.canvasManager.getCanvasCoordinates(event);
        if (this.canvasManager.isWithinCanvas(coordinates.x, coordinates.y)) {
            this.placeSand(coordinates.x, coordinates.y);
        }
    }
    
    onPointerUp() {
        this.gameState.updateOption('isDrawing', false);
    }
    
    onPointerCancel() {
        this.gameState.updateOption('isDrawing', false);
    }
    
    placeSand(x, y) {
        const { col, row } = this.canvasManager.getCellFromCoordinates(x, y);
        const brush = this.gameState.getOption('brush');
        const actualColor = this.gameState.getOption('actualColor');
        
        // Place sand at main position
        if (this.gameState.getCell(row, col) === 0) {
            this.gameState.setCell(row, col, actualColor);
        }
        
        // Place additional sand based on brush size
        for (let i = 1; i < brush; i++) {
            const randomRow = row + (Math.random() > 0.5 ? -i : i);
            const randomCol = col + (Math.random() > 0.5 ? -i : i);
            
            if (this.gameState.getCell(randomRow, randomCol) === 0) {
                this.gameState.setCell(randomRow, randomCol, actualColor);
            }
        }
    }
    
    adjustNumeric(action, inputId) {
        const element = document.getElementById(inputId);
        if (!element) return;
        
        const step = inputId === 'gravity' ? 0.25 : 1;
        let value = +element.value + (action === 'add' ? step : -step);
        value = Math.max(+element.min, Math.min(+element.max, value));
        
        element.value = value;
        this.gameState.updateOption(inputId, value);
    }
}