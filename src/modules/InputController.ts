// Input controller processes all key and button events in the game

import swipeController from "./SwipeController.ts";
import {directionType, IGame} from "./typesAndInterfaces.ts";

export default ({ game, canvas, newGameButton, undoButton, howToPlayButton }: {
    game: IGame,
    canvas: HTMLCanvasElement,
    newGameButton: HTMLButtonElement,
    undoButton: HTMLButtonElement,
    howToPlayButton: HTMLButtonElement,
}): void => {
    // initiate proxy listener for swipes
    swipeController(canvas);

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

    newGameButton.addEventListener('click', (e: MouseEvent): void => {
        e.preventDefault();
        console.log('newGameButtonClick');
    })

    undoButton.addEventListener('click', (e: MouseEvent): void => {
        e.preventDefault();
        console.log('undoButtonClick');
    })

    howToPlayButton.addEventListener('click', (e: MouseEvent): void => {
        e.preventDefault();
        console.log('howToPlayButtonClick');
    })
}
