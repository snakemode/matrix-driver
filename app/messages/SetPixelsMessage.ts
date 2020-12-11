import { PixelValue } from "../types";
import { ResolvedPixelValue } from "./ResolvedPixelValue";

export class SetPixelsMessage {
    public palette: any[]; // Need to commit to a type here - either RGB or Hex really at this point.
    public pixelValues: ResolvedPixelValue[];

    constructor() {
        this.palette = [];
        this.pixelValues = [];
    }

    public static fromPixelValueCollection(values: PixelValue[]): SetPixelsMessage {

        const defaultColor = "#FFFFFF";
        const allUsedPixelColors = values.map(pixel => pixel.color ?? defaultColor);
        const palette = [...new Set(allUsedPixelColors)];

        const protoMessage = new SetPixelsMessage();

        protoMessage.palette = palette;
        protoMessage.pixelValues = [];

        for (let pixel of values) {

            const x = pixel.x;
            const y = pixel.y ?? 0;
            const color = pixel.color ?? defaultColor;
            const paletteRef = palette.indexOf(pixel.color);

            protoMessage.pixelValues.push({ x, y, color, paletteRef });
        }

        return protoMessage;
    }

}

