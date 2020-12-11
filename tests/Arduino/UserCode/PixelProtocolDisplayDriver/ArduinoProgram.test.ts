import { Adafruit_NeoPixel, ArduinoSimulator, mqtt_connection, PixelProtocolSerializer, PixelValue } from "../../../../app";
import { Program } from "../../../../app/Adruino/UserCode/PixelProtocolDisplayDriver/ArduinoProgram";
import { ValidProtocolMessage } from "../../../../app/device-adapters/arduino/pixelprotocol/ValidProtocolMessage";
import { ControlMessage } from "../../../../app/messages/ControlMessage";
import { SetPixelsMessage } from "../../../../app/messages/SetPixelsMessage";
import { SetTextMessage, TextMode } from "../../../../app/messages/SetTextMessage";
import { TestLedStrip } from "./TestLedStrip";

describe("Arduino Program ported to JavaScript", () => {

    let sut: Program;
    let sim: ArduinoSimulator;
    let fakeLedStrip: TestLedStrip;

    beforeEach(() => {
        sut = new Program();
        sim = new ArduinoSimulator(sut);
        fakeLedStrip = new TestLedStrip();
        Adafruit_NeoPixel.setLedStrip(fakeLedStrip);
    });

    it("execute, Serialized SetPixelMessage received with a single pixel, lights up appropraite pixel on hardware", async () => {
        const pixels = SetPixelsMessage.fromPixelValueCollection([
            { x: 0, y: 0, color: "#FFFFFF" }
        ]);

        await receiveAndProcessMessage(sim, pixels);

        expect(fakeLedStrip.setPixels.get(0)).toStrictEqual({ r: 255, b: 255, g: 255 });
    });

    it("execute, Serialized SetPixelMessage received with multiple pixels, lights up appropraite pixel on hardware", async () => {
        const pixels = SetPixelsMessage.fromPixelValueCollection([
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
        ]);

        await receiveAndProcessMessage(sim, pixels);

        expect(fakeLedStrip.setPixels.get(0)).toStrictEqual({ r: 255, b: 255, g: 255 });
        expect(fakeLedStrip.setPixels.get(1)).toStrictEqual({ r: 255, b: 255, g: 255 });
    });

    it("execute, Serialized SetPixelMessage received with multiple pixels of different colours, lights up appropraite pixel on hardware", async () => {
        const pixels = SetPixelsMessage.fromPixelValueCollection([
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFF00" },
        ]);

        await receiveAndProcessMessage(sim, pixels);

        expect(fakeLedStrip.setPixels.get(0)).toStrictEqual({ r: 255, b: 255, g: 255 });
        expect(fakeLedStrip.setPixels.get(1)).toStrictEqual({ r: 255, b: 0, g: 255 });
    });

    it("execute, Serialized ControlMessage.clear received, all pixels cleared", async () => {
        await lightUpPixels(sim, [{ x: 0, y: 0, color: "#FFFFFF" }]);
        expect(fakeLedStrip.setPixels.get(0)).toStrictEqual({ r: 255, b: 255, g: 255 });

        await receiveAndProcessMessage(sim, ControlMessage.clear());

        expect(fakeLedStrip.setPixels.get(0)).toStrictEqual({ r: 0, b: 0, g: 0 });
    });

    it("execute, Serialized SetTextMessage received with a single pixel, lights up appropraite pixel on hardware", async () => {
        const text = new SetTextMessage(".");

        await receiveAndProcessMessage(sim, text);

        expect(fakeLedStrip.setPixels.get(192)).toStrictEqual({ r: 255, b: 255, g: 255 });
    });
});


async function lightUpPixels(sim: ArduinoSimulator, p: PixelValue[]) {
    const pixels = SetPixelsMessage.fromPixelValueCollection(p);
    await receiveAndProcessMessage(sim, pixels);
}

async function receiveAndProcessMessage(sim: ArduinoSimulator, message: ValidProtocolMessage) {
    const bytes = new PixelProtocolSerializer().serialize(message);
    mqtt_connection.simulateRecievedMessage(bytes);
    await sim.execute(1);
}