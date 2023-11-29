import './style.css'
import { IGame, Game } from "./modules/Game.ts";
import inputController from "./modules/InputController.ts";

export type directionType = 'left' | 'right' | 'down' | 'up';

const game: IGame = new Game();

inputController(game);