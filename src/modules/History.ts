import {gridType, historyRecordType, IHistory} from "./typesAndInterfaces.ts";

export class History implements IHistory {
    get bestScore(): number {
        return Number(localStorage.getItem('best-score')) ?? 0;
    }
    set bestScore(value: number) {
        if(value < this.bestScore) return;
        localStorage.setItem('best-score', value.toString());
    }
    get records(): historyRecordType[] {
        return JSON.parse(localStorage.getItem('history') ?? '[]');
    }
    set records(value: historyRecordType[]) {
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
        const newRecords: historyRecordType[] = this.records;
        newRecords.push(newHistoryRecord);
        if (newRecords.length > 3) newRecords.shift();
        this.records = newRecords;
    }
    pop(): historyRecordType | undefined {
        return this.records.pop();
    }
}