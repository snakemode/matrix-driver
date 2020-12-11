import { LedMatrixConfiguration, PixelDefinition } from '../types';
import { DefaultSpriteSheet } from './DefaultSpriteSheet';
// import Jimp from 'jimp';
import Jimp from 'jimp/browser/lib/jimp'; // For browser support.

export class TextEngine {

    private _spritePath: string | Buffer;
    private _spriteSheet: any;
    private _ready: boolean;
    private _defaultSpriteSheet: DefaultSpriteSheet;
    private _ledConfig: LedMatrixConfiguration;
    private _characterGenerator: ILetterGenerator;

    constructor(ledConfig: LedMatrixConfiguration, spritePath: string | Buffer = "./text/a-z.png") {
        this._ready = false;
        this._spritePath = spritePath;
        this._defaultSpriteSheet = new DefaultSpriteSheet();
        this._ledConfig = ledConfig;

        this._characterGenerator = new CachingLetterGenerator(new JimpLetterGenerator());
    }

    public async loadSprites() {
        try {
            this._spriteSheet = await Jimp.read(this._spritePath as any);
            this._ready = true;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    public async rasterize(input: string): Promise<string[]> {
        await this.ensureReady();
 
        input = input ?? "";

        const result = new Array(this._ledConfig.height);
        for (let y = 0; y < this._ledConfig.height; y++) {
            result[y] = "";
        }

        const letters = input.split('');
        for (let character of letters) {

            let charPixels: string[];

            if (this._defaultSpriteSheet.has(character[0])) {
                const pixelDefinition = this._defaultSpriteSheet.get(character[0]);
                charPixels = this.pixelsFromSpritesheet(pixelDefinition);
            } else {
                charPixels = await this.generateUnspritedCharacter(character[0]);
            }

            for (let index in result) {
                result[index] += (charPixels[index] + " ");
            }
        }

        return result;
    }

    private pixelsFromSpritesheet(pixelDef: PixelDefinition): string[] {
        const spriteWidth = pixelDef.width;
        const letterOffset = pixelDef.spriteSheetOffset;

        return this.pixelsFromImage(this._spriteSheet, spriteWidth, letterOffset, (rgba: Rgba) => {
            return rgba.r <= 100;
        });
    }

    private async generateUnspritedCharacter(input: string): Promise<string[]> {

        if (input[0] === " ") {
            const result = new Array(this._ledConfig.height);
            result.fill(" ");
            return result;
        }

        const image = await this._characterGenerator.tryGenerateCharacter(input, this._ledConfig.height); 

        return this.pixelsFromImage(image, 6, 0, (rgba: Rgba) => {
            return rgba.a >= 20;
        });
    }

    private pixelsFromImage(image: any, spriteWidth: number, spriteOffset: number, predicate: CallableFunction) {
        const result = [];

        for (let y = 0; y < 12; y++) {

            let line = "";

            for (let pixelX = 0; pixelX < spriteWidth; pixelX++) {
                const x = spriteOffset + pixelX;
                const pixelValue = image.getPixelColor(x, y);
                const rgba = Jimp.intToRGBA(pixelValue);

                line += predicate(rgba) ? "█" : " ";
            }

            result.push(line);
        }
        return result;
    }

    private async ensureReady() {
        if (!this._ready) {
            await this.loadSprites();
        }
    }
}


interface ILetterGenerator {
    tryGenerateCharacter(input: string, maxHeight: number): Promise<Jimp>;
}

class CachingLetterGenerator implements ILetterGenerator {

    private _inner: JimpLetterGenerator;
    private _cache: Map<string, Jimp>;

    constructor(inner: JimpLetterGenerator) {
        this._inner = inner;
        this._cache = new Map<string, Jimp>();
    }

    async tryGenerateCharacter(input: string, maxHeight: number): Promise<Jimp> {
        if (!this._cache.has(input)) {
            const generated = await this._inner.tryGenerateCharacter(input, maxHeight);
            this._cache.set(input, generated);
        }

        return this._cache.get(input);
    }
}

class JimpLetterGenerator implements ILetterGenerator {

    public async tryGenerateCharacter(input: string, maxHeight: number): Promise<Jimp> {

        try {
            const image = new Jimp(30, maxHeight);
            const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
            await image.print(font, 0, 0, input);

            console.log("Generated dynamically", input);

            return image;
        } catch (ex) {
            console.log("Failed to generate character", input, ex);
        }
    }
}


type Rgba = { r: number, b: number; g: number, a: number };