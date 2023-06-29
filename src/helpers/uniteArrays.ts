import {directionType, gridItemType} from "../models/Game";
import {animationType} from "./handleAnimation";

interface IPayload {
    source: sourceType
    direction: directionType
    size: number
}
type sourceType = (gridItemType | animationType)[][]
type resultType = (gridItemType | animationType)[]

export default function uniteArrays({ source, direction, size }: IPayload): resultType {
    let result: resultType = [];
    let localSource: sourceType = [...source];

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
