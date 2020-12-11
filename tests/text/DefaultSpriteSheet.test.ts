import { AsciiControlCodes } from "../../app/device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { DefaultSpriteSheet } from "../../app/text/DefaultSpriteSheet";
import { SpriteSheetExporter } from "../../app/text/SpriteSheetExporter";
import { PixelDefinition } from "../../app/types";

describe("DefaultSpriteSheet", () => {

    const sut = new DefaultSpriteSheet();

    it("has, letter is a-z, returns true", async () => {
        for (let letter of "abcdefghijklmnopqrstuvwxyz") {
            const result = sut.has(letter);

            expect(result).toBe(true);
        }
    });

    it("has, letter is A-Z, returns true", async () => {
        for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
            const result = sut.has(letter);

            expect(result).toBe(true);
        }
    });

    it("get, letter is recognised, returns pixel definition with a width", async () => {
        const def = sut.get("a");

        expect(def.width).toBe(4);
    });

    it("get, letter is recognised, returns pixel definition with letter", async () => {
        const def = sut.get("a");

        expect(def.character).toBe("a");
    });

    it("get, letter is recognised, returns pixel definition sprite sheet offset", async () => {
        const def = sut.get("a");

        expect(def.spriteSheetOffset).toBe(0);
    });

    it("get, letter is recognised, returns pixel definition sprite sheet offset2", async () => {
        const def = sut.get("b");

        expect(def.spriteSheetOffset).toBe(5);
    });
});
