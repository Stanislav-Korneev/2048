import {directionType, gridItemType} from "../models/Game";

interface IPayload {
    source: gridItemType[][]
    direction: directionType
    size: number
}

export default function uniteArrays({ source, direction, size }: IPayload): gridItemType[] {
    let result: gridItemType[] = [];
    let localSource: gridItemType[][] = [...source];

    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
        localSource = source.map(item => item.reverse());
    }

    if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
        result = result.concat(...localSource);
    }

    if (direction === 'ArrowDown' || direction === 'ArrowUp') {
        for (let i = 0; i < size; i++) {
            localSource.forEach((item) => {
                result.push(item[i]);
            })
        }
    }

    return result;
}
