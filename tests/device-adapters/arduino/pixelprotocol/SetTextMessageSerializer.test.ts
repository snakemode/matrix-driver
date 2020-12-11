import { PixelProtocolSerializer } from "../../../../app";
import { AsciiControlCodes } from "../../../../app/device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { SetTextMessage, TextMode } from "../../../../app/messages/SetTextMessage";

describe("ControlMessageSerializer", () => {

    let sut: PixelProtocolSerializer;

    beforeEach(() => {
        sut = new PixelProtocolSerializer();
    });

    it("serialize, a SetTextMessage, 'device control 1' code output as first byte, and an ASCII C for the second", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[0]).toStrictEqual(AsciiControlCodes.DeviceControl1);
        expect(result[1]).toStrictEqual(AsciiControlCodes.T_TextMode);
    });

    it("serialize, a SetTextMessage, third byte is text mode, defaulting to stationary", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[2]).toStrictEqual(TextMode.stationary);
    });

    it("serialize, a SetTextMessage in scroll mode, third byte is delay milliseconds", async () => {
        const input = new SetTextMessage("A", TextMode.scrollFromRight, 150);

        const result = sut.serialize(input);

        expect(result[3]).toStrictEqual(150);
    });

    it("serialize, a SetTextMessage, third byte is start of text marker", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[7]).toStrictEqual(AsciiControlCodes.STX_StartOfText);
    });

    it("serialize, a SetTextMessage, following header, text is found", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[8]).toStrictEqual(65);
    });


    it("serialize, a SetTextMessage with default colour, colour is fourth, fifth, and sixth byte", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[4]).toStrictEqual(255);
        expect(result[5]).toStrictEqual(255);
        expect(result[6]).toStrictEqual(255);
    });

    it("serialize, a SetTextMessage, message ends with end of text and end of transmission", async () => {
        const input = new SetTextMessage("A");

        const result = sut.serialize(input);

        expect(result[9]).toStrictEqual(AsciiControlCodes.ETX_EndOfText);
        expect(result[10]).toStrictEqual(AsciiControlCodes.EOT_EndOfTransmission);
    });

});


