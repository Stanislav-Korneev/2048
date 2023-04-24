import {directionType, gridItemType} from "../models/Game";
interface IPayload {
    source: gridItemType[]
    direction: directionType
    size: number
}

export default function parseArray({ source, direction, size }: IPayload): gridItemType[][] {
    let matrix:  gridItemType[][] = new Array(size).fill(null);

    if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
        matrix = matrix.map((_item, index) => {
            return source.slice(index * size, ((index + 1) * size));
        })
    }

    if (direction === 'ArrowDown' || direction === 'ArrowUp') {
        matrix = matrix.map(() => {
            return new Array(size).fill(null);
        })
        matrix = matrix.map((item, index) => {
            return item.map((_subItem, subIndex) => {
                const targetIndex = (subIndex * size) + index;
                return source[targetIndex];
            })
        })
    }

    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
        matrix = matrix.map(item => {
            return item.reverse();
        })
    }

    return matrix;
}
