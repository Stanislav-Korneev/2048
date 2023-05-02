import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";
import collapseArray from "../helpers/collapseArray";
import uniteArrays from "../helpers/uniteArrays";
import { createEvent } from "../helpers/eventsController";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
export type gridItemType = number | null
export type historyItemType = {
    grid: gridItemType[]
    score: number
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
    addNewItem: (grid: gridItemType[]) => gridItemType[]
    checkIsGameOver: (grid: gridItemType[]) => boolean
    merge: (direction: directionType) => historyItemType
    updateHistory: (historyItem?: historyItemType) => void
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

        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                newGrid: value,
            }
        })
    }

    get history(): historyItemType[] {
        return this._history;
    }
    set history(value: historyItemType[]) {
        this._history = value;
        localStorage.setItem('game2048', JSON.stringify(this._history));
    }

    get powSize(): number {
        return Math.pow(this.size, 2);
    }

    init(): void {
        const savedData = JSON.parse(localStorage.getItem('game2048') ?? '[]');
        const { grid, score } = savedData[savedData.length - 1] ?? {};
        this.currentGrid = grid ?? new Array(this.powSize).fill(null);
        this.score = score ?? 0;

        if (!grid) this.makeMove('ArrowDown');
        this.renderGrid();
    }

    initNewGame(): void {
        this.currentGrid = new Array(this.powSize).fill(null);
        this.score = 0;
        this.history = [];
        this.makeMove('ArrowDown');
    }

    renderGrid(): void {
        const grid: HTMLElement = createDomElement({
            classList: ['grid'],
            id: 'grid',
            parent: document.getElementById('container')!,
        })

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

        const gridHasChanges = grid.some((item, index) => item !== this.currentGrid[index]);
        if (!gridHasChanges) return;

        if (this.checkIsGameOver(grid)) return alert('game over');
        if (grid.find(item => item === 2048)) alert('you won!');

        this.currentGrid = this.addNewItem(grid);
        this.updateHistory({
            grid: this.currentGrid,
            score: this.score,
        })
    }

    addNewItem(grid: gridItemType[]): gridItemType[] {
        const newItem: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const result = [...grid];

        const addToRandomSlot = (): gridItemType[] => {
            const newIndex = Math.floor(Math.random() * (this.powSize + 1));
            if (result[newIndex] !== null) return addToRandomSlot();
            result[newIndex] = newItem;
            return result;
        }
        return addToRandomSlot();
    }

    checkIsGameOver(grid: gridItemType[]): boolean {
        return !grid.some(item => item === null);
    }

    merge(direction: directionType): historyItemType {
        let scoreAccumulator = 0;
        let matrix = parseArray({
            source: this.currentGrid,
            direction,
            size: this.size,
        })

        matrix.forEach((item, index) => {
            const { grid, score } = collapseArray(item);
            matrix[index] = grid;
            scoreAccumulator += score;
        });

        const grid = uniteArrays({
            source: matrix,
            direction,
            size: this.size,
        });

        return {
            grid,
            score: scoreAccumulator,
        };
    }

    updateHistory(historyItem?: historyItemType): void {
        if (historyItem) {
            this._history.push(historyItem);
        }

        if (!historyItem && this._history.length > 1) {
            this._history.pop();
            const { grid, score } = this._history[this._history.length - 1];
            this.currentGrid = grid;
            this.score = score;
        }

        localStorage.setItem('game2048', JSON.stringify(this._history));
    }
}
