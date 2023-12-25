import './style.css'
import inputController from "./modules/InputController.ts";
import {Game} from "./modules/Game.ts";
import {
    deviceSizeType,
    gameConfigType, interfaceElementsType,
} from "./modules/typesAndInterfaces.ts";
import gameConfig from "./gameConfig.json";

// get vital elements
const newGameButton: HTMLButtonElement = document.getElementById('new-game-button') as HTMLButtonElement;
const undoButton: HTMLButtonElement = document.getElementById('undo-button') as HTMLButtonElement;
const howToPlayButton: HTMLButtonElement = document.getElementById('how-to-play-button') as HTMLButtonElement;
const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
const tileSprite: HTMLImageElement = document.getElementById('tiles_sprite') as HTMLImageElement
const score: HTMLSpanElement = document.getElementById('score') as HTMLSpanElement;
const bestScore: HTMLSpanElement = document.getElementById('best-score') as HTMLSpanElement;
const interfaceElements: interfaceElementsType = {
    score,
    bestScore,
    undoButton,
}

// get game config depending on the device
const deviceSize: deviceSizeType = window.screen.width > 768 ? 'l' : 's';
const config: gameConfigType = gameConfig[deviceSize] as gameConfigType;

canvas.width = config.canvasSize;
canvas.height = config.canvasSize;

const game: Game = new Game({
    config: config,
    ctx,
    tileSprite,
    interfaceElements,
});
inputController({ game, canvas, newGameButton, undoButton, howToPlayButton });

game.init();