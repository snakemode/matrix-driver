import { PixelProtocolSerializer } from "../../../../app/device-adapters/arduino/pixelprotocol/PixelProtocolSerializer";
import { AsciiControlCodes } from "../../../../app/device-adapters/arduino/pixelprotocol/AsciiControlCodes";
import { SetPixelsMessage } from "../../../../app/messages/SetPixelsMessage";
import { PixelValue } from "../../../../app/types";

describe("SetPixelSerializer", () => {

    let sut: PixelProtocolSerializer;

    beforeEach(() => {
        sut = new PixelProtocolSerializer();
    });

    it("serialize, given a single pixel, 'device control 1' code output as first byte, and an ASCII P for the second", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[0]).toStrictEqual(AsciiControlCodes.DeviceControl1);
        expect(result[1]).toStrictEqual(AsciiControlCodes.P_PixelMode);
    });

    it("serialize, given a single pixel, second byte is a start of heading marker, followed by 3 r g b values", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[2]).toStrictEqual(AsciiControlCodes.STX_StartOfText);
        expect(result[3]).toStrictEqual(255);
        expect(result[4]).toStrictEqual(255);
        expect(result[5]).toStrictEqual(255);
    });


    it("serialize, given a single pixel, pixel values follow color block", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 1, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[6]).toStrictEqual(0);
        expect(result[7]).toStrictEqual(1);
    });

    it("serialize, given a single pixel, pixel values stop with end of transmission marker", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 1, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[8]).toStrictEqual(AsciiControlCodes.ETX_EndOfText);
    });

    it("serialize, given a single pixel, message ends with end of transmission marker", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 1, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[9]).toStrictEqual(AsciiControlCodes.EOT_EndOfTransmission);
    });

    it("serialize, given many pixels with same color, groups into a transmission block using 0x1E Record Separators", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect([...result]).toStrictEqual([0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x1E, 1, 0, 0x03, 0x04]);
    });

    it("serialize, given many pixels with different color, splits into color transmission blocks", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFF00" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[8]).toStrictEqual(AsciiControlCodes.ETB_EndOfBlock);
        expect([...result]).toStrictEqual([0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x17, 0x02, 255, 255, 0, 1, 0, 0x03, 0x04]);
    });

    it("serialize, given many pixels with different color, second transmission block starts with control code and color", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFF00" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[9]).toStrictEqual(AsciiControlCodes.STX_StartOfText);
        expect(result[10]).toStrictEqual(255);
        expect(result[11]).toStrictEqual(255);
        expect(result[12]).toStrictEqual(0);
        expect([...result]).toStrictEqual([0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x17, 0x02, 255, 255, 0, 1, 0, 0x03, 0x04]);
    });

    it("serialize, given a single pixel with only x coord, defaults y coord to 0", async () => {
        const inputs: PixelValue[] = [
            { x: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect([...result]).toStrictEqual([0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x03, 0x04]);
    });

    it("serialize, given a single pixel with no color, color defaults to #FFFFFF", async () => {
        const inputs: PixelValue[] = [
            { x: 0 }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect([...result]).toStrictEqual([0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x03, 0x04]);
    });

});


