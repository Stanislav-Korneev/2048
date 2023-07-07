import {directionType, gridItemType} from "../models/Game";
import {animationType} from "./handleAnimation";

type itemTypes = gridItemType | animationType;
type sourceType<T extends itemTypes> = T[][];

interface IPayload<T> {
    source: sourceType<T>
    direction: directionType
    size: number
}

export default function uniteArrays<T extends itemTypes>({ source, direction, size }: IPayload<T>): T[] {
    let result: T[] = [];
    let localSource: sourceType<T> = [...source];

    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
        localSource = source.map(item => item.reverse());
    }

    if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
        result = result.concat(...localSource);
    }

    if (direction === 'ArrowDown' || direction === 'ArrowUp') {
        for (let i: number = 0; i < size; i++) {
            localSource.forEach((item) => {
                result.push(item[i]);
            })
        }
    }

    return result;
}
