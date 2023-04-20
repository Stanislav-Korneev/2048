import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
export type gridItemType = number | null
export interface IGameData {
    size: number
    score: number
    currentGrid: gridItemType[]
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

    constructor(settings: IGameData) {
        this._score = settings.score;
        this._currentGrid = settings.currentGrid;
        this._size = settings.size;
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
        this._currentGrid = value;
    }

    get powSize(): number {
        return Math.pow(this._size, 2);
    }

    init(): void {
        this._currentGrid = new Array(this.powSize).fill(null);
        this.addNewItem();
        console.log('this._currentGrid', this._currentGrid)
        this.renderGrid();
    }

    renderGrid(): void {
        const grid: HTMLElement = createDomElement({
                classList: ['grid'],
                parent: document.getElementById('container')!,
            })

        this.currentGrid.forEach((item) => createDomElement({
            classList: ['grid-item'],
            textContent: item ? item.toString() : '',
            parent: grid,
        }))
    }

    makeMove(direction: directionType): void {
        this.merge(direction);
        this._currentGrid = this.addNewItem();
        this.renderGrid();
    }

    addNewItem(): gridItemType[] {
        if (!this._currentGrid.some(item => item === null)) {
            return this._currentGrid;
        }

        const newItem: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const result = [...this._currentGrid];

        const addToRandomSlot = (): gridItemType[] => {
            const newIndex = Math.floor(Math.random() * (this.powSize + 1));
            if (result[newIndex] !== null) return addToRandomSlot();
            console.log('gl', newIndex)
            result[newIndex] = newItem;
            return result;
        }
        this._currentGrid = result;
        return addToRandomSlot();
    }

    checkIsGameOver(): boolean {
        return !this._currentGrid.find(item => item === null);
    }

    merge(direction: directionType): void {
        const matrix = parseArray({
            source: this._currentGrid,
            mode: ['ArrowUp', 'ArrowDown'].includes(direction) ? 'vertical' : 'horizontal',
            size: this._size,
        })
    }
}
