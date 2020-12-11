import { ColorConverter } from "../ColorConverter";
import { Color, Rgb } from "../types";

export class SetTextMessage {
    public value: string;
    public mode: TextMode;
    public scrollSpeedMs: number;
    public color: Rgb;
    
    constructor(value: string, mode: TextMode = TextMode.stationary, scrollSpeedMs: number = 25, color: Color = "#FFFFFF") {
        this.value = value ?? " ";
        this.mode = mode;
        this.scrollSpeedMs = scrollSpeedMs;
        this.color = ColorConverter.forceRgb(color);

        if (scrollSpeedMs > 254) {
            throw new Error("You really don't want this to scroll this slow. Also, our binary format can't deal with your big numbers ;)");
        }
    }
}

export enum TextMode {
    stationary,
    scrollFromRight
}

