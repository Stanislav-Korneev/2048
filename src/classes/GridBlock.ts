import {
    animationStatusType,
    axisType,
    gridBlockPositionType,
    gridBlockValueType,
    IGridBlock,
    slotType
} from "../helpers/typesAndInterfaces.ts";
import {Game} from "./Game.ts";

export default class GridBlock implements IGridBlock {
    private readonly _game: Game
    private readonly _animationStatus: animationStatusType
    private _value: gridBlockValueType
    private _slot: slotType
    private _posX: number
    private _posY: number
    private _opacity: number
    private _currentSize: number
    private _increaseInSize: boolean
    private _moveDistance: number

    constructor({ game, value, slot }: {
        game: Game,
        value: gridBlockValueType,
        slot: slotType,
    }) {
        this._game = game;
        this._animationStatus = new Set(['pulse']);
        this._value = value;
        this._slot = slot;
        this._posX = slot[0];
        this._posY = slot[1];
        this._opacity = 1;
        this._currentSize = game.config.gridBlockSize;
        this._increaseInSize = true;
        this._moveDistance = 0;
    }

    get game(): Game {
        return this._game;
    }
    get animationStatus(): animationStatusType {
        return this._animationStatus;
    }
    get value(): gridBlockValueType {
        return this._value;
    }
    set value(newValue: gridBlockValueType) {
        this._value = newValue;
    }
    get slot(): slotType {
        return this._slot;
    }
    set slot(value: slotType) {
        this._slot = value;
    }
    get posX(): number {
        return this._posX;
    }
    set posX(value: number) {
        this._posX = value;
    }
    get posY(): number {
        return this._posY;
    }
    set posY(value: number) {
        this._posY = value;
    }
    get opacity(): number{
        return this._opacity;
    }
    set opacity(value: number) {
        this._opacity = value;
    }
    get currentSize(): number {
        return this._currentSize;
    }
    set currentSize(value: number) {
        this._currentSize = value;
    }
    get increaseInSize(): boolean {
        return this._increaseInSize;
    }
    set increaseInSize(value: boolean) {
        this._increaseInSize = value;
    }
    get moveDistance(): number {
        return this._moveDistance;
    }
    set moveDistance(value: number) {
        this._moveDistance = value;
    }
    get directionUpOrLeft(): boolean {
        return this.game.moveDirection === 'up' || this.game.moveDirection === 'left';
    }
    get moveAxis(): axisType {
        return this.game.moveDirection === 'up' || this.game.moveDirection === 'down' ? 'Y' : 'X';
    }
    get mainPos(): gridBlockPositionType {
        return this.moveAxis === 'X' ? this.slot[0] : this.slot[1];
    }
    get secondaryPos(): gridBlockPositionType {
        return this.moveAxis === 'X' ? this.slot[1] : this.slot[0];
    }
    get borderPos(): gridBlockPositionType {
        return this.directionUpOrLeft
            ? this.game.config.gridBlockPositions[0]
            : this.game.config.gridBlockPositions[this.game.config.gridBlockPositions.length - 1];
    }
    get neighbourSlot(): slotType {
        // there can be undefined values of last elements, but it doesn't matter because they're always read
        // by the next element, so undefined values will never be read
        const shift: 1 | -1 = this.directionUpOrLeft ? 1 : -1;
        const i: number = this.game.config.gridBlockPositions.indexOf(this.mainPos) + shift;
        return this.moveAxis === 'X'
            ? [this.game.config.gridBlockPositions[i], this.slot[1]]
            : [this.slot[0], this.game.config.gridBlockPositions[i]];
    }
    get tileSpritePos(): number {
        // sprite block size is 268x270 and space between blocks is 5
        // all sprite blocks are in ascending order
        // so depending on the block value we can calculate the position of sprite block
        return (Math.log2(this.value) - 1) * (268 + 5);
    }
    moveToBorderSlot(): void {
        this.slot = this.moveAxis === 'X'
            ? [this.borderPos, this.slot[1]]
            : [this.slot[0], this.borderPos];
    }
    update(stepDuration: number): void {
        const { fadePower, shiftDistance, scale } = this.calculateAnimationStep(stepDuration);
        if(this.moveDistance === 0) this.setMoveDistance();
        if(this.animationStatus.has('delete')) this.handleDelete(fadePower);
        if(this.animationStatus.has('move')) this.handleMove(shiftDistance);
        if(this.animationStatus.has('pulse')) this.handlePulse(scale);
        this.game.interface.drawBlock(this);
    }
    calculateAnimationStep(stepDuration: number): {fadePower: number, shiftDistance: number, scale: number} {
        const {deleteModifier, pulseModifier} = this.game.config.animationOptions;
        const fadePower: number = deleteModifier * Math.min(stepDuration, 1);
        const shiftDistance: number = this.moveDistance * Math.min(stepDuration, 1);
        const scale: number = pulseModifier * Math.min(stepDuration, 1);
        return {fadePower, shiftDistance, scale};
    }
    setMoveDistance(): void {
        const {posX, posY, slot} = this;
        if(this.directionUpOrLeft) {
            if(this.posX > this.slot[0]) {
                this.moveDistance = posX - slot[0];
            }
            if(this.posY > this.slot[1]) {
                this.moveDistance = posY - slot[1];
            }
        }
        else {
            if(this.posX < this.slot[0]) {
                this.moveDistance = slot[0] - posX;
            }
            if(this.posY < this.slot[1]) {
                this.moveDistance = slot[1] - posY;
            }
        }
    }
    handleDelete(fadePower: number): void {
        this.opacity = Math.floor(((this.opacity * 100) - fadePower)) / 100;
        if(this.opacity <= 0) this.selfDestruct();
    }
    handleMove(shiftDistance: number): void {
        if(this.posX === this.slot[0] && this.posY === this.slot[1]) {
            this.animationStatus.delete('move');
            this.moveDistance = 0;
            return;
        }

        if(this.directionUpOrLeft) {
            if(this.posX > this.slot[0]) this.posX -= shiftDistance;
            if(this.posY > this.slot[1]) this.posY -= shiftDistance;
            // adjust positions in case they come over the border
            if(this.posX < this.slot[0]) this.posX = this.slot[0];
            if(this.posY < this.slot[1]) this.posY = this.slot[1];
        }
        else {
            if(this.posX < this.slot[0]) this.posX += shiftDistance;
            if(this.posY < this.slot[1]) this.posY += shiftDistance;
            // adjust positions in case they come over the border
            if(this.posX > this.slot[0]) this.posX = this.slot[0];
            if(this.posY > this.slot[1]) this.posY = this.slot[1];
        }
    }
    handlePulse(scale: number): void {
        if(this.increaseInSize) this.currentSize += scale;
        else this.currentSize -= scale;

        if(this.currentSize - this.game.config.gridBlockSize >= 20) this.increaseInSize = false;

        if(this.currentSize < this.game.config.gridBlockSize) {
            this.currentSize = this.game.config.gridBlockSize;
            this.animationStatus.delete('pulse');
            this.increaseInSize = true;
        }
    }
    selfDestruct(): void {
        this.game.grid.splice(this.game.grid.indexOf(this), 1);
    }
}