import { drawCells, setXY, drawGrid, getXY, withinCanvas } from "./canvas.js";
import { onPointerDown, onPointerMove } from "./handlers.js";
import { adjustNumeric } from "./utils.js";

export function getNewState(canvasState, gravity) {
    if (gravity === 0) return [...canvasState]

    const newState = Array.from({ length: canvasState.length }, () => Array(canvasState[0].length).fill(0));

    const gravityDirection = (gravity / Math.abs(gravity))

    for (let r = 0; r < canvasState.length; r++) {
        for (let c = 0; c < canvasState[r].length; c++) {
            const actual = canvasState[r][c]

            if (actual === 0) continue

            if ((r === ROWS - 1 && gravityDirection === 1) || (r === 0 && gravityDirection === -1)) {
                newState[r][c] = actual;
                continue;
            }


            const next = r + (1 * gravityDirection)

            const below = canvasState[next][c]

            let direction = 1
            if (Math.random() < 0.5) {
                direction *= -1
            }

            let belowA = -1;
            let belowB = -1;

            if (withinCols(c + direction)) {
                belowA = canvasState[next][c + direction]
            }
            if (withinCols(c - direction)) {
                belowB = canvasState[next][c - direction]
            }

            if (below === 0) {
                newState[next][c] = actual
            } else if (belowA === 0) {
                newState[next][c + direction] = actual
            } else if (belowB === 0) {
                newState[next][c - direction] = actual
            } else {
                newState[r][c] = actual
            }
        }
    }

    return newState
}

//Canvas
export const setWithinCanvas = (canvas) => (x, y) => withinCanvas(canvas, x, y);
export const setGetXY = (canvas) => (e) => getXY(canvas, e);

export const setDrawCells = (ctx, cell) => (canvasState) => { drawCells(ctx, cell, canvasState) }
export const setSetXY = (canvasState, cell) => (x, y) => setXY(canvasState, cell, x, y)
export const setDrawGrid = (drawLine, cell) => (cols, rows) => drawGrid(drawLine, cell, cols, rows)
export const setDrawLine = (ctx) => (x1, y1, x2, y2) => drawLine(ctx, x1, y1, x2, y2)

//handler
export const setPointerMove = (getXY, setXY, withinCanvas) => (e, optionsState) => onPointerMove(withinCanvas, getXY, setXY, e, optionsState)
export const setPointerDown = (canvas, withinCanvas, getXY, setXY,) => (e) => onPointerDown(canvas, withinCanvas, getXY, setXY, e)