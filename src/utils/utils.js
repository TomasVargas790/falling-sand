/**
 * Utility functions - pure functions without side effects
 */

const randomRGB = () => Math.floor(Math.random() * 256);

export const randomColor = () => `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, factor) => start + (end - start) * factor;

export const generateGrid = (cols, rows, fillValue = 0) => {
    return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
};

export const isValidGridPosition = (row, col, rows, cols) => {
    return row >= 0 && row < rows && col >= 0 && col < cols;
};