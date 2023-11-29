import { gridType, historyItemType, IGame } from "./typesAndInterfaces.ts";
export class Game implements IGame {
    private readonly _size: 4
    private readonly _ctx: CanvasRenderingContext2D
    private _score: number
    private _grid: gridType
    private _history: historyItemType[]

    constructor(ctx: CanvasRenderingContext2D) {
        this._size = 4;
        this._ctx = ctx;
        this._score = 0;
        this._grid = new Map();
        this._history = [];
    }

    get size(): 4 {
        return this._size;
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
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

    init(): void {}
    renderGrid(): void {}
    makeMove(): void {}
    checkErrors(): void {}
    addNewItem(): void {}
    rollBack(): void {}
    updateHistory(): void {}
    handleGameOver(): void {}
}