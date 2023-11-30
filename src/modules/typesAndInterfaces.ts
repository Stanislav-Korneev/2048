import GridBlock from "./GridBlock.ts";

export type deviceSizeType = 's' | 'l';
export type fieldSizeType = 290 | 500
export type gridBlockSizeType = 58 | 100
export type interfaceSizesType = {
    [x in deviceSizeType]: {
        fieldSize: fieldSizeType
        gridBlockSize: gridBlockSizeType,
        gridBlockPositions: gridBlockPositionType[],
    };
};

export type directionType = 'left' | 'right' | 'down' | 'up'
export type gridBlockValueType = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048
type gridBlockPositionTypeS = 20 | 84 | 148 | 212
type gridBlockPositionTypeL = 35 | 145 | 255 | 365
export type gridBlockPositionType = gridBlockPositionTypeS | gridBlockPositionTypeL
export type historyItemType = {
    value: gridBlockValueType
    posX: gridBlockPositionType
    posY: gridBlockPositionType
}
export type gridType = Map<GridBlock, [gridBlockPositionType, gridBlockPositionType]>

export interface IGame {
    gridBlockSize: gridBlockSizeType
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