export const setupCanvas = (canvas) => {
    /* -----------------------------------------------------------
 *  Ajusta solo estos dos valores:
 * ----------------------------------------------------------- */
    const TARGET_CELLS = 8_000;     // densidad global (~100×100 celdas)
    const MIN_CELL_PX = 3;          // para que nunca quede microscópico

    /* -----------------------------------------------------------
     *  1) Dimensiones físicas del canvas
     * ----------------------------------------------------------- */
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    /* -----------------------------------------------------------
     *  2) Tamaño de celda derivado del área
     * ----------------------------------------------------------- */
    let CELL = Math.floor(Math.sqrt((w * h) / TARGET_CELLS));

    if (CELL < MIN_CELL_PX) CELL = MIN_CELL_PX;   // único clamp

    /* -----------------------------------------------------------
     *  3) Columnas, filas y ajuste perfecto del lienzo
     * ----------------------------------------------------------- */
    const COLS = Math.floor(w / CELL);
    const ROWS = Math.floor(h / CELL);

    canvas.width = COLS * CELL;   // encaja sin bordes “sobrantes”
    canvas.height = ROWS * CELL;

    /* ──────────────────────── CONTEXT & STATE ─────────────── */
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5);
    return { CELL, COLS, ROWS, ctx }
}

export const withinCanvas = (x, y, canvas) => x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;

export const getXY = (canvas, e) => {
    if (e.pointerType === "mouse") return { x: e.offsetX, y: e.offsetY };
    const rect = canvas.getBoundingClientRect();

    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};


/* ——— Función que pinta un punto (misma lógica que tenías) ——— */
export const setXY = (canvasState, optionsState, cell, x, y) => {
    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);

    if (canvasState[row][col] !== 0) return;

    canvasState[row][col] = optionsState.actualColor;

    for (let i = 1; i < brush; i++) {
        const newRowI = row + (Math.random() > .5 ? -i : i);
        const newColI = col + (Math.random() > .5 ? -i : i);
        if (canvasState[newRowI][newColI] === 0) canvasState[newRowI][newColI] = optionsState.actualColor;
    }
}

export const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export const drawGrid = (drawLine, cell, cols, rows) => {
    for (let r = 0; r < rows; r++) drawLine(0, r * cell, canvas.width, r * cell);
    for (let c = 0; c < cols; c++) drawLine(c * cell, 0, c * cell, canvas.height);
}

export const drawCells = (ctx, cell, canvasState) => {
    for (let r = 0; r < canvasState.length; r++) {
        for (let c = 0; c < canvasState[r].length; c++) {
            const actual = canvasState[r][c]
            if (actual !== 0) {
                const x = c * cell;
                const y = r * cell;
                ctx.fillStyle = actual
                ctx.fillRect(x, y, cell, cell);
            }
        }
    }
}