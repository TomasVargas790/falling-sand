export const generateCanvasState = (cols, rows) => Array.from({ length: rows }, () => Array(cols).fill(0));

const randomRGB = () => Math.floor(Math.random() * 256)

export const randomColor = () => `rgb(${randomRGB()},${randomRGB()},${randomRGB()}')`

export const withinCols = (c) => c >= 0 && c < COLS

export const adjustNumeric = (action, input, gravity) => {
    const el = document.getElementById(input);
    const step = input === 'gravity' ? 0.25 : 1;
    let val = +el.value + (action === 'add' ? step : -step);
    val = Math.max(+el.min, Math.min(+el.max, val));
    el.value = val;
    (input === 'gravity') ? (gravity = val) : (brush = val);
}
