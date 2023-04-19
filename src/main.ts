import './style.css'
import { IGameData } from "./models/Game";
import Game from "./models/Game";

const settings: IGameData = {
    size: 5,
    score: 0,
    currentGrid: []
}

const game = new Game(settings);

game.init();
