import './style.css'
import {Game} from "./classes/Game.ts";
import {deviceSizeType, DOMElementsType, gameConfigType} from "./helpers/typesAndInterfaces.ts";
import gameConfig from "./helpers/gameConfig.json";

const deviceSize: deviceSizeType = window.screen.width > 768 ? 'l' : 's';
const config: gameConfigType = gameConfig[deviceSize] as gameConfigType;

const DOMElements: DOMElementsType = {
    canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
    tileSprite: document.getElementById('tiles_sprite') as HTMLImageElement,
    score: document.getElementById('score') as HTMLSpanElement,
    bestScore: document.getElementById('best-score') as HTMLSpanElement,
    undoButton: document.getElementById('undo-button') as HTMLButtonElement,
    newGameButton: document.getElementById('new-game-button') as HTMLButtonElement,
    howToPlayButton: document.getElementById('how-to-play-button') as HTMLButtonElement,
    dialog: document.getElementById('dialog') as HTMLDivElement,
    dialogButton: document.getElementById('dialog-button') as HTMLButtonElement,
}

DOMElements.canvas.width = config.canvasSize;
DOMElements.canvas.height = config.canvasSize;

const game: Game = new Game({config, DOMElements});
game.init();