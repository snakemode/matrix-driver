import { AsciiControlCodes } from "../device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { IRemoteMatrixLedDriverConfiguration, PixelDefinition } from "../types";
import { TextEngine } from "./TextEngine";


export class SpriteSheetExporter {

    private _textEngine: TextEngine;

    constructor(textEngine: TextEngine) {
        this._textEngine = textEngine;
    }

    public async export(elements: PixelDefinition[]): Promise<BinarySpriteSheet> {

        const packedSpriteSheet = [];
        const index = new Map<string, number>();

        let characterIndex = 0;

        for (let value of elements) {

            index.set(value.character, characterIndex);

            const charCodeForThisValue = value.character.charCodeAt(0);

            packedSpriteSheet.push(charCodeForThisValue);
            packedSpriteSheet.push(value.width);
            
            characterIndex += 2;

            const spriteData = await this._textEngine.rasterize(value.character);

            for (let rowY of spriteData) {
                for (let x = 0; x < value.width; x++) {
                    const value = rowY[x] === " " ? 0 : 1;
                    packedSpriteSheet.push(value);
                    characterIndex++;
                }
            }

        }

        return {
            index: index,
            spriteSheet: new Uint8Array(packedSpriteSheet)
        };
    }
}

export interface BinarySpriteSheet {
    index: Map<string, number>;
    spriteSheet: Uint8Array;
}
