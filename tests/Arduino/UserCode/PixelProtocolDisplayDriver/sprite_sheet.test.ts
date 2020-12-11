import { sprite_sheet } from "../../../../app";
import { SetTextMessageSerializer } from "../../../../app/device-adapters/arduino/pixelprotocol/SetTextMessageSerializer";
import { SetTextMessage } from "../../../../app/messages/SetTextMessage";

describe("sprite_sheet", () => {

    let serializer: SetTextMessageSerializer;

    beforeAll(() => {
        serializer = new SetTextMessageSerializer();
    });

    it("getTotalWidthOfText, single character, has correct width plus one space", async () => {
        const message = new SetTextMessage("a");
        const asBinary = [...serializer.serialize(message)];

        const result = sprite_sheet.getTotalWidthOfText(asBinary, asBinary.length);

        expect(result).toBe(5);
    });

    it("getTotalWidthOfText, multiple character, has correct width plus two spaces", async () => {
        const message = new SetTextMessage("aa");
        const asBinary = [...serializer.serialize(message)];

        const result = sprite_sheet.getTotalWidthOfText(asBinary, asBinary.length);

        expect(result).toBe(10);
    });

    it("getTotalWidthOfText, character with space, has correct spaces", async () => {
        const message = new SetTextMessage("a a");
        const asBinary = [...serializer.serialize(message)];

        const result = sprite_sheet.getTotalWidthOfText(asBinary, asBinary.length);

        expect(result).toBe(12);
    });

});