import { SetPixelsMessage } from "../../../app/messages/SetPixelsMessage";
import { IotShirtMessageSerializer } from "../../../app/device-adapters/arduino/IotShirtMessageSerializer";
import { CarriageReturnMode, IndexMode, LedMatrixConfiguration, PixelValue } from "../../../app/types";

describe("IotShirtMessageSerializer", () => {

    let sut: IotShirtMessageSerializer;
    let config: LedMatrixConfiguration;

    beforeEach(() => {
        config = {
            width: 3,
            height: 3,
            indexFrom: IndexMode.TopRight,
            carriageReturnMode: CarriageReturnMode.Snaked
        };

        sut = new IotShirtMessageSerializer(config);
    });

    it("serialize, given a single pixel, outputs pixel number and colour concatinated", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("0#FFFFFF");
    });

    it("serialize, given a single pixel with only x coord, outputs pixel number and colour concatinated", async () => {
        const inputs: PixelValue[] = [
            { x: 0, color: "#FFFFFF" }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("0#FFFFFF");
    });

    it("serialize, given a single pixel with no color, color defaults to #FFFFFF", async () => {
        const inputs: PixelValue[] = [
            { x: 0 }
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const asBinary = sut.serialize(msg);
        const result = asBinary.toString();

        expect(result).toStrictEqual("0#FFFFFF");
    });

    it("serialize, given many pixels, uses CSV output", async () => {
        const inputs: PixelValue[] = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
        ];

        const msg = SetPixelsMessage.fromPixelValueCollection(inputs);
        const result = sut.serialize(msg);

        expect(result[0].toString()).toStrictEqual("0#FFFFFF");
        expect(result[1].toString()).toStrictEqual("1#FFFFFF");
    });

});


