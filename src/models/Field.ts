type directionType = 'top' | 'down' | 'left' | 'right'

interface IFieldData {
    grid: []
}

interface IField extends IFieldData{
    merge: (direction: directionType) => void
}

export default class Field implements IField {
    private _grid: []

    constructor(payload: IFieldData) {
        this._grid = payload.grid;
    }

    get grid(): [] {
        return this._grid;
    }
    set grid(value: []) {
        this._grid = value;
    }

    merge(direction: directionType): void {
        console.log(direction);
        return;
    }

}
