import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";
import collapseArray from "../helpers/collapseArray";
import uniteArrays from "../helpers/uniteArrays";
import { createEvent } from "../helpers/eventsController";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'historyRollback' | 'restartGame'
export type gridItemType = number | null
export type historyItemType = {
    grid: gridItemType[]
    score: number
}
type addNewItemType = {
    newGrid: gridItemType[]
    newGridItemIndex: number
}

type moveErrorType = 'no changes in grid' | 'game over' | 'you won!' | ''

interface IGame {
    size: number
    score: number
    currentGrid: gridItemType[]
    history: historyItemType[]

    init: () => void
    renderGrid: () => void
    makeMove: (direction: directionType) => void
    addNewItem: (grid: gridItemType[]) => addNewItemType
    checkForErrors: (grid: gridItemType[]) => void
    merge: (direction: directionType) => historyItemType
    rollBackMove: () => void
    pushCurrentEntryToHistory: () => void
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
        this._history = value.slice(-4);
        localStorage.setItem('game2048', JSON.stringify(this.history));

        createEvent({
            type: 'back-button-switch',
            detail: {
                status: value.length > 1,
            }
        })
    }

    get powSize(): number {
        return Math.pow(this.size, 2);
    }

    init(isNewGame: boolean = false): void {
        if (isNewGame) this.history = [];

        const savedData = JSON.parse(localStorage.getItem('game2048') ?? '[]');
        const { grid, score } = savedData[savedData.length - 1] ?? {};

        this.currentGrid = grid ?? new Array(this.powSize).fill(null);
        if (!grid) this.currentGrid = this.addNewItem(this.currentGrid).newGrid;
        this.score = score ?? 0;

        const nodes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.grid-item');
        if (!nodes.length) this.renderGrid();

        this.pushCurrentEntryToHistory();

        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                oldGrid: this.currentGrid,
                newGrid: this.currentGrid,
                direction: 'restartGame',
                gridSize: this.size,
                newGridItemIndex: null,
            }
        })
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

        try {
            this.checkForErrors(grid);
        } catch (e) {
            if (e.message === 'no changes in grid') return;
            return alert(e);
        }

        const { newGrid, newGridItemIndex }: addNewItemType = this.addNewItem(grid);
        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                oldGrid: this.currentGrid,
                newGrid,
                direction,
                gridSize: this.size,
                newGridItemIndex,
            }
        })

        this.currentGrid = newGrid;

        this.pushCurrentEntryToHistory();
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

    checkForErrors(grid: gridItemType[]): void {
        const gridHasChanges: boolean = grid.some((item, index) => item !== this.currentGrid[index]);
        const gridIsFull: boolean = !grid.some(item => item === null);
        const has2048: boolean = !!grid.find(item => item === 2048);
        let errorValue: moveErrorType = '';

        if (!gridHasChanges) errorValue = 'no changes in grid';
        if (gridIsFull) errorValue = 'game over';
        if (has2048) errorValue = 'you won!';

        if (errorValue) throw new Error(errorValue);
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
        const targetEntryIndex = this.history.length > 1 ? this.history.length - 2 : this.history.length - 1;
        const newGrid: gridItemType[] = this.history[targetEntryIndex].grid;

        createEvent({
            nodeId: 'grid',
            type: 'grid-change',
            detail: {
                oldGrid: this.currentGrid,
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

    pushCurrentEntryToHistory(): void {
        this.history = [... this.history, {
            grid: this.currentGrid,
            score: this.score,
        }];
    }
}
