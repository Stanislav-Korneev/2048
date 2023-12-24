import {gridType, historyRecordType, IHistory} from "./typesAndInterfaces.ts";

export class History implements IHistory {
    get bestScore(): number {
        return Number(localStorage.getItem('best-score')) ?? 0;
    }
    set bestScore(value: number) {
        if(value < this.bestScore) return;
        localStorage.setItem('best-score', value.toString());
    }
    get history(): historyRecordType[] {
        return JSON.parse(localStorage.getItem('history') ?? '[]');
    }
    set history(value: historyRecordType[]) {
        localStorage.setItem('history', JSON.stringify(value));
    }

    push({grid, score}: {grid: gridType, score: number}): void {
        const newHistoryRecord: historyRecordType = {
            grid: grid.map(gridBlock => ({
                value: gridBlock.value,
                slot: gridBlock.slot,
            })),
            score,
        }
        const newHistory: historyRecordType[] = this.history;
        newHistory.push(newHistoryRecord);
        if (newHistory.length > 3) newHistory.shift();
        this.history = newHistory;
    }
    pop(): historyRecordType | undefined {
        return this.history.pop();
    }
}