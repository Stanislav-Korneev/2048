interface IGameData {
    score: number
}

interface IGame extends IGameData {
    init: () => void
}

export default class Game implements IGame {
    private _score: number

    constructor(payload: IGameData) {
        this._score = payload.score;
    }

    get score(): number {
        return this._score;
    }
    set score(value: number) {
        if (value < 0) return;
        this._score = value;
    }

    init(): void {
        return;
    }
}
