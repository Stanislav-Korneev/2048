import GridBlock from "./GridBlock.ts";

export type directionType = 'left' | 'right' | 'down' | 'up'
export type gridBlockValueType = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048
export type gridBlockPositionType =  0 | 50 | 100 | 150
export type historyItemType = {
    value: gridBlockValueType
    posX: gridBlockPositionType
    posY: gridBlockPositionType
}
export type gridType = Map<GridBlock, [gridBlockPositionType, gridBlockPositionType]>
export type gridBlockSizeType = 50 | 100

export interface IGame {
    size: 4
    ctx: CanvasRenderingContext2D
    score: number
    grid: gridType
    history: historyItemType[]

    init: () => void
    renderGrid: () => void
    makeMove: () => void
    checkErrors: () => void
    addNewBlock: () => void
    rollBack: () => void
    updateHistory: () => void
    handleGameOver: () => void
}

export interface IGridBlock {
    size: gridBlockSizeType
    sprite: HTMLImageElement
    ctx: CanvasRenderingContext2D
    value: gridBlockValueType
    posX: gridBlockPositionType
    posY: gridBlockPositionType
}