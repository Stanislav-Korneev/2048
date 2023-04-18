type directionType = 'top' | 'down' | 'left' | 'right'
export interface IGameData {
    size: number
    score: number
    grid: []
}

interface IGame extends IGameData {
    init: () => void
    merge: (direction: directionType) => void
}

export default class Game implements IGame {
    private readonly _size: number
    private _score: number
    private _grid: []

    constructor(settings: IGameData) {
        this._score = settings.score;
        this._grid = settings.grid;
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
    get grid(): [] {
        return this._grid;
    }
    set grid(value: []) {
        this._grid = value;
    }

    init(): void {
        return;
    }

    merge(direction: directionType): void {
        console.log(direction);
        return;
    }
}
