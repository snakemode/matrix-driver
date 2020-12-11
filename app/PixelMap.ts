import { DiffValue } from "./types";

export class PixelMap {
    public static *itemsIn(pixelMap: string[]): IterableIterator<DiffValue> {
        for (let y in pixelMap) {

            const row = pixelMap[y].split('');

            for (let x in row) {

                yield {
                    x: parseInt(x),
                    y: parseInt(y),
                    data: row[x]
                };
            }
        }
    }
}
