import { ImageApi } from "../app/ImageApi";
import { IRemoteMatrixLedDriverConfiguration } from "../app/types";
import { TestDeviceAdapter } from "./TestDeviceAdapter";

describe("PixelApi", () => {

    let sut: ImageApi;
    let config: IRemoteMatrixLedDriverConfiguration;
    let adapter: TestDeviceAdapter;

    beforeEach(() => {
        adapter = new TestDeviceAdapter();
        config = {
            deviceAdapter: adapter,
            displayConfig: null
        };

        sut = new ImageApi(config);
    });

    it("pixel API, sends data structure to message transport for transmission with individual pixel colour values", async () => {
        //sut.set("../app/test.png");
        //expect(adapter.sendRequests.length).toBeGreaterThan(0);
    });

});


