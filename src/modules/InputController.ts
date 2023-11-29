// Input controller processes all key and button events in the game

import swipeController from "./SwipeController.ts";
import {directionType} from "../main.ts";
import { IGame } from "./Game.ts";

export default (game: IGame): void => {
    // get button elements
    const newGameButton: HTMLElement | null = document.getElementById('new-game-button');
    const undoButton: HTMLElement | null = document.getElementById('undo-button');
    const howToPlayButton: HTMLElement | null = document.getElementById('how-to-play-button');

    // initiate proxy listener for swipes
    const canvas: HTMLElement | null = document.getElementById('game-canvas');
    if(canvas) swipeController(canvas);
    // swipeController(game.canvas);

    // listen for key controls and swipes via proxy(swipeController)
    document.addEventListener('keyup', (e: KeyboardEvent): void => {
        const keyMap: Map<string, directionType> = new Map([
            ['ArrowUp', 'up'],
            ['ArrowDown', 'down'],
            ['ArrowRight', 'right'],
            ['ArrowLeft', 'left'],
        ]);
        if(keyMap.has(e.code)) {
            console.log('key listener', keyMap.get(e.code));
            console.log(game);
        }
    })

    if(newGameButton) {
        newGameButton.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            console.log('newGameButtonClick');
        })
    }

    if(undoButton) {
        undoButton.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            console.log('undoButtonClick');
        })
    }

    if(howToPlayButton) {
        howToPlayButton.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            console.log('howToPlayButtonClick');
        })
    }
}