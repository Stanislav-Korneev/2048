import GridBlock from "../classes/GridBlock.ts";
import {Game} from "../classes/Game.ts";
import {History} from "../classes/History.ts";
import {Interface} from "../classes/Interface.ts";

export type deviceSizeType = 's' | 'l';
export type canvasSizeType = 290 | 500
export type gridBlockSizeType = 58 | 100

export type directionType = '' | 'left' | 'right' | 'down' | 'up'
export type gridBlockValueType = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048
type gridBlockPositionTypeS = 20 | 84 | 148 | 212
type gridBlockPositionTypeL = 35 | 145 | 255 | 365
export type gridBlockPositionType = gridBlockPositionTypeS | gridBlockPositionTypeL
export type animationStatusType = Set<'move' | 'pulse' | 'delete'>
export type slotType = [gridBlockPositionType, gridBlockPositionType]
export type axisType = 'X' | 'Y';
export type gridType = GridBlock[]
export type historyRecordGridType = {
    value: gridBlockValueType
    slot: slotType
}
export type historyRecordType = {
    score: number
    grid: historyRecordGridType[]
}
export type gameConfigType = {
    canvasSize: canvasSizeType
    gridBlockSize: gridBlockSizeType
    gridBlockPositions: gridBlockPositionType[]
    animationOptions: {
        duration: number
        deleteModifier: number
        pulseModifier: number
    }
}
export type DOMElementsType = {
    canvas: HTMLCanvasElement
    tileSprite: HTMLImageElement
    score: HTMLSpanElement
    bestScore: HTMLSpanElement
    undoButton: HTMLButtonElement
    newGameButton: HTMLButtonElement
    howToPlayButton: HTMLButtonElement
}

export interface IGame {
    config: gameConfigType
    availableSlots: slotType[]
    history: History
    interface: Interface
    grid: gridType
    score: number
    moveDirection: directionType
    prevFrameTime: number

    init: () => void
    makeMove: () => void
    checkErrors: () => void
    updateBlocks: () => void
    updateBlockData: ({gridBlock, prevGridBlock}: {gridBlock: GridBlock, prevGridBlock: GridBlock}) => void
    addNewBlock: () => void
    handleAnimation: (timestamp: number) => void
    undoLastMove: () => void
    startNewGame: () => void
    handleGameOver: () => void
}

export interface IGridBlock {
    game: Game
    animationStatus: animationStatusType
    value: gridBlockValueType
    slot: slotType
    posX: number
    posY: number
    opacity: number
    currentSize: number
    increaseInSize: boolean
    moveDistance: number

    moveToBorderSlot: () => void
    update: (stepDuration: number) => void
    calculateAnimationStep: (stepDuration: number) => {
        fadePower: number
        shiftDistance: number
        scale: number
    }
    setMoveDistance: () => void
    handleDelete: (fadePower: number) => void
    handleMove: (shiftDistance: number) => void
    handlePulse: (scale: number) => void
    selfDestruct: () => void
}

export interface IHistory {
    size: number
    bestScore: number
    records: historyRecordType[]
    lastRecord: historyRecordType | undefined

    push: ({grid, score}: {grid: gridType, score: number}) => void
    pop: () => void
}

export interface IInterface {
    game: Game
    DOMElements: DOMElementsType
    ctx: CanvasRenderingContext2D

    update: () => void
    clearCanvas: () => void
    drawBlock: (gridBlock: GridBlock) => void
    setEventListeners: () => void
}