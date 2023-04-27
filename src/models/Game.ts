import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";
import collapseArray from "../helpers/collapseArray";
import uniteArrays from "../helpers/uniteArrays";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
export type gridItemType = number | null
export type gridItemEventType = CustomEvent<{targetId: string, newValue: string}>
type historyMethodType = 'push' | 'pop'

export interface IGameData {
    size: number
    score: number
    currentGrid: gridItemType[]
    history: gridItemType[][]
}

interface IGame extends IGameData {
    init: () => void
    addNewItem: () => gridItemType[]
    checkIsGameOver: () => boolean
    merge: (direction: directionType) => void
}

export default class Game implements IGame {
    private readonly _size: number
    private _score: number
    private _currentGrid: gridItemType[]
    private _history: gridItemType[][]

    constructor(settings: IGameData) {
        this._score = settings.score;
        this._currentGrid = settings.currentGrid;
        this._size = settings.size;

        this._history = JSON.parse(localStorage.getItem('game2048') ?? '[]');
    }

    get size(): number {
        return this._size;
    }
    get score(): number {
        return this._score;
    }
    set score(value: number) {
        if (value < 0) return;
        this._score = value;
    }
    get currentGrid(): gridItemType[] {
        return this._currentGrid;
    }
    set currentGrid(value: gridItemType[]) {
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

    get history(): gridItemType[][] {
        return this._history;
    }
    set history(value: gridItemType[][]) {
        this._history = value;
        localStorage.setItem('game2048', JSON.stringify(this._history));
    }

    get powSize(): number {
        return Math.pow(this.size, 2);
    }

    init(): void {
        this.currentGrid = new Array(this.powSize).fill(null);
        this.addNewItem();
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
        this.merge(direction);
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

    merge(direction: directionType): void {
        let matrix = parseArray({
            source: this.currentGrid,
            direction,
            size: this.size,
        })

        matrix = matrix.map(item => collapseArray(item));

        this.currentGrid = uniteArrays({
            source: matrix,
            direction,
            size: this.size,
        });
    }

    updateHistory(method: historyMethodType): void {
        if (method === 'push') {
            this._history.push(this.currentGrid);
        }
        if (method === 'pop' && this._history.length > 1) {
            this._history.pop();
            this.currentGrid = this._history[this._history.length - 1];
        }
        localStorage.setItem('game2048', JSON.stringify(this._history));
    }
}
