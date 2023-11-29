import {
    gridBlockPositionType,
    gridBlockSizeType,
    gridBlockValueType,
    IGridBlock
} from "./typesAndInterfaces.ts";

export default class GridBlock implements IGridBlock {
    private readonly _size: gridBlockSizeType
    private readonly _sprite: HTMLImageElement
    private readonly _ctx: CanvasRenderingContext2D
    private _value: gridBlockValueType
    private _posX: gridBlockPositionType
    private _posY: gridBlockPositionType

    constructor({ ctx, value, posX, posY }: {
        ctx: CanvasRenderingContext2D,
        value: gridBlockValueType,
        posX: gridBlockPositionType,
        posY: gridBlockPositionType,
    }) {
        this._size = 50;
        this._sprite = document.getElementById('tiles_sprite') as HTMLImageElement;
        this._ctx = ctx;
        this._value = value;
        this._posX = posX;
        this._posY = posY;
    }

    get size(): gridBlockSizeType {
        return this._size;
    }
    get sprite(): HTMLImageElement {
        return this._sprite;
    }
    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    get value(): gridBlockValueType {
        return this._value;
    }
    set value(newValue: gridBlockValueType) {
        this._value = newValue;
    }

    get posX(): gridBlockPositionType {
        return this._posX;
    }
    set posX(value: gridBlockPositionType) {
        this._posX = value;
    }

    get posY(): gridBlockPositionType {
        return this._posY;
    }
    set posY(value: gridBlockPositionType) {
        this._posY = value;
    }
}