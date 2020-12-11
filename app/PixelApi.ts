import { SetPixelsMessage } from "./messages/SetPixelsMessage";
import { ControlMessage, ControlMessageType } from "./messages/ControlMessage";
import { IRemoteMatrixLedDriverConfiguration, PixelValue, Rgb } from "./types";
import { PixelMap } from "./PixelMap";

export class PixelApi {
    private _config: IRemoteMatrixLedDriverConfiguration;

    constructor(configuration: IRemoteMatrixLedDriverConfiguration) {
        this._config = configuration;
    }

    public async clear() {
        const clearMessage = ControlMessage.clear();
        this._config.deviceAdapter.sendControlMessage(clearMessage);
    }

    public async set(locations: PixelValue | PixelValue[]) {
        const asArray = Array.isArray(locations) ? locations : [locations];
        const asMessage = SetPixelsMessage.fromPixelValueCollection(asArray);
        this._config.deviceAdapter.sendPixels(asMessage);
    }

    public async setAll(pixelMap: string[], color: Rgb | string, clearEmpty: boolean = false) {
        const coords = [];
        const removeCoords = [];

        for (let item of PixelMap.itemsIn(pixelMap)) {
            if (item.data !== " ") {
                coords.push({ ...item, color });
            }

            if (clearEmpty && item.data === " ") {
                removeCoords.push({ ...item, color: "#000000" });
            }
        }

        const allPixels = [...coords, ...removeCoords];
        await this.set(allPixels);
    }

}


