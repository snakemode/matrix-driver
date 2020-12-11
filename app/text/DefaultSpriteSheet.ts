import { AsciiControlCodes } from "../device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { ISpriteSheet, PixelDefinition } from "../types";

export class DefaultSpriteSheet implements ISpriteSheet {

    private _pixelDefinitions: PixelDefinition[];
    public get definitions(): PixelDefinition[] {
        return this._pixelDefinitions;
    }
    
    public get spriteCount() {
        return this._pixelDefinitions.length;
    }

    constructor() {
        this._pixelDefinitions = [];

        this.index("a", 4);
        this.index("b", 4);
        this.index("c", 4);
        this.index("d", 4);
        this.index("e", 4);
        this.index("f", 3);
        this.index("g", 4);
        this.index("h", 4);
        this.index("i", 1);
        this.index("j", 2);
        this.index("k", 4);
        this.index("l", 2);
        this.index("m", 5);
        this.index("n", 4);
        this.index("o", 4);
        this.index("p", 4);
        this.index("q", 4);
        this.index("r", 4);
        this.index("s", 4);
        this.index("t", 4);
        this.index("u", 4);
        this.index("v", 5);
        this.index("w", 5);
        this.index("x", 5);
        this.index("y", 4);
        this.index("z", 4);
        this.index("A", 4);
        this.index("B", 4);
        this.index("C", 4);
        this.index("D", 4);
        this.index("E", 4);
        this.index("F", 4);
        this.index("G", 4);
        this.index("H", 4);
        this.index("I", 3);
        this.index("J", 4);
        this.index("K", 4);
        this.index("L", 4);
        this.index("M", 5);
        this.index("N", 5);
        this.index("O", 4);
        this.index("P", 4);
        this.index("Q", 5);
        this.index("R", 4);
        this.index("S", 4);
        this.index("T", 5);
        this.index("U", 4);
        this.index("V", 5);
        this.index("W", 5);
        this.index("X", 5);
        this.index("Y", 5);
        this.index("Z", 4);
        this.index("!", 1);
        this.index("?", 4);
        this.index(",", 1);
        this.index(".", 1);
        this.index(":", 1);
        this.index(";", 1);
        this.index("*", 5);
        this.index("\"", 3);
        this.index("'", 1);
        this.index("0", 4);
        this.index("1", 3);
        this.index("2", 4);
        this.index("3", 4);
        this.index("4", 4);
        this.index("5", 4);
        this.index("6", 4);
        this.index("7", 4);
        this.index("8", 4);
        this.index("9", 4);
        this.index("£", 4);
        this.index("$", 5);
        this.index("(", 2);
        this.index(")", 2);
        this.index("|", 1);
        this.index("\\", 4);
        this.index("/", 4);
        this.index("+", 3);
        this.index("-", 3);
        this.index("#", 5);
        this.index("^", 3);
        this.index("=", 4);
        this.index("_", 4);
        this.index("á", 4);
        this.index("à", 4);
        this.index("é", 4);
        this.index("è", 4);
        this.index("ç", 4);
        this.index("ó", 4);
        this.index("ò", 4);
    }

    public clear() {
        this._pixelDefinitions = [];
    }

    public has(character: string): boolean {
        const char = character[0];
        const defs = this._pixelDefinitions.filter(pd => pd.character === char);
        return defs.length > 0;
    }

    public get(character: string): PixelDefinition {
        character = character[0];        
        return this._pixelDefinitions.filter(pd => pd.character === character)[0];
    }

    public index(char: string, width: number) {
        const lastChar = this._pixelDefinitions[this._pixelDefinitions.length - 1];
        const index = this._pixelDefinitions.length;
        const offset = lastChar ? lastChar.spriteSheetOffset + lastChar.width + 1 : 0;

        this._pixelDefinitions.push({
            character: char,
            index: index,
            width: width,
            spriteSheetOffset: offset
        });
    }
}

