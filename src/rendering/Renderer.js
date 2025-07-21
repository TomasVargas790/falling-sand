/**
 * Renderer module - handles all drawing operations
 */
export class Renderer {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    clear() {
        const { ctx, element } = this.gameState.getCanvasProperties();
        ctx.clearRect(0, 0, element.width, element.height);
    }
    
    drawGrid() {
        const { ctx, cellSize } = this.gameState.getCanvasProperties();
        const { cols, rows } = this.gameState;
        
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        
        // Draw horizontal lines
        for (let r = 0; r <= rows; r++) {
            const y = r * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(cols * cellSize, y);
            ctx.stroke();
        }
        
        // Draw vertical lines
        for (let c = 0; c <= cols; c++) {
            const x = c * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, rows * cellSize);
            ctx.stroke();
        }
    }
    
    drawCells() {
        const { ctx, cellSize } = this.gameState.getCanvasProperties();
        const canvasState = this.gameState.getCanvasState();
        
        for (let r = 0; r < canvasState.length; r++) {
            for (let c = 0; c < canvasState[r].length; c++) {
                const cellValue = canvasState[r][c];
                if (cellValue !== 0) {
                    const x = c * cellSize;
                    const y = r * cellSize;
                    ctx.fillStyle = cellValue;
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
    }
    
    drawLine(x1, y1, x2, y2) {
        const { ctx } = this.gameState.getCanvasProperties();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    render() {
        this.clear();
        this.drawGrid();
        this.drawCells();
    }
}