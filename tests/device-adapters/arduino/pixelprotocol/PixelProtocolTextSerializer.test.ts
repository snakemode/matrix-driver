import { PixelProtocolSerializer } from "../../../../app/device-adapters/arduino/pixelprotocol/PixelProtocolSerializer";
import { PixelProtocolTextSerializer } from "../../../../app/device-adapters/arduino/pixelprotocol/PixelProtocolTextSerializer";
import { SetPixelsMessage } from "../../../../app/messages/SetPixelsMessage";
import { PixelValue } from "../../../../app/types";

describe("PixelProtocolTextSerializer", () => {

    let sut: PixelProtocolTextSerializer;

    beforeEach(() => {
        sut = new PixelProtocolTextSerializer();
    });

    it("serialize, given a single pixel, outputs pixel number and colour concatinated", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("P:0-0#FFFFFF");
    });

    it("serialize, given many pixels, uses many messages", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("P:0-0#FFFFFF,1-0#FFFFFF");
    });

    it("serialize, given a single pixel with only x coord, outputs pixel number and colour concatinated", async () => {
        const inputs: PixelValue[] = [
            { x: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("P:0-0#FFFFFF");
    });

    it("serialize, given a single pixel with no color, color defaults to #FFFFFF", async () => {
        const inputs: PixelValue[] = [
            { x: 0 }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("P:0-0#FFFFFF");
    });


    it("serialize, given a single pixel, outputs pixel number and colour concatinated", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
            { x: 2, y: 0, color: "#FFFFFF" },

            { x: 0, y: 1, color: "#FFFFFF" },
            { x: 1, y: 1, color: "#FFFFFF" },
            { x: 2, y: 1, color: "#FFFFFF" },

            { x: 0, y: 2, color: "#FFFFFF" },
            { x: 1, y: 2, color: "#FFFFFF" },
            { x: 2, y: 2, color: "#FFFFFF" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result.startsWith("P:0-0#FFFFFF")).toBeTruthy();
    });
});
