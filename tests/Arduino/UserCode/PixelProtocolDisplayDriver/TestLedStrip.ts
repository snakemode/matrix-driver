import { Rgb } from "../../../../app";
import { ILedStrip } from "../../../../app/Adruino/System/LedMatrixSimulator/ILedStrip";

export class TestLedStrip implements ILedStrip {

    public totalPixelCount: number = 256;
    public setPixels: Map<number, Rgb>;

    constructor() {
        this.setPixels = new Map<number, Rgb>();
    }

    public setPixelColor(pixelNumber: number, r: number, g: number, b: number) {
        const rgb = { r, g, b };
        this.setPixels.set(pixelNumber, rgb);
    }

    public display() {
    }

}
