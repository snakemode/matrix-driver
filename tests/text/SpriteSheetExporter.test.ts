import { AsciiControlCodes } from "../../app/device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { DefaultSpriteSheet } from "../../app/text/DefaultSpriteSheet";
import { SpriteSheetExporter } from "../../app/text/SpriteSheetExporter";
import { TextEngine } from "../../app/text/TextEngine";
import { CarriageReturnMode, IndexMode, PixelDefinition } from "../../app/types";

// Remember to include the NODE version of JIMP, not the browser one.
// If this test fails, you're gonna need to switch the imports
// Signed, Previous You.

describe.skip("SpriteSheetExporter", () => {

    let sut: SpriteSheetExporter;
    let pixelDefinitions: PixelDefinition[];
    let config;
    let textEngine: TextEngine;

    beforeEach(() => {
        pixelDefinitions = [];
        config = {
            width: 32,
            height: 8,
            indexFrom: IndexMode.TopLeft,
            carriageReturnMode: CarriageReturnMode.Regular
        };
        textEngine = new TextEngine(config, "./app/text/a-z.png");
        sut = new SpriteSheetExporter(textEngine);
    });

    it("export, starts with the ascii code of the sprite", async () => {
        pixelDefinitions.push({ character: "a", index: 0, spriteSheetOffset: 0, width: 4 });

        const blob = [...await (await sut.export(pixelDefinitions)).spriteSheet];

        expect(blob[0]).toBe(97); // a in ascii
    });

    it("export, second byte is the width of the sprite", async () => {
        pixelDefinitions.push({ character: "a", index: 0, spriteSheetOffset: 0, width: 4 });

        const blob = [...await (await sut.export(pixelDefinitions)).spriteSheet];

        expect(blob[1]).toBe(4); // a in ascii
    });

    it("export, following bytes are the sprite data", async () => {
        pixelDefinitions.push({ character: "a", index: 0, spriteSheetOffset: 0, width: 4 });

        const blob = [...await (await sut.export(pixelDefinitions)).spriteSheet];

        const heightOfOneCharacter = 8;
        const expectedSpriteDataLength = pixelDefinitions[0].width * heightOfOneCharacter;
        const totalNumberOfHeaderBytes = 2;

        expect(blob.length).toBe(expectedSpriteDataLength + totalNumberOfHeaderBytes);
    });

    it("export, generate sprite data", async () => {
        const realSpriteData = new DefaultSpriteSheet();

        const blob = await sut.export(realSpriteData.definitions);
        const asNumbers = [...blob.spriteSheet];

        const cString = asNumbers.join(",");

        console.log([...blob.index]);
        console.log(cString);
    });


});