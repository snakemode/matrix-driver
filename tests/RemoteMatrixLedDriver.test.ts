import { RemoteMatrixLedDriver } from "../app/RemoteMatrixLedDriver";
import { IRemoteMatrixLedDriverConfiguration } from "../app/types";
import { TestDeviceAdapter } from "./TestDeviceAdapter";

describe("RemoteMatrixLedDriver", () => {

    let sut: RemoteMatrixLedDriver;
    let config: IRemoteMatrixLedDriverConfiguration;

    beforeEach(() => {
        config = {
            displayConfig: {
                width: 10,
                height: 10
            },
            deviceAdapter: new TestDeviceAdapter()
        };
        sut = new RemoteMatrixLedDriver(config);
    });

    it("constructed, pixel api is available", async () => {
        expect(sut.pixel).toBeDefined();
    });

    it("constructed, text api is available", async () => {
        expect(sut.text).toBeDefined();
    });

    it("constructed, image api is available", async () => {
        expect(sut.image).toBeDefined();
    });

});