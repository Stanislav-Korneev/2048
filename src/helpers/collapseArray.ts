import {gridItemType} from "../models/Game";

export default function collapseArray(payload: gridItemType[]): gridItemType[] {
    if (payload.every(item => item === null)) return payload;

    const result = [...payload];

    while (result[0] === null) {
        result.shift();
        result.push(null);
    }

    result.forEach((item, index) => {
        if (item && item === result[index - 1]) {
            result[index - 1] = item * 2;
            item = null;
        }
    })

    return result;
}
