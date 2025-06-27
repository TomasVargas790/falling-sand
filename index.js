/* ────────────── IMPORTS ────────────── */
import { FPS, MAIN_MOUSE_BUTTON } from './config.js';
import { randomColor, drawCells, getNewState } from './helper.js';

/* ────────────── DOM & UTILS ────────────── */
const canvas = document.getElementById('canvas');
const colorInput = document.getElementById('color');
const brushInput = document.getElementById('brush');
const gravityInput = document.getElementById('gravity');
const buttons = document.querySelectorAll('button');

const withinCanvas = (x, y) =>
    x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;

const getOffset = evt => {
    /* offsetX/Y existen en mouse; para touch/pointer los calculamos */
    if (evt.offsetX !== undefined) return { x: evt.offsetX, y: evt.offsetY };

    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
};

/* ────────────── CONFIGURAR CANVAS ────────────── */
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

export let CELL = canvas.width / 130;
export const COLS = Math.floor(canvas.width / CELL);
export const ROWS = Math.floor(canvas.height / CELL);
canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;
CELL = canvas.width / 130;                   // ajuste fino

export const ctx = canvas.getContext('2d');
ctx.lineWidth = 1;
ctx.translate(0.5, 0.5);

/* ────────────── ESTADO DE SIMULACIÓN ────────────── */
let color = undefined;
let brush = 1;
let gravity = 1;
let actualColor = '#FFF';
let isDrawing = false;

let state = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

/* ────────────── HANDLERS PRINCIPALES ────────────── */
function paintDot(col, row, colorToUse) {
    if (state[row][col] === 0) state[row][col] = colorToUse;
}

function handlePointerDown(e) {
    //if (e.button !== MAIN_MOUSE_BUTTON) return;

    const { x, y } = getOffset(e);
    if (!withinCanvas(x, y)) return;

    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);

    actualColor = color ?? randomColor();
    paintDot(col, row, actualColor);           // tap / click único
    isDrawing = true;
    e.preventDefault();                        // evita scroll-zoom en touch
}

function handlePointerMove(e) {
    if (!isDrawing) return;

    const { x, y } = getOffset(e);
    if (!withinCanvas(x, y)) {
        isDrawing = false;
        return;
    }

    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);

    paintDot(col, row, actualColor);

    // pincel "gordo"
    for (let i = 1; i < brush; i++) {
        const newRow = row + (Math.random() > 0.5 ? -i : i);
        const newCol = col + (Math.random() > 0.5 ? -i : i);
        paintDot(newCol, newRow, actualColor);
    }
}

function handlePointerUpCancel() {
    isDrawing = false;
}

/* ────────────── LISTENERS (POINTER EVENTS) ────────────── */
canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
canvas.addEventListener('pointerup', handlePointerUpCancel);
canvas.addEventListener('pointercancel', handlePointerUpCancel);

/* ────────────── CONTROLES UI ────────────── */
colorInput.addEventListener('change', e => (color = e.target.value));
brushInput.addEventListener('change', e => (brush = +e.target.value));
gravityInput.addEventListener('change', e => (gravity = +e.target.value));

buttons.forEach(btn => {
    const { type, input } = btn.dataset;
    btn.addEventListener('click', () => changeNumericInput(type, input));
});

function changeNumericInput(type, inputName) {
    const el = document.getElementById(inputName);
    const step = inputName === 'gravity' ? 0.25 : 1;

    let val = +el.value + (type === 'add' ? step : -step);
    const min = +el.min;
    const max = +el.max;

    val = Math.max(min, Math.min(max, val));
    el.value = val;

    if (inputName === 'gravity') gravity = val;
    else brush = val;
}

/* ────────────── BUCLE DE ANIMACIÓN ────────────── */
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCells(state);
    state = getNewState(state, gravity);

    setTimeout(() => requestAnimationFrame(loop), 1000 / Math.abs(FPS * gravity));
}
loop();
