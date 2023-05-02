import Game, {directionType, gridItemType} from "../models/Game";

type gridChangeDetailType = { newGrid: gridItemType[] }
type scoreDetailType = { newScore: number }
type gridChangeType = CustomEvent<gridChangeDetailType>
type scoreType = CustomEvent<scoreDetailType>

type createEventPayloadType = {
    nodeId?: string
    type: string
    detail: gridChangeDetailType | scoreDetailType
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
    document.addEventListener('keydown', (e: KeyboardEvent) => keydownHandler({ e, game }));

    document.addEventListener('grid-change', ((e: gridChangeType) => gridItemChangeHandler(e)) as EventListener);

    document.addEventListener('score-change', ((e: scoreType) => scoreChangeHandler(e)) as EventListener);

    const backButton = document.getElementById('back-button');
    backButton?.addEventListener('click', () => backButtonHandler(game));

    const newGameButton = document.getElementById('new-game-button');
    newGameButton?.addEventListener('click', () => newGameButtonHandler(game));
}

function keydownHandler({ e, game }: { e: KeyboardEvent, game: Game }): void {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    game.makeMove(e.key as directionType);
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
