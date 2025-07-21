/**
 * Physics module - handles the falling sand simulation
 */
export class Physics {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    withinCols(col) {
        return col >= 0 && col < this.gameState.cols;
    }
    
    update() {
        const gravity = this.gameState.getOption('gravity');
        const currentState = this.gameState.getCanvasState();
        
        if (gravity === 0) {
            return; // No physics update needed
        }
        
        const { rows, cols } = this.gameState;
        const newState = Array.from({ length: rows }, () => Array(cols).fill(0));
        const gravityDirection = gravity / Math.abs(gravity);
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const currentCell = currentState[r][c];
                
                if (currentCell === 0) continue;
                
                // Check if we're at the boundary
                if ((r === rows - 1 && gravityDirection === 1) || (r === 0 && gravityDirection === -1)) {
                    newState[r][c] = currentCell;
                    continue;
                }
                
                const nextRow = r + (1 * gravityDirection);
                const below = currentState[nextRow][c];
                
                // Random direction for lateral movement
                let direction = Math.random() < 0.5 ? -1 : 1;
                
                let belowLeft = -1;
                let belowRight = -1;
                
                if (this.withinCols(c + direction)) {
                    belowLeft = currentState[nextRow][c + direction];
                }
                if (this.withinCols(c - direction)) {
                    belowRight = currentState[nextRow][c - direction];
                }
                
                // Apply falling sand physics
                if (below === 0) {
                    // Fall straight down
                    newState[nextRow][c] = currentCell;
                } else if (belowLeft === 0) {
                    // Fall diagonally left
                    newState[nextRow][c + direction] = currentCell;
                } else if (belowRight === 0) {
                    // Fall diagonally right
                    newState[nextRow][c - direction] = currentCell;
                } else {
                    // Can't fall, stay in place
                    newState[r][c] = currentCell;
                }
            }
        }
        
        this.gameState.updateCanvasState(newState);
    }
}