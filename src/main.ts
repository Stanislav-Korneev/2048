import './style.css'
import {directionType, gridItemEventType, IGameData, scoreEventType} from "./models/Game";
import Game from "./models/Game";

const settings: IGameData = {
    size: 5,
    score: 0,
    currentGrid: []
}


document.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    game.makeMove(e.key as directionType);
})

document.addEventListener('grid-item-change', ((e: gridItemEventType) => {
    const { targetId, newValue } = e.detail;
    const target = document.getElementById(targetId);
    if (target) target.textContent = newValue;
}) as EventListener)

document.addEventListener('score-change', ((e: scoreEventType) => {
    console.log('listening score, ', e)
    const target = document.getElementById('score');
    if (target) target.textContent = `score: ${ e.detail.newScore }`;
}) as EventListener)

document.getElementById('back-button')?.addEventListener('click', () => {
    game.updateHistory('pop');
})

const game = new Game(settings);
game.init();
