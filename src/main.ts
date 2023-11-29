import './style.css'
import { IGame, Game } from "./modules/Game.ts";
import inputController from "./modules/InputController.ts";

// get vital elements
const newGameButton: HTMLButtonElement = document.getElementById('new-game-button') as HTMLButtonElement;
const undoButton: HTMLButtonElement = document.getElementById('undo-button') as HTMLButtonElement;
const howToPlayButton: HTMLButtonElement = document.getElementById('how-to-play-button') as HTMLButtonElement;
const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const game: IGame = new Game(ctx);
inputController({ game, canvas, newGameButton, undoButton, howToPlayButton });