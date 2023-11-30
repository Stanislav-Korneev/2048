import './style.css'
import inputController from "./modules/InputController.ts";
import {Game} from "./modules/Game.ts";
import {deviceSizeType, interfaceSizesType} from "./modules/typesAndInterfaces.ts";

// get vital elements
const newGameButton: HTMLButtonElement = document.getElementById('new-game-button') as HTMLButtonElement;
const undoButton: HTMLButtonElement = document.getElementById('undo-button') as HTMLButtonElement;
const howToPlayButton: HTMLButtonElement = document.getElementById('how-to-play-button') as HTMLButtonElement;
const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const sizes: interfaceSizesType = {
    s: {
        fieldSize: 290,
        gridBlockSize: 58,
        gridBlockPositions: [20, 84, 148, 212]
    },
    l: {
        fieldSize: 500,
        gridBlockSize: 100,
        gridBlockPositions: [35, 145, 255, 365]
    },
}
const deviceSize: deviceSizeType = window.screen.width > 768 ? 'l' : 's';
canvas.width = sizes[deviceSize].fieldSize;
canvas.height = sizes[deviceSize].fieldSize;

const game: Game = new Game({
    ctx,
    ...sizes[deviceSize],
});
inputController({ game, canvas, newGameButton, undoButton, howToPlayButton });

game.init();