import swipeController from "../helpers/SwipeController.ts";
import {dialogDataType, dialogType, directionType, DOMElementsType, IInterface} from "../helpers/typesAndInterfaces.ts";
import {Game} from "./Game.ts";
import GridBlock from "./GridBlock.ts";

export class Interface implements IInterface {
    private readonly _game: Game
    private readonly _DOMElements: DOMElementsType
    private _dialog: dialogType

    constructor({game, DOMElements}: {
        game: Game
        DOMElements: DOMElementsType
    }) {
        this._game = game;
        this._DOMElements = DOMElements;
        // default and most probable value just to make things a little more simple
        this._dialog = 'defeat';
        this.setEventListeners();
    }

    get game(): Game {
        return this._game;
    }
    get DOMElements(): DOMElementsType {
        return this._DOMElements;
    }
    get ctx(): CanvasRenderingContext2D {
        return this.DOMElements.canvas.getContext('2d')!;
    }
    get dialog(): dialogType {
        return this._dialog;
    }
    set dialog(value: dialogType) {
        this._dialog = value;
    }
    get dialogData(): dialogDataType {
        return this.game.config.dialogData[this.dialog];
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

    setDialogData(): void {
        const [title, textContent, dialogButton] = this.DOMElements.dialog.children;
        title.textContent = this.dialogData.title;
        textContent.textContent = this.dialogData.textContent ?? '';
        dialogButton.textContent = this.dialogData.buttonText;
    }

    openDialog(): void {
        const {dialog} = this.DOMElements;
        // by default opacity is 0 to hide slide-out animation
        dialog.style.opacity = '1';
        dialog.classList.remove('slide-out');
        dialog.classList.add('slide-in')
    }

    closeDialog(): void {
        const {dialog} = this.DOMElements;
        dialog.classList.remove('slide-in');
        dialog.classList.add('slide-out')
    }

    handleHowToPlayButton(): void {
        this.dialog = 'howToPlay';
        this.setDialogData();
        this.openDialog();
    }
    handleDialogueButton(): void {
        if(this.dialog === 'defeat') this.game.startNewGame();
        else this.closeDialog();
    }
    handleKeyUp(e: KeyboardEvent): void {
        const keyMap: Map<string, directionType> = new Map([
            ['ArrowUp', 'up'],
            ['ArrowDown', 'down'],
            ['ArrowRight', 'right'],
            ['ArrowLeft', 'left'],
        ]);
        if(keyMap.has(e.code)) {
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
        dialogButton.addEventListener('click', () => this.handleDialogueButton())
        document.addEventListener('keyup', (e: KeyboardEvent): void => this.handleKeyUp(e))
    }
}