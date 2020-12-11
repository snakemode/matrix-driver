import { Adafruit_NeoPixel } from "../../System/ArduinoLibraryClones/Adafruit_NeoPixel";
import { IArduinoProgram } from "../../System/Simulator/IArduinoProgram";
import "../../System/Simulator/ArduinoGlobals";

export class Program implements IArduinoProgram {

    private strip: Adafruit_NeoPixel;

    constructor() {
        this.strip = new Adafruit_NeoPixel(256, 4, 800);
    }

    async setup(): Promise<void> {
        this.strip.begin();
    }

    async loop(): Promise<void> {
        const numPixels = 60;
        const red = 128;
        const blue = 128;
        const green = 0;

        for (let i = 0; i < numPixels; i++) {
            this.strip.setPixelColor(i, red, i * 4, blue);
        }

        console.log("loopig");
    }
}
