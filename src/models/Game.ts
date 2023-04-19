import createDomElement from "../helpers/createDomElement";

type directionType = 'top' | 'down' | 'left' | 'right'
type gridItemType = number | null
export interface IGameData {
    size: number
    score: number
    currentGrid: gridItemType[]
}

interface IGame extends IGameData {
    init: () => void
    addNewItem: () => gridItemType[]
    checkIsGameOver: () => boolean
    merge: (direction: directionType) => gridItemType[]
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
        const container = document.getElementById('container')!;

        const grid = createDomElement({
            classList: ['grid'],
            parent: container,
        })

        this._currentGrid = new Array(this.powSize).fill(null);
        this.addNewItem();
        console.log('this._currentGrid', this._currentGrid)

        this.currentGrid.forEach((item) => createDomElement({
            classList: ['grid-item'],
            textContent: item ? item.toString() : '',
            parent: grid,
        }))
    }

    addNewItem(): gridItemType[] {
        const newItem: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const result = [...this._currentGrid];

        const addToRandomSlot = (): gridItemType[] => {
            const newIndex = Math.floor(Math.random() * (this.powSize + 1));
            if (result[newIndex] !== null) return addToRandomSlot();
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
        console.log(direction);
        return;
    }

}
