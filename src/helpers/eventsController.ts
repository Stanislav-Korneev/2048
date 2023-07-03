import Game, {currentDirectionType, directionType, gridItemType} from "../models/Game";
import swipeController from "./swipeController";
import handleAnimation from "./handleAnimation";

type gridChangeDetailType = { oldGrid: gridItemType[], newGrid: gridItemType[], direction: currentDirectionType, gridSize: number, newGridItemIndex: number }
type scoreDetailType = { newScore: number }
type initiateMoveDetailType = { direction: directionType }
type backButtonSwitchDetailType = { status: boolean }

type gridChangeType = CustomEvent<gridChangeDetailType>
type scoreType = CustomEvent<scoreDetailType>
type initiateMoveType = CustomEvent<initiateMoveDetailType>
type backButtonSwitchType = CustomEvent<backButtonSwitchDetailType>

type createEventPayloadType = {
    nodeId?: string
    type: 'grid-change' | 'score-change' | 'initiate-move' | 'back-button-switch'
    detail: gridChangeDetailType | scoreDetailType | initiateMoveDetailType | backButtonSwitchDetailType
}

export function createEvent({ nodeId = '', type, detail }: createEventPayloadType): void {
    const targetNode: HTMLElement | null = document.getElementById(nodeId as string);
    const eventNode: HTMLElement | Document = targetNode ?? document;

    const event: CustomEvent<typeof detail> = new CustomEvent(type, {
        bubbles: true,
        detail,
    })

    eventNode.dispatchEvent(event);
}

export function initiateListeners(game: Game): void {
    document.addEventListener('keydown', keydownHandler);

    document.addEventListener('initiate-move', ((e: initiateMoveType) => initiateMoveHandler({ e, game })) as EventListener);

    document.addEventListener('grid-change', gridItemChangeHandler as EventListener);

    document.addEventListener('score-change', scoreChangeHandler as EventListener);

    document.addEventListener('back-button-switch', backButtonSwitcher as EventListener);

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
    const { oldGrid, newGrid, direction, gridSize, newGridItemIndex } = e.detail;
    const gridNodes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.grid-item');

    if (direction === 'historyRollBack' || direction === '') {
        gridNodes.forEach((item, index) => {
            item.textContent = `${newGrid[index] ?? ''}`;
        });
        return;
    }

    handleAnimation({
        nodes: gridNodes,
        oldGrid,
        newGrid,
        direction: direction as directionType,
        gridSize,
        newGridItemIndex,
    });
    setTimeout(() => {
        gridNodes.forEach((item, index) => {
            item.textContent = `${newGrid[index] ?? ''}`;
        });
    }, 2000)
}

function scoreChangeHandler(e: scoreType): void {
    const target = document.getElementById('score');
    if (target) target.textContent = `score: ${ e.detail.newScore }`;
}

function backButtonHandler(game: Game): void {
    game.rollBackMove();
}

function backButtonSwitcher(e: backButtonSwitchType): void {
    const { status } = e.detail;
    const button = document.getElementById('back-button') as HTMLButtonElement;

    if (!status) button.setAttribute('disabled', '');
    if (status) button.removeAttribute('disabled');
}

function newGameButtonHandler(game: Game): void {
    game.initNewGame();
}
