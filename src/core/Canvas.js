/**
 * Canvas module - handles canvas setup and basic canvas operations
 */
export class CanvasManager {
    constructor(canvasElement, gameState) {
        this.canvas = canvasElement;
        this.gameState = gameState;
        this.setupCanvas();
    }
    
    setupCanvas() {
        /* -----------------------------------------------------------
         *  Ajusta solo estos dos valores:
         * ----------------------------------------------------------- */
        const TARGET_CELLS = 8_000;     // densidad global (~100×100 celdas)
        const MIN_CELL_PX = 3;          // para que nunca quede microscópico

        /* -----------------------------------------------------------
         *  1) Dimensiones físicas del canvas
         * ----------------------------------------------------------- */
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;

        /* -----------------------------------------------------------
         *  2) Tamaño de celda derivado del área
         * ----------------------------------------------------------- */
        let cellSize = Math.floor(Math.sqrt((w * h) / TARGET_CELLS));

        if (cellSize < MIN_CELL_PX) cellSize = MIN_CELL_PX;   // único clamp

        /* -----------------------------------------------------------
         *  3) Columnas, filas y ajuste perfecto del lienzo
         * ----------------------------------------------------------- */
        const cols = Math.floor(w / cellSize);
        const rows = Math.floor(h / cellSize);

        this.canvas.width = cols * cellSize;   // encaja sin bordes "sobrantes"
        this.canvas.height = rows * cellSize;

        /* ──────────────────────── CONTEXT & STATE ─────────────── */
        const ctx = this.canvas.getContext('2d');
        ctx.lineWidth = 1;
        ctx.translate(0.5, 0.5);
        
        // Update game state with canvas properties
        this.gameState.cols = cols;
        this.gameState.rows = rows;
        this.gameState.canvasState = this.gameState.generateCanvasState(cols, rows);
        this.gameState.setCanvasProperties(this.canvas, ctx, cellSize);
        
        return { cellSize, cols, rows, ctx };
    }
    
    getCanvasCoordinates(event) {
        if (event.pointerType === "mouse") {
            return { x: event.offsetX, y: event.offsetY };
        }
        const rect = this.canvas.getBoundingClientRect();
        return { 
            x: event.clientX - rect.left, 
            y: event.clientY - rect.top 
        };
    }
    
    isWithinCanvas(x, y) {
        return x >= 0 && y >= 0 && x < this.canvas.width && y < this.canvas.height;
    }
    
    getCellFromCoordinates(x, y) {
        const { cellSize } = this.gameState.getCanvasProperties();
        return {
            col: Math.floor(x / cellSize),
            row: Math.floor(y / cellSize)
        };
    }
}