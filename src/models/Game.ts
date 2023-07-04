import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";
import collapseArray from "../helpers/collapseArray";
import uniteArrays from "../helpers/uniteArrays";
import { createEvent } from "../helpers/eventsController";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'historyRollback'
export type gridItemType = number | null
export type historyItemType = {
    grid: gridItemType[]
    score: number
}
type addNewItemType = {
    newGrid: gridItemType[]
    newGridItemIndex: number
}

interface IGame {
    size: number
    score: number
    currentGrid: gridItemType[]
    history: historyItemType[]

    init: () => void
    initNewGame: () => void
    renderGrid: () => void
    makeMove: (direction: directionType) => void
    addNewItem: (grid: gridItemType[]) => addNewItemType
    checkIsMovePossible: (grid: gridItemType[]) => boolean
    checkIsGameEnd: (grid: gridItemType[]) => string | boolean
    merge: (direction: directionType) => historyItemType
    rollBackMove: () => void
}

export default class Game implements IGame {
    private readonly _size: number
    private _score: number
    private _currentGrid: gridItemType[]
    private _history: historyItemType[]

    constructor() {
        this._size = 5;
        this._score = -1;
        this._currentGrid = [];
        this._history = [];
    }

    get size(): number {
        return this._size;
    }
    get score(): number {
        return this._score;
    }
    set score(value: number) {
        if (value < 0 || this._score === value) return;
        this._score = value;

        createEvent({
            type: 'score-change',
            detail: {
                newScore: value,
            }
        })
    }
    get currentGrid(): gridItemType[] {
        return this._currentGrid;
    }
    set currentGrid(value: gridItemType[]) {
        this._currentGrid = value;
    }

    get history(): historyItemType[] {
        return this._history;
    }
    set history(value: historyItemType[]) {
        this._history = value.slice(-3);
        localStorage.setItem('game2048', JSON.stringify(this._history));

        createEvent({
            type: 'back-button-switch',
            detail: {
                status: value.length > 0,
            }
        })
    }

    get powSize(): number {
        return Math.pow(this.size, 2);
    }

    init(): void {
        const savedData = JSON.parse(localStorage.getItem('game2048') ?? '[]');
        const { grid, score } = savedData[savedData.length - 1] ?? {};

        this.currentGrid = grid ?? new Array(this.powSize).fill(null);
        if (!grid) this.currentGrid = this.addNewItem(this.currentGrid).newGrid;
        this.score = score ?? 0;

        this.renderGrid();
    }

    initNewGame(): void {
        this.currentGrid = new Array(this.powSize).fill(null);
        this.currentGrid = this.addNewItem(this.currentGrid).newGrid;
        this.score = 0;
        this.history = [];
    }

    renderGrid(): void {
        const grid = document.getElementById('grid')!;
        const gridBackdrop = document.getElementById('grid-backdrop')!;

        this.currentGrid.forEach(() => createDomElement({
            classList: ['grid-item-backdrop'],
            textContent: '',
            parent: gridBackdrop,
        }))

        this.currentGrid.forEach((item, index) => createDomElement({
            classList: ['grid-item'],
            id: `grid-item-${index}`,
            textContent: item ? item.toString() : '',
            parent: grid,
        }))
    }

    makeMove(direction: directionType): void {
        const { grid, score } = this.merge(direction);
        this.score += score;

        if (!this.checkIsMovePossible(grid)) return;

        if (this.checkIsGameEnd(grid)) return alert(this.checkIsGameEnd(grid));

        const { newGrid, newGridItemIndex }: addNewItemType = this.addNewItem(grid);
        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                oldGrid: this._currentGrid,
                newGrid,
                direction,
                gridSize: this.size,
                newGridItemIndex,
            }
        })

        this.currentGrid = newGrid;

        this.history = [... this.history, {
            grid: this.currentGrid,
            score: this.score,
        }];
    }

    addNewItem(grid: gridItemType[]): addNewItemType {
        const newItem: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const result = [...grid];

        const addToRandomSlot = (): addNewItemType => {
            const newIndex = Math.floor(Math.random() * (this.powSize + 1));
            if (result[newIndex] !== null) return addToRandomSlot();
            result[newIndex] = newItem;
            return { newGrid: result , newGridItemIndex: newIndex};
        }
        return addToRandomSlot();
    }

    checkIsMovePossible(grid: gridItemType[]): boolean {
        const isEmptyGrid = grid.every(item => item === null);
        const gridHasChanges = grid.some((item, index) => item !== this.currentGrid[index]);
        return (isEmptyGrid || gridHasChanges);
    }

    checkIsGameEnd(grid: gridItemType[]): string | boolean {
        if (!grid.some(item => item === null)) return 'game over';
        if (grid.find(item => item === 2048)) return 'you won';
        return false;
    }

    merge(direction: directionType): historyItemType {
        let scoreAccumulator = 0;
        let matrix = parseArray({
            source: this.currentGrid,
            direction,
            size: this.size,
        });

        matrix.forEach((item, index) => {
            const { grid, score } = collapseArray(item);
            matrix[index] = grid;
            scoreAccumulator += score;
        });

        const grid = uniteArrays({
            source: matrix,
            direction,
            size: this.size,
        }) as gridItemType[];

        return {
            grid,
            score: scoreAccumulator,
        };
    }

    rollBackMove(): void {
        if (!this.history.length) return;
        const newGrid: gridItemType[] = this.history[this.history.length - 1].grid;

        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                oldGrid: this._currentGrid,
                newGrid,
                direction: 'historyRollback',
                gridSize: this.size,
                newGridItemIndex: null,
            }
        })
        this.currentGrid = newGrid;

        const newHistoryEntry: historyItemType[] = [...this.history];
        newHistoryEntry.pop();
        this.history = [...newHistoryEntry];
    }
}
