import './style.css'
import {directionType, IGameData} from "./models/Game";
import Game from "./models/Game";

const settings: IGameData = {
    size: 5,
    score: 0,
    currentGrid: []
}

const game = new Game(settings);

game.init();

document.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    game.makeMove(e.key as directionType);
})
