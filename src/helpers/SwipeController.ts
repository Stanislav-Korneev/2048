// Swipe controller encapsulates logic that analyzes swipes on specified element.
// The result is turned into keyup event that is further processed in InputController.
// Works for both mobile and desktop.

type devicesType = 'touch' | 'mouse'
type touchEventValueType = {
    start: 'touchstart' | 'mousedown'
    move: 'touchmove' | 'mousemove'
    end: 'touchend' | 'mouseup'
}
type touchEventsValuesType = {
    [x in devicesType]: touchEventValueType
}

const touchEventsValues: touchEventsValuesType = {
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
}
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
    const touchEvents: touchEventValueType = touchEventsValues[deviceType];

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
        let diffX: number = mouseX - initialX;
        let diffY: number = mouseY - initialY;
        let keyCode: string;
        if (Math.abs(diffY) > Math.abs(diffX)) {
            keyCode = diffY > 0 ? 'ArrowDown' : 'ArrowUp';
        } else {
            keyCode = diffX > 0 ? 'ArrowRight' : 'ArrowLeft';
        }

        target.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            code: keyCode,
        }))

        target.removeEventListener(touchEvents.move, moveHandler);
        target.removeEventListener(touchEvents.end, endHandler);
    }

    function getXY(e: TouchEvent | MouseEvent): void {
        mouseX = (deviceType === 'mouse' ? (e as MouseEvent).pageX : (e as TouchEvent).changedTouches[0].pageX) - rectLeft;
        mouseY = (deviceType === 'mouse' ? (e as MouseEvent).pageY : (e as TouchEvent).changedTouches[0].pageY) - rectTop;
    }
};