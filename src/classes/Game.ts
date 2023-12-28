import {
    directionType,
    DOMElementsType,
    gameConfigType,
    gridType,
    IGame,
    slotType,
} from "../helpers/typesAndInterfaces.ts";
import GridBlock from "./GridBlock.ts";
import {History} from "./History.ts";
import {Interface} from "./Interface.ts";
export class Game implements IGame {
    private readonly _config: gameConfigType
    private readonly _availableSlots: slotType[]
    private readonly _history: History
    private readonly _interface: Interface
    private _grid: gridType
    private _score: number
    private _moveDirection: directionType
    private _prevFrameTime: number
    private _gameContinuesAfterVictory: boolean

    constructor({config, DOMElements}: {
        config: gameConfigType,
        DOMElements: DOMElementsType,
    }) {
        this._config = config;
        this._history = new History();
        this._interface = new Interface({game: this, DOMElements});
        this._grid = [];
        this._score = 0;
        this._moveDirection = '';
        this._prevFrameTime = 0;
        this._availableSlots = [];
        this._gameContinuesAfterVictory = false;
        config.gridBlockPositions.forEach(slotX => {
            config.gridBlockPositions.forEach(slotY => {
                this._availableSlots.push([slotX, slotY]);
            })
        })
    }

    get config(): gameConfigType {
        return this._config;
    }
    get availableSlots(): slotType[] {
        return this._availableSlots.filter(availableSlot => {
            return !this.grid.some(gridBlock => {
                    return !gridBlock.animationStatus.has('delete') && availableSlot.toString() === gridBlock.slot.toString()
                });
        })
    }
    get history(): History {
        return this._history;
    }
    get interface(): Interface {
        return this._interface;
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
    get gameContinuesAfterVictory(): boolean {
        return this._gameContinuesAfterVictory;
    }
    set gameContinuesAfterVictory(value: boolean) {
        this._gameContinuesAfterVictory = value;
    }

    get parsedRows(): GridBlock[][] {
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
    get isNextMovePossible(): boolean {
        if(this.grid.length < 16) return true;
        const hash: Map<string, number> = new Map();
        const step: number = this.config.gridBlockPositions[1] - this.config.gridBlockPositions[0];
        let hasMove: boolean = false;
        this.grid.forEach(gridItem => {
            hash.set(`${gridItem.slot[0]}-${gridItem.slot[1]}`, gridItem.value);
        })
        hash.forEach((value, key) => {
            const [posX, posY] = key.split('-');
            const rightNeighbour: string = `${+posX + step}-${posY}`;
            const bottomNeighbour: string = `${posX}-${+posY + step}`;
            if(
                (hash.has(rightNeighbour) && hash.get(rightNeighbour) === value) ||
                (hash.has(bottomNeighbour) && hash.get(bottomNeighbour) === value)
            ) hasMove = true;
        })
        return hasMove;
    }
    get has2048(): boolean {
        return this.grid.some(gridItem => gridItem.value === 2048);
    }

    init(): void {
        if(this.history.size) this.loadStateFromHistory();
        else this.startNewGame();
    }
    makeMove(): void {
        const hasMovement: boolean = this.updateBlocks();
        if(!hasMovement) {
            this.interface.inputIsBlocked = false;
            return;
        }
        this.interface.update();
        requestAnimationFrame(this.handleAnimation.bind(this));

        setTimeout(() => {
            this.addNewBlock();
            if(!this.isNextMovePossible) this.handleGameOver(false);
            if(this.has2048 && !this.gameContinuesAfterVictory) this.handleGameOver(true);
            if(this.grid.length > 1) this.history.push({grid: this.grid, score: this.score});
            this.interface.inputIsBlocked = false;
        }, this.config.animationOptions.duration + 50)
    }
    updateBlocks(): boolean {
        // returns whether move has changed anything in the grid
        this.parsedRows.forEach(row => {
            row.forEach((gridBlock, gridBlockIndex) => {
                this.updateBlockData({
                    gridBlock: gridBlock,
                    prevGridBlock: row[gridBlockIndex - 1],
                });
            })
        })
        return this.grid.some(gridItem => gridItem.animationStatus.has('move'));
    }
    updateBlockData({gridBlock, prevGridBlock}: {gridBlock: GridBlock, prevGridBlock: GridBlock }): void {
        // the first block automatically goes to the border position
        if(!prevGridBlock) {
            gridBlock.moveToBorderSlot();
            if(this.checkForMovement(gridBlock)) gridBlock.animationStatus.add('move');
            return;
        }

        // case when merge is possible
        if(prevGridBlock.value === gridBlock.value
            && !prevGridBlock.animationStatus.has('delete')
            && !prevGridBlock.animationStatus.has('pulse')
        ) {
            prevGridBlock.animationStatus.add('pulse');
            prevGridBlock.value *= 2;
            if(this.checkForMovement(prevGridBlock)) prevGridBlock.animationStatus.add('move');
            this.score += prevGridBlock.value;

            gridBlock.animationStatus.add('delete');
            gridBlock.slot = prevGridBlock.slot;
            if(this.checkForMovement(gridBlock)) gridBlock.animationStatus.add('move');
            return;
        }

        // by default, we move block to the neighbourSlot of the previous block
        gridBlock.slot = prevGridBlock.neighbourSlot;
        if(this.checkForMovement(gridBlock)) gridBlock.animationStatus.add('move');
    }
    checkForMovement(gridBlock: GridBlock): boolean {
        return gridBlock.slot.toString() !== `${gridBlock.posX},${gridBlock.posY}`;
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
        requestAnimationFrame(this.handleAnimation.bind(this));
    }
    handleAnimation(timestamp: number): void {
        this.interface.clearCanvas();
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
    loadStateFromHistory(): void {
        const {lastRecord} = this.history;
        if(!lastRecord) return;
        this.grid = lastRecord.grid.map(gridItem => {
            return new GridBlock({game: this, value: gridItem.value, slot: gridItem.slot});
        });
        this.score = lastRecord.score;
        requestAnimationFrame(this.handleAnimation.bind(this));
        this.interface.update();
    }
    undoLastMove(): void {
        this.history.pop();
        this.loadStateFromHistory();
    }
    startNewGame(): void {
        this.history.clearRecords();
        this.gameContinuesAfterVictory = false;
        this.score = 0;
        this.grid = [];
        this.interface.closeDialog();
        this.addNewBlock();
        this.interface.update();
    }
    handleGameOver(hasWon: boolean): void {
        this.history.bestScore = this.score;
        this.interface.update();
        this.interface.dialogName = hasWon ? 'victory' : 'defeat';
        this.interface.setDialogData();
        this.interface.openDialog();
        if(!hasWon) this.history.clearRecords();
    }
}