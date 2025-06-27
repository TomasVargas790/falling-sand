import { setDrawCells, setDrawGrid, setDrawLine, setGetXY, setPointerDown, setPointerMove, setSetXY, setWithinCanvas } from "./helper.js"

export function getCanvasFunction(canvas, canvasState, cell) {
    const withinCanvas = setWithinCanvas(canvas)
    const getXY = setGetXY(canvas, cell)
    const setXY = setSetXY(canvasState)

    return {
        withinCanvas,
        getXY,
        setXY
    }
}


export function getAllFunctions(canvas, canvasState, optionsState, ctx, cell) {
    const { getXY, setXY, withinCanvas } = getCanvasFunction(canvas, canvasState, cell)

    const onPointerMove = setPointerMove(optionsState, withinCanvas, getXY, setXY)
    setPointerDown

    const drawLine = setDrawLine(ctx)

    const onPointerDown = setPointerDown(canvas, withinCanvas, getXY, setXY)

    const drawCells = setDrawCells(ctx, cell)

    const drawGrid = setDrawGrid(drawLine, cell)
    
    return {
        getXY,
        setXY,
        withinCanvas,
        drawGrid,
        drawCells,
        drawLine,
        onPointerMove,
        onPointerDown
    }
}
