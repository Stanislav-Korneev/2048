import swipeController from "../helpers/SwipeController.ts";
import {dialogDataType, dialogType, directionType, DOMElementsType, IInterface} from "../helpers/typesAndInterfaces.ts";
import {Game} from "./Game.ts";
import GridBlock from "./GridBlock.ts";

export class Interface implements IInterface {
    private readonly _game: Game
    private readonly _DOMElements: DOMElementsType
    private _dialogName: dialogType
    private _inputIsBlocked: boolean

    constructor({game, DOMElements}: {
        game: Game
        DOMElements: DOMElementsType
    }) {
        this._game = game;
        this._DOMElements = DOMElements;
        this._dialogName = '';
        this._inputIsBlocked = false;
        this.setEventListeners();
    }

    get game(): Game {
        return this._game;
    }
    get DOMElements(): DOMElementsType {
        return this._DOMElements;
    }
    get dialogName(): dialogType {
        return this._dialogName;
    }
    set dialogName(value: dialogType) {
        this._dialogName = value;
    }
    get inputIsBlocked(): boolean {
        return this._inputIsBlocked;
    }
    set inputIsBlocked(value: boolean) {
        this._inputIsBlocked = value;
    }
    get ctx(): CanvasRenderingContext2D {
        return this.DOMElements.canvas.getContext('2d')!;
    }
    get dialogData(): dialogDataType | undefined {
        if(this.dialogName === '') return undefined;
        return this.game.config.dialogData[this.dialogName];
    }

    update(): void {
        const {score, bestScore, undoButton} = this.DOMElements;
        score.textContent = this.game.score.toString();
        bestScore.textContent = this.game.history.bestScore.toString();
        undoButton.disabled = this.game.history.size < 2;
    }
    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.game.config.canvasSize, this.game.config.canvasSize);
    }
    drawBlock(gridBlock: GridBlock): void {
        const {opacity, tileSpritePos, posX, posY, currentSize} = gridBlock;
        this.ctx.globalAlpha = opacity;
        this.ctx.drawImage(this.DOMElements.tileSprite, tileSpritePos, 0, 268, 270, posX, posY, currentSize, currentSize);
    }
    updateDialogData(): void {
        if(!this.dialogData) return;
        const [title, textContent, dialogButton] = this.DOMElements.dialog.children;
        title.textContent = this.dialogData.title;
        textContent.textContent = this.dialogData.textContent ?? '';
        dialogButton.textContent = this.dialogData.buttonText;
    }
    openDialog(): void {
        this.updateDialogData();
        const {dialog, undoButton, howToPlayButton} = this.DOMElements;
        // by default opacity is 0 to hide slide-out animation
        dialog.style.opacity = '1';
        dialog.classList.remove('slide-out');
        dialog.classList.add('slide-in');
        undoButton.disabled = true;
        if(this.dialogName !== 'howToPlay') howToPlayButton.disabled = true;
        this.inputIsBlocked = true;
    }
    closeDialog(): void {
        const {dialog, undoButton, howToPlayButton} = this.DOMElements;
        this.dialogName = '';
        dialog.classList.remove('slide-in');
        dialog.classList.add('slide-out');
        undoButton.disabled = false;
        howToPlayButton.disabled = false;
        this.inputIsBlocked = false;
    }
    handleHowToPlayButton(): void {
        if(this.dialogName === 'howToPlay') {
            this.closeDialog();
            return;
        }
        this.dialogName = 'howToPlay';
        this.openDialog();
    }
    handleDialogueButton(): void {
        if(this.dialogName === 'defeat') this.game.startNewGame();
        if(this.dialogName === 'victory') this.game.gameContinuesAfterVictory = true;
        this.closeDialog();
    }
    handleKeyUp(e: KeyboardEvent): void {
        const keyMap: Map<string, directionType> = new Map([
            ['ArrowUp', 'up'],
            ['ArrowDown', 'down'],
            ['ArrowRight', 'right'],
            ['ArrowLeft', 'left'],
        ]);
        if(keyMap.has(e.code)) e.preventDefault();
        if(keyMap.has(e.code) && !this.inputIsBlocked) {
            this.inputIsBlocked = true;
            this.game.moveDirection = keyMap.get(e.code)!;
            this.game.makeMove();
        }
    }
    setEventListeners(): void {
        // initiate proxy listener for swipes
        swipeController(this.DOMElements.canvas);

        const {
            newGameButton,
            undoButton,
            howToPlayButton,
            dialogButton
        } = this.DOMElements;

        newGameButton.addEventListener('click', (): void => this.game.startNewGame());
        undoButton.addEventListener('click', (): void => this.game.undoLastMove());
        howToPlayButton.addEventListener('click', (): void => this.handleHowToPlayButton());
        dialogButton.addEventListener('click', () => this.handleDialogueButton());
        document.addEventListener('keydown', (e: KeyboardEvent): void => this.handleKeyUp(e));
    }
}