import { ControlMessage, ControlMessageType } from "../app/messages/ControlMessage";
import { PixelApi } from "../app/PixelApi";
import { IRemoteMatrixLedDriverConfiguration } from "../app/types";
import { TestDeviceAdapter } from "./TestDeviceAdapter";

describe("PixelApi", () => {

    let sut: PixelApi;
    let config: IRemoteMatrixLedDriverConfiguration;
    let adapter: TestDeviceAdapter;

    beforeEach(() => {
        adapter = new TestDeviceAdapter();
        config = {
            deviceAdapter: adapter,
            displayConfig: null
        };

        sut = new PixelApi(config);
    });

    it("pixel API, sends data structure to message transport for transmission with individual pixel colour values", async () => {
        sut.set({ x: 0, y: 0, color: "#FFFFFF" });

        expect(adapter.sendRequests[0].pixelValues[0]).toEqual({ x: 0, y: 0, color: "#FFFFFF", paletteRef: 0 });
    });

    it("pixel API, sends data to message transport for multiple pixel values", async () => {
        const pixels = [
            { x: 0, y: 0, color: "#FFFFFF" },
            { x: 1, y: 0, color: "#FFFFFF" },
        ];

        sut.set(pixels);

        expect(adapter.sendRequests[0].pixelValues[0]).toEqual({ x: 0, y: 0, color: "#FFFFFF", paletteRef: 0 });
        expect(adapter.sendRequests[0].pixelValues[1]).toEqual({ x: 1, y: 0, color: "#FFFFFF", paletteRef: 0 });
    });

    it("clear, sends control message set to clear down device adapter", () => {
        sut.clear();

        expect(<ControlMessage>adapter.sendRequests[0].type).toBe(ControlMessageType.clear)
    });

});


