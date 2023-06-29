import { gridItemType, historyItemType } from "../models/Game";

export default function collapseArray(payload: gridItemType[]): historyItemType {
    let result = {
        grid: [...payload],
        score: 0,
    }

    if (payload.every(item => item === null)) return result;

    let { grid } = result;

    grid = grid.filter(item => item !== null);

    for (let i = 0; i < grid.length; i++) {
        if (!grid[i] || grid[i] !== grid[i + 1]) continue;

        grid[i] *= 2;
        grid.splice(i + 1, 1);

        result.score += grid[i]!;
    }

    while (grid.length < payload.length) grid.push(null);

    result.grid = grid;

    return result;
}
