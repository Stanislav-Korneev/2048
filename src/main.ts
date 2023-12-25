import './style.css'
import inputController from "./modules/InputController.ts";
import {Game} from "./modules/Game.ts";
import {deviceSizeType, gameConfigType, interfaceElementsType} from "./modules/typesAndInterfaces.ts";
import gameConfig from "./gameConfig.json";

// get game config depending on the device
const deviceSize: deviceSizeType = window.screen.width > 768 ? 'l' : 's';
const config: gameConfigType = gameConfig[deviceSize] as gameConfigType;

// get vital elements
const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
const tileSprite: HTMLImageElement = document.getElementById('tiles_sprite') as HTMLImageElement;
const interfaceElements: interfaceElementsType = {
    score: document.getElementById('score') as HTMLSpanElement,
    bestScore: document.getElementById('best-score') as HTMLSpanElement,
    undoButton: document.getElementById('undo-button') as HTMLButtonElement,
    newGameButton: document.getElementById('new-game-button') as HTMLButtonElement,
    howToPlayButton: document.getElementById('how-to-play-button') as HTMLButtonElement,
}

canvas.width = config.canvasSize;
canvas.height = config.canvasSize;

const game: Game = new Game({config, ctx, tileSprite, interfaceElements});
inputController({ game, canvas, ...interfaceElements });
game.init();