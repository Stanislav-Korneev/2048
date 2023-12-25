import {
    directionType,
    gameConfigType,
    gridType,
    IGame,
    interfaceElementsType,
    slotType,
} from "./typesAndInterfaces.ts";
import GridBlock from "./GridBlock.ts";
import {History} from "./History.ts";
export class Game implements IGame {
    private readonly _config: gameConfigType
    private readonly _ctx: CanvasRenderingContext2D
    private readonly _tileSprite: HTMLImageElement
    private readonly _interfaceElements: interfaceElementsType
    private readonly _availableSlots: slotType[]
    private readonly _history: History
    private _grid: gridType
    private _score: number
    private _moveDirection: directionType
    private _prevFrameTime: number

    constructor({config, ctx, tileSprite, interfaceElements}: {
        config: gameConfigType,
        ctx: CanvasRenderingContext2D,
        tileSprite: HTMLImageElement
        interfaceElements: interfaceElementsType
    }) {
        this._config = config;
        this._ctx = ctx;
        this._tileSprite = tileSprite;
        this._interfaceElements = interfaceElements
        this._history = new History();
        this._grid = [];
        this._score = 0;
        this._moveDirection = '';
        this._prevFrameTime = 0;
        this._availableSlots = [];
        config.gridBlockPositions.forEach(slotX => {
            config.gridBlockPositions.forEach(slotY => {
                this._availableSlots.push([slotX, slotY]);
            })
        })
    }

    get config(): gameConfigType {
        return this._config;
    }
    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }
    get tileSprite(): HTMLImageElement {
        return this._tileSprite;
    }
    get interfaceElements(): interfaceElementsType {
        return this._interfaceElements;
    }
    get availableSlots(): slotType[] {
        return this._availableSlots.filter(availableSlot => {
            return !this.grid
                .some(gridBlock => availableSlot.toString() === gridBlock.slot.toString());
        })
    }
    get history(): History {
        return this._history;
    }
    get grid(): gridType {
        return this._grid;
    }
    set grid(value: gridType) {
        this._grid = value;
    }
    get score(): number {
        return this._score;
    }
    set score(value: number) {
        this._score = value;
        this.history.bestScore = value;
    }
    get moveDirection(): directionType {
        return this._moveDirection;
    }
    set moveDirection(value: directionType) {
        this._moveDirection = value;
    }
    get prevFrameTime(): number {
        return this._prevFrameTime;
    }
    set prevFrameTime(value: number) {
        this._prevFrameTime = value;
    }

    // auxiliary getters dependant on class properties
    get parsedRows() {
        // so here we parse all our gridItems in 2d array.
        // if we move left or right - the movement axis is 'X'. So block's coordinate on 'X' axis
        // will be 'mainPos' and 'secondaryPos' will be on 'Y' axis.
        // so we can filter gridItems to different rows by their 'secondaryPos'.
        // inside those rows we sort gridItems by 'mainPos' depending on the direction.
        const rows: GridBlock[][] = [];
        this.config.gridBlockPositions.forEach(pos => {
            const row: GridBlock[] = this.grid
                .filter(gridBlock => gridBlock.secondaryPos === pos)
                .sort((a, b) => {
                    return (this.moveDirection === 'up' || this.moveDirection === 'left')
                        ? a.mainPos - b.mainPos
                        : b.mainPos - a.mainPos;
                })
            if(row.length) rows.push(row);
        })
        return rows;
    }

    init(): void {
        if(this.history.size) this.loadStateFromHistory();
        else this.makeMove();
    }
    makeMove(): void {
        if (!this.checkErrors()) return;
        this.updateBlocks();
        this.addNewBlock();
        requestAnimationFrame(this.handleAnimation.bind(this));
        if(this.grid.length > 1) this.history.push({grid: this.grid, score: this.score});
        this.updateInterface();
    }
    checkErrors(): boolean {
        return this.grid.length !== 16;
    }
    updateBlocks(): void {
        this.parsedRows.forEach(row => {
            row.forEach((gridBlock, gridBlockIndex) => {
                this.updateBlockData({
                    gridBlock: gridBlock,
                    prevGridBlock: row[gridBlockIndex - 1],
                });
            })
        })
    }
    updateBlockData({gridBlock, prevGridBlock}: {gridBlock: GridBlock, prevGridBlock: GridBlock }): void {
        // any block potentially moves, so it gets 'move' status. If there is eventually no movement that's not a problem
        gridBlock.animationStatus.add('move');
        // the first block automatically goes to the border position
        if(!prevGridBlock) {
            gridBlock.moveToBorderSlot();
            return;
        }

        // case when merge is possible
        if(prevGridBlock.value === gridBlock.value
            && !prevGridBlock.animationStatus.has('delete')
            && !prevGridBlock.animationStatus.has('pulse')
        ) {
            prevGridBlock.animationStatus.add('pulse');
            prevGridBlock.value *= 2;
            this.score += prevGridBlock.value;
            gridBlock.animationStatus.add('delete');
            gridBlock.slot = prevGridBlock.slot;
            return;
        }

        // by default, we move block to the neighbourSlot of the previous block
        gridBlock.slot = prevGridBlock.neighbourSlot;
    }
    addNewBlock(): void {
        const value: 2|4 = (Math.random() * (11 - 1) + 1) < 9 ? 2 : 4;
        const slot: slotType = this.availableSlots[Math.floor(Math.random()*this.availableSlots.length)];
        const newBlock: GridBlock = new GridBlock({
            game: this,
            value,
            slot,
        });
        this.grid.push(newBlock);
    }
    handleAnimation(timestamp: number): void {
        this.ctx.clearRect(0, 0, this.config.canvasSize, this.config.canvasSize);
        if(this.prevFrameTime === 0) this.prevFrameTime = timestamp;
        const stepDuration: number = (timestamp - this.prevFrameTime) / (this.config.animationOptions.duration);

        this.grid.forEach(gridBlock => gridBlock.update(stepDuration));

        if(this.grid.some(gridBlock => gridBlock.animationStatus.size)) {
            requestAnimationFrame(this.handleAnimation.bind(this));
            this.prevFrameTime = timestamp;
        } else {
            this.prevFrameTime = 0;
        }
    }
    updateInterface(): void {
        const {score, bestScore, undoButton} = this.interfaceElements;
        score.textContent = this.score.toString();
        bestScore.textContent = this.history.bestScore.toString();
        undoButton.disabled = this.history.size < 2;
    }
    loadStateFromHistory(): void {
        const {lastRecord} = this.history;
        if(!lastRecord) return;
        this.grid = lastRecord.grid.map(gridItem => {
            return new GridBlock({game: this, value: gridItem.value, slot: gridItem.slot});
        });
        this.score = lastRecord.score;
        requestAnimationFrame(this.handleAnimation.bind(this));
        this.updateInterface();
    }
    undoLastMove(): void {
        this.history.pop();
        this.loadStateFromHistory();
    }
    startNewGame(): void {
        this.history.clearRecords();
        this.grid = [];
        this.init();
    }
    handleGameOver(): void {}
}