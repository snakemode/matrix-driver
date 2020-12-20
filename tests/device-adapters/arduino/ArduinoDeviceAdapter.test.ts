import { CarriageReturnMode, IndexMode, LedMatrixConfiguration } from "../../../app";
import { ArduinoDeviceAdapter } from "../../../app/device-adapters/arduino/ArduinoDeviceAdapter";
import { IPixelProtocolSerializer } from "../../../app/device-adapters/arduino/pixelprotocol/IPixelProtocolSerializer";
import { ValidProtocolMessage } from "../../../app/device-adapters/arduino/pixelprotocol/ValidProtocolMessage";
import { ControlMessage } from "../../../app/messages/ControlMessage";
import { SetPixelsMessage } from "../../../app/messages/SetPixelsMessage";
import { SetTextMessage } from "../../../app/messages/SetTextMessage";
import { TestMessageTransport } from "../../TestMessageTransport";

describe("IotShirtMessageSerializer", () => {

    let sut: ArduinoDeviceAdapter;
    let transport: TestMessageTransport;
    let serializer: IPixelProtocolSerializer<ValidProtocolMessage>;

    beforeEach(() => {
        transport = new TestMessageTransport();
        serializer = {
            serialize: (_): Uint8Array => {
                return new Uint8Array([1, 2, 3]);
            },
            deserialize: (_) => { return null; }
        };

        sut = new ArduinoDeviceAdapter(transport, serializer);
    });

    it("sendPixels, given valid message, sends result of serializer down transport", () => {
        const message = new SetPixelsMessage();

        sut.sendPixels(message);

        expect(transport.sendRequests[0]).toStrictEqual(new Uint8Array([1, 2, 3]))
    });

    it("sendText, given valid message, sends result of serializer down transport", () => {
        const message = new SetTextMessage("some text");

        sut.sendText(message);

        expect(transport.sendRequests[0]).toStrictEqual(new Uint8Array([1, 2, 3]))
    });

    it("sendControlMessage, given valid message, sends result of serializer down transport", () => {
        const message = ControlMessage.clear();

        sut.sendControlMessage(message);

        expect(transport.sendRequests[0]).toStrictEqual(new Uint8Array([1, 2, 3]))
    });
});