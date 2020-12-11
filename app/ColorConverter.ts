import { Color, isRgb, Rgb } from "./types";

export class ColorConverter {

    public static forceRgb(color: Color): Rgb {
        if (isRgb(color)) {
            return color;
        }

        return this.hexToRgb(color);
    }

    public static forceHex(color: Color): string {
        if (!isRgb(color)) {
            return color;
        }

        return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
    }

    private static hexToRgb(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
