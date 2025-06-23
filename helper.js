import { CELL } from "./config.js";
import { COLS, ctx, ROWS } from "./index.js";

export const withinCols = (c) => c >= 0 && c < COLS

export function randomColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

export function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


export function drawGrid(cols, rows) {
    for (let r = 0; r < rows; r++) drawLine(0, r * CELL, canvas.width, r * CELL);
    for (let c = 0; c < cols; c++) drawLine(c * CELL, 0, c * CELL, canvas.height);
}

export function drawCells(state) {
    for (let r = 0; r < state.length; r++) {
        for (let c = 0; c < state[r].length; c++) {
            const actual = state[r][c]
            if (actual !== 0) {
                const x = c * CELL;
                const y = r * CELL;
                ctx.fillStyle = actual
                ctx.fillRect(x, y, CELL, CELL);
            }
        }
    }
}

export function getNewState(state) {
    const newState = Array.from({ length: state.length }, () => Array(state[0].length).fill(0));

    for (let r = 0; r < state.length; r++) {
        for (let c = 0; c < state[r].length; c++) {
            const actual = state[r][c]

            if (actual === 0) continue

            if (r === ROWS - 1) {
                newState[r][c] = actual;
                continue;
            }

            const below = state[r + 1][c]

            let direction = 1
            if (Math.random() < 0.5) {
                direction *= -1
            }

            let belowA = -1;
            let belowB = -1;

            if (withinCols(c + direction)) {
                belowA = state[r + 1][c + direction]
            }
            if (withinCols(c - direction)) {
                belowB = state[r + 1][c - direction]
            }

            if (below === 0) {
                newState[r + 1][c] = actual
            } else if (belowA === 0) {
                newState[r + 1][c + direction] = actual
            } else if (belowB === 0) {
                newState[r + 1][c - direction] = actual
            } else {
                newState[r][c] = actual
            }
        }
    }

    return newState
}