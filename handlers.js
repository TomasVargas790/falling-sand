
/* ——— Lógica ——— */
export const onPointerDown = (canvas, withinCanvas, getXY, setXY, e,) => {
    if (e.pointerType === 'mouse' && e.button !== MAIN_MOUSE_BUTTON) return;

    const { x, y } = getXY(e);
    if (!withinCanvas(x, y)) return;

    actualColor = color ?? randomColor();
    setXY(x, y);
    isDrawing = true;

    // seguir recibiendo moves aunque el dedo salga ligeramente
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    e.preventDefault();               // cancela scroll/zoom en mobile
}

export const onPointerMove = (withinCanvas, getXY, setXY, e, optionsState) => {
    if (!optionsState.isDrawing) return;
    const { x, y } = getXY(e);

    if (withinCanvas(x, y)) setXY(x, y);
}
