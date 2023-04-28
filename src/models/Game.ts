import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";
import collapseArray from "../helpers/collapseArray";
import uniteArrays from "../helpers/uniteArrays";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
export type gridItemType = number | null
export type gridItemEventType = CustomEvent<{targetId: string, newValue: string}>
export type scoreEventType = CustomEvent<{newScore: number}>
export type historyItemType = {
    grid: gridItemType[]
    score: number
}
type historyMethodType = 'push' | 'pop'

export interface IGameData {
    size: number
    score: number
    currentGrid: gridItemType[]
    history: historyItemType[]
}

interface IGame extends IGameData {
    init: () => void
    addNewItem: () => gridItemType[]
    checkIsGameOver: () => boolean
    merge: (direction: directionType) => historyItemType
}

export default class Game implements IGame {
    private readonly _size: number
    private _score: number
    private _currentGrid: gridItemType[]
    private _history: historyItemType[]

    constructor(settings: IGameData) {
        this._score = -1;
        this._currentGrid = settings.currentGrid;
        this._size = settings.size;
        this._history = [];
    }

    get size(): number {
        return this._size;
    }
    get score(): number {
        return this._score;
    }
    set score(value: number) {
        console.log('set score, ', value);
        if (value < 0 || this._score === value) return;
        this._score = value;
        const event: scoreEventType = new CustomEvent('score-change', {
            bubbles: true,
            detail: {
                newScore: this._score,
            }
        })
        document.dispatchEvent(event);
    }
    get currentGrid(): gridItemType[] {
        return this._currentGrid;
    }
    set currentGrid(value: gridItemType[]) {
        console.log('set currentGrid, ', value);
        const el = document.getElementById('grid')!;
        this._currentGrid.forEach((item, index) => {
            if (!el || item === value[index]) return;

            const event: gridItemEventType = new CustomEvent('grid-item-change', {
                bubbles: true,
                detail: {
                    targetId: `grid-item-${index}`,
                    newValue: value[index]?.toString() ?? '',
                }
            });
            el.dispatchEvent(event);
        })

        this._currentGrid = value;
    }

    get history(): historyItemType[] {
        return this._history;
    }
    set history(value: historyItemType[]) {
        console.log('set history, ', value);
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

        if (!grid) this.addNewItem();
        this.renderGrid();
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
        this.currentGrid = grid;

        this.addNewItem();
        this.updateHistory('push');
    }

    addNewItem(): gridItemType[] {
        if (!this.currentGrid.some(item => item === null)) {
            return this.currentGrid;
        }

        const newItem: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const result = [...this.currentGrid];

        const addToRandomSlot = (): gridItemType[] => {
            const newIndex = Math.floor(Math.random() * (this.powSize + 1));
            if (result[newIndex] !== null) return addToRandomSlot();
            result[newIndex] = newItem;
            this.currentGrid = result;
            return result;
        }
        return addToRandomSlot();
    }

    checkIsGameOver(): boolean {
        return !this.currentGrid.find(item => item === null);
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

    updateHistory(method: historyMethodType): void {
        if (method === 'push') {
            this._history.push({
                grid: this.currentGrid,
                score: this.score,
            });
        }
        if (method === 'pop' && this._history.length > 1) {
            this._history.pop();
            const { grid, score } = this._history[this._history.length - 1];
            this.currentGrid = grid;
            this.score = score;
        }
        localStorage.setItem('game2048', JSON.stringify(this._history));
    }
}
