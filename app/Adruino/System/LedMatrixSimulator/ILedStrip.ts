
export interface ILedStrip {
    readonly totalPixelCount: number;
    setPixelColor(pixelNumber: number, r: number, g: number, b: number);
    display();
}
