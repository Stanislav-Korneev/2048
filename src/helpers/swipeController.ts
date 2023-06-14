import {createEvent} from "./eventsController";
import {directionType} from "../models/Game";

type devicesType = 'touch' | 'mouse'
type touchEventsValuesType = {
    [x in devicesType]: {
        start: 'touchstart' | 'mousedown'
        move: 'touchmove' | 'mousemove'
        end: 'touchend' | 'mouseup'
    }
}

const touchEventsValues = {
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
    },
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
    }
} as touchEventsValuesType

const checkDeviceType = (): devicesType => {
    try {
        document.createEvent('TouchEvent')
        return 'touch';
    } catch (e) {
        return 'mouse';
    }
}

export default (target: HTMLElement): void => {
    let mouseX: number = 0;
    let mouseY: number = 0;
    let initialX: number = 0;
    let initialY: number = 0;

    const rectLeft: number = target.getBoundingClientRect().left;
    const rectTop: number = target.getBoundingClientRect().top;

    const deviceType: devicesType = checkDeviceType();
    const touchEvents = touchEventsValues[deviceType];

    target.addEventListener(touchEvents.start, startHandler);

    function startHandler(event: TouchEvent | MouseEvent): void {
        event.preventDefault();
        getXY(event);
        initialX = mouseX;
        initialY = mouseY;

        target.addEventListener(touchEvents.move, moveHandler);
        target.addEventListener(touchEvents.end, endHandler);
    }

    function moveHandler(event: TouchEvent | MouseEvent): void {
        event.preventDefault();
    }

    function endHandler(event: TouchEvent | MouseEvent): void {
        event.preventDefault();
        getXY(event);
        let diffX = mouseX - initialX;
        let diffY = mouseY - initialY;
        let direction: directionType;
        if (Math.abs(diffY) > Math.abs(diffX)) {
            direction = diffY > 0 ? 'ArrowDown' : 'ArrowUp';
        } else {
            direction = diffX > 0 ? 'ArrowRight' : 'ArrowLeft';
        }

        createEvent({
            type: 'initiate-move',
            detail: {
                direction,
            }
        })

        target.removeEventListener(touchEvents.move, moveHandler);
        target.removeEventListener(touchEvents.end, endHandler);
    }

    function getXY(e: TouchEvent | MouseEvent): void {
        mouseX = (deviceType === 'mouse' ? (e as MouseEvent).pageX : (e as TouchEvent).changedTouches[0].pageX) - rectLeft;
        mouseY = (deviceType === 'mouse' ? (e as MouseEvent).pageY : (e as TouchEvent).changedTouches[0].pageY) - rectTop;
    }
};
