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
export type dialogType = '' | 'howToPlay' | 'victory' | 'defeat'
export type dialogDataType = {
    title: string
    textContent?: string
    buttonText: string
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
    dialogData: {
        [x in dialogType]: dialogDataType
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
    dialog: HTMLDivElement
    dialogButton: HTMLButtonElement
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
    gameContinuesAfterVictory: boolean
    parsedRows: GridBlock[][]
    isNextMovePossible: boolean
    has2048: boolean

    init: () => void
    makeMove: () => void
    updateBlocks: () => boolean
    updateBlockData: ({gridBlock, prevGridBlock}: {gridBlock: GridBlock, prevGridBlock: GridBlock}) => void
    checkForMovement: (gridBlock: GridBlock) => boolean
    addNewBlock: () => void
    handleAnimation: (timestamp: number) => void
    loadStateFromHistory: () => void
    undoLastMove: () => void
    startNewGame: () => void
    handleGameOver: (hasWon: boolean) => void
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
    directionUpOrLeft: boolean
    moveAxis: axisType
    mainPos: gridBlockPositionType
    secondaryPos: gridBlockPositionType
    borderPos: gridBlockPositionType
    neighbourSlot: slotType
    tileSpritePos: number

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
    clearRecords: () => void
}

export interface IInterface {
    game: Game
    DOMElements: DOMElementsType
    dialogName: dialogType
    inputIsBlocked: boolean
    ctx: CanvasRenderingContext2D
    dialogData: dialogDataType | undefined

    update: () => void
    clearCanvas: () => void
    drawBlock: (gridBlock: GridBlock) => void
    updateDialogData: () => void
    openDialog: () => void
    closeDialog: () => void
    handleHowToPlayButton: () => void
    handleDialogueButton: () => void
    handleKeyUp: (e: KeyboardEvent) => void
    setEventListeners: () => void
}