import './style.css'
import Game from "./models/Game";
import { initiateListeners } from "./helpers/eventsController";

const game: Game = new Game();
initiateListeners(game);
game.init(false);
