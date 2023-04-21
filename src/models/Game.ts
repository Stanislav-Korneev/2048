import createDomElement from "../helpers/createDomElement";
import parseArray from "../helpers/parseArray";

export type directionType = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
export type gridItemType = number | null
export type gridItemEventType = CustomEvent<{targetId: string, newValue: string}>
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
        const el = document.getElementById('grid')!;
        this._currentGrid.forEach((item, index) => {
            if (!el || item === value[index]) return;

            const event: gridItemEventType = new CustomEvent('grid-item-change', {
                bubbles: true,
                detail: {
                    targetId: `grid-item-${index}`,
                    newValue: `${value[index]}`,
                }
            });
            el.dispatchEvent(event);
        })

        this._currentGrid = value;
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
        const matrix = parseArray({
            source: this.currentGrid,
            mode: ['ArrowUp', 'ArrowDown'].includes(direction) ? 'vertical' : 'horizontal',
            size: this.size,
        })
    }
}
