import { gridItemType } from "../models/Game";
interface IPayload {
    source: gridItemType[]
    mode: 'horizontal'|'vertical'
    size: number
}

export default function parseArray({ source, mode, size }: IPayload): gridItemType[][] {
    let matrix:  gridItemType[][] = new Array(size).fill(null);

    if (mode === 'horizontal') {
        matrix = matrix.map((_item, index) => {
            return source.slice(index * size, ((index + 1) * size));
        })
    }

    if (mode === 'vertical') {
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

    return matrix;
}
