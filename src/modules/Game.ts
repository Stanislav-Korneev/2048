import {
    gridBlockPositionType,
    gridBlockSizeType,
    gridType,
    historyItemType,
    IGame
} from "./typesAndInterfaces.ts";
import GridBlock from "./GridBlock.ts";
export class Game implements IGame {
    private readonly _ctx: CanvasRenderingContext2D
    private readonly _gridBlockSize: gridBlockSizeType
    private readonly _gridBlockPositions: gridBlockPositionType[]
    private _score: number
    private _grid: gridType
    private _history: historyItemType[]

    constructor({ctx, gridBlockSize, gridBlockPositions}: {
        ctx: CanvasRenderingContext2D,
        gridBlockSize: gridBlockSizeType,
        gridBlockPositions: gridBlockPositionType[]
    }) {
        this._ctx = ctx;
        this._gridBlockSize = gridBlockSize;
        this._gridBlockPositions = gridBlockPositions;
        this._score = 0;
        this._grid = new Map();
        this._history = [];
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }
    get gridBlockSize(): gridBlockSizeType {
        return this._gridBlockSize;
    }
    get gridBlockPositions(): gridBlockPositionType[] {
        return this._gridBlockPositions;
    }

    get score(): number {
        return this._score;
    }
    set score(value: number) {
        this._score = value;
    }

    get grid(): gridType {
        return this._grid;
    }
    set grid(value: gridType) {
        this._grid = value;
    }

    get history(): historyItemType[] {
        return this._history;
    }
    set history(value: historyItemType[]) {
        this._history = value;
    }

    init(): void {
        this.addNewBlock();
    }
    renderGrid(): void {}
    makeMove(): void {}
    checkErrors(): void {}
    addNewBlock(): void {
        const getRandomIndex = (): number => Math.round(Math.random() * (this.gridBlockPositions.length - 1));
        console.log(getRandomIndex());
        const value: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const posX: gridBlockPositionType = this.gridBlockPositions[getRandomIndex()];
        const posY: gridBlockPositionType = this.gridBlockPositions[getRandomIndex()];
        const newBlock: GridBlock = new GridBlock({
            ctx: this.ctx,
            size: this.gridBlockSize,
            value,
            posX,
            posY
        });
        console.log(newBlock);

        this.ctx.drawImage(newBlock.sprite, newBlock.imgXCoordinate, 0, 268, 270, newBlock.posX, newBlock.posY, this.gridBlockSize, this.gridBlockSize);
        console.log(this.ctx)
    }
    rollBack(): void {}
    updateHistory(): void {}
    handleGameOver(): void {}
}