/* ──────────────────────── IMPORTS ──────────────────────── */
import { setupCanvas } from './canvas.js';
import { FPS } from './config.js';
import { getAllFunctions } from './hooks.js';
import { generateCanvasState } from './utils.js';

/* ──────────────────────── DOM ──────────────────────────── */
const canvas = document.getElementById('canvas');
const colorInput = document.getElementById('color');
const brushInput = document.getElementById('brush');
const gravityInput = document.getElementById('gravity');
const buttons = document.querySelectorAll('button');

/* ──────────────────────── UTILS ────────────────────────── */

export const { CELL, COLS, ROWS, ctx } = setupCanvas(canvas);

let optionsState = {
    color: undefined,
    gravity: 1,
    isDrawing: false,
    brush: 1,
    actualColor: '#FFF',
}

let canvasState = generateCanvasState(COLS, ROWS)

const {
    drawGrid,
    drawCells,
    onPointerMove,
    onPointerDown
} = getAllFunctions(canvas, canvasState, optionsState,ctx, CELL)



canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
canvas.addEventListener('pointermove', onPointerMove, { passive: false });
canvas.addEventListener('pointerup', () => isDrawing = false);
canvas.addEventListener('pointercancel', () => isDrawing = false);


/* ──────────────────────── CONTROLES UI ─────────────────── */
colorInput.addEventListener('change', e => (optionsState.color = e.target.value));
brushInput.addEventListener('change', e => (optionsState.brush = +e.target.value));
gravityInput.addEventListener('change', e => (optionsState.gravity = +e.target.value));

buttons.forEach(btn => {
    const { type, input } = btn.dataset;
    btn.addEventListener('click', () => adjustNumeric(type, input));
});


/* ──────────────────────── LOOP ─────────────────────────── */
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(COLS, ROWS)
    drawCells(canvasState);
    canvasState = getNewState(canvasState, gravity);
    setTimeout(() => requestAnimationFrame(loop), 1000 / Math.abs(FPS * gravity));
}
loop();
