import Game, { directionType } from "../models/Game";

type gridItemEventDetailType = { targetId: string, newValue: string }
type scoreEventDetailType = { newScore: number }
type gridItemEventType = CustomEvent<gridItemEventDetailType>
type scoreEventType = CustomEvent<scoreEventDetailType>

type createEventPayloadType = {
    nodeId?: string
    type: string
    detail: gridItemEventDetailType | scoreEventDetailType
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
    const backButton = document.getElementById('back-button');

    document.addEventListener('keydown', (e: KeyboardEvent) => keydownHandler({ e, game }));

    document.addEventListener('grid-item-change', ((e: gridItemEventType) => gridItemChangeHandler(e)) as EventListener);

    document.addEventListener('score-change', ((e: scoreEventType) => scoreChangeHandler(e)) as EventListener);

    backButton?.addEventListener('click', () => backButtonHandler(game));
}

function keydownHandler({ e, game }: { e: KeyboardEvent, game: Game }): void {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    game.makeMove(e.key as directionType);
}

function gridItemChangeHandler(e: gridItemEventType): void {
    const { targetId, newValue } = e.detail;
    const target = document.getElementById(targetId);
    if (target) target.textContent = newValue;
}

function scoreChangeHandler(e: scoreEventType): void {
    const target = document.getElementById('score');
    if (target) target.textContent = `score: ${ e.detail.newScore }`;
}

function backButtonHandler(game: Game): void {
    game.updateHistory('pop');
}
