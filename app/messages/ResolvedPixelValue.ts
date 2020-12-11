import { Color } from "../types";

export interface ResolvedPixelValue {
    x: number;
    y: number;
    color: Color;
    paletteRef: number;
}
