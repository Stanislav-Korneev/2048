import swipeController from "../helpers/SwipeController.ts";
import {directionType, DOMElementsType, IInterface} from "../helpers/typesAndInterfaces.ts";
import {Game} from "./Game.ts";
import GridBlock from "./GridBlock.ts";

export class Interface implements IInterface {
    private readonly _game: Game
    private readonly _DOMElements: DOMElementsType

    constructor({game, DOMElements}: {
        game: Game
        DOMElements: DOMElementsType
    }) {
        this._game = game;
        this._DOMElements = DOMElements;
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

    setEventListeners(): void {
        // initiate proxy listener for swipes
        swipeController(this.DOMElements.canvas);

        const {newGameButton, undoButton, howToPlayButton} = this.DOMElements;
        newGameButton.addEventListener('click', (): void => this.game.startNewGame());
        undoButton.addEventListener('click', (): void => this.game.undoLastMove());
        howToPlayButton.addEventListener('click', (): void => console.log('howToPlayButtonClick'));

        // listen for key controls and swipes via proxy(swipeController)
        document.addEventListener('keyup', (e: KeyboardEvent): void => {
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
        })
    }
}