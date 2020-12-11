import { PixelProtocolSerializer } from "../../../../app/device-adapters/arduino/pixelprotocol/PixelProtocolSerializer";
import { AsciiControlCodes } from "../../../../app/device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { ControlMessage, ControlMessageType } from "../../../../app/messages/ControlMessage";

describe("ControlMessageSerializer", () => {

    let sut: PixelProtocolSerializer;

    beforeEach(() => {
        sut = new PixelProtocolSerializer();
    });

    it("serialize, a control message, 'device control 1' code output as first byte, and an ASCII C for the second", async () => {
        const input = ControlMessage.clear();

        const result = sut.serialize(input);

        expect(result[0]).toStrictEqual(AsciiControlCodes.DeviceControl1);
        expect(result[1]).toStrictEqual(AsciiControlCodes.C_ControlMessage);
    });

    it("serialize, a control message, third byte is start of text marker", async () => {
        const input = ControlMessage.clear();

        const result = sut.serialize(input);

        expect(result[2]).toStrictEqual(AsciiControlCodes.STX_StartOfText);
    });

    it("serialize, a control message, fourth byte is control code", async () => {
        const input = ControlMessage.clear();

        const result = sut.serialize(input);

        expect(result[3]).toStrictEqual(ControlMessageType.clear);
    });

    it("serialize, a control message, message ends with end of text and end of transmission", async () => {
        const input = ControlMessage.clear();

        const result = sut.serialize(input);

        expect(result[4]).toStrictEqual(AsciiControlCodes.ETX_EndOfText);
        expect(result[5]).toStrictEqual(AsciiControlCodes.EOT_EndOfTransmission);
    });

});


