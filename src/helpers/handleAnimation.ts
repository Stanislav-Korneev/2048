import {directionType, gridItemType} from "../models/Game";
import parseArray from "./parseArray";
import uniteArrays from "./uniteArrays";

type handleAnimationPayloadType = {
    nodes: NodeListOf<HTMLDivElement>
    oldGrid: gridItemType[]
    newGrid: gridItemType[]
    direction: directionType
    gridSize: number
}

type checkHasNewItemPayloadType = {
    oldGrid: gridItemType[]
    newGrid: gridItemType[]
}

type getSwipeAnimationsPayloadType = {
    oldGrid: gridItemType[]
    newGrid: gridItemType[]
    direction: directionType
    gridSize: number
}

type animateSlidePayloadType = {
    node: HTMLDivElement
    direction: directionType
    slideCount: number
}

export type animationType = {
    slideCount: number,
    type: (`slide` | 'merge' | 'appear' | '')[],
}

export default function handleAnimation({nodes, oldGrid, newGrid, direction, gridSize}:
    handleAnimationPayloadType): void {

    let animations: animationType[] = new Array(newGrid.length).fill(null).map(() => ({slideCount: 0, type: []}));

    const hasNewItem: boolean = checkHasNewItem({oldGrid, newGrid});

    if (!hasNewItem) {
        animations = [...getSwipeAnimations({oldGrid, newGrid, direction, gridSize})];
    }

    if (hasNewItem) {
        const targetIndex: number = newGrid.findIndex((item, index) => item !== oldGrid[index]);
        animations[targetIndex].type.push('appear');
    }

    animations.forEach((item, index) => {
        if (item.type.includes('appear')) animateAppear(nodes[index]);
        if (item.type.includes('merge')) animateMerge(nodes[index]);
        if (item.type.includes('slide')) animateSlide({
            node: nodes[index],
            direction,
            slideCount: item.slideCount,
        });
    })
}

function checkHasNewItem({oldGrid, newGrid}: checkHasNewItemPayloadType): boolean {
    const filteredOldGrid: gridItemType[] = oldGrid.filter(item => item !== null);
    const filteredNewGrid: gridItemType[] = newGrid.filter(item => item !== null);
    return filteredNewGrid.length - filteredOldGrid.length === 1;
}

function getSwipeAnimations({ oldGrid, newGrid, direction, gridSize }: getSwipeAnimationsPayloadType): animationType[] {
    const oldMatrix: gridItemType[][] = parseArray({
        source: oldGrid,
        direction,
        size: gridSize,
    })
    const newMatrix: gridItemType[][] = parseArray({
        source: newGrid,
        direction,
        size: gridSize,
    })
    let slideAnimationsRows: animationType[][] = [];

    newMatrix.forEach((newRow, index) => {
        const oldRow: gridItemType[] = oldMatrix[index];
        let nullCounter: number = 0;
        const slideArr: animationType[] = oldRow.map(item => {
            if (item === null) {
                nullCounter += 1;
                return {slideCount: 0, type: []};
            } else {
                return nullCounter ?
                    {slideCount: nullCounter, type: ['slide']} as animationType :
                    {slideCount: 0, type: []} as animationType;
            }
        })

        for (let i: number = 0; i < oldRow.length - 1; i += 1) {
            if (!oldRow[i]) continue;
            const restArr: gridItemType[] = oldRow.slice(i+1);
            const nextEl = restArr.find(el => el !== null);
            const nextElIndex = restArr.findIndex(el => el !== null);
            if (!nextEl) continue;

            if (oldRow[i] === nextEl) {
                slideArr[i].type.push('merge');
                for (let j = nextElIndex + i + 1; j < oldRow.length; j += 1) {
                    slideArr[j].type.push('slide');
                    slideArr[j].slideCount += 1;
                }
                i += nextElIndex;
            }
        }

        slideAnimationsRows.push(slideArr);
    });

    return uniteArrays({
        source: slideAnimationsRows,
        direction,
        size: gridSize,
    }) as animationType[];
}

function animateAppear(node: HTMLDivElement): void {
    node.style.transform = 'scale(0)';
    node.style.transition = '.1';
    node.style.zIndex = '100';
    let i: number = 0;
    const increase: number = setInterval(() => {
        node.style.transform = `scale(${i / 10})`;
        i += 1;
        if (i > 12) {
            clearInterval(increase);
            const decrease: number = setInterval(() => {
                node.style.transform = `scale(${i / 10})`;
                i -= 1;
                if (i < 10) clearInterval(decrease);
            }, 50);
        }
        node.style.zIndex = '';
    }, 50);
}

function animateMerge(node: HTMLDivElement): void {
    node.style.backgroundColor = 'rgba(0,0,0,0.4)'
    node.style.zIndex = '100';
    setInterval(() => {
        node.style.backgroundColor = '';
        node.style.zIndex = '';
    }, 200)
}
function animateSlide({node, direction, slideCount }: animateSlidePayloadType): void {
    let translateDirection: 'translateY' | 'translateX';
    let slidePX: number;

    if (direction === 'ArrowLeft') {
        translateDirection = 'translateX';
        slidePX = -1 * (slideCount * 72);
    }

    if (direction === 'ArrowRight') {
        translateDirection = 'translateX';
        slidePX = slideCount * 72;
    }

    if (direction === 'ArrowUp') {
        translateDirection = 'translateY';
        slidePX = -1 * (slideCount * 72);
    }

    if (direction === 'ArrowDown') {
        translateDirection = 'translateY';
        slidePX = slideCount * 72;
    }

    node.style.transition = '2s';
    node.style.transform = `${translateDirection}(${slidePX}px)`
    node.style.zIndex = '100';

    setTimeout(() => {
        node.style.transition = '';
        node.style.transform = '';
        node.style.zIndex = '';
    }, 2000)
}
