import { ILedStrip } from "../LedMatrixSimulator/ILedStrip";
import { VirtualMatrix } from "../LedMatrixSimulator/VirtualMatrix";
import { delay } from "../Simulator/ArduinoGlobals";

type Rgb = { r: number, g: number, b: number };
interface BackbufferItem extends Rgb {
    pixelNumber: number;
}

export class Adafruit_NeoPixel {
    private static strip: ILedStrip;
    private _numberOfLights: number;
    private _backBuffer: BackbufferItem[] = [];


    constructor(numberOfLights: number = 0, gpioPin?: number, someFormatInformation?: any /* NEO_GRB + NEO_KHZ800 */) {
        this._numberOfLights = numberOfLights;
    }


    public setPixelColor(pixelNumber: number, r: number | Rgb, g?: number, b?: number) {
        if (typeof g === "undefined" && typeof b === "undefined") {
            const rInt = r as number;
            const _b = rInt & 255
            const _g = (rInt >> 8) & 255
            const _r = (rInt >> 16) & 255

            this._backBuffer.push({ pixelNumber, r: _r, g: _g, b: _b });
        } else {
            this._backBuffer.push({ pixelNumber, r: r as number, g, b });
        }
    }

    public begin() {
        Adafruit_NeoPixel.strip?.display();
    }

    public async show() {
        for (let i of this._backBuffer) {
            Adafruit_NeoPixel.strip?.setPixelColor(i.pixelNumber, i.r, i.g, i.b);
        }
        this._backBuffer = [];
        await delay(2);
    }

    public clear() {
        // ??? 
    }
     
    public setPin(arg0: any) {
    }

    public updateType(arg0: any) {
    }

    public updateLength(NUM_LIGHTS: number) {
        this._numberOfLights = NUM_LIGHTS;
    }

    public setBrightness(arg0: number) {
        //throw new Error("Method not implemented.");
    }

    public fill(c = 0, first = 0, count = 0) {
        for (let i = 0; i < Adafruit_NeoPixel.strip.totalPixelCount; i++) {
            this.setPixelColor(i, c);
        }
    }

    public numPixels() {
        return this._numberOfLights
    }

    public ColorHSV(hue: number, sat?: number, val?: number): any {
        let r, g, b;

        // Remap 0-65535 to 0-1529. Pure red is CENTERED on the 64K rollover;
        // 0 is not the start of pure red, but the midpoint...a few values above
        // zero and a few below 65536 all yield pure red (similarly, 32768 is the
        // midpoint, not start, of pure cyan). The 8-bit RGB hexcone (256 values
        // each for red, green, blue) really only allows for 1530 distinct hues
        // (not 1536, more on that below), but the full unsigned 16-bit type was
        // chosen for hue so that one's code can easily handle a contiguous color
        // wheel by allowing hue to roll over in either direction.
        hue = (hue * 1530 + 32768) / 65536;
        // Because red is centered on the rollover point (the +32768 above,
        // essentially a fixed-point +0.5), the above actually yields 0 to 1530,
        // where 0 and 1530 would yield the same thing. Rather than apply a
        // costly modulo operator, 1530 is handled as a special case below.

        // So you'd think that the color "hexcone" (the thing that ramps from
        // pure red, to pure yellow, to pure green and so forth back to red,
        // yielding six slices), and with each color component having 256
        // possible values (0-255), might have 1536 possible items (6*256),
        // but in reality there's 1530. This is because the last element in
        // each 256-element slice is equal to the first element of the next
        // slice, and keeping those in there this would create small
        // discontinuities in the color wheel. So the last element of each
        // slice is dropped...we regard only elements 0-254, with item 255
        // being picked up as element 0 of the next slice. Like this:
        // Red to not-quite-pure-yellow is:        255,   0, 0 to 255, 254,   0
        // Pure yellow to not-quite-pure-green is: 255, 255, 0 to   1, 255,   0
        // Pure green to not-quite-pure-cyan is:     0, 255, 0 to   0, 255, 254
        // and so forth. Hence, 1530 distinct hues (0 to 1529), and hence why
        // the constants below are not the multiples of 256 you might expect.

        // Convert hue to R,G,B (nested ifs faster than divide+mod+switch):
        if (hue < 510) {         // Red to Green-1
            b = 0;
            if (hue < 255) {       //   Red to Yellow-1
                r = 255;
                g = hue;            //     g = 0 to 254
            } else {              //   Yellow to Green-1
                r = 510 - hue;      //     r = 255 to 1
                g = 255;
            }
        } else if (hue < 1020) { // Green to Blue-1
            r = 0;
            if (hue < 765) {      //   Green to Cyan-1
                g = 255;
                b = hue - 510;      //     b = 0 to 254
            } else {              //   Cyan to Blue-1
                g = 1020 - hue;     //     g = 255 to 1
                b = 255;
            }
        } else if (hue < 1530) { // Blue to Red-1
            g = 0;
            if (hue < 1275) {      //   Blue to Magenta-1
                r = hue - 1020;     //     r = 0 to 254
                b = 255;
            } else {              //   Magenta to Red-1
                r = 255;
                b = 1530 - hue;     //     b = 255 to 1
            }
        } else {                // Last 0.5 Red (quicker than % operator)
            r = 255;
            g = b = 0;
        }

        // Apply saturation and value to R,G,B, pack into 32-bit result:
        const v1 = 1 + val; // 1 to 256; allows >>8 instead of /255
        const s1 = 1 + sat; // 1 to 256; same reason
        const s2 = 255 - sat; // 255 to 0
        return ((((((r * s1) >> 8) + s2) * v1) & 0xff00) << 8) |
            (((((g * s1) >> 8) + s2) * v1) & 0xff00) |
            (((((b * s1) >> 8) + s2) * v1) >> 8);
    }

    public gamma32(arg0: any): number | Rgb {
        return arg0;
    }

    public gamma8(j: number): any {
        const _NeoPixelGammaTable: number[] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
            3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7,
            7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12,
            13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20,
            20, 21, 21, 22, 22, 23, 24, 24, 25, 25, 26, 27, 27, 28, 29, 29,
            30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 38, 38, 39, 40, 41, 42,
            42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 75,
            76, 77, 78, 80, 81, 82, 84, 85, 86, 88, 89, 90, 92, 93, 94, 96,
            97, 99, 100, 102, 103, 105, 106, 108, 109, 111, 112, 114, 115, 117, 119, 120,
            122, 124, 125, 127, 129, 130, 132, 134, 136, 137, 139, 141, 143, 145, 146, 148,
            150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180,
            182, 184, 186, 188, 191, 193, 195, 197, 199, 202, 204, 206, 209, 211, 213, 215,
            218, 220, 223, 225, 227, 230, 232, 235, 237, 240, 242, 245, 247, 250, 252, 255];

        return _NeoPixelGammaTable[j];
    }

    public static setLedStrip(matrix: ILedStrip) {
        Adafruit_NeoPixel.strip = matrix;
    }

    public Color(r, g, b, w?) {
        return Adafruit_NeoPixel.Color(r, g, b, w);
    }

    public static Color(r, g, b, w?) {
        if (!w) {
            return (r << 16) | (g << 8) | b;
        }

        return (w << 24) | (r << 16) | (g << 8) | b;
    }
}


export const NEO_RGB = ((0 << 6) | (0 << 4) | (1 << 2) | (2)) ///< Transmit as R,G,B
export const NEO_RBG = ((0 << 6) | (0 << 4) | (2 << 2) | (1)) ///< Transmit as R,B,G
export const NEO_GRB = ((1 << 6) | (1 << 4) | (0 << 2) | (2)) ///< Transmit as G,R,B
export const NEO_GBR = ((2 << 6) | (2 << 4) | (0 << 2) | (1)) ///< Transmit as G,B,R
export const NEO_BRG = ((1 << 6) | (1 << 4) | (2 << 2) | (0)) ///< Transmit as B,R,G
export const NEO_BGR = ((2 << 6) | (2 << 4) | (1 << 2) | (0)) ///< Transmit as B,G,R

export const NEO_KHZ800 = 0x0000;