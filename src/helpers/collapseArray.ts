import {gridItemType} from "../models/Game";

export default function collapseArray(payload: gridItemType[]): gridItemType[] {
    if (payload.every(item => item === null)) return payload;

    let result: gridItemType[] = [...payload];

    result = result.filter(item => item !== null);

    for (let i = 0; i < result.length; i++) {
        if (!result[i] || result[i] !== result[i + 1]) continue;

        result[i]! *= 2;
        result.splice(i + 1, 1);
    }

    while (result.length < payload.length) result.push(null);

    return result;
}
