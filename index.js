import { CELL, FPS, MAIN_MOUSE_BUTTON } from "./config.js";
import { randomColor, drawCells, getNewState } from "./helper.js";

const isWithinCanvas = (evt) => (evt.offsetX < canvas.width && evt.offsetX >= 0) && (evt.offsetY < canvas.height && evt.offsetY >= 0)

export const canvas = document.getElementById('canvas');

const colorInput = document.getElementById('color');
const brushInput = document.getElementById('brush');
const gravityInput = document.getElementById('gravity');

const buttons = document.querySelectorAll('button');

let color = undefined
let brush = 1
let gravity = 1

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
        state[row][col] = color ?? randomColor()
    }
});

canvas.addEventListener('mousedown', (event) => {
    if (event.button === MAIN_MOUSE_BUTTON) {
        actualColor = color ?? randomColor()
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

    if (!isWithinCanvas(evt)) {
        isDrawing = false
    }

    if (isDrawing && state[row][col] === 0) {
        state[row][col] = actualColor


        let i = 1
        while (i < brush) {
            const newRowIndex = row + (Math.random() > 0.5 ? -1 : 1 * i)
            const newColIndex = col + (Math.random() > 0.5 ? -1 : 1 * i)

            if (newRowIndex < state.length && newColIndex < state[row].length && state[newRowIndex][newColIndex] === 0) {
                state[newRowIndex][newColIndex] = actualColor
            }
            i++
        }
    }

});

colorInput.addEventListener('change', ({ target: { value } }) => color = value)
brushInput.addEventListener('change', ({ target: { value } }) => brush = Number(value))
gravityInput.addEventListener('change', ({ target: { value } }) => gravity = Number(value))

buttons.forEach(b => {
    const { dataset: { type, input } } = b
    console.log(b.dataset.type)
    b.addEventListener('click', () => {
        handleButtons(type, input)
    })
})


function handleButtons(type, inputName) {
    const el = document.getElementById(inputName);
    const step = inputName === "gravity" ? 0.25 : 1;

    let value = Number(el.value);
    const min = Number(el.min);
    const max = Number(el.max);

    value += type === "add" ? step : -step;

    value = Math.max(min, Math.min(max, value));

    el.value = value;

    if (inputName === "gravity") {
        gravity = value;
    } else {
        brush = value;
    }
}

function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCells(state);
    state = getNewState(state, gravity)
    setTimeout(() => {
        requestAnimationFrame(refresh);
    }, 1000 / Math.abs((FPS * gravity)));
}


refresh();

