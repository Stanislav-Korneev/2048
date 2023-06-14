import Game, {directionType, gridItemType} from "../models/Game";
import swipeController from "./swipeController";

type gridChangeDetailType = { newGrid: gridItemType[] }
type scoreDetailType = { newScore: number }
type initiateMoveDetailType = { direction: directionType }
type gridChangeType = CustomEvent<gridChangeDetailType>
type scoreType = CustomEvent<scoreDetailType>
type initiateMoveType = CustomEvent<initiateMoveDetailType>

type createEventPayloadType = {
    nodeId?: string
    type: string
    detail: gridChangeDetailType | scoreDetailType | initiateMoveDetailType
}

export function createEvent({ nodeId = '', type, detail }: createEventPayloadType): void {
    const eventNode = document.getElementById(nodeId) ?? document;

    const event: CustomEvent<typeof detail>= new CustomEvent(type, {
        bubbles: true,
        detail: detail,
    })

    eventNode.dispatchEvent(event);
}

export function initiateListeners(game: Game): void {
    document.addEventListener('keydown', keydownHandler);

    document.addEventListener('initiate-move', ((e: initiateMoveType) => initiateMoveHandler({ e, game })) as EventListener);

    document.addEventListener('grid-change', gridItemChangeHandler as EventListener);

    document.addEventListener('score-change', scoreChangeHandler as EventListener);

    const grid = document.getElementById('grid')!;
    swipeController(grid);

    const backButton = document.getElementById('back-button');
    backButton?.addEventListener('click', () => backButtonHandler(game));

    const newGameButton = document.getElementById('new-game-button');
    newGameButton?.addEventListener('click', () => newGameButtonHandler(game));
}

function keydownHandler(e: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    createEvent({
        type: 'initiate-move',
        detail: {
            direction: e.key as directionType,
        }
    })
}

function initiateMoveHandler({ e, game }: { e: initiateMoveType, game: Game }): void {
    game.makeMove(e.detail.direction);
}

function gridItemChangeHandler(e: gridChangeType): void {
    const { newGrid } = e.detail;
    const gridNodes = document.querySelectorAll('.grid-item');
    gridNodes.forEach((item, index) => {
        item.textContent = `${newGrid[index] ?? ''}`;
    });
}

function scoreChangeHandler(e: scoreType): void {
    const target = document.getElementById('score');
    if (target) target.textContent = `score: ${ e.detail.newScore }`;
}

function backButtonHandler(game: Game): void {
    game.updateHistory();
}

function newGameButtonHandler(game: Game): void {
    game.initNewGame();
}
