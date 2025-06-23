import { CELL, FPS, MAIN_MOUSE_BUTTON } from "./config.js";
import { randomColor, drawCells, getNewState } from "./helper.js";

const isWithinCanvas = (evt) => (evt.offsetX < canvas.width && evt.offsetX >= 0) && (evt.offsetY < canvas.height && evt.offsetY >= 0)

export const canvas = document.getElementById('canvas');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

export const COLS = Math.floor(canvas.width / CELL);
export const ROWS = Math.floor(canvas.height / CELL);

canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;

export const ctx = canvas.getContext('2d');

let actualColor = "FFF"
let isDrawing = false

let state = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

ctx.lineWidth = 1;
ctx.translate(0.5, 0.5);

canvas.addEventListener('click', (evt) => {
    const col = Math.floor(evt.offsetX / CELL);
    const row = Math.floor(evt.offsetY / CELL);

    if (isWithinCanvas(evt) && state[row][col] === 0) {
        state[row][col] = randomColor()
    }
});

canvas.addEventListener('mousedown', (event) => {
    if (event.button === MAIN_MOUSE_BUTTON) {
        actualColor = randomColor()
        isDrawing = true;
    }
});

canvas.addEventListener('mouseup', (event) => {
    if (event.button === MAIN_MOUSE_BUTTON) {
        isDrawing = false;
    }
});

canvas.addEventListener('mousemove', (evt) => {
    const col = Math.floor(evt.offsetX / CELL);
    const row = Math.floor(evt.offsetY / CELL);
    if (isDrawing && isWithinCanvas(evt) && state[row][col] === 0)
        state[row][col] = actualColor
});

function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCells(state);
    state = getNewState(state)
    setTimeout(() => {
        requestAnimationFrame(refresh);
    }, 1000 / FPS);
}

refresh();

