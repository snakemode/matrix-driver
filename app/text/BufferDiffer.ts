export class BufferDiffer {
    public static createDelta(first: string[], second: string[]): string[] {
        const delta = [];

        for (let y in first) {
            const row = first[y].split('');
            const newRow = second[y].split('');

            let rowDelta = "";

            for (let x in row) {
                const firstValue = row[x];
                const secondValue = newRow[x];

                if (!firstValue || !secondValue) {
                    rowDelta += " "; // Mismatched lengths, don't fill up with garbage
                    continue;
                }

                if (firstValue === secondValue) {
                    rowDelta += " "; // Row hasn't changed, doesn't need an update.
                    continue;
                }

                if (firstValue === " " && secondValue !== " ") {
                    rowDelta += "+"; // Row has a value where there was none before, addition!
                    continue;
                }

                if (firstValue !== " " && secondValue === " ") {
                    rowDelta += "-"; // Row has lost its value, subtraction!
                    continue;
                }
            }

            delta.push(rowDelta);
        }

        return delta;
    }
}